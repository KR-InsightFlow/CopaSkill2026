import Image from "next/image";

export function Footer() {
  return (
    <footer className="relative bg-copa-dark border-t border-copa-line py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <Image
              src="/imgs/logo-copa-skilled.png"
              alt="Copa Skill.Ed"
              width={140}
              height={73}
              className="h-12 w-auto mb-4"
            />
            <p className="text-sm text-copa-muted-soft leading-relaxed">
              Copa Skill.Ed — &ldquo;Bom de bola, bom na escola.&rdquo;
              <br />
              Torneio multiesportivo escolar de Itapetininga.
              <br />
              8ª edição · 2026.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-copa-gold mb-4">
              Realização
            </h4>
            <p className="text-sm text-copa-ink-soft leading-relaxed">
              AR9 Eventos Esportivos LTDA
              <br />
              CNPJ 61.000.035/0001-15
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.25em] text-copa-gold mb-4">
              Contato
            </h4>
            <p className="text-sm text-copa-ink-soft leading-relaxed">
              Allan Ronzio
              <br />
              <a
                href="mailto:allan.ronzio@gmail.com"
                className="hover:text-copa-gold transition-colors"
              >
                allan.ronzio@gmail.com
              </a>
              <br />
              <a
                href="https://wa.me/5515997441170"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-copa-gold transition-colors"
              >
                (15) 99744-1170
              </a>
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-copa-line flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <p className="text-xs text-copa-muted-soft">
            © {new Date().getFullYear()} AR9 Eventos Esportivos LTDA. Todos os
            direitos reservados.
          </p>
          <p className="text-xs text-copa-muted-soft">
            Local cedido pela{" "}
            <span className="text-copa-ink-soft">USCS Itapetininga</span> ·
            Patrocinador institucional.
          </p>
        </div>
      </div>
    </footer>
  );
}
