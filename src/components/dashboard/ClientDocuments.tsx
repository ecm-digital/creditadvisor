import React, { useState, useEffect, useRef } from 'react';
import { FileText, Clock, AlertCircle, Upload, ShieldCheck, Check, ArrowRight, X, Loader2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { documentService, type DocumentMetadata } from '../../services/documentService';
import { useAuth } from '../../context/AuthContext';

export const ClientDocuments: React.FC = () => {
    const [, setSearchParams] = useSearchParams();
    const { showToast } = useToast();
    const { user } = useAuth();
    const [documents, setDocuments] = useState<DocumentMetadata[]>([]);
    const [uploading, setUploading] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const incomeFileRef = useRef<HTMLInputElement>(null);
    const bankStatementFileRef = useRef<HTMLInputElement>(null);

    // Load existing documents
    useEffect(() => {
        const loadDocuments = async () => {
            if (user?.uid) {
                const docs = await documentService.getDocuments(user.uid);
                setDocuments(docs);
            }
        };
        loadDocuments();
    }, [user]);

    const handleFileSelect = async (
        event: React.ChangeEvent<HTMLInputElement>,
        documentType: 'income' | 'bankStatement'
    ) => {
        const file = event.target.files?.[0];
        if (!file || !user?.uid) return;

        // Validate file
        const validation = documentService.validateFile(file);
        if (!validation.valid) {
            showToast(validation.error || 'Nieprawidłowy plik', 'error');
            event.target.value = ''; // Reset input
            return;
        }

        setUploading(documentType);
        setUploadProgress(0);

        try {
            const metadata = await documentService.uploadDocument(
                user.uid,
                file,
                documentType,
                (progress) => setUploadProgress(progress)
            );

            setDocuments(prev => [...prev, metadata]);
            showToast('Dokument został przesłany pomyślnie!', 'success');
        } catch (error) {
            console.error('Upload error:', error);
            showToast('Błąd podczas przesyłania dokumentu', 'error');
        } finally {
            setUploading(null);
            setUploadProgress(0);
            event.target.value = ''; // Reset input
        }
    };

    const handleDelete = async (doc: DocumentMetadata) => {
        if (!user?.uid) return;

        try {
            const storagePath = `documents/${user.uid}/${doc.name}`;
            await documentService.deleteDocument(user.uid, doc.id, storagePath);
            setDocuments(prev => prev.filter(d => d.id !== doc.id));
            showToast('Dokument został usunięty', 'success');
        } catch (error) {
            console.error('Delete error:', error);
            showToast('Błąd podczas usuwania dokumentu', 'error');
        }
    };

    const hasDocument = (type: string) => documents.some(doc => doc.type === type);
    const getDocument = (type: string) => documents.find(doc => doc.type === type);

    const handleNext = () => {
        setSearchParams({ step: 'application' });
    };

    return (
        <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">Twoje Dokumenty</h2>
                <p className="text-slate-500 text-lg">Aby procesować wniosek, potrzebujemy zweryfikować kilka dokumentów.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left: Document List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                <FileText size={20} />
                            </div>
                            <h3 className="font-bold text-slate-900 text-lg">Wymagane załączniki</h3>
                        </div>

                        <div className="space-y-4">
                            {/* Document: ID (assumed verified) */}
                            <div className="group flex items-center justify-between p-5 bg-green-50/50 rounded-2xl border border-green-100 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center text-green-600 shadow-sm border border-green-100">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Dowód Osobisty</h4>
                                        <div className="flex items-center gap-1.5 mt-1">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                                            <span className="text-xs text-green-700 font-bold uppercase tracking-wider">Zweryfikowano</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="px-4 py-2 bg-white rounded-xl text-green-600 text-xs font-bold uppercase tracking-wider border border-green-200 shadow-sm flex items-center gap-2">
                                        <Check size={14} strokeWidth={3} /> Wgrano
                                    </div>
                                </div>
                            </div>

                            {/* Document: Income Certificate */}
                            {hasDocument('income') ? (
                                <div className="flex items-center justify-between p-5 bg-green-50/50 rounded-2xl border border-green-100">
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center text-green-600 shadow-sm border border-green-100">
                                            <FileText size={24} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-slate-900">Zaświadczenie o zarobkach</h4>
                                            <p className="text-xs text-slate-500 mt-1 truncate">{getDocument('income')?.displayName}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(getDocument('income')!)}
                                        className="ml-2 p-2 hover:bg-red-50 rounded-lg transition-colors text-slate-400 hover:text-red-600"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-200 transition-all hover:border-blue-400 group">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-slate-50 w-12 h-12 rounded-xl flex items-center justify-center text-slate-400 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600">
                                            {uploading === 'income' ? <Loader2 size={24} className="animate-spin" /> : <Upload size={24} />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">Zaświadczenie o zarobkach</h4>
                                            <p className="text-xs text-slate-500 mt-1">Format: PDF, JPG, PNG (max 10MB)</p>
                                            {uploading === 'income' && (
                                                <div className="mt-2 w-48">
                                                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-blue-600 transition-all duration-300"
                                                            style={{ width: `${uploadProgress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <input
                                            ref={incomeFileRef}
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={(e) => handleFileSelect(e, 'income')}
                                            className="hidden"
                                            disabled={uploading === 'income'}
                                        />
                                        <button
                                            onClick={() => incomeFileRef.current?.click()}
                                            disabled={uploading === 'income'}
                                            className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold shadow-lg shadow-slate-200 transition-all hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {uploading === 'income' ? 'Wysyłam...' : 'Wgraj'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Document: Bank Statement */}
                            {hasDocument('bankStatement') ? (
                                <div className="flex items-center justify-between p-5 bg-green-50/50 rounded-2xl border border-green-100">
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center text-green-600 shadow-sm border border-green-100">
                                            <FileText size={24} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-slate-900">Wyciąg z konta (3 m-ce)</h4>
                                            <p className="text-xs text-slate-500 mt-1 truncate">{getDocument('bankStatement')?.displayName}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(getDocument('bankStatement')!)}
                                        className="ml-2 p-2 hover:bg-red-50 rounded-lg transition-colors text-slate-400 hover:text-red-600"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-200 transition-all hover:border-blue-400 group">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-slate-50 w-12 h-12 rounded-xl flex items-center justify-center text-slate-400 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600">
                                            {uploading === 'bankStatement' ? <Loader2 size={24} className="animate-spin" /> : <Upload size={24} />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">Wyciąg z konta (3 m-ce)</h4>
                                            <p className="text-xs text-slate-500 mt-1">Historia wpływów wynagrodzenia</p>
                                            {uploading === 'bankStatement' && (
                                                <div className="mt-2 w-48">
                                                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-blue-600 transition-all duration-300"
                                                            style={{ width: `${uploadProgress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <input
                                            ref={bankStatementFileRef}
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={(e) => handleFileSelect(e, 'bankStatement')}
                                            className="hidden"
                                            disabled={uploading === 'bankStatement'}
                                        />
                                        <button
                                            onClick={() => bankStatementFileRef.current?.click()}
                                            disabled={uploading === 'bankStatement'}
                                            className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold shadow-lg shadow-slate-200 transition-all hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {uploading === 'bankStatement' ? 'Wysyłam...' : 'Wgraj'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right: Info Box */}
                <div className="space-y-6">
                    <div className="bg-blue-600 p-8 rounded-[32px] text-white relative overflow-hidden shadow-xl shadow-blue-200">
                        {/* Decorative circles */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/20 rounded-full blur-xl -ml-5 -mb-5"></div>

                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20">
                                <Clock className="text-blue-100" size={24} />
                            </div>
                            <h4 className="text-xl font-bold mb-3">Czas weryfikacji</h4>
                            <p className="text-blue-100 text-sm leading-relaxed mb-6">
                                Przewidywany czas weryfikacji dokumentów przez doradcę to <strong className="text-white">24 godziny robocze</strong> od momentu wgrania kompletu plików.
                            </p>

                            <div className="flex items-start gap-3 p-4 bg-blue-700/50 rounded-xl border border-blue-500/30">
                                <AlertCircle size={18} className="text-blue-200 mt-0.5 shrink-0" />
                                <p className="text-xs text-blue-100 font-medium leading-relaxed">
                                    Upewnij się, że skany są czytelne i zawierają wszystkie strony dokumentu.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            onClick={handleNext}
                            className="w-full bg-slate-900 h-16 rounded-2xl text-white font-bold text-lg flex items-center justify-center gap-3 transition-all hover:bg-slate-800 shadow-md"
                        >
                            Przejdź do Wniosku <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
