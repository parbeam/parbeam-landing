import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Parbeam | Crypto tips your viewers can see on stream",
  description:
    "Viewers send USDC or XLM from their own wallet and their name and message light up your stream a few seconds later. Built on Stellar, launching with Twitch and Kick.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
