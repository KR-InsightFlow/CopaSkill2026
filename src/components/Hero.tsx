import Image from "next/image";

export function Hero() {
  return (
    <section className="relative overflow-hidden grain border-b border-copa-line">
      {/* Background gradiente diagonal */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-55"
        style={{
          background:
            "radial-gradient(ellipse at 18% 0%, #2A66D6 0%, transparent 50%), radial-gradient(ellipse at 95% 100%, #E63946 0%, transparent 50%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(15,15,18,0.4) 70%, #0F0F12 100%)",
        }}
      />

      {/* Linhas decorativas */}
      <div
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-copa-gold to-transparent opacity-60"
      />

      <div className="relative max-w-6xl mx-auto px-6 pt-10 pb-24 md:pt-14 md:pb-32">
        {/* Top bar - logo + edição */}
        <div className="flex items-center justify-between mb-16 md:mb-24 animate-fade-in">
          <Image
            src="/imgs/logo-copa-skilled.png"
            alt="Copa Skill.Ed"
            width={160}
            height={84}
            priority
            className="h-12 md:h-14 w-auto"
          />
          <div className="flex items-center gap-3 text-xs md:text-sm font-semibold tracking-widest text-copa-muted-soft">
            <span className="hidden sm:inline">8ª EDIÇÃO</span>
            <span className="hidden sm:inline text-copa-gold">/</span>
            <span>2026</span>
          </div>
        </div>

        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-6 animate-fade-up [animation-delay:0.1s] opacity-0">
          <div className="h-px w-12 bg-copa-gold" />
          <span className="text-copa-gold text-xs md:text-sm font-bold tracking-[0.28em] uppercase">
            Inscrições Abertas
          </span>
        </div>

        {/* Título principal */}
        <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.85] tracking-tight uppercase animate-fade-up [animation-delay:0.2s] opacity-0">
          <span className="text-outline-gold">Congresso</span>
          <br />
          <span className="text-shine">Técnico</span>
          <br />
          <span className="text-copa-muted text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
            2026
          </span>
        </h1>

        {/* Sub */}
        <p className="mt-8 max-w-xl text-base md:text-lg text-copa-ink-soft leading-relaxed animate-fade-up [animation-delay:0.4s] opacity-0">
          Encontro oficial de abertura da 8ª edição da Copa Skill.Ed.
          Regulamento, calendário, critérios técnicos e disponibilidade de
          atletas das três modalidades.
        </p>

        {/* CTA + dados rápidos */}
        <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-6 animate-fade-up [animation-delay:0.6s] opacity-0">
          <a
            href="#inscricao"
            className="group inline-flex items-center justify-center gap-3 bg-copa-red hover:bg-copa-red/90 text-white font-bold tracking-wide px-8 py-4 transition-all duration-200 hover:shadow-[0_0_40px_rgba(230,57,70,0.4)]"
          >
            QUERO ME INSCREVER
            <span className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </a>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 text-sm">
            <div>
              <div className="text-copa-muted-soft text-xs uppercase tracking-widest mb-1 font-semibold">
                Quando
              </div>
              <div className="font-bold">18 de maio · 19h45</div>
            </div>
            <div className="hidden sm:block w-px bg-copa-line" />
            <div>
              <div className="text-copa-muted-soft text-xs uppercase tracking-widest mb-1 font-semibold">
                Onde
              </div>
              <div className="font-bold">USCS Campus Itapetininga</div>
            </div>
          </div>
        </div>
      </div>

      {/* Linha inferior */}
      <div
        aria-hidden
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-copa-gold to-transparent opacity-40"
      />
    </section>
  );
}
