// SinCV · prototipo sin backend. Todo vive en este navegador (localStorage).
const $ = (s, r = document) => r.querySelector(s);
const app = $("#app");
const modal = $("#modal");

/* ============ Estado ============ */
const KEY = "sincv-proto-v3";
const VACIO = () => ({ usuario: null, procesos: {}, guardados: [] });
const estado = (() => {
  try { return JSON.parse(localStorage.getItem(KEY)) || VACIO(); } catch { return VACIO(); }
})();
function guardar() {
  try { localStorage.setItem(KEY, JSON.stringify(estado)); } catch { /* modo privado: sigue en memoria */ }
}

/* ============ Utilidades ============ */
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const usd = (n) => "USD " + Math.round(n).toLocaleString("es-GT");
const perfil = (id) => PERFILES.find((p) => p.id === id);
const primerNombre = (p) => p.nombre.split(" ")[0] === "María" ? "María José" : p.nombre.split(" ")[0];
const hoyISO = () => new Date().toISOString().slice(0, 10);
const fechaLarga = (iso) => new Date(iso + "T12:00").toLocaleDateString("es", { weekday: "long", day: "numeric", month: "long" });
const fechaCorta = (t) => new Date(t).toLocaleDateString("es", { day: "numeric", month: "short" });
const AGENCIA = 0.18; // comisión típica de agencia sobre salario anual
const costoAnual = (salario) => salario * 12 + TARIFA_SINCV;

const I = {
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  flow: '<rect x="3" y="4" width="5" height="16" rx="1.5"/><rect x="10" y="4" width="5" height="10" rx="1.5"/><rect x="17" y="4" width="4" height="6" rx="1.5"/>',
  out: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  right: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  left: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
  mark: '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  money: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  video: '<path d="m22 8-6 4 6 4V8Z"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
  code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
  chart: '<path d="M3 3v18h18"/><path d="M8 17v-4M13 17V8M18 17v-7"/>',
  award: '<circle cx="12" cy="8" r="6"/><path d="M8.2 13.2 7 22l5-3 5 3-1.2-8.8"/>',
  doc: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
  party: '<path d="M5.8 11.3 2 22l10.7-3.8"/><path d="M4 3h.01M22 8h.01M15 2h.01M22 20h.01M22 2l-2.2.7a2 2 0 0 0-1.3 2.4c.2.8-.4 1.6-1.2 1.6h-.6c-.9 0-1.6.6-1.8 1.4L14 9"/><path d="m22 13-.8-.3c-.9-.3-1.8.3-1.9 1.2-.1.7-.7 1.1-1.3 1.1H17M11 2l.3.8c.3.9-.3 1.8-1.2 1.9-.7.1-1.1.7-1.1 1.3V7"/><path d="M11 13c1.9 1.9 2.8 4.1 2 4.9-.8.8-3-.1-4.9-2-1.9-1.9-2.8-4.1-2-4.9.8-.8 3 .1 4.9 2Z"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
};
const ic = (n, cls = "") => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${I[n]}</svg>`;

const logo = (href = "#/") => `<a href="${href}" class="logo" aria-label="SinCV, inicio"><span class="logo-sin">Sin</span><span class="logo-cv">CV</span></a>`;
const avatar = (p, size = "md") => `<span class="av av-${size}" style="--c:${p.color};--t:${p.tinte}">${p.iniciales}</span>`;
const verificado = (txt = "Verificado") => `<span class="verif">${ic("shield")}${txt}</span>`;

function toast(msg) {
  const t = $("#toast");
  t.innerHTML = `${ic("check")}<span>${esc(msg)}</span>`;
  t.classList.add("on");
  clearTimeout(toast.t);
  toast.t = setTimeout(() => t.classList.remove("on"), 2600);
}

function abrirModal(html) {
  modal.innerHTML = `<div class="m-fondo" data-cerrar><div class="m-caja" role="dialog" aria-modal="true">
    <button class="m-x" data-cerrar aria-label="Cerrar">${ic("x")}</button>${html}</div></div>`;
  const primero = modal.querySelector("input, select, textarea, button:not(.m-x)");
  if (primero) primero.focus();
}
const cerrarModal = () => (modal.innerHTML = "");

function barras({ titulo, unidad, datos }, color) {
  const max = Math.max(...datos.map((d) => d[1]));
  return `<figure class="graf">
    <figcaption>${esc(titulo)}</figcaption>
    ${datos.map(([k, v]) => `<div class="graf-f"><span>${esc(k)}</span>
      <span class="graf-b"><i style="width:${(v / max) * 100}%;background:${v === max ? color : "#c9cdc6"}"></i></span>
      <b>${v}${unidad === "%" ? "%" : " " + esc(unidad)}</b></div>`).join("")}
  </figure>`;
}

function sql(code) {
  const kw = /\b(SELECT|FROM|JOIN|ON|WHERE|GROUP BY|ORDER BY|HAVING|AS|AND|OR|CASE|WHEN|THEN|ELSE|END|WITH|DESC|ASC|IS NOT NULL|COUNT|SUM|AVG|ROUND|strftime|julianday)\b/g;
  const tok = new RegExp(`('[^']*')|${kw.source}|\\b(\\d+(?:\\.\\d+)?)\\b`, "g");
  let out = "", last = 0;
  for (const m of code.matchAll(tok)) {
    out += esc(code.slice(last, m.index)) + `<span class="${m[1] ? "s" : m[2] ? "k" : "n"}">${esc(m[0])}</span>`;
    last = m.index + m[0].length;
  }
  return out + esc(code.slice(last));
}

/* ============ Proceso de contratación ============ */
function etiquetaEtapa(proc) {
  if (!proc) return null;
  const map = {
    solicitud: ["Solicitud enviada", "e-azul"],
    entrevista: [proc.entrevista ? "Entrevista agendada" : "Agendar entrevista", "e-ambar"],
    oferta: [proc.oferta ? "Oferta enviada" : "Preparar oferta", "e-morado"],
    contratado: [proc.confirmado ? "Contratado" : "Oferta aceptada", "e-verde"],
    descartado: ["Descartado", "e-gris"],
  };
  const [txt, cls] = map[proc.etapa];
  return `<span class="etapa ${cls}">${txt}</span>`;
}

function proximaAccion(proc) {
  const n = primerNombre(perfil(proc.candidato));
  switch (proc.etapa) {
    case "solicitud": return `Esperando que ${n} confirme`;
    case "entrevista": return proc.entrevista ? `Entrevista el ${fechaLarga(proc.entrevista.fecha)}` : "Elige fecha para la entrevista";
    case "oferta": return proc.oferta ? `Esperando respuesta de ${n}` : "Envía tu propuesta";
    case "contratado": return proc.confirmado ? `Empieza el ${fechaLarga(proc.oferta.inicio)}` : "Confirma la contratación";
    default: return proc.motivo || "";
  }
}

function anotar(proc, texto) { proc.historial.push({ t: Date.now(), texto }); }

