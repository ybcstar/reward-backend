// set_reward.js
export async function onRequestPost(context) {
  const { request, env } = context;
  const body = await request.json();
  const { rewards, password } = body;

  const ADMIN_PASS = env.pswd;

  if (!ADMIN_PASS || password !== ADMIN_PASS) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  if (!Array.isArray(rewards) || !rewards.length) {
    return new Response(JSON.stringify({ error: 'Invalid rewards array' }), { status: 400 });
  }

  await env.cookierunfangames.put('meta', JSON.stringify(rewards));

  // 清空所有领取记录
  const list = await env.cookierunfangames.list({ prefix: 'claim:' });
  await Promise.all(list.keys.map(k => env.cookierunfangames.delete(k.name)));

  return new Response(JSON.stringify({ status: 'rewards updated and claims reset' }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
