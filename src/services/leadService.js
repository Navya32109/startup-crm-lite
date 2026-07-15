import api from './api';

/**
 * Helper mapper to convert MongoDB document format to frontend expected format.
 * Prevents UI breakage by translating _id -> id, createdAt -> createdDate,
 * and ensuring value is a number.
 * 
 * @param {object} lead - The lead document from the API.
 * @returns {object} The mapped lead object.
 */
export const mapLeadObj = (lead) => {
  if (!lead) return lead;
  return {
    ...lead,
    id: lead._id || lead.id,
    createdDate: lead.createdAt ? new Date(lead.createdAt).toISOString().split('T')[0] : lead.createdDate,
    value: lead.value !== undefined ? Number(lead.value) : 0,
    notes: Array.isArray(lead.notes) ? lead.notes : []
  };
};

/**
 * Fetch paginated, filtered, and searchable leads list.
 * GET /api/leads
 * 
 * @param {object} params - Query parameters like { status, search, page, limit, sortBy, sortOrder }
 * @returns {Promise<object>} Returns { success, data: leadArray, pagination }
 */
export const getLeads = async (params) => {
  const response = await api.get('/api/leads', { params });
  return {
    ...response.data,
    data: response.data.data.map(mapLeadObj)
  };
};

/**
 * Create a new lead record in the backend.
 * POST /api/leads
 * 
 * @param {object} leadData - The lead payload.
 * @returns {Promise<object>} Returns { success, message, data: newLead }
 */
export const createLead = async (leadData) => {
  const response = await api.post('/api/leads', leadData);
  return {
    ...response.data,
    data: mapLeadObj(response.data.data)
  };
};

/**
 * Update a lead record in the backend.
 * PUT /api/leads/:id
 * 
 * @param {string} id - The lead identifier.
 * @param {object} leadData - The updated fields.
 * @returns {Promise<object>} Returns { success, message, data: updatedLead }
 */
export const updateLead = async (id, leadData) => {
  const response = await api.put(`/api/leads/${id}`, leadData);
  return {
    ...response.data,
    data: mapLeadObj(response.data.data)
  };
};

/**
 * Update only the status of a lead in the backend.
 * PATCH /api/leads/:id/status
 * 
 * @param {string} id - The lead identifier.
 * @param {string} status - The new status.
 * @returns {Promise<object>} Returns { success, message, data: updatedLead }
 */
export const updateLeadStatus = async (id, status) => {
  const response = await api.patch(`/api/leads/${id}/status`, { status });
  return {
    ...response.data,
    data: mapLeadObj(response.data.data)
  };
};

/**
 * Delete a lead record in the backend.
 * DELETE /api/leads/:id
 * 
 * @param {string} id - The lead identifier.
 * @returns {Promise<object>} Returns { success, message }
 */
export const deleteLead = async (id) => {
  const response = await api.delete(`/api/leads/${id}`);
  return response.data;
};

/**
 * Fetch aggregated lead stats for dashboard visualizers.
 * GET /api/leads/stats/summary
 * 
 * @returns {Promise<object>} Returns { success, data: statsObject }
 */
export const getLeadStats = async () => {
  const response = await api.get('/api/leads/stats/summary');
  return response.data;
};

/**
 * Fetch chronological monthly leads metrics for charts.
 * GET /api/leads/stats/monthly
 * 
 * @returns {Promise<object>} Returns { success, data: monthlyDataArray }
 */
export const getMonthlyStats = async () => {
  const response = await api.get('/api/leads/stats/monthly');
  return response.data;
};

export default {
  getLeads,
  createLead,
  updateLead,
  updateLeadStatus,
  deleteLead,
  getLeadStats,
  getMonthlyStats
};
