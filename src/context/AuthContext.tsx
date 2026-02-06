import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, sendPasswordResetEmail } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { normalizePhone } from '../utils/authUtils';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signUp: (email: string, password: string, name: string, phone: string, additionalData?: any) => Promise<{ error: any }>;
    signIn: (email: string, password: string) => Promise<{ error: any }>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<{ error: any }>;
    sendLoginCode: (phone: string) => Promise<{ success: boolean; error: any }>;
    signInWithPhone: (phone: string, code: string) => Promise<{ success: boolean; error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signUp = async (email: string, password: string, name: string, phone: string, additionalData: any = {}) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Create client record in Firestore
            const cleanPhone = normalizePhone(phone);
            if (user) {
                try {
                    await addDoc(collection(db, 'clients'), {
                        user_id: user.uid,
                        name,
                        email: email.toLowerCase(),
                        phone: cleanPhone,
                        status: 'new',
                        date: new Date().toISOString().split('T')[0],
                        created_at: new Date().toISOString(),
                        ...additionalData // Spread rich data (amount, purpose, etc.)
                    });

                    // Log registration
                    const { activityService } = await import('../services/activityService');
                    await activityService.logActivity(user.uid, 'login', 'Zarejestrowano nowe konto klienta');
                } catch (err: any) {
                    console.error('Error creating client record:', err);
                    // Return this error so the UI knows DB write failed
                    return { error: { code: 'firestore-error', message: 'Konto utworzone, ale błąd zapisu danych: ' + err.message } };
                }
            }

            return { error: null };
        } catch (error: any) {
            return { error };
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            return { error: null };
        } catch (error: any) {
            return { error };
        }
    };

    const signOut = async () => {
        await firebaseSignOut(auth);
    };

    const resetPassword = async (email: string) => {
        try {
            await sendPasswordResetEmail(auth, email);
            return { error: null };
        } catch (error: any) {
            return { error };
        }
    };

    const sendLoginCode = async (phone: string) => {
        try {
            const cleanPhone = normalizePhone(phone);
            const functionUrl = 'https://requestsmscode-cy3aptk6fq-ew.a.run.app';
            const response = await fetch(functionUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber: cleanPhone }),
            });
            const data = await response.json();
            if (!response.ok) {
                return { success: false, error: data.error || 'Failed to send code' };
            }
            return { success: true, error: null };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    };

    const signInWithPhone = async (phone: string, code: string) => {
        try {
            const functionUrl = 'https://verifysmscode-cy3aptk6fq-ew.a.run.app';
            const response = await fetch(functionUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber: phone, code }),
            });
            const data = await response.json();

            if (!response.ok) {
                return { success: false, error: data.error || 'Verification failed' };
            }

            if (data.token) {
                const { signInWithCustomToken } = await import('firebase/auth');
                await signInWithCustomToken(auth, data.token);
                return { success: true, error: null };
            }

            return { success: false, error: 'No token received' };

        } catch (error: any) {
            return { success: false, error: error.message };
        }
    };

    const value = {
        user,
        loading,
        signUp,
        signIn,
        signOut,
        resetPassword,
        sendLoginCode,
        signInWithPhone,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

