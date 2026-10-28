import { test, expect } from '@playwright/test';
import { criarUsuario } from '../helpers';

test.describe('API - /posts', () => {
  test('POST /posts/{id}/like curte e descurte (toggle)', async ({ request }) => {
    const usuario = await criarUsuario(request);

    // 1ª chamada: curte
    const curtir = await request.post(`/posts/1/like?userId=${usuario.id}`);
    expect(curtir.status()).toBe(200);
    expect(await curtir.json()).toEqual({ postId: 1, liked: true });

    // 2ª chamada no mesmo post: descurte
    const descurtir = await request.post(`/posts/1/like?userId=${usuario.id}`);
    expect(descurtir.status()).toBe(200);
    expect(await descurtir.json()).toEqual({ postId: 1, liked: false });
  });

  test('GET /posts?limit=5 retorna 5 posts', async ({ request }) => {
    const resposta = await request.get('/posts?limit=5');

    expect(resposta.status()).toBe(200);
    const corpo = await resposta.json();
    expect(corpo.posts).toHaveLength(5);
    expect(corpo.posts[0]).toHaveProperty('title');
    expect(corpo.posts[0]).toHaveProperty('liked', false);
  });
});
