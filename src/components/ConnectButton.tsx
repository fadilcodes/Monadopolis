"use client";

import React, { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

export function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);

  // Prevent SSR hydration mismatch for wagmi hooks
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="pixel-btn px-4 py-2 text-xs font-bold bg-pixel-brown text-pixel-white border-2 border-pixel-black opacity-70 cursor-not-allowed">
        CONNECT WALLET
      </button>
    );
  }

  if (isConnected && address) {
    const shortenedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

    return (
      <button
        onClick={() => disconnect()}
        title="Klik untuk disconnect"
        className="pixel-btn px-4 py-2 text-xs font-bold bg-pixel-gold hover:bg-pixel-cream text-pixel-black border-2 border-pixel-black flex items-center gap-2"
      >
        <span className="w-2 h-2 bg-pixel-green inline-block border border-pixel-black"></span>
        <span>{shortenedAddress}</span>
      </button>
    );
  }

  const primaryConnector = connectors[0];

  return (
    <button
      onClick={() => {
        if (primaryConnector) {
          connect({ connector: primaryConnector });
        }
      }}
      disabled={isPending}
      className="pixel-btn px-4 py-2 text-xs font-bold bg-pixel-brown hover:bg-pixel-darkbrown text-pixel-white border-2 border-pixel-black"
    >
      {isPending ? "CONNECTING..." : "CONNECT WALLET"}
    </button>
  );
}
