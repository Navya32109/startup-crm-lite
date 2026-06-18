import { STATUS_COLOR_MAP } from '../constants/analyticsColors';

/**
 * Normalizes lead dates from various formats (createdAt, createdDate, wonAt, etc.)
 * into a standard JS Date object.
 */
export const parseLeadDate = (dateVal) => {
  if (!dateVal) return null;
  const date = new Date(dateVal);
  return isNaN(date.getTime()) ? null : date;
};

/**
 * Extracts the date a lead was marked "Won".
 * First checks wonAt property, then scans status transition history in notes.
 * Falls back to createdAt or createdDate as a last resort.
 */
export const getLeadWonDate = (lead) => {
  if (lead.wonAt) return parseLeadDate(lead.wonAt);
  
  if (lead.notes && Array.isArray(lead.notes)) {
    const wonNote = lead.notes.find(note => 
      note.text && 
      (note.text.toLowerCase().includes('to "won"') || 
       note.text.toLowerCase().includes('to \'won\'') || 
       note.text.toLowerCase().includes('changed to won'))
    );
    if (wonNote && wonNote.date) {
      return parseLeadDate(wonNote.date);
    }
  }
  
  return parseLeadDate(lead.createdAt || lead.createdDate);
};

/**
 * Extracts the date a lead was contacted.
 */
export const getLeadContactedDate = (lead) => {
  if (lead.contactedAt) return parseLeadDate(lead.contactedAt);
  if (lead.notes && Array.isArray(lead.notes)) {
    const contactedNote = lead.notes.find(note => 
      note.text && note.text.toLowerCase().includes('contacted')
    );
    if (contactedNote && contactedNote.date) {
      return parseLeadDate(contactedNote.date);
    }
  }
  return null;
};

/**
 * Extracts the date a meeting was scheduled.
 */
export const getLeadMeetingDate = (lead) => {
  if (lead.meetingAt) return parseLeadDate(lead.meetingAt);
  if (lead.notes && Array.isArray(lead.notes)) {
    const meetingNote = lead.notes.find(note => 
      note.text && (note.text.toLowerCase().includes('meeting') || note.text.toLowerCase().includes('demo'))
    );
    if (meetingNote && meetingNote.date) {
      return parseLeadDate(meetingNote.date);
    }
  }
  return null;
};

/**
 * Helper to generate the list of the last 6 months dynamically.
 * Returns an array of objects: { monthKey: 'YYYY-MM', name: 'MMM' }
 */
export const getLast6MonthsRange = () => {
  const range = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const name = d.toLocaleString('default', { month: 'short' });
    range.push({ monthKey, name });
  }
  return range;
};

/**
 * 1. KPI: Pipeline Value
 * Sum of all active lead values (excludes Won and Lost).
 */
export const getPipelineValue = (leads) => {
  if (!leads || !Array.isArray(leads)) return 0;
  return leads
    .filter(lead => lead.status !== 'Won' && lead.status !== 'Lost')
    .reduce((sum, lead) => sum + Number(lead.value || 0), 0);
};

/**
 * 2. KPI: Won Revenue
 * Sum of Won lead values.
 */
export const getWonRevenue = (leads) => {
  if (!leads || !Array.isArray(leads)) return 0;
  return leads
    .filter(lead => lead.status === 'Won')
    .reduce((sum, lead) => sum + Number(lead.value || 0), 0);
};

/**
 * 3. KPI: Average Sales Cycle
 * Average of (wonAt - createdAt) in days for Won leads.
 */
export const getAverageSalesCycle = (leads) => {
  if (!leads || !Array.isArray(leads)) return 0;
  const wonLeads = leads.filter(lead => lead.status === 'Won');
  if (wonLeads.length === 0) return 0;

  let totalDays = 0;
  let validCount = 0;

  wonLeads.forEach(lead => {
    const createDate = parseLeadDate(lead.createdAt || lead.createdDate);
    const wonDate = getLeadWonDate(lead);

    if (createDate && wonDate) {
      const diffTime = wonDate.getTime() - createDate.getTime();
      const diffDays = Math.max(0, Math.round(diffTime / (1000 * 60 * 60 * 24)));
      totalDays += diffDays;
      validCount += 1;
    }
  });

  return validCount > 0 ? Math.round(totalDays / validCount) : 0;
};

