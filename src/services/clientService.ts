import { db } from '../lib/firebase';
import { collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { n8nService } from './n8nService';

export interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    status: 'new' | 'contacted' | 'in_progress' | 'closed';
    date: string;
    created_at?: string;
    updated_at?: string;
    user_id?: string;
}

export const clientService = {
    /**
     * Get all clients
     */
    async getAll(): Promise<Client[]> {
        try {
            console.log('[ClientService] Fetching clients from Firestore...');

            const clientsCollection = collection(db, 'clients');
            // Note: orderBy might require an index in Firestore if combined with filter, 
            // but simple ordering on 'created_at' should work if field exists. 
            // If 'created_at' is missing on some docs, it might exclude them or warn.
            // Using 'date' as a fallback or just default order.
            // Let's try to order by created_at desc.
            const q = query(clientsCollection, orderBy('created_at', 'desc'));

            const querySnapshot = await getDocs(q).catch((err) => {
                // Fallback if index missing or field missing, try without sort or handle error
                console.warn('[ClientService] Sort failed, fetching unordered', err);
                return getDocs(clientsCollection);
            });

            const clients: Client[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Client));

            console.log('[ClientService] Successfully fetched', clients.length, 'clients');
            return clients;
        } catch (error: any) {
            console.error('[ClientService] Error in getAll:', error);
            throw error;
        }
    },

    /**
     * Get a single client by ID
     */
    async getById(id: string): Promise<Client | null> {
        try {
            const docRef = doc(db, 'clients', id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() } as Client;
            } else {
                console.log('No such client!');
                return null;
            }
        } catch (error) {
            console.error('Error in getById:', error);
            return null;
        }
    },

    /**
     * Create a new client
     */
    async create(client: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client> {
        try {
            const newClientData = {
                name: client.name.trim(),
                email: client.email.trim().toLowerCase(),
                phone: client.phone.trim(),
                status: client.status,
                date: client.date,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            const docRef = await addDoc(collection(db, 'clients'), newClientData);

            const createdClient: Client = {
                id: docRef.id,
                ...newClientData
            } as Client;

            // Notify n8n about new client
            n8nService.onClientCreated(createdClient).catch(err => {
                console.error('Error notifying n8n about new client:', err);
            });

            return createdClient;
        } catch (error) {
            console.error('Error in create:', error);
            throw error;
        }
    },

    /**
     * Update an existing client
     */
    async update(id: string, updates: Partial<Omit<Client, 'id' | 'created_at' | 'updated_at'>>): Promise<Client> {
        try {
            const updateData: any = {
                updated_at: new Date().toISOString()
            };
            if (updates.name) updateData.name = updates.name.trim();
            if (updates.email) updateData.email = updates.email.trim().toLowerCase();
            if (updates.phone) updateData.phone = updates.phone.trim();
            if (updates.status) updateData.status = updates.status;
            if (updates.date) updateData.date = updates.date;

            const docRef = doc(db, 'clients', id);
            await updateDoc(docRef, updateData);

            // Fetch updated doc to return full object
            const updatedDocSnap = await getDoc(docRef);
            const updatedClient = { id: updatedDocSnap.id, ...updatedDocSnap.data() } as Client;

            // Notify n8n about client update
            n8nService.onClientUpdated(updatedClient, updateData).catch(err => {
                console.error('Error notifying n8n about client update:', err);
            });

            return updatedClient;
        } catch (error) {
            console.error('Error in update:', error);
            throw error;
        }
    },

    /**
     * Delete a client
     */
    async delete(id: string): Promise<void> {
        try {
            await deleteDoc(doc(db, 'clients', id));
        } catch (error) {
            console.error('Error in delete:', error);
            throw error;
        }
    },

    /**
     * Check if Firebase is configured
     */
    isConfigured(): boolean {
        // Basic check if auth/db are initialized (they always are if file is imported, 
        // but verify environment variables are present)
        return !!import.meta.env.VITE_FIREBASE_API_KEY;
    },
};

