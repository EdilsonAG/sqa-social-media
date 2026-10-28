import { test, expect } from '@playwright/test';
import { criarUsuario, emailUnico, SENHA_VALIDA } from '../helpers';

// Testes E2E: o Playwright abre o navegador e faz o que um usuário faria.

test.describe('E2E - Cadastro e Login', () => {
  test('fluxo de cadastro: cria conta e fica logado', async ({ page }) => {
    await page.goto('/signup');

    await page.getByPlaceholder('seu@email.com').fill(emailUnico('cadastro'));
    await page.locator('input[type="password"]').nth(0).fill(SENHA_VALIDA); // Senha
    await page.locator('input[type="password"]').nth(1).fill(SENHA_VALIDA); // Confirmar Senha
    // "form" porque o Header também tem um botão "Criar Conta"
    await page.locator('form').getByRole('button', { name: 'Criar Conta' }).click();

    // Depois do cadastro vai para o feed já logado
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('button', { name: 'Sair' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Posts Curtidos' })).toBeVisible();
  });

  test('fluxo de login: senha errada mostra erro, senha certa entra', async ({ page, request }) => {
    const usuario = await criarUsuario(request); // prepara um usuário pela API

    await page.goto('/signin');
    await page.getByPlaceholder('seu@email.com').fill(usuario.email);

    // 1) Senha errada -> mensagem de erro vinda da API
    await page.locator('input[type="password"]').fill('Errada@999');
    await page.locator('form').getByRole('button', { name: 'Entrar' }).click();
    await expect(page.getByText('Credenciais inválidas')).toBeVisible();
    await expect(page).toHaveURL('/signin');

    // 2) Senha certa -> entra e vai para o feed
    await page.locator('input[type="password"]').fill(usuario.senha);
    await page.locator('form').getByRole('button', { name: 'Entrar' }).click();
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('button', { name: 'Sair' })).toBeVisible();
  });
});
