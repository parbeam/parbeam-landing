import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Parbeam — Donate from your wallet. Seen on stream in seconds.",
  description:
    "Send a donation from your crypto wallet and watch your name and message pop up on the stream in seconds. Streamers get the money instantly, in their own wallet.",
  icons: {
    icon:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%23191713'/%3E%3Cpath d='M7 25 L25 7 M13 25 L25 13' stroke='%23f59e0b' stroke-width='3.5' stroke-linecap='round'/%3E%3C/svg%3E",
  },
};

export const viewport: Viewport = {
  themeColor: "#f5f3ee",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
