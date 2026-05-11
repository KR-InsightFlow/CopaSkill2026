const detalhes = [
  {
    eyebrow: "Data e horário",
    titulo: "18 de maio",
    sub: "Segunda-feira · 19h45 às 21h30",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
        <rect
          x="3"
          y="5"
          width="18"
          height="16"
          rx="1"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M3 9h18M8 3v4M16 3v4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="12" cy="14" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    eyebrow: "Local",
    titulo: "USCS Itapetininga",
    sub: "Av. Dr. Ciro Albuquerque, 4.750\nTaboãozinho · Itapetininga/SP",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
        <path
          d="M12 21s-7-7.5-7-12a7 7 0 1114 0c0 4.5-7 12-7 12z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle
          cx="12"
          cy="9"
          r="2.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
  {
    eyebrow: "Público",
    titulo: "Diretores e técnicos",
    sub: "Das escolas convidadas para a temporada 2026",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
        <circle
          cx="9"
          cy="8"
          r="3.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle
          cx="17"
          cy="9"
          r="2.5"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M2 20c0-3.5 3-6 7-6s7 2.5 7 6M15 14c3.5 0 7 2 7 5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export function EventoDetalhes() {
  return (
    <section className="relative bg-copa-section py-20 md:py-28 grain border-b border-copa-line">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-px bg-copa-line">
          {detalhes.map((d) => (
            <div
              key={d.eyebrow}
              className="bg-copa-surface p-8 md:p-10 hover:bg-[#252530] transition-colors duration-300 group"
            >
              <div className="text-copa-gold mb-6 group-hover:scale-110 transition-transform duration-300 origin-left">
                {d.icon}
              </div>
              <div className="text-copa-muted-soft text-xs uppercase tracking-[0.25em] mb-3 font-semibold">
                {d.eyebrow}
              </div>
              <div className="font-display text-3xl md:text-4xl uppercase tracking-tight mb-3 leading-none">
                {d.titulo}
              </div>
              <div className="text-sm md:text-[15px] text-copa-ink-soft leading-relaxed whitespace-pre-line">
                {d.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
