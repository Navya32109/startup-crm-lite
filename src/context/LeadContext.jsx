import React, { createContext, useContext, useState } from 'react';

const LeadContext = createContext();

const initialLeads = [
  {
    id: 'lead-1',
    name: 'Jane Cooper',
    email: 'jane.cooper@acme.co',
    phone: '+1 (555) 234-5678',
    company: 'Acme Corporation',
    status: 'Won',
    value: 48000,
    source: 'Referral',
    priority: 'High',
    owner: 'Alex Mercer',
    createdDate: '2026-05-10',
    notes: [
      { id: 'n-1', date: '2026-05-10', text: 'Lead created from Referral by Stripe partner program.', author: 'Alex Mercer' },
      { id: 'n-2', date: '2026-05-12', text: 'Had discovery call. Jane is interested in the enterprise custom plan.', author: 'Alex Mercer' },
      { id: 'n-3', date: '2026-05-20', text: 'Contract signed! Initial payment processed.', author: 'Alex Mercer' }
    ]
  },
  {
    id: 'lead-2',
    name: 'Cody Fisher',
    email: 'c.fisher@globex.io',
    phone: '+1 (555) 345-6789',
    company: 'Globex Corp',
    status: 'Negotiation',
    value: 32000,
    source: 'Outbound',
    priority: 'High',
    owner: 'Sarah Connor',
    createdDate: '2026-05-14',
    notes: [
      { id: 'n-4', date: '2026-05-14', text: 'Outbound sequence cold-reply response. Interested in API scale features.', author: 'Sarah Connor' },
      { id: 'n-5', date: '2026-05-25', text: 'Sent proposal containing custom volume pricing tiers.', author: 'Sarah Connor' }
    ]
  },
  {
    id: 'lead-3',
    name: 'Esther Howard',
    email: 'esther@starktech.com',
    phone: '+1 (555) 456-7890',
    company: 'Stark Industries',
    status: 'Proposal',
    value: 64000,
    source: 'Event',
    priority: 'High',
    owner: 'Alex Mercer',
    createdDate: '2026-05-18',
    notes: [
      { id: 'n-6', date: '2026-05-18', text: 'Met Esther at TechCrunch Disrupt. Excellent fit for SaaS security suite.', author: 'Alex Mercer' },
      { id: 'n-7', date: '2026-06-01', text: 'Delivered technical presentation to Stark CTO. Awaiting security review.', author: 'Alex Mercer' }
    ]
  },
  {
    id: 'lead-4',
    name: 'Ronald Richards',
    email: 'ronald@subway.corp',
    phone: '+1 (555) 567-8901',
    company: 'Subway International',
    status: 'Contacted',
    value: 12000,
    source: 'Organic',
    priority: 'Medium',
    owner: 'Sarah Connor',
    createdDate: '2026-05-22',
    notes: [
      { id: 'n-8', date: '2026-05-22', text: 'Downloaded e-book. Emailed to schedule introductory demo call.', author: 'Sarah Connor' }
    ]
  },
  {
    id: 'lead-5',
    name: 'Albert Flores',
    email: 'albert@apex.so',
    phone: '+1 (555) 678-9012',
    company: 'Apex Design Lab',
    status: 'New',
    value: 8500,
    source: 'Paid Ads',
    priority: 'Low',
    owner: 'Unassigned',
    createdDate: '2026-06-02',
    notes: [
      { id: 'n-9', date: '2026-06-02', text: 'Inbound signup from Google Ads landing page. Standard CRM tier.', author: 'System' }
    ]
  },
  {
    id: 'lead-6',
    name: 'Dianne Russell',
    email: 'dianne.r@cyberdyne.org',
    phone: '+1 (555) 789-0123',
    company: 'Cyberdyne Systems',
    status: 'Qualified',
    value: 75000,
    source: 'Referral',
    priority: 'High',
    owner: 'Alex Mercer',
    createdDate: '2026-05-24',
    notes: [
      { id: 'n-10', date: '2026-05-25', text: 'Discovered key requirement: automated backups & self-hosting options.', author: 'Alex Mercer' }
    ]
  },
  {
    id: 'lead-7',
    name: 'Kathryn Murphy',
    email: 'kathryn@umbrella.co',
    phone: '+1 (555) 890-1234',
    company: 'Umbrella Pharma',
    status: 'Won',
    value: 95000,
    source: 'Outbound',
    priority: 'High',
    owner: 'Sarah Connor',
    createdDate: '2026-04-20',
    notes: [
      { id: 'n-11', date: '2026-04-21', text: 'Intro call complete.', author: 'Sarah Connor' },
      { id: 'n-12', date: '2026-05-05', text: 'Contract closed successfully.', author: 'Sarah Connor' }
    ]
  },
  {
    id: 'lead-8',
    name: 'Devon Lane',
    email: 'devon@tyrell.io',
    phone: '+1 (555) 901-2345',
    company: 'Tyrell Nexus Group',
    status: 'Lost',
    value: 45000,
    source: 'Event',
    priority: 'Medium',
    owner: 'Alex Mercer',
    createdDate: '2026-04-15',
    notes: [
      { id: 'n-13', date: '2026-04-15', text: 'Met at AI Summit.', author: 'Alex Mercer' },
      { id: 'n-14', date: '2026-05-01', text: 'Lost to internal build team project development.', author: 'Alex Mercer' }
    ]
  },
  {
    id: 'lead-9',
    name: 'Bessie Cooper',
    email: 'bessie@hooli.xyz',
    phone: '+1 (555) 012-3456',
    company: 'Hooli Inc.',
    status: 'New',
    value: 28000,
    source: 'Organic',
    priority: 'High',
    owner: 'Sarah Connor',
    createdDate: '2026-06-10',
    notes: [
      { id: 'n-15', date: '2026-06-10', text: 'Created from inbound contact request form. Needs heavy developer tool focus.', author: 'System' }
    ]
  },
  {
    id: 'lead-10',
    name: 'Kristin Watson',
    email: 'kristin@initech.com',
    phone: '+1 (555) 123-4567',
    company: 'Initech Corp',
    status: 'Contacted',
    value: 14000,
    source: 'Paid Ads',
    priority: 'Medium',
    owner: 'Alex Mercer',
    createdDate: '2026-06-08',
    notes: [
      { id: 'n-16', date: '2026-06-09', text: 'Left voicemail offering custom setup support.', author: 'Alex Mercer' }
    ]
  },
  {
    id: 'lead-11',
    name: 'Robert Fox',
    email: 'robert@wayne.net',
    phone: '+1 (555) 234-8901',
    company: 'Wayne Enterprises',
    status: 'Qualified',
    value: 120000,
    source: 'Referral',
    priority: 'High',
    owner: 'Alex Mercer',
    createdDate: '2026-05-05',
    notes: [
      { id: 'n-17', date: '2026-05-06', text: 'High value client. Met security screening. Budget approved.', author: 'Alex Mercer' }
    ]
  },
  {
    id: 'lead-12',
    name: 'Leslie Alexander',
    email: 'leslie@massive.io',
    phone: '+1 (555) 345-9012',
    company: 'Massive Dynamic',
    status: 'Proposal',
    value: 55000,
    source: 'Outbound',
    priority: 'High',
    owner: 'Sarah Connor',
    createdDate: '2026-05-28',
    notes: [
      { id: 'n-18', date: '2026-05-28', text: 'Delivered quotation for 250 enterprise user seat count.', author: 'Sarah Connor' }
    ]
  },
  {
    id: 'lead-13',
    name: 'Eleanor Pena',
    email: 'eleanor@veydt.net',
    phone: '+1 (555) 456-0123',
    company: 'Veydt Industries',
    status: 'Negotiation',
    value: 88000,
    source: 'Organic',
    priority: 'High',
    owner: 'Sarah Connor',
    createdDate: '2026-05-15',
    notes: [
      { id: 'n-19', date: '2026-05-16', text: 'Reviewing SaaS master service agreement changes with company legal.', author: 'Sarah Connor' }
    ]
  },
  {
    id: 'lead-14',
    name: 'Floyd Miles',
    email: 'floyd@dharma.org',
    phone: '+1 (555) 567-1234',
    company: 'Dharma Initiative',
    status: 'Won',
    value: 16500,
    source: 'Event',
    priority: 'Medium',
    owner: 'Alex Mercer',
    createdDate: '2026-05-01',
    notes: [
      { id: 'n-20', date: '2026-05-02', text: 'Won lead. Account provisioning complete.', author: 'Alex Mercer' }
    ]
  },
  {
    id: 'lead-15',
    name: 'Marvin McKinney',
    email: 'marvin@virtucon.com',
    phone: '+1 (555) 678-2345',
    company: 'Virtucon Industries',
    status: 'Lost',
    value: 22000,
    source: 'Paid Ads',
    priority: 'Low',
    owner: 'Sarah Connor',
    createdDate: '2026-04-18',
    notes: [
      { id: 'n-21', date: '2026-04-18', text: 'Inbound demo requested.', author: 'Sarah Connor' },
      { id: 'n-22', date: '2026-05-02', text: 'Declined proposal due to budget constraints.', author: 'Sarah Connor' }
    ]
  },
  {
    id: 'lead-16',
    name: 'Courtney Henry',
    email: 'courtney@sherlock.co',
    phone: '+1 (555) 789-3456',
    company: 'Sherlock Consulting',
    status: 'New',
    value: 9200,
    source: 'Organic',
    priority: 'Low',
    owner: 'Unassigned',
    createdDate: '2026-06-13',
    notes: [
      { id: 'n-23', date: '2026-06-13', text: 'Signed up from organic blog recommendation.', author: 'System' }
    ]
  },
  {
    id: 'lead-17',
    name: 'Darrell Steward',
    email: 'darrell@steward.co',
    phone: '+1 (555) 890-4567',
    company: 'Steward & Sons',
    status: 'Contacted',
    value: 15000,
    source: 'Outbound',
    priority: 'Medium',
    owner: 'Sarah Connor',
    createdDate: '2026-06-05',
    notes: [
      { id: 'n-24', date: '2026-06-05', text: 'Added from prospecting list. Sent cold email introduction.', author: 'Sarah Connor' }
    ]
  },
  {
    id: 'lead-18',
    name: 'Theresa Webb',
    email: 'theresa@lexcorp.com',
    phone: '+1 (555) 901-5678',
    company: 'LexCorp',
    status: 'Qualified',
    value: 110000,
    source: 'Event',
    priority: 'High',
    owner: 'Sarah Connor',
    createdDate: '2026-05-19',
    notes: [
      { id: 'n-25', date: '2026-05-19', text: 'Met at Cloud Expo. Confirmed budget, authority, need, and timeline (BANT).', author: 'Sarah Connor' }
    ]
  },
  {
    id: 'lead-19',
    name: 'Darlene Robertson',
    email: 'darlene@oscorp.io',
    phone: '+1 (555) 012-6789',
    company: 'Oscorp Tech',
    status: 'Proposal',
    value: 42000,
    source: 'Paid Ads',
    priority: 'Medium',
    owner: 'Alex Mercer',
    createdDate: '2026-06-01',
    notes: [
      { id: 'n-26', date: '2026-06-01', text: 'Requested pricing model options for startup plan.', author: 'Alex Mercer' }
    ]
  },
  {
    id: 'lead-20',
    name: 'Guy Hawkins',
    email: 'guy@kessel.io',
    phone: '+1 (555) 123-7890',
    company: 'Kessel Logistics',
    status: 'New',
    value: 19500,
    source: 'Referral',
    priority: 'Medium',
    owner: 'Unassigned',
    createdDate: '2026-06-14',
    notes: [
      { id: 'n-27', date: '2026-06-14', text: 'Referred by existing client Kessel Mines.', author: 'System' }
    ]
  }
];

export const LeadProvider = ({ children }) => {
  const [leads, setLeads] = useState(initialLeads);

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
