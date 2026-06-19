import { useState, useEffect } from 'react';
import { Save, AlertCircle } from 'lucide-react';

/**
 * @typedef {Object} LeadFormProps
 * @property {Object} [initialData] - Optional initial data when editing an existing lead.
 * @property {function(Object):void} onSubmit - Callback function executed upon successful form validation and submission.
 * @property {function():void} onCancel - Callback function executed when canceling or closing the form.
 */

/**
 * LeadForm Component
 * Renders a standard modal/sheet form for creating or editing a lead record.
 * Handles validation of required fields (Name, Company, Email) and renders inline error messages.
 * 
 * @param {LeadFormProps} props - The component parameters.
 * @returns {React.JSX.Element} The rendered lead form.
 */
export default function LeadForm({ initialData, onSubmit, onCancel }) {
  // Define required select options as requested
  const statusOptions = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];
  const sourceOptions = ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'];

  // Input states
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('New');
  const [source, setSource] = useState('Website');
  const [value, setValue] = useState('');

  // Validation errors state
  const [errors, setErrors] = useState({});

  // Sync inputs with edit values when initialData updates
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setCompany(initialData.company || '');
      setEmail(initialData.email || '');
      setPhone(initialData.phone || '');
      setStatus(initialData.status || 'New');
      setSource(initialData.source || 'Website');
      setValue(initialData.value !== undefined ? String(initialData.value) : '');
    } else {
      // Clear inputs for create mode
      setName('');
      setCompany('');
      setEmail('');
      setPhone('');
      setStatus('New');
      setSource('Website');
      setValue('');
    }
    setErrors({});
  }, [initialData]);

  /**
   * Performs form validations.
   * Required fields: Name, Company, Email (with syntax verification).
   * 
   * @returns {boolean} True if form validates successfully.
   */
  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Prospect Name is required.';
    }
    if (!company.trim()) {
      newErrors.company = 'Company name is required.';
    }
    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submit action.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        name: name.trim(),
        company: company.trim(),
        email: email.trim(),
        phone: phone.trim(),
        status,
        source,
        value: value ? Number(value) : 0
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      
      {/* Name Input */}
      <div>
        <label className="block text-[10px] font-bold text-gray-450 dark:text-gray-500 uppercase tracking-wider mb-1">
          Prospect Name <span className="text-[#EF4444]">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (errors.name) setErrors(prev => ({ ...prev, name: null }));
          }}
          placeholder="e.g. John Doe"
          className={`w-full px-3.5 py-3 md:py-2.5 bg-gray-50 dark:bg-gray-900 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-white placeholder-gray-400/80 transition-all ${
            errors.name ? 'border-[#EF4444] focus:border-[#EF4444]' : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500/80'
          }`}
          aria-invalid={errors.name ? 'true' : 'false'}
        />
        {errors.name && (
          <p className="mt-1 text-[10px] text-[#EF4444] font-semibold flex items-center gap-1 select-none">
            <AlertCircle size={10} /> {errors.name}
          </p>
        )}
      </div>

      {/* Company Input */}
      <div>
        <label className="block text-[10px] font-bold text-gray-455 dark:text-gray-500 uppercase tracking-wider mb-1">
          Company Name <span className="text-[#EF4444]">*</span>
        </label>
        <input
          type="text"
          value={company}
          onChange={(e) => {
            setCompany(e.target.value);
            if (errors.company) setErrors(prev => ({ ...prev, company: null }));
          }}
          placeholder="e.g. Acme Corp"
          className={`w-full px-3.5 py-3 md:py-2.5 bg-gray-50 dark:bg-gray-900 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-white placeholder-gray-400/80 transition-all ${
            errors.company ? 'border-[#EF4444] focus:border-[#EF4444]' : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500/80'
          }`}
          aria-invalid={errors.company ? 'true' : 'false'}
        />
        {errors.company && (
          <p className="mt-1 text-[10px] text-[#EF4444] font-semibold flex items-center gap-1 select-none">
            <AlertCircle size={10} /> {errors.company}
          </p>
        )}
      </div>

      {/* Email Input */}
      <div>
        <label className="block text-[10px] font-bold text-gray-455 dark:text-gray-500 uppercase tracking-wider mb-1">
          Email Address <span className="text-[#EF4444]">*</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors(prev => ({ ...prev, email: null }));
          }}
          placeholder="john.doe@company.com"
          className={`w-full px-3.5 py-3 md:py-2.5 bg-gray-50 dark:bg-gray-900 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-white placeholder-gray-400/80 transition-all ${
            errors.email ? 'border-[#EF4444] focus:border-[#EF4444]' : 'border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500/80'
          }`}
          aria-invalid={errors.email ? 'true' : 'false'}
        />
        {errors.email && (
          <p className="mt-1 text-[10px] text-[#EF4444] font-semibold flex items-center gap-1 select-none">
            <AlertCircle size={10} /> {errors.email}
          </p>
        )}
      </div>

      {/* Phone Input */}
      <div>
        <label className="block text-[10px] font-bold text-gray-455 dark:text-gray-500 uppercase tracking-wider mb-1">
          Phone Number
        </label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+1 (555) 000-0000"
          className="w-full px-3.5 py-3 md:py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-blue-500 dark:focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-white placeholder-gray-400/80 transition-all"
        />
      </div>

      {/* Select Dropdowns Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Status Dropdown */}
        <div>
          <label className="block text-[10px] font-bold text-gray-455 dark:text-gray-500 uppercase tracking-wider mb-1">
            Stage Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-3 md:py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-blue-500 dark:focus:border-blue-500/80 text-gray-900 dark:text-white cursor-pointer"
          >
            {statusOptions.map(option => (
              <option key={option} value={option} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">{option}</option>
            ))}
          </select>
        </div>

        {/* Source Dropdown */}
        <div>
          <label className="block text-[10px] font-bold text-gray-455 dark:text-gray-500 uppercase tracking-wider mb-1">
            Referral Source
          </label>
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full px-3 py-3 md:py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-blue-500 dark:focus:border-blue-500/80 text-gray-900 dark:text-white cursor-pointer"
          >
            {sourceOptions.map(option => (
              <option key={option} value={option} className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">{option}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Value Input */}
      <div>
        <label className="block text-[10px] font-bold text-gray-455 dark:text-gray-500 uppercase tracking-wider mb-1">
          Pipeline Deal Value ($)
        </label>
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. 25000"
          className="w-full px-3.5 py-3 md:py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-blue-500 dark:focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-white placeholder-gray-400/80 transition-all"
        />
      </div>

      {/* Actions Buttons Container */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-3 md:px-4 md:py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-750 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer active:scale-95 transition-all text-xs animate-none"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-3 md:px-4 md:py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl cursor-pointer shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-95 transition-all text-xs flex items-center gap-1.5"
        >
          <Save size={14} />
          <span>{initialData ? 'Save Changes' : 'Create Lead'}</span>
        </button>
      </div>

    </form>
  );
}
