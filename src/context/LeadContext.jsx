import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import leadService from '../services/leadService';
import { useAuth } from './AuthContext';

// Initialize the context
const LeadContext = createContext();

/**
 * LeadProvider Component
 * Manages the live state of leads retrieved from the database,
 * synchronizing mutations (creation, updates, status changes, notes, and deletions)
 * with the Express API and showing feedback toasts.
 */
export const LeadProvider = ({ children }) => {
  const LEADS_STORAGE_KEY = 'crm-leads';

  // Synchronous initialization of leads state from Local Storage
  const [leads, setLeads] = useState(() => {
    console.log(`Reading leads from key: ${LEADS_STORAGE_KEY}`);
    try {
      const stored = window.localStorage.getItem(LEADS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          console.log("Reading leads:", parsed);
          // Deduplicate IDs and validate entries
          const uniqueLeads = [];
          const seenIds = new Set();
          parsed.forEach(lead => {
            if (lead && (lead.id || lead._id)) {
              const id = lead.id || lead._id;
              if (!seenIds.has(id)) {
                seenIds.add(id);
                uniqueLeads.push(lead);
              }
            }
          });
          return uniqueLeads;
        } else {
          console.error(`Invalid leads format in key "${LEADS_STORAGE_KEY}": expected array, got`, parsed);
        }
      } else {
        console.log(`Leads storage is empty for key: ${LEADS_STORAGE_KEY}`);
      }
    } catch (err) {
      console.error(`Error parsing leads from key "${LEADS_STORAGE_KEY}":`, err);
      // Clear corrupted storage value
      try {
        window.localStorage.removeItem(LEADS_STORAGE_KEY);
      } catch (_) {}
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    pages: 1
  });

  const { user } = useAuth();

  // Cleanup duplicate or outdated keys on mount
  useEffect(() => {
    try {
      const outdatedKeys = ['leads', 'startup-crm-leads', 'startup-crm-lite-leads', 'crm_leads'];
      outdatedKeys.forEach(k => {
        if (window.localStorage.getItem(k)) {
          console.log(`Removing outdated Local Storage key: "${k}"`);
          window.localStorage.removeItem(k);
        }
      });
    } catch (e) {
      console.error('Error cleaning up outdated Local Storage keys:', e);
    }
  }, []);

  /**
   * Fetch leads list from the backend server using filters and queries.
   * 
   * @param {object} [params] - Filtering and pagination parameters.
   */
  const fetchLeads = async (params) => {
    setIsLoading(true);
    try {
      // Default to fetch a large count for local card/grid rendering
      const fetchParams = { limit: 1000, ...params };
      const response = await leadService.getLeads(fetchParams);
      if (response.success) {
        const newLeads = response.data;
        
        // Sync to Local Storage immediately
        console.log(`Saving leads list to key: ${LEADS_STORAGE_KEY}`);
        try {
          window.localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(newLeads));
          console.log("Updated Local Storage:", newLeads);
        } catch (writeErr) {
          console.error(`Failed to sync leads to key "${LEADS_STORAGE_KEY}":`, writeErr);
        }

        setLeads(newLeads);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (error) {
      console.error('[LeadContext] fetchLeads Error:', error);
      // Fallback to local storage if API call fails
      try {
        const stored = window.localStorage.getItem(LEADS_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            console.log("Reading leads (fallback):", parsed);
            setLeads(parsed);
            toast.success('Loaded leads from local storage cache.');
            return;
          }
        }
      } catch (_) {}
      toast.error('Failed to load leads from database.');
    } finally {
      setIsLoading(false);
    }
  };

  // Re-fetch leads whenever the authenticated user state changes (login/logout/refresh)
  useEffect(() => {
    if (user) {
      fetchLeads();
    } else {
      const storedToken = window.localStorage.getItem('crm-token');
      if (!storedToken) {
        setLeads([]);
      }
    }
  }, [user]);

  /**
   * Create a new lead record in the backend.
   * 
   * @param {object} leadData - Field properties of the new lead.
   */
  const addLead = async (leadData) => {
    try {
      const response = await leadService.createLead(leadData);
      if (response.success) {
        const newLead = response.data;
        console.log("Saving lead:", newLead);
        
        setLeads(prevLeads => {
          // Prevent duplicates
          const id = newLead.id || newLead._id;
          if (prevLeads.some(l => l.id === id || l._id === id)) {
            console.warn(`Lead with ID ${id} already exists in state.`);
            return prevLeads;
          }
          
          const updatedLeads = [newLead, ...prevLeads];
          
          try {
            console.log(`Saving leads list to key: ${LEADS_STORAGE_KEY}`);
            window.localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updatedLeads));
            console.log("Updated Local Storage:", updatedLeads);
          } catch (writeErr) {
            console.error(`Failed to save lead to key "${LEADS_STORAGE_KEY}":`, writeErr);
          }
          
          return updatedLeads;
        });

        toast.success(`Opportunity "${leadData.name}" created!`, {
          icon: '🎉',
          className: 'dark:bg-gray-900 dark:text-white dark:border dark:border-gray-700'
        });
      }
    } catch (error) {
      console.error('[LeadContext] addLead Error:', error);
      const errMsg = error.response?.data?.message || 'Failed to introduce lead.';
      toast.error(errMsg);
    }
  };

  /**
   * Update fields of an existing lead record.
   * 
   * @param {string} id - Lead identifier.
   * @param {object} updatedFields - Mapped properties to change.
   */
  const updateLead = async (id, updatedFields) => {
    try {
      const response = await leadService.updateLead(id, updatedFields);
      if (response.success) {
        const updatedLead = response.data;
        console.log("Saving lead (update):", updatedLead);
        
        setLeads(prevLeads => {
          const updatedLeads = prevLeads.map(lead => (lead.id === id || lead._id === id ? updatedLead : lead));
          
          try {
            console.log(`Saving leads list to key: ${LEADS_STORAGE_KEY}`);
            window.localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updatedLeads));
            console.log("Updated Local Storage:", updatedLeads);
          } catch (writeErr) {
            console.error(`Failed to save updated lead to key "${LEADS_STORAGE_KEY}":`, writeErr);
          }
          
          return updatedLeads;
        });

        toast.success(`Lead "${updatedFields.name || 'Details'}" updated successfully!`, {
          icon: '✅',
          className: 'dark:bg-gray-900 dark:text-white dark:border dark:border-gray-700'
        });
      }
    } catch (error) {
      console.error('[LeadContext] updateLead Error:', error);
      const errMsg = error.response?.data?.message || 'Failed to update lead details.';
      toast.error(errMsg);
    }
  };

  /**
   * Delete a lead record from database.
   * 
   * @param {string} id - Lead identifier.
   */
  const deleteLead = async (id) => {
    try {
      const targetLead = leads.find(l => l.id === id || l._id === id);
      const name = targetLead ? targetLead.name : 'Prospect';
      
      const response = await leadService.deleteLead(id);
      if (response.success) {
        console.log("Deleting lead ID:", id);
        if (targetLead) {
          console.log("Saving lead (delete):", targetLead);
        }
        
        setLeads(prevLeads => {
          const updatedLeads = prevLeads.filter(lead => lead.id !== id && lead._id !== id);
          
          try {
            console.log(`Saving leads list to key: ${LEADS_STORAGE_KEY}`);
            window.localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updatedLeads));
            console.log("Updated Local Storage:", updatedLeads);
          } catch (writeErr) {
            console.error(`Failed to sync deleted lead to key "${LEADS_STORAGE_KEY}":`, writeErr);
          }
          
          return updatedLeads;
        });

        toast.error(`"${name}" has been removed from the records.`, {
          icon: '🗑️',
          className: 'dark:bg-gray-900 dark:text-white dark:border dark:border-gray-700'
        });
      }
    } catch (error) {
      console.error('[LeadContext] deleteLead Error:', error);
      const errMsg = error.response?.data?.message || 'Failed to delete lead.';
      toast.error(errMsg);
    }
  };

  /**
   * Update only the status stage of a lead.
   * 
   * @param {string} id - Lead identifier.
   * @param {string} newStatus - The new CRM pipeline stage.
   */
  const updateLeadStatus = async (id, newStatus) => {
    try {
      const response = await leadService.updateLeadStatus(id, newStatus);
      if (response.success) {
        const updatedLead = response.data;
        console.log("Saving lead (status update):", updatedLead);
        
        setLeads(prevLeads => {
          const updatedLeads = prevLeads.map(lead => (lead.id === id || lead._id === id ? updatedLead : lead));
          
          try {
            console.log(`Saving leads list to key: ${LEADS_STORAGE_KEY}`);
            window.localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updatedLeads));
            console.log("Updated Local Storage:", updatedLeads);
          } catch (writeErr) {
            console.error(`Failed to save status update to key "${LEADS_STORAGE_KEY}":`, writeErr);
          }
          
          return updatedLeads;
        });

        toast.success(`Lead status updated to "${newStatus}"`, {
          className: 'dark:bg-gray-900 dark:text-white dark:border dark:border-gray-700'
        });
      }
    } catch (error) {
      console.error('[LeadContext] updateLeadStatus Error:', error);
      const errMsg = error.response?.data?.message || 'Failed to update stage status.';
      toast.error(errMsg);
    }
  };

  /**
   * Append a note log to a lead's chronological notes list.
   * 
   * @param {string} id - Lead identifier.
   * @param {string} noteText - Custom string content of the note.
   * @param {string} [author='System'] - Note logger staff name.
   */
  const addLeadNote = async (id, noteText, author = 'System') => {
    try {
      const targetLead = leads.find(l => l.id === id || l._id === id);
      if (!targetLead) return;

      const newNote = {
        id: `n-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        text: noteText,
        author
      };

      const updatedNotes = [...(targetLead.notes || []), newNote];
      const response = await leadService.updateLead(id, { notes: updatedNotes });
      
      if (response.success) {
        const updatedLead = response.data;
        console.log("Saving lead (note update):", updatedLead);
        
        setLeads(prevLeads => {
          const updatedLeads = prevLeads.map(lead => (lead.id === id || lead._id === id ? updatedLead : lead));
          
          try {
            console.log(`Saving leads list to key: ${LEADS_STORAGE_KEY}`);
            window.localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updatedLeads));
            console.log("Updated Local Storage:", updatedLeads);
          } catch (writeErr) {
            console.error(`Failed to save note update to key "${LEADS_STORAGE_KEY}":`, writeErr);
          }
          
          return updatedLeads;
        });

        toast.success('Comment log added successfully.', {
          className: 'dark:bg-gray-900 dark:text-white dark:border dark:border-gray-700'
        });
      }
    } catch (error) {
      console.error('[LeadContext] addLeadNote Error:', error);
      toast.error('Failed to log comment.');
    }
  };

  return (
    <LeadContext.Provider
      value={{
        leads,
        isLoading,
        pagination,
        fetchLeads,
        addLead,
        updateLead,
        deleteLead,
        updateLeadStatus,
        addLeadNote
      }}
    >
      {children}
    </LeadContext.Provider>
  );
};


/**
 * Custom React Hook to consume the LeadContext.
 * 
 * @returns {object} LeadContext values.
 */
export const useLeads = () => {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error('useLeads must be used within a LeadProvider');
  }
  return context;
};