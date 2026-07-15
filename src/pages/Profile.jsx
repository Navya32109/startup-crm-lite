import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import { toast } from 'react-hot-toast';
import { 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Building, 
  FileText, 
  Edit3, 
  CheckCircle,
  X
} from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  
  // State for modal toggle
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // State for extra profile fields not stored in DB schema
  const [profileExtra, setProfileExtra] = useState({
    phone: '',
    jobPosition: '',
    organization: '',
    directPhone: '',
    bio: ''
  });

  // State for edit form inputs
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    jobPosition: '',
    organization: '',
    directPhone: '',
    bio: ''
  });

  // Load user data on mount
  useEffect(() => {
    if (user) {
      // Load extra info from localStorage based on user email or ID
      const storedExtra = localStorage.getItem(`crm-profile-extra-${user._id || user.email}`);
      const extra = storedExtra ? JSON.parse(storedExtra) : {
        phone: '+1 (555) 019-2834', // default demo phone
        jobPosition: user.role === 'admin' ? 'Senior CRM Administrator' : 'Lead Sales Representative',
        organization: 'Startup CRM Lite',
        directPhone: '+1 (555) 019-2834',
        bio: 'Experienced professional managing sales pipelines, system configurations, and automation workflows. Passionate about optimization and data integrity.'
      };
      
      setProfileExtra(extra);
      setFormData({
        name: user.name || '',
        phone: extra.phone || '',
        jobPosition: extra.jobPosition || '',
        organization: extra.organization || '',
        directPhone: extra.directPhone || '',
        bio: extra.bio || ''
      });
    }
  }, [user]);

  // Compute initials for the avatar
  const getInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      toast.error('Name must be at least 2 characters long');
      return;
    }

    try {
      // 1. Call backend API to update the name (only field allowed on schema)
      const updateRes = await authService.updateProfile({ name: formData.name });
      
      if (updateRes.success) {
        // 2. Update local storage for extra fields
        const extraToSave = {
          phone: formData.phone,
          jobPosition: formData.jobPosition,
          organization: formData.organization,
          directPhone: formData.directPhone,
          bio: formData.bio
        };
        localStorage.setItem(`crm-profile-extra-${user._id || user.email}`, JSON.stringify(extraToSave));
        
        // 3. Update local state
        setProfileExtra(extraToSave);
        
        toast.success('Profile updated successfully!');
        setIsEditModalOpen(false);
        // Force refresh to restore updated user session from backend
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } else {
        toast.error(updateRes.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('[Profile] Error updating profile details:', err);
      toast.error(err.response?.data?.message || 'An error occurred while updating profile.');
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="h-8 w-8 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin"></div>
      </div>
    );
  }

  const userRoleDisplay = user.role === 'admin' ? 'CRM Administrator' : 'Sales Professional';

  return (
    <div className="space-y-6 pb-12">
      {/* ================= TOP NAVIGATION / BREADCRUMBS ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <nav className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">
            <span className="hover:text-gray-900 dark:hover:text-white cursor-pointer" onClick={() => window.location.href='/'}>Home</span>
            <span className="mx-2">/</span>
            <span className="text-gray-800 dark:text-gray-300 font-medium">User Profile</span>
          </nav>
          <h1 className="text-3xl font-display font-black tracking-tight text-gray-900 dark:text-white">
            User Profile
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Manage your personal credentials, contact info, and profile overview details.
          </p>
        </div>

        {/* Edit Profile Action Button */}
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl cursor-pointer shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-95 transition-all self-start sm:self-center"
        >
          <Edit3 size={14} />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* ================= MAIN PROFILE GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Avatar & Overview Summary Card */}
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/80 dark:border-gray-700/80 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col items-center text-center">
          {/* Avatar Container */}
          <div className="relative">
            <div className="h-28 w-28 md:h-32 md:w-32 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-650 flex items-center justify-center font-bold text-white text-3xl sm:text-4xl shadow-xl shadow-blue-500/10 ring-4 ring-white dark:ring-gray-800 select-none">
              {getInitials()}
            </div>
            {/* Online Indicator Status Dot */}
            <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-800"></span>
          </div>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-5">
            {user.name}
          </h2>
          <p className="text-xs text-gray-550 dark:text-gray-400 mt-1 uppercase tracking-wider font-semibold">
            {userRoleDisplay}
          </p>

          {/* Verified CRM Administrator badge */}
          <div className="mt-3 inline-flex items-center gap-1 bg-blue-50/70 dark:bg-blue-955/20 text-blue-650 dark:text-blue-400 border border-blue-150 dark:border-blue-900 text-[10px] font-bold px-3 py-1 rounded-full">
            <CheckCircle size={10} className="text-blue-600 dark:text-blue-400 shrink-0" />
            <span>Verified CRM Administrator</span>
          </div>

          <div className="border-t border-gray-150 dark:border-gray-750/80 w-full my-6"></div>

          {/* Quick Contact Info Details */}
          <div className="w-full space-y-4 text-left">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gray-50 dark:bg-gray-900/60 border border-gray-150 dark:border-gray-755 flex items-center justify-center text-gray-500 dark:text-gray-400 shrink-0">
                <Mail size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-semibold">Email Address</p>
                <p className="text-xs text-gray-805 dark:text-gray-250 font-medium truncate">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gray-50 dark:bg-gray-900/60 border border-gray-150 dark:border-gray-755 flex items-center justify-center text-gray-500 dark:text-gray-400 shrink-0">
                <Phone size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-semibold">Phone Number</p>
                <p className="text-xs text-gray-805 dark:text-gray-250 font-medium truncate">{profileExtra.phone || 'Not Specified'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gray-50 dark:bg-gray-900/60 border border-gray-150 dark:border-gray-755 flex items-center justify-center text-gray-500 dark:text-gray-400 shrink-0">
                <Building size={14} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-gray-400 dark:text-gray-550 uppercase font-semibold">Organization</p>
                <p className="text-xs text-gray-805 dark:text-gray-255 font-medium truncate">{profileExtra.organization || 'Not Specified'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Account Overview Details & Bio Card */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 1: Account Overview */}
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/80 dark:border-gray-700/80 rounded-3xl p-6 sm:p-8 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">
              Account Overview
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-wider">Full Name</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-1">{user.name}</p>
              </div>

              <div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-wider">Email Address</p>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mt-1">{user.email}</p>
              </div>

              <div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-wider">Job Position</p>
                <div className="flex items-center gap-1.5 mt-1 text-gray-800 dark:text-gray-200">
                  <Briefcase size={14} className="text-gray-450 dark:text-gray-500 shrink-0" />
                  <span className="text-sm font-semibold">{profileExtra.jobPosition || 'Not Specified'}</span>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-wider">Organization</p>
                <div className="flex items-center gap-1.5 mt-1 text-gray-800 dark:text-gray-200">
                  <Building size={14} className="text-gray-455 dark:text-gray-500 shrink-0" />
                  <span className="text-sm font-semibold">{profileExtra.organization || 'Not Specified'}</span>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-wider">Direct Phone</p>
                <div className="flex items-center gap-1.5 mt-1 text-gray-800 dark:text-gray-200">
                  <Phone size={14} className="text-gray-450 dark:text-gray-500 shrink-0" />
                  <span className="text-sm font-semibold">{profileExtra.directPhone || 'Not Specified'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Biography Section */}
          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/80 dark:border-gray-700/80 rounded-3xl p-6 sm:p-8 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
              <FileText size={18} className="text-blue-600 dark:text-blue-500 shrink-0" />
              Biography
            </h3>
            
            <p className="text-sm text-gray-600 dark:text-gray-305 leading-relaxed font-normal">
              {profileExtra.bio || 'No biography details provided yet. Click "Edit Profile" to add your biography.'}
            </p>
          </div>

        </div>

      </div>

      {/* ================= EDIT PROFILE MODAL ================= */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Dim Overlay */}
          <div className="fixed inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm" onClick={() => setIsEditModalOpen(false)}></div>

          {/* Modal Container */}
          <div className="relative w-full max-w-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden z-10 animate-scale-up">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-150 dark:border-gray-750">
              <h3 className="text-base font-bold text-gray-950 dark:text-white">Edit Profile Details</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-white transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              
              {/* Name */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1.5">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. John Doe"
                  className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-blue-500 rounded-xl px-3 py-2.5 text-xs text-gray-955 dark:text-white outline-none transition-all"
                  required
                />
              </div>

              {/* Job Position */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1.5">Job Position</label>
                <input
                  type="text"
                  name="jobPosition"
                  value={formData.jobPosition}
                  onChange={handleInputChange}
                  placeholder="e.g. Sales Executive"
                  className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-blue-500 rounded-xl px-3 py-2.5 text-xs text-gray-955 dark:text-white outline-none transition-all"
                />
              </div>

              {/* Organization */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1.5">Organization</label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  placeholder="e.g. Startup Corp"
                  className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-blue-500 rounded-xl px-3 py-2.5 text-xs text-gray-955 dark:text-white outline-none transition-all"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1.5">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="e.g. +1 (555) 000-0000"
                  className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-blue-500 rounded-xl px-3 py-2.5 text-xs text-gray-955 dark:text-white outline-none transition-all"
                />
              </div>

              {/* Direct Phone */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1.5">Direct Phone</label>
                <input
                  type="text"
                  name="directPhone"
                  value={formData.directPhone}
                  onChange={handleInputChange}
                  placeholder="e.g. +1 (555) 000-0000"
                  className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-blue-500 rounded-xl px-3 py-2.5 text-xs text-gray-955 dark:text-white outline-none transition-all"
                />
              </div>

              {/* Biography */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wide mb-1.5">Biography</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-blue-500 rounded-xl px-3 py-2.5 text-xs text-gray-955 dark:text-white outline-none transition-all resize-none font-normal"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-150 dark:border-gray-750 mt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs font-semibold px-4 py-2.5 rounded-xl cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl cursor-pointer shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-95 transition-all"
                >
                  Save Changes
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
