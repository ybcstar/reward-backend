export async function onRequestPost(context) {
  const { request, env } = context;
  const body = await request.json();
  const { reward, amount, username, password } = body;

  const ADMIN_USER = 'admin';
  const ADMIN_PASS = 'POST';

  if (username !== ADMIN_USER || password !== ADMIN_PASS) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  if (!reward || typeof amount !== 'number' || amount < 0) {
    return new Response(JSON.stringify({ error: 'Invalid reward data' }), { status: 400 });
  }

  await env.cookierunfangames.put('meta', JSON.stringify({ reward, amount }));

  const list = await env.cookierunfangames.list({ prefix: 'claim:' });
  await Promise.all(list.keys.map(k => env.cookierunfangames.delete(k.name)));

  return new Response(JSON.stringify({ status: 'reward updated and claims reset' }), {
    headers: { 'Content-Type': 'application/json' }
  });
}