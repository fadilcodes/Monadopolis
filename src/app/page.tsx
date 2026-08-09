"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@/components/ConnectButton";
import { useBuildingNFT } from "@/lib/blockchain/useBuildingNFT";
import { supabase } from "@/lib/supabase/client";
import { FactionSelectModal, FACTIONS } from "@/components/FactionSelectModal";
import { UserProfileModal } from "@/components/UserProfileModal";
import { GlobalLeaderboard } from "@/components/GlobalLeaderboard";

const AI_DISABLED_MESSAGE =
  "This is for Hackathon purpose only, no use of API key for any reason";

export interface PlayerState {
  wallet_address: string;
  username?: string | null;
  tokens: number;
  building_height: number;
  faction_id?: string;
  nft_minted?: boolean;
}

export default function Home() {
  const { address } = useAccount();
  const [mounted, setMounted] = useState<boolean>(false);
  const [tokens, setTokens] = useState<number>(25);
  const [showAiNotice, setShowAiNotice] = useState<boolean>(false);

  // User Profile & Faction System State
  const [userName, setUserName] = useState<string | null>(null);
  const [userFaction, setUserFaction] = useState<string | null>(null);
  const [showFactionModal, setShowFactionModal] = useState<boolean>(false);
  const [showUsernameModal, setShowUsernameModal] = useState<boolean>(false);

  // Multiplayer City State from Supabase
  const [allPlayers, setAllPlayers] = useState<PlayerState[]>([]);

  // Web3 Monad Contract Hooks
  const { mintBuilding, isPending: isMintPending, isSuccess: isMintSuccess, hash: mintHash } = useBuildingNFT();

  // Prevent SSR hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if connected player already has a Faction and Username in Supabase
  useEffect(() => {
    async function checkUserProfile() {
      if (!address) {
        setShowFactionModal(false);
        setShowUsernameModal(false);
        setUserName(null);
        return;
      }
      try {
        const { data } = await supabase
          .from("players")
          .select("username, faction_id, tokens")
          .eq("wallet_address", address.toLowerCase())
          .maybeSingle();

        if (data) {
          if (data.username) {
            setUserName(data.username);
            setShowUsernameModal(false);
          } else {
            setShowUsernameModal(true);
          }

          if (data.faction_id) {
            setUserFaction(data.faction_id);
            setShowFactionModal(false);
          } else if (data.username) {
            setShowFactionModal(true);
          }

          if (typeof data.tokens === "number") setTokens(data.tokens);
        } else {
          // Completely new user -> prompt username first
          setShowUsernameModal(true);
        }
      } catch (err) {
        console.warn("Gagal mengecek profil pemain:", err);
      }
    }
    if (mounted) {
      checkUserProfile();
    }
  }, [address, mounted]);

  // Fetch all player records for Multiplayer City View
  const fetchAllPlayers = useCallback(async () => {
    try {
      const { data } = await supabase
        .from("players")
        .select("wallet_address, username, tokens, building_height, faction_id, nft_minted")
        .order("tokens", { ascending: false })
        .limit(8);

      if (data) {
        setAllPlayers(data as PlayerState[]);
      }
    } catch (err) {
      console.warn("Gagal memuat data multiplayer dari Supabase:", err);
    }
  }, []);

  // Subscribe to Supabase Realtime changes on 'players' table
  useEffect(() => {
    fetchAllPlayers();

    const channel = supabase
      .channel("multiplayer-city-skyline")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "players" },
        () => {
          fetchAllPlayers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAllPlayers]);

  const handleMintNFT = () => {
    if (!address) {
      alert("Silakan hubungkan Web3 Wallet Anda terlebih dahulu untuk mencetak NFT!");
      return;
    }
    mintBuilding(address);
  };

  const formatWallet = (addr: string) => {
    if (!addr || addr.length < 10) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const activeUserWallet = mounted && address ? address.toLowerCase() : "0x0000...demo";
  const displayPlayers = [...allPlayers];
  if (!displayPlayers.some((p) => p.wallet_address === activeUserWallet)) {
    displayPlayers.unshift({
      wallet_address: activeUserWallet,
      username: userName,
      tokens: tokens,
      building_height: tokens,
      faction_id: userFaction || undefined,
    });
  }

  const activeFactionObj = FACTIONS.find((f) => f.id === userFaction);

  return (
    <div className="min-h-screen bg-pixel-lightbrown text-pixel-darkbrown p-4 md:p-6 flex flex-col gap-6 selection:bg-pixel-brown selection:text-pixel-white">
      {showAiNotice && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-pixel-black/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="ai-disabled-title"
          onClick={() => setShowAiNotice(false)}
        >
          <div
            className="pixel-box-gold w-full max-w-md border-4 border-pixel-black p-5 text-center shadow-[8px_8px_0px_#1A0F0D]"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="ai-disabled-title" className="text-sm font-bold text-pixel-black">
              AI FEATURE DISABLED
            </h2>
            <p className="mt-4 text-xs font-bold leading-relaxed text-pixel-black">
              {AI_DISABLED_MESSAGE}
            </p>
            <button
              type="button"
              autoFocus
              onClick={() => setShowAiNotice(false)}
              className="pixel-btn mt-5 bg-pixel-black px-6 py-2 text-xs font-bold text-pixel-gold"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* User Onboarding Modals */}
      {mounted && address && (
        <>
          <UserProfileModal
            isOpen={showUsernameModal}
            walletAddress={address}
            onSaveUsername={(name) => {
              setUserName(name);
              setShowUsernameModal(false);
              if (!userFaction) {
                setShowFactionModal(true);
              }
            }}
          />

          <FactionSelectModal
            isOpen={showFactionModal && !showUsernameModal}
            walletAddress={address}
            onSelectFaction={(factionId) => {
              setUserFaction(factionId);
              setShowFactionModal(false);
            }}
          />
        </>
      )}

      {/* Header Component */}
      <header className="pixel-box-dark p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 border-4 border-pixel-black">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-pixel-gold border-4 border-pixel-black flex items-center justify-center font-bold text-lg text-pixel-black">
            M
          </div>
          <div>
            <h1 className="text-xl md:text-3xl font-bold tracking-wider text-pixel-gold drop-shadow-[2px_2px_0px_#1A0F0D]">
              MONADOPOLIS
            </h1>
            <p className="text-xs text-pixel-cream mt-1">
              Monad AI City Builder • Multiplayer Edition
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {userName && (
            <div suppressHydrationWarning className="pixel-box px-3 py-2 text-xs border-2 border-pixel-gold bg-pixel-cream text-pixel-black font-bold flex items-center gap-1">
              <span className="text-pixel-brown">PEMAIN:</span>
              <span className="text-pixel-black font-bold">{userName}</span>
            </div>
          )}

          {activeFactionObj && (
            <div className="pixel-box px-3 py-2 text-xs border-2 border-pixel-gold bg-pixel-black text-pixel-gold flex items-center gap-1.5 font-bold">
              <span>{activeFactionObj.badge}</span>
              <span>{activeFactionObj.name}</span>
            </div>
          )}

          <div className="pixel-box bg-pixel-cream px-3 py-2 text-xs border-2 border-pixel-darkbrown">
            <span className="text-pixel-brown">Network:</span>{" "}
            <span className="font-bold text-pixel-green">Monad Testnet</span>
          </div>

          <div className="pixel-box-gold px-4 py-2 text-xs font-bold border-2 border-pixel-black flex items-center gap-2">
            <span>POIN TOKEN:</span>
            <span className="text-sm text-pixel-black bg-pixel-white px-2 py-0.5 border border-pixel-black">
              {tokens}/100
            </span>
          </div>

          <ConnectButton />
        </div>
      </header>

      {/* Main 2-Column Layout */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        {/* Center Area: Multiplayer City Skyline View & Global Leaderboard (7 Cols) */}
        <section className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
          <div className="pixel-box bg-pixel-white p-4 md:p-6 flex-1 flex flex-col justify-between border-4 border-pixel-darkbrown min-h-[440px]">
            {/* Top Bar inside City View */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b-4 border-pixel-darkbrown pb-4 mb-4">
              <div>
                <h2 className="text-sm md:text-base font-bold text-pixel-darkbrown flex items-center gap-2">
                  <span>VISUAL KOTA MULTIPLAYER</span>
                  <span className="w-2.5 h-2.5 bg-pixel-green border border-pixel-black inline-block animate-ping"></span>
                </h2>
                <p className="text-xs text-pixel-brown mt-1">
                  Tinggi gedung bertambah & berkurang secara otomatis dan real-time dari Supabase
                </p>
              </div>

              {/* Progress Height Bar */}
              <div className="w-full sm:w-48 bg-pixel-cream border-2 border-pixel-darkbrown p-1">
                <div className="text-[10px] text-right mb-1 font-bold">
                  PROGRES SAYA: {tokens}%
                </div>
                <div className="w-full bg-pixel-white h-4 border border-pixel-darkbrown overflow-hidden">
                  <div
                    className="bg-pixel-gold h-full transition-all duration-300 border-r-2 border-pixel-black"
                    style={{ width: `${tokens}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Multiplayer Horizontal Side-by-Side Buildings View */}
            <div className="relative flex-1 bg-pixel-cream border-4 border-pixel-darkbrown p-4 flex flex-col justify-end overflow-x-auto min-h-[300px] bg-[radial-gradient(#8B4513_1px,transparent_1px)] [background-size:16px_16px]">
              {/* Sky Badges */}
              <div className="absolute top-4 left-4 bg-pixel-white border-2 border-pixel-darkbrown p-2 text-[10px] font-bold z-20">
                IKLIM: STABIL
              </div>

              <div className="absolute top-4 right-4 z-20 border-2 border-pixel-black bg-pixel-gold p-2 text-[10px] font-bold text-pixel-black">
                PEMAIN AKTIF: {displayPlayers.length}
              </div>

              {/* Horizontal Rendering of All Players' Pixel Art Buildings */}
              <div className="flex items-end justify-center gap-4 md:gap-8 z-10 w-full min-w-max pb-2 pt-16">
                {displayPlayers.map((player, pIdx) => {
                  const isCurrentUser = player.wallet_address === activeUserWallet;
                  const playerTokens = isCurrentUser ? tokens : player.tokens;
                  const playerFloors = Math.max(1, Math.floor(playerTokens / 10));
                  const factionObj = FACTIONS.find((f) => f.id === player.faction_id);
                  const displayName = player.username || formatWallet(player.wallet_address);

                  return (
                    <div key={pIdx} className="flex flex-col items-center group">
                      {/* Top Label & Score */}
                      <div suppressHydrationWarning className="text-[9px] font-bold mb-1 bg-pixel-black text-pixel-gold px-1.5 py-0.5 border border-pixel-gold whitespace-nowrap flex items-center gap-1">
                        {factionObj && <span>{factionObj.badge}</span>}
                        <span>{isCurrentUser ? "GEDUNG SAYA" : displayName}</span>
                        <span>({playerTokens} PKT)</span>
                      </div>

                      {/* Roof Spire */}
                      <div className="w-3 h-5 bg-pixel-black border-x-2 border-t-2 border-pixel-darkbrown flex justify-center items-start">
                        <div
                          className={`w-1.5 h-1.5 ${
                            isCurrentUser ? "bg-pixel-gold animate-ping" : "bg-pixel-white"
                          }`}
                        ></div>
                      </div>
                      <div
                        className={`w-12 h-2 text-[7px] font-bold text-center border-2 border-pixel-black ${
                          isCurrentUser ? "bg-pixel-gold text-pixel-black" : "bg-pixel-brown text-pixel-white"
                        }`}
                      >
                        ROOF
                      </div>

                      {/* Stacked Floor Blocks */}
                      <div className="flex flex-col items-center gap-0.5 my-0.5 w-full">
                        {Array.from({ length: playerFloors }).map((_, fIdx) => {
                          const isTopFloor = fIdx === 0;
                          const floorNum = playerFloors - fIdx;

                          return (
                            <div
                              key={fIdx}
                              className={`w-28 md:w-36 h-6 border-2 border-pixel-black flex items-center justify-between px-2 transition-all duration-300 ${
                                isCurrentUser
                                  ? isTopFloor
                                    ? "bg-pixel-gold text-pixel-black"
                                    : "bg-pixel-darkbrown text-pixel-white"
                                  : isTopFloor
                                  ? "bg-pixel-cream text-pixel-black"
                                  : "bg-pixel-brown text-pixel-white"
                              }`}
                            >
                              <span className="text-[7px] font-bold">L{floorNum}</span>
                              <div className="flex gap-1">
                                <div className="w-2 h-2 bg-pixel-white border border-pixel-black"></div>
                                <div className="w-2 h-2 bg-pixel-white border border-pixel-black"></div>
                              </div>
                              <span className="text-[7px] font-bold">{floorNum * 10}P</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Lobby Base with Username or Abbreviated Wallet Address */}
                      <div
                        className={`w-32 md:w-40 h-9 border-4 border-pixel-black flex flex-col items-center justify-center p-0.5 relative ${
                          isCurrentUser ? "bg-pixel-gold text-pixel-black" : "bg-pixel-cream text-pixel-darkbrown"
                        }`}
                      >
                        <span suppressHydrationWarning className="text-[8px] font-bold tracking-tight truncate max-w-[120px]">
                          {displayName}
                        </span>
                        <div className="w-5 h-3 bg-pixel-black border-t border-x border-pixel-gold flex items-center justify-center mt-0.5">
                          <div className="w-0.5 h-0.5 bg-pixel-gold"></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Ground Earth Line */}
              <div className="w-full h-5 bg-pixel-darkbrown border-t-4 border-pixel-black mt-1"></div>
            </div>

            {/* Winning Pixel Notification Banner (100 Tokens Reached) */}
            {tokens >= 100 && (
              <div className="mt-4 pixel-box-gold p-4 border-4 border-pixel-black flex flex-col sm:flex-row items-center justify-between gap-3 animate-bounce">
                <div>
                  <h3 className="text-sm font-bold text-pixel-black">🎉 GEDUNG SELESAI! (100/100 TOKEN)</h3>
                  <p className="text-xs text-pixel-black mt-0.5">
                    Selamat {userName || "Pemain"}! Menara Monadopolis milik Anda telah sempurna dan siap dicetak sebagai NFT di Monad Testnet.
                  </p>
                </div>
                <button
                  onClick={handleMintNFT}
                  disabled={isMintPending}
                  className="pixel-btn px-4 py-2 bg-pixel-black text-pixel-gold hover:bg-pixel-darkbrown text-xs font-bold border-2 border-pixel-black whitespace-nowrap"
                >
                  {isMintPending ? "MINTING NFT..." : "MINT NFT ON-CHAIN"}
                </button>
              </div>
            )}

            {/* Status Footer */}
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs bg-pixel-cream p-3 border-2 border-pixel-darkbrown">
              <span>
                STATUS GAME:{" "}
                <strong className="text-pixel-brown">
                  {tokens >= 100
                    ? "GEDUNG SELESAI! MENANG (100 TOKEN)"
                    : "DEMO HACKATHON - FITUR AI DINONAKTIFKAN"}
                </strong>
              </span>
            </div>

            {isMintSuccess && mintHash && (
              <div className="mt-2 bg-pixel-green text-pixel-white p-2 text-xs font-bold text-center border-2 border-pixel-black">
                BERHASIL! NFT Gedung Kota Anda telah dicetak di Monad Testnet! Tx Hash: {mintHash.slice(0, 10)}...
              </div>
            )}
          </div>

          {/* Global Realtime Leaderboard Component */}
          <GlobalLeaderboard />
        </section>

        {/* Right Sidebar: AI Trivia Quiz Section (5 Cols) */}
        <aside className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4">
          <div className="pixel-box bg-pixel-white p-4 md:p-6 flex flex-col gap-4 border-4 border-pixel-darkbrown">
            <div className="border-b-4 border-pixel-darkbrown pb-3 flex justify-between items-start">
              <div>
                <span className="text-[10px] bg-pixel-brown text-pixel-white px-2 py-1 font-bold uppercase">
                  GEMINI AI QUIZ
                </span>
                <h2 className="text-sm md:text-base font-bold mt-2 text-pixel-darkbrown">
                  KUIS PERSONAL AI
                </h2>
                <p className="text-[11px] text-pixel-brown mt-1">
                  Benar: +5 Poin | Salah: -2 Poin
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAiNotice(true)}
                title="AI feature disabled"
                className="pixel-btn px-2 py-1 text-[10px] bg-pixel-gold text-pixel-black border-2 border-pixel-black"
              >
                ↻ REFRESH
              </button>
            </div>

            <div className="pixel-box bg-pixel-cream p-6 border-2 border-pixel-darkbrown text-center flex flex-col items-center justify-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center border-4 border-pixel-black bg-pixel-gold text-xl font-bold text-pixel-black">
                AI
              </div>
              <p className="text-xs font-bold leading-relaxed text-pixel-darkbrown">
                AI quiz is unavailable in this hackathon demo.
              </p>
              <button
                type="button"
                onClick={() => setShowAiNotice(true)}
                className="pixel-btn w-full border-2 border-pixel-black bg-pixel-brown p-3 text-xs font-bold text-pixel-white"
              >
                OPEN AI QUIZ
              </button>
            </div>

            {/* Disaster / On-Chain Vote Trigger Teaser */}
            <div className="pixel-box-dark p-4 border-2 border-pixel-black mt-2 flex flex-col gap-2">
              <div className="flex justify-between items-center text-[10px]">
                <span className="text-pixel-gold font-bold">UJIAN DADAKAN AI</span>
                <span className="bg-pixel-red px-1.5 py-0.5 text-pixel-white font-bold">
                  ON-CHAIN
                </span>
              </div>
              <p className="text-[11px] leading-snug">
                Bencana kota acak akan dipicu oleh AI. Klik tombol di bawah untuk menguji simulasi bencana:
              </p>
              <button
                type="button"
                onClick={() => setShowAiNotice(true)}
                className="pixel-btn px-2 py-1.5 text-[10px] bg-pixel-gold text-pixel-black font-bold border border-pixel-black"
              >
                ⚡ TRAP BENCANA KOTA AI
              </button>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}
