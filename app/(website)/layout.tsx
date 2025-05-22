import Header from "@/components/Header/Header";
import Footer from "@/components/Footer";
import ScrollUp from "@/components/ScrollUp";

export default function WebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="row-padding-max-w-2xl py-8">{children}</div>
      <main className="flex-grow bg-background -z-30" />
      <Footer />
      <ScrollUp />
    </>
  );
}
