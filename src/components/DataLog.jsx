import React, { useState, useEffect } from 'react';
import { ChevronLeft, Eye, ClipboardList } from 'lucide-react';

function StatusBadge({ status }) {
  if (status === 'clear') {
    return (
      <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
        ✓ Clear
      </span>
    );
  }
  if (status === 'flagged') {
    return (
      <span className="inline-flex items-center gap-1 bg-orange-100 text-skretting-orange text-xs font-medium px-2 py-0.5 rounded">
        ⚠ Flagged
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded">
      Pending
    </span>
  );
}

function formatTimestamp(ts) {
  if (!ts) return '—';
  const d = new Date(ts);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export default function DataLog({ onViewSubmission, onBack }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    fetch('/api/submissions')
      .then(res => res.json())
      .then(data => {
        setSubmissions(data);
        setLoading(false);
      })
      .catch(err => {
        setFetchError('Failed to load submissions.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-skretting-navy sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-gray-300 hover:text-white transition-colors duration-150 flex-shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-skretting-teal" />
            <span className="text-white font-semibold text-sm">Data Log</span>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="card p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {fetchError && (
          <div className="text-center py-12 text-sm text-red-600">
            {fetchError}
          </div>
        )}

        {!loading && !fetchError && submissions.length === 0 && (
          <div className="text-center py-16">
            <ClipboardList className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-skretting-muted">No submissions yet.</p>
            <p className="text-xs text-gray-400 mt-1">Completed checklists will appear here.</p>
          </div>
        )}

        {!loading && !fetchError && submissions.length > 0 && (
          <div className="card overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-3 px-4 py-2 bg-gray-50 border-b border-skretting-border text-xs font-medium text-skretting-muted uppercase tracking-wide">
              <span>Checklist / Pond</span>
              <span className="hidden sm:block">Time</span>
              <span>Status</span>
              <span></span>
            </div>

            {/* Rows */}
            {submissions.map((sub, idx) => (
              <div
                key={sub.id}
                className={`grid grid-cols-[1fr_auto_auto_auto] gap-3 px-4 py-3 items-center text-sm ${idx < submissions.length - 1 ? 'border-b border-skretting-border' : ''}`}
              >
                <div>
                  <p className="font-medium text-skretting-navy text-sm leading-tight">{sub.checklist_name}</p>
                  <p className="text-xs text-skretting-muted mt-0.5">Pond {sub.pond_id}</p>
                  <p className="text-xs text-gray-400 mt-0.5 sm:hidden">{formatTimestamp(sub.submitted_at)}</p>
                </div>
                <span className="hidden sm:block text-xs text-skretting-muted whitespace-nowrap">
                  {formatTimestamp(sub.submitted_at)}
                </span>
                <StatusBadge status={sub.status} />
                <button
                  onClick={() => onViewSubmission(sub)}
                  className="flex items-center gap-1 text-xs text-skretting-teal hover:text-teal-700 font-medium transition-colors duration-150"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
