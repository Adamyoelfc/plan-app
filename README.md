# Plan App

Web personal de entrenamiento y nutrición: plan Upper/Lower de 4 días + cardio, seguimiento de series con doble progresión, timer de descanso, y control diario de proteína/calorías. Todo el estado (series marcadas, comida registrada, bloque activo) se guarda en `localStorage` del navegador.

Sitio estático sin build ni frameworks — HTML/CSS/JS puro — desplegado en **Cloudflare Pages**.

## Estructura

```
index.html   Markup y estructura de las pestañas (Semana, Días, Cardio, Comida)
styles.css   Estilos
data.js      Datos del plan: bloques, días, ejercicios, alimentos
config.js    Config no sensible (metas de proteína/calorías)
app.js       Lógica: render, series, timer de descanso, tracking de comida, GIFs de ejercicios
functions/api/exercise.js   Cloudflare Pages Function: proxy hacia ExerciseDB (RapidAPI)
```

## La API key de ExerciseDB (RapidAPI)

La app puede mostrar el GIF de cada ejercicio usando la API de [ExerciseDB en RapidAPI](https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb). Esa API requiere una key privada.

Como este es un sitio **estático** (sin backend propio), si la key se pusiera en `config.js` o en cualquier archivo `.js` que se sirve al navegador, cualquiera podría abrir las herramientas de desarrollador y copiarla — **no importa si el archivo está o no en el repo de GitHub**, el navegador la expone igual en cuanto la usa.

La forma correcta de resolver esto es que la key nunca llegue al navegador: se guarda como variable de entorno en Cloudflare, y una **Cloudflare Pages Function** (código que corre en el servidor de Cloudflare, no en el navegador) la usa para llamar a RapidAPI en nombre del cliente.

### Cómo está montado

1. `functions/api/exercise.js` es una Pages Function. Cloudflare la sirve automáticamente en `/api/exercise` — no requiere configuración extra ni build step.
2. El frontend (`app.js`) llama a `/api/exercise?name=...` en vez de llamar directo a RapidAPI.
3. La Function lee `env.RAPIDAPI_KEY` (una variable de entorno del lado del servidor) y hace la llamada real a `https://exercisedb.p.rapidapi.com/...` agregando el header `X-RapidAPI-Key`.
4. La key nunca aparece en el HTML/JS que se descarga al navegador, ni en las pestañas de Network del navegador, ni en el repo.

### Configurar la key en Cloudflare

En el dashboard de Cloudflare:

1. **Workers & Pages** → selecciona este proyecto (Pages).
2. **Settings** → **Environment variables**.
3. Agrega una variable:
   - Nombre: `RAPIDAPI_KEY`
   - Valor: tu API key de RapidAPI
   - Tipo: **Secret** (encriptada, no visible después de guardarla)
   - Aplica tanto a **Production** como a **Preview** si quieres que funcione en ambos.
4. Guarda y vuelve a desplegar (o espera al próximo deploy) para que la Function tenga acceso a la variable.

Si la variable no está configurada, `/api/exercise` responde con un error controlado y la app cae automáticamente al botón "Ver en video ▶" (nunca se rompe).

### Desarrollo local

Para probar las Functions localmente (no solo el estático) se usa [Wrangler](https://developers.cloudflare.com/workers/wrangler/):

```bash
npx wrangler pages dev . --binding RAPIDAPI_KEY=tu_key_aqui
```

O crea un archivo `.dev.vars` (que **no** se sube al repo — agrégalo a `.gitignore`) con:

```
RAPIDAPI_KEY=tu_key_aqui
```

y corre:

```bash
npx wrangler pages dev .
```

## Deploy

El proyecto se despliega en Cloudflare Pages conectado a este repositorio. Cada push a `main` dispara un nuevo deploy automáticamente; no hay paso de build (Build command vacío, Build output directory = `/`).
