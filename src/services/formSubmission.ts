/**
 * Antariksh Academy - Form Submission Service
 * 
 * Secure, privacy-conscious transmission of admissions enquiries, consultation
 * requests, and callback forms directly to the academy inbox via FormSubmit.
 * 
 * Destination Inbox: kumardalaichandan803@gmail.com
 * 
 * Architectural & Delivery Notice:
 * 1. This service verifies HTTP responses and parses FormSubmit's JSON response contract.
 * 2. It never reports success merely because a fetch was attempted.
 * 3. Successful provider acceptance indicates that the third-party delivery provider
 *    accepted the payload into its processing queue. It does not provide end-to-end
 *    inbox receipt verification (which requires server-side webhooks or IMAP polling).
 * 4. User data is never persisted in unencrypted browser localStorage.
 * 5. Personal form contents are never logged to the browser console.
 */

import { ACADEMY_CONFIG } from '../config/academyConfig';

export interface FormSubmissionPayload {
  formType: 'Callback Request' | 'Consultation Booking' | 'Course Enquiry' | 'General Contact';
  fullName: string;
  mobileNumber?: string;
  email?: string;
  studentClass?: string;
  courseInterest?: string;
  preferredDate?: string;
  preferredTime?: string;
  consultationType?: string;
  message?: string;
  /** Anti-spam honeypot: should remain empty when submitted by legitimate users */
  honeypot?: string;
}

export interface FormSubmissionResult {
  success: boolean;
  status: 'accepted' | 'rejected' | 'network_error';
  message: string;
}

export async function submitEnquiryToGmail(
  payload: FormSubmissionPayload
): Promise<FormSubmissionResult> {
  // Anti-spam check: If honeypot is filled by an automated bot, reject silently on client
  if (payload.honeypot && payload.honeypot.trim() !== '') {
    return {
      success: false,
      status: 'rejected',
      message: 'Automated submission detected and blocked.',
    };
  }

  const productionOrigin = typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : ACADEMY_CONFIG.websiteUrl;

  const submissionBody: Record<string, string> = {
    _subject: `[Antariksh Academy] New ${payload.formType} - ${payload.fullName}`,
    _template: 'table',
    _captcha: 'false',
    _url: productionOrigin,
    _honey: payload.honeypot || '', // Provider-level honeypot for spam bots
    'Website': productionOrigin,
    'Form Type': payload.formType,
    'Full Name': payload.fullName,
    'Phone Number': payload.mobileNumber || 'Not provided',
    'Email Address': payload.email || 'Not provided',
    'Student Class': payload.studentClass || 'N/A',
    'Course of Interest': payload.courseInterest || 'N/A',
    'Preferred Date': payload.preferredDate || 'N/A',
    'Preferred Time': payload.preferredTime || 'N/A',
    'Consultation Format': payload.consultationType || 'N/A',
    'Message / Query': payload.message || 'N/A',
    'Submission Timestamp': new Date().toLocaleString('en-IN', { timeZone: ACADEMY_CONFIG.consultation.timeZone }),
  };

  const primaryEndpoint = `${ACADEMY_CONFIG.formSubmit.endpoint}/${ACADEMY_CONFIG.formSubmit.token}`;
  const fallbackEndpoint = `${ACADEMY_CONFIG.formSubmit.endpoint}/${ACADEMY_CONFIG.formSubmit.fallbackInbox}`;

  try {
    // 1. Attempt delivery via primary FormSubmit token
    let response = await fetch(primaryEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(submissionBody),
    });

    let data: { success?: string | boolean; message?: string } | null = null;

    if (response.ok) {
      data = await response.json().catch(() => null);
    }

    // 2. If primary token endpoint fails or returns error, attempt fallback to direct inbox
    if (!response.ok || !data || (data.success !== 'true' && data.success !== true)) {
      response = await fetch(fallbackEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(submissionBody),
      });

      if (response.ok) {
        data = await response.json().catch(() => null);
      }
    }

    // 3. Strict verification of provider acceptance
    if (response.ok && data && (data.success === 'true' || data.success === true)) {
      return {
        success: true,
        status: 'accepted',
        message:
          'Your enquiry has been accepted by our admissions system. Our academic counselors will reach out to you shortly.',
      };
    }

    // Provider explicitly rejected or returned unsuccessful HTTP response
    return {
      success: false,
      status: 'rejected',
      message:
        'The admissions delivery service could not accept your request at this moment. Please call our admissions desk or connect via WhatsApp.',
    };
  } catch {
    // Network exception (offline, DNS failure, CORS block, timeout)
    // NOTE: Personal form contents are intentionally NOT logged to protect user privacy.
    return {
      success: false,
      status: 'network_error',
      message:
        'Unable to connect to the admissions service. Please check your internet connection or contact us directly via Phone or WhatsApp.',
    };
  }
}