/**
 * 4. KPI: Lost Rate
 * Lost Leads / Total Leads.
 */
export const getLostRate = (leads) => {
  if (!leads || !Array.isArray(leads) || leads.length === 0) return 0;
  const lostCount = leads.filter(lead => lead.status === 'Lost').length;
  return Math.round((lostCount / leads.length) * 100);
};

/**
 * 5. Lead Status Distribution (Doughnut Chart)
 * Groups leads by status. Computes counts, percentages, and injects STATUS_COLOR_MAP values.
 */
export const getStatusDistribution = (leads) => {
  if (!leads || !Array.isArray(leads)) return [];
  const total = leads.length;
  if (total === 0) return [];

  const counts = {};
  leads.forEach(lead => {
    const status = lead.status || 'New';
    counts[status] = (counts[status] || 0) + 1;
  });

  return Object.keys(counts).map(status => {
    const count = counts[status];
    const percentage = Math.round((count / total) * 100);
    return {
      name: status,
      value: count,
      percentage,
      color: STATUS_COLOR_MAP[status] || STATUS_COLOR_MAP.New
    };
  });
};

/**
 * 6. Monthly Leads Trend (Bar Chart)
 * Group lead creation counts over the last 6 months.
 */
export const getMonthlyLeads = (leads) => {
  if (!leads || !Array.isArray(leads)) return [];
  const months = getLast6MonthsRange();
  
  const monthlyCounts = months.map(m => ({
    ...m,
    count: 0
  }));

  leads.forEach(lead => {
    const createDate = parseLeadDate(lead.createdAt || lead.createdDate);
    if (!createDate) return;
    const year = createDate.getFullYear();
    const month = String(createDate.getMonth() + 1).padStart(2, '0');
    const monthKey = `${year}-${month}`;

    const monthObj = monthlyCounts.find(m => m.monthKey === monthKey);
    if (monthObj) {
      monthObj.count += 1;
    }
  });

  return monthlyCounts;
};

/**
 * 7. Monthly Conversion Trend (Line Chart)
 * Formula: Won Leads / Total Leads per month, over the last 6 months.
 */
export const getConversionByMonth = (leads) => {
  if (!leads || !Array.isArray(leads)) return [];
  const months = getLast6MonthsRange();

  const monthlyStats = months.map(m => ({
    ...m,
    won: 0,
    total: 0,
    rate: 0
  }));

  leads.forEach(lead => {
    const createDate = parseLeadDate(lead.createdAt || lead.createdDate);
    if (!createDate) return;
    const year = createDate.getFullYear();
    const month = String(createDate.getMonth() + 1).padStart(2, '0');
    const monthKey = `${year}-${month}`;

    const monthObj = monthlyStats.find(m => m.monthKey === monthKey);
    if (monthObj) {
      monthObj.total += 1;
      if (lead.status === 'Won') {
        monthObj.won += 1;
      }
    }
  });

  // Calculate percentages
  return monthlyStats.map(m => {
    const rate = m.total > 0 ? Math.round((m.won / m.total) * 100) : 0;
    return {
      monthKey: m.monthKey,
      name: m.name,
      rate
    };
  });
};

/**
 * 8. Revenue Analytics (Area Chart)
 * Sum of Won deals values grouped by won month over the last 6 months.
 */
