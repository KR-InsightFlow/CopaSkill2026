import type { Metadata } from "next";
import { Anton, DM_Sans } from "next/font/google";
import "./globals.css";

const display = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const body = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Congresso Técnico — Copa Skill.Ed 2026",
  description:
    "Inscrições abertas para o Congresso Técnico da 8ª edição da Copa Skill.Ed. 18 de maio de 2026, no Campus USCS Itapetininga.",
  openGraph: {
    title: "Congresso Técnico — Copa Skill.Ed 2026",
    description:
      "Encontro oficial de abertura da temporada 2026. Regulamento, calendário e fair play das modalidades futsal, voleibol e basquetebol.",
    type: "website",
    locale: "pt_BR",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable}`}>
      <body className="font-body bg-copa-dark text-copa-ink antialiased">
        {children}
      </body>
    </html>
  );
}
