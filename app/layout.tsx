import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer";
import { SelfProvider } from "@/lib/providers/SelfProvider";

const font = Poppins({ weight: "600", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "osu!Sunrise",
  description: "osu!Sunrise is a private server for osu!, a rhythm game.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={font.className}>
      <SelfProvider>
        <body className="bg-terracotta-900 text-white min-h-screen flex flex-col">
          <Header />
          <div className="row-padding-max-w-2xl ">{children}</div>
          <main className="flex-grow bg-terracotta-900 -z-30" />
          <Footer />
        </body>
      </SelfProvider>
    </html>
  );
}
