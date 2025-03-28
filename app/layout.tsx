import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer";
import { SelfProvider } from "@/lib/providers/SelfProvider";
import ScrollUpButton from "@/components/scrollUpButton";
import { AudioProvider } from "@/lib/providers/AudioProvider";
import { RestrictionProvider } from "@/lib/providers/RestrictionProvider";

const font = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "osu!Sunrise",
  twitter: {
    card: "summary",
  },
  description: "osu!Sunrise is a private server for osu!, a rhythm game.",
  openGraph: {
    siteName: "osu!Sunrise",
    title: "osu!Sunrise",
    description: "osu!Sunrise is a private server for osu!, a rhythm game.",

    images: [
      {
        url: `https://${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/images/metadata.png`,
        width: 800,
        height: 800,
        alt: "osu!Sunrise Logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={font.className}>
      <SelfProvider>
        <body className="bg-terracotta-900 text-white min-h-screen flex flex-col  font-medium">
          <RestrictionProvider>
            <AudioProvider>
              <Header />
              <div className="row-padding-max-w-2xl">{children}</div>
              <main className="flex-grow bg-terracotta-900 -z-30" />
              <Footer />
            </AudioProvider>
          </RestrictionProvider>
        </body>
        <ScrollUpButton />
      </SelfProvider>
    </html>
  );
}
