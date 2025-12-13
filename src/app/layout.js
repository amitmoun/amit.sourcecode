import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: '--font-mono' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-serif' });

export const metadata = {
  title: "Amit.SourceCode",
  description: "Building World-Class Engineering Teams. Data-Driven Recruitment Strategies.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrains.variable} ${playfair.variable}`}>{children}</body>
    </html>
  );
}
