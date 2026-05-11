export type Cargo =
  | "Diretor(a)"
  | "Coordenador(a) Pedagógico(a)"
  | "Técnico(a)"
  | "Outro";

export type Modalidade = "Futsal" | "Voleibol" | "Basquetebol";

export interface InscricaoPayload {
  nome: string;
  cpf: string;
  email: string;
  whatsapp: string;
  escola: string;
  cargo: Cargo;
  modalidades: Modalidade[];
  consentimentoLgpd: boolean;
}

export interface InscricaoResponse {
  ok: boolean;
  message?: string;
  errors?: Partial<Record<keyof InscricaoPayload, string>>;
}
