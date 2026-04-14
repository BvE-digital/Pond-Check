import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, CheckCircle, AlertCircle } from 'lucide-react';
import PhoneMockup from './PhoneMockup.jsx';
import { formatSubmission } from '../utils/formatSubmission.js';

function TypingIndicator() {
  return (
    <div className="flex items-end gap-1 mr-auto">
      <div className="bg-skretting-light rounded-tr-2xl rounded-bl-sm rounded-br-2xl rounded-tl-2xl px-4 py-3 flex items-center gap-1">
        <span className="w-2 h-2 bg-skretting-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 bg-skretting-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 bg-skretting-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}

function OutgoingBubble({ text, timestamp }) {
  return (
    <div className="flex flex-col items-end gap-1">
      <div className="bg-skretting-teal text-white rounded-tl-2xl rounded-bl-2xl rounded-tr-sm rounded-br-2xl px-4 py-3 max-w-[85%]">
        <pre className="text-xs leading-relaxed whitespace-pre-wrap font-sans">{text}</pre>
      </div>
      {timestamp && (
        <span className="text-xs text-skretting-muted">{timestamp}</span>
      )}
    </div>
  );
}

function IncomingBubble({ text, timestamp }) {
  return (
    <div className="flex flex-col items-start gap-1">
      <div className="bg-white text-skretting-navy border border-skretting-border rounded-tr-2xl rounded-bl-sm rounded-br-2xl rounded-tl-2xl px-4 py-3 max-w-[85%]">
        <p className="text-xs leading-relaxed whitespace-pre-wrap">{text}</p>
      </div>
      {timestamp && (
        <span className="text-xs text-skretting-muted">{timestamp}</span>
      )}
    </div>
  );
}

function formatTime(date) {
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export default function SmsView({ checklist, formData, submission, onBack }) {
  const [outgoingText, setOutgoingText] = useState('');
  const [outgoingTime, setOutgoingTime] = useState('');
  const [incomingText, setIncomingText] = useState('');
  const [incomingTime, setIncomingTime] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState(null);
  const messageAreaRef = useRef(null);

  useEffect(() => {
    // Historical view: populate from saved submission, no API calls needed
    if (submission && submission.claude_response) {
      const formatted = formatSubmission(checklist, submission.data || formData);
      setOutgoingText(formatted);
      setOutgoingTime(
        submission.submitted_at
          ? new Date(submission.submitted_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
          : formatTime(new Date())
      );
      setIncomingText(submission.claude_response);
      setIncomingTime(
        submission.submitted_at
          ? new Date(submission.submitted_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
          : formatTime(new Date())
      );
      setIsSaved(true);
      return;
    }

    // New submission flow
    async function runValidation() {
      const formatted = formatSubmission(checklist, formData);
      const sentAt = new Date();
      setOutgoingText(formatted);
      setOutgoingTime(formatTime(sentAt));
      setIsTyping(true);

      try {
        const validateRes = await fetch('/api/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            checklistName: checklist.name,
            pondId: formData.pond_id || '',
            formattedText: formatted,
          }),
        });

        const validateData = await validateRes.json();
        const validationText = validateData.validation || validateData.error || 'Validation unavailable.';
        const receivedAt = new Date();

        setIsTyping(false);
        setIncomingText(validationText);
        setIncomingTime(formatTime(receivedAt));

        const status = validationText.includes('⚠') ? 'flagged' : 'clear';

        // Save to database
        await fetch('/api/submissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            checklist_id: checklist.id,
            checklist_name: checklist.name,
            pond_id: formData.pond_id || 'Unknown',
            data: formData,
            status,
            claude_response: validationText,
          }),
        });

        setIsSaved(true);
      } catch (err) {
        setIsTyping(false);
        const fallback = 'Validation service unavailable. Your data has been saved locally.';
        setIncomingText(fallback);
        setIncomingTime(formatTime(new Date()));
        setError(err.message);

        // Still attempt to save without validation
        await fetch('/api/submissions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            checklist_id: checklist.id,
            checklist_name: checklist.name,
            pond_id: formData.pond_id || 'Unknown',
            data: formData,
            status: 'pending',
            claude_response: fallback,
          }),
        }).catch(() => {});

        setIsSaved(true);
      }
    }

    runValidation();
  }, []);

  // Scroll to bottom when incoming message arrives
  useEffect(() => {
    if (incomingText && messageAreaRef.current) {
      messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }
  }, [incomingText]);

  const isHistorical = !!(submission && submission.claude_response);

  return (
    <div className="min-h-screen bg-skretting-light">
      {/* Header — white with Skretting red accent */}
      <header className="app-header">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-skretting-muted hover:text-skretting-navy transition-colors duration-150 flex-shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <p className="text-sm font-semibold text-skretting-navy leading-tight">
              {isHistorical ? 'Past Submission' : 'Submission Sent'}
            </p>
            <p className="text-xs text-skretting-muted">
              {checklist?.name || 'Inspection'} — Pond {formData?.pond_id || submission?.pond_id || '—'}
            </p>
          </div>
        </div>
      </header>

      {/* Phone mockup */}
      <main className="max-w-lg mx-auto px-4 py-6">
        <PhoneMockup contactName="PondCheck AI">
          <div ref={messageAreaRef} className="flex flex-col gap-3 overflow-y-auto">
            {outgoingText && (
              <OutgoingBubble text={outgoingText} timestamp={outgoingTime} />
            )}
            {isTyping && <TypingIndicator />}
            {incomingText && (
              <IncomingBubble text={incomingText} timestamp={incomingTime} />
            )}
          </div>
        </PhoneMockup>

        {/* Status indicators below phone */}
        <div className="mt-4 flex flex-col items-center gap-3">
          {isSaved && (
            <div className="flex items-center gap-1.5 text-sm text-green-700">
              <CheckCircle className="w-4 h-4" />
              <span>Saved to data log</span>
            </div>
          )}

          <button
            onClick={onBack}
            className="btn-secondary text-sm px-6"
          >
            Back to checklists
          </button>
        </div>
      </main>
    </div>
  );
}
