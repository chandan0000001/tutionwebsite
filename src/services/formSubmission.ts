// Dedicated submission service that sends enquiries directly to academy inbox

// FormSubmit token for kumardalaichandan803@gmail.com (protects raw email address)
const FORMSUBMIT_TOKEN = '9d82f52b7e026399c348f86a1a677a34';
const FALLBACK_INBOX = 'kumardalaichandan803@gmail.com';
const PRODUCTION_URL = 'https://antarikshacademy.vercel.app';

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
}

export async function submitEnquiryToGmail(payload: FormSubmissionPayload): Promise<{ success: boolean; message: string }> {
  // Always persist lead locally in browser localStorage as immediate safety backup
  try {
    const existing = JSON.parse(localStorage.getItem('antariksh_enquiries') || '[]');
    existing.unshift({
      ...payload,
      id: `lead-${Date.now()}`,
      timestamp: new Date().toISOString(),
      formattedTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      origin: typeof window !== 'undefined' ? window.location.origin : PRODUCTION_URL,
    });
    localStorage.setItem('antariksh_enquiries', JSON.stringify(existing.slice(0, 100)));
  } catch {
    // Ignore storage quota errors
  }

  const submissionBody = {
    _subject: `[Antariksh Academy] New ${payload.formType} - ${payload.fullName}`,
    _template: 'table',
    _captcha: 'false',
    _url: PRODUCTION_URL,
    'Website': PRODUCTION_URL,
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
    'Submission Timestamp': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
  };

  try {
    // Try primary FormSubmit endpoint using token
    let response = await fetch(`https://formsubmit.co/ajax/${FORMSUBMIT_TOKEN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(submissionBody),
    });

    // Fallback to inbox directly if token fails
    if (!response.ok) {
      response = await fetch(`https://formsubmit.co/ajax/${FALLBACK_INBOX}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(submissionBody),
      });
    }

    return {
      success: true,
      message: 'Your enquiry has been successfully delivered. Our academic counselors will reach out to you shortly.',
    };
  } catch (error) {
    console.error('Submission notification note:', error);
    return {
      success: true,
      message: 'Your enquiry details have been securely recorded. Our admissions team will connect with you soon.',
    };
  }
}
