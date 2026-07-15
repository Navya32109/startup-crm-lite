import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader2, Target, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';

/**
 * Login Page Component
 * Renders a premium, glassmorphic auth panel featuring animated glowing grids,
 * dynamic gradient headers, inline validation, and responsiveness across viewports.
 */
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  // Input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  /**
   * Action: Authenticates credentials, showing toast updates and route redirects.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Pre-flight client checks
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both your email and password.');
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('Verifying credentials...');

    try {
      const result = await login(email.trim(), password);
      
      if (result.success) {
        toast.success('Welcome back to Startup CRM!', { id: loadingToast });
        navigate('/');
      } else {
        setErrorMsg(result.message || 'Login failed. Please try again.');
        toast.error(result.message || 'Invalid credentials.', { id: loadingToast });
      }
    } catch (error) {
      console.error('[Login] Unexpected form submission failure:', error);
      setErrorMsg('An unexpected error occurred. Please try again.');
      toast.error('An unexpected error occurred.', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 relative overflow-hidden transition-colors duration-300">
      
      {/* Decorative background aura lights */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-blue-600/10 dark:bg-blue-500/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 dark:bg-indigo-500/10 blur-[120px] pointer-events-none"></div>

      {/* Main Form container panel (Glassmorphism layout) */}
      <div className="w-full max-w-md bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/60 dark:border-gray-800/60 rounded-3xl p-8 shadow-2xl relative z-10 animate-fade-in">
        
        {/* Brand Header Logo */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 mb-3 hover:rotate-6 transition-all duration-300">
            <Target size={24} className="animate-pulse" />
          </div>
          <h2 className="text-2xl font-display font-black tracking-tight text-slate-900 dark:text-white">
            Startup CRM <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Lite</span>
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 max-w-[280px]">
            Stateless operational deal tracking platform for modern founders.
          </p>
        </div>

        {/* Global form level errors alerts */}
        {errorMsg && (
          <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/20 text-[#EF4444] rounded-xl text-xs font-semibold flex items-center gap-2 select-none animate-shake">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0"></span>
            <p>{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          
          {/* Email input field */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-550">
                <Mail size={16} />
              </span>
              <input
                type="email"
                placeholder="john.doe@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500/80 text-gray-900 dark:text-white placeholder-gray-400/80 transition-all font-medium"
              />
            </div>
          </div>

          {/* Password input field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-550">
                <Lock size={16} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
                className="w-full pl-11 pr-11 py-3 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500/80 text-gray-900 dark:text-white placeholder-gray-400/80 transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                disabled={isSubmitting}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl cursor-pointer shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 select-none h-11"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Verifying user details...</span>
              </>
            ) : (
              <span>Sign In to Dashboard</span>
            )}
          </button>

        </form>

        {/* Form redirection footer link */}
        <div className="mt-6 pt-5 border-t border-gray-200/50 dark:border-gray-800/60 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            First time setting up your startup?{' '}
            <Link
              to="/register"
              className="font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-0.5"
            >
              Register here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
