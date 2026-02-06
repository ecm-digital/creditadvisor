import { db } from '../lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { n8nService } from './n8nService';

export interface LoanApplication {
    userId: string;
    email?: string;
    phone?: string;

    // Step 1: Purpose
    purpose?: string;

    // Step 2: Parameters
    amount?: number;
    period?: number;

    // Step 3: Income
    incomeSource?: string;
    monthlyIncome?: number;

    // Step 4: Offers (selected offer)
    selectedOfferId?: string;
    selectedBankName?: string;
    selectedInstallment?: number;

    // Step 5: Documents
    documents?: {
        id: string;
        name: string;
        displayName: string;
        type: string;
        size: number;
        uploadedAt: string;
        downloadURL: string;
        status: 'uploaded' | 'verified' | 'rejected';
    }[];

    // Step 6: Application
    status: 'draft' | 'submitted' | 'in_review' | 'approved' | 'rejected';
    agreements?: {
        marketing: boolean;
        bik: boolean;
        tos: boolean;
    };

    submittedAt?: string;
    createdAt?: any;
    updatedAt?: any;
}

export const applicationService = {
    /**
     * Get or create application for the current user
     */
    async getOrCreate(userId: string, email?: string, phone?: string): Promise<LoanApplication> {
        try {
            const docRef = doc(db, 'applications', userId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return docSnap.data() as LoanApplication;
            }

            // Create new application
            const newApp: LoanApplication = {
                userId,
                email,
                phone,
                status: 'draft',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            };

            await setDoc(docRef, newApp);
            return newApp;
        } catch (error) {
            console.error('[ApplicationService] Error in getOrCreate:', error);
            throw error;
        }
    },

    /**
     * Update application data
     */
    async update(userId: string, updates: Partial<LoanApplication>): Promise<void> {
        try {
            const docRef = doc(db, 'applications', userId);

            // Use setDoc with merge to handle both new and existing documents
            await setDoc(docRef, {
                ...updates,
                updatedAt: serverTimestamp(),
            }, { merge: true });

            console.log('[ApplicationService] Application updated:', updates);
        } catch (error) {
            console.error('[ApplicationService] Error updating application:', error);
            throw error;
        }
    },

    /**
     * Submit the application
     */
    async submit(userId: string): Promise<void> {
        try {
            const docRef = doc(db, 'applications', userId);

            // Use setDoc with merge to handle both new and existing documents
            await setDoc(docRef, {
                status: 'submitted',
                submittedAt: new Date().toISOString(),
                updatedAt: serverTimestamp(),
            }, { merge: true });

            console.log('[ApplicationService] Application submitted for user:', userId);

            // Notify n8n about the new application
            try {
                const application = await this.getByUserId(userId);
                if (application) {
                    await n8nService.onApplicationSubmitted(application);
                    console.log('[ApplicationService] n8n webhook sent successfully');
                }
            } catch (webhookError) {
                // Don't fail the submit if webhook fails
                console.error('[ApplicationService] n8n webhook failed (non-critical):', webhookError);
            }
        } catch (error) {
            console.error('[ApplicationService] Error submitting application:', error);
            throw error;
        }
    },

    /**
     * Get application by userId
     */
    async getByUserId(userId: string): Promise<LoanApplication | null> {
        try {
            const docRef = doc(db, 'applications', userId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return docSnap.data() as LoanApplication;
            }
            return null;
        } catch (error) {
            console.error('[ApplicationService] Error getting application:', error);
            return null;
        }
    },

    /**
     * Get all applications (for advisor)
     */
    async getAll(): Promise<LoanApplication[]> {
        try {
            const applicationsCollection = collection(db, 'applications');
            const q = query(applicationsCollection, orderBy('updatedAt', 'desc'));
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                userId: doc.id,
                ...doc.data()
            } as LoanApplication));
        } catch (error) {
            console.error('[ApplicationService] Error getting all applications:', error);
            return [];
        }
    },
};