function crearProceso(id, vacante, mensaje) {
  const proc = { candidato: id, vacante, mensaje, etapa: "solicitud", inicio: Date.now(), historial: [] };
  anotar(proc, `Solicitaste conocer a ${primerNombre(perfil(id))} para ${vacante}`);
  estado.procesos[id] = proc;
  guardar();
}

const procesosActivos = () => Object.values(estado.procesos).filter((p) => p.etapa !== "descartado");

/* ============ Landing ============ */
function vistaLanding() {
  const d = PERFILES[0];
  return `
  <header class="pub-top">
    <div class="wrap pub-top-in">
      ${logo()}
      <nav class="pub-nav">
        <a href="#/" data-ir="como">Cómo funciona</a>
        <a href="#/" data-ir="perfil">Perfiles</a>
        <a href="#/" data-ir="precios">Precios</a>
        <a href="#/" data-ir="faq">Preguntas</a>
      </nav>
      <div class="pub-acc">
        <a href="#/ingresar" class="btn btn-txt">Ingresar</a>
        <a href="#/ingresar?rol=empresa" class="btn btn-pri">Buscar talento</a>
      </div>
    </div>
  </header>

  <section class="hero">
    <div class="wrap hero-in">
      <div class="hero-txt">
        <p class="hero-pre">${ic("shield")} Habilidades probadas en retos reales</p>
        <h1>Contrata por lo que saben hacer, <span class="tachado">no por su CV</span>.</h1>
        <p class="hero-sub">SinCV conecta a empresas con talento latinoamericano que aprendió por su cuenta. Cada persona resuelve un reto práctico y tú ves su trabajo, su puntaje y cuánto cuesta contratarla antes de la primera llamada.</p>
        <div class="hero-cta">
          <a href="#/ingresar?rol=empresa" class="btn btn-pri btn-lg">Soy empresa ${ic("right")}</a>
          <a href="#/ingresar?rol=candidato" class="btn btn-sec btn-lg">Busco empleo</a>
        </div>
        <ul class="hero-pts">
          <li>${ic("check")} Gratis hasta que contrates</li>
          <li>${ic("check")} Presentación en menos de 48 h</li>
        </ul>
      </div>

      <div class="hero-vis" aria-hidden="true">
        <div class="demo-card">
          <div class="demo-cover" style="--c:${d.color}"></div>
          <div class="demo-body">
            ${avatar(d, "lg")}
            <div class="demo-name"><b>${d.nombre}</b> ${verificado()}</div>
            <p class="demo-tit">${d.titular}</p>
            <div class="demo-skills">
              ${d.habilidades.slice(0, 3).map((h) => `<div><span>${h.nombre}</span><i><b style="width:${h.nivel}%"></b></i><em>${h.nivel}</em></div>`).join("")}
            </div>
            <div class="demo-foot">
              <div><small>Reto SQL</small><strong>${d.puntaje}<span>/100</span></strong></div>
              <div><small>Salario esperado</small><strong>${usd(d.salario)}<span>/mes</span></strong></div>
            </div>
          </div>
        </div>
        <div class="demo-noti">
          <span class="noti-ic">${ic("cal")}</span>
          <div><b>Entrevista agendada</b><small>con María José · jueves 10:00</small></div>
        </div>
        <div class="demo-chip">${ic("award")} Top 10 % en SQL</div>
      </div>
    </div>
  </section>

  <section class="sec" id="como">
    <div class="wrap">
      <h2 class="sec-tit">Cómo funciona</h2>
      <div class="dos">
        <div class="lado-a">
          <h3><span class="tag tag-verde">Para empresas</span></h3>
          <ol class="pasos">
            <li><b>Revisa perfiles con evidencia.</b> Consulta SQL, gráfico, hallazgos y puntaje por criterio.</li>
            <li><b>Compara costos.</b> Ves el salario esperado y la tarifa desde el principio.</li>
            <li><b>Inicia el proceso.</b> Solicitud, entrevista, oferta y contratación en un solo lugar.</li>
          </ol>
        </div>
        <div class="lado-b">
          <h3><span class="tag tag-ambar">Para candidatos</span></h3>
          <ol class="pasos">
            <li><b>Crea tu cuenta sin CV.</b> Solo cuéntanos qué sabes hacer.</li>
            <li><b>Resuelve un reto.</b> 90 minutos con datos reales, revisado por dos personas.</li>
            <li><b>Recibe propuestas.</b> Las empresas te encuentran por tu trabajo, no por tu título.</li>
          </ol>
        </div>
      </div>
    </div>
  </section>

  <section class="sec sec-alt" id="perfil">
    <div class="wrap">
      <h2 class="sec-tit">Así se ve un perfil por dentro</h2>
      <p class="sec-sub">Esto entregó ${primerNombre(d)} en el reto de ventas. Es lo mismo que verás tú.</p>
      <div class="muestra">
        <div class="code"><div class="code-h">${ic("code")} consulta.sql</div><pre><code>${sql(d.reto.sql)}</code></pre></div>
        <div class="muestra-der">
          ${barras(d.reto.grafico, d.color)}
          <div class="mini-rub">
            ${RUBRICA.map((r) => `<div><span>${r.nombre}</span><b>${d.rubrica[r.id]}<small>/${r.peso}</small></b></div>`).join("")}
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="sec" id="precios">
    <div class="wrap precios">
      <div>
        <h2 class="sec-tit">Pagas solo si contratas</h2>
        <p class="sec-sub">Ver perfiles, pedir presentaciones y entrevistar no cuesta nada. Cuando confirmas una contratación cobramos una tarifa única.</p>
        <ul class="lista-check">
          <li>${ic("check")} Perfiles con habilidades verificadas</li>
          <li>${ic("check")} Coordinación de entrevistas</li>
          <li>${ic("check")} Reemplazo sin costo si no funciona en 60 días</li>
        </ul>
      </div>
      <div class="precio-card">
        <small>Tarifa por contratación</small>
        <p class="precio">${usd(TARIFA_SINCV)}</p>
        <p class="precio-nota">Pago único. Sin suscripción.</p>
        <div class="vs">
          <div><span>Agencia tradicional</span><b>~${usd(d.salario * 12 * AGENCIA)}</b></div>
          <div><span>SinCV</span><b>${usd(TARIFA_SINCV)}</b></div>
          <p>Ejemplo con un salario de ${usd(d.salario)} al mes y una comisión de agencia del 18 % anual.</p>
        </div>
        <a href="#/ingresar?rol=empresa" class="btn btn-pri btn-blk">Ver candidatos</a>
      </div>
    </div>
  </section>

  <section class="sec sec-alt" id="faq">
    <div class="wrap faq">
      <h2 class="sec-tit">Preguntas frecuentes</h2>
      <details><summary>¿Qué significa "verificado"?</summary><p>Que la persona resolvió nuestro reto práctico y dos revisores lo puntuaron por separado con la misma rúbrica. No verificamos títulos ni referencias.</p></details>
      <details><summary>¿Cómo contrato a alguien de otro país?</summary><p>La mayoría trabaja como contratista remoto. Te orientamos con el contrato y el pago durante el proceso.</p></details>
      <details><summary>¿Los candidatos pagan algo?</summary><p>No. Para los candidatos SinCV es gratis.</p></details>
      <details><summary>¿Qué pasa si la contratación no funciona?</summary><p>Si la persona deja el puesto en los primeros 60 días, te presentamos a otra sin costo.</p></details>
    </div>
  </section>

  <section class="cta-final">
    <div class="wrap cta-in">
      <h2>Tres analistas verificados te están esperando.</h2>
      <a href="#/ingresar?rol=empresa" class="btn btn-amb btn-lg">Entrar como empresa ${ic("right")}</a>
    </div>
  </section>

  <footer class="pub-pie">
    <div class="wrap pie-in">
      ${logo()}
      <p>Prototipo del Equipo 6 · Emprendimiento e Innovación, 2026. Los perfiles son de prueba.</p>
    </div>
  </footer>`;
}

/* ============ Login ============ */
function panelLogin(rol) {
  return rol === "empresa"
    ? `<h2>Tu próximo analista ya demostró lo que sabe.</h2>
       <div class="login-lista">${PERFILES.map((p) => `<div class="ll">${avatar(p, "sm")}<div><b>${p.nombre}</b><small>${p.ubicacion}</small></div><span class="pts">${p.puntaje}</span></div>`).join("")}</div>`
    : `<h2>Tu trabajo habla por ti.</h2>
       <ul class="login-pts"><li>${ic("check")} Sin CV ni títulos</li><li>${ic("check")} Un reto práctico de 90 minutos</li><li>${ic("check")} Empresas que te buscan por tus habilidades</li></ul>`;
}

function vistaLogin(q) {
  const rol = q.get("rol") === "candidato" ? "candidato" : "empresa";
  return `
  <div class="login">
    <div class="login-form">
      ${logo()}
      <div class="login-box">
        <h1>Ingresa a SinCV</h1>
        <p class="gris">Elige cómo quieres usar la plataforma.</p>
        <form id="f-login" novalidate>
          <div class="seg" role="radiogroup" aria-label="Tipo de cuenta">
            <label><input type="radio" name="rol" value="empresa" ${rol === "empresa" ? "checked" : ""}><span>${ic("users")} Quiero contratar</span></label>
            <label><input type="radio" name="rol" value="candidato" ${rol === "candidato" ? "checked" : ""}><span>${ic("award")} Busco empleo</span></label>
          </div>
          <label class="campo">Correo<input type="email" name="email" placeholder="${rol === "empresa" ? "laura@andinapay.com" : "tu@correo.com"}" autocomplete="username"></label>
          <label class="campo">Contraseña<input type="password" name="clave" placeholder="••••••••" autocomplete="current-password"></label>
          <button class="btn btn-pri btn-blk btn-lg" type="submit">Ingresar</button>
        </form>
        <p class="aviso">Prototipo: cualquier correo y contraseña funcionan.</p>
        <a href="#/" class="volver">${ic("left")} Volver al inicio</a>
      </div>
    </div>
    <aside class="login-panel ${rol}" id="login-panel">${panelLogin(rol)}</aside>
  </div>`;
}

function nombreDesdeCorreo(email) {
  const local = (email.split("@")[0] || "").replace(/[0-9]/g, "");
  const partes = local.split(/[._-]+/).filter(Boolean);
  if (!partes.length) return "Invitado";
  return partes.slice(0, 2).map((s) => s[0].toUpperCase() + s.slice(1)).join(" ");
}
function empresaDesdeCorreo(email) {
  const dom = (email.split("@")[1] || "").split(".")[0];
  if (!dom || /^(gmail|hotmail|outlook|yahoo|icloud|live)$/i.test(dom)) return "Tu empresa";
  return dom[0].toUpperCase() + dom.slice(1);
}

/* ============ Portal de empresa ============ */
function shell(activo, contenido) {
  const u = estado.usuario;
  const n = procesosActivos().length;
  const link = (id, href, icono, txt, extra = "") =>
    `<a href="${href}" class="${activo === id ? "on" : ""}">${ic(icono)}<span>${txt}</span>${extra}</a>`;
  return `
  <div class="portal">
    <aside class="side">
      <div class="side-top">${logo("#/portal")}<span class="side-emp">${esc(u.empresa)}</span></div>
      <nav class="side-nav">
        ${link("inicio", "#/portal", "home", "Inicio")}
        ${link("candidatos", "#/portal/candidatos", "users", "Candidatos")}
        ${link("procesos", "#/portal/procesos", "flow", "Contratación", n ? `<em class="cuenta">${n}</em>` : "")}
      </nav>
      <div class="side-pie">
        <div class="side-tarifa">${ic("money")}<div><b>${usd(TARIFA_SINCV)}</b><small>por contratación, solo si contratas</small></div></div>
        <div class="side-user">
          <span class="av av-sm av-u">${esc(u.nombre.split(" ").map((s) => s[0]).join("").slice(0, 2))}</span>
          <div><b>${esc(u.nombre)}</b><small>${esc(u.email || "Reclutador/a")}</small></div>
          <button class="ic-btn" data-accion="salir" title="Cerrar sesión" aria-label="Cerrar sesión">${ic("out")}</button>
        </div>
        <button class="lnk-reset" data-accion="reiniciar">Reiniciar demo</button>
      </div>
    </aside>
    <main class="main">${contenido}</main>
  </div>`;
}

function filaCandidato(p) {
  const proc = estado.procesos[p.id];
  return `<a class="fila-c" href="#/portal/candidato/${p.id}">
    ${avatar(p)}
    <div class="fc-q"><b>${p.nombre}</b><small>${p.titular.split(" · ")[1] || p.titular}</small></div>
    <div class="fc-n"><small>Reto</small><b>${p.puntaje}</b></div>
    <div class="fc-n"><small>Salario</small><b>${usd(p.salario)}</b></div>
    <div class="fc-e">${etiquetaEtapa(proc) || `<span class="ver">Ver perfil ${ic("right")}</span>`}</div>
  </a>`;
}

