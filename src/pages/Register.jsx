import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Loader2, Target, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';

/**
 * Register Page Component
 * Renders the signup panel, complete with robust client-side validation rules
 * (matching passwords, length constraint $\ge$ 6), inline alerts, and premium aesthetics.
 */
export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  // Input states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  /**
   * Action: Handles client-side validations and triggers registration endpoint.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // 1. Password length verification
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    // 2. Password matching check
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify your inputs.');
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading('Creating your workspace account...');

    try {
      const result = await register(name.trim(), email.trim(), password);

      if (result.success) {
        toast.success('Workspace registered successfully! Welcome.', { id: loadingToast });
        navigate('/');
      } else {
        setErrorMsg(result.message || 'Registration failed. Try again.');
        toast.error(result.message || 'Registration failed.', { id: loadingToast });
      }
    } catch (error) {
      console.error('[Register] Unexpected form submission failure:', error);
      setErrorMsg('An unexpected error occurred. Please try again.');
      toast.error('An unexpected error occurred.', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-gray-955 p-4 relative overflow-hidden transition-colors duration-300">
      
      {/* Background radial aura glows */}
      <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-blue-600/10 dark:bg-blue-500/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 dark:bg-indigo-500/10 blur-[120px] pointer-events-none"></div>

      {/* Main glassmorphism register container sheet */}
      <div className="w-full max-w-md bg-white/80 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-200/60 dark:border-gray-800/60 rounded-3xl p-8 shadow-2xl relative z-10 animate-fade-in">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 mb-3 hover:rotate-6 transition-all duration-300">
            <Target size={22} />
          </div>
          <h2 className="text-xl font-display font-black tracking-tight text-slate-900 dark:text-white">
            Create CRM Workspace
          </h2>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 max-w-[280px]">
            Set up your startup credentials to begin pipeline evaluations.
          </p>
        </div>

        {/* Inline client validation warnings */}
        {errorMsg && (
          <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/20 text-[#EF4444] rounded-xl text-xs font-semibold flex items-center gap-2 select-none animate-shake">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0"></span>
            <p>{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4.5 text-xs">
          
          {/* Full Name Input */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Workspace Administrator Name
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-550">
                <User size={16} />
              </span>
              <input
                type="text"
                placeholder="e.g. Alex Mercer"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isSubmitting}
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500/80 text-gray-900 dark:text-white placeholder-gray-400/80 transition-all font-medium"
              />
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Work Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-550">
                <Mail size={16} />
              </span>
              <input
                type="email"
                placeholder="alex@startup.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-gray-955 border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500/80 text-gray-900 dark:text-white placeholder-gray-400/80 transition-all font-medium"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Security Password (min 6 chars)
            </label>
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
                className="w-full pl-11 pr-11 py-2.5 bg-gray-50 dark:bg-gray-955 border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500/80 text-gray-900 dark:text-white placeholder-gray-400/80 transition-all font-medium"
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

          {/* Confirm Password Input */}
          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Verify Security Password
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-550">
                <Lock size={16} />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isSubmitting}
                className="w-full pl-11 pr-4 py-2.5 bg-gray-50 dark:bg-gray-955 border border-gray-200 dark:border-gray-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-500/80 text-gray-900 dark:text-white placeholder-gray-400/80 transition-all font-medium"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl cursor-pointer shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 select-none h-11 mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Configuring CRM workspace database...</span>
              </>
            ) : (
              <span>Initialize CRM Workspace</span>
            )}
          </button>

        </form>

        {/* Footer redirection links */}
        <div className="mt-6 pt-5 border-t border-gray-200/50 dark:border-gray-800/60 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Already established your credentials?{' '}
            <Link
              to="/login"
              className="font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-0.5"
            >
              Sign in here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
