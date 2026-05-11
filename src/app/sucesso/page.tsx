import Link from "next/link";
import Image from "next/image";

export default function Sucesso() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16 grain">
      <div className="max-w-2xl text-center">
        <Image
          src="/imgs/logo-copa-skilled.png"
          alt="Copa Skill.Ed"
          width={180}
          height={94}
          className="h-14 w-auto mx-auto mb-12 opacity-90"
        />

        {/* Check icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-copa-gold/45 mb-8">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-10 h-10 text-copa-gold"
          >
            <path
              d="M5 12.5L10 17.5L19.5 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-12 bg-copa-gold" />
          <span className="text-copa-gold text-xs md:text-sm font-bold tracking-[0.28em] uppercase">
            Inscrição registrada
          </span>
          <div className="h-px w-12 bg-copa-gold" />
        </div>

        <h1 className="font-display text-5xl md:text-7xl uppercase leading-[0.9] tracking-tight mb-6">
          Te vemos em
          <br />
          <span className="text-shine">Itapetininga.</span>
        </h1>

        <p className="text-copa-ink-soft leading-relaxed mb-2">
          Sua inscrição no Congresso Técnico da Copa Skill.Ed 2026 foi
          registrada com sucesso.
        </p>
        <p className="text-copa-muted-soft text-sm leading-relaxed mb-12">
          Em breve você receberá um e-mail de confirmação com os detalhes do
          encontro. Caso não receba em até 24h, verifique a caixa de spam ou
          entre em contato pelo WhatsApp.
        </p>

        <div className="border border-copa-line bg-copa-surface p-6 md:p-8 mb-10 text-left">
          <div className="grid sm:grid-cols-2 gap-6 text-sm">
            <div>
              <div className="text-copa-muted-soft text-xs uppercase tracking-widest mb-2 font-semibold">
                Quando
              </div>
              <div className="font-bold text-base">
                18 de maio de 2026
                <br />
                <span className="text-copa-ink-soft font-normal">
                  Segunda-feira · 19h45 às 21h30
                </span>
              </div>
            </div>
            <div>
              <div className="text-copa-muted-soft text-xs uppercase tracking-widest mb-2 font-semibold">
                Onde
              </div>
              <div className="font-bold text-base">
                USCS Campus Itapetininga
                <br />
                <span className="text-copa-ink-soft font-normal">
                  Av. Dr. Ciro Albuquerque, 4.750
                  <br />
                  Taboãozinho · Itapetininga/SP
                </span>
              </div>
            </div>
          </div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-copa-muted-soft hover:text-copa-gold transition-colors text-sm"
        >
          ← Voltar à página inicial
        </Link>
      </div>
    </main>
  );
}
