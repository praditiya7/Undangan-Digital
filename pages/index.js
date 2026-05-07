import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Send, 
  Sparkles, 
  Heart, 
  CheckCircle2,
  ChevronDown,
  Gift,
  BookOpen,
  MessageCircle,
  X
} from 'lucide-react';

// --- Konfigurasi Gemini API ---
const apiKey = "";

export default function App() {
  const [targetDate] = useState(new Date('2024-12-31T09:00:00'));
  const [timeLeft, setTimeLeft] = useState({ hari: 0, jam: 0, menit: 0, detik: 0 });
  const [rsvpData, setRsvpData] = useState({ name: '', attendance: 'yes', message: '' });
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [wishes, setWishes] = useState([
    { name: "Budi & Sarah", message: "Selamat menempuh hidup baru untuk kedua mempelai! Semoga cinta kalian abadi selamanya.", date: "2 jam yang lalu" }
  ]);

  // State untuk Fitur AI Baru
  const [aiGiftSuggestion, setAiGiftSuggestion] = useState("");
  const [isAiGiftLoading, setIsAiGiftLoading] = useState(false);
  const [showAiStory, setShowAiStory] = useState(false);
  const [aiStoryContent, setAiStoryContent] = useState("");
  const [isAiStoryLoading, setIsAiStoryLoading] = useState(false);

  // Countdown Logic
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          hari: Math.floor(difference / (1000 * 60 * 60 * 24)),
          jam: Math.floor((difference / (1000 * 60 * 60)) % 24),
          menit: Math.floor((difference / 1000 / 60) % 60),
          detik: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  // --- GEMINI API INTEGRATIONS ---

  // 1. AI Wish Formatter (Existing)
  const formatWishWithAI = async () => {
    if (!rsvpData.message || rsvpData.message.length < 5) return;
    setIsAiProcessing(true);
    try {
      const userQuery = `Ubah ucapan selamat pernikahan berikut menjadi lebih hangat, puitis, dan elegan dalam Bahasa Indonesia: "${rsvpData.message}"`;
      const systemPrompt = "Anda adalah penulis puisi profesional. Rapikan ucapan tamu agar menyentuh hati tapi tetap tulus.";
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userQuery }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] }
        })
      });
      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) setRsvpData(prev => ({ ...prev, message: text.trim() }));
    } catch (error) {
      console.error(error);
    } finally {
      setIsAiProcessing(false);
    }
  };

  // 2. AI Gift Planner ✨
  const generateGiftSuggestion = async () => {
    setIsAiGiftLoading(true);
    try {
      const userQuery = "Berikan 3 ide kado pernikahan yang unik, minimalis, dan berkesan untuk pasangan yang menyukai desain estetik dan kegiatan outdoor. Jawab dalam 3 poin singkat.";
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userQuery }] }]
        })
      });
      const result = await response.json();
      setAiGiftSuggestion(result.candidates?.[0]?.content?.parts?.[0]?.text);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAiGiftLoading(false);
    }
  };

  // 3. AI Love Story Narrator ✨
  const tellLoveStory = async (style) => {
    setIsAiStoryLoading(true);
    setShowAiStory(true);
    try {
      const userQuery = `Ceritakan kisah cinta singkat antara Aditya (seorang arsitek) dan Kirana (seorang desainer bunga) yang bertemu di sebuah proyek taman kota. Gunakan gaya bahasa: ${style}.`;
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userQuery }] }]
        })
      });
      const result = await response.json();
      setAiStoryContent(result.candidates?.[0]?.content?.parts?.[0]?.text);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAiStoryLoading(false);
    }
  };

  const handleRsvpSubmit = (e) => {
    e.preventDefault();
    if (!rsvpData.name || !rsvpData.message) return;
    setWishes([{ ...rsvpData, date: "Baru saja" }, ...wishes]);
    setRsvpData({ name: '', attendance: 'yes', message: '' });
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-[#4A4A4A] font-sans selection:bg-[#E5D5C5]">
      
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          className="text-center z-10"
        >
          <span className="uppercase tracking-[0.3em] text-sm mb-6 block text-[#8E8071]">The Wedding Of</span>
          <h1 className="text-6xl md:text-8xl font-serif mb-4 text-[#5D534A]">Aditya & Kirana</h1>
          <p className="text-lg md:text-xl font-light italic text-[#8E8071]">Merayakan pertemuan antara garis dan kelopak</p>
          
          <button 
            onClick={() => tellLoveStory('Puitis')}
            className="mt-8 flex items-center gap-2 mx-auto px-6 py-2 border border-[#E5D5C5] rounded-full text-xs tracking-widest uppercase hover:bg-[#F8F5F1] transition-all"
          >
            <BookOpen className="w-3 h-3" /> ✨ Baca Kisah Kami
          </button>
        </motion.div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] border border-[#E5D5C5] rounded-full opacity-30 animate-pulse" />
        
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-10">
          <ChevronDown className="text-[#8E8071] w-8 h-8" />
        </motion.div>
      </section>

      {/* Love Story Modal */}
      <AnimatePresence>
        {showAiStory && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-white max-w-lg w-full p-8 rounded-[2rem] relative shadow-2xl"
            >
              <button onClick={() => setShowAiStory(false)} className="absolute top-6 right-6 text-[#8E8071]"><X /></button>
              <h3 className="text-2xl font-serif mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" /> Kisah Cinta Kami
              </h3>
              <div className="prose prose-sm text-[#8E8071] leading-relaxed italic">
                {isAiStoryLoading ? (
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-100 animate-pulse rounded w-full"></div>
                    <div className="h-4 bg-gray-100 animate-pulse rounded w-5/6"></div>
                    <div className="h-4 bg-gray-100 animate-pulse rounded w-4/6"></div>
                  </div>
                ) : (
                  <p>{aiStoryContent}</p>
                )}
              </div>
              <div className="mt-6 flex gap-2">
                <button onClick={() => tellLoveStory('Modern & Lucu')} className="text-[10px] uppercase tracking-tighter px-3 py-1 bg-gray-100 rounded-full">✨ Versi Santai</button>
                <button onClick={() => tellLoveStory('Formal & Elegan')} className="text-[10px] uppercase tracking-tighter px-3 py-1 bg-gray-100 rounded-full">✨ Versi Formal</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Countdown Section */}
      <section className="py-20 bg-white shadow-sm flex flex-col items-center">
        <h2 className="text-2xl font-serif mb-10 text-[#5D534A]">Menuju Hari Bahagia</h2>
        <div className="flex gap-4 md:gap-10">
          {Object.entries(timeLeft).map(([label, value]) => (
            <div key={label} className="flex flex-col items-center">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-[#F8F5F1] rounded-2xl flex items-center justify-center text-2xl md:text-4xl font-serif text-[#5D534A] border border-[#E5D5C5]">
                {value}
              </div>
              <span className="mt-2 uppercase tracking-widest text-[10px] md:text-xs text-[#8E8071]">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Event Details */}
      <section className="py-24 px-6 max-w-4xl mx-auto grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h3 className="text-3xl font-serif border-b border-[#E5D5C5] pb-4">Akad Nikah</h3>
          <div className="flex items-start gap-4">
            <Calendar className="w-6 h-6 text-[#8E8071] mt-1" />
            <div><p className="font-semibold text-lg">Sabtu, 31 Desember 2024</p><p className="text-[#8E8071]">09:00 - 10:30 WIB</p></div>
          </div>
          <div className="flex items-start gap-4">
            <MapPin className="w-6 h-6 text-[#8E8071] mt-1" />
            <div><p className="font-semibold text-lg">Masjid Agung Al-Azhar</p><p className="text-[#8E8071]">Jakarta Selatan</p></div>
          </div>
        </div>
        <div className="space-y-6">
          <h3 className="text-3xl font-serif border-b border-[#E5D5C5] pb-4">Resepsi</h3>
          <div className="flex items-start gap-4">
            <Clock className="w-6 h-6 text-[#8E8071] mt-1" />
            <div><p className="font-semibold text-lg">Sabtu, 31 Desember 2024</p><p className="text-[#8E8071]">11:30 - 14:00 WIB</p></div>
          </div>
          <div className="flex items-start gap-4">
            <MapPin className="w-6 h-6 text-[#8E8071] mt-1" />
            <div><p className="font-semibold text-lg">Grand Ballroom Mulia</p><p className="text-[#8E8071]">Jakarta Pusat</p></div>
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section className="py-24 bg-[#F8F5F1]">
        <div className="max-w-2xl mx-auto px-6">
          <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl shadow-black/5">
            <div className="text-center mb-10">
              <Heart className="w-10 h-10 text-[#E5D5C5] mx-auto mb-4" />
              <h2 className="text-3xl font-serif mb-2">Konfirmasi Kehadiran</h2>
            </div>

            <form onSubmit={handleRsvpSubmit} className="space-y-6">
              <input 
                type="text" value={rsvpData.name} onChange={(e) => setRsvpData({...rsvpData, name: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-[#E5D5C5] focus:outline-none bg-gray-50/50" placeholder="Nama Lengkap" required
              />
              <div className="relative">
                <textarea 
                  value={rsvpData.message} onChange={(e) => setRsvpData({...rsvpData, message: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-[#E5D5C5] focus:outline-none bg-gray-50/50 h-32 resize-none" placeholder="Ucapan Anda..." required
                />
                <button
                  type="button" onClick={formatWishWithAI} disabled={isAiProcessing || !rsvpData.message}
                  className="absolute bottom-3 right-3 flex items-center gap-2 bg-gradient-to-r from-[#8E8071] to-[#5D534A] text-white px-4 py-2 rounded-lg text-xs font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {isAiProcessing ? <span className="animate-pulse">Menyusun...</span> : <>✨ Percantik Ucapan</>}
                </button>
              </div>
              <button type="submit" className="w-full py-4 bg-[#5D534A] text-white rounded-xl font-serif text-lg hover:bg-[#4A433B] transition-all flex items-center justify-center gap-2">
                Kirim Konfirmasi <Send className="w-4 h-4" />
              </button>
            </form>

            {/* AI Gift Planner ✨ */}
            <div className="mt-12 pt-8 border-t border-[#E5D5C5] text-center">
              <p className="text-xs uppercase tracking-widest text-[#8E8071] mb-4">Bingung ingin memberikan kado apa?</p>
              <button 
                onClick={generateGiftSuggestion}
                className="flex items-center gap-2 mx-auto text-[#5D534A] font-semibold hover:text-[#8E8071] transition-all"
              >
                <Gift className="w-4 h-4" /> ✨ Cari Ide Kado (AI)
              </button>
              {isAiGiftLoading && <p className="text-xs mt-2 animate-pulse">Memikirkan kado terbaik...</p>}
              {aiGiftSuggestion && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 bg-[#F8F5F1] rounded-xl text-sm text-[#8E8071] leading-relaxed whitespace-pre-line text-left">
                  {aiGiftSuggestion}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Guest Book */}
      <section className="py-24 px-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-serif text-center mb-12">Ucapan Tamu</h2>
        <div className="space-y-6">
          <AnimatePresence initial={false}>
            {wishes.map((wish, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl border border-[#E5D5C5]/50 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-[#5D534A]">{wish.name}</h4>
                  <span className="text-[10px] text-[#8E8071] uppercase tracking-widest">{wish.date}</span>
                </div>
                <p className="text-[#8E8071] font-light italic">"{wish.message}"</p>
                <div className="mt-4 flex items-center gap-1 text-[#E5D5C5]">
                  <CheckCircle2 className="w-4 h-4 fill-current" />
                  <span className="text-[10px] uppercase">Verified Guest</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      <footer className="py-12 bg-white text-center border-t border-[#E5D5C5]">
        <h2 className="font-serif text-2xl mb-2 text-[#5D534A]">Aditya & Kirana</h2>
        <p className="text-[#8E8071] text-sm tracking-widest uppercase">31 . 12 . 2024</p>
      </footer>
    </div>
  );
}
