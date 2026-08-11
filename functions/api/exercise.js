// Cloudflare Pages Function: proxy hacia ExerciseDB (RapidAPI).
// Se ejecuta en el servidor de Cloudflare, así que la API key nunca llega al navegador
// ni queda expuesta en el código fuente. La key se configura como variable de entorno
// (secret) "RAPIDAPI_KEY" en el dashboard de Cloudflare Pages, no en este repo.

const EDB_HOST = "exercisedb.p.rapidapi.com";

export async function onRequestGet({ request, env }) {
  if (!env.RAPIDAPI_KEY) {
    return new Response(JSON.stringify({ error: "RAPIDAPI_KEY no configurada" }), {
      status: 501,
      headers: { "content-type": "application/json" }
    });
  }

  const name = new URL(request.url).searchParams.get("name");
  if (!name) {
    return new Response(JSON.stringify({ error: "Falta el parámetro name" }), {
      status: 400,
      headers: { "content-type": "application/json" }
    });
  }

  const upstream = await fetch(
    `https://${EDB_HOST}/exercises/name/${encodeURIComponent(name)}?limit=1`,
    { headers: { "X-RapidAPI-Key": env.RAPIDAPI_KEY, "X-RapidAPI-Host": EDB_HOST } }
  );

  return new Response(upstream.body, {
    status: upstream.status,
    headers: { "content-type": "application/json" }
  });
}
