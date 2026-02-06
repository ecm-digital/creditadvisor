import { clientService, type Client } from '../services/clientService';

const DUMMY_CLIENTS: Omit<Client, 'id' | 'created_at' | 'updated_at'>[] = [
    {
        name: 'Tomasz (Admin)',
        email: 'tomasz@blachlinskikredyty.pl',
        phone: '535330323',
        status: 'new',
        date: new Date().toISOString().split('T')[0]
    },
    {
        name: 'Anna Nowak',
        email: 'anna.nowak@example.com',
        phone: '501 234 567',
        status: 'new',
        date: new Date().toISOString().split('T')[0]
    },
    {
        name: 'Piotr Wiśniewski',
        email: 'piotr.wisniewski@example.com',
        phone: '602 345 678',
        status: 'contacted',
        date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0] // 2 days ago
    },
    {
        name: 'Katarzyna Wójcik',
        email: 'katarzyna.wojcik@example.com',
        phone: '703 456 789',
        status: 'in_progress',
        date: new Date(Date.now() - 86400000 * 5).toISOString().split('T')[0] // 5 days ago
    },
    {
        name: 'Michał Kowalczyk',
        email: 'michal.kowalczyk@example.com',
        phone: '504 567 890',
        status: 'closed',
        date: new Date(Date.now() - 86400000 * 10).toISOString().split('T')[0] // 10 days ago
    },
    {
        name: 'Magdalena Kamińska',
        email: 'magdalena.kaminska@example.com',
        phone: '605 678 901',
        status: 'new',
        date: new Date().toISOString().split('T')[0]
    }
];

export const seedClients = async (): Promise<Client[]> => {
    const createdClients: Client[] = [];
    console.log('Starting seed process...');

    for (const data of DUMMY_CLIENTS) {
        try {
            // Check if exists physically in DB is too slow for seed, 
            // but we can just let firestore create new ID.
            // Ideally we check if email exists to avoid dupes in this simple run.
            // But for a "Generate" button, maybe we just add them.
            // Let's rely on the service to just create.
            const client = await clientService.create(data);
            createdClients.push(client);
            console.log('Created client:', client.name);
        } catch (error) {
            console.error('Failed to create client:', data.name, error);
        }
    }

    return createdClients;
};

export const seedAdvisor = async () => {
    try {
        const { createUserWithEmailAndPassword } = await import('firebase/auth');
        const { auth } = await import('../lib/firebase');

        // Hasło musi mieć min. 6 znaków, więc używamy 20262026
        await createUserWithEmailAndPassword(auth, 'admin@blachlinski.pl', '20262026');
        console.log('Advisor created successfully');
        return { success: true };
    } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
            console.log('Advisor account already exists');
            return { success: true, message: 'Konto już istnieje' };
        }
        if (error.code === 'auth/weak-password') {
            return { success: false, error: 'Hasło jest za słabe (min. 6 znaków)' };
        }
        console.error('Error seeding advisor:', error);
        return { success: false, error: error.message };
    }
};

export const clearClients = async (): Promise<void> => {
    try {
        console.log('Clearing database...');
        const clients = await clientService.getAll();
        for (const client of clients) {
            await clientService.delete(client.id);
            console.log('Deleted client:', client.id);
        }
        console.log('Database cleared!');
    } catch (error) {
        console.error('Error clearing database:', error);
    }
};
