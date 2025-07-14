export async function onRequestPost(context) {
  const { request, env } = context;
  const body = await request.json();
  const playerId = body.player_id;

  if (!playerId) {
    return new Response(JSON.stringify({ error: "Missing player_id" }), { status: 400 });
  }

  const meta = await env.cookierunfangames.get("meta", "json");
  if (!meta) {
    return new Response(JSON.stringify({ error: "Reward not configured" }), { status: 404 });
  }

  const key = `claim:${playerId}`;
  const record = await env.cookierunfangames.get(key, "json");

  if (record && record.claimed) {
    return new Response(JSON.stringify({ error: "Already claimed" }), { status: 403 });
  }

  const now = new Date().toISOString();
  await env.cookierunfangames.put(key, JSON.stringify({ time: now, claimed: true }));

  return new Response(JSON.stringify({
    status: "success",
    reward: meta.reward,
    amount: meta.amount
  }), {
    headers: { "Content-Type": "application/json" }
  });
}
