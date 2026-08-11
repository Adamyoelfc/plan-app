// Cloudflare Pages Function: proxy hacia el endpoint de imagen de ExerciseDB.
// ExerciseDB ya no devuelve "gifUrl" en /exercises/name/... — el GIF se pide
// aparte con el id del ejercicio en este endpoint, que devuelve el binario.
// El <img> del frontend apunta directo a /api/exercise-image?id=..., y esta
// Function reenvía el request a RapidAPI agregando la key del lado servidor.

const EDB_HOST = "exercisedb.p.rapidapi.com";

export async function onRequestGet({ request, env }) {
  if (!env.RAPIDAPI_KEY) {
    return new Response("RAPIDAPI_KEY no configurada", { status: 501 });
  }

  const params = new URL(request.url).searchParams;
  const id = params.get("id");
  const resolution = params.get("resolution") || "180";
  if (!id) {
    return new Response("Falta el parámetro id", { status: 400 });
  }

  const upstream = await fetch(
    `https://${EDB_HOST}/image?exerciseId=${encodeURIComponent(id)}&resolution=${encodeURIComponent(resolution)}`,
    { headers: { "X-RapidAPI-Key": env.RAPIDAPI_KEY, "X-RapidAPI-Host": EDB_HOST } }
  );

  return new Response(upstream.body, {
    status: upstream.status,
    headers: { "content-type": upstream.headers.get("content-type") || "image/gif" }
  });
}
