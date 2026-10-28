# Testes E2E e de API (Playwright)

## Como rodar

Precisa de **3 terminais**:

```bash
# Terminal 1 - API (MySQL rodando e application.properties configurado)
cd api
./mvnw spring-boot:run        # Windows: mvnw.cmd spring-boot:run

# Terminal 2 - Front
cd client
npm install
npm run dev

# Terminal 3 - Testes
cd tests
npm install
npx playwright install chromium   # só na 1ª vez (baixa o navegador)
npm test                          # roda tudo
```

Outros comandos:

| Comando | O que faz |
|---|---|
| `npm run test:api` | só testes de API |
| `npm run test:e2e` | só testes E2E |
| `npm run test:ui` | abre a interface visual do Playwright (boa para apresentar) |
| `npx playwright test --headed` | mostra o navegador abrindo |
| `npm run report` | abre o relatório HTML do último teste |

## O que tem

```
tests/
├── playwright.config.ts   # 2 projetos: "api" (porta 8080) e "e2e" (porta 3000)
└── tests/
    ├── helpers.ts         # e-mail único, senha válida, criar usuário via API
    ├── api/
    │   ├── auth.spec.ts   # 6 testes: signup ok/duplicado/senha fraca, signin ok/401, reset 404
    │   └── posts.spec.ts  # 2 testes: like toggle, listar posts
    └── e2e/
        ├── auth.spec.ts   # cadastro completo; login errado -> certo
        └── curtida.spec.ts# curtir sem login (alerta); curtir logado -> aparece em "Posts Curtidos"
```

Total: **8 testes de API** (mínimo 5) e **4 testes E2E** (mínimo 3).
