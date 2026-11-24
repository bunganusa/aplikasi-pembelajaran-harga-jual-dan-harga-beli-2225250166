const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim().replace(/\/+$/, '')
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()
const participantStorageKey = 'sobat-belajar:participant-id'

export const isProgressStorageConfigured = Boolean(supabaseUrl && supabasePublishableKey)

function getParticipantId() {
  let participantId = localStorage.getItem(participantStorageKey)

  if (!participantId) {
    participantId = crypto.randomUUID()
    localStorage.setItem(participantStorageKey, participantId)
  }

  return participantId
}

export async function saveLearningProgress(studentName, activity, score = null) {
  if (!isProgressStorageConfigured) {
    throw new Error('Supabase belum dikonfigurasi. Progres ini belum tersimpan online.')
  }

  const normalizedName = studentName.trim()
  if (!normalizedName || normalizedName.length > 100) {
    throw new Error('Nama siswa harus diisi dan maksimal 100 karakter.')
  }

  let response
  try {
    response = await fetch(`${supabaseUrl}/rest/v1/learning_progress`, {
      method: 'POST',
      headers: {
        apikey: supabasePublishableKey,
        Authorization: `Bearer ${supabasePublishableKey}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        participant_id: getParticipantId(),
        student_name: normalizedName,
        activity,
        score,
      }),
    })
  } catch {
    throw new Error('Tidak dapat terhubung ke Supabase. Periksa koneksi internet.')
  }

  if (!response.ok) {
    console.error('Supabase gagal menyimpan progres, status:', response.status)
    throw new Error(`Progres belum tersimpan (HTTP ${response.status}). Periksa konfigurasi Supabase.`)
  }
}
