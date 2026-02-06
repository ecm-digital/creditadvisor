import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
// Simple ID generator if uuid package not available (it usually is or isn't, safer to use Math.random)
const generateId = () => Math.random().toString(36).substr(2, 9);

export interface BankOffer {
    id?: string;
    bankName: string;
    logoUrl?: string; // Optional URL for bank logo
    interestRate: number; // e.g., 7.5
    corporationRate?: number; // e.g., 8.1
    commission: number; // e.g., 0
    rrso: number; // e.g., 8.25
    minDownPayment: number; // e.g., 10 (percent)
    maxLoanAmount: number; // e.g., 2000000
    description?: string;
    isActive: boolean;
    createdAt?: any;
    updatedAt?: any;
}

const GLOBAL_OFFERS_DOC = 'GLOBAL_OFFERS';
const COLLECTION_PROXY = 'clients'; // Using 'clients' collection as it is public

interface OffersDocument {
    type: 'system';
    items: BankOffer[];
    lastUpdated: any;
}

export const offerService = {
    /**
     * Helper to get the whole list
     */
    async _getOffersList(): Promise<BankOffer[]> {
        try {
            const docRef = doc(db, COLLECTION_PROXY, GLOBAL_OFFERS_DOC);
            const snapshot = await getDoc(docRef);
            if (snapshot.exists()) {
                const data = snapshot.data() as OffersDocument;
                return data.items || [];
            }
            return [];
        } catch (error) {
            console.error('Error fetching offers doc:', error);
            return [];
        }
    },

    /**
     * Get all active offers sorted by interest rate
     */
    async getActiveOffers(): Promise<BankOffer[]> {
        const offers = await this._getOffersList();
        return offers
            .filter(o => o.isActive !== false)
            .sort((a, b) => a.interestRate - b.interestRate);
    },

    /**
     * Get all offers (including inactive) for admin
     */
    async getAllOffers(): Promise<BankOffer[]> {
        const offers = await this._getOffersList();
        return offers.sort((a, b) => a.interestRate - b.interestRate);
    },

    /**
     * Add a new offer
     */
    async addOffer(offer: Omit<BankOffer, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
        try {
            const offers = await this._getOffersList();
            const newId = generateId();
            const newOffer: BankOffer = {
                ...offer,
                id: newId,
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            const updatedList = [...offers, newOffer];

            await setDoc(doc(db, COLLECTION_PROXY, GLOBAL_OFFERS_DOC), {
                type: 'system',
                items: updatedList,
                lastUpdated: Timestamp.now()
            }); // setDoc merges? No, overwrites unless merge:true. But we want to replace the list. 
            // Better to use setDoc with merge:true IF we were updating partials, but here we replace 'items'.

            return newId;
        } catch (error) {
            console.error('Error adding offer:', error);
            throw error;
        }
    },

    /**
     * Update an existing offer
     */
    async updateOffer(id: string, updates: Partial<BankOffer>): Promise<void> {
        try {
            const offers = await this._getOffersList();
            const index = offers.findIndex(o => o.id === id);
            if (index === -1) throw new Error('Offer not found');

            const updatedOffer = {
                ...offers[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };

            offers[index] = updatedOffer;

            await updateDoc(doc(db, COLLECTION_PROXY, GLOBAL_OFFERS_DOC), {
                items: offers,
                lastUpdated: Timestamp.now()
            });
        } catch (error) {
            console.error('Error updating offer:', error);
            throw error;
        }
    },

    /**
     * Delete an offer (or soft delete by setting isActive: false)
     */
    async deleteOffer(id: string): Promise<void> {
        try {
            const offers = await this._getOffersList();
            const filtered = offers.filter(o => o.id !== id);

            await updateDoc(doc(db, COLLECTION_PROXY, GLOBAL_OFFERS_DOC), {
                items: filtered,
                lastUpdated: Timestamp.now()
            });
        } catch (error) {
            console.error('Error deleting offer:', error);
            throw error;
        }
    },

    /**
     * Seed initial data if empty
     */
    async seedInitialOffers() {
        const offers = await this.getAllOffers();
        if (offers.length > 0) return;

        console.log('Seeding initial offers (Workaround Mode)...');
        const initialOffers: Omit<BankOffer, 'id' | 'createdAt' | 'updatedAt'>[] = [
            {
                bankName: 'PKO BP',
                interestRate: 7.05,
                commission: 0,
                rrso: 7.45,
                minDownPayment: 10,
                maxLoanAmount: 3000000,
                isActive: true
            },
            {
                bankName: 'Pekao SA',
                interestRate: 7.15,
                commission: 1.5,
                rrso: 7.89,
                minDownPayment: 20,
                maxLoanAmount: 2500000,
                isActive: true
            },
            {
                bankName: 'ING Bank Śląski',
                interestRate: 7.25,
                commission: 0,
                rrso: 7.65,
                minDownPayment: 20,
                maxLoanAmount: 2000000,
                isActive: true
            },
            {
                bankName: 'Santander Bank Polska',
                interestRate: 7.35,
                commission: 2.0,
                rrso: 8.10,
                minDownPayment: 10,
                maxLoanAmount: 3500000,
                isActive: true
            },
            {
                bankName: 'BNP Paribas',
                interestRate: 7.10,
                commission: 0,
                rrso: 7.55,
                minDownPayment: 20,
                maxLoanAmount: 4000000,
                isActive: true
            },
            {
                bankName: 'Bank Millennium',
                interestRate: 7.55,
                commission: 0,
                rrso: 8.05,
                minDownPayment: 10,
                maxLoanAmount: 1800000,
                isActive: true
            },
            {
                bankName: 'mBank',
                interestRate: 7.85,
                commission: 0,
                rrso: 8.15,
                minDownPayment: 10,
                maxLoanAmount: 1500000,
                isActive: true
            },
            {
                bankName: 'Alior Bank',
                interestRate: 8.05,
                commission: 2,
                rrso: 9.15,
                minDownPayment: 10,
                maxLoanAmount: 1000000,
                isActive: true
            },
            {
                bankName: 'VeloBank',
                interestRate: 6.95,
                commission: 0,
                rrso: 7.25,
                minDownPayment: 20,
                maxLoanAmount: 2000000,
                isActive: true
            }
        ];

        // Batch create logic internal: just create the whole list
        const preparedList = initialOffers.map(o => ({
            ...o,
            id: generateId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }));

        await setDoc(doc(db, COLLECTION_PROXY, GLOBAL_OFFERS_DOC), {
            type: 'system',
            items: preparedList,
            lastUpdated: Timestamp.now()
        });

        console.log('Seeding complete.');
    }
};
