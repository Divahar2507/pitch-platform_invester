import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, FileText } from 'lucide-react';
import api from '../../services/api';

export default function UploadPitch() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        raising_amount: '',
        equity_percentage: ''
    });

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
        } else {
            alert('Please select a PDF file');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            alert('Please upload a pitch deck PDF');
            return;
        }

        setLoading(true);
        try {
            // 1. Upload File
            const fileData = new FormData();
            fileData.append('file', file);

            const uploadResponse = await api.post('/pitches/upload', fileData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const fileUrl = uploadResponse.data.url;

            // 2. Create Pitch Record
            await api.post('/pitches/', {
                ...formData,
                pitch_file_url: fileUrl
            });

            navigate('/my-pitches');
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload pitch. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">Upload New Pitch</h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl border border-slate-200 shadow-sm">

                {/* File Upload API */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-slate-700">Pitch Deck (PDF)</label>
                    <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors
                        ${file ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-blue-400'}`}>

                        {file ? (
                            <div className="flex items-center justify-center gap-4">
                                <FileText className="text-blue-600" size={32} />
                                <div className="text-left">
                                    <p className="font-medium text-slate-900">{file.name}</p>
                                    <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFile(null)}
                                    className="p-1 hover:bg-white rounded-full transition-colors"
                                >
                                    <X size={20} className="text-slate-500" />
                                </button>
                            </div>
                        ) : (
                            <>
                                <Upload className="mx-auto text-slate-400 mb-4" size={40} />
                                <p className="text-slate-600 font-medium mb-1">Click to upload or drag and drop</p>
                                <p className="text-sm text-slate-400">PDF only, max 10MB</p>
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="hidden"
                                    id="pitch-upload"
                                />
                                <label
                                    htmlFor="pitch-upload"
                                    className="absolute inset-0 cursor-pointer"
                                ></label>
                            </>
                        )}
                        {/* Fix: relative positioning container needed for absolute label if using drag drop style, 
                            but for simplicity using click on container by label wrapping or onClick proxy. 
                             Let's make sure the input is reachable. */}
                        {!file && (
                            <label
                                htmlFor="pitch-upload"
                                className="mt-4 inline-block px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 cursor-pointer relative z-10"
                            >
                                Select File
                            </label>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Presentation Title</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Series A Deck - Q1 2026"
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Description</label>
                        <input
                            type="text"
                            placeholder="Brief description of this deck version"
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Raising Amount</label>
                        <input
                            type="text"
                            placeholder="e.g. $2M"
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.raising_amount}
                            onChange={e => setFormData({ ...formData, raising_amount: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-slate-700">Equity Offered</label>
                        <input
                            type="text"
                            placeholder="e.g. 10%"
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.equity_percentage}
                            onChange={e => setFormData({ ...formData, equity_percentage: e.target.value })}
                        />
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate('/my-pitches')}
                        className="px-6 py-2 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Uploading...' : 'Upload Pitch'}
                    </button>
                </div>
            </form>
        </div>
    );
}
