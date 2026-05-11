// === CPF ===

/** Remove tudo que não for dígito */
export const onlyDigits = (s: string): string => s.replace(/\D/g, "");

/** Valida CPF pelo algoritmo dos dígitos verificadores (não só formato) */
export function isValidCpf(rawCpf: string): boolean {
  const cpf = onlyDigits(rawCpf);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false; // todos iguais (111.111.111-11 etc)

  const calcDigit = (slice: string, factor: number): number => {
    let sum = 0;
    for (let i = 0; i < slice.length; i++) {
      sum += parseInt(slice[i], 10) * (factor - i);
    }
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };

  const d1 = calcDigit(cpf.slice(0, 9), 10);
  if (d1 !== parseInt(cpf[9], 10)) return false;
  const d2 = calcDigit(cpf.slice(0, 10), 11);
  if (d2 !== parseInt(cpf[10], 10)) return false;
  return true;
}

/** Formata "12345678900" -> "123.456.789-00" */
export function formatCpf(value: string): string {
  const d = onlyDigits(value).slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

// === Telefone (BR, celular com DDD) ===

export function isValidPhoneBr(rawPhone: string): boolean {
  const d = onlyDigits(rawPhone);
  // 10 (fixo) ou 11 (celular). Para inscrição preferimos celular (11)
  return d.length === 10 || d.length === 11;
}

export function formatPhoneBr(value: string): string {
  const d = onlyDigits(value).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10)
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

// === E-mail ===

export function isValidEmail(email: string): boolean {
  // Regex pragmática (não RFC completa, mas captura erros óbvios)
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}