export const getRevenueByMonth = (leads) => {
  if (!leads || !Array.isArray(leads)) return [];
  const months = getLast6MonthsRange();

  const monthlyRevenue = months.map(m => ({
    ...m,
    revenue: 0
  }));

  leads.forEach(lead => {
    if (lead.status !== 'Won') return;
    const wonDate = getLeadWonDate(lead);
    if (!wonDate) return;
    const year = wonDate.getFullYear();
    const month = String(wonDate.getMonth() + 1).padStart(2, '0');
    const monthKey = `${year}-${month}`;

    const monthObj = monthlyRevenue.find(m => m.monthKey === monthKey);
    if (monthObj) {
      monthObj.revenue += Number(lead.value || 0);
    }
  });

  return monthlyRevenue;
};

/**
 * 9. Lead Source Analytics (Horizontal Bar Chart)
 * Group lead counts by source, sorted descending.
 */
export const getLeadSourceStats = (leads) => {
  if (!leads || !Array.isArray(leads)) return [];
  const counts = {};
  leads.forEach(lead => {
    const src = lead.source || 'Other';
    counts[src] = (counts[src] || 0) + 1;
  });

  return Object.keys(counts)
    .map(source => ({
      name: source,
      count: counts[source]
    }))
    .sort((a, b) => b.count - a.count);
};

/**
 * Helper to determine which funnel stages a lead has reached.
 * Handled cumulatively: Won implies Proposal -> Meeting -> Contacted -> New.
 */
export const getLeadReachedStages = (lead) => {
  const reached = {
    New: true,
    Contacted: false,
    Meeting: false,
    Proposal: false,
    Won: false
  };

  // 1. Check explicit date milestones
  if (lead.contactedAt) reached.Contacted = true;
  if (lead.meetingAt) reached.Meeting = true;
  if (lead.proposalAt) reached.Proposal = true;
  if (lead.wonAt) reached.Won = true;

  // 2. Map current status to cumulative pipeline flow
  const status = lead.status;
  if (status === 'Contacted') {
    reached.Contacted = true;
  } else if (status === 'Meeting Scheduled' || status === 'Meeting' || status === 'Qualified') {
    reached.Contacted = true;
    reached.Meeting = true;
  } else if (status === 'Proposal Sent' || status === 'Proposal' || status === 'Negotiation') {
    reached.Contacted = true;
    reached.Meeting = true;
    reached.Proposal = true;
  } else if (status === 'Won') {
    reached.Contacted = true;
    reached.Meeting = true;
    reached.Proposal = true;
    reached.Won = true;
  }

  // 3. Scan notes history for any logs of meeting, contacting, or proposal changes
  if (lead.notes && Array.isArray(lead.notes)) {
    lead.notes.forEach(note => {
      const txt = (note.text || '').toLowerCase();
      if (txt.includes('contacted') || txt.includes('called') || txt.includes('emailed')) {
        reached.Contacted = true;
      }
      if (txt.includes('meeting') || txt.includes('qualified') || txt.includes('demo')) {
        reached.Contacted = true;
        reached.Meeting = true;
      }
      if (txt.includes('proposal') || txt.includes('negotiation') || txt.includes('offer')) {
        reached.Contacted = true;
        reached.Meeting = true;
        reached.Proposal = true;
      }
      if (txt.includes('won') || txt.includes('signed') || txt.includes('closed won')) {
        reached.Contacted = true;
        reached.Meeting = true;
        reached.Proposal = true;
        reached.Won = true;
      }
    });
  }

  return reached;
};

/**
 * 10. Funnel Data Generation
 * Maps lead counts through: New -> Contacted -> Meeting -> Proposal -> Won.
 * Includes counts, conversion %, and stage-to-stage drop-off.
 */
