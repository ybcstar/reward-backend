// set_code.js
export async function onRequestPost(context) {
  const { request, env } = context;
  const body = await request.json();
  const { code, rewards, username, password } = body;

  const ADMIN_USER = 'admin';
  const ADMIN_PASS = 'POST';

  if (username !== ADMIN_USER || password !== ADMIN_PASS) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  if (!code || !Array.isArray(rewards) || !rewards.length) {
    return new Response(JSON.stringify({ error: 'Invalid code data' }), { status: 400 });
  }

  await env.code.put(code, JSON.stringify(rewards));
  return new Response(JSON.stringify({ status: 'code created/updated' }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
