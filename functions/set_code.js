export async function onRequestPost(context) {
  const { request, env } = context;
  const body = await request.json();
  const { code, reward, amount, username, password } = body;

  const ADMIN_USER = 'admin';
  const ADMIN_PASS = 'POST';

  if (username !== ADMIN_USER || password !== ADMIN_PASS) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  if (!code || !reward || typeof amount !== 'number' || amount < 0) {
    return new Response(JSON.stringify({ error: 'Invalid code data' }), { status: 400 });
  }

  await env.code.put(code, JSON.stringify({ reward, amount, used: false }));
  return new Response(JSON.stringify({ status: 'code created/updated' }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
