import { supabase } from '../lib/supabase';
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
}

export const clientService = {
    /**
     * Get all clients
     */
    async getAll(): Promise<Client[]> {
        try {
            console.log('[ClientService] Fetching clients from Supabase...');
            console.log('[ClientService] Supabase URL:', import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Missing');
            console.log('[ClientService] Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing');
            
            const { data, error } = await supabase
                .from('clients')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('[ClientService] Supabase error:', error);
                console.error('[ClientService] Error code:', error.code);
                console.error('[ClientService] Error message:', error.message);
                console.error('[ClientService] Error details:', error.details);
                throw error;
            }

            console.log('[ClientService] Successfully fetched', data?.length || 0, 'clients');
            return data || [];
        } catch (error: any) {
            console.error('[ClientService] Error in getAll:', error);
            if (error?.code === 'PGRST116') {
                throw new Error('Tabela clients nie istnieje w bazie danych');
            }
            if (error?.code === '42501') {
                throw new Error('Brak uprawnień do odczytu danych. Sprawdź polityki RLS.');
            }
            throw error;
        }
    },

    /**
     * Get a single client by ID
     */
    async getById(id: string): Promise<Client | null> {
        try {
            const { data, error } = await supabase
                .from('clients')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching client:', error);
                return null;
            }

            return data;
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
            const { data, error } = await supabase
                .from('clients')
                .insert([{
                    name: client.name.trim(),
                    email: client.email.trim().toLowerCase(),
                    phone: client.phone.trim(),
                    status: client.status,
                    date: client.date,
                }])
                .select()
                .single();

            if (error) {
                console.error('Error creating client:', error);
                throw error;
            }

            // Notify n8n about new client
            if (data) {
                n8nService.onClientCreated(data).catch(err => {
                    console.error('Error notifying n8n about new client:', err);
                });
            }

            return data;
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
            const updateData: any = {};
            if (updates.name) updateData.name = updates.name.trim();
            if (updates.email) updateData.email = updates.email.trim().toLowerCase();
            if (updates.phone) updateData.phone = updates.phone.trim();
            if (updates.status) updateData.status = updates.status;
            if (updates.date) updateData.date = updates.date;

            const { data, error } = await supabase
                .from('clients')
                .update(updateData)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error('Error updating client:', error);
                throw error;
            }

            // Notify n8n about client update
            if (data) {
                n8nService.onClientUpdated(data, updateData).catch(err => {
                    console.error('Error notifying n8n about client update:', err);
                });
            }

            return data;
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
            const { error } = await supabase
                .from('clients')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting client:', error);
                throw error;
            }

            // Notify n8n about client deletion
            // We need to get client info before deletion, so this is handled in the component
        } catch (error) {
            console.error('Error in delete:', error);
            throw error;
        }
    },

    /**
     * Check if Supabase is configured
     */
    isConfigured(): boolean {
        const url = import.meta.env.VITE_SUPABASE_URL;
        const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
        return !!(url && key);
    },
};

