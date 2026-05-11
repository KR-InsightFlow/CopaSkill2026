# Landing Page — Congresso Técnico Copa Skill.Ed 2026

Site oficial de inscrição para o Congresso Técnico da 8ª edição da Copa Skill.Ed.

**Stack:** Next.js 15 (App Router) + TypeScript + Tailwind CSS · Backend em Google Apps Script + Google Sheets como banco de dados · Deploy no Vercel.

---

## Arquitetura

```
Usuário ──► Landing (Vercel) ──POST──► /api/inscricao
                                          │
                                          ▼
                                    Apps Script (Google)
                                          │
                            ┌─────────────┴─────────────┐
                            ▼                           ▼
                  Google Sheet (banco)         E-mails (confirmação +
                                                       notificação)
```

**Decisões técnicas:**

- **Não chamamos a Google Sheets API direto do Vercel.** O Apps Script é mais simples (sem credenciais), mais seguro (sem service account exposta) e roda dentro do próprio ecossistema Google.
- **Validação dupla** (client + server) — o client tem feedback imediato; o server (`/api/inscricao`) revalida porque cliente é não-confiável.
- **Token compartilhado** entre Vercel e Apps Script protege contra spam caso alguém descubra a URL pública do webhook.

---

## Setup inicial — 5 passos

### 1. Subir o repositório no GitHub

```bash
cd projeto
git init
git add .
git commit -m "Initial commit: landing congresso técnico 2026"
git branch -M main
git remote add origin git@github.com:SEU_USUARIO/congresso-tecnico-2026.git
git push -u origin main
```

### 2. Criar a planilha do Google Sheets

