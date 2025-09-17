import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/component/footer";
import { NotificationProvider } from "@/context/NotificationContext";
import ConditionalHeader from "@/component/ConditionalHeader";

export const metadata: Metadata = {
  title: "Social E-commerce - Your Social Shopping Destination",
  description: "A social e-commerce platform for buyers and sellers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <NotificationProvider>
          <ConditionalHeader />
          
          <main className="min-h-screen py-8">
            {children}
          </main>
          
          <Footer />
        </NotificationProvider>
      </body>
    </html>
  );
}
