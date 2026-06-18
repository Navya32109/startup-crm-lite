/**
 * Sample lead data for Startup CRM Lite.
 * Used as initial seed data when localStorage is empty.
 * Contains 6 leads with varied statuses: 2 New, 1 Contacted, 1 Won, 1 Lost, 1 Meeting Scheduled.
 * Uses realistic Indian names and organizations.
 */
export const sampleLeads = [
  {
    id: 'lead-1',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@tata.com',
    phone: '+91 98765 43210',
    company: 'Tata Consultancy Services',
    status: 'New',
    value: 45000,
    source: 'LinkedIn',
    priority: 'High',
    owner: 'Alex Mercer',
    createdDate: '2026-06-15',
    notes: [
      {
        id: 'n-1',
        date: '2026-06-15',
        text: 'Prospect showed strong interest in digital transformation services on LinkedIn.',
        author: 'Alex Mercer'
      }
    ]
  },
  {
    id: 'lead-2',
    name: 'Ananya Patel',
    email: 'ananya.patel@reliance.co.in',
    phone: '+91 91234 56789',
    company: 'Reliance Industries',
    status: 'New',
    value: 32000,
    source: 'Website',
    priority: 'Medium',
    owner: 'Sarah Connor',
    createdDate: '2026-06-16',
    notes: [
      {
        id: 'n-2',
        date: '2026-06-16',
        text: 'Submitted query via corporate contact form for cloud hosting evaluation.',
        author: 'System'
      }
    ]
  },
  {
    id: 'lead-3',
    name: 'Rohan Gupta',
    email: 'rohan.gupta@infosys.com',
    phone: '+91 98123 45678',
    company: 'Infosys',
    status: 'Contacted',
    value: 60000,
    source: 'Referral',
    priority: 'High',
    owner: 'Alex Mercer',
    createdDate: '2026-06-12',
    notes: [
      {
        id: 'n-3',
        date: '2026-06-12',
        text: 'Introductory discovery call completed. Discussed multi-tenant architecture needs.',
        author: 'Alex Mercer'
      }
    ]
  },
  {
    id: 'lead-4',
    name: 'Priya Nair',
    email: 'priya.nair@wipro.com',
    phone: '+91 99456 78901',
    company: 'Wipro',
    status: 'Won',
    value: 85000,
    source: 'Email Campaign',
    priority: 'High',
    owner: 'Sarah Connor',
    createdDate: '2026-06-05',
    notes: [
      {
        id: 'n-4',
        date: '2026-06-05',
        text: 'Expressed interest from the summer outreach campaign.',
        author: 'Sarah Connor'
      },
      {
        id: 'n-5',
        date: '2026-06-10',
        text: 'Commercial contract signed and first invoice issued.',
        author: 'Sarah Connor'
      }
    ]
  },
  {
    id: 'lead-5',
    name: 'Kabir Singh',
    email: 'kabir.singh@hcl.com',
    phone: '+91 98765 01234',
    company: 'HCL Technologies',
    status: 'Lost',
    value: 15000,
    source: 'Cold Call',
    priority: 'Low',
    owner: 'Unassigned',
    createdDate: '2026-06-01',
    notes: [
      {
        id: 'n-6',
        date: '2026-06-01',
        text: 'Expressed extreme budget constraints due to hardware cost increases. Closed.',
        author: 'System'
      }
    ]
  },
  {
    id: 'lead-6',
    name: 'Diya Bose',
    email: 'diya.bose@techmahindra.com',
    phone: '+91 97654 32109',
    company: 'Tech Mahindra',
    status: 'Meeting Scheduled',
    value: 50000,
    source: 'Website',
    priority: 'High',
    owner: 'Alex Mercer',
    createdDate: '2026-06-14',
    notes: [
      {
        id: 'n-7',
        date: '2026-06-14',
        text: 'Initial conversation scheduled for detailed product demo on June 20th.',
        author: 'Alex Mercer'
      }
    ]
  }
];
