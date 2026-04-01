import React, { useState, useEffect } from 'react';
import { ChevronLeft, AlertCircle } from 'lucide-react';

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

function validateField(field, value) {
  if (field.type === 'number' && value !== '') {
    const num = parseFloat(value);
    if (field.min !== undefined && num < field.min) return `Below minimum (${field.min})`;
    if (field.max !== undefined && num > field.max) return `Above maximum (${field.max})`;
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-skretting-navy sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-gray-300 hover:text-white transition-colors duration-150 flex-shrink-0"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">{checklist.name}</p>
            <p className="text-gray-400 text-xs">{checklist.fields.length} fields</p>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-lg mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {checklist.fields.map(field => (
            <div key={field.key}>
              <label className="label">
                {field.label}
                {field.required && <span className="text-red-500 ml-0.5">*</span>}
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
                    className={`input-field ${errors[field.key] ? 'error' : ''}`}
                    value={values[field.key] || ''}
                    min={field.min}
                    max={field.max}
                    step={field.step || 1}
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
                          className="w-4 h-4 rounded border-gray-300 text-skretting-teal accent-skretting-teal"
                        />
                        <span className="text-sm text-skretting-navy">{opt}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {errors[field.key] && (
                <div className="flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                  <p className="text-xs text-red-500">{errors[field.key]} — verify reading</p>
                </div>
              )}
            </div>
          ))}

          <div className="pt-2 pb-8">
            <button
              type="submit"
              disabled={!requiredFilled}
              className="w-full bg-skretting-teal text-white font-medium py-3 rounded-lg transition-colors duration-150 hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
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
