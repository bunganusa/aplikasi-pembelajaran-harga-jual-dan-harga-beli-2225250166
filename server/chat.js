import { buildSystemPrompt, STAGES } from '../shared/rmt.js'
import { PROBLEMS } from '../shared/problems.js'
import { KUNCI } from './kunci.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metode permintaan tidak diizinkan.' })
  }

  const key = process.env.AI_API_KEY || process.env.DEEPSEEK_API_KEY
  if (!key) {
    return res.status(503).json({ error: 'AI_API_KEY belum diatur. Tambahkan kunci AI ke file .env lokal atau Environment Variables di Vercel.' })
  }

  const body = req.body
  if (!body || typeof body !== 'object' || !Array.isArray(body.messages)) {
    return res.status(400).json({ error: 'Format percakapan tidak valid.' })
  }

  const problem = PROBLEMS.find((item) => item.id === body.problemId)
  if (!problem) {
    return res.status(400).json({ error: 'Soal tidak ditemukan.' })
  }

  const stageId = Number(body.stageId)
  if (!STAGES.some((stage) => stage.id === stageId)) {
    return res.status(400).json({ error: 'Tahap RMT tidak valid.' })
  }

  const hintLevel = Number(body.hintLevel)
  const safeHintLevel = Number.isInteger(hintLevel) && hintLevel >= 1 && hintLevel <= 3 ? hintLevel : 1
  const messages = body.messages
    .filter((message) => message && ['user', 'assistant'].includes(message.role) && typeof message.content === 'string')
    .slice(-8)
    .map((message) => ({ role: message.role, content: message.content.slice(0, 800) }))

  if (!messages.length || messages[messages.length - 1].role !== 'user') {
    return res.status(400).json({ error: 'Kirim pesan siswa sebelum meminta petunjuk.' })
  }

  const system = buildSystemPrompt({
    problem,
    kunci: KUNCI[problem.id],
    stageId,
    hintLevel: safeHintLevel,
  })
  const baseUrl = (process.env.AI_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta/openai').replace(/\/+$/, '')
  const model = process.env.AI_MODEL || 'gemini-3.5-flash-lite'

  try {
    const requestBody = JSON.stringify({
      model,
      temperature: 0.2,
      max_tokens: 220,
      messages: [{ role: 'system', content: system }, ...messages],
    })
    let response

    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        response = await fetch(`${baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key}`,
          },
          body: requestBody,
          signal: AbortSignal.timeout(45000),
        })
      } catch (error) {
        if (attempt === 1 || error?.name === 'TimeoutError' || error?.name === 'AbortError') {
          throw error
        }
        await new Promise((resolve) => setTimeout(resolve, 500))
        continue
      }

      if (response.status < 500 || attempt === 1) break
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    const data = await response.json()

    if (!response.ok) {
      if (response.status === 429) {
        return res.status(429).json({ error: 'Kuota gratis AI sedang penuh atau permintaan terlalu cepat. Tunggu sebentar atau cek batas project di AI Studio.' })
      }
      return res.status(502).json({ error: data?.error?.message || 'Penyedia AI gagal memproses pesan.' })
    }

    const reply = data?.choices?.[0]?.message?.content
    if (typeof reply !== 'string' || !reply.trim()) {
      return res.status(502).json({ error: 'Penyedia AI tidak mengirim jawaban. Silakan coba lagi.' })
    }

    return res.status(200).json({ reply })
  } catch (error) {
    console.error('Gagal menghubungi penyedia AI:', error)
    if (error?.name === 'TimeoutError' || error?.name === 'AbortError') {
      return res.status(504).json({ error: 'Waktu tunggu AI habis. Coba kirim pesan lagi sebentar lagi.' })
    }
    return res.status(502).json({ error: 'Gagal menghubungi penyedia AI. Periksa koneksi dan pengaturan AI.' })
  }
}
