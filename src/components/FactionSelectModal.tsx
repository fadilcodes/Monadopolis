"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase/client";

interface FactionSelectModalProps {
  isOpen: boolean;
  walletAddress: string;
  onSelectFaction: (factionId: string) => void;
}

export const FACTIONS = [
  {
    id: "neon-vanguard",
    name: "Neon Vanguard",
    badge: "⚡",
    color: "bg-pixel-gold text-pixel-black",
    specialty: "Kecepatan & Energi Listrik",
    description: "Pelopor teknologi energi tinggi yang membangun menara listrik futuristik.",
  },
  {
    id: "cyber-syndicate",
    name: "Cyber Syndicate",
    badge: "🌐",
    color: "bg-pixel-black text-pixel-gold",
    specialty: "Teknologi & Sistem AI",
    description: "Para peretas dan arsitek AI yang mengoptimalkan struktur kota berbasis data.",
  },
  {
    id: "terra-alliance",
    name: "Terra Alliance",
    badge: "🌿",
    color: "bg-pixel-green text-pixel-white",
    specialty: "Arsitektur Hijau & Pertahanan",
    description: "Pelindung ekosistem yang membangun struktur kota ramah lingkungan dan kokoh.",
  },
];

export function FactionSelectModal({
  isOpen,
  walletAddress,
  onSelectFaction,
}: FactionSelectModalProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!selected || !walletAddress) return;
    setSubmitting(true);

    const userWallet = walletAddress.toLowerCase();

    try {
      // Check if player row already exists in Supabase
      const { data: existing } = await supabase
        .from("players")
        .select("wallet_address")
        .eq("wallet_address", userWallet)
        .maybeSingle();

      if (existing) {
        // Explicit UPDATE with WHERE clause .eq('wallet_address', userWallet)
        const { error } = await supabase
          .from("players")
          .update({
            faction_id: selected,
            updated_at: new Date().toISOString(),
          })
          .eq("wallet_address", userWallet);

        if (error) console.error("Error updating faction:", error.message);
      } else {
        // INSERT new record
        const { error } = await supabase
          .from("players")
          .insert({
            wallet_address: userWallet,
            faction_id: selected,
            tokens: 25,
            building_height: 25,
            updated_at: new Date().toISOString(),
          });

        if (error) console.error("Error inserting faction:", error.message);
      }

      onSelectFaction(selected);
    } catch (err) {
      console.warn("Gagal menyimpan faksi:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-pixel-black/80 flex items-center justify-center p-4">
      <div className="pixel-box-dark max-w-2xl w-full p-6 border-4 border-pixel-gold flex flex-col gap-6 animate-pulse-once">
        {/* Header */}
        <div className="text-center border-b-4 border-pixel-gold pb-4">
          <span className="text-[10px] bg-pixel-gold text-pixel-black font-bold px-2 py-1 uppercase">
            REKRUTMEN FAKSI MONADOPOLIS
          </span>
          <h2 className="text-lg md:text-2xl font-bold text-pixel-gold mt-2">
            PILIH FAKSI KOTA ANDA!
          </h2>
          <p className="text-xs text-pixel-cream mt-1">
            Wallet Anda ({walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}) belum terdaftar di faksi mana pun. Pilih faksi sebelum memulai kuis!
          </p>
        </div>

        {/* 3 Faction Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FACTIONS.map((faction) => {
            const isSelected = selected === faction.id;

            return (
              <div
                key={faction.id}
                onClick={() => setSelected(faction.id)}
                className={`pixel-box p-4 flex flex-col justify-between gap-3 cursor-pointer transition-all border-4 ${
                  isSelected
                    ? "border-pixel-gold scale-105 shadow-[6px_6px_0px_#FFD700]"
                    : "border-pixel-darkbrown hover:border-pixel-brown"
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl">{faction.badge}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 border border-pixel-black ${faction.color}`}
                    >
                      FAKSI
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-pixel-darkbrown">
                    {faction.name}
                  </h3>
                  <p className="text-[10px] font-bold text-pixel-brown mt-1">
                    Spesialisasi: {faction.specialty}
                  </p>
                  <p className="text-[10px] text-pixel-black leading-tight mt-2">
                    {faction.description}
                  </p>
                </div>

                <div
                  className={`text-[10px] font-bold text-center py-1 border-2 border-pixel-black ${
                    isSelected
                      ? "bg-pixel-gold text-pixel-black"
                      : "bg-pixel-cream text-pixel-darkbrown"
                  }`}
                >
                  {isSelected ? "✓ TERPILIH" : "KLIK UNTUK PILIH"}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleConfirm}
            disabled={!selected || submitting}
            className={`pixel-btn px-6 py-3 text-xs font-bold border-2 border-pixel-black ${
              selected
                ? "bg-pixel-gold text-pixel-black hover:bg-pixel-white animate-bounce"
                : "bg-pixel-brown text-pixel-white opacity-50 cursor-not-allowed"
            }`}
          >
            {submitting ? "MENYIMPAN FAKSI..." : "KONFIRMASI PILIHAN FAKSI ➔"}
          </button>
        </div>
      </div>
    </div>
  );
}
