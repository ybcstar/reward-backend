// redeem.js
export async function onRequestPost(context) {
  const { request, env } = context;
  const body = await request.json();
  const { player_id, code } = body;

  if (!player_id || !code) {
    return new Response(JSON.stringify({ error: 'Missing player_id or code' }), { status: 400 });
  }

  const rewards = await env.code.get(code, 'json');
  if (!rewards) {
    return new Response(JSON.stringify({ error: 'Code not found' }), { status: 404 });
  }

  // 永久有效，直接返回奖励
  return new Response(JSON.stringify({ status: 'success', rewards }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
