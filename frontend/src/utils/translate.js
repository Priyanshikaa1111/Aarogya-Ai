import { translateAPI } from '../services/api.js'

/**
 * Translates a list of AI-generated health response strings into the given
 * target language. Returns the original texts unchanged if language is
 * English, or if translation fails for any reason (missing API key, network
 * error, etc.) so the UI always falls back gracefully to English.
 */
export async function translateTexts(texts, language) {
  if (!texts || texts.length === 0 || language === 'en') {
    return texts
  }
  try {
    const res = await translateAPI.translate({ texts, target_language: language })
    return res.data.translated_texts
  } catch {
    return texts
  }
}
