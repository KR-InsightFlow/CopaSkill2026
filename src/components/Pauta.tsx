import Image from "next/image";

const pautaItens = [
  {
    n: "01",
    titulo: "Regulamento 2026",
    desc: "Apresentação das regras oficiais, ajustes em relação à edição anterior e regras específicas de cada modalidade.",
  },
  {
    n: "02",
    titulo: "Calendário oficial",
    desc: "Divulgação dos 16 sábados de competição, datas das semifinais e da grande final.",
  },
  {
    n: "03",
    titulo: "Critérios técnicos",
    desc: "Sorteio das chaves, formato de classificação e critérios de desempate por modalidade.",
  },
  {
    n: "04",
    titulo: "Disponibilidade de atletas",
    desc: "Levantamento dos alunos disponíveis por categoria etária e modalidade em cada escola participante.",
  },
];

export function Pauta() {
  return (
    <section className="relative bg-copa-dark py-20 md:py-28 border-b border-copa-line overflow-hidden">
      {/* Trofeu decorativo lateral */}
      <div className="absolute -right-32 top-1/2 -translate-y-1/2 opacity-[0.06] pointer-events-none hidden md:block">
        <Image
          src="/imgs/trofeu.png"
          alt=""
          width={500}
          height={830}
          aria-hidden
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="max-w-2xl mb-14 md:mb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-copa-gold" />
            <span className="text-copa-gold text-xs md:text-sm font-bold tracking-[0.28em] uppercase">
              Pauta do encontro
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-6xl uppercase leading-[0.9] tracking-tight">
            Tudo o que será
            <br />
            <span className="text-copa-red-light">decidido em 1h45.</span>
          </h2>
          <p className="mt-6 text-copa-ink-soft leading-relaxed text-base md:text-[17px]">
            O Congresso Técnico tem caráter regulamentar e reúne, em encontro
            único de abertura da temporada, os representantes técnicos das
            escolas convidadas e a equipe organizadora.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-px bg-copa-line">
          {pautaItens.map((item) => (
            <div
              key={item.n}
              className="bg-copa-surface p-8 md:p-10 hover:bg-[#252530] transition-colors duration-300"
            >
              <div className="flex items-baseline gap-5">
                <span className="font-display text-5xl md:text-6xl text-copa-gold/85 leading-none">
                  {item.n}
                </span>
                <div>
                  <h3 className="font-display text-xl md:text-2xl uppercase tracking-tight mb-2">
                    {item.titulo}
                  </h3>
                  <p className="text-sm md:text-[15px] text-copa-ink-soft leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Faixa de destaque - presença obrigatória */}
        <div className="mt-14 border border-copa-red-light/45 bg-copa-red-light/[0.07] p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="text-copa-red-light font-bold text-xs uppercase tracking-[0.25em] sm:border-r sm:border-copa-red-light/30 sm:pr-6">
              Atenção
            </div>
            <p className="text-copa-ink/95 text-sm md:text-base leading-relaxed">
              A presença de pelo menos um representante técnico por escola é{" "}
              <strong className="text-copa-ink">obrigatória</strong> para
              participação na Copa Skill.Ed 2026.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
