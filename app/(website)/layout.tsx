import Footer from "@/components/Footer";
import Header from "@/components/Header/Header";
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
      <main className="-z-30 flex-grow bg-background" />
      <Footer />
      <ScrollUp />
    </>
  );
}