function vistaPortalInicio() {
  const u = estado.usuario;
  const activos = procesosActivos();
  const entrevistas = activos.filter((p) => p.etapa === "entrevista" && p.entrevista).length;
  const contratados = activos.filter((p) => p.confirmado).length;
  const hora = new Date().getHours();
  const saludo = hora < 12 ? "Buenos días" : hora < 19 ? "Buenas tardes" : "Buenas noches";

  return shell("inicio", `
    <header class="pg-cab">
      <div><h1>${saludo}, ${esc(u.nombre.split(" ")[0])}</h1>
      <p class="gris">Tu vacante activa: <b>${VACANTE.titulo}</b> · ${VACANTE.modalidad}</p></div>
      <a href="#/portal/candidatos" class="btn btn-pri">${ic("users")} Ver candidatos</a>
    </header>

    <div class="stats">
      <div class="stat st-verde"><span>${ic("shield")}</span><div><b>${PERFILES.length}</b><small>candidatos verificados</small></div></div>
      <div class="stat st-azul"><span>${ic("flow")}</span><div><b>${activos.length}</b><small>procesos activos</small></div></div>
      <div class="stat st-ambar"><span>${ic("cal")}</span><div><b>${entrevistas}</b><small>entrevistas agendadas</small></div></div>
      <div class="stat st-coral"><span>${ic("award")}</span><div><b>${contratados}</b><small>contrataciones</small></div></div>
    </div>

    <div class="col2">
      <section class="card">
        <div class="card-cab"><h2>Recomendados para tu vacante</h2><a href="#/portal/candidatos">Ver todos</a></div>
        <div class="lista-c">${PERFILES.map(filaCandidato).join("")}</div>
      </section>

      <section class="card">
        <div class="card-cab"><h2>Tus procesos</h2>${activos.length ? `<a href="#/portal/procesos">Ver tablero</a>` : ""}</div>
        ${activos.length ? `<ul class="proc-mini">${activos.map((pr) => {
          const p = perfil(pr.candidato);
          return `<li><a href="#/portal/proceso/${p.id}">${avatar(p, "sm")}<div><b>${p.nombre}</b><small>${esc(proximaAccion(pr))}</small></div>${etiquetaEtapa(pr)}</a></li>`;
        }).join("")}</ul>`
        : `<div class="vacio">${ic("flow")}<p>Todavía no inicias ningún proceso.</p><small>Abre un perfil y pulsa <b>Iniciar contratación</b>.</small></div>`}
        <div class="como">
          <h3>Así funciona</h3>
          <ol class="mini-pasos">${ETAPAS.map((e, i) => `<li><span>${i + 1}</span><div><b>${e.nombre}</b><small>${e.desc}</small></div></li>`).join("")}</ol>
        </div>
      </section>
    </div>`);
}

function vistaCandidatos(q) {
  const filtro = q.get("f") || "todos";
  const orden = q.get("orden") || "puntaje";
  let lista = PERFILES.slice();
  if (filtro === "inmediata") lista = lista.filter((p) => p.disponibilidad === "Inmediata");
  if (filtro === "presupuesto") lista = lista.filter((p) => p.salario <= 1000);
  lista.sort((a, b) => orden === "salario" ? a.salario - b.salario : b.puntaje - a.puntaje);

  const chip = (id, txt) => `<a href="#/portal/candidatos?f=${id}&orden=${orden}" class="chip ${filtro === id ? "on" : ""}">${txt}</a>`;
  const mejor = (k, fn) => fn(...PERFILES.map((p) => p[k]));

  return shell("candidatos", `
    <header class="pg-cab">
      <div><h1>Candidatos</h1><p class="gris">${VACANTE.titulo} · todos resolvieron el reto "${VACANTE.reto}"</p></div>
    </header>

    <div class="filtros">
      <div class="chips">${chip("todos", "Todos")}${chip("inmediata", "Disponibilidad inmediata")}${chip("presupuesto", "Hasta USD 1 000/mes")}</div>
      <label class="orden">Ordenar por
        <select id="sel-orden"><option value="puntaje" ${orden === "puntaje" ? "selected" : ""}>Mejor puntaje</option><option value="salario" ${orden === "salario" ? "selected" : ""}>Menor salario</option></select>
      </label>
    </div>

    <div class="grid-c">
      ${lista.map((p) => {
        const proc = estado.procesos[p.id];
        const guardado = estado.guardados.includes(p.id);
        return `<article class="cc" style="--c:${p.color};--t:${p.tinte}">
          <div class="cc-cab">
            ${avatar(p, "lg")}
            <button class="ic-btn mark ${guardado ? "on" : ""}" data-accion="guardar" data-id="${p.id}" aria-label="Guardar">${ic("mark")}</button>
          </div>
          <h3><a href="#/portal/candidato/${p.id}">${p.nombre}</a></h3>
          <p class="cc-tit">${p.titular}</p>
          <p class="cc-meta">${ic("pin")} ${p.ubicacion} <span>·</span> ${ic("clock")} ${p.disponibilidad}</p>
          <div class="cc-sk">${p.habilidades.map((h) => `<span class="sk">${h.nombre} <b>${h.nivel}</b></span>`).join("")}</div>
          <div class="cc-num">
            <div><small>Puntaje del reto</small><b>${p.puntaje}<span>/100</span></b></div>
            <div><small>Salario esperado</small><b>${usd(p.salario)}<span>/mes</span></b></div>
          </div>
          <div class="cc-pie">
            ${proc ? etiquetaEtapa(proc) : verificado("Reto verificado")}
            <a href="#/portal/candidato/${p.id}" class="btn btn-sec btn-sm">Ver perfil</a>
          </div>
        </article>`;
      }).join("") || `<div class="vacio card">${ic("users")}<p>Nadie cumple ese filtro.</p></div>`}
    </div>

    <section class="card">
      <div class="card-cab"><h2>Comparación</h2></div>
      <div class="tabla-w"><table class="tabla">
        <thead><tr><th></th>${PERFILES.map((p) => `<th>${avatar(p, "xs")} ${primerNombre(p)}</th>`).join("")}</tr></thead>
        <tbody>
          ${RUBRICA.map((r) => {
            const top = Math.max(...PERFILES.map((p) => p.rubrica[r.id]));
            return `<tr><th>${r.nombre} <small>/${r.peso}</small></th>${PERFILES.map((p) => `<td class="${p.rubrica[r.id] === top ? "top" : ""}">${p.rubrica[r.id]}</td>`).join("")}</tr>`;
          }).join("")}
          <tr class="sep"><th>Puntaje total</th>${PERFILES.map((p) => `<td class="${p.puntaje === mejor("puntaje", Math.max) ? "top" : ""}">${p.puntaje}</td>`).join("")}</tr>
          <tr><th>Salario esperado</th>${PERFILES.map((p) => `<td class="${p.salario === mejor("salario", Math.min) ? "top" : ""}">${usd(p.salario)}</td>`).join("")}</tr>
          <tr><th>Costo primer año <small>salario + tarifa</small></th>${PERFILES.map((p) => `<td>${usd(costoAnual(p.salario))}</td>`).join("")}</tr>
          <tr><th>Disponibilidad</th>${PERFILES.map((p) => `<td class="txt">${p.disponibilidad}</td>`).join("")}</tr>
        </tbody>
      </table></div>
    </section>`);
}

