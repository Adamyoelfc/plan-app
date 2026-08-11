/* ====== CONFIGURACIÓN ======
   La API key de ExerciseDB (RapidAPI) NO va aquí: vive como variable de
   entorno "RAPIDAPI_KEY" en Cloudflare Pages y la lee la Function en
   functions/api/exercise.js. Ver README para más detalle. */
const CONFIG = {
  PRO_TARGET: 150,                          // gramos de proteína al día
  CAL_TARGET: 2040                          // calorías al día
};
