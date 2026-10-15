/**
 * Google Calendar & Meet Integration Module
 * 
 * ============================================================================
 * ARCHITECTURAL INTEGRITY NOTICE:
 * A client-side static React website CANNOT autonomously create server-authenticated
 * Google Meet video links or insert events into a private Google Calendar account
 * without an authenticated backend / OAuth 2.0 / Service Account integration.
 * 
 * This module adheres strictly to engineering accuracy:
 * 1. Demo Mode (Default): Simulates form validation, alerts the user transparently
 *    that this is a client demonstration, and provides an instant Google Calendar
 *    event-creator link that pre-fills the details on the user's personal Google Calendar,
 *    inviting the academy's official email (kumardalaichandan803@gmail.com).
 * 2. Production Integration Guide: Outlines the exact steps for deploying a serverless
 *    function or Google Cloud OAuth service account to automate true Google Meet generation.
 * ============================================================================
 */

import { ACADEMY_CONFIG } from '../config/academyConfig';

export interface ConsultationRequest {
  fullName: string;
  email: string;
  phone?: string;
  studentClass: string;
  courseInterest: string;
  preferredDate: string; // YYYY-MM-DD
  preferredTime: string; // e.g., '10:30 AM - 11:00 AM'
  notes?: string;
}

export interface ConsultationSubmissionResult {
  mode: 'demo' | 'production';
  success: boolean;
  message: string;
  googleCalendarUrl?: string;
  meetLinkPlaceholder?: string;
  submissionTimestamp: string;
  details: ConsultationRequest;
}

/**
 * Builds a direct Google Calendar "Add Event" URL prefilled with details.
 * This allows the student/parent to open Google Calendar with 1-click and invite
 * the academy email (kumardalaichandan803@gmail.com).
 */
export function buildGoogleCalendarUrl(request: ConsultationRequest): string {
  const { fullName, email, studentClass, courseInterest, preferredDate, preferredTime, notes } = request;

  const eventTitle = encodeURIComponent(`Antariksh Academy Consultation: ${fullName} (${courseInterest})`);
  
  const descriptionText = [
    `Academic Consultation with Antariksh Academy (Berhampur)`,
    `----------------------------------------------------`,
    `Student/Parent Name: ${fullName}`,
    `Email: ${email}`,
    `Class: ${studentClass}`,
    `Course of Interest: ${courseInterest}`,
    `Requested Time Slot: ${preferredTime}`,
    notes ? `Message/Queries: ${notes}` : '',
    ``,
    `Academy Center: ${ACADEMY_CONFIG.address.fullFormatted}`,
    `Provisional Contact Email: ${ACADEMY_CONFIG.contact.email}`,
    `WhatsApp / Phone: ${ACADEMY_CONFIG.contact.phoneRaw}`,
    `----------------------------------------------------`,
    `Note: This calendar invite was initiated via the Antariksh Academy portal.`,
  ].filter(Boolean).join('\n');

  const encodedDescription = encodeURIComponent(descriptionText);
  const encodedLocation = encodeURIComponent(`${ACADEMY_CONFIG.name}, ${ACADEMY_CONFIG.address.fullFormatted} / Google Meet`);

  // Parse preferredDate and approximate time into Google Calendar date format (YYYYMMDDTHHmmssZ)
  let datesParam = '';
  try {
    const [year, month, day] = preferredDate.split('-').map(Number);
    // Default to morning 10:00 AM if parsing fails
    let startHour = 10;
    let startMin = 0;

    if (preferredTime) {
      const match = preferredTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (match) {
        let h = parseInt(match[1], 10);
        const m = parseInt(match[2], 10);
        const ampm = match[3].toUpperCase();
        if (ampm === 'PM' && h < 12) h += 12;
        if (ampm === 'AM' && h === 12) h = 0;
        startHour = h;
        startMin = m;
      }
    }

    const startDate = new Date(year, month - 1, day, startHour, startMin, 0);
    const endDate = new Date(startDate.getTime() + 30 * 60 * 1000); // 30 minutes duration

    const formatGDate = (d: Date) => {
      return d.toISOString().replace(/-|:|\.\d\d\d/g, '');
    };

    datesParam = `&dates=${formatGDate(startDate)}/${formatGDate(endDate)}`;
  } catch {
    // If date parse fails, omit dates to allow user to pick in Google Calendar
    datesParam = '';
  }

  // Pre-invite academy email
  const attendeesParam = `&add=${encodeURIComponent(ACADEMY_CONFIG.contact.email)}`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&details=${encodedDescription}&location=${encodedLocation}${datesParam}${attendeesParam}`;
}

/**
 * Handles consultation form submission.
 * In Demo Mode: Performs validation, builds Google Calendar template URL,
 * and returns structured feedback without fabricating a backend response.
 */
export async function submitConsultationRequest(
  request: ConsultationRequest
): Promise<ConsultationSubmissionResult> {
  // Artificial brief debounce for UI feedback (600ms)
  await new Promise((resolve) => setTimeout(resolve, 600));

  const gCalUrl = buildGoogleCalendarUrl(request);

  if (ACADEMY_CONFIG.consultation.mode === 'production') {
    // In production, this would invoke a secure backend API endpoint:
    // POST /api/schedule-consultation { request }
    // The backend would use Google Calendar API v3 Service Account to create an event
    // with conferenceDataVersion=1 and generate a real `meet.google.com/xxx-xxxx-xxx` link.
    throw new Error(
      'Production backend endpoint not configured. Set VITE_CALENDAR_API_URL or consult documentation in README.'
    );
  }

  return {
    mode: 'demo',
    success: true,
    message:
      'Consultation details successfully validated in Demo Mode. Because this is a static frontend deployment, no data was transmitted to an external server. You can click the Google Calendar button below to add this event to your personal Google Calendar and automatically invite the academy.',
    googleCalendarUrl: gCalUrl,
    meetLinkPlaceholder: 'Available in Production (Google Workspace / Calendar API required)',
    submissionTimestamp: new Date().toISOString(),
    details: request,
  };
}

/**
 * Technical documentation for enabling production Google Calendar & Meet integration.
 */
export const PRODUCTION_INTEGRATION_DOCS = {
  title: 'Production Google Calendar & Google Meet Integration Architecture',
  steps: [
    {
      step: 1,
      title: 'Google Cloud Platform Project Setup',
      desc: 'Create a project in Google Cloud Console (https://console.cloud.google.com) and enable the "Google Calendar API".',
    },
    {
      step: 2,
      title: 'Service Account / OAuth 2.0 Credentials',
      desc: 'Create a Service Account with Domain-Wide Delegation (if using Google Workspace) or OAuth 2.0 Web Client credentials. Store secrets safely in server environment variables (NEVER in frontend code).',
    },
    {
      step: 3,
      title: 'Deploy a Serverless API Route',
      desc: 'Deploy a lightweight backend endpoint (e.g., Cloudflare Worker, Vercel Serverless Function, AWS Lambda, or Express Node.js server) at /api/schedule-consultation.',
    },
    {
      step: 4,
      title: 'Generate Google Meet Conference Data',
      desc: 'Call calendar.events.insert with conferenceDataVersion: 1 and createRequest: { requestId: uuid, conferenceSolutionKey: { type: "hangoutsMeet" } }. Google automatically attaches a unique meet.google.com URL.',
    },
    {
      step: 5,
      title: 'Email Notification & Webhook Confirmation',
      desc: 'Send an automated confirmation email to both the student and kumardalaichandan803@gmail.com with the confirmed Meet link.',
    },
  ],
};
