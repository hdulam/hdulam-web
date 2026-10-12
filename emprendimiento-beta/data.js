// Datos de prueba del prototipo. Los tres perfiles son ficticios.

const TARIFA_SINCV = 350; // USD, pago único y solo si la empresa contrata

const VACANTE = {
  titulo: "Analista de Datos Jr.",
  modalidad: "Remoto · LATAM",
  reto: "Ventas de una tienda en línea",
  duracion: "90 min",
  dataset: "12 400 pedidos en 6 tablas",
};

const RUBRICA = [
  { id: "sql", nombre: "Consultas SQL", peso: 30, desc: "JOINs, agregaciones y filtros correctos; consultas legibles." },
  { id: "limpieza", nombre: "Limpieza de datos", peso: 20, desc: "Detecta nulos, duplicados y atípicos, y explica qué hizo." },
  { id: "analisis", nombre: "Análisis", peso: 25, desc: "Responde la pregunta de negocio con conclusiones sustentadas." },
  { id: "viz", nombre: "Visualización", peso: 15, desc: "Gráfico adecuado al mensaje, ejes y etiquetas claras." },
  { id: "comunicacion", nombre: "Comunicación", peso: 10, desc: "Resumen breve y accionable para alguien no técnico." },
];

const PERFILES = [
  {
    id: "daniela",
    nombre: "Daniela Reyes",
    iniciales: "DR",
    color: "#d9603f",
    tinte: "#fbe9e3",
    ubicacion: "Tegucigalpa, Honduras",
    bandera: "HN",
    titular: "Analista de datos jr. · SQL y Power BI",
    acerca: "Trabajé cinco años en caja y como encargada de turno en un supermercado. Ahí empecé a usar los tickets para entender a qué hora entraba más gente, y terminé aprendiendo SQL y Power BI por mi cuenta. Busco mi primer trabajo formal en datos.",
    disponibilidad: "Inmediata",
    jornada: "Tiempo completo",
    idiomas: ["Español (nativo)", "Inglés (B1)"],
    salario: 1100,
    puntaje: 91,
    rubrica: { sql: 27, limpieza: 18, analisis: 24, viz: 13, comunicacion: 9 },
    habilidades: [
      { nombre: "SQL", nivel: 90 },
      { nombre: "Power BI", nivel: 86 },
      { nombre: "Excel", nivel: 92 },
      { nombre: "Comunicación", nivel: 88 },
    ],
    experiencia: [
      { puesto: "Encargada de turno", lugar: "Supermercado La Colonia", periodo: "2022 – 2026", desc: "Coordinaba a 8 cajeros y armaba los reportes de ventas diarias." },
      { puesto: "Cajera", lugar: "Supermercado La Colonia", periodo: "2021 – 2022", desc: "Atención al cliente y cierre de caja." },
    ],
    nota: "Encontró que el 18 % de los pedidos cancelados venían de un solo método de pago. Nadie más lo vio.",
    reto: {
      sql: `SELECT p.metodo_pago,
       COUNT(*) AS pedidos,
       ROUND(100.0 * SUM(CASE WHEN o.estado = 'cancelado'
                         THEN 1 ELSE 0 END) / COUNT(*), 1) AS pct_cancelado
FROM pedidos o
JOIN pagos p ON p.pedido_id = o.id
WHERE o.fecha >= '2025-01-01'
GROUP BY p.metodo_pago
ORDER BY pct_cancelado DESC;`,
      hallazgos: [
        "Transferencia bancaria concentra el 18 % de cancelaciones, el triple del promedio.",
        "Eliminó 214 pedidos duplicados por reintentos de pago antes de calcular.",
        "Recomendó un recordatorio automático a las 2 horas de un pago pendiente.",
      ],
      grafico: { titulo: "% de pedidos cancelados por método de pago", unidad: "%", datos: [["Transferencia", 18], ["Efectivo", 9], ["Tarjeta", 5], ["Billetera", 4]] },
    },
    proyecto: {
      nombre: "Turnos según la hora pico",
      resumen: "Con 8 meses de tickets de caja identificó las horas pico de cada día y propuso un nuevo esquema de turnos que la gerencia adoptó.",
      resultado: "−22 % de espera en caja",
      herramientas: ["SQLite", "Power BI", "Excel"],
    },
  },
  {
    id: "maria",
    nombre: "María José Coyoy",
    iniciales: "MC",
    color: "#2b6cb0",
    tinte: "#e3eefa",
    ubicacion: "Quetzaltenango, Guatemala",
    bandera: "GT",
    titular: "Analista de datos jr. · SQL, Python y limpieza de datos",
    acerca: "Llevé el inventario de la ferretería de mi familia durante seis años. Lo pasé de cuadernos a una hoja de cálculo y después a una base de datos. Me gusta que los números cuadren y entender por qué no cuadran.",
    disponibilidad: "En 2 semanas",
    jornada: "Tiempo completo",
    idiomas: ["Español (nativo)", "K'iche'", "Inglés (A2)"],
    salario: 950,
    puntaje: 88,
    rubrica: { sql: 26, limpieza: 19, analisis: 22, viz: 13, comunicacion: 8 },
    habilidades: [
      { nombre: "SQL", nivel: 87 },
      { nombre: "Limpieza de datos", nivel: 95 },
      { nombre: "Python", nivel: 78 },
      { nombre: "Excel", nivel: 90 },
    ],
    experiencia: [
      { puesto: "Encargada de inventario", lugar: "Ferretería Coyoy", periodo: "2020 – 2026", desc: "Control de 1 800 productos, compras a proveedores y conteos mensuales." },
    ],
    nota: "Fue la única que anotó por qué quitó cada fila. Su limpieza de datos fue la más cuidadosa del grupo.",
    reto: {
      sql: `WITH ventas_mes AS (
  SELECT c.nombre AS categoria,
         strftime('%Y-%m', o.fecha) AS mes,
         SUM(d.cantidad * d.precio_unit) AS ingreso
  FROM detalle_pedido d
  JOIN productos pr ON pr.id = d.producto_id
  JOIN categorias c ON c.id = pr.categoria_id
  JOIN pedidos o ON o.id = d.pedido_id
  WHERE o.estado = 'entregado'
  GROUP BY 1, 2
)
SELECT categoria, ROUND(AVG(ingreso), 0) AS ingreso_prom_mensual
FROM ventas_mes
GROUP BY categoria
ORDER BY ingreso_prom_mensual DESC;`,
      hallazgos: [
        "Hogar y Electrónica generan el 61 % del ingreso con solo el 30 % del catálogo.",
        "Detectó precios en dos monedas mezclados y los normalizó a USD.",
        "Sugirió revisar 40 productos sin ventas en 6 meses que ocupan stock.",
      ],
      grafico: { titulo: "Ingreso promedio mensual por categoría", unidad: "k USD", datos: [["Hogar", 42], ["Electrónica", 37], ["Moda", 21], ["Deportes", 14], ["Libros", 6]] },
    },
    proyecto: {
      nombre: "Inventario sin mercadería dormida",
      resumen: "Clasificó 1 800 productos con análisis ABC y encontró mercadería sin movimiento. La liquidaron y reinvirtieron en lo que más rota.",
      resultado: "Q 38 000 liberados de stock",
      herramientas: ["PostgreSQL", "Python · pandas", "Google Sheets"],
    },
  },
  {
    id: "luis",
    nombre: "Luis Fernando Ajú",
    iniciales: "LA",
    color: "#c48a12",
    tinte: "#fbf0d9",
    ubicacion: "Ciudad de Guatemala",
    bandera: "GT",
    titular: "Analista de datos jr. · Operaciones y logística",
    acerca: "Empecé como repartidor y terminé coordinando las rutas de la distribuidora. Aprendí SQL porque me cansé de armar los reportes a mano todos los lunes. Me interesa el análisis de operaciones.",
    disponibilidad: "Inmediata",
    jornada: "Medio tiempo o completo",
    idiomas: ["Español (nativo)", "Inglés (B2)"],
    salario: 850,
    puntaje: 82,
    rubrica: { sql: 25, limpieza: 15, analisis: 21, viz: 12, comunicacion: 9 },
    habilidades: [
      { nombre: "SQL", nivel: 83 },
      { nombre: "Looker Studio", nivel: 85 },
      { nombre: "Comunicación", nivel: 92 },
      { nombre: "Excel", nivel: 84 },
    ],
    experiencia: [
      { puesto: "Coordinador de rutas", lugar: "Distribuidora El Progreso", periodo: "2023 – 2026", desc: "Planificación diaria de rutas para 6 repartidores y reportes semanales." },
      { puesto: "Repartidor", lugar: "Distribuidora El Progreso", periodo: "2021 – 2023", desc: "Entregas en zona metropolitana." },
    ],
    nota: "Entregó el resumen más claro de todos: tres recomendaciones en media página.",
    reto: {
      sql: `SELECT e.zona,
       COUNT(*) AS entregas,
       ROUND(AVG(julianday(e.entregado_en)
                 - julianday(o.fecha)) * 24, 1) AS horas_prom
FROM envios e
JOIN pedidos o ON o.id = e.pedido_id
WHERE e.entregado_en IS NOT NULL
GROUP BY e.zona
HAVING COUNT(*) > 50
ORDER BY horas_prom DESC;`,
      hallazgos: [
        "La zona Norte tarda 2,3 veces más que el promedio en entregar.",
        "El 70 % del retraso ocurre antes del despacho, no en la ruta.",
        "Propuso separar la preparación de pedidos por zona.",
      ],
      grafico: { titulo: "Horas promedio de entrega por zona", unidad: "h", datos: [["Norte", 53], ["Oeste", 31], ["Centro", 22], ["Sur", 19]] },
    },
    proyecto: {
      nombre: "Rutas con menos vueltas",
      resumen: "Registró 3 meses de entregas y armó un tablero de tiempos por zona. Con eso reordenó las rutas del equipo.",
      resultado: "−15 % de kilómetros por semana",
      herramientas: ["MySQL", "Looker Studio", "Google Sheets"],
    },
  },
];

// Etapas del proceso de contratación
const ETAPAS = [
  { id: "solicitud", nombre: "Solicitud", desc: "Pediste conocer al candidato." },
  { id: "entrevista", nombre: "Entrevista", desc: "Agenda y realiza la entrevista." },
  { id: "oferta", nombre: "Oferta", desc: "Envía tu propuesta de salario y fecha de inicio." },
  { id: "contratado", nombre: "Contratación", desc: "Confirma y se cobra la tarifa." },
];