function tarjetaCostos(p, salario = p.salario) {
  const agencia = salario * 12 * AGENCIA;
  return `<section class="card costos">
    <h2>${ic("money")} Costos</h2>
    <dl class="dl-costos">
      <div><dt>${salario === p.salario ? "Salario esperado" : "Salario ofrecido"}</dt><dd>${usd(salario)}<small>/mes</small></dd></div>
      <div><dt>Tarifa SinCV</dt><dd>${usd(TARIFA_SINCV)}<small> única</small></dd></div>
      <div class="tot"><dt>Costo primer año</dt><dd>${usd(costoAnual(salario))}</dd></div>
    </dl>
    <p class="ahorro">Con una agencia pagarías unos <b>${usd(agencia)}</b> de comisión. Ahorras <b>${usd(agencia - TARIFA_SINCV)}</b>.</p>
    <p class="nota">La tarifa se cobra solo al confirmar la contratación.</p>
  </section>`;
}

function stepper(proc) {
  const idx = proc ? ETAPAS.findIndex((e) => e.id === proc.etapa) : -1;
  const fin = proc?.confirmado;
  return `<ol class="stepper ${proc?.etapa === "descartado" ? "off" : ""}">${ETAPAS.map((e, i) => {
    const st = i < idx || (fin && i === idx) ? "hecho" : i === idx ? "actual" : "";
    return `<li class="${st}"><span>${st === "hecho" ? ic("check") : i + 1}</span><b>${e.nombre}</b></li>`;
  }).join("")}</ol>`;
}

function vistaPerfil(id, tab = "resumen") {
  const p = perfil(id);
  if (!p) return shell("candidatos", vistaNoExiste());
  const proc = estado.procesos[id];
  const guardado = estado.guardados.includes(id);
  const tabs = { resumen: "Resumen", reto: "Reto y evidencia", proyecto: "Proyecto", rubrica: "Rúbrica" };

  let cont;
  if (tab === "reto") {
    cont = `
      <p class="intro">Reto <b>${VACANTE.reto}</b> · ${VACANTE.dataset} · ${VACANTE.duracion}. Esta es la consulta principal que entregó:</p>
      <div class="code"><div class="code-h">${ic("code")} consulta.sql</div><pre><code>${sql(p.reto.sql)}</code></pre></div>
      ${barras(p.reto.grafico, p.color)}
      <h3 class="h3">Lo que encontró</h3>
      <ol class="hallazgos">${p.reto.hallazgos.map((h) => `<li>${esc(h)}</li>`).join("")}</ol>
      <blockquote class="revisor"><small>Nota del revisor</small>${esc(p.nota)}</blockquote>`;
  } else if (tab === "proyecto") {
    cont = `
      <div class="proy" style="--c:${p.color};--t:${p.tinte}">
        <h3>${esc(p.proyecto.nombre)}</h3>
        <p>${esc(p.proyecto.resumen)}</p>
        <div class="proy-res"><small>Resultado</small><b>${esc(p.proyecto.resultado)}</b></div>
        <div class="cc-sk">${p.proyecto.herramientas.map((h) => `<span class="sk">${esc(h)}</span>`).join("")}</div>
      </div>
      <p class="nota">Proyecto contado por el candidato y revisado con él en una llamada.</p>`;
  } else if (tab === "rubrica") {
    cont = `<div class="rub">${RUBRICA.map((r) => `
      <div class="rub-f">
        <div class="rub-t"><b>${r.nombre}</b><span>${p.rubrica[r.id]}<small>/${r.peso}</small></span></div>
        <div class="barra"><i style="width:${(p.rubrica[r.id] / r.peso) * 100}%;background:${p.color}"></i></div>
        <p>${r.desc}</p>
      </div>`).join("")}</div>
      <p class="nota">Promedio de dos revisores independientes.</p>`;
  } else {
    cont = `
      <h3 class="h3">Acerca de</h3>
      <p class="acerca">${esc(p.acerca)}</p>
      <h3 class="h3">Habilidades verificadas</h3>
      <div class="habs">${p.habilidades.map((h) => `
        <div class="hab"><span>${h.nombre}</span><div class="barra"><i style="width:${h.nivel}%;background:${p.color}"></i></div><b>${h.nivel}</b></div>`).join("")}
      </div>
      <h3 class="h3">Experiencia</h3>
      <ul class="exp">${p.experiencia.map((e) => `
        <li><span class="exp-ic" style="--t:${p.tinte};--c:${p.color}">${ic("doc")}</span>
        <div><b>${e.puesto}</b><small>${e.lugar} · ${e.periodo}</small><p>${e.desc}</p></div></li>`).join("")}
      </ul>
      <h3 class="h3">Idiomas</h3>
      <div class="cc-sk">${p.idiomas.map((i) => `<span class="sk">${i}</span>`).join("")}</div>`;
  }

  const botonProceso = proc
    ? `<a href="#/portal/proceso/${id}" class="btn btn-pri">${ic("flow")} Ver proceso</a>`
    : `<button class="btn btn-pri" data-accion="iniciar" data-id="${id}">${ic("flow")} Iniciar contratación</button>`;

  return shell("candidatos", `
    <a href="#/portal/candidatos" class="atras">${ic("left")} Candidatos</a>
    <section class="perfil-cab card" style="--c:${p.color};--t:${p.tinte}">
      <div class="portada"></div>
      <div class="pc-body">
        ${avatar(p, "xl")}
        <div class="pc-info">
          <h1>${p.nombre} ${verificado()}</h1>
          <p class="pc-tit">${p.titular}</p>
          <p class="cc-meta">${ic("pin")} ${p.ubicacion} <span>·</span> ${ic("clock")} ${p.disponibilidad}, ${p.jornada.toLowerCase()}</p>
        </div>
        <div class="pc-acc">
          <button class="btn btn-sec ${guardado ? "on" : ""}" data-accion="guardar" data-id="${id}">${ic("mark")} ${guardado ? "Guardado" : "Guardar"}</button>
          ${botonProceso}
        </div>
      </div>
      <div class="pc-num">
        <div><small>Puntaje del reto</small><b>${p.puntaje}<span>/100</span></b></div>
        <div><small>Salario esperado</small><b>${usd(p.salario)}<span>/mes</span></b></div>
        <div><small>Costo primer año</small><b>${usd(costoAnual(p.salario))}</b></div>
      </div>
    </section>

    <div class="perfil-grid">
      <section class="card">
        <nav class="tabs">${Object.entries(tabs).map(([k, v]) => `<a href="#/portal/candidato/${id}/${k}" class="${k === tab ? "on" : ""}">${v}</a>`).join("")}</nav>
        <div class="tab-c">${cont}</div>
      </section>
      <aside class="aside">
        ${tarjetaCostos(p)}
        <section class="card">
          <h2>${ic("flow")} Contratación</h2>
          ${proc ? `${stepper(proc)}<p class="sig">${etiquetaEtapa(proc)} ${esc(proximaAccion(proc))}</p><a href="#/portal/proceso/${id}" class="btn btn-sec btn-blk">Continuar proceso</a>`
          : `<p class="gris">Inicia el proceso para pedir una presentación. Nosotros contactamos a ${primerNombre(p)} en menos de 48 h.</p>
             <button class="btn btn-pri btn-blk" data-accion="iniciar" data-id="${id}">Iniciar contratación</button>`}
        </section>
      </aside>
    </div>`);
}

