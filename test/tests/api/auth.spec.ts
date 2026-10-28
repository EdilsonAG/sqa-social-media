import { test, expect } from '@playwright/test';
import { emailUnico, SENHA_VALIDA } from '../helpers';

// Testes de API (caixa-preta): mandamos uma requisição e conferimos
// o status HTTP e o corpo da resposta. Não olhamos o código Java.

test.describe('API - /auth', () => {
  test('POST /auth/signup cria usuário com sucesso (200)', async ({ request }) => {
    const email = emailUnico('signup');

    const resposta = await request.post('/auth/signup', {
      data: { email, password: SENHA_VALIDA },
    });

    expect(resposta.status()).toBe(200);
    const corpo = await resposta.json();
    expect(corpo.id).toBeTruthy();
    expect(corpo.email).toBe(email);
  });

  test('POST /auth/signup com e-mail duplicado retorna 409', async ({ request }) => {
    const email = emailUnico('duplicado');
    // 1º cadastro: funciona
    await request.post('/auth/signup', { data: { email, password: SENHA_VALIDA } });

    // 2º cadastro com o mesmo e-mail: deve falhar
    const resposta = await request.post('/auth/signup', {
      data: { email, password: SENHA_VALIDA },
    });

    expect(resposta.status()).toBe(409);
    expect((await resposta.json()).message).toBe('E-mail já está em uso');
  });

  test('POST /auth/signup com senha fraca retorna 422', async ({ request }) => {
    const resposta = await request.post('/auth/signup', {
      data: { email: emailUnico('fraca'), password: '123' },
    });

    expect(resposta.status()).toBe(422);
    expect((await resposta.json()).message).toBe('Senha inválida');
  });

  test('POST /auth/signin com credenciais corretas retorna 200', async ({ request }) => {
    const email = emailUnico('login');
    await request.post('/auth/signup', { data: { email, password: SENHA_VALIDA } });

    const resposta = await request.post('/auth/signin', {
      data: { email, password: SENHA_VALIDA },
    });

    expect(resposta.status()).toBe(200);
    expect((await resposta.json()).email).toBe(email);
  });

  test('POST /auth/signin com senha errada retorna 401', async ({ request }) => {
    const email = emailUnico('senhaerrada');
    await request.post('/auth/signup', { data: { email, password: SENHA_VALIDA } });

    const resposta = await request.post('/auth/signin', {
      data: { email, password: 'Errada@999' },
    });

    expect(resposta.status()).toBe(401);
    expect((await resposta.json()).message).toBe('Credenciais inválidas');
  });

  test('POST /auth/reset-password com e-mail inexistente retorna 404', async ({ request }) => {
    const resposta = await request.post('/auth/reset-password', {
      data: { email: emailUnico('naoexiste') },
    });

    expect(resposta.status()).toBe(404);
    expect((await resposta.json()).message).toBe('Usuário não encontrado');
  });
});