1. Acesse [sheets.google.com](https://sheets.google.com)
2. Crie uma nova planilha em branco
3. Renomeie para **"Inscrições Congresso Técnico 2026"**
4. Não precisa criar abas/colunas — o Apps Script faz isso automaticamente na primeira inscrição.

### 3. Configurar o Apps Script

1. Na planilha aberta, vá em **Extensões > Apps Script**
2. Apague o conteúdo padrão e cole **TODO** o conteúdo de `apps-script/Code.gs`
3. **IMPORTANTE — Edite a constante `TOKEN_SEGURANCA`:**
   - No terminal, gere um token aleatório:
     ```bash
     openssl rand -hex 32
     ```
   - Cole o resultado dentro das aspas em `TOKEN_SEGURANCA = '...'`
   - **Guarde esse mesmo valor** — você vai precisar dele no passo 5.
4. Salve o projeto (Ctrl+S) e dê um nome (ex: "Inscrições Congresso 2026")

### 4. Publicar o Apps Script como Web App

1. No editor do Apps Script, clique em **Implantar > Nova implantação**
2. Em "Selecione o tipo", escolha **Aplicativo da Web**
3. Configurações:
   - **Descrição:** `v1 — produção`
   - **Executar como:** `Eu (seu email)`
   - **Quem tem acesso:** `Qualquer pessoa`
4. Clique em **Implantar**
5. Autorize as permissões quando solicitado (Google vai pedir acesso à planilha e ao Gmail para enviar os e-mails)
6. **Copie a URL gerada** — termina em `/exec`. Algo como:
   ```
   https://script.google.com/macros/s/AKfycbz.../exec
   ```

> ⚠️ **Atenção:** Ao publicar, o Google pode exibir um aviso "Google não verificou este app". Isso é normal — clique em **Avançado** > **Acessar [nome do projeto] (não seguro)**. É seguro porque é o seu próprio script.

> ⚠️ **Sempre que editar o Code.gs:** vá em **Implantar > Gerenciar implantações > ✏️ (editar) > Versão: Nova versão > Implantar**. Caso contrário, suas mudanças não entram em produção.

### 5. Deploy no Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login com GitHub
2. Clique em **Add New > Project** e selecione o repositório
3. Em "Environment Variables", adicione:
   - `APPS_SCRIPT_WEBHOOK_URL` → cole a URL do passo 4
   - `APPS_SCRIPT_SHARED_TOKEN` → cole o **mesmo token** definido no passo 3
4. Clique em **Deploy**
5. Após o deploy, acesse a URL gerada (ex: `congresso-tecnico-copa-skilled-2026.vercel.app`)

---

## Conectar domínio próprio

Se você já tem um domínio (ex: `copaskilled.com.br`):

1. No Vercel, abra o projeto > **Settings > Domains**
2. Adicione o subdomínio desejado (ex: `congresso.copaskilled.com.br`)
3. O Vercel mostra os registros DNS necessários — adicione-os no painel do seu registrador (Registro.br, GoDaddy etc.)
4. Aguarde a propagação (até 24h, geralmente em minutos)

**Recomendação:** use um subdomínio dedicado (`congresso.copaskilled.com.br`) em vez do domínio raiz. Permite usar o domínio principal para outras finalidades.

---

## Desenvolvimento local

```bash
cd projeto
npm install
cp .env.example .env.local
# edite .env.local com suas credenciais
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

---

## Estrutura de arquivos

```
projeto/
├── apps-script/
│   └── Code.gs                    # Backend (cole no editor do Apps Script)
├── public/
│   └── imgs/
│       ├── logo-copa-skilled.png  # Logo limpo (sem o "2025")
│       └── trofeu.png             # Troféu decorativo
├── src/
│   ├── app/
│   │   ├── api/inscricao/route.ts # Endpoint POST do formulário
│   │   ├── sucesso/page.tsx       # Página de confirmação
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx               # Landing principal
│   ├── components/
│   │   ├── EventoDetalhes.tsx
│   │   ├── Footer.tsx
│   │   ├── FormularioInscricao.tsx
│   │   ├── Hero.tsx
│   │   └── Pauta.tsx
│   └── lib/
│       ├── types.ts
│       └── validators.ts          # Validação de CPF, telefone, e-mail
├── .env.example
├── .gitignore
├── next.config.ts
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## Operação no dia a dia

### Acompanhar inscrições

Abra a planilha do Google Sheets — todas as inscrições aparecem em tempo real na aba "Inscrições".

### Receber notificações

Você recebe **dois e-mails** a cada inscrição:
- **Notificação interna** (você → você): texto plano com todos os dados
- **Confirmação do participante** (você → inscrito): HTML estilizado

### Editar texto do site

Os textos da landing estão em:
- `src/components/Hero.tsx`
- `src/components/EventoDetalhes.tsx`
- `src/components/Pauta.tsx`
- `src/app/sucesso/page.tsx`

Após editar, faça `git push` — o Vercel faz redeploy automático.

### Editar texto do e-mail

Edite a função `enviarConfirmacaoParticipante` no `apps-script/Code.gs`. **Lembre-se de criar uma nova versão** (passo 4 do setup, parágrafo final).

---

## Limites e custos

| Item | Limite | Custo |
|---|---|---|
| Vercel Hobby | 100 GB-h/mês de função, 100k requisições | Grátis |
| Apps Script | 90min/dia execução total | Grátis |
| Gmail (envio via MailApp) | 100 destinatários/dia em conta gratuita | Grátis |
| Google Sheets | 10 milhões de células por planilha | Grátis |

Para 20 inscrições previstas, o uso é **<0,1%** de qualquer um desses limites.

---

## Troubleshooting

### "O usuário não recebeu o e-mail de confirmação"
- Verifique a aba de spam
- Veja os logs do Apps Script: editor > **Execuções** (menu lateral)
- Confirme que o limite diário do Gmail (100 envios) não foi atingido

### "A inscrição falha sempre"
- Confirme que `APPS_SCRIPT_WEBHOOK_URL` no Vercel está apontando para a versão correta
- Confirme que `APPS_SCRIPT_SHARED_TOKEN` no Vercel é **idêntico** ao `TOKEN_SEGURANCA` no Apps Script
- Acesse a URL do webhook no navegador — deve retornar JSON com `"ok": true`

### "Quero ver os logs do Apps Script"
Editor do Apps Script > menu lateral > **Execuções**. Mostra todas as chamadas com timestamp, status e logs.

### "Quero baixar as inscrições"
Na planilha: **Arquivo > Fazer download > Microsoft Excel (.xlsx)** ou **CSV**.

---

## Notas finais

- O CPF é dado pessoal sensível. O texto LGPD no formulário é genérico e adequado para o caso de uso. Para algo mais robusto (ex: política de privacidade dedicada), consulte um advogado.
- A validação de CPF é **algorítmica** (verifica os dígitos verificadores), não apenas de formato. CPFs inválidos como `111.111.111-11` são rejeitados.
- O sistema previne inscrições duplicadas pelo mesmo CPF — a segunda tentativa retorna sucesso ao usuário (UX limpa) mas notifica o organizador por e-mail.