function vistaProcesos() {
  const todos = Object.values(estado.procesos);
  const desc = todos.filter((p) => p.etapa === "descartado");
  const col = (etapa) => todos.filter((p) => p.etapa === etapa);
  const tarjeta = (pr) => {
    const p = perfil(pr.candidato);
    return `<a class="kb-card" href="#/portal/proceso/${p.id}" style="--c:${p.color}">
      <div class="kb-q">${avatar(p, "sm")}<div><b>${p.nombre}</b><small>${esc(pr.vacante)}</small></div></div>
      <p>${esc(proximaAccion(pr))}</p>
      <small class="kb-f">Desde ${fechaCorta(pr.inicio)}</small>
    </a>`;
  };

  return shell("procesos", `
    <header class="pg-cab">
      <div><h1>Contratación</h1><p class="gris">Sigue cada proceso desde la solicitud hasta la firma.</p></div>
      <a href="#/portal/candidatos" class="btn btn-sec">${ic("users")} Agregar candidato</a>
    </header>
    ${todos.length ? `
    <div class="kanban">${ETAPAS.map((e, i) => {
      const items = col(e.id);
      return `<div class="kb-col k${i}"><div class="kb-cab"><b>${e.nombre}</b><span>${items.length}</span></div>
        ${items.map(tarjeta).join("") || `<p class="kb-vacio">Nadie aquí</p>`}</div>`;
    }).join("")}</div>
    ${desc.length ? `<details class="card desc"><summary>Descartados (${desc.length})</summary>${desc.map(tarjeta).join("")}</details>` : ""}`
    : `<div class="card vacio grande">${ic("flow")}<p>Aún no hay procesos.</p><small>Revisa los perfiles y elige a quién quieres conocer.</small>
       <a href="#/portal/candidatos" class="btn btn-pri">Ver candidatos</a></div>`}`);
}

function panelEtapa(p, proc) {
  const n = primerNombre(p);
  const demo = (accion, txt) => `<button class="btn btn-demo" data-accion="${accion}" data-id="${p.id}"><span>Demo</span>${txt}</button>`;

  switch (proc.etapa) {
    case "solicitud":
      return `<div class="paso-ic azul">${ic("mail")}</div>
        <h2>Le estamos avisando a ${n}</h2>
        <p class="gris">Nuestro equipo contacta a ${n} en menos de 48 horas para confirmar que le interesa la vacante. Te avisamos apenas responda.</p>
        <dl class="dl-simple"><div><dt>Vacante</dt><dd>${esc(proc.vacante)}</dd></div>
        ${proc.mensaje ? `<div><dt>Tu mensaje</dt><dd>${esc(proc.mensaje)}</dd></div>` : ""}</dl>
        ${demo("acepta-solicitud", `Simular: ${n} aceptó`)}`;

    case "entrevista":
      if (!proc.entrevista) {
        return `<div class="paso-ic ambar">${ic("cal")}</div>
          <h2>${n} quiere conocerte. Agenda la entrevista.</h2>
          <form id="f-entrevista" class="form" data-id="${p.id}">
            <div class="f2">
              <label class="campo">Fecha<input type="date" name="fecha" min="${hoyISO()}" required></label>
              <label class="campo">Hora<input type="time" name="hora" value="10:00" required></label>
            </div>
            <fieldset class="campo"><legend>Modalidad</legend>
              <div class="seg seg-sm">
                <label><input type="radio" name="modalidad" value="Videollamada" checked><span>${ic("video")} Videollamada</span></label>
                <label><input type="radio" name="modalidad" value="Llamada"><span>Llamada</span></label>
                <label><input type="radio" name="modalidad" value="Presencial"><span>Presencial</span></label>
              </div>
            </fieldset>
            <button class="btn btn-pri" type="submit">Agendar entrevista</button>
          </form>`;
      }
      return `<div class="paso-ic ambar">${ic("video")}</div>
        <h2>Entrevista agendada</h2>
        <div class="cita"><b>${fechaLarga(proc.entrevista.fecha)}</b><span>${proc.entrevista.hora} · ${proc.entrevista.modalidad}</span></div>
        <p class="gris">Después de la entrevista, cuéntanos cómo te fue:</p>
        <div class="opc-btns">
          <button class="btn btn-sec" data-accion="valorar" data-valor="Muy bien" data-id="${p.id}">Muy bien</button>
          <button class="btn btn-sec" data-accion="valorar" data-valor="Bien, con dudas" data-id="${p.id}">Bien, con dudas</button>
          <button class="btn btn-sec peligro" data-accion="descartar" data-id="${p.id}">No me convenció</button>
        </div>`;

    case "oferta":
      if (!proc.oferta) {
        return `<div class="paso-ic morado">${ic("doc")}</div>
          <h2>Prepara la oferta para ${n}</h2>
          <form id="f-oferta" class="form" data-id="${p.id}">
            <div class="f2">
              <label class="campo">Salario mensual (USD)<input type="number" name="salario" min="300" step="50" value="${p.salario}" required></label>
              <label class="campo">Fecha de inicio<input type="date" name="inicio" min="${hoyISO()}" required></label>
            </div>
            <label class="campo">Tipo de contrato
              <select name="contrato"><option>Contratista remoto</option><option>Planilla</option><option>Periodo de prueba (3 meses)</option></select>
            </label>
            <div class="calc" id="calc">${calcOferta(p.salario, p.salario)}</div>
            <button class="btn btn-pri" type="submit">Enviar oferta</button>
          </form>`;
      }
      return `<div class="paso-ic morado">${ic("doc")}</div>
        <h2>Oferta enviada</h2>
        ${resumenOferta(proc)}
        ${demo("acepta-oferta", `Simular: ${n} aceptó la oferta`)}`;

    case "contratado": {
      const sal = proc.oferta.salario;
      if (!proc.confirmado) {
        return `<div class="paso-ic verde">${ic("check")}</div>
          <h2>${n} aceptó tu oferta</h2>
          ${resumenOferta(proc)}
          <div class="factura">
            <div><span>Primer mes de salario</span><b>${usd(sal)}</b></div>
            <div><span>Tarifa SinCV (pago único)</span><b>${usd(TARIFA_SINCV)}</b></div>
            <div class="tot"><span>Total del primer mes</span><b>${usd(sal + TARIFA_SINCV)}</b></div>
          </div>
          <button class="btn btn-pri btn-lg" data-accion="confirmar" data-id="${p.id}">Confirmar contratación</button>`;
      }
      return `<div class="exito" style="--c:${p.color};--t:${p.tinte}">
          <div class="exito-ic">${ic("party")}</div>
          <h2>¡${n} es parte de tu equipo!</h2>
          <p>Empieza el <b>${fechaLarga(proc.oferta.inicio)}</b> con un salario de ${usd(sal)} al mes.</p>
          <p class="gris">Te enviamos la factura de ${usd(TARIFA_SINCV)} a ${esc(estado.usuario.email || "tu correo")}. Si deja el puesto en los primeros 60 días, te presentamos a otra persona sin costo.</p>
        </div>`;
    }

    default:
      return `<div class="paso-ic gris">${ic("x")}</div>
        <h2>Proceso descartado</h2>
        <p class="gris">Motivo: ${esc(proc.motivo)}</p>
        <button class="btn btn-sec" data-accion="reabrir" data-id="${p.id}">Empezar de nuevo</button>`;
  }
}

