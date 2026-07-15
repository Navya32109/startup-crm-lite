import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import authService from '../services/authService';
import { toast } from 'react-hot-toast';
import { 
  Building, 
  DollarSign, 
  Globe, 
  Lock, 
  Palette, 
  Bell, 
  Save, 
  ShieldAlert,
  Moon,
  Sun,
  Eye,
  EyeOff
} from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  // Active tab state: 'account' | 'security' | 'appearance' | 'notifications'
  const [activeTab, setActiveTab] = useState('account');

  // 1. Account Settings State
  const [accountSettings, setAccountSettings] = useState({
    organizationName: 'Startup CRM Lite',
    currency: 'USD ($)',
    timezone: 'UTC (GMT+0)'
  });

  // 2. Security Settings State (Change Password)
  const [securityData, setSecurityData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 3. Appearance Settings State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // 4. Notifications Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    pushNotifications: false,
    weeklyDigest: true
  });

  // Load existing settings on mount
  useEffect(() => {
    if (user) {
      // Load account settings from localStorage or fallback to defaults
      const storedAccount = localStorage.getItem(`crm-settings-account-${user._id || user.email}`);
      if (storedAccount) {
        setAccountSettings(JSON.parse(storedAccount));
      }

      // Load appearance preferences
      const storedSidebar = localStorage.getItem(`crm-settings-sidebar-collapsed-${user._id || user.email}`);
      if (storedSidebar) {
        setSidebarCollapsed(storedSidebar === 'true');
      }

      // Load notification settings
      const storedNotifications = localStorage.getItem(`crm-settings-notifications-${user._id || user.email}`);
      if (storedNotifications) {
        setNotificationSettings(JSON.parse(storedNotifications));
      }
    }
  }, [user]);

  // Handle Account Settings Save
  const handleSaveAccount = (e) => {
    e.preventDefault();
    if (!accountSettings.organizationName.trim()) {
      toast.error('Organization Name cannot be empty');
      return;
    }
    localStorage.setItem(
      `crm-settings-account-${user._id || user.email}`,
      JSON.stringify(accountSettings)
    );
    toast.success('Account settings saved successfully!');
  };

  // Handle Password Change Save
  const handleSaveSecurity = async (e) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmPassword } = securityData;

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('All password fields are required');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      const response = await authService.updateProfile({
        oldPassword,
        password: newPassword
      });

      if (response.success) {
        toast.success('Password updated successfully!');
        setSecurityData({
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        toast.error(response.message || 'Failed to update password');
      }
    } catch (err) {
      console.error('[Settings] Password update failure:', err);
      toast.error(err.response?.data?.message || 'Failed to update password. Verify old password.');
    }
  };

  // Handle Appearance Settings Save
  const handleSaveAppearance = (e) => {
    e.preventDefault();
    localStorage.setItem(`crm-settings-sidebar-collapsed-${user._id || user.email}`, String(sidebarCollapsed));
    toast.success('Appearance settings saved!');
  };

  // Handle Notifications Settings Save
  const handleSaveNotifications = (e) => {
    e.preventDefault();
    localStorage.setItem(
      `crm-settings-notifications-${user._id || user.email}`,
      JSON.stringify(notificationSettings)
    );
    toast.success('Notification settings saved!');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ================= HEADER AREA ================= */}
      <div>
        <nav className="text-xs text-gray-550 dark:text-gray-400 mb-1.5">
          <span className="hover:text-gray-900 dark:hover:text-white cursor-pointer" onClick={() => window.location.href='/'}>Home</span>
          <span className="mx-2">/</span>
          <span className="text-gray-800 dark:text-gray-300 font-medium">Workspace Settings</span>
        </nav>
        <h1 className="text-3xl font-display font-black tracking-tight text-gray-900 dark:text-white">
          Workspace Settings
        </h1>
        <p className="text-xs text-gray-550 dark:text-gray-400 mt-1">
          Configure agency metadata, security credentials, visual themes, and alerts.
        </p>
      </div>

      {/* ================= SETTINGS TABS WRAPPER ================= */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Sidebar/Left Tabs list */}
        <div className="w-full lg:w-64 shrink-0 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/80 dark:border-gray-700/80 rounded-2xl p-2.5 shadow-md space-y-1">
          {[
            { id: 'account', label: 'Account', icon: Building },
            { id: 'security', label: 'Security', icon: Lock },
            { id: 'appearance', label: 'Appearance', icon: Palette },
            { id: 'notifications', label: 'Notifications', icon: Bell }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900/40 hover:text-gray-950 dark:hover:text-white'
                }`}
              >
                <Icon size={14} className="shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Active Content Panel */}
        <div className="flex-1 w-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/80 dark:border-gray-700/80 rounded-3xl p-6 sm:p-8 shadow-xl">
          
          {/* ================= 1. ACCOUNT TAB ================= */}
          {activeTab === 'account' && (
            <form onSubmit={handleSaveAccount} className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-950 dark:text-white flex items-center gap-2 mb-1">
                  <Building size={16} className="text-blue-600 dark:text-blue-500" />
                  Account Settings
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Configure agency information and profile localization preferences.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                
                {/* Organization Name */}
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1.5">Organization / Agency Name</label>
                  <input
                    type="text"
                    value={accountSettings.organizationName}
                    onChange={(e) => setAccountSettings(prev => ({ ...prev, organizationName: e.target.value }))}
                    className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-blue-500 rounded-xl px-3 py-2.5 text-xs text-gray-955 dark:text-white outline-none transition-all"
                    required
                  />
                </div>

                {/* Default Currency */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1.5">Default Currency</label>
                  <div className="relative">
                    <select
                      value={accountSettings.currency}
                      onChange={(e) => setAccountSettings(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-blue-500 rounded-xl px-3 py-2.5 text-xs text-gray-955 dark:text-white outline-none transition-all appearance-none"
                    >
                      {['USD ($)', 'EUR (€)', 'GBP (£)', 'INR (₹)', 'CAD ($)', 'AUD ($)', 'JPY (¥)'].map(curr => (
                        <option key={curr} value={curr}>{curr}</option>
                      ))}
                    </select>
                    <DollarSign size={14} className="absolute right-3 top-3 text-gray-400 dark:text-gray-500 pointer-events-none" />
                  </div>
                </div>

                {/* Timezone */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-550 uppercase tracking-wide mb-1.5">Timezone</label>
                  <div className="relative">
                    <select
                      value={accountSettings.timezone}
                      onChange={(e) => setAccountSettings(prev => ({ ...prev, timezone: e.target.value }))}
                      className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-blue-500 rounded-xl px-3 py-2.5 text-xs text-gray-955 dark:text-white outline-none transition-all appearance-none"
                    >
                      {[
                        'UTC (GMT+0)',
                        'EST (GMT-5) - Eastern Time',
                        'CST (GMT-6) - Central Time',
                        'MST (GMT-7) - Mountain Time',
                        'PST (GMT-8) - Pacific Time',
                        'IST (GMT+5:30) - India',
                        'AEST (GMT+10) - Sydney'
                      ].map(tz => (
                        <option key={tz} value={tz}>{tz}</option>
                      ))}
                    </select>
                    <Globe size={14} className="absolute right-3 top-3 text-gray-400 dark:text-gray-550 pointer-events-none" />
                  </div>
                </div>

              </div>

              <div className="flex justify-end pt-4 border-t border-gray-150 dark:border-gray-750">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl cursor-pointer shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-95 transition-all"
                >
                  <Save size={14} />
                  <span>Save Account Settings</span>
                </button>
              </div>
            </form>
          )}

          {/* ================= 2. SECURITY TAB ================= */}
          {activeTab === 'security' && (
            <form onSubmit={handleSaveSecurity} className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-955 dark:text-white flex items-center gap-2 mb-1">
                  <Lock size={16} className="text-blue-600 dark:text-blue-500" />
                  Security Settings
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Update your account credentials and password security settings.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                
                {/* Old Password */}
                <div className="sm:col-span-2 relative">
                  <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1.5">Current Password</label>
                  <div className="relative">
                    <input
                      type={showOldPassword ? 'text' : 'password'}
                      value={securityData.oldPassword}
                      onChange={(e) => setSecurityData(prev => ({ ...prev, oldPassword: e.target.value }))}
                      className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-blue-500 rounded-xl px-3 py-2.5 text-xs text-gray-955 dark:text-white outline-none transition-all pr-10"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 dark:text-gray-500 hover:text-gray-650 dark:hover:text-white cursor-pointer"
                    >
                      {showOldPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="relative">
                  <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1.5">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={securityData.newPassword}
                      onChange={(e) => setSecurityData(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-blue-500 rounded-xl px-3 py-2.5 text-xs text-gray-955 dark:text-white outline-none transition-all pr-10"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 dark:text-gray-500 hover:text-gray-650 dark:hover:text-white cursor-pointer"
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1.5">Confirm New Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={securityData.confirmPassword}
                      onChange={(e) => setSecurityData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:border-blue-500 rounded-xl px-3 py-2.5 text-xs text-gray-955 dark:text-white outline-none transition-all pr-10"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 dark:text-gray-500 hover:text-gray-650 dark:hover:text-white cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

              </div>

              {/* Security Hint */}
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-[10px] text-amber-600 dark:text-amber-450 leading-relaxed font-normal">
                <ShieldAlert size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <span>Make sure your new password is at least 6 characters long and includes numbers or special characters. Never reuse existing passwords across other workspaces.</span>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-150 dark:border-gray-750">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl cursor-pointer shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-95 transition-all"
                >
                  <Save size={14} />
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          )}

          {/* ================= 3. APPEARANCE TAB ================= */}
          {activeTab === 'appearance' && (
            <form onSubmit={handleSaveAppearance} className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-955 dark:text-white flex items-center gap-2 mb-1">
                  <Palette size={16} className="text-blue-600 dark:text-blue-500" />
                  Appearance Settings
                </h3>
                <p className="text-xs text-gray-550 dark:text-gray-400">Customize the visual theme and sidebar layout controls.</p>
              </div>

              {/* Theme Settings Selector Cards */}
              <div className="space-y-4 pt-2">
                <label className="block text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Color Theme</label>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Light theme selector card */}
                  <button
                    type="button"
                    onClick={() => { if (isDark) toggleTheme(); }}
                    className={`flex flex-col items-center justify-center p-5 rounded-2xl border text-center transition-all cursor-pointer ${
                      !isDark 
                        ? 'bg-blue-50/40 border-blue-500 dark:border-blue-550 text-blue-600 shadow-sm'
                        : 'bg-transparent border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900/20'
                    }`}
                  >
                    <Sun size={24} className="mb-2 shrink-0" />
                    <span className="text-xs font-bold">Light Theme</span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">Clean and high visibility</span>
                  </button>

                  {/* Dark theme selector card */}
                  <button
                    type="button"
                    onClick={() => { if (!isDark) toggleTheme(); }}
                    className={`flex flex-col items-center justify-center p-5 rounded-2xl border text-center transition-all cursor-pointer ${
                      isDark 
                        ? 'bg-blue-950/20 border-blue-500 dark:border-blue-550 text-blue-400 shadow-sm'
                        : 'bg-transparent border-gray-200 dark:border-gray-700 text-gray-650 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-900/20'
                    }`}
                  >
                    <Moon size={24} className="mb-2 shrink-0" />
                    <span className="text-xs font-bold">Dark Theme</span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">Sleek look for late nights</span>
                  </button>
                </div>
              </div>

              {/* Sidebar toggle config */}
              <div className="pt-4 border-t border-gray-150 dark:border-gray-750 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-gray-900 dark:text-white leading-tight">Collapsible Sidebar</label>
                    <span className="text-[10px] text-gray-450 dark:text-gray-500 font-normal leading-normal">Enable shrinking the desktop sidebar to an icon-only strip.</span>
                  </div>
                  <div className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={sidebarCollapsed}
                      onChange={(e) => setSidebarCollapsed(e.target.checked)}
                      className="sr-only peer"
                      id="sidebar-collapsed-toggle"
                    />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-150 dark:border-gray-750">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl cursor-pointer shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-95 transition-all"
                >
                  <Save size={14} />
                  <span>Save Appearance Settings</span>
                </button>
              </div>
            </form>
          )}

          {/* ================= 4. NOTIFICATIONS TAB ================= */}
          {activeTab === 'notifications' && (
            <form onSubmit={handleSaveNotifications} className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-955 dark:text-white flex items-center gap-2 mb-1">
                  <Bell size={16} className="text-blue-600 dark:text-blue-500" />
                  Notification Preferences
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Control when and how you receive alerts about lead status updates and pipeline reports.</p>
              </div>

              <div className="space-y-5 pt-2">
                
                {/* Email Toggles */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-gray-900 dark:text-white leading-tight">Email Alerts</label>
                    <span className="text-[10px] text-gray-450 dark:text-gray-500 font-normal leading-normal">Receive emails when new leads are registered or assigned.</span>
                  </div>
                  <div className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailAlerts}
                      onChange={(e) => setNotificationSettings(prev => ({ ...prev, emailAlerts: e.target.checked }))}
                      className="sr-only peer"
                      id="email-alerts-toggle"
                    />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </div>
                </div>

                <div className="border-t border-gray-150 dark:border-gray-750/80 my-2"></div>

                {/* Push Notifications Toggles */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-gray-900 dark:text-white leading-tight">Desktop Push Notifications</label>
                    <span className="text-[10px] text-gray-455 dark:text-gray-500 font-normal leading-normal">Get instant browser popups for critical deal status movements.</span>
                  </div>
                  <div className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={notificationSettings.pushNotifications}
                      onChange={(e) => setNotificationSettings(prev => ({ ...prev, pushNotifications: e.target.checked }))}
                      className="sr-only peer"
                      id="push-notifications-toggle"
                    />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </div>
                </div>

                <div className="border-t border-gray-150 dark:border-gray-750/80 my-2"></div>

                {/* Weekly Report Toggles */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-gray-900 dark:text-white leading-tight">Weekly Digest Reports</label>
                    <span className="text-[10px] text-gray-455 dark:text-gray-500 font-normal leading-normal">Receive a compiled summary email of weekly growth and sales performance analytics.</span>
                  </div>
                  <div className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={notificationSettings.weeklyDigest}
                      onChange={(e) => setNotificationSettings(prev => ({ ...prev, weeklyDigest: e.target.checked }))}
                      className="sr-only peer"
                      id="weekly-digest-toggle"
                    />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </div>
                </div>

              </div>

              <div className="flex justify-end pt-4 border-t border-gray-150 dark:border-gray-750">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl cursor-pointer shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-95 transition-all"
                >
                  <Save size={14} />
                  <span>Save Notification Preferences</span>
                </button>
              </div>
            </form>
          )}

        </div>

      </div>

    </div>
  );
}
