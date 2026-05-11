"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import {
  formatCpf,
  formatPhoneBr,
  isValidCpf,
  isValidEmail,
  isValidPhoneBr,
} from "@/lib/validators";
import type {
  Cargo,
  InscricaoPayload,
  InscricaoResponse,
  Modalidade,
} from "@/lib/types";

const CARGOS: Cargo[] = [
  "Diretor(a)",
  "Coordenador(a) Pedagógico(a)",
  "Técnico(a)",
  "Outro",
];

const MODALIDADES: Modalidade[] = ["Futsal", "Voleibol", "Basquetebol"];

type FormState = {
  nome: string;
  cpf: string;
  email: string;
  whatsapp: string;
  escola: string;
  cargo: Cargo | "";
  modalidades: Modalidade[];
  consentimentoLgpd: boolean;
};

const initialState: FormState = {
  nome: "",
  cpf: "",
  email: "",
  whatsapp: "",
  escola: "",
  cargo: "",
  modalidades: [],
  consentimentoLgpd: false,
};

export function FormularioInscricao() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((p) => ({ ...p, [key]: value }));
    if (errors[key as string]) {
      setErrors((e) => {
        const c = { ...e };
        delete c[key as string];
        return c;
      });
    }
  }

  function toggleModalidade(m: Modalidade) {
    setForm((p) => {
      const has = p.modalidades.includes(m);
      const next = has
        ? p.modalidades.filter((x) => x !== m)
        : [...p.modalidades, m];
      return { ...p, modalidades: next };
    });
    if (errors.modalidades) {
      setErrors((e) => {
        const c = { ...e };
        delete c.modalidades;
        return c;
      });
    }
  }

  function validateLocal(): boolean {
    const e: Record<string, string> = {};
    if (!form.nome.trim() || form.nome.trim().length < 3)
      e.nome = "Informe seu nome completo.";
    if (!isValidCpf(form.cpf)) e.cpf = "CPF inválido.";
    if (!isValidEmail(form.email)) e.email = "E-mail inválido.";
    if (!isValidPhoneBr(form.whatsapp))
      e.whatsapp = "Informe um WhatsApp com DDD válido.";
    if (!form.escola.trim()) e.escola = "Informe a escola que você representa.";
    if (!form.cargo) e.cargo = "Selecione seu cargo.";
    if (form.modalidades.length === 0)
      e.modalidades = "Selecione ao menos uma modalidade.";
    if (!form.consentimentoLgpd)
      e.consentimentoLgpd = "É necessário aceitar para prosseguir.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    setServerError(null);
    if (!validateLocal()) return;

    setSubmitting(true);
    try {
      const payload: InscricaoPayload = {
        nome: form.nome.trim(),
        cpf: form.cpf,
        email: form.email.trim(),
        whatsapp: form.whatsapp,
        escola: form.escola.trim(),
        cargo: form.cargo as Cargo,
        modalidades: form.modalidades,
        consentimentoLgpd: form.consentimentoLgpd,
      };

      const r = await fetch("/api/inscricao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: InscricaoResponse = await r.json();

      if (r.ok && data.ok) {
        router.push("/sucesso");
        return;
      }

      if (data.errors) {
        setErrors(data.errors as Record<string, string>);
        setServerError("Há campos com erro. Revise e tente novamente.");
      } else {
        setServerError(
          data.message || "Falha ao registrar inscrição. Tente novamente."
        );
      }
    } catch {
      setServerError(
        "Erro de conexão. Verifique sua internet e tente novamente."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-copa-surface border border-copa-line p-6 md:p-10"
      noValidate
    >
      <div className="space-y-5">
        <Field label="Nome completo" error={errors.nome} required>
          <input
            type="text"
            autoComplete="name"
            value={form.nome}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              update("nome", e.target.value)
            }
            className={inputClass(!!errors.nome)}
            placeholder="Como você assina"
          />
        </Field>

        <div className="grid md:grid-cols-2 gap-5">
          <Field label="CPF" error={errors.cpf} required>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={form.cpf}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                update("cpf", formatCpf(e.target.value))
              }
              maxLength={14}
              className={inputClass(!!errors.cpf)}
              placeholder="000.000.000-00"
            />
          </Field>

          <Field label="WhatsApp" error={errors.whatsapp} required>
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={form.whatsapp}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                update("whatsapp", formatPhoneBr(e.target.value))
              }
              maxLength={16}
              className={inputClass(!!errors.whatsapp)}
              placeholder="(15) 99999-9999"
            />
          </Field>
        </div>

        <Field label="E-mail" error={errors.email} required>
          <input
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              update("email", e.target.value)
            }
            className={inputClass(!!errors.email)}
            placeholder="seu@email.com"
          />
        </Field>

        <Field label="Escola que representa" error={errors.escola} required>
          <input
            type="text"
            autoComplete="organization"
            value={form.escola}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              update("escola", e.target.value)
            }
            className={inputClass(!!errors.escola)}
            placeholder="Nome da instituição"
          />
        </Field>

        <Field label="Cargo na escola" error={errors.cargo} required>
          <select
            value={form.cargo}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              update("cargo", e.target.value as Cargo)
            }
            className={`${inputClass(!!errors.cargo)} select-copa`}
          >
            <option value="">Selecione...</option>
            {CARGOS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        {/* Modalidades */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-[0.18em] text-copa-gold mb-3">
            Modalidades de interesse <span className="text-copa-red-light">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {MODALIDADES.map((m) => {
              const active = form.modalidades.includes(m);
              return (
                <button
                  type="button"
                  key={m}
                  onClick={() => toggleModalidade(m)}
                  className={`group relative px-5 py-4 border text-center transition-all duration-200 uppercase tracking-wide font-semibold text-sm ${
                    active
                      ? "border-copa-red bg-copa-red/[0.18] text-white"
                      : "border-copa-line bg-copa-dark text-copa-ink-soft hover:border-copa-muted hover:text-copa-ink"
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>
          {errors.modalidades && (
            <p className="mt-2 text-xs text-copa-red-light">
              {errors.modalidades}
            </p>
          )}
        </div>

        {/* LGPD */}
        <div className="border border-copa-line bg-copa-dark p-4 md:p-5">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.consentimentoLgpd}
              onChange={(e) => update("consentimentoLgpd", e.target.checked)}
              className="mt-1 w-[18px] h-[18px] accent-copa-gold shrink-0 cursor-pointer"
            />
            <span className="text-[13px] text-copa-ink-soft leading-relaxed">
              Autorizo a AR9 Eventos Esportivos LTDA (CNPJ 61.000.035/0001-15) a
              tratar os dados informados (nome, CPF, e-mail, WhatsApp, escola e
              cargo) com a finalidade exclusiva de organização do Congresso
              Técnico e da Copa Skill.Ed 2026, em conformidade com a Lei Geral
              de Proteção de Dados (Lei nº 13.709/2018). Os dados não serão
              compartilhados com terceiros sem nova autorização.
            </span>
          </label>
          {errors.consentimentoLgpd && (
            <p className="mt-2 text-xs text-copa-red-light ml-7">
              {errors.consentimentoLgpd}
            </p>
          )}
        </div>

        {serverError && (
          <div className="border border-copa-red bg-copa-red/10 px-5 py-4 text-sm text-copa-ink">
            {serverError}
          </div>
        )}

        {/* Botão CTA + linha de confiança */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="btn-copa-gold w-full inline-flex items-center justify-center gap-3 font-extrabold text-[16px] tracking-[0.12em] uppercase px-6 py-5 font-body"
          >
            {submitting ? (
              <>
                <Spinner /> ENVIANDO...
              </>
            ) : (
              <>
                CONFIRMAR PRESENÇA
                <span className="text-xl leading-none">→</span>
              </>
            )}
          </button>
          <p className="mt-4 text-center text-[13px] text-copa-muted-soft tracking-wide">
            Inscrição gratuita{" "}
            <span className="text-copa-gold mx-1.5">·</span>{" "}
            Confirmação imediata por e-mail
          </p>
        </div>
      </div>
    </form>
  );
}

function inputClass(hasError: boolean): string {
  return [
    "w-full bg-copa-dark border px-4 py-3.5 text-copa-ink placeholder:text-copa-muted/60 text-[15px]",
    "focus:outline-none focus:border-copa-gold transition-colors",
    hasError ? "border-copa-red-light" : "border-copa-line",
  ].join(" ");
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-[0.18em] text-copa-gold mb-2">
        {label} {required && <span className="text-copa-red-light">*</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-copa-red-light">{error}</p>}
    </div>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        opacity="0.25"
      />
      <path
        d="M4 12a8 8 0 018-8"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
