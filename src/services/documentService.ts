import { storage } from '../lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { applicationService } from './applicationService';
import { n8nService } from './n8nService';

export interface DocumentMetadata {
    id: string;
    name: string;
    displayName: string;
    type: string;
    size: number;
    uploadedAt: string;
    downloadURL: string;
    status: 'uploaded' | 'verified' | 'rejected';
}

export const documentService = {
    /**
     * Upload a document to Firebase Storage
     * Returns a promise with upload progress callback
     */
    async uploadDocument(
        userId: string,
        file: File,
        documentType: 'id' | 'income' | 'bankStatement',
        onProgress?: (progress: number) => void
    ): Promise<DocumentMetadata> {
        return new Promise((resolve, reject) => {
            try {
                // Create a unique filename
                const timestamp = Date.now();
                const filename = `${documentType}_${timestamp}_${file.name}`;
                const storagePath = `documents/${userId}/${filename}`;

                // Create storage reference
                const storageRef = ref(storage, storagePath);

                // Start upload
                const uploadTask = uploadBytesResumable(storageRef, file, {
                    contentType: file.type,
                });

                // Monitor upload progress
                uploadTask.on(
                    'state_changed',
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        if (onProgress) {
                            onProgress(progress);
                        }
                    },
                    (error) => {
                        console.error('Upload error:', error);
                        reject(error);
                    },
                    async () => {
                        // Upload completed successfully
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                        const metadata: DocumentMetadata = {
                            id: timestamp.toString(),
                            name: filename,
                            displayName: file.name,
                            type: documentType,
                            size: file.size,
                            uploadedAt: new Date().toISOString(),
                            downloadURL,
                            status: 'uploaded',
                        };

                        // Save metadata to Firestore
                        await this.saveDocumentMetadata(userId, metadata);

                        resolve(metadata);
                    }
                );
            } catch (error) {
                reject(error);
            }
        });
    },

    /**
     * Save document metadata to user's application
     */
    async saveDocumentMetadata(userId: string, metadata: DocumentMetadata): Promise<void> {
        try {
            const app = await applicationService.getOrCreate(userId);
            const documents = app.documents || [];

            // Add new document to the list
            documents.push(metadata);

            await applicationService.update(userId, { documents });

            // Notify n8n about the document upload
            try {
                const { activityService } = await import('./activityService');
                await activityService.logActivity(userId, 'document_upload', `Wgrano dokument: ${metadata.displayName}`, { documentId: metadata.id });
                await n8nService.onDocumentUploaded(userId, metadata);
                console.log('[DocumentService] n8n webhook sent for document upload');
            } catch (webhookError) {
                // Don't fail the upload if webhook fails
                console.error('[DocumentService] n8n webhook failed (non-critical):', webhookError);
            }
        } catch (error) {
            console.error('Error saving document metadata:', error);
            throw error;
        }
    },

    /**
     * Delete a document
     */
    async deleteDocument(userId: string, documentId: string, storagePath: string): Promise<void> {
        try {
            // Delete from storage
            const storageRef = ref(storage, storagePath);
            await deleteObject(storageRef);

            // Remove from Firestore
            const app = await applicationService.getOrCreate(userId);
            const docToDelete = app.documents?.find(d => d.id === documentId);
            const documents = (app.documents || []).filter(doc => doc.id !== documentId);
            await applicationService.update(userId, { documents });

            const { activityService } = await import('./activityService');
            await activityService.logActivity(userId, 'document_upload', `Usunięto dokument: ${docToDelete?.displayName || 'Nieznany'}`);
        } catch (error) {
            console.error('Error deleting document:', error);
            throw error;
        }
    },

    /**
     * Get all documents for a user
     */
    async getDocuments(userId: string): Promise<DocumentMetadata[]> {
        try {
            const app = await applicationService.getOrCreate(userId);
            return app.documents || [];
        } catch (error) {
            console.error('Error getting documents:', error);
            return [];
        }
    },

    /**
     * Validate file before upload
     */
    validateFile(file: File): { valid: boolean; error?: string } {
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

        if (!allowedTypes.includes(file.type)) {
            return { valid: false, error: 'Nieobsługiwany format pliku. Dozwolone: PDF, JPG, PNG' };
        }

        if (file.size > maxSize) {
            return { valid: false, error: 'Plik jest zbyt duży. Maksymalny rozmiar: 10MB' };
        }

        return { valid: true };
    },
};
