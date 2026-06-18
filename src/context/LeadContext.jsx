import { createContext, useContext } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { sampleLeads } from '../data/sampleLeads';

const LeadContext = createContext();


export const LeadProvider = ({ children }) => {
  const [leads, setLeads] = useLocalStorage('startup-crm-leads', sampleLeads);

  const addLead = (leadData) => {
    const newLead = {
      id: `lead-${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0],
      notes: [
        {
          id: `n-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          text: 'Lead added manually to CRM.',
          author: leadData.owner || 'System'
        }
      ],
      ...leadData,
      value: Number(leadData.value || 0)
    };
    setLeads(prevLeads => [newLead, ...prevLeads]);
  };

  const updateLead = (id, updatedFields) => {
    setLeads(prevLeads =>
      prevLeads.map(lead => {
        if (lead.id === id) {
          const value = updatedFields.value !== undefined ? Number(updatedFields.value) : lead.value;
          return {
            ...lead,
            ...updatedFields,
            value
          };
        }
        return lead;
      })
    );
  };

  const deleteLead = (id) => {
    setLeads(prevLeads => prevLeads.filter(lead => lead.id !== id));
  };

  const updateLeadStatus = (id, newStatus) => {
    setLeads(prevLeads =>
      prevLeads.map(lead => {
        if (lead.id === id) {
          if (lead.status === newStatus) return lead;
          
          const newNote = {
            id: `n-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            text: `Status changed from "${lead.status}" to "${newStatus}".`,
            author: 'System'
          };
          
          return {
            ...lead,
            status: newStatus,
            notes: [...lead.notes, newNote]
          };
        }
        return lead;
      })
    );
  };

  const addLeadNote = (id, noteText, author = 'System') => {
    setLeads(prevLeads =>
      prevLeads.map(lead => {
        if (lead.id === id) {
          const newNote = {
            id: `n-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            text: noteText,
            author
          };
          return {
            ...lead,
            notes: [...lead.notes, newNote]
          };
        }
        return lead;
      })
    );
  };

  return (
    <LeadContext.Provider
      value={{
        leads,
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

export const useLeads = () => {
  const context = useContext(LeadContext);
  if (!context) {
    throw new Error('useLeads must be used within a LeadProvider');
  }
  return context;
};