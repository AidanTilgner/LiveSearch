import "./globals.scss";
import { Inter } from "next/font/google";
import Navbar from "@/library/components/navigation/Navbar";

const inter = Inter({ subsets: ["latin"], weight: "variable" });

export const metadata = {
  title: "LiveSearch",
  description:
    " An app that listens to you talk or have a conversation, then provides you with context about every topic that is being discussed.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <div className="py-24 px-6 min-h-screen">{children}</div>
      </body>
    </html>
  );
}
