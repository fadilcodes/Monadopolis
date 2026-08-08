import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import { Web3Provider } from "@/components/Web3Provider";
import "./globals.css";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

export const metadata: Metadata = {
  title: "MONADOPOLIS - Monad AI City Builder",
  description:
    "Web app game berbasis NextJS yang menggabungkan kuis trivia AI, simulasi pembangunan kota, dan integrasi blockchain Monad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${pressStart2P.variable} h-full`}>
      <body
        className={`${pressStart2P.className} bg-pixel-lightbrown text-pixel-darkbrown min-h-full font-pixel antialiased selection:bg-pixel-brown selection:text-pixel-white`}
      >
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