function calcOferta(sal, esperado) {
  const dif = sal - esperado;
  return `<div><span>Costo primer año</span><b>${usd(costoAnual(sal))}</b></div>
    <div><span>Frente a lo que espera</span><b class="${dif < 0 ? "neg" : "pos"}">${dif === 0 ? "Igual" : (dif > 0 ? "+" : "−") + usd(Math.abs(dif))}</b></div>`;
}

function resumenOferta(proc) {
  const o = proc.oferta;
  return `<dl class="dl-simple">
    <div><dt>Salario</dt><dd>${usd(o.salario)} al mes</dd></div>
    <div><dt>Inicio</dt><dd>${fechaLarga(o.inicio)}</dd></div>
    <div><dt>Contrato</dt><dd>${esc(o.contrato)}</dd></div></dl>`;
}

function vistaProceso(id) {
  const p = perfil(id);
  const proc = estado.procesos[id];
  if (!p || !proc) return shell("procesos", vistaNoExiste());
  return shell("procesos", `
    <a href="#/portal/procesos" class="atras">${ic("left")} Contratación</a>
    <header class="proc-cab card">
      ${avatar(p, "lg")}
      <div><h1>${p.nombre}</h1><p class="gris">${esc(proc.vacante)} · ${p.ubicacion}</p></div>
      <div class="proc-cab-d">${etiquetaEtapa(proc)}<a href="#/portal/candidato/${id}">Ver perfil</a></div>
    </header>
    <div class="card stepper-card">${stepper(proc)}</div>

    <div class="perfil-grid">
      <section class="card paso">${panelEtapa(p, proc)}</section>
      <aside class="aside">
        ${tarjetaCostos(p, proc.oferta?.salario || p.salario)}
        <section class="card">
          <h2>${ic("clock")} Historial</h2>
          <ul class="hist">${proc.historial.slice().reverse().map((h) => `<li><small>${fechaCorta(h.t)}</small>${esc(h.texto)}</li>`).join("")}</ul>
          ${proc.etapa !== "descartado" && !proc.confirmado ? `<button class="lnk peligro" data-accion="descartar" data-id="${id}">Descartar proceso</button>` : ""}
        </section>
      </aside>
    </div>`);
}

/* ============ Portal de candidato ============ */
function vistaCandidato() {
  const u = estado.usuario;
  return `
  <header class="pub-top cand-top">
    <div class="wrap pub-top-in">
      ${logo("#/mi-cuenta")}
      <div class="side-user">
        <span class="av av-sm av-u">${esc(u.nombre.split(" ").map((s) => s[0]).join("").slice(0, 2))}</span>
        <div><b>${esc(u.nombre)}</b><small>Candidato/a</small></div>
        <button class="ic-btn" data-accion="salir" aria-label="Cerrar sesión" title="Cerrar sesión">${ic("out")}</button>
      </div>
    </div>
  </header>
  <main class="wrap cand">
    <h1>Hola, ${esc(u.nombre.split(" ")[0])}</h1>
    <p class="gris">Te faltan dos pasos para que las empresas vean tu perfil.</p>
    <div class="cand-grid">
      <section class="card">
        <h2>Tu progreso</h2>
        <ol class="progreso">
          <li class="hecho"><span>${ic("check")}</span><div><b>Crear tu cuenta</b><small>Listo</small></div></li>
          <li class="actual"><span>2</span><div><b>Resolver un reto</b><small>Elige uno de abajo. Tienes 90 minutos.</small></div></li>
          <li><span>3</span><div><b>Revisión</b><small>Dos personas lo puntúan en 3 días hábiles.</small></div></li>
          <li><span>4</span><div><b>Perfil visible para empresas</b><small>Empiezas a recibir propuestas.</small></div></li>
        </ol>
      </section>
      <section class="card">
        <h2>Retos disponibles</h2>
        <ul class="retos">
          <li><span class="r-ic" style="--t:#e3eefa;--c:#2b6cb0">${ic("code")}</span><div><b>SQL para análisis de ventas</b><small>90 min · Analista de datos</small></div><button class="btn btn-pri btn-sm" data-accion="reto">Empezar</button></li>
          <li><span class="r-ic" style="--t:#fbe9e3;--c:#d9603f">${ic("chart")}</span><div><b>Tablero en Power BI</b><small>2 h · Analista de datos</small></div><button class="btn btn-sec btn-sm" data-accion="reto">Empezar</button></li>
          <li><span class="r-ic" style="--t:#fbf0d9;--c:#c48a12">${ic("doc")}</span><div><b>Excel: conciliación</b><small>60 min · Asistente contable</small></div><span class="pronto">Pronto</span></li>
        </ul>
      </section>
    </div>
  </main>`;
}

function vistaNoExiste() {
  return `<div class="card vacio grande"><p>No encontramos esta página.</p><a href="#/" class="btn btn-sec">Volver</a></div>`;
}

