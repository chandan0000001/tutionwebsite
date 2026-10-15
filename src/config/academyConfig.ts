/**
 * Antariksh Academy - Master Configuration File
 * 
 * Centralized settings for academy details, contact information, social links,
 * and integration parameters. Edit values here to update them across the entire website.
 */

export const ACADEMY_CONFIG = {
  name: 'Antariksh Academy',
  legalName: 'Antariksh Academy Coaching Institute',
  tagline: 'Your Future. Our Guidance. Your Success.',
  motto: 'Education for world stage',
  websiteUrl: 'https://antarikshacademy.vercel.app',
  heroSubtitle:
    'Prepare for your +2 board examinations and competitive entrance exams with experienced faculty, structured learning, and personalised academic guidance at Antariksh Academy.',
  
  // Official Physical Location
  address: {
    street: 'Bijipur, Big Street',
    city: 'Brahmapur (Berhampur)',
    state: 'Odisha',
    pincode: '760001',
    country: 'India',
    fullFormatted: 'Bijipur, Big Street, Brahmapur, Odisha 760001, India',
  },

  // Contact Information
  contact: {
    // Official public email shown on website (protecting personal email)
    publicEmail: 'info@antarikshacademy.com',
    internalSubmissionEmail: 'kumardalaichandan803@gmail.com',
    email: 'info@antarikshacademy.com',
    
    phoneDisplay: '+91 90901 60793',
    phoneRaw: '+919090160793',
    whatsappDisplay: '+91 90901 60793 (Admissions Desk)',
    whatsappNumber: '919090160793',
    
    officeHours: 'Monday – Saturday: 7:00 AM – 7:30 PM | Sunday: 8:00 AM – 1:00 PM (Doubt Sessions & Tests)',
  },

  // Official Social Media Profiles
  socials: {
    facebook: 'https://www.facebook.com/people/Antariksh-Academy-Berhampur/100066790522018/',
    instagram: 'https://www.instagram.com/antarikshacademy1/',
    googleMapsDirections: 'https://www.google.com/maps/search/?api=1&query=Bijipur,+Big+Street,+Brahmapur,+Odisha+760001',
    googleMapsEmbedUrl: 'https://www.google.com/maps?q=Bijipur,+Big+Street,+Brahmapur,+Odisha+760001&output=embed',
  },

  // Consultation & Scheduling Settings
  consultation: {
    durationMinutes: 30,
    modes: ['Google Meet Video Call', 'In-Person at Bijipur Centre', 'Phone Consultation'],
    availableSlots: [
      '09:00 AM - 09:30 AM',
      '10:30 AM - 11:00 AM',
      '02:00 PM - 02:30 PM',
      '04:30 PM - 05:00 PM',
      '06:00 PM - 06:30 PM',
    ],
    mode: 'production' as 'demo' | 'production',
  },

  // Trust Indicators
  highlights: [
    { label: 'Targeted Prep', value: '+2 Science CHSE' },
    { label: 'Competitive Streams', value: 'JEE • NEET • NDA' },
    { label: 'Academic Mentoring', value: 'Daily Doubt Clearing' },
    { label: 'Center Location', value: 'Bijipur, Brahmapur' },
  ],
} as const;
