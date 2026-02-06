import { db } from '../lib/firebase';
import { collection, addDoc, query, where, orderBy, getDocs, serverTimestamp, Timestamp } from 'firebase/firestore';

export interface Activity {
    id: string;
    userId: string;
    type: 'login' | 'application_update' | 'document_upload' | 'status_change';
    description: string;
    metadata?: any;
    createdAt: Timestamp;
}

export const activityService = {
    /**
     * Log a new activity
     */
    async logActivity(userId: string, type: Activity['type'], description: string, metadata?: any): Promise<void> {
        try {
            const activitiesCollection = collection(db, 'activities');
            await addDoc(activitiesCollection, {
                userId,
                type,
                description,
                metadata: metadata || {},
                createdAt: serverTimestamp()
            });
        } catch (error) {
            console.error('[ActivityService] Error logging activity:', error);
        }
    },

    /**
     * Get activities for a specific user
     */
    async getUserActivities(userId: string): Promise<Activity[]> {
        try {
            const activitiesCollection = collection(db, 'activities');
            const q = query(
                activitiesCollection,
                where('userId', '==', userId),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Activity));
        } catch (error) {
            console.error('[ActivityService] Error getting user activities:', error);
            return [];
        }
    }
};
