"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase/client";

interface UserProfileModalProps {
  isOpen: boolean;
  walletAddress: string;
  onSaveUsername: (username: string) => void;
}

export function UserProfileModal({
  isOpen,
  walletAddress,
  onSaveUsername,
}: UserProfileModalProps) {
  const [inputName, setInputName] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputName.trim();

    if (!trimmed) {
      setErrorMsg("Username tidak boleh kosong!");
      return;
    }
    if (trimmed.length < 3) {
      setErrorMsg("Username minimal 3 karakter!");
      return;
    }
    if (trimmed.length > 15) {
      setErrorMsg("Username maksimal 15 karakter!");
      return;
    }

    setSubmitting(true);
    setErrorMsg(null);

    const userWallet = walletAddress.toLowerCase();

    try {
      // Check if player row already exists
      const { data: existing } = await supabase
        .from("players")
        .select("wallet_address")
        .eq("wallet_address", userWallet)
        .maybeSingle();

      if (existing) {
        // Explicit UPDATE with WHERE clause
        const { error } = await supabase
          .from("players")
          .update({
            username: trimmed,
            updated_at: new Date().toISOString(),
          })
          .eq("wallet_address", userWallet);

        if (error) console.error("Error updating username:", error.message);
      } else {
        // INSERT new record
        const { error } = await supabase
          .from("players")
          .insert({
            wallet_address: userWallet,
            username: trimmed,
            tokens: 25,
            building_height: 25,
            updated_at: new Date().toISOString(),
          });

        if (error) console.error("Error inserting username:", error.message);
      }

      onSaveUsername(trimmed);
    } catch (err) {
      console.warn("Gagal menyimpan username:", err);
      setErrorMsg("Gagal menyimpan username ke database.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-pixel-black/80 flex items-center justify-center p-4">
      <div className="pixel-box-dark max-w-md w-full p-6 border-4 border-pixel-gold flex flex-col gap-5 animate-pulse-once">
        {/* Header */}
        <div className="text-center border-b-4 border-pixel-gold pb-3">
          <span className="text-[10px] bg-pixel-gold text-pixel-black font-bold px-2 py-1 uppercase">
            ONBOARDING PROFIL PEMAIN
          </span>
          <h2 className="text-lg font-bold text-pixel-gold mt-2">
            BUAT USERNAME ANDA!
          </h2>
          <p className="text-xs text-pixel-cream mt-1">
            Wallet ({walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}) berhasil terhubung. Masukkan nama/nickname identitas kota Anda.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-pixel-gold uppercase">
              NICKNAME / USERNAME:
            </label>
            <input
              type="text"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              placeholder="Contoh: SatoshiMonad"
              maxLength={15}
              className="pixel-box bg-pixel-cream text-pixel-darkbrown p-3 text-xs font-bold border-2 border-pixel-black outline-none focus:border-pixel-gold placeholder:text-pixel-brown/60"
            />
            <span className="text-[9px] text-pixel-cream text-right">
              {inputName.length}/15 Karakter
            </span>
          </div>

          {errorMsg && (
            <div className="bg-pixel-red text-pixel-white p-2 text-xs font-bold border border-pixel-black text-center">
              {errorMsg}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || !inputName.trim()}
            className={`pixel-btn py-3 text-xs font-bold border-2 border-pixel-black ${
              inputName.trim()
                ? "bg-pixel-gold text-pixel-black hover:bg-pixel-white"
                : "bg-pixel-brown text-pixel-white opacity-50 cursor-not-allowed"
            }`}
          >
            {submitting ? "MENYIMPAN USERNAME..." : "SIMPAN PROFIL ➔"}
          </button>
        </form>
      </div>
    </div>
  );
}
