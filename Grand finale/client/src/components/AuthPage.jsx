import React, { useState, useEffect } from 'react';
import api from '../api';
import { User, Mail, Lock, MapPin, Briefcase, ArrowRight, Loader, ArrowLeft } from 'lucide-react';
import { INDIAN_LOCATIONS } from '../data/locations';

const AuthPage = ({ onLogin }) => {
  const [view, setView] = useState('login'); // 'login', 'forgot-password' (signup removed)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'farmer',
    state: 'Madhya Pradesh',
    district: 'Indore'
  });

  const [districts, setDistricts] = useState(INDIAN_LOCATIONS?.['Madhya Pradesh'] || []);

  useEffect(() => {
    if (formData.state && INDIAN_LOCATIONS && INDIAN_LOCATIONS[formData.state]) {
      setDistricts(INDIAN_LOCATIONS[formData.state]);
      // Reset district if it's not in the new state list
      if (!INDIAN_LOCATIONS[formData.state].includes(formData.district)) {
        setFormData(prev => ({ ...prev, district: INDIAN_LOCATIONS[formData.state][0] }));
      }
    }
  }, [formData.state]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    // Validation
    if (view === 'signup') {
      if (/\d/.test(formData.name)) {
        setError("Name should not contain numbers.");
        setLoading(false);
        return;
      }
      if (formData.password.length < 6 || !/[A-Z]/.test(formData.password)) {
        setError("Password must be at least 6 characters long and contain at least one capital letter.");
        setLoading(false);
        return;
      }
      // Email Regex Validation
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email address.");
        setLoading(false);
        return;
      }
    }

    try {
      let endpoint;
      let payload;

      if (view === 'forgot-password') {
        endpoint = '/auth/forgot-password';
        payload = { email: formData.email };
      } else if (view === 'login') {
        endpoint = '/auth/login';
        payload = { email: formData.email, password: formData.password };
      } else {
        endpoint = '/auth/signup';
        payload = {
          ...formData,
          location: {
            state: formData.state,
            district: formData.district
          }
        };
      }

      const res = await api.post(endpoint, payload);
      
      if (view === 'forgot-password') {
        setSuccessMsg(res.data.msg);
        setLoading(false);
        return;
      }

      localStorage.setItem('token', res.data.token);
      
      // Fetch user profile to get the correct role
      try {
        const userRes = await api.get('/auth/user');
        onLogin(userRes.data);
      } catch (err) {
        console.error("Failed to fetch user profile", err);
        // Fallback: use the role from the form if signing up, otherwise default to farmer
        onLogin({ role: view === 'login' ? 'farmer' : formData.role, name: formData.name }); 
      }

    } catch (err) {
      console.error("Auth Error:", err);
      setError(err.response?.data?.msg || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    if (view === 'forgot-password') return 'Reset Password';
    if (view === 'login') return 'Welcome';
    return 'Create Account';
  };

  const getSubtitle = () => {
    if (view === 'forgot-password') return 'Enter your email to receive a recovery link';
    if (view === 'login') return 'Enter your credentials to access your account';
    return 'Join the Oilseed Revolution today';
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1920&auto=format&fit=crop')`
      }}
    >
      {/* Cinematic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/40 to-black/80 backdrop-blur-[1px]"></div>

      <div className="bg-black/40 backdrop-blur-xl w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative z-10 border border-white/10 transition-all duration-500 hover:shadow-green-500/20 hover:border-green-500/30">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg tracking-tight">
              {getTitle()}
            </h1>
            <p className="text-gray-300 font-medium drop-shadow-md">
              {getSubtitle()}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/20 text-red-200 p-3 rounded-lg mb-6 text-sm text-center border border-red-500/30 animate-pulse backdrop-blur-sm">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="bg-green-500/20 text-green-200 p-3 rounded-lg mb-6 text-sm text-center border border-green-500/30 backdrop-blur-sm">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {view === 'signup' && (
              <div className="relative group">
                <User className="absolute left-3 top-3 text-gray-400 group-focus-within:text-green-400 transition-colors" size={20} />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/5 text-white placeholder-gray-400 transition-all duration-300 focus:bg-white/10"
                  required={view === 'signup'}
                />
              </div>
            )}

            <div className="relative group">
              <Mail className="absolute left-3 top-3 text-gray-400 group-focus-within:text-green-400 transition-colors" size={20} />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/5 text-white placeholder-gray-400 transition-all duration-300 focus:bg-white/10"
                required
              />
            </div>

            {view !== 'forgot-password' && (
              <div className="relative group">
                <Lock className="absolute left-3 top-3 text-gray-400 group-focus-within:text-green-400 transition-colors" size={20} />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/5 text-white placeholder-gray-400 transition-all duration-300 focus:bg-white/10"
                  required
                />
              </div>
            )}

            {view === 'login' && (
              <div className="text-right -mt-2 mb-2">
                <button
                  type="button"
                  onClick={() => setView('forgot-password')}
                  className="text-sm text-green-400 hover:text-green-300 font-medium transition-colors hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {view === 'signup' && (
              <>
                <div className="relative group">
                  <Briefcase className="absolute left-3 top-3 text-gray-400 group-focus-within:text-green-400 transition-colors" size={20} />
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white/5 text-white transition-all duration-300 focus:bg-white/10 [&>option]:bg-gray-900 [&>option]:text-white"
                  >
                    <option value="farmer">Farmer</option>
                    <option value="buyer">Buyer</option>
                    <option value="policymaker">Policymaker</option>
                    <option value="processor">Processing Unit</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative group">
                    <MapPin className="absolute left-3 top-3 text-gray-400 group-focus-within:text-green-400 transition-colors" size={20} />
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white/5 text-white transition-all duration-300 focus:bg-white/10 [&>option]:bg-gray-900 [&>option]:text-white"
                    >
                      {Object.keys(INDIAN_LOCATIONS).map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  <div className="relative group">
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white/5 text-white transition-all duration-300 focus:bg-white/10 [&>option]:bg-gray-900 [&>option]:text-white"
                    >
                      {districts.map(district => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2.5 rounded-lg font-bold shadow-lg hover:shadow-green-500/30 hover:from-green-500 hover:to-emerald-500 transition-all duration-300 transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 border border-white/10"
            >
              {loading ? <Loader className="animate-spin" size={20} /> : (
                <>
                  {view === 'forgot-password' ? 'Send Recovery Link' : (view === 'login' ? 'Sign In' : 'Create Account')}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            {view === 'forgot-password' ? (
              <button
                onClick={() => setView('login')}
                className="text-gray-400 hover:text-white flex items-center justify-center gap-2 mx-auto text-sm font-medium transition-all hover:-translate-x-1"
              >
                <ArrowLeft size={16} /> Back to Login
              </button>
            ) : (
              <p className="text-gray-400 text-sm">
                {view === 'login' ? "Don't have an account? " : "Already have an account? "}
                {view === 'login' ? (
                  <span className="text-gray-500 italic ml-1">Contact your FPO/Admin to register.</span>
                ) : (
                  <button
                    onClick={() => setView('login')}
                    className="text-green-400 font-bold hover:text-green-300 hover:underline transition-all"
                  >
                    Log In
                  </button>
                )}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