export const getFunnelData = (leads) => {
  if (!leads || !Array.isArray(leads)) return [];

  const stageCounts = {
    New: 0,
    Contacted: 0,
    Meeting: 0,
    Proposal: 0,
    Won: 0
  };

  leads.forEach(lead => {
    const reached = getLeadReachedStages(lead);
    if (reached.New) stageCounts.New++;
    if (reached.Contacted) stageCounts.Contacted++;
    if (reached.Meeting) stageCounts.Meeting++;
    if (reached.Proposal) stageCounts.Proposal++;
    if (reached.Won) stageCounts.Won++;
  });

  const stages = ['New', 'Contacted', 'Meeting', 'Proposal', 'Won'];
  return stages.map((stage, idx) => {
    const count = stageCounts[stage];
    const prevStage = idx > 0 ? stages[idx - 1] : null;
    const prevCount = prevStage ? stageCounts[prevStage] : count;

    // Overall conversion rate (relative to New)
    const conversionRate = stageCounts.New > 0 ? Math.round((count / stageCounts.New) * 100) : 0;
    
    // Stage-to-stage conversion rate
    const stageConversionRate = prevCount > 0 ? Math.round((count / prevCount) * 100) : 0;

    // Drop-off rate from previous stage
    const dropOffRate = prevCount > 0 ? Math.round(((prevCount - count) / prevCount) * 100) : 0;

    return {
      stage,
      count,
      conversionRate,
      stageConversionRate,
      dropOffRate
    };
  });
};

/**
 * 11. KPI / Widget: Sales Velocity
 * Formula: (Opportunities × Win Rate × Avg Deal Size) ÷ Sales Cycle Length
 */
export const getSalesVelocity = (leads) => {
  if (!leads || !Array.isArray(leads)) return { velocity: 0, opportunities: 0, winRate: 0, avgDealSize: 0 };
  
  // Opportunities = Active deals (not Won, not Lost)
  const opportunities = leads.filter(l => l.status !== 'Won' && l.status !== 'Lost').length;
  
  // Win Rate = Won / (Won + Lost)
  const wonCount = leads.filter(l => l.status === 'Won').length;
  const lostCount = leads.filter(l => l.status === 'Lost').length;
  const totalClosed = wonCount + lostCount;
  const winRate = totalClosed > 0 ? wonCount / totalClosed : 0;
  
  // Avg Deal Size = average value of Won leads. Fallback to average of all leads with values.
  const wonLeads = leads.filter(l => l.status === 'Won');
  let avgDealSize = 0;
  if (wonLeads.length > 0) {
    avgDealSize = wonLeads.reduce((sum, l) => sum + Number(l.value || 0), 0) / wonLeads.length;
  } else {
    const leadsWithVal = leads.filter(l => Number(l.value || 0) > 0);
    if (leadsWithVal.length > 0) {
      avgDealSize = leadsWithVal.reduce((sum, l) => sum + Number(l.value || 0), 0) / leadsWithVal.length;
    }
  }

  // Sales Cycle Length = average sales cycle in days. Fallback to 14 days to prevent division by zero.
  const avgSalesCycle = getAverageSalesCycle(leads) || 14;

  const velocity = avgSalesCycle > 0 
    ? (opportunities * winRate * avgDealSize) / avgSalesCycle 
    : 0;

  return {
    velocity: Math.round(velocity),
    opportunities,
    winRate: Math.round(winRate * 100),
    avgDealSize: Math.round(avgDealSize),
    salesCycle: avgSalesCycle
  };
};

/**
 * 12. Forecast Card Calculations
 * Calculates Predicted Revenue for Next Month (average Won revenue of last 6 months).
 * Also computes a confidence score and growth trend.
 */
