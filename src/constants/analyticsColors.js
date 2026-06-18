/**
 * Analytics color constants for Startup CRM Lite.
 * Conforms to the styling specifications:
 * - New: Slate (#94A3B8)
 * - Contacted: Blue (#2563EB)
 * - Meeting Scheduled: Amber/Orange (#F59E0B)
 * - Proposal Sent: Purple (#7C3AED)
 * - Won: Success Green (#22C55E)
 * - Lost: Danger Red (#EF4444)
 */
export const STATUS_COLORS = {
  New: "#94A3B8",
  Contacted: "#2563EB",
  Meeting: "#F59E0B",
  Proposal: "#7C3AED",
  Won: "#22C55E",
  Lost: "#EF4444",
};

/**
 * Maps both internal and display status strings to their corresponding color values.
 * Handles variations like 'Meeting Scheduled' and 'Proposal Sent'.
 */
export const STATUS_COLOR_MAP = {
  'New': STATUS_COLORS.New,
  'Contacted': STATUS_COLORS.Contacted,
  'Meeting Scheduled': STATUS_COLORS.Meeting,
  'Meeting': STATUS_COLORS.Meeting,
  'Qualified': STATUS_COLORS.Meeting,
  'Proposal Sent': STATUS_COLORS.Proposal,
  'Proposal': STATUS_COLORS.Proposal,
  'Negotiation': STATUS_COLORS.Proposal,
  'Won': STATUS_COLORS.Won,
  'Lost': STATUS_COLORS.Lost
};
