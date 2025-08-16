export async function onRequestPost(context) {
  const { request, env } = context;
  const body = await request.json();
  const { player_id, code } = body;

  if (!player_id || !code) {
    return new Response(JSON.stringify({ error: 'Missing player_id or code' }), { status: 400 });
  }

  const record = await env.code.get(code, 'json');
  if (!record) {
    return new Response(JSON.stringify({ error: 'Code not found' }), { status: 404 });
  }
  if (record.used) {
    return new Response(JSON.stringify({ error: 'Code already redeemed' }), { status: 410 });
  }

  // 标记为已用
  record.used = true;
  await env.code.put(code, JSON.stringify(record));

  return new Response(JSON.stringify({
    status: 'success',
    reward: record.reward,
    amount: record.amount
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