/* ============ Rutas ============ */
function render() {
  const [ruta, qs] = location.hash.replace(/^#/, "").split("?");
  const q = new URLSearchParams(qs || "");
  const partes = (ruta || "/").split("/").filter(Boolean);
  const u = estado.usuario;
  let html;

  if (partes[0] === "portal") {
    if (!u || u.rol !== "empresa") return irA("#/ingresar?rol=empresa");
    const [, sec, id, tab] = partes;
    if (!sec) html = vistaPortalInicio();
    else if (sec === "candidatos") html = vistaCandidatos(q);
    else if (sec === "candidato") html = vistaPerfil(id, tab);
    else if (sec === "procesos") html = vistaProcesos();
    else if (sec === "proceso") html = vistaProceso(id);
    else html = shell("", vistaNoExiste());
  } else if (partes[0] === "mi-cuenta") {
    if (!u || u.rol !== "candidato") return irA("#/ingresar?rol=candidato");
    html = vistaCandidato();
  } else if (partes[0] === "ingresar") {
    if (u) return irA(u.rol === "empresa" ? "#/portal" : "#/mi-cuenta");
    html = vistaLogin(q);
  } else {
    html = vistaLanding();
  }

  app.innerHTML = html;
  document.body.classList.toggle("en-portal", partes[0] === "portal");
  if (!(partes[0] === "portal" && partes[1] === "candidato" && partes[3])) window.scrollTo(0, 0);
}
function irA(h) { location.hash = h; }

/* ============ Eventos ============ */
document.addEventListener("click", (e) => {
  const ir = e.target.closest("[data-ir]");
  if (ir) {
    e.preventDefault();
    document.getElementById(ir.dataset.ir)?.scrollIntoView({ behavior: "smooth" });
    return;
  }
  if (e.target.matches("[data-cerrar]") || e.target.closest("button[data-cerrar]")) return cerrarModal();

  const b = e.target.closest("[data-accion]");
  if (!b) return;
  const id = b.dataset.id;
  const p = id && perfil(id);
  const proc = id && estado.procesos[id];

  switch (b.dataset.accion) {
    case "salir":
      estado.usuario = null; guardar(); irA("#/"); break;

    case "reiniciar":
      if (confirm("¿Borrar procesos y guardados de la demo?")) {
        estado.procesos = {}; estado.guardados = []; guardar(); render(); toast("Demo reiniciada");
      }
      break;

    case "guardar": {
      e.preventDefault();
      const i = estado.guardados.indexOf(id);
      if (i >= 0) estado.guardados.splice(i, 1); else estado.guardados.push(id);
      guardar(); render();
      toast(i >= 0 ? "Quitado de guardados" : `${p.nombre} guardado`);
      break;
    }

    case "iniciar":
      abrirModal(`
        <div class="m-cab">${avatar(p)}<div><small>Iniciar contratación</small><h2>${p.nombre}</h2></div></div>
        <form id="f-iniciar" data-id="${id}">
          <label class="campo">Vacante<input name="vacante" value="${VACANTE.titulo}" required></label>
          <label class="campo">Mensaje para ${primerNombre(p)} <span class="gris">(opcional)</span>
            <textarea name="mensaje" rows="3" placeholder="Ej. Nos gustó mucho cómo encontraste el problema de cancelaciones."></textarea></label>
          <div class="m-info">${ic("mail")}<p>Nosotros contactamos a ${primerNombre(p)} en menos de 48 h. No pagas nada hasta confirmar la contratación.</p></div>
          <button class="btn btn-pri btn-blk" type="submit">Enviar solicitud</button>
        </form>`);
      break;

    case "acepta-solicitud":
      proc.etapa = "entrevista";
      anotar(proc, `${primerNombre(p)} aceptó conocerte`);
      guardar(); render(); toast(`${primerNombre(p)} aceptó`);
      break;

    case "valorar":
      proc.valoracion = b.dataset.valor;
      proc.etapa = "oferta";
      anotar(proc, `Entrevista realizada: "${b.dataset.valor}"`);
      guardar(); render();
      break;

    case "acepta-oferta":
      proc.etapa = "contratado";
      anotar(proc, `${primerNombre(p)} aceptó la oferta`);
      guardar(); render(); toast("Oferta aceptada");
      break;

    case "confirmar":
      proc.confirmado = true;
      anotar(proc, `Contratación confirmada. Tarifa de ${usd(TARIFA_SINCV)}`);
      guardar(); render(); toast("Contratación confirmada");
      break;

    case "descartar":
      abrirModal(`
        <h2>Descartar a ${primerNombre(p)}</h2>
        <p class="gris">Nos ayuda saber por qué, para mejorar los perfiles.</p>
        <form id="f-descartar" data-id="${id}">
          <div class="radios">${["No tiene el nivel técnico", "Salario fuera de presupuesto", "Disponibilidad", "Comunicación", "Elegí a otra persona"].map((m, i) =>
            `<label><input type="radio" name="motivo" value="${m}" ${i === 0 ? "checked" : ""}> ${m}</label>`).join("")}</div>
          <button class="btn btn-peligro btn-blk" type="submit">Descartar</button>
        </form>`);
      break;

    case "reabrir":
      delete estado.procesos[id]; guardar(); irA(`#/portal/candidato/${id}`);
      break;

    case "reto":
      toast("Los retos se abren en la siguiente versión de la beta");
      break;
  }
});

document.addEventListener("submit", (e) => {
  const f = e.target;
  e.preventDefault();
  const d = new FormData(f);
  const id = f.dataset.id;
  const p = id && perfil(id);
  const proc = id && estado.procesos[id];

  if (f.id === "f-login") {
    const email = String(d.get("email") || "").trim();
    const rol = d.get("rol");
    estado.usuario = {
      rol,
      email,
      nombre: email ? nombreDesdeCorreo(email) : rol === "empresa" ? "Laura Méndez" : "Invitado",
      empresa: email ? empresaDesdeCorreo(email) : "Andina Pay",
    };
    guardar();
    irA(rol === "empresa" ? "#/portal" : "#/mi-cuenta");
  } else if (f.id === "f-iniciar") {
    crearProceso(id, String(d.get("vacante")).trim() || VACANTE.titulo, String(d.get("mensaje")).trim());
    cerrarModal();
    toast("Solicitud enviada");
    irA(`#/portal/proceso/${id}`);
  } else if (f.id === "f-entrevista") {
    proc.entrevista = { fecha: d.get("fecha"), hora: d.get("hora"), modalidad: d.get("modalidad") };
    anotar(proc, `Entrevista agendada para el ${fechaLarga(proc.entrevista.fecha)}, ${proc.entrevista.hora}`);
    guardar(); render(); toast("Entrevista agendada");
  } else if (f.id === "f-oferta") {
    proc.oferta = { salario: Number(d.get("salario")), inicio: d.get("inicio"), contrato: d.get("contrato") };
    anotar(proc, `Oferta enviada: ${usd(proc.oferta.salario)} al mes`);
    guardar(); render(); toast("Oferta enviada");
  } else if (f.id === "f-descartar") {
    proc.etapa = "descartado";
    proc.motivo = d.get("motivo");
    anotar(proc, `Proceso descartado: ${proc.motivo}`);
    guardar(); cerrarModal(); render();
  }
});

document.addEventListener("input", (e) => {
  if (e.target.name === "salario" && e.target.form?.id === "f-oferta") {
    const p = perfil(e.target.form.dataset.id);
    $("#calc").innerHTML = calcOferta(Number(e.target.value) || 0, p.salario);
  }
});

document.addEventListener("change", (e) => {
  if (e.target.id === "sel-orden") {
    const q = new URLSearchParams(location.hash.split("?")[1] || "");
    q.set("orden", e.target.value);
    irA(`#/portal/candidatos?${q}`);
  }
  if (e.target.name === "rol" && e.target.form?.id === "f-login") {
    const rol = e.target.value;
    const panel = $("#login-panel");
    panel.className = `login-panel ${rol}`;
    panel.innerHTML = panelLogin(rol);
    history.replaceState(null, "", `#/ingresar?rol=${rol}`);
  }
});

document.addEventListener("keydown", (e) => e.key === "Escape" && cerrarModal());
window.addEventListener("hashchange", render);
render();
