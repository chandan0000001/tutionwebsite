import React from 'react';
import { X, Calendar, Shield } from 'lucide-react';
import { PRODUCTION_INTEGRATION_DOCS } from '../utils/googleCalendar';
import { ACADEMY_CONFIG } from '../config/academyConfig';

interface GoogleMeetGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleMeetGuideModal: React.FC<GoogleMeetGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Google Meet Production Integration Architecture"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 text-white shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-500/40 flex items-center justify-center text-[#FC1682]">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-['Outfit',sans-serif] text-white">
                Google Meet & Calendar Integration Architecture
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Production Setup Guide for Antariksh Academy Web Engineers
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close Guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security & Client-Side Limitation Warning */}
        <div className="bg-pink-950/40 border border-pink-800/60 rounded-2xl p-4 text-xs text-pink-200 mb-6 space-y-2">
          <div className="flex items-center gap-2 font-bold text-pink-300">
            <Shield className="w-4 h-4 shrink-0 text-[#FC1682]" />
            <span>Why Static React Frontends Must Not Call Private Calendar APIs Directly:</span>
          </div>
          <p className="leading-relaxed">
            Google Calendar API requires either an authenticated OAuth 2.0 user consent flow or a Service Account
            private key. Embedding Google Cloud client secrets, private keys, or passwords inside client-side JavaScript
            is a severe security risk that exposes your Google Workspace account.
          </p>
        </div>

        {/* 5 Architectural Steps */}
        <div className="space-y-4 mb-8">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            5-Step Implementation Checklist to Go Live:
          </h4>

          {PRODUCTION_INTEGRATION_DOCS.steps.map((s) => (
            <div
              key={s.step}
              className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-4 text-left flex items-start gap-3.5"
            >
              <span className="w-6 h-6 rounded-full bg-[#0284C7]/30 border border-cyan-500/60 text-cyan-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {s.step}
              </span>
              <div>
                <h5 className="text-sm font-bold text-white mb-1">{s.title}</h5>
                <p className="text-xs text-slate-300 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Configuration Code Sample */}
        <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 text-left font-mono text-xs mb-6">
          <div className="text-slate-400 text-[11px] mb-2 flex items-center justify-between border-b border-slate-800 pb-2">
            <span>Example: Backend API Payload Request</span>
            <span className="text-[#00C8FF]">Node / Express / Serverless</span>
          </div>
          <pre className="text-emerald-400 overflow-x-auto text-[11px] leading-relaxed">
{`// POST /api/schedule-consultation
const event = await calendar.events.insert({
  calendarId: 'primary',
  conferenceDataVersion: 1,
  requestBody: {
    summary: 'Antariksh Academy Consultation: ' + req.body.fullName,
    attendees: [
      { email: req.body.email },
      { email: '${ACADEMY_CONFIG.contact.email}' }
    ],
    conferenceData: {
      createRequest: { requestId: crypto.randomUUID() }
    }
  }
});
// Return: event.data.hangoutLink (meet.google.com/xxx-xxxx-xxx)`}
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <span className="text-xs text-slate-400">
            Academy Contact: {ACADEMY_CONFIG.contact.email}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#FC1682] to-[#D9146C] hover:from-[#E00E70] text-white transition-colors cursor-pointer shadow-md"
          >
            Understood & Close
          </button>
        </div>

      </div>
    </div>
  );
};
