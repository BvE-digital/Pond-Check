import React, { useState, useEffect } from 'react';
import { ChevronLeft, AlertCircle, Wand2 } from 'lucide-react';

function getInitialValues(fields) {
  const values = {};
  for (const field of fields) {
    if (field.type === 'date') {
      values[field.key] = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD in local time
    } else if (field.type === 'time') {
      const now = new Date();
      values[field.key] = now.toTimeString().slice(0, 5); // HH:MM
    } else if (field.type === 'multiselect') {
      values[field.key] = [];
    } else {
      values[field.key] = '';
    }
  }
  return values;
}

function getAutoFillValues(fields) {
  const values = {};
  for (const field of fields) {
    if (field.type === 'date') {
      values[field.key] = new Date().toLocaleDateString('en-CA');
    } else if (field.type === 'time') {
      values[field.key] = new Date().toTimeString().slice(0, 5);
    } else if (field.type === 'number') {
      const min = field.min ?? 0;
      const max = field.max ?? 100;
      const mid = (min + max) / 2;
      const range = max - min;
      const precision = range < 0.1 ? 4 : range < 1 ? 3 : range < 10 ? 2 : range < 100 ? 1 : 0;
      values[field.key] = parseFloat(mid.toFixed(precision)).toString();
    } else if (field.type === 'select') {
      values[field.key] = field.options?.[0] || '';
    } else if (field.type === 'multiselect') {
      values[field.key] = field.options ? [field.options[0]] : [];
    } else if (field.type === 'text') {
      values[field.key] = field.placeholder?.replace(/^e\.g\.\s*/i, '') || '';
    } else {
      values[field.key] = '';
    }
  }
  return values;
}

function validateField(field, value) {
  if (field.type === 'number' && value !== '') {
    const num = parseFloat(value);
    if (field.min !== undefined && num < field.min) return `Outside normal range, expected ≥ ${field.min}${field.unit ? ' ' + field.unit : ''}`;
    if (field.max !== undefined && num > field.max) return `Outside normal range, expected ≤ ${field.max}${field.unit ? ' ' + field.unit : ''}`;
  }
  return null;
}

export default function ChecklistForm({ checklist, onSubmit, onBack }) {
  const [values, setValues] = useState(() => getInitialValues(checklist.fields));
  const [errors, setErrors] = useState({});
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    setValues(getInitialValues(checklist.fields));
    setErrors({});
    setAttempted(false);
  }, [checklist.id]);

  function handleChange(key, value) {
    setValues(prev => ({ ...prev, [key]: value }));

    if (attempted) {
      const field = checklist.fields.find(f => f.key === key);
      if (field) {
        const err = validateField(field, value);
        setErrors(prev => ({ ...prev, [key]: err }));
      }
    }
  }

  function handleMultiselectToggle(key, option) {
    setValues(prev => {
      const current = prev[key] || [];
      const next = current.includes(option)
        ? current.filter(v => v !== option)
        : [...current, option];
      return { ...prev, [key]: next };
    });
  }

  function handleAutoFill() {
    const filled = getAutoFillValues(checklist.fields);
    setValues(filled);
    setErrors({});
    setAttempted(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setAttempted(true);

    // Run range validation on all fields but do NOT block submission
    const newErrors = {};
    for (const field of checklist.fields) {
      const err = validateField(field, values[field.key]);
      if (err) newErrors[field.key] = err;
    }
    setErrors(newErrors);

    // Always submit — range errors are warnings, not blockers
    onSubmit(values);
  }

  const requiredFilled = checklist.fields
    .filter(f => f.required)
    .every(f => {
      const v = values[f.key];
      if (Array.isArray(v)) return v.length > 0;
      return v !== '' && v !== undefined && v !== null;
    });

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
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-skretting-navy leading-tight">{checklist.name}</p>
            <p className="text-xs text-skretting-muted">{checklist.fields.length} fields</p>
          </div>
          {checklist.id === 'water-quality-advanced' && (
            <button
              type="button"
              onClick={handleAutoFill}
              title="Fill with valid sample values"
              className="flex-shrink-0 p-1.5 rounded-md text-skretting-muted hover:text-skretting-teal hover:bg-skretting-teal-soft transition-colors duration-150"
            >
              <Wand2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Form */}
      <main className="max-w-lg mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {checklist.fields.map(field => (
            <div key={field.key}>
              <label className="label">
                {field.label}
                {field.required && <span className="text-skretting-red ml-0.5">*</span>}
              </label>

              {field.type === 'text' && (
                <input
                  type="text"
                  className="input-field"
                  value={values[field.key] || ''}
                  placeholder={field.placeholder || ''}
                  onChange={e => handleChange(field.key, e.target.value)}
                />
              )}

              {field.type === 'date' && (
                <input
                  type="date"
                  className="input-field"
                  value={values[field.key] || ''}
                  onChange={e => handleChange(field.key, e.target.value)}
                />
              )}

              {field.type === 'time' && (
                <input
                  type="time"
                  className="input-field"
                  value={values[field.key] || ''}
                  onChange={e => handleChange(field.key, e.target.value)}
                />
              )}

              {field.type === 'number' && (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className={`input-field ${errors[field.key] ? 'warning' : ''}`}
                    value={values[field.key] || ''}
                    step="any"
                    onChange={e => handleChange(field.key, e.target.value)}
                  />
                  {field.unit && (
                    <span className="text-sm text-skretting-muted flex-shrink-0 min-w-[2rem]">
                      {field.unit}
                    </span>
                  )}
                </div>
              )}

              {field.type === 'select' && (
                <select
                  className="input-field"
                  value={values[field.key] || ''}
                  onChange={e => handleChange(field.key, e.target.value)}
                >
                  <option value="">Select…</option>
                  {field.options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              )}

              {field.type === 'multiselect' && (
                <div className="border border-skretting-border rounded-md bg-white p-3 space-y-2">
                  {field.options.map(opt => {
                    const checked = (values[field.key] || []).includes(opt);
                    return (
                      <label key={opt} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleMultiselectToggle(field.key, opt)}
                          className="w-4 h-4 rounded border-gray-300 accent-skretting-teal"
                        />
                        <span className="text-sm text-skretting-navy">{opt}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {errors[field.key] && (
                <div className="flex items-start gap-1.5 mt-1.5 p-2 bg-amber-50 border border-amber-200 rounded-md">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-700">{errors[field.key]} - flagged for review</p>
                </div>
              )}
            </div>
          ))}

          <div className="pt-2 pb-8">
            <button
              type="submit"
              disabled={!requiredFilled}
              className="w-full bg-skretting-teal text-white font-medium py-3 rounded-lg transition-colors duration-150 hover:bg-skretting-teal-dark disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Submit Inspection
            </button>
            {!requiredFilled && (
              <p className="text-xs text-skretting-muted text-center mt-2">
                Fill in all required fields to submit
              </p>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}
