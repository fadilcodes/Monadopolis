# Project Overview
**Nama Proyek:** Monad AI City Builder  
**Deskripsi:** Web app game berbasis NextJS yang menggabungkan kuis trivia AI, elemen simulasi pembangunan kota, dan integrasi blockchain Monad. Pemain menjawab kuis untuk mengumpulkan poin token dan membangun gedung hingga mencapai batas 100 token. Game mencakup sistem ujian dadakan berupa voting on-chain untuk menyelesaikan masalah kota yang di-generate oleh AI.

---

# Tech Stack
- **Frontend:** NextJS App Router, ReactJS, Tailwind CSS.
- **Backend & Database:** Supabase untuk manajemen state sementara dan sinkronisasi real-time.
- **Blockchain:** Monad Testnet, Solidity untuk smart contract, Wagmi atau Ethers.js untuk interaksi Web3.
- **AI Service:** OpenAI API untuk membuat soal kuis dinamis dan skenario bencana kota.

---

# Core Game Flow
- **Autentikasi:** Pemain masuk menggunakan Web3 wallet yang terhubung ke jaringan Monad.
- **Kuis Personal:** AI menghasilkan pertanyaan pilihan ganda. Jawaban benar menambah 5 token sementara, jawaban salah mengurangi 2 token sementara.
- **Visual Progres:** Setiap perubahan poin akan mengupdate tinggi visual gedung pemain secara real-time di layar.
- **Ujian Dadakan:** AI menghasilkan skenario masalah kota lengkap dengan tiga pilihan solusi.
- **Sistem Voting:** Pemain harus melakukan sign transaksi di jaringan Monad untuk memilih solusi bencana.
- **Resolusi Bencana:** Hasil voting mayoritas dihitung oleh smart contract. Jika solusi mayoritas tepat, seluruh pemain mendapat tambahan 10 token. Jika salah, seluruh pemain kehilangan 10 token.
- **Kemenangan:** Saat pemain mencapai 100 token, status kemenangan dicatat dan gedung permanen dicetak sebagai NFT di jaringan Monad.

---

# Data Architecture (Off-chain vs On-chain)
- **Supabase Off-chain:** Menyimpan profil pemain, skor token sementara, riwayat kuis, dan data real-time multiplayer untuk tampilan kota.
- **Monad On-chain:** Menangani smart contract untuk sesi voting massal, perhitungan hasil akhir bencana, dan pencetakan NFT gedung.

---

# AI Implementation Logic
- **Generator Soal:** AI menerima prompt untuk membuat soal trivia umum acak dalam format JSON yang berisi pertanyaan, tiga pilihan salah, dan satu pilihan benar.
- **Generator Bencana:** AI menganalisis statistik pemain di kota tersebut melalui Supabase untuk menghasilkan cerita krisis kota yang relevan beserta pilihan voting.

---

# Vibecoding Rules untuk AI Agent
1. Utamakan performa tinggi dan gunakan server components NextJS sedapat mungkin.
2. Selalu gunakan Tailwind CSS untuk penataan gaya komponen.
3. Pisahkan logika blockchain ke dalam direktori khusus agar tidak bercampur dengan komponen UI.
4. Pastikan interaksi dengan Supabase menggunakan koneksi real-time untuk memperbarui tampilan kota tanpa perlu refresh halaman.
