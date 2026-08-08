import { GoogleGenerativeAI } from "@google/generative-ai";

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

// Fallback trivia pool if API key is not set or network fails
const FALLBACK_QUESTIONS: QuizQuestion[] = [
  {
    question: "Manakah mekanisme konsensus yang digunakan oleh Monad Blockchain?",
    options: [
      "MonadBFT (Parallel Execution)",
      "Proof of Work (PoW)",
      "Delegated Proof of Capacity",
      "Single Thread Execution",
    ],
    correctIndex: 0,
    explanation: "Monad menggunakan MonadBFT dan eksekusi paralel untuk mencapai 10.000 TPS.",
  },
  {
    question: "Berapa waktu blok (block time) rata-rata pada jaringan Monad?",
    options: ["12 Detik", "400 Milidetik", "1 Menit", "5 Detik"],
    correctIndex: 1,
    explanation: "Monad memiliki block time sangat cepat yaitu 400 milidetik.",
  },
  {
    question: "Siapa penemu konsep komputer pertama di dunia?",
    options: ["Charles Babbage", "Alan Turing", "Nikola Tesla", "Albert Einstein"],
    correctIndex: 0,
    explanation: "Charles Babbage dirancang sebagai bapak komputer pertama di dunia.",
  },
  {
    question: "Apakah nama planet terbesar di Tata Surya kita?",
    options: ["Mars", "Saturnus", "Jupiter", "Neptunus"],
    correctIndex: 2,
    explanation: "Jupiter adalah planet terbesar di Tata Surya.",
  },
];

export async function generateAIQuiz(): Promise<QuizQuestion> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.warn("GEMINI_API_KEY tidak ditemukan. Menggunakan fallback trivia question.");
    const randomIndex = Math.floor(Math.random() * FALLBACK_QUESTIONS.length);
    return FALLBACK_QUESTIONS[randomIndex];
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-2.5-flash or gemini-1.5-flash model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = `Anda adalah AI Quiz Master untuk game Monad AI City Builder.
Buat SATU pertanyaan kuis trivia acak tentang Sains, Sejarah, Teknologi, atau Blockchain/Monad dalam bahasa Indonesia.
Kembalikan hasilnya HANYA dalam bentuk objek JSON valid dengan struktur berikut:
{
  "question": "Teks pertanyaan di sini?",
  "options": ["Opsi 1", "Opsi 2", "Opsi 3", "Opsi 4"],
  "correctIndex": 0,
  "explanation": "Penjelasan singkat jawaban benar"
}

Aturan:
1. "options" harus berisi tepat 4 pilihan jawaban yang menarik.
2. "correctIndex" adalah angka indeks 0, 1, 2, atau 3 yang menunjukkan jawaban yang benar dalam array "options".
3. Pastikan acak letak jawaban benarnya.`;

    const result = await model.generateContent(prompt);
    const textResponse = result.response.text();
    const parsed: QuizQuestion = JSON.parse(textResponse);

    if (
      parsed &&
      typeof parsed.question === "string" &&
      Array.isArray(parsed.options) &&
      parsed.options.length === 4 &&
      typeof parsed.correctIndex === "number"
    ) {
      return parsed;
    }

    throw new Error("Struktur JSON dari Gemini AI tidak valid");
  } catch (error) {
    console.error("Gagal generate kuis dari Gemini API:", error);
    const randomIndex = Math.floor(Math.random() * FALLBACK_QUESTIONS.length);
    return FALLBACK_QUESTIONS[randomIndex];
  }
}
