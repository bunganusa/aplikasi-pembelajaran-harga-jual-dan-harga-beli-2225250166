import { useState, useRef, useEffect } from 'react'
import { PROBLEMS } from '../shared/problems.js'
import { STAGES } from '../shared/rmt.js'
import { isProgressStorageConfigured, saveLearningProgress } from './learningProgress.js'

function App() {
  const [namaSiswa, setNamaSiswa] = useState('')
  const [kelasSiswa, setKelasSiswa] = useState('')
  const [mulai, setMulai] = useState(false)
  const [halaman, setHalaman] = useState('Beranda')
  
  // Nama Pembuat Tetap
  const namaPembuat = "Bunga Nusa Pertiwi"

  // State Musik
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)

  // State Pretest (Kemampuan Awal - Dibuat Standar-Menengah)
  const [currentPreIndex, setCurrentPreIndex] = useState(0)
  const [preAnswers, setPreAnswers] = useState({})
  const [preSubmitted, setPreSubmitted] = useState(false)
  const [preScore, setPreScore] = useState(0)

  // State Latihan Soal (10 Soal)
  const [latihanIndex, setLatihanIndex] = useState(0)
  const [latihanAnswers, setLatihanAnswers] = useState({})
  const [latihanChecked, setLatihanChecked] = useState({})

  // State Posttest (Evaluasi Akhir)
  const [currentPostIndex, setCurrentPostIndex] = useState(0)
  const [postAnswers, setPostAnswers] = useState({})
  const [postSubmitted, setPostSubmitted] = useState(false)
  const [postScore, setPostScore] = useState(0)
  const [progressStatus, setProgressStatus] = useState(null)

  // State Simulasi
  const [modalModal, setModalModal] = useState('')

  // State Asisten AI berbasis RMT
  const [aiProblemId, setAiProblemId] = useState(PROBLEMS[0].id)
  const [aiStageId, setAiStageId] = useState(1)
  const [aiHintLevel, setAiHintLevel] = useState(1)
  const [aiChats, setAiChats] = useState({})
  const [aiInput, setAiInput] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiError, setAiError] = useState('')
  const aiEndRef = useRef(null)
  const aiProblem = PROBLEMS.find((problem) => problem.id === aiProblemId)
  const aiMessages = aiChats[aiProblemId] || []
  const aiStage = STAGES.find((stage) => stage.id === aiStageId)

  useEffect(() => {
    aiEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [aiMessages, aiLoading])

  // Data Soal Pretest (5 Soal - Tingkat Standar Menengah Kelas 7)
  const pretestSoal = [
    {
      id: 1,
      soal: 'Ibu membeli 3 lusin piring dengan harga total Rp180.000. Berapa harga beli untuk 1 buah piring?',
      opsi: ['Rp3.000', 'Rp4.000', 'Rp5.000', 'Rp6.000'],
      kunci: 'Rp5.000'
    },
    {
      id: 2,
      soal: 'Pak Budi membeli sepeda seharga Rp500.000, lalu menjualnya seharga Rp575.000. Persentase keuntungan yang diperoleh Pak Budi adalah...',
      opsi: ['10%', '12,5%', '15%', '20%'],
      kunci: '15%'
    },
    {
      id: 3,
      soal: 'Sebuah tas dijual dengan harga Rp160.000 dan pedagang mengalami kerugian sebesar Rp40.000. Berapa persentase kerugian dari harga pembeliannya?',
      opsi: ['15%', '20%', '25%', '30%'],
      kunci: '20%'
    },
    {
      id: 4,
      soal: 'Siti membeli selusin buku seharga Rp72.000. Jika ia menjual buku tersebut secara eceran seharga Rp7.000 per buah, berapakah total keuntungan Siti?',
      opsi: ['Rp10.000', 'Rp12.000', 'Rp15.000', 'Rp18.000'],
      kunci: 'Rp12.000'
    },
    {
      id: 5,
      soal: 'Sebuah lemari es dibeli dengan harga Rp2.000.000 dan dijual kembali dengan kerugian 10%. Berapa rupiah besar kerugian tersebut?',
      opsi: ['Rp150.000', 'Rp180.000', 'Rp200.000', 'Rp250.000'],
      kunci: 'Rp200.000'
    }
  ]

  // Data Latihan Soal (10 Soal Kelas 7)
  const latihanSoalList = [
    {
      id: 1,
      soal: 'Pak Rudi membeli 40 kg jeruk seharga Rp10.000 per kg. Seluruh jeruk dijual kembali dengan harga total Rp450.000. Berapa keuntungan Pak Rudi?',
      opsi: ['Rp40.000', 'Rp50.000', 'Rp60.000', 'Rp90.000'],
      kunci: 'Rp50.000',
      pembahasan: 'Modal = 40 × Rp10.000 = Rp400.000. Untung = Rp450.000 − Rp400.000 = Rp50.000.'
    },
    {
      id: 2,
      soal: 'Ibu membeli 2 kodi pakaian (1 kodi = 20 buah) dengan harga total Rp1.200.000. Pakaian tersebut dijual eceran seharga Rp75.000 per buah. Berapa keuntungan total Ibu?',
      opsi: ['Rp1.200.000', 'Rp1.500.000', 'Rp1.800.000', 'Rp2.000.000'],
      kunci: 'Rp1.800.000',
      pembahasan: 'Jumlah pakaian = 40 buah. Harga Jual = 40 × Rp75.000 = Rp3.000.000. Untung = Rp3.000.000 − Rp1.200.000 = Rp1.800.000.'
    },
    {
      id: 3,
      soal: 'Seorang pedagang membeli 5 rim kertas (1 rim = 500 lembar) dengan harga Rp40.000 per rim. Jika kertas tersebut dijual eceran Rp100 per lembar, apakah pedagang untung atau rugi dan berapa besar?',
      opsi: ['Untung Rp50.000', 'Rugi Rp50.000', 'Untung Rp100.000', 'Impas'],
      kunci: 'Untung Rp50.000',
      pembahasan: 'Modal = 5 × Rp40.000 = Rp200.000. Total lembar = 2.500 lembar. Harga Jual = 2.500 × Rp100 = Rp250.000. Untung = Rp250.000 − Rp200.000 = Rp50.000.'
    },
    {
      id: 4,
      soal: 'Siti menjual tas seharga Rp140.000 dan mendapat keuntungan sebesar Rp25.000 dari tas tersebut. Berapa harga beli tas itu?',
      opsi: ['Rp115.000', 'Rp125.000', 'Rp155.000', 'Rp165.000'],
      kunci: 'Rp115.000',
      pembahasan: 'Harga Beli = Harga Jual − Untung = Rp140.000 − Rp25.000 = Rp115.000.'
    },
    {
      id: 5,
      soal: 'Sebuah sepeda dibeli dengan modal Rp600.000. Karena ada kerusakan kecil, sepeda dijual dan pedagang mengalami kerugian sebesar Rp75.000. Berapa harga jual sepeda tersebut?',
      opsi: ['Rp500.000', 'Rp525.000', 'Rp575.000', 'Rp675.000'],
      kunci: 'Rp525.000',
      pembahasan: 'Harga Jual = Harga Beli − Rugi = Rp600.000 − Rp75.000 = Rp525.000.'
    },
    {
      id: 6,
      soal: 'Pedagang buah membeli 50 kg mangga seharga Rp8.000 per kg. Sebanyak 40 kg mangga dijual seharga Rp11.000 per kg, dan sisanya busuk terpaksa dibuang. Apakah pedagang untung/rugi?',
      opsi: ['Untung Rp40.000', 'Rugi Rp40.000', 'Untung Rp80.000', 'Impas'],
      kunci: 'Untung Rp40.000',
      pembahasan: 'Modal = 50 × Rp8.000 = Rp400.000. Penjualan = 40 × Rp11.000 = Rp440.000. Untung = Rp440.000 − Rp400.000 = Rp40.000.'
    },
    {
      id: 7,
      soal: 'Budi menjual jam tangan seharga Rp220.000 dan memperoleh keuntungan dari harga belinya sebesar Rp20.000. Berapa harga beli jam tangan tersebut?',
      opsi: ['Rp190.000', 'Rp200.000', 'Rp240.000', 'Rp250.000'],
      kunci: 'Rp200.000',
      pembahasan: 'Harga Beli = Harga Jual − Untung = Rp220.000 − Rp20.000 = Rp200.000.'
    },
    {
      id: 8,
      soal: 'Sebuah televisi dibeli seharga Rp1.500.000 dan dijual kembali dengan kerugian sebesar Rp225.000. Berapa harga jual televisi tersebut?',
      opsi: ['Rp1.225.000', 'Rp1.275.000', 'Rp1.300.000', 'Rp1.350.000'],
      kunci: 'Rp1.275.000',
      pembahasan: 'Harga Jual = Harga Beli − Rugi = Rp1.500.000 − Rp225.000 = Rp1.275.000.'
    },
    {
      id: 9,
      soal: 'Jika seorang pedagang memperoleh keuntungan Rp30.000 dari penjualan barang dengan modal Rp120.000, berapa persentase keuntungan pedagang tersebut?',
      opsi: ['15%', '20%', '25%', '30%'],
      kunci: '25%',
      pembahasan: 'Persentase Untung = (30.000 ÷ 120.000) × 100% = 25%.'
    },
    {
      id: 10,
      soal: 'Toko mainan membeli boneka seharga Rp50.000 per buah. Agar mendapatkan keuntungan sebesar Rp10.000, berapa harga jual boneka tersebut?',
      opsi: ['Rp55.000', 'Rp58.000', 'Rp60.000', 'Rp65.000'],
      kunci: 'Rp60.000',
      pembahasan: 'Harga Jual = Harga Beli + Untung = Rp50.000 + Rp10.000 = Rp60.000.'
    }
  ]

  // Data Soal Posttest (5 Soal Evaluasi Akhir)
  const posttestSoal = [
    {
      id: 1,
      soal: 'Harga keseluruhan pembelian 3 lusin pensil adalah Rp108.000. Berapa harga beli untuk 1 buah pensil?',
      opsi: ['Rp2.500', 'Rp3.000', 'Rp3.500', 'Rp4.000'],
      kunci: 'Rp3.000'
    },
    {
      id: 2,
      soal: 'Pak Ahmad membeli seekor kambing dengan harga Rp1.800.000. Beberapa bulan kemudian dijual dan ia mendapat untung Rp250.000. Berapa harga jual kambing tersebut?',
      opsi: ['Rp1.550.000', 'Rp1.950.000', 'Rp2.050.000', 'Rp2.100.000'],
      kunci: 'Rp2.050.000'
    },
    {
      id: 3,
      soal: 'Sebuah jaket dibeli seharga Rp200.000. Karena lewat musim, jaket tersebut dijual rugi sebesar Rp20.000. Berapa harga jual jaket itu?',
      opsi: ['Rp170.000', 'Rp180.000', 'Rp190.000', 'Rp195.000'],
      kunci: 'Rp180.000'
    },
    {
      id: 4,
      soal: 'Ani membeli 3 kg jeruk seharga Rp15.000 per kg. Seluruh jeruk dijual dengan harga total Rp54.000. Berapa keuntungan total Ani?',
      opsi: ['Rp6.000', 'Rp9.000', 'Rp12.000', 'Rp15.000'],
      kunci: 'Rp9.000'
    },
    {
      id: 5,
      soal: 'Pedagang membeli barang dengan modal Rp400.000 dan berhasil menjualnya dengan keuntungan sebesar Rp60.000. Berapa persentase keuntungannya?',
      opsi: ['10%', '12%', '15%', '20%'],
      kunci: '15%',
      pembahasan: '(60.000 ÷ 400.000) × 100% = 15%'
    }
  ]

  const menu = [
    { id: 'Beranda', icon: '⌂' },
    { id: 'Pretest', icon: '📋' },
    { id: 'Materi', icon: '📖' },
    { id: 'Latihan Soal', icon: '📝' },
    { id: 'Asisten AI', icon: '🤖' },
    { id: 'Posttest', icon: '📊' },
    { id: 'Simulasi', icon: '🧮' },
    { id: 'Tentang', icon: 'ⓘ' },
  ]

  function bukaHalaman(id) {
    setHalaman(id)
    setModalModal('')

    const activityByPage = { Materi: 'materi', 'Latihan Soal': 'latihan' }
    if (activityByPage[id]) void catatProgres(activityByPage[id])
  }

  async function catatProgres(activity, score = null) {
    setProgressStatus({ type: 'pending', message: 'Menyimpan nama dan progres...' })
    try {
      await saveLearningProgress(namaSiswa, activity, score)
      setProgressStatus({ type: 'success', message: 'Nama dan progres berhasil tersimpan.' })
    } catch (error) {
      console.error('Gagal menyimpan progres belajar:', error)
      setProgressStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Gagal menyimpan progres ke Supabase.',
      })
    }
  }

  async function kirimPesanAI(text, hintLevel = aiHintLevel) {
    const message = text.trim()
    if (!message || aiLoading) return

    const updatedMessages = [...aiMessages, { role: 'user', content: message }]
    setAiChats((chats) => ({ ...chats, [aiProblemId]: updatedMessages }))
    setAiInput('')
    setAiError('')
    setAiLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          problemId: aiProblemId,
          stageId: aiStageId,
          hintLevel,
        }),
      })
      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(data?.error || 'Asisten AI belum dapat menjawab. Coba lagi sebentar.')
      }
      if (typeof data?.reply !== 'string' || !data.reply.trim()) {
        throw new Error('Asisten AI mengirim jawaban kosong. Coba kirim pesan lagi.')
      }

      setAiChats((chats) => ({
        ...chats,
        [aiProblemId]: [...updatedMessages, { role: 'assistant', content: data.reply }],
      }))
    } catch (error) {
      setAiChats((chats) => ({ ...chats, [aiProblemId]: aiMessages }))
      setAiInput(message)
      setAiError(error instanceof Error ? error.message : 'Tidak dapat terhubung ke server AI.')
    } finally {
      setAiLoading(false)
    }
  }

  function mintaPetunjukAI() {
    const nextHint = Math.min(aiHintLevel + 1, 3)
    setAiHintLevel(nextHint)
    kirimPesanAI('Saya masih bingung, tolong beri petunjuk.', nextHint)
  }

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        setIsPlaying(false)
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true)
        }).catch((err) => {
          console.log("Audio diblokir browser:", err)
        })
      }
    }
  }

  if (!mulai) {
    return (
      <div className="welcome-page">
        <audio ref={audioRef} src="/lagu.mp3" loop />
        <div className="welcome-decoration decoration-one">✦</div>
        <div className="welcome-decoration decoration-two">♡</div>

        <div className="welcome-card">
          <div className="welcome-logo">
            <span>Rp</span>
            <div className="mini-coins">▤</div>
          </div>

          <span className="welcome-label">
            APLIKASI PEMBELAJARAN SOBAT BELAJAR
          </span>

          <h1>Halo, Sobat Belajar! 💜</h1>
          <h2>Harga Jual dan Harga Beli</h2>

          <p className="welcome-description">
            Masukkan nama kamu untuk mulai pretest, belajar materi, hingga posttest!
          </p>
          <p className="privacy-note">
            {isProgressStorageConfigured
              ? 'Nama, nilai, dan progres belajar disimpan di Supabase. Kelas tidak dikirim.'
              : 'Penyimpanan online belum dikonfigurasi. Nama, nilai, dan progres belum dikirim ke Supabase.'}
          </p>

          <form
            className="welcome-form"
            onSubmit={(e) => {
              e.preventDefault()
              if (!namaSiswa.trim()) return
              setMulai(true)
              setTimeout(() => {
                if (audioRef.current) {
                  audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {})
                }
              }, 300)
            }}
          >
            <label htmlFor="namaSiswa">Nama Kamu (Siswa)</label>
            <input
              id="namaSiswa"
              type="text"
              placeholder="Masukkan nama kamu"
              maxLength={100}
              value={namaSiswa}
              onChange={(e) => setNamaSiswa(e.target.value)}
              required
            />

            <label htmlFor="kelasSiswa">Kelas</label>
            <select
              id="kelasSiswa"
              value={kelasSiswa}
              onChange={(e) => setKelasSiswa(e.target.value)}
              required
            >
              <option value="">Pilih kelas kamu</option>
              <option value="VII">VII (7)</option>
              <option value="VIII">VIII (8)</option>
              <option value="IX">IX (9)</option>
            </select>

            <button type="submit" className="start-button">
              Mulai Belajar <span>→</span>
            </button>
          </form>

          <div className="welcome-footer">
            ✨ Dibuat oleh <b>{namaPembuat}</b> • Sobat Belajar
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <audio ref={audioRef} src="/lagu.mp3" loop />

      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">♡</div>
          <h2>Harga Jual<br />dan Harga Beli</h2>
          <span className="brand-line">✦ ───</span>
        </div>

        <nav className="navigation">
          {menu.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${
                halaman === item.id ? 'active' : ''
              }`}
              onClick={() => bukaHalaman(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.id}</span>
            </button>
          ))}
        </nav>

        <div style={{ padding: '15px 5px', textAlign: 'center' }}>
          <button 
            onClick={toggleMusic}
            style={{
              background: isPlaying ? '#e66caf' : '#ffffff30',
              border: '0',
              color: 'white',
              padding: '10px 15px',
              borderRadius: '15px',
              fontWeight: 'bold',
              cursor: 'pointer',
              width: '100%',
              fontSize: '13px'
            }}
          >
            {isPlaying ? '🎵 Musik: Nyala (Jeda)' : '🔇 Musik: Mati (Putar)'}
          </button>
        </div>

        <div className="sidebar-bottom">
          <span>✧</span>
          <p>Pengembang:<br /><b>{namaPembuat}</b></p>
          <span>♡</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="eyebrow">
              SOBAT BELAJAR MATEMATIKA
            </span>
            <p>Dibuat oleh <b>{namaPembuat}</b> ✨</p>
          </div>

          <div className="welcome">
            ♙ <span>Halo, {namaSiswa}!</span> <b>♥</b>
          </div>
        </header>

        {progressStatus && (
          <p className={`progress-status ${progressStatus.type}`} role="status">
            {progressStatus.message}
          </p>
        )}

        {halaman === 'Asisten AI' && (
          <section className="content-page rmt-page">
            <span className="page-label">🤖 TUTOR BELAJAR • MODEL RMT</span>
            <h1>Belajar langkah demi langkah</h1>
            <p className="page-intro">
              Asisten membimbing cara berpikirmu pada satu tahap RMT, bukan memberikan jawaban akhir.
              Pilih soal dan tahap, lalu ceritakan pemahamanmu.
            </p>

            <div className="rmt-problem-picker">
              <label htmlFor="rmtProblem">Pilih soal</label>
              <select
                id="rmtProblem"
                value={aiProblemId}
                onChange={(event) => {
                  setAiProblemId(event.target.value)
                  setAiStageId(1)
                  setAiHintLevel(1)
                  setAiError('')
                }}
              >
                {PROBLEMS.map((problem, index) => (
                  <option key={problem.id} value={problem.id}>
                    Soal {index + 1} — {problem.judul}
                  </option>
                ))}
              </select>
            </div>

            <div className="rmt-problem-card">
              <span>{aiProblem.indikator}</span>
              <h2>{aiProblem.judul}</h2>
              <p>{aiProblem.teks}</p>
            </div>

            <h2 className="rmt-section-title">Tahapan RMT</h2>
            <div className="rmt-stages" aria-label="Pilih tahap RMT">
              {STAGES.map((stage) => (
                <button
                  key={stage.id}
                  type="button"
                  className={`rmt-stage ${stage.id === aiStageId ? 'active' : ''} ${stage.id < aiStageId ? 'completed' : ''}`}
                  aria-pressed={stage.id === aiStageId}
                  onClick={() => {
                    setAiStageId(stage.id)
                    setAiHintLevel(1)
                  }}
                >
                  <span>{stage.id}</span>
                  {stage.nama}
                </button>
              ))}
            </div>
            <div className="rmt-stage-goal">
              <b>Tahap {aiStage.id}: {aiStage.nama}</b>
              <p>{aiStage.tujuan}</p>
            </div>

            <div className="rmt-chat" aria-live="polite" aria-label="Percakapan dengan tutor AI">
              {aiMessages.length === 0 && (
                <div className="rmt-empty">
                  <b>Mulai dari tahap ini.</b>
                  <p>
                    {aiStage.id === 1
                      ? 'Ceritakan informasi apa yang diketahui dan apa yang ditanyakan soal.'
                      : `Ceritakan dulu pemahamanmu pada tahap ${aiStage.nama.toLowerCase()}.`}
                  </p>
                </div>
              )}
              {aiMessages.map((message, index) => (
                <div key={`${aiProblemId}-${index}`} className={`rmt-bubble ${message.role}`}>
                  <span>{message.role === 'assistant' ? 'Tutor RMT' : namaSiswa || 'Kamu'}</span>
                  <p>{message.content}</p>
                </div>
              ))}
              {aiLoading && <div className="rmt-bubble assistant"><p>Tutor sedang menyiapkan petunjuk…</p></div>}
              <div ref={aiEndRef} />
            </div>

            {aiError && <p className="rmt-error" role="alert">{aiError}</p>}

            <form
              className="rmt-composer"
              onSubmit={(event) => {
                event.preventDefault()
                kirimPesanAI(aiInput)
              }}
            >
              <label className="sr-only" htmlFor="rmtMessage">Tulis jawaban atau pertanyaanmu</label>
              <input
                id="rmtMessage"
                value={aiInput}
                onChange={(event) => setAiInput(event.target.value)}
                placeholder="Tulis jawaban atau pertanyaanmu…"
                disabled={aiLoading}
              />
              <button className="primary-button" type="submit" disabled={aiLoading || !aiInput.trim()}>
                Kirim
              </button>
            </form>
            <button className="rmt-help-button" type="button" onClick={mintaPetunjukAI} disabled={aiLoading}>
              💡 Saya masih bingung — beri petunjuk (level {aiHintLevel}/3)
            </button>
            <p className="rmt-note">
              Petunjuk meningkat bertahap. Kuota gratis AI dibagi oleh semua pengguna dalam project yang sama.
            </p>
          </section>
        )}

        {halaman === 'Beranda' && (
          <>
            <section className="hero">
              <div className="hero-copy">
                <span className="hero-star">✦</span>
                <h1>Harga Jual dan<br />Harga Beli</h1>
                <p>
                  Yuk, mulai dari <b>Pretest</b> untuk menguji kemampuan awal, pelajari <b>Materi</b>, lalu selesaikan <b>Posttest</b> untuk melihat hasil perkembangan belajarmu!
                </p>
                <button
                  className="hero-button"
                  onClick={() => bukaHalaman('Pretest')}
                >
                  Mulai Pretest Sekarang <span>→</span>
                </button>
              </div>

              <div
                className="hero-art"
                aria-label="Ilustrasi kalkulator, uang, dan keranjang"
              >
                <div className="art-sparkle">✦ ✧</div>
                <div className="calculator">
                  ▱<div>▦</div>
                </div>
                <div className="coins">
                  <span>Rp</span>
                  <span>Rp</span>
                  <span>Rp</span>
                </div>
                <div className="cart">🛒</div>
              </div>
            </section>

            <section className="menu-cards">
              <article className="menu-card pink" style={{ background: '#fce4ff', borderColor: '#f3c5f9' }}>
                <div className="card-illustration">📋</div>
                <h2>Pretest</h2>
                <p>Ukur kemampuan awalmu sebelum masuk materi mendalam!</p>
                <button onClick={() => bukaHalaman('Pretest')} style={{ background: '#c173c5' }}>Mulai <span>→</span></button>
              </article>

              <article className="menu-card purple">
                <div className="card-illustration">📖</div>
                <h2>Materi</h2>
                <p>Pelajari konsep dasar, penjelasan rinci, dan rumus lengkapnya!</p>
                <button onClick={() => bukaHalaman('Materi')}>Mulai <span>→</span></button>
              </article>

              <article className="menu-card pink">
                <div className="card-illustration">📝</div>
                <h2>Latihan Soal</h2>
                <p>Uji pemahaman dengan 10 soal interaktif & pembahasan lengkap!</p>
                <button onClick={() => bukaHalaman('Latihan Soal')}>Mulai <span>→</span></button>
              </article>

              <article className="menu-card yellow" style={{ background: '#e1f5fe', borderColor: '#b3e5fc' }}>
                <div className="card-illustration">📊</div>
                <h2>Posttest</h2>
                <p>Ujian akhir & lihat grafik perbandingan hasil belajarmu!</p>
                <button onClick={() => bukaHalaman('Posttest')} style={{ background: '#0288d1' }}>Mulai <span>→</span></button>
              </article>

              <article className="menu-card yellow">
                <div className="card-illustration">▦</div>
                <h2>Simulasi</h2>
                <p>Coba hitung untung atau rugi berdasarkan angka pilihanmu!</p>
                <button onClick={() => bukaHalaman('Simulasi')}>Mulai <span>→</span></button>
              </article>

              <article className="menu-card green">
                <div className="card-illustration">ⓘ</div>
                <h2>Tentang</h2>
                <p>Kenali pengembang aplikasi hebat ini yaitu {namaPembuat}.</p>
                <button onClick={() => bukaHalaman('Tentang')}>Lihat <span>→</span></button>
              </article>
            </section>

            <section className="learning-panel">
              <div className="learning-copy">
                <h2><span>⭐</span> Alur Belajar Disarankan:</h2>
                <p><b>1.</b> Kerjakan <b>Pretest</b> terlebih dahulu untuk menguji nilai awal</p>
                <p><b>2.</b> Pahami <b>Materi & Rumus</b> Aritmetika Sosial kelas 7</p>
                <p><b>3.</b> Selesaikan <b>Posttest</b> untuk melihat evaluasi peningkatan nilaimu</p>
              </div>
              <div className="learning-art">
                ▦<span>Rp</span><i>✦</i>
              </div>
            </section>
          </>
        )}

        {/* HALAMAN PRETEST */}
        {halaman === 'Pretest' && (
          <section className="content-page">
            <span className="page-label">📋 PRETEST (KEMAMPUAN AWAL)</span>
            <h1>Ukur Kemampuan Awalmu</h1>
            <p className="page-intro">Jawab 5 pertanyaan standar kelas 7 berikut sebelum mempelajari materi mendalam.</p>

            {!preSubmitted ? (
              <div className="question-box">
                <span className="question-number">SOAL {currentPreIndex + 1} DARI {pretestSoal.length}</span>
                <h2>{pretestSoal[currentPreIndex].soal}</h2>

                <div className="answer-options">
                  {pretestSoal[currentPreIndex].opsi.map((opsi) => (
                    <button
                      key={opsi}
                      className={`answer-option ${preAnswers[currentPreIndex] === opsi ? 'selected' : ''}`}
                      onClick={() => setPreAnswers({ ...preAnswers, [currentPreIndex]: opsi })}
                    >
                      <span>{opsi}</span>
                      <span>{preAnswers[currentPreIndex] === opsi ? '●' : '○'}</span>
                    </button>
                  ))}
                </div>

                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                  {currentPreIndex > 0 && (
                    <button className="primary-button" onClick={() => setCurrentPreIndex(currentPreIndex - 1)}>
                      ← Sebelumnya
                    </button>
                  )}
                  {currentPreIndex < pretestSoal.length - 1 ? (
                    <button className="primary-button" style={{ marginLeft: 'auto' }} onClick={() => setCurrentPreIndex(currentPreIndex + 1)}>
                      Selanjutnya →
                    </button>
                  ) : (
                    <button 
                      className="primary-button" 
                      style={{ marginLeft: 'auto', background: '#4caf50' }} 
                      onClick={() => {
                        let skor = 0;
                        pretestSoal.forEach((item, idx) => {
                          if (preAnswers[idx] === item.kunci) skor += 20;
                        });
                        setPreScore(skor);
                        setPreSubmitted(true);
                        void catatProgres('pretest', skor);
                      }}
                    >
                      Selesai & Lanjut ke Materi ✓
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="result-box" style={{ textAlign: 'center', padding: '30px' }}>
                <h2>🎉 Pretest Selesai, {namaSiswa}!</h2>
                <p style={{ fontSize: '18px', margin: '15px 0' }}>Nilai Pretest Kamu: <b>{preScore} / 100</b></p>
                <p>Bagus! Sekarang yuk pelajari materinya agar nanti nilai Posttest-mu semakin meningkat.</p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
                  <button className="primary-button" onClick={() => bukaHalaman('Materi')} style={{ background: '#9c7bd2' }}>Baca Materi Sekarang →</button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* HALAMAN MATERI */}
        {halaman === 'Materi' && (
          <section className="content-page">
            <span className="page-label">📚 MATERI PEMBELAJARAN RINCI</span>
            <h1>Konsep Lengkap Harga Jual & Harga Beli</h1>
            <p className="page-intro">
              Pelajari materi standar kelas 7 semester 2 berikut ini dengan cermat sebelum mengerjakan posttest!
            </p>

            <div className="lesson-grid">
              <article className="lesson-box purple">
                <h2>💰 1. Harga Beli (Modal)</h2>
                <p>
                  <b>Harga Beli</b> adalah uang yang dikeluarkan untuk membeli atau memborong suatu barang dari produsen/grosir.
                </p>
                <div className="formula">
                  HB = Harga Jual − Untung<br />
                  HB = Harga Jual + Rugi
                </div>
              </article>

              <article className="lesson-box pink">
                <h2>🛍️ 2. Harga Jual</h2>
                <p>
                  <b>Harga Jual</b> adalah uang yang diterima pedagang saat menjual barang dagangannya kepada pembeli.
                </p>
                <div className="formula">
                  HJ = Harga Beli + Untung<br />
                  HJ = Harga Beli − Rugi
                </div>
              </article>

              <article className="lesson-box yellow">
                <h2>📈 3. Untung & Persentase Untung</h2>
                <p>
                  Terjadi jika Harga Jual <b>lebih tinggi</b> daripada Harga Beli.
                </p>
                <div className="formula">
                  Untung = Harga Jual − Harga Beli<br />
                  % Untung = (Untung ÷ Harga Beli) × 100%
                </div>
              </article>

              <article className="lesson-box green">
                <h2>📉 4. Rugi & Persentase Rugi</h2>
                <p>
                  Terjadi jika Harga Jual <b>lebih rendah</b> daripada Harga Beli.
                </p>
                <div className="formula">
                  Rugi = Harga Beli − Harga Jual<br />
                  % Rugi = (Rugi ÷ Harga Beli) × 100%
                </div>
              </article>
            </div>

            <div className="example-box">
              <h2>💡 Contoh Soal Standar Kelas 7</h2>
              <p>
                Pak Dedi membeli 1 kodi baju (20 buah) dengan harga total Rp800.000. Jika seluruh baju dijual dengan harga Rp50.000 per buah, berapakah keuntungannya?
              </p>
              <p style={{ marginTop: '10px' }}>
                <b>Penyelesaian:</b><br />
                - Total Harga Jual = 20 × Rp50.000 = Rp1.000.000<br />
                - Modal (Harga Beli) = Rp800.000<br />
                - Untung = Rp1.000.000 − Rp800.000 = <strong style={{ color: '#27683d' }}>Rp200.000</strong>.
              </p>
            </div>

            <button
              className="primary-button"
              onClick={() => bukaHalaman('Posttest')}
            >
              Lanjut ke Posttest (Evaluasi Akhir) →
            </button>
          </section>
        )}

        {/* LATIHAN SOAL */}
        {halaman === 'Latihan Soal' && (
          <section className="content-page">
            <span className="page-label">✏️ LATIHAN INTERAKTIF (10 SOAL)</span>
            <h1>Yuk, Uji Pemahamanmu!</h1>
            <p className="page-intro">Baca soal dengan teliti, pilih jawaban yang benar, dan pelajari pembahasannya.</p>

            <div className="question-box">
              <span className="question-number">SOAL {latihanIndex + 1} DARI {latihanSoalList.length}</span>
              <h2>{latihanSoalList[latihanIndex].soal}</h2>

              <div className="answer-options">
                {latihanSoalList[latihanIndex].opsi.map((opsi) => (
                  <button
                    key={opsi}
                    className={`answer-option ${latihanAnswers[latihanIndex] === opsi ? 'selected' : ''}`}
                    onClick={() => {
                      setLatihanAnswers({ ...latihanAnswers, [latihanIndex]: opsi })
                      setLatihanChecked({ ...latihanChecked, [latihanIndex]: false })
                    }}
                  >
                    <span>{opsi}</span>
                    <span>{latihanAnswers[latihanIndex] === opsi ? '●' : '○'}</span>
                  </button>
                ))}
              </div>

              <button
                className="primary-button"
                onClick={() => setLatihanChecked({ ...latihanChecked, [latihanIndex]: true })}
                style={{ marginTop: '15px' }}
              >
                Periksa Jawaban
              </button>

              {latihanChecked[latihanIndex] && (
                <div
                  className={`feedback ${
                    latihanAnswers[latihanIndex] === latihanSoalList[latihanIndex].kunci ? 'correct' : 'incorrect'
                  }`}
                >
                  {latihanAnswers[latihanIndex] === latihanSoalList[latihanIndex].kunci
                    ? `Benar! ${latihanSoalList[latihanIndex].pembahasan} 🎉`
                    : latihanAnswers[latihanIndex] === undefined
                      ? 'Pilih jawaban terlebih dahulu, ya!'
                      : `Belum tepat. Pembahasan: ${latihanSoalList[latihanIndex].pembahasan}`}
                </div>
              )}

              <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'space-between' }}>
                {latihanIndex > 0 && (
                  <button className="primary-button" onClick={() => setLatihanIndex(latihanIndex - 1)}>
                    ← Soal Sebelumnya
                  </button>
                )}
                {latihanIndex < latihanSoalList.length - 1 && (
                  <button className="primary-button" style={{ marginLeft: 'auto' }} onClick={() => setLatihanIndex(latihanIndex + 1)}>
                    Soal Selanjutnya →
                  </button>
                )}
              </div>
            </div>
          </section>
        )}

        {/* HALAMAN POSTTEST & LAPORAN EVALUASI BELAJAR */}
        {halaman === 'Posttest' && (
          <section className="content-page">
            <span className="page-label">📊 POSTTEST & EVALUASI BELAJAR</span>
            <h1>Ujian Akhir & Grafik Perbandingan Nilai</h1>
            <p className="page-intro">Selesaikan 5 soal evaluasi akhir ini untuk melihat laporan perbandingan skor pretest dan posttest kamu!</p>

            {!postSubmitted ? (
              <div className="question-box">
                <span className="question-number">PERTANYAAN {currentPostIndex + 1} DARI {posttestSoal.length}</span>
                <h2>{posttestSoal[currentPostIndex].soal}</h2>

                <div className="answer-options">
                  {posttestSoal[currentPostIndex].opsi.map((opsi) => (
                    <button
                      key={opsi}
                      className={`answer-option ${postAnswers[currentPostIndex] === opsi ? 'selected' : ''}`}
                      onClick={() => setPostAnswers({ ...postAnswers, [currentPostIndex]: opsi })}
                    >
                      <span>{opsi}</span>
                      <span>{postAnswers[currentPostIndex] === opsi ? '●' : '○'}</span>
                    </button>
                  ))}
                </div>

                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                  {currentPostIndex > 0 && (
                    <button className="primary-button" onClick={() => setCurrentPostIndex(currentPostIndex - 1)}>
                      ← Sebelumnya
                    </button>
                  )}
                  {currentPostIndex < posttestSoal.length - 1 ? (
                    <button className="primary-button" style={{ marginLeft: 'auto' }} onClick={() => setCurrentPostIndex(currentPostIndex + 1)}>
                      Selanjutnya →
                    </button>
                  ) : (
                    <button 
                      className="primary-button" 
                      style={{ marginLeft: 'auto', background: '#0288d1' }} 
                      onClick={() => {
                        let skor = 0;
                        posttestSoal.forEach((item, idx) => {
                          if (postAnswers[idx] === item.kunci) skor += 20;
                        });
                        setPostScore(skor);
                        setPostSubmitted(true);
                        void catatProgres('posttest', skor);
                      }}
                    >
                      Kumpulkan Posttest & Lihat Hasil Evaluasi ✓
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="result-box" style={{ textAlign: 'center', padding: '30px', background: '#e1f5fe', color: '#01579b', borderRadius: '24px' }}>
                <h2>📊 Posttest Selesai & Dievaluasi!</h2>
                <p style={{ fontSize: '18px', margin: '10px 0' }}>Kerja bagus, <b>{namaSiswa}</b>! Berikut laporan hasil belajar kamu:</p>
                
                {/* Kotak Laporan Evaluasi Belajar (Pretest vs Posttest) */}
                <div style={{ background: 'white', padding: '20px', borderRadius: '16px', margin: '20px auto', maxWidth: '450px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                  <h3 style={{ margin: '0 0 15px', color: '#38216f', fontSize: '18px' }}>📈 Grafik Perbandingan Nilai Belajar</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '15px' }}>
                    <div style={{ background: '#f3e5f5', padding: '12px 20px', borderRadius: '12px', flex: 1, marginRight: '10px' }}>
                      <span style={{ fontSize: '12px', color: '#7b1fa2', fontWeight: 'bold' }}>NILAI PRETEST (AWAL)</span>
                      <div style={{ fontSize: '24px', fontWeight: '900', color: '#6a1b9a', marginTop: '5px' }}>{preSubmitted ? preScore : '0'}</div>
                    </div>
                    <div style={{ background: '#e1f5fe', padding: '12px 20px', borderRadius: '12px', flex: 1, marginLeft: '10px' }}>
                      <span style={{ fontSize: '12px', color: '#0288d1', fontWeight: 'bold' }}>NILAI POSTTEST (AKHIR)</span>
                      <div style={{ fontSize: '24px', fontWeight: '900', color: '#01579b', marginTop: '5px' }}>{postScore}</div>
                    </div>
                  </div>

                  <p style={{ margin: '10px 0 0', color: '#2e7d32', fontWeight: 'bold', fontSize: '14px', lineHeight: '1.5' }}>
                    {postScore >= (preSubmitted ? preScore : 0) 
                      ? `✨ Hebat! Terlihat ada peningkatan hasil belajar yang sangat baik setelah kamu mempelajari materi ini.`
                      : `Tetap semangat! Ayo ulas kembali materinya supaya pemahamanmu makin mantap.`}
                  </p>
                </div>

                <button className="primary-button" onClick={() => bukaHalaman('Beranda')} style={{ background: '#0288d1' }}>
                  Kembali ke Beranda
                </button>
              </div>
            )}
          </section>
        )}

        {halaman === 'Simulasi' && (
          <section className="content-page">
            <span className="page-label">🧮 SIMULASI JUAL BELI</span>
            <h1>Coba Hitung Sendiri!</h1>
            <p className="page-intro">
              Masukkan harga beli dan harga jual untuk melihat hasil perhitungan untung/rugi secara instan.
            </p>

            <div className="simulation-box">
              <div className="input-group">
                <label htmlFor="hargaBeli">Harga beli (Rp)</label>
                <input
                  id="hargaBeli"
                  type="number"
                  min="0"
                  placeholder="Contoh: 50000"
                />
              </div>

              <div className="input-group">
                <label htmlFor="hargaJual">Harga jual (Rp)</label>
                <input
                  id="hargaJual"
                  type="number"
                  min="0"
                  placeholder="Contoh: 65000"
                />
              </div>

              <button
                className="primary-button"
                onClick={() => {
                  const beli = Number(
                    document.getElementById('hargaBeli').value
                  )
                  const jual = Number(
                    document.getElementById('hargaJual').value
                  )

                  if (beli <= 0 || jual <= 0) {
                    setModalModal(
                      'Masukkan harga beli dan harga jual yang lebih dari nol.'
                    )
                  } else if (jual > beli) {
                    setModalModal(
                      `Kamu mendapat UNTUNG sebesar ${rupiah(jual - beli)}.`
                    )
                  } else if (jual < beli) {
                    setModalModal(
                      `Kamu mengalami RUGI sebesar ${rupiah(beli - jual)}.`
                    )
                  } else {
                    setModalModal('Kamu tidak untung dan tidak rugi (Impas).')
                  }
                }}
              >
                Hitung Hasil
              </button>

              {modalModal && (
                <div className="result-box">{modalModal}</div>
              )}
            </div>
          </section>
        )}

        {halaman === 'Tentang' && (
          <section className="content-page">
            <span className="page-label">💜 TENTANG PENGEMBANG</span>
            <h1>Aplikasi Pembelajaran Sobat Belajar</h1>
            <p className="page-intro">
              Aplikasi edukasi interaktif untuk materi aritmetika sosial (harga jual dan harga beli).
            </p>

            <div className="about-grid">
              <article className="lesson-box purple">
                <h2>👩‍💻 Dibuat Oleh (Pengembang)</h2>
                <p>
                  <b>{namaPembuat}</b>.<br />
                  Dikembangkan secara khusus sebagai media pembelajaran matematika yang interaktif dan menyenangkan.
                </p>
              </article>

              <article className="lesson-box pink">
                <h2>🎯 Fitur Aplikasi</h2>
                <p>
                  Pretest awal, materi rinci, 10 latihan soal ber-pembahasan, posttest evaluasi, laporan perbandingan belajar, simulasi, dan alunan musik latar.
                </p>
              </article>
            </div>

            <button
              className="primary-button"
              onClick={() => bukaHalaman('Beranda')}
            >
              ← Kembali ke Beranda
            </button>
          </section>
        )}

        <footer className="footer">
          Dibuat dengan ❤️ oleh <span>{namaPembuat}</span> • Sobat Belajar Matematika
        </footer>
      </main>
    </div>
  )
}

function rupiah(angka) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(angka)
}

export default App