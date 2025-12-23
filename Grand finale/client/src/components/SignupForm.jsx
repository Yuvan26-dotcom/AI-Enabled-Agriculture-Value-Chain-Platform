import React, { useState } from 'react';
import api from '../api';
import { UserPlus, Fingerprint, CheckCircle, Loader2 } from 'lucide-react';

const SignupForm = () => {
    const [step, setStep] = useState(1); // 1: Aadhaar, 2: Details
    const [loading, setLoading] = useState(false);
    const [aadhaar, setAadhaar] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        state: '',
        district: '',
        role: 'farmer',
        agriStackId: '',
        linkedFPO: ''
    });

    const handleAadhaarLookup = async (e) => {
        e.preventDefault();
        if (aadhaar.length !== 12) {
            alert("Please enter a valid 12-digit Aadhaar number");
            return;
        }
        setLoading(true);
        try {
            const res = await api.post('/auth/agristack-lookup', { aadhaar });
            const data = res.data;
            
            // Auto-fill form
            setFormData(prev => ({
                ...prev,
                name: data.name,
                state: data.state,
                district: data.district,
                agriStackId: data.farmerId,
                linkedFPO: data.linkedFPO
            }));
            
            setStep(2);
        } catch (err) {
            console.error(err);
            alert("AgriStack Lookup Failed. Please enter details manually.");
            setStep(2); // Allow manual entry on failure
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                location: {
                    state: formData.state,
                    district: formData.district
                },
                role: formData.role,
                agriStackId: formData.agriStackId
            };

            const res = await api.post('/auth/signup', payload);
            localStorage.setItem('token', res.data.token);
            alert("Signup Successful! Token saved.");
            window.location.reload(); // Reload to refresh app state (simple auth flow)
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.msg || "Signup Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-green-700 p-4 text-white flex items-center gap-2">
                <UserPlus size={24} />
                <h2 className="text-xl font-bold">Farmer Registration</h2>
            </div>

            <div className="p-6">
                {step === 1 ? (
                    <form onSubmit={handleAadhaarLookup} className="space-y-4">
                        <div className="text-center mb-6">
                            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
                                <Fingerprint size={32} className="text-orange-600" />
                            </div>
                            <h3 className="font-bold text-gray-800">AgriStack Integration</h3>
                            <p className="text-sm text-gray-500">Enter Aadhaar to fetch details from National Registry</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label>
                            <input 
                                type="text" 
                                maxLength="12"
                                placeholder="1234 5678 9012"
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                value={aadhaar}
                                onChange={(e) => setAadhaar(e.target.value.replace(/\D/g,''))}
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-orange-600 text-white py-2 rounded font-semibold hover:bg-orange-700 transition-colors flex justify-center items-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Fetch Details'}
                        </button>
                        
                        <div className="text-center mt-4">
                            <button type="button" onClick={() => setStep(2)} className="text-sm text-gray-500 hover:underline">
                                Skip & Enter Manually
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleSignup} className="space-y-4">
                        {formData.agriStackId && (
                            <div className="bg-green-50 border border-green-200 p-3 rounded text-sm text-green-800 flex items-start gap-2 mb-4">
                                <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-bold">Verified by AgriStack</p>
                                    <p>ID: {formData.agriStackId}</p>
                                    <p>FPO: {formData.linkedFPO}</p>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase">Full Name</label>
                            <input 
                                type="text" 
                                required
                                className="w-full p-2 border-b border-gray-300 focus:border-green-500 outline-none"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase">Email</label>
                            <input 
                                type="email" 
                                required
                                className="w-full p-2 border-b border-gray-300 focus:border-green-500 outline-none"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase">Password</label>
                            <input 
                                type="password" 
                                required
                                className="w-full p-2 border-b border-gray-300 focus:border-green-500 outline-none"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase">State</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full p-2 border-b border-gray-300 focus:border-green-500 outline-none"
                                    value={formData.state}
                                    onChange={(e) => setFormData({...formData, state: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase">District</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full p-2 border-b border-gray-300 focus:border-green-500 outline-none"
                                    value={formData.district}
                                    onChange={(e) => setFormData({...formData, district: e.target.value})}
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-green-700 text-white py-3 rounded font-bold hover:bg-green-800 transition-colors mt-4"
                        >
                            {loading ? 'Registering...' : 'Complete Registration'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default SignupForm;