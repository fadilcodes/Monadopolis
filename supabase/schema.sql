-- ========================================================
-- MONADOPOLIS SUPABASE DATABASE SCHEMA & REALTIME SETUP
-- Copy & Paste script ini ke Supabase Dashboard -> SQL Editor
-- ========================================================

-- 1. Tabel Faksi
CREATE TABLE IF NOT EXISTS public.factions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  total_score INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inisialisasi awal 3 faksi utama
INSERT INTO public.factions (id, name, total_score)
VALUES 
  ('neon-vanguard', 'Neon Vanguard', 0),
  ('cyber-syndicate', 'Cyber Syndicate', 0),
  ('terra-alliance', 'Terra Alliance', 0)
ON CONFLICT (id) DO NOTHING;

-- 2. Tabel Profil Pemain & Skor Poin Token
CREATE TABLE IF NOT EXISTS public.players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT UNIQUE NOT NULL,
  username TEXT,
  faction_id TEXT REFERENCES public.factions(id),
  tokens INT DEFAULT 25 CHECK (tokens >= 0 AND tokens <= 100),
  building_height INT DEFAULT 25,
  nft_minted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tambahkan kolom username & faction_id jika tabel public.players sudah ada
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS faction_id TEXT REFERENCES public.factions(id);

-- 3. Tabel Real-Time City Skyline & Disaster Event
CREATE TABLE IF NOT EXISTS public.city_state (
  id INT PRIMARY KEY DEFAULT 1,
  total_buildings INT DEFAULT 1,
  active_disaster BOOLEAN DEFAULT FALSE,
  disaster_title TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.city_state (id, total_buildings, active_disaster, disaster_title)
VALUES (1, 1, FALSE, '')
ON CONFLICT (id) DO NOTHING;

-- 4. Tabel Riwayat Kuis Pemain
CREATE TABLE IF NOT EXISTS public.quiz_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wallet_address TEXT NOT NULL,
  question TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  points_awarded INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Trigger Otomatis Kalkulasi Total Skor Faksi (Diberikan klausa WHERE id IS NOT NULL)
CREATE OR REPLACE FUNCTION update_faction_total_score()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.factions
  SET total_score = (
    SELECT COALESCE(SUM(tokens), 0)
    FROM public.players
    WHERE faction_id = public.factions.id
  )
  WHERE id IS NOT NULL;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_faction_score ON public.players;
CREATE TRIGGER trigger_update_faction_score
AFTER INSERT OR UPDATE OF tokens, faction_id ON public.players
FOR EACH STATEMENT
EXECUTE FUNCTION update_faction_total_score();

-- Enable Realtime secara aman (mengabaikan jika tabel sudah terdaftar di publication)
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.players;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.factions;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.city_state;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
END $$;

-- Policy Keamanan Akses Publik (Row Level Security / RLS)
ALTER TABLE public.factions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.city_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Akses Publik Pemain" ON public.players;
CREATE POLICY "Akses Publik Pemain" ON public.players FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Akses Publik Faksi" ON public.factions;
CREATE POLICY "Akses Publik Faksi" ON public.factions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Akses Publik Kota" ON public.city_state;
CREATE POLICY "Akses Publik Kota" ON public.city_state FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Akses Simpan Riwayat Kuis" ON public.quiz_history;
CREATE POLICY "Akses Simpan Riwayat Kuis" ON public.quiz_history FOR ALL USING (true) WITH CHECK (true);
