"use client";

import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";

interface PlayerRank {
  wallet_address: string;
  username?: string | null;
  tokens: number;
  faction_id?: string;
}

interface FactionRank {
  id: string;
  name: string;
  total_score: number;
}

const FACTION_MAP: Record<string, { name: string; badge: string; color: string }> = {
  "neon-vanguard": { name: "Neon Vanguard", badge: "⚡", color: "bg-pixel-gold text-pixel-black" },
  "cyber-syndicate": { name: "Cyber Syndicate", badge: "🌐", color: "bg-pixel-black text-pixel-gold" },
  "terra-alliance": { name: "Terra Alliance", badge: "🌿", color: "bg-pixel-green text-pixel-white" },
};

export function GlobalLeaderboard() {
  const [activeTab, setActiveTab] = useState<"players" | "factions">("players");
  const [playersRank, setPlayersRank] = useState<PlayerRank[]>([]);
  const [factionsRank, setFactionsRank] = useState<FactionRank[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Pure live data fetching from Supabase database
  const fetchLeaderboardData = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      // 1. Fetch Top 10 Real Players from Supabase
      const { data: playersData, error: playersErr } = await supabase
        .from("players")
        .select("wallet_address, username, tokens, faction_id")
        .order("tokens", { ascending: false })
        .limit(10);

      if (playersErr) {
        console.error("Error fetching players from Supabase:", playersErr);
        setErrorMessage(playersErr.message);
        setPlayersRank([]);
      } else {
        setPlayersRank((playersData as PlayerRank[]) || []);
      }

      // 2. Fetch Real Factions Total Score from Supabase
      const { data: factionsData, error: factionsErr } = await supabase
        .from("factions")
        .select("id, name, total_score")
        .order("total_score", { ascending: false });

      if (factionsErr) {
        console.error("Error fetching factions from Supabase:", factionsErr);
        setFactionsRank([]);
      } else {
        setFactionsRank((factionsData as FactionRank[]) || []);
      }
    } catch (err: unknown) {
      console.error("Gagal memuat leaderboard:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Real-time subscription to Supabase players & factions changes
  useEffect(() => {
    fetchLeaderboardData();

    const channel = supabase
      .channel("realtime-leaderboard-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "players" },
        () => {
          fetchLeaderboardData();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "factions" },
        () => {
          fetchLeaderboardData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchLeaderboardData]);

  const formatWallet = (addr: string) => {
    if (!addr || addr.length < 10) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="pixel-box bg-pixel-white p-4 md:p-6 border-4 border-pixel-darkbrown flex flex-col gap-4">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b-4 border-pixel-darkbrown pb-4">
        <div>
          <span className="text-[10px] bg-pixel-brown text-pixel-white px-2 py-1 font-bold uppercase">
            SUPABASE REALTIME
          </span>
          <h2 className="text-sm md:text-base font-bold text-pixel-darkbrown mt-1">
            🏆 LEADERBOARD GLOBAL
          </h2>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={fetchLeaderboardData}
            disabled={loading}
            className="pixel-btn px-2 py-1 text-[10px] bg-pixel-gold text-pixel-black font-bold border-2 border-pixel-black"
          >
            {loading ? "MEMUAT..." : "↻ REFRESH"}
          </button>

          {/* 2 Tabs Buttons */}
          <div className="flex border-2 border-pixel-black p-0.5 bg-pixel-cream">
            <button
              onClick={() => setActiveTab("players")}
              className={`px-3 py-1.5 text-[10px] font-bold border border-pixel-black transition-all ${
                activeTab === "players"
                  ? "bg-pixel-gold text-pixel-black"
                  : "bg-pixel-white text-pixel-darkbrown hover:bg-pixel-cream"
              }`}
            >
              👤 TOP PEMAIN
            </button>
            <button
              onClick={() => setActiveTab("factions")}
              className={`px-3 py-1.5 text-[10px] font-bold border border-pixel-black transition-all ${
                activeTab === "factions"
                  ? "bg-pixel-gold text-pixel-black"
                  : "bg-pixel-white text-pixel-darkbrown hover:bg-pixel-cream"
              }`}
            >
              🛡 TOP FAKSI
            </button>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-pixel-red text-pixel-white p-2 text-xs font-bold border border-pixel-black text-center">
          ⚠ Supabase Notice: {errorMessage}. Silakan eksekusi schema.sql di Dashboard Supabase.
        </div>
      )}

      {/* Tab 1: Top Players */}
      {activeTab === "players" && (
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-12 text-[10px] font-bold bg-pixel-darkbrown text-pixel-white p-2 border-2 border-pixel-black">
            <span className="col-span-2 text-center">RANK</span>
            <span className="col-span-4">PEMAIN / WALLET</span>
            <span className="col-span-4">FAKSI</span>
            <span className="col-span-2 text-right">POIN</span>
          </div>

          {loading ? (
            <div className="p-6 text-center text-xs font-bold text-pixel-brown animate-pulse">
              MEMUAT DATA PEMAIN ASLI DARI SUPABASE...
            </div>
          ) : playersRank.length === 0 ? (
            <div className="pixel-box bg-pixel-cream p-6 border-2 border-pixel-darkbrown text-center flex flex-col items-center gap-2">
              <span className="text-xl">🏆</span>
              <p className="text-xs font-bold text-pixel-darkbrown">
                BELUM ADA DATA PEMAIN TERDAFTAR.
              </p>
              <p className="text-[10px] text-pixel-brown">
                Hubungkan Web3 Wallet, pilih Faksi, dan jawab Kuis untuk menjadi Pemain #1!
              </p>
            </div>
          ) : (
            playersRank.map((player, idx) => {
              const factionInfo = player.faction_id ? FACTION_MAP[player.faction_id] : null;
              const displayName = player.username ? player.username : formatWallet(player.wallet_address);

              return (
                <div
                  key={idx}
                  className={`grid grid-cols-12 items-center text-xs p-2 border-2 border-pixel-darkbrown font-bold ${
                    idx === 0
                      ? "bg-pixel-gold text-pixel-black"
                      : idx === 1
                      ? "bg-pixel-cream text-pixel-black"
                      : idx === 2
                      ? "bg-pixel-lightbrown text-pixel-darkbrown"
                      : "bg-pixel-white text-pixel-black"
                  }`}
                >
                  <span className="col-span-2 text-center font-bold">
                    {idx === 0 ? "🥇 #1" : idx === 1 ? "🥈 #2" : idx === 2 ? "🥉 #3" : `#${idx + 1}`}
                  </span>
                  <span className="col-span-4 text-[11px] truncate font-bold" title={player.wallet_address}>
                    {displayName}
                  </span>
                  <span className="col-span-4 text-[10px] flex items-center gap-1">
                    {factionInfo ? (
                      <>
                        <span>{factionInfo.badge}</span>
                        <span className="hidden sm:inline">{factionInfo.name}</span>
                      </>
                    ) : (
                      <span className="text-pixel-brown italic">Belum Ada</span>
                    )}
                  </span>
                  <span className="col-span-2 text-right text-pixel-black font-bold">
                    {player.tokens} PKT
                  </span>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Top Factions */}
      {activeTab === "factions" && (
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-12 text-[10px] font-bold bg-pixel-darkbrown text-pixel-white p-2 border-2 border-pixel-black">
            <span className="col-span-2 text-center">RANK</span>
            <span className="col-span-7">NAMA FAKSI</span>
            <span className="col-span-3 text-right">TOTAL SKOR</span>
          </div>

          {loading ? (
            <div className="p-6 text-center text-xs font-bold text-pixel-brown animate-pulse">
              MEMUAT DATA FAKSI ASLI DARI SUPABASE...
            </div>
          ) : factionsRank.length === 0 ? (
            <div className="pixel-box bg-pixel-cream p-6 border-2 border-pixel-darkbrown text-center flex flex-col items-center gap-2">
              <span className="text-xl">🛡</span>
              <p className="text-xs font-bold text-pixel-darkbrown">
                BELUM ADA DATA FAKSI TERDAFTAR.
              </p>
            </div>
          ) : (
            factionsRank.map((faction, idx) => {
              const factionInfo = FACTION_MAP[faction.id] || { badge: "🛡", name: faction.name };

              return (
                <div
                  key={idx}
                  className={`grid grid-cols-12 items-center text-xs p-3 border-2 border-pixel-darkbrown font-bold ${
                    idx === 0
                      ? "bg-pixel-gold text-pixel-black"
                      : idx === 1
                      ? "bg-pixel-cream text-pixel-black"
                      : "bg-pixel-white text-pixel-black"
                  }`}
                >
                  <span className="col-span-2 text-center text-sm">
                    {idx === 0 ? "🥇 #1" : idx === 1 ? "🥈 #2" : "🥉 #3"}
                  </span>
                  <span className="col-span-7 flex items-center gap-2 text-xs">
                    <span className="text-lg">{factionInfo.badge}</span>
                    <span>{faction.name}</span>
                  </span>
                  <span className="col-span-3 text-right font-bold text-pixel-black">
                    {faction.total_score} PKT
                  </span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
