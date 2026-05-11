import { NextRequest, NextResponse } from "next/server";
import {
  isValidCpf,
  isValidEmail,
  isValidPhoneBr,
  onlyDigits,
} from "@/lib/validators";
import type {
  Cargo,
  InscricaoPayload,
  InscricaoResponse,
  Modalidade,
} from "@/lib/types";

const CARGOS_VALIDOS: Cargo[] = [
  "Diretor(a)",
  "Coordenador(a) Pedagógico(a)",
  "Técnico(a)",
  "Outro",
];

const MODALIDADES_VALIDAS: Modalidade[] = ["Futsal", "Voleibol", "Basquetebol"];

export async function POST(req: NextRequest): Promise<NextResponse<InscricaoResponse>> {
  let body: Partial<InscricaoPayload>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Payload inválido." },
      { status: 400 }
    );
  }

  // === Validação server-side (não confiar no client) ===
  const errors: Partial<Record<keyof InscricaoPayload, string>> = {};

  if (!body.nome || body.nome.trim().length < 3) {
    errors.nome = "Informe o nome completo.";
  }
  if (!body.cpf || !isValidCpf(body.cpf)) {
    errors.cpf = "CPF inválido.";
  }
  if (!body.email || !isValidEmail(body.email)) {
    errors.email = "E-mail inválido.";
  }
  if (!body.whatsapp || !isValidPhoneBr(body.whatsapp)) {
    errors.whatsapp = "Telefone inválido.";
  }
  if (!body.escola || body.escola.trim().length < 2) {
    errors.escola = "Informe a escola que representa.";
  }
  if (!body.cargo || !CARGOS_VALIDOS.includes(body.cargo)) {
    errors.cargo = "Selecione um cargo válido.";
  }
  if (
    !Array.isArray(body.modalidades) ||
    body.modalidades.length === 0 ||
    !body.modalidades.every((m) => MODALIDADES_VALIDAS.includes(m))
  ) {
    errors.modalidades = "Selecione ao menos uma modalidade.";
  }
  if (body.consentimentoLgpd !== true) {
    errors.consentimentoLgpd = "É necessário aceitar o tratamento de dados.";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  // === Encaminhar ao Apps Script ===
  const webhookUrl = process.env.APPS_SCRIPT_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("APPS_SCRIPT_WEBHOOK_URL não configurada.");
    return NextResponse.json(
      { ok: false, message: "Servidor mal configurado. Tente mais tarde." },
      { status: 500 }
    );
  }

  const payload: InscricaoPayload & {
    token?: string;
    recebidoEm: string;
    ip?: string;
  } = {
    nome: body.nome!.trim(),
    cpf: onlyDigits(body.cpf!),
    email: body.email!.trim().toLowerCase(),
    whatsapp: onlyDigits(body.whatsapp!),
    escola: body.escola!.trim(),
    cargo: body.cargo!,
    modalidades: body.modalidades!,
    consentimentoLgpd: true,
    // Token compartilhado entre Vercel e Apps Script (proteção anti-spam)
    token: process.env.APPS_SCRIPT_SHARED_TOKEN,
    recebidoEm: new Date().toISOString(),
    ip:
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      undefined,
  };

  try {
    const r = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      // Apps Script às vezes redireciona; o fetch padrão segue redirect.
      redirect: "follow",
    });

    if (!r.ok) {
      console.error("Apps Script respondeu com erro:", r.status, await r.text());
      return NextResponse.json(
        {
          ok: false,
          message:
            "Não foi possível registrar sua inscrição agora. Tente novamente em instantes.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, message: "Inscrição registrada." });
  } catch (err) {
    console.error("Falha ao chamar Apps Script:", err);
    return NextResponse.json(
      {
        ok: false,
        message: "Erro de comunicação com o servidor de registro.",
      },
      { status: 502 }
    );
  }
}
