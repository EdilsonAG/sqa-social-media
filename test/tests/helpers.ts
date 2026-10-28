import { APIRequestContext } from '@playwright/test';
import { API_URL } from '../playwright.config';

// Senha que passa nas regras do front E da API:
// mais de 8 caracteres, maiúscula, minúscula, número e caractere especial
export const SENHA_VALIDA = 'Senha@123';

// Gera um e-mail diferente a cada execução (evita "e-mail já está em uso")
export function emailUnico(prefixo = 'teste'): string {
  return `${prefixo}_${Date.now()}_${Math.floor(Math.random() * 1000)}@teste.com`;
}

// Cria um usuário direto pela API (usado para preparar os testes E2E)
export async function criarUsuario(request: APIRequestContext) {
  const email = emailUnico('e2e');
  const resposta = await request.post(`${API_URL}/auth/signup`, {
    data: { email, password: SENHA_VALIDA },
  });
  const usuario = await resposta.json();
  return { id: usuario.id as number, email, senha: SENHA_VALIDA };
}