export const getForecastRevenue = (leads) => {
  if (!leads || !Array.isArray(leads)) return { predictedRevenue: 0, confidenceScore: 0, growthTrend: 0 };
  
  const monthlyRev = getRevenueByMonth(leads); // Array of 6 items: { monthKey, name, revenue }
  const totalMonths = monthlyRev.length;
  if (totalMonths === 0) return { predictedRevenue: 0, confidenceScore: 0, growthTrend: 0 };

  const totalRevenue = monthlyRev.reduce((sum, m) => sum + m.revenue, 0);
  const predictedRevenue = Math.round(totalRevenue / totalMonths);

  // Calculate Coefficient of Variation for Confidence Score
  let confidenceScore = 80; // Default fallback
  if (predictedRevenue > 0) {
    const variance = monthlyRev.reduce((sum, m) => sum + Math.pow(m.revenue - predictedRevenue, 2), 0) / totalMonths;
    const stdDev = Math.sqrt(variance);
    const cv = stdDev / predictedRevenue;
    // Map CV to confidence score between 50% and 98%
    confidenceScore = Math.max(50, Math.min(98, Math.round(100 * (1 - cv * 0.45))));
  } else {
    confidenceScore = 0;
  }

  // Growth Trend: Compare recent 3 months to prior 3 months
  const recent3MonthsRev = monthlyRev.slice(-3).reduce((sum, m) => sum + m.revenue, 0);
  const prior3MonthsRev = monthlyRev.slice(0, 3).reduce((sum, m) => sum + m.revenue, 0);
  let growthTrend = 0;
  if (prior3MonthsRev > 0) {
    growthTrend = Math.round(((recent3MonthsRev - prior3MonthsRev) / prior3MonthsRev) * 100);
  } else if (recent3MonthsRev > 0) {
    growthTrend = 100;
  }

  return {
    predictedRevenue,
    confidenceScore,
    growthTrend
  };
};

/**
 * 13. Top Performers (Ranked Reps Card)
 * Ranks owners by Won Revenue.
 */
export const getTopPerformers = (leads) => {
  if (!leads || !Array.isArray(leads)) return [];

  const reps = {};
  leads.forEach(lead => {
    const repName = lead.owner || 'Unassigned';
    if (!reps[repName]) {
      reps[repName] = { name: repName, wonRevenue: 0, wonCount: 0, totalCount: 0 };
    }
    reps[repName].totalCount += 1;
    if (lead.status === 'Won') {
      reps[repName].wonRevenue += Number(lead.value || 0);
      reps[repName].wonCount += 1;
    }
  });

  return Object.values(reps)
    .sort((a, b) => b.wonRevenue - a.wonRevenue);
};

/**
 * 14. Activity Heatmap Data (GitHub Contribution Heatmap format)
 * Returns a mapping of YYYY-MM-DD -> total activity count, with activity categorizations.
 */
export const getActivityHeatmapData = (leads) => {
  if (!leads || !Array.isArray(leads)) return {};

  const activityMap = {};

  const registerActivity = (dateStr, type) => {
    if (!dateStr) return;
    const cleanDate = parseLeadDate(dateStr);
    if (!cleanDate) return;
    const dateKey = cleanDate.toISOString().split('T')[0];

    if (!activityMap[dateKey]) {
      activityMap[dateKey] = {
        date: dateKey,
        count: 0,
        details: { created: 0, meetings: 0, calls: 0 }
      };
    }

    activityMap[dateKey].count += 1;
    if (type === 'created') activityMap[dateKey].details.created += 1;
    if (type === 'meetings') activityMap[dateKey].details.meetings += 1;
    if (type === 'calls') activityMap[dateKey].details.calls += 1;
  };

  leads.forEach(lead => {
    // 1. Leads Created
    registerActivity(lead.createdAt || lead.createdDate, 'created');

    // 2. Meetings Scheduled
    if (lead.meetingAt) {
      registerActivity(lead.meetingAt, 'meetings');
    }

    // 3. Contacted / Calls
    if (lead.contactedAt) {
      registerActivity(lead.contactedAt, 'calls');
    }

    // 4. Notes activity logs
    if (lead.notes && Array.isArray(lead.notes)) {
      lead.notes.forEach(note => {
        if (!note.date) return;
        const text = (note.text || '').toLowerCase();
        if (text.includes('call') || text.includes('contacted') || text.includes('email')) {
          registerActivity(note.date, 'calls');
        } else if (text.includes('meeting') || text.includes('scheduled') || text.includes('demo')) {
          registerActivity(note.date, 'meetings');
        } else {
          // Standard activity note
          registerActivity(note.date, 'other');
        }
      });
    }
  });

  return activityMap;
};
