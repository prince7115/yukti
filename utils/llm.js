/**
 * Yukti - LLM Provider Switch
 * OpenAI (ChatGPT API) is used when OPENAI_API_KEY is set, otherwise Gemini.
 * Every function returns null on failure so callers can fall back to offline logic.
 */

const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

function validKey(key, placeholder) {
  return Boolean(key && key.length > 5 && key !== placeholder);
}

function getProvider() {
  if (validKey(process.env.OPENAI_API_KEY, 'YOUR_OPENAI_API_KEY')) return 'openai';
  if (validKey(process.env.GEMINI_API_KEY, 'YOUR_GEMINI_API_KEY')) return 'gemini';
  return null;
}

// messages: [{ role: 'user' | 'assistant', content: string }]
async function callOpenAI(system, messages, { json, temperature, maxTokens, timeoutMs }) {
  const body = {
    model: OPENAI_MODEL,
    messages: [{ role: 'system', content: system }, ...messages],
    temperature,
    max_tokens: maxTokens
  };
  if (json) body.response_format = { type: 'json_object' };

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeoutMs)
  });

  if (!response.ok) {
    const errText = await response.text();
    console.warn(`OpenAI API error ${response.status}:`, errText.slice(0, 300));
    return null;
  }
  const data = await response.json();
  return data.choices?.[0]?.message?.content || null;
}

async function callGemini(system, messages, { json, temperature, maxTokens, timeoutMs }) {
  const generationConfig = { temperature, maxOutputTokens: maxTokens };
  if (json) generationConfig.responseMimeType = 'application/json';

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': process.env.GEMINI_API_KEY
      },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents: messages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        })),
        generationConfig
      }),
      signal: AbortSignal.timeout(timeoutMs)
    }
  );

  if (!response.ok) {
    console.warn('Gemini API error status:', response.status);
    return null;
  }
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
}

async function complete(system, messages, options = {}) {
  const provider = getProvider();
  if (!provider) return null;

  const opts = {
    json: false,
    temperature: 0.5,
    maxTokens: 700,
    timeoutMs: 15000,
    ...options
  };

  try {
    const text = provider === 'openai'
      ? await callOpenAI(system, messages, opts)
      : await callGemini(system, messages, opts);
    return text ? { text, provider } : null;
  } catch (err) {
    console.warn(`${provider} call failed or timed out:`, err.message);
    return null;
  }
}

// Returns plain text, or null when no provider is available.
async function chatText(system, messages, options = {}) {
  return complete(system, messages, options);
}

// Returns a parsed JSON object, or null.
async function chatJSON(system, userPrompt, options = {}) {
  const result = await complete(system, [{ role: 'user', content: userPrompt }], { ...options, json: true });
  if (!result) return null;
  try {
    const cleaned = result.text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
    return { data: JSON.parse(cleaned), provider: result.provider };
  } catch (err) {
    console.warn('LLM returned invalid JSON:', err.message);
    return null;
  }
}

module.exports = { getProvider, chatText, chatJSON };
