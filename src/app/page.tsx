import { Hero } from "@/components/Hero";
import { EventoDetalhes } from "@/components/EventoDetalhes";
import { Pauta } from "@/components/Pauta";
import { FormularioInscricao } from "@/components/FormularioInscricao";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <EventoDetalhes />
      <Pauta />

      <section
        id="inscricao"
        className="relative bg-copa-section py-20 md:py-28 grain"
      >
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-12 md:mb-16 text-center">
            <div className="flex items-center gap-3 mb-6 justify-center">
              <div className="h-px w-12 bg-copa-gold" />
              <span className="text-copa-gold text-xs md:text-sm font-bold tracking-[0.28em] uppercase">
                Inscrição online
              </span>
              <div className="h-px w-12 bg-copa-gold" />
            </div>
            <h2 className="font-display text-4xl md:text-6xl uppercase leading-[0.9] tracking-tight">
              <span className="text-outline-gold-sm">Confirme sua</span>
              <br />
              <span className="text-copa-red-light">presença.</span>
            </h2>
            <p className="mt-6 text-copa-ink-soft leading-relaxed">
              Preencha os dados abaixo. Cada escola pode inscrever um
              representante técnico.
            </p>
          </div>

          <FormularioInscricao />
        </div>
      </section>

      <Footer />
    </main>
  );
}
