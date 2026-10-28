import { test, expect } from '@playwright/test';
import { criarUsuario } from '../helpers';

test.describe('E2E - Curtidas', () => {
  test('curtir sem estar logado mostra alerta', async ({ page }) => {
    await page.goto('/');

    // Captura o alert() do navegador e guarda a mensagem
    let mensagemAlerta = '';
    page.once('dialog', async (dialog) => {
      mensagemAlerta = dialog.message();
      await dialog.accept();
    });

    const primeiroPost = page.getByRole('listitem').first(); // vai pega o primeiro item
    await primeiroPost.getByRole('button', { name: /Curtir/ }).click(); // tenta curtir

    // vai dar ruim: o alert() do navegador é assíncrono, então precisamos esperar a mensagem
    await expect.poll(() => mensagemAlerta).toBe('Você precisa estar autenticado para curtir posts!');
    // O botão continua como "Curtir" (não curtiu)
    await expect(primeiroPost.getByRole('button', { name: /Curtir/ })).toBeVisible();
  });

  test('logado: curte um post e ele aparece em Posts Curtidos', async ({ page, request }) => {
    const usuario = await criarUsuario(request);

    // Login pela tela
    await page.goto('/signin');
    await page.getByPlaceholder('seu@email.com').fill(usuario.email);
    await page.locator('input[type="password"]').fill(usuario.senha);
    await page.locator('form').getByRole('button', { name: 'Entrar' }).click();
    await expect(page).toHaveURL('/');

    // Curte o primeiro post
    const primeiroPost = page.getByRole('listitem').first();
    const titulo = await primeiroPost.getByRole('heading').innerText();
    await primeiroPost.getByRole('button', { name: /Curtir/ }).click();
    await expect(primeiroPost.getByRole('button', { name: /Curtido/ })).toBeVisible();

    // Vai para "Posts Curtidos" e confere que o post está lá
    await page.getByRole('button', { name: 'Posts Curtidos' }).click();
    await expect(page).toHaveURL('/auth/liked');
    await expect(page.getByRole('heading', { name: titulo })).toBeVisible();
  });
});
