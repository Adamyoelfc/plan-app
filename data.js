/* ====== DATOS DEL PLAN ======
   Dos bloques (A y B) que se alternan por semana.
   Cada ejercicio: nombre, edb (nombre en inglés para buscar el GIF en
   ExerciseDB), series, reps, prio (prioridad), alts (variantes con el botón ⇄).
   El primer elemento mostrado es el principal; ⇄ rota entre las alts. */

const BLOCKS = {
  A: {
    label: "Bloque A · Base (fuerza)",
    d1: { title:"Upper A", sub:"Fuerza — pesado y controlado", ex:[
      {sets:4,reps:"6-8",  alts:[{n:"Press de banca",e:"barbell bench press"},{n:"Press con mancuernas",e:"dumbbell bench press"},{n:"Fondos en paralelas",e:"chest dip"}]},
      {sets:4,reps:"8-10", alts:[{n:"Remo con barra",e:"barbell bent over row"},{n:"Remo en polea",e:"cable seated row"},{n:"Remo con mancuerna",e:"dumbbell bent over row"}]},
      {sets:3,reps:"8-10", alts:[{n:"Press militar",e:"barbell standing military press"},{n:"Press hombro con mancuernas",e:"dumbbell seated shoulder press"}]},
      {sets:4,reps:"8-12", prio:true, alts:[{n:"Jalón al pecho",e:"cable pulldown"},{n:"Dominadas",e:"pull up"}]},
      {sets:3,reps:"12-15",prio:true, alts:[{n:"Elevaciones laterales",e:"dumbbell lateral raise"},{n:"Elevaciones en polea",e:"cable lateral raise"}]},
      {sets:3,reps:"10-12", alts:[{n:"Press inclinado con mancuernas",e:"dumbbell incline bench press"},{n:"Press inclinado en máquina",e:"lever incline chest press"}]},
      {sets:3,reps:"10-12", alts:[{n:"Curl de bíceps",e:"dumbbell biceps curl"},{n:"Curl con barra",e:"barbell curl"}]},
      {sets:3,reps:"10-12", alts:[{n:"Extensión de tríceps en polea",e:"cable pushdown"},{n:"Press francés",e:"barbell lying triceps extension"}]}
    ]},
    d2: { title:"Lower A", sub:"Piernas y core", ex:[
      {sets:4,reps:"6-8",  alts:[{n:"Sentadilla con barra",e:"barbell full squat"},{n:"Sentadilla goblet",e:"dumbbell goblet squat"}]},
      {sets:3,reps:"8-10", alts:[{n:"Peso muerto rumano",e:"barbell romanian deadlift"},{n:"Buenos días",e:"barbell good morning"}]},
      {sets:3,reps:"10-12",alts:[{n:"Prensa de piernas",e:"sled 45 leg press"},{n:"Sentadilla hack",e:"sled hack squat"}]},
      {sets:3,reps:"10-12",alts:[{n:"Curl femoral en máquina",e:"lever seated leg curl"},{n:"Curl femoral acostado",e:"lever lying leg curl"}]},
      {sets:4,reps:"12-15",alts:[{n:"Elevación de pantorrilla de pie",e:"lever standing calf raise"},{n:"Pantorrilla en prensa",e:"sled calf press on leg press"}]},
      {sets:3,reps:"10-15",core:true, alts:[{n:"Elevación de piernas colgado",e:"hanging leg raise"},{n:"Rueda abdominal",e:"wheel rollout"}]}
    ]},
    d3: { title:"Upper B", sub:"Hipertrofia — más volumen", ex:[
      {sets:4,reps:"8-12", prio:true, alts:[{n:"Dominadas o jalón",e:"pull up"},{n:"Jalón agarre neutro",e:"cable pulldown"}]},
      {sets:3,reps:"8-10", alts:[{n:"Press inclinado con mancuernas",e:"dumbbell incline bench press"},{n:"Press inclinado con barra",e:"barbell incline bench press"}]},
      {sets:4,reps:"12-15",prio:true, alts:[{n:"Elevaciones laterales",e:"dumbbell lateral raise"},{n:"Elevaciones en polea",e:"cable lateral raise"}]},
      {sets:3,reps:"10-12",alts:[{n:"Remo con apoyo en banco",e:"dumbbell incline row"},{n:"Remo en máquina",e:"lever seated row"}]},
      {sets:3,reps:"10-12",alts:[{n:"Press de hombro con mancuernas",e:"dumbbell seated shoulder press"},{n:"Press Arnold",e:"dumbbell arnold press"}]},
      {sets:3,reps:"12-15",alts:[{n:"Face pulls",e:"cable face pull"},{n:"Pájaros (reverse fly)",e:"dumbbell rear lateral raise"}]},
      {sets:3,reps:"10-12",alts:[{n:"Curl martillo",e:"dumbbell hammer curl"},{n:"Curl en banco inclinado",e:"dumbbell incline biceps curl"}]},
      {sets:3,reps:"10-12",alts:[{n:"Extensión de tríceps sobre la cabeza",e:"dumbbell seated triceps extension"},{n:"Fondos en máquina",e:"lever triceps dip"}]}
    ]},
    d4: { title:"Lower B", sub:"Piernas y core", ex:[
      {sets:3,reps:"5-6",  alts:[{n:"Peso muerto",e:"barbell deadlift"},{n:"Peso muerto trap bar",e:"trap bar deadlift"}]},
      {sets:3,reps:"8-10", alts:[{n:"Sentadilla goblet o frontal",e:"barbell front squat"},{n:"Sentadilla goblet",e:"dumbbell goblet squat"}]},
      {sets:3,reps:"10-12 c/pierna",alts:[{n:"Sentadilla búlgara",e:"dumbbell bulgarian split squat"},{n:"Zancadas caminando",e:"dumbbell walking lunge"}]},
      {sets:3,reps:"12-15",alts:[{n:"Extensión de cuádriceps",e:"lever leg extension"}]},
      {sets:4,reps:"12-15",alts:[{n:"Pantorrilla sentado",e:"lever seated calf raise"},{n:"Pantorrilla de pie",e:"lever standing calf raise"}]},
      {sets:3,reps:"12-15",core:true, alts:[{n:"Crunch en polea",e:"cable kneeling crunch"},{n:"Crunch en máquina",e:"lever seated crunch"}]},
      {sets:3,reps:"30-60s",core:true, alts:[{n:"Plancha",e:"front plank"},{n:"Plancha con peso",e:"weighted front plank"}]}
    ]}
  },

  B: {
    label: "Bloque B · Variación (hipertrofia)",
    d1: { title:"Upper A", sub:"Variación — mancuernas y máquinas", ex:[
      {sets:4,reps:"8-10", alts:[{n:"Press inclinado con barra",e:"barbell incline bench press"},{n:"Press inclinado mancuernas",e:"dumbbell incline bench press"}]},
      {sets:4,reps:"10-12",alts:[{n:"Remo en polea",e:"cable seated row"},{n:"Remo en máquina",e:"lever seated row"}]},
      {sets:3,reps:"10-12",alts:[{n:"Press hombro con mancuernas",e:"dumbbell seated shoulder press"},{n:"Press Arnold",e:"dumbbell arnold press"}]},
      {sets:4,reps:"10-12",prio:true, alts:[{n:"Jalón agarre neutro",e:"cable pulldown"},{n:"Dominadas asistidas",e:"assisted pull up"}]},
      {sets:4,reps:"12-15",prio:true, alts:[{n:"Elevaciones en polea",e:"cable lateral raise"},{n:"Elevaciones laterales",e:"dumbbell lateral raise"}]},
      {sets:3,reps:"12-15",alts:[{n:"Aperturas en máquina (pec deck)",e:"lever pec deck fly"},{n:"Aperturas en polea",e:"cable cross over"}]},
      {sets:3,reps:"10-12",alts:[{n:"Curl predicador",e:"barbell preacher curl"},{n:"Curl martillo",e:"dumbbell hammer curl"}]},
      {sets:3,reps:"10-12",alts:[{n:"Extensión tríceps sobre la cabeza",e:"cable overhead triceps extension"},{n:"Press francés",e:"barbell lying triceps extension"}]}
    ]},
    d2: { title:"Lower A", sub:"Variación — máquinas y unilateral", ex:[
      {sets:4,reps:"10-12",alts:[{n:"Sentadilla hack",e:"sled hack squat"},{n:"Prensa de piernas",e:"sled 45 leg press"}]},
      {sets:3,reps:"10-12",alts:[{n:"Peso muerto rumano mancuernas",e:"dumbbell romanian deadlift"},{n:"Peso muerto rumano barra",e:"barbell romanian deadlift"}]},
      {sets:3,reps:"12 c/pierna",alts:[{n:"Zancadas caminando",e:"dumbbell walking lunge"},{n:"Sentadilla búlgara",e:"dumbbell bulgarian split squat"}]},
      {sets:3,reps:"10-12",alts:[{n:"Curl femoral sentado",e:"lever seated leg curl"},{n:"Curl femoral acostado",e:"lever lying leg curl"}]},
      {sets:4,reps:"12-15",alts:[{n:"Pantorrilla de pie",e:"lever standing calf raise"},{n:"Pantorrilla en prensa",e:"sled calf press on leg press"}]},
      {sets:3,reps:"10-12",core:true, alts:[{n:"Rueda abdominal",e:"wheel rollout"},{n:"Elevación de piernas colgado",e:"hanging leg raise"}]}
    ]},
    d3: { title:"Upper B", sub:"Variación — enfoque espalda/hombro", ex:[
      {sets:4,reps:"10-12",prio:true, alts:[{n:"Remo en máquina",e:"lever seated row"},{n:"Remo en polea",e:"cable seated row"}]},
      {sets:3,reps:"10-12",alts:[{n:"Press banca con mancuernas",e:"dumbbell bench press"},{n:"Press en máquina",e:"lever chest press"}]},
      {sets:4,reps:"12-15",prio:true, alts:[{n:"Elevaciones laterales sentado",e:"dumbbell seated lateral raise"},{n:"Elevaciones en polea",e:"cable lateral raise"}]},
      {sets:3,reps:"10-12",alts:[{n:"Jalón agarre cerrado",e:"cable pulldown"},{n:"Dominadas agarre supino",e:"chin up"}]},
      {sets:3,reps:"10-12",alts:[{n:"Press Arnold",e:"dumbbell arnold press"},{n:"Press hombro en máquina",e:"lever shoulder press"}]},
      {sets:3,reps:"12-15",alts:[{n:"Face pulls",e:"cable face pull"},{n:"Pájaros (reverse fly)",e:"dumbbell rear lateral raise"}]},
      {sets:3,reps:"10-12",alts:[{n:"Curl martillo",e:"dumbbell hammer curl"},{n:"Curl con barra",e:"barbell curl"}]},
      {sets:3,reps:"10-12",alts:[{n:"Fondos en máquina",e:"lever triceps dip"},{n:"Extensión tríceps en polea",e:"cable pushdown"}]}
    ]},
    d4: { title:"Lower B", sub:"Variación — cuádriceps y core", ex:[
      {sets:4,reps:"6-8",  alts:[{n:"Peso muerto trap bar",e:"trap bar deadlift"},{n:"Peso muerto",e:"barbell deadlift"}]},
      {sets:3,reps:"8-10", alts:[{n:"Sentadilla frontal",e:"barbell front squat"},{n:"Sentadilla goblet",e:"dumbbell goblet squat"}]},
      {sets:3,reps:"12 c/pierna",alts:[{n:"Búlgara con mancuernas",e:"dumbbell bulgarian split squat"},{n:"Zancadas",e:"dumbbell walking lunge"}]},
      {sets:3,reps:"12-15",alts:[{n:"Extensión de cuádriceps",e:"lever leg extension"}]},
      {sets:4,reps:"12-15",alts:[{n:"Pantorrilla sentado",e:"lever seated calf raise"},{n:"Pantorrilla de pie",e:"lever standing calf raise"}]},
      {sets:3,reps:"12-15",core:true, alts:[{n:"Crunch en polea",e:"cable kneeling crunch"},{n:"Crunch en máquina",e:"lever seated crunch"}]},
      {sets:3,reps:"30-60s",core:true, alts:[{n:"Plancha",e:"front plank"},{n:"Plancha lateral",e:"side plank"}]}
    ]}
  }
};

const WEEK = [["Lunes","Upper A",1],["Martes","Lower A",1],["Miércoles","Cardio LISS 30 min",1],
["Jueves","Upper B",1],["Viernes","Lower B",1],["Sábado","Cardio LISS o HIIT",1],["Domingo","Descanso total",0]];

const FOODS = [
  {n:"Scoop proteína",p:25,c:120},{n:"Pechuga pollo 150g",p:46,c:250},
  {n:"2 huevos",p:12,c:140},{n:"Carne molida magra 150g",p:35,c:290},
  {n:"Atún (1 lata)",p:27,c:130},{n:"Yogur griego 1 taza",p:20,c:130},
  {n:"Arroz cocido 1 taza",p:4,c:205},{n:"Frijoles 1 taza",p:15,c:220},
  {n:"Avena 1 taza",p:11,c:300},{n:"Plátano",p:1,c:105}
];
