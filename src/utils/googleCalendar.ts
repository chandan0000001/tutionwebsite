/**
 * Google Calendar & Meet Integration Module
 * 
 * ============================================================================
 * ARCHITECTURAL INTEGRITY NOTICE:
 * A client-side static React website CANNOT autonomously create server-authenticated
 * Google Meet video links or insert events into a private Google Calendar account
 * without an authenticated backend / OAuth 2.0 / Service Account integration.
 * 
 * In this frontend-only version:
 * 1. The consultation request is transmitted via the third-party FormSubmit service
 *    directly to the academy admissions inbox (kumardalaichandan803@gmail.com).
 * 2. An optional draft calendar reminder URL is generated for the user's personal Google
 *    Calendar. This URL acts strictly as a draft reminder on the user's device, not a
 *    confirmed autonomous booking or real-time Google Meet generator.
 * 3. The official Google Meet link and final time confirmation are delivered by the
 *    academy counselor after reviewing faculty schedules.
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
  mode: 'frontend-only' | 'backend-service';
  success: boolean;
  message: string;
  googleCalendarUrl?: string;
  submissionTimestamp: string;
  details: ConsultationRequest;
}

/**
 * Parses preferred date (YYYY-MM-DD) and a 30-minute time slot (e.g. '10:30 AM - 11:00 AM')
 * into ISO-like strings (YYYYMMDDTHHmmss) anchored to IST without local browser offset bugs.
 */
export function formatCalendarDates(
  preferredDate: string,
  preferredTime: string
): { startStr: string; endStr: string } | null {
  const dateMatch = preferredDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!dateMatch) return null;
  const [, yyyy, mm, dd] = dateMatch;

  const slotMatch = preferredTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!slotMatch) return null;

  let startHour = parseInt(slotMatch[1], 10);
  const startMin = parseInt(slotMatch[2], 10);
  const ampm = slotMatch[3].toUpperCase();

  if (ampm === 'PM' && startHour < 12) startHour += 12;
  if (ampm === 'AM' && startHour === 12) startHour = 0;

  // Each consultation slot has an exact duration of 30 minutes
  let endHour = startHour;
  let endMin = startMin + 30;
  if (endMin >= 60) {
    endHour += 1;
    endMin -= 60;
  }

  const pad = (n: number) => n.toString().padStart(2, '0');

  const startStr = `${yyyy}${mm}${dd}T${pad(startHour)}${pad(startMin)}00`;
  const endStr = `${yyyy}${mm}${dd}T${pad(endHour)}${pad(endMin)}00`;

  return { startStr, endStr };
}

/**
 * Builds a draft Google Calendar "Add Event" URL prefilled with academic consultation details.
 * 
 * Privacy & Security Notice:
 * Sensitive personal queries, marks details, or personal phone numbers are NOT placed in
 * the public calendar URL parameters to prevent URL leakage or referrer tracking.
 */
export function buildGoogleCalendarUrl(request: ConsultationRequest): string {
  const { fullName, courseInterest, preferredDate, preferredTime } = request;

  const eventTitle = encodeURIComponent(`Draft Reminder: Antariksh Academy Consultation - ${courseInterest}`);

  const descriptionText = [
    `Draft reminder for academic counseling session with Antariksh Academy (Berhampur).`,
    ``,
    `Student/Parent: ${fullName}`,
    `Course: ${courseInterest}`,
    `Requested Window: ${preferredTime}`,
    ``,
    `IMPORTANT NOTICE:`,
    `This is a provisional personal calendar draft. The Antariksh Academy Admissions Desk`,
    `will review counselor availability and email the confirmed slot and official Google Meet`,
    `video link prior to the session.`,
    ``,
    `Academy Admissions Desk: ${ACADEMY_CONFIG.contact.phoneDisplay}`,
    `Email: ${ACADEMY_CONFIG.contact.email}`,
    `Campus Address: ${ACADEMY_CONFIG.address.fullFormatted}`,
  ].join('\n');

  const encodedDescription = encodeURIComponent(descriptionText);
  const encodedLocation = encodeURIComponent(`${ACADEMY_CONFIG.name}, ${ACADEMY_CONFIG.address.street}, ${ACADEMY_CONFIG.address.city}`);

  const datesObj = formatCalendarDates(preferredDate, preferredTime);
  const datesParam = datesObj ? `&dates=${datesObj.startStr}/${datesObj.endStr}&ctz=${encodeURIComponent(ACADEMY_CONFIG.consultation.timeZone)}` : '';

  // Pre-fill attendee as academy contact email
  const attendeesParam = `&add=${encodeURIComponent(ACADEMY_CONFIG.contact.email)}`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&details=${encodedDescription}&location=${encodedLocation}${datesParam}${attendeesParam}`;
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
