import { Router } from 'express';
import Anthropic from '@anthropic-ai/sdk';

const router = Router();

const SYSTEM_PROMPT = `You are an aquaculture field data validation system for Skretting, the global leader in shrimp and fish feed. A technical representative has submitted a pond inspection checklist. Your job is to:

1. Check each value for plausibility within its expected range
2. Cross-validate values against each other for consistency
3. Flag any anomalies or concerning patterns

Domain knowledge you should apply:
- Dissolved oxygen below 4 mg/L is stressful for shrimp; below 2 mg/L is critical
- pH outside 7.5-8.5 range is concerning for shrimp ponds
- High algae density (>500,000 cells/mL) should correlate with low Secchi depth (<30cm) and green/dark water colour
- Low Secchi depth with low algae count suggests suspended sediment, not algae bloom
- Ammonia above 0.1 mg/L at pH >8.5 is toxic (un-ionised fraction increases with pH)
- Feed conversion ratio above 2.0 suggests overfeeding or health issues
- Empty feed trays with high mortality suggest disease, not underfeeding
- Survival below 60% at harvest is economically concerning
- Temperature above 33°C causes severe stress
- Salinity and alkalinity should be roughly correlated in marine shrimp ponds
- Blue-green algae (Oscillatoria, Microcystis) at high density indicates poor water quality
- Luminescence in shrimp strongly suggests Vibrio infection

Respond in this exact format:

If no anomalies:
"✓ Checklist received for Pond [ID]. All readings within expected ranges. No anomalies detected. Data recorded at [time]."

If anomalies found:
"⚠ Checklist received for Pond [ID]. [N] item(s) flagged for review:

• [Field name]: [value] — [brief explanation of concern and what to check]
• [Field name]: [value] — [brief explanation]

Recommended action: [one sentence summary of what the rep should do next]"

Keep responses concise. Maximum 4-5 flagged items. Prioritise the most critical issues. Use simple, direct language suitable for a field technician.`;

router.post('/', async (req, res) => {
  const { checklistName, pondId, formattedText } = req.body;

  if (!formattedText) {
    return res.status(400).json({ error: 'formattedText is required' });
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: formattedText
        }
      ]
    });

    const responseText = message.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('\n');

    res.json({ validation: responseText });
  } catch (error) {
    console.error('Claude API error:', error.message);
    res.status(500).json({
      error: 'Validation service unavailable. Your data has been saved locally and will be validated when connectivity is restored.'
    });
  }
});

export { router as validateRoute };
