/**
 * Converts checklist form data into a human-readable SMS text block.
 * Iterates fields in definition order, skips empty values.
 * @param {Object} checklist - The full checklist definition object
 * @param {Object} formData - Key/value pairs from the form
 * @returns {string}
 */
export function formatSubmission(checklist, formData) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  const lines = [
    `POND INSPECTION REPORT`,
    `Checklist: ${checklist.name}`,
    `Submitted: ${dateStr} at ${timeStr}`,
    ``,
    `FIELD DATA:`,
  ];

  for (const field of checklist.fields) {
    const value = formData[field.key];

    if (value === undefined || value === null || value === '') continue;
    if (Array.isArray(value) && value.length === 0) continue;

    let displayValue;
    if (Array.isArray(value)) {
      displayValue = value.join(', ');
    } else {
      displayValue = String(value);
    }

    const unit = field.unit ? ` ${field.unit}` : '';
    lines.push(`• ${field.label}: ${displayValue}${unit}`);
  }

  return lines.join('\n');
}
