// v3
import { useState, useEffect, useCallback, useRef } from "react";

// ─── SUPABASE ────────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://cypnzobdkhgysrjkxgsd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5cG56b2Jka2hneXNyamt4Z3NkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMjE5OTUsImV4cCI6MjA5NDc5Nzk5NX0.QV01inaYutgwSBYZInY1Qpx2aMITOf6IDt4OMwVJndA";
const sbH = () => ({
  "apikey": SUPABASE_ANON_KEY,
  "Authorization": `Bearer ${window._merarToken || SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json",
  "Prefer": "return=representation"
});

// ─── ESPECIALISTAS MERAR (COFEPRIS) ──────────────────────────────────────────
const ESPECIALISTAS = {
  carlos: {
    id: "carlos",
    nombre: "LOEO Carlos Alberto Piña Arvizu",
    corto: "Dr. Carlos Piña",
    rol: "Ortodoncista & Ortopedista Maxilofacial",
    cedula_prof: "10388327",
    cedula_esp: "12748662",
    color: "#3A5E3F",
    initials: "CP",
  },
  ahtzari: {
    id: "ahtzari",
    nombre: "LO Jovana Ahtzari Estrada Merlo",
    corto: "Dra. Ahtzari Estrada",
    rol: "Odontología General",
    cedula_prof: "12381050",
    cedula_esp: null,
    color: "#C9A97A",
    initials: "AE",
  },
};

// ─── DATA MAPPERS ─────────────────────────────────────────────────────────────
const toSnake = (p) => ({
  id: p.id, expediente: p.expediente, created_at: p.createdAt, status: p.status,
  especialista_id: p.especialistaId,
  nombre: p.nombre, apellido_paterno: p.apellidoPaterno, apellido_materno: p.apellidoMaterno,
  fecha_nacimiento: p.fechaNacimiento||null, edad: p.edad?parseInt(p.edad):null,
  sexo: p.sexo, curp: p.curp, telefono: p.telefono, email: p.email,
  calle: p.calle, colonia: p.colonia, cp: p.cp, municipio: p.municipio,
  estado: p.estado, ocupacion: p.ocupacion, tutor: p.tutor, parentesco: p.parentesco,
  ant_heredofam: p.antHeredofam||[], ant_personales_patol: p.antPersonalesPatol||[],
  medicamentos: p.medicamentos, alergias: p.alergias, tabaco: p.tabaco, alcohol: p.alcohol,
  ant_estomat: p.antEstomat||[], motivo_consulta: p.motivoConsulta,
  tipo_maloclusion_ref: p.tipoMaloclusionRef, motivo_pred: p.motivoPred, expectativas: p.expectativas,
  biotipo: p.biotipo, simetria: p.simetria, perfil: p.perfil, linea_media: p.lineaMedia,
  tercio_inf: p.tercioInf, labios: p.labios, encias: p.encias, atm: p.atm,
  habitos: p.habitos||[], overjet: p.overjet?parseFloat(p.overjet):null,
  overbite: p.overbite?parseFloat(p.overbite):null,
  apinamiento_sup: p.apinamientoSup?parseFloat(p.apinamientoSup):null,
  apinamiento_inf: p.apinamientoInf?parseFloat(p.apinamientoInf):null,
  angle_class: p.angleClass, diagnostico: p.diagnostico, severidad: p.severidad,
  tipo_plan_tx: p.tipoPlanTx, extraccion: p.extraccion, cirugia: p.cirugia,
  pronostico: p.pronostico, duracion_tx: p.duracionTx,
  anb: p.anb?parseFloat(p.anb):null, sna: p.sna?parseFloat(p.sna):null,
  snb: p.snb?parseFloat(p.snb):null, sistema_cefalo: p.sistemaCefalo,
  objetivos_tx: p.objetivosTx, aparatologia: p.aparatologia, prescripcion: p.prescripcion,
  extraccion_planif: p.extraccionPlanif, anclaje: p.anclaje,
  fase_i: p.faseI, fase_ii: p.faseII, fase_iii: p.faseIII,
  costo_total: p.costoTotal?parseFloat(p.costoTotal):null,
  forma_pago: p.formaPago, inicio_tx: p.inicioTx||null, fin_tx: p.finTx||null,
  odontograma: p.odontograma||{},
});

const toCamel = (r, notas=[], pagos=[]) => ({
  id: r.id, expediente: r.expediente, createdAt: r.created_at, status: r.status,
  especialistaId: r.especialista_id,
  nombre: r.nombre, apellidoPaterno: r.apellido_paterno, apellidoMaterno: r.apellido_materno,
  fechaNacimiento: r.fecha_nacimiento, edad: r.edad, sexo: r.sexo, curp: r.curp,
  telefono: r.telefono, email: r.email, calle: r.calle, colonia: r.colonia,
  cp: r.cp, municipio: r.municipio, estado: r.estado, ocupacion: r.ocupacion,
  tutor: r.tutor, parentesco: r.parentesco,
  antHeredofam: r.ant_heredofam||[], antPersonalesPatol: r.ant_personales_patol||[],
  medicamentos: r.medicamentos, alergias: r.alergias, tabaco: r.tabaco, alcohol: r.alcohol,
  antEstomat: r.ant_estomat||[], motivoConsulta: r.motivo_consulta,
  tipoMaloclusionRef: r.tipo_maloclusion_ref, motivoPred: r.motivo_pred, expectativas: r.expectativas,
  biotipo: r.biotipo, simetria: r.simetria, perfil: r.perfil, lineaMedia: r.linea_media,
  tercioInf: r.tercio_inf, labios: r.labios, encias: r.encias, atm: r.atm,
  habitos: r.habitos||[], overjet: r.overjet, overbite: r.overbite,
  apinamientoSup: r.apinamiento_sup, apinamientoInf: r.apinamiento_inf,
  angleClass: r.angle_class, diagnostico: r.diagnostico, severidad: r.severidad,
  tipoPlanTx: r.tipo_plan_tx, extraccion: r.extraccion, cirugia: r.cirugia,
  pronostico: r.pronostico, duracionTx: r.duracion_tx,
  anb: r.anb, sna: r.sna, snb: r.snb, sistemaCefalo: r.sistema_cefalo,
  objetivosTx: r.objetivos_tx, aparatologia: r.aparatologia, prescripcion: r.prescripcion,
  extraccionPlanif: r.extraccion_planif, anclaje: r.anclaje,
  faseI: r.fase_i, faseII: r.fase_ii, faseIII: r.fase_iii,
  costoTotal: r.costo_total, formaPago: r.forma_pago, inicioTx: r.inicio_tx, finTx: r.fin_tx,
  odontograma: r.odontograma||{},
  seguimientoNotas: notas, pagos,
});

// ─── DB ──────────────────────────────────────────────────────────────────────
const DB = {
  async getPatients(especialistaId) {
    const filter = especialistaId ? `&especialista_id=eq.${especialistaId}` : "";
    const res = await fetch(`${SUPABASE_URL}/rest/v1/patients?select=*&order=created_at.desc${filter}`, { headers: sbH() });
    if (!res.ok) throw new Error(await res.text());
    return (await res.json()).map(r => toCamel(r));
  },
  async getPatient(id) {
    const [pR, nR, pgR] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/patients?id=eq.${id}&select=*`, { headers: sbH() }),
      fetch(`${SUPABASE_URL}/rest/v1/seguimiento_notas?patient_id=eq.${id}&select=*&order=created_at.asc`, { headers: sbH() }),
      fetch(`${SUPABASE_URL}/rest/v1/pagos?patient_id=eq.${id}&select=*&order=created_at.asc`, { headers: sbH() }),
    ]);
    const [rows, notas, pagos] = await Promise.all([pR.json(), nR.json(), pgR.json()]);
    if (!rows.length) throw new Error("No encontrado");
    return toCamel(rows[0],
      notas.map(n => ({ id: n.id, date: n.created_at, text: n.text, author: n.author, firma: n.firma_data })),
      pagos.map(p => ({ id: p.id, date: p.created_at, monto: p.monto, concepto: p.concepto, metodo: p.metodo, firma: p.firma_data }))
    );
  },
  async savePatient(p) {
    const payload = toSnake(p);
    const chk = await fetch(`${SUPABASE_URL}/rest/v1/patients?id=eq.${p.id}&select=id`, { headers: sbH() });
    const exists = (await chk.json()).length > 0;
    const res = exists
      ? await fetch(`${SUPABASE_URL}/rest/v1/patients?id=eq.${p.id}`, { method: "PATCH", headers: sbH(), body: JSON.stringify(payload) })
      : await fetch(`${SUPABASE_URL}/rest/v1/patients`, { method: "POST", headers: sbH(), body: JSON.stringify(payload) });
    if (!res.ok) throw new Error(await res.text());
    return (await res.json())[0];
  },
  async deletePatient(id) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/patients?id=eq.${id}`, { method: "DELETE", headers: sbH });
    if (!res.ok) throw new Error(await res.text());
  },
  async addNota(patientId, text, author, firmaData) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/seguimiento_notas`, {
      method: "POST", headers: sbH(),
      body: JSON.stringify({ patient_id: patientId, text, author, firma_data: firmaData||null }),
    });
    if (!res.ok) throw new Error(await res.text());
    return (await res.json())[0];
  },
  async addPago(patientId, monto, concepto, metodo, firmaData) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/pagos`, {
      method: "POST", headers: sbH(),
      body: JSON.stringify({ patient_id: patientId, monto: parseFloat(monto), concepto, metodo, firma_data: firmaData||null }),
    });
    if (!res.ok) throw new Error(await res.text());
    return (await res.json())[0];
  },
  newId: () => crypto.randomUUID(),
};

// ─── PALETTE ──────────────────────────────────────────────────────────────────
const C = {
  warmWhite:"#F5F2EE", cream:"#F8F4EC", gold:"#C9A97A", goldLight:"#E8D9BF",
  goldDark:"#9E7B4E", olive:"#3A5E3F", oliveLight:"#4E7A55",
  graphite:"#3A3A3A", graphiteDk:"#1C1C1E", muted:"#8E9AAB",
  mutedLight:"#C4CDD8", border:"#E4DDD4", danger:"#C0392B",
  dangerBg:"#FDECEA", white:"#FFFFFF",
};

const globalCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:wght@300;400;500;600&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html,body,#root{height:100%;background:${C.warmWhite};color:${C.graphiteDk};font-family:'DM Sans',sans-serif}
  ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:${C.cream}}::-webkit-scrollbar-thumb{background:${C.goldLight};border-radius:4px}
  input,select,textarea,button{font-family:'DM Sans',sans-serif}
  @keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  .fade-in{animation:fadeIn .35s ease forwards}
  .spin-anim{animation:spin .8s linear infinite}
  canvas{touch-action:none}
`;

// ─── SIGNATURE PAD ────────────────────────────────────────────────────────────
const SignaturePad = ({ onSave, onCancel, title = "Firma digital" }) => {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const lastPos = useRef(null);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if (e.touches) {
      return { x: (e.touches[0].clientX - rect.left) * scaleX, y: (e.touches[0].clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const startDraw = (e) => {
    e.preventDefault();
    drawing.current = true;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pos = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    lastPos.current = pos;
  };

  const draw = (e) => {
    e.preventDefault();
    if (!drawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pos = getPos(e, canvas);
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = C.graphiteDk;
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    lastPos.current = pos;
  };

  const endDraw = (e) => { e.preventDefault(); drawing.current = false; };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL("image/png");
    onSave(dataUrl);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FAFAFA";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Guideline
    ctx.strokeStyle = "rgba(0,0,0,.08)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(20, canvas.height * 0.7);
    ctx.lineTo(canvas.width - 20, canvas.height * 0.7);
    ctx.stroke();
    ctx.setLineDash([]);
  }, []);

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.6)", zIndex:500, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:C.white, borderRadius:20, padding:28, width:"100%", maxWidth:540, boxShadow:"0 24px 60px rgba(0,0,0,.2)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:500 }}>{title}</div>
            <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>Firma con el dedo, stylus o mouse</div>
          </div>
          <button onClick={onCancel} style={{ background:"none", border:"none", cursor:"pointer", color:C.muted, fontSize:20, lineHeight:1 }}>✕</button>
        </div>
        <div style={{ border:`2px solid ${C.border}`, borderRadius:12, overflow:"hidden", marginBottom:16, position:"relative" }}>
          <canvas ref={canvasRef} width={480} height={200} style={{ width:"100%", height:200, display:"block", cursor:"crosshair" }}
            onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
            onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw} />
          <div style={{ position:"absolute", bottom:8, left:0, right:0, textAlign:"center", fontSize:10, color:"rgba(0,0,0,.2)", pointerEvents:"none", letterSpacing:1 }}>FIRMA AQUÍ</div>
        </div>
        {/* COFEPRIS info */}
        <div style={{ background:C.cream, borderRadius:8, padding:"10px 14px", marginBottom:16, fontSize:11, color:C.muted, lineHeight:1.6 }}>
          <div style={{ fontWeight:600, color:C.graphite, marginBottom:2 }}>Validez legal (NOM-004-SSA3-2012)</div>
          Esta firma digital queda registrada con timestamp en la base de datos Supabase. Fecha: <strong>{new Date().toLocaleDateString("es-MX", { day:"2-digit", month:"long", year:"numeric" })}</strong>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={clearCanvas} style={{ flex:1, padding:"10px", borderRadius:8, border:`1px solid ${C.border}`, background:"transparent", fontSize:13, cursor:"pointer", color:C.muted }}>Limpiar</button>
          <button onClick={saveSignature} style={{ flex:2, padding:"10px", borderRadius:8, border:"none", background:C.olive, color:C.white, fontSize:13, fontWeight:600, cursor:"pointer" }}>Guardar firma ✓</button>
        </div>
      </div>
    </div>
  );
};

// ─── SHARED UI ────────────────────────────────────────────────────────────────
const Icon = ({ name, size=18, color="currentColor", style={} }) => {
  const paths = {
    home:"M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H14v-5h-4v5H4a1 1 0 01-1-1V9.5z",
    users:"M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
    plus:"M12 5v14M5 12h14", search:"M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z",
    edit:"M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
    trash:"M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6",
    tooth:"M12 2C9 2 7 4 7 6c0 1.5.5 3 1 4.5C9 13 9 15 9 17c0 2 1 5 3 5s3-3 3-5c0-2 0-4 1-6.5.5-1.5 1-3 1-4.5 0-2-2-4-5-4z",
    chart:"M18 20V10M12 20V4M6 20v-6",
    file:"M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
    check:"M20 6L9 17l-5-5", x:"M18 6L6 18M6 6l12 12",
    save:"M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2zM17 21v-8H7v8M7 3v5h8",
    back:"M19 12H5M12 5l-7 7 7 7",
    alert:"M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z",
    calendar:"M3 9h18M8 3v3M16 3v3M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5z",
    clock:"M12 22a10 10 0 100-20 10 10 0 000 20zM12 6v6l4 2",
    pen:"M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z",
    peso:"M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6M8 10h8M8 14h8",
    shield:"M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    logout:"M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d={paths[name]||paths.tooth}/>
    </svg>
  );
};

const Btn = ({ children, variant="primary", onClick, style={}, icon, small, loading }) => {
  const base = { display:"inline-flex", alignItems:"center", gap:6, padding:small?"6px 14px":"10px 22px", borderRadius:8, border:"none", fontWeight:500, fontSize:small?12:14, transition:"all .18s", cursor:loading?"wait":"pointer" };
  const variants = {
    primary:{ background:C.olive, color:C.white },
    gold:{ background:C.gold, color:C.white },
    outline:{ background:"transparent", color:C.graphite, border:`1px solid ${C.border}` },
    danger:{ background:C.dangerBg, color:C.danger, border:`1px solid ${C.danger}30` },
    ghost:{ background:"transparent", color:C.muted, border:"none", padding:small?"4px 8px":"8px 12px" },
  };
  return (
    <button style={{...base,...variants[variant],opacity:loading?.7:1,...style}} onClick={onClick} disabled={loading}
      onMouseEnter={e=>{if(!loading){e.currentTarget.style.opacity=".85";e.currentTarget.style.transform="translateY(-1px)"}}}
      onMouseLeave={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.transform="translateY(0)"}}>
      {loading?<span className="spin-anim" style={{display:"inline-block",width:14,height:14,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"white",borderRadius:"50%"}}/>:icon&&<Icon name={icon} size={small?14:16} color="currentColor"/>}
      {children}
    </button>
  );
};

const Badge = ({ children, color=C.olive }) => (
  <span style={{background:color+"20",color,padding:"2px 10px",borderRadius:20,fontSize:11,fontWeight:500}}>{children}</span>
);

const Input = ({ label, value, onChange, type="text", placeholder, required, options, multiline, rows=3 }) => (
  <div style={{display:"flex",flexDirection:"column",gap:5}}>
    {label&&<label style={{fontSize:11,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:.6}}>{label}{required&&<span style={{color:C.danger}}> *</span>}</label>}
    {multiline?(
      <textarea value={value||""} onChange={e=>onChange(e.target.value)} rows={rows} placeholder={placeholder}
        style={{padding:"9px 12px",border:`1px solid ${C.border}`,borderRadius:8,fontSize:13,color:C.graphiteDk,background:C.white,resize:"vertical",outline:"none",lineHeight:1.6,fontFamily:"inherit"}}/>
    ):options?(
      <select value={value||""} onChange={e=>onChange(e.target.value)}
        style={{padding:"9px 12px",border:`1px solid ${C.border}`,borderRadius:8,fontSize:13,color:C.graphiteDk,background:C.white,outline:"none"}}>
        <option value="">— Seleccionar —</option>
        {options.map(o=><option key={o} value={o}>{o}</option>)}
      </select>
    ):(
      <input type={type} value={value||""} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={{padding:"9px 12px",border:`1px solid ${C.border}`,borderRadius:8,fontSize:13,color:C.graphiteDk,background:C.white,outline:"none"}}/>
    )}
  </div>
);

const Card = ({ children, style={} }) => (
  <div style={{background:C.white,borderRadius:14,border:`1px solid ${C.border}`,padding:"20px 24px",...style}}>{children}</div>
);

const Toast = ({ msg, type="success" }) => (
  <div style={{position:"fixed",bottom:24,right:24,zIndex:900,background:type==="error"?C.danger:C.olive,color:C.white,padding:"12px 20px",borderRadius:10,fontSize:13,fontWeight:500,boxShadow:"0 8px 24px rgba(0,0,0,.15)",display:"flex",alignItems:"center",gap:8,animation:"fadeIn .3s ease"}}>
    <Icon name={type==="error"?"alert":"check"} size={16} color="white"/>
    {msg}
  </div>
);

// ─── LOGIN con Supabase Auth ──────────────────────────────────────────────────
const Login = ({ onLogin, LOGO_WHITE }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Map email to especialista
  const EMAIL_MAP = {
    "carlos@merardental.com": "carlos",
    "ahtzari@merardental.com": "ahtzari",
  };

  const handleLogin = async () => {
    if (!email || !password) { setError("Ingresa correo y contraseña"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: "POST",
        headers: { "apikey": SUPABASE_ANON_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error_description || "Credenciales incorrectas"); return; }
      // Store token for authenticated requests
      window._merarToken = data.access_token;
      const espId = EMAIL_MAP[email.toLowerCase()];
      if (!espId) { setError("Usuario no reconocido"); return; }
      onLogin(espId);
    } catch(e) { setError("Error de conexión"); }
    finally { setLoading(false); }
  };

  return (
    <div style={{minHeight:"100vh",background:C.graphiteDk,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{width:"100%",maxWidth:400}}>
        <div style={{textAlign:"center",marginBottom:40}}>
          <img src={LOGO_WHITE} alt="MERAR" style={{height:48,width:"auto",marginBottom:20}}/>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:400,color:C.white}}>Sistema Clínico</div>
          <div style={{fontSize:13,color:"rgba(255,255,255,.4)",marginTop:6}}>Acceso exclusivo para especialistas MERAR</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            <label style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,.5)",textTransform:"uppercase",letterSpacing:.6}}>Correo electrónico</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
              placeholder="tu@merardental.com"
              onKeyDown={e=>e.key==="Enter"&&handleLogin()}
              style={{padding:"11px 14px",borderRadius:10,border:`1px solid ${error?"#EF4444":"rgba(255,255,255,.12)"}`,background:"rgba(255,255,255,.06)",color:C.white,fontSize:14,outline:"none",fontFamily:"inherit"}}/>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            <label style={{fontSize:11,fontWeight:600,color:"rgba(255,255,255,.5)",textTransform:"uppercase",letterSpacing:.6}}>Contraseña</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
              placeholder="••••••••"
              onKeyDown={e=>e.key==="Enter"&&handleLogin()}
              style={{padding:"11px 14px",borderRadius:10,border:`1px solid ${error?"#EF4444":"rgba(255,255,255,.12)"}`,background:"rgba(255,255,255,.06)",color:C.white,fontSize:14,outline:"none",fontFamily:"inherit"}}/>
          </div>
          {error && <div style={{fontSize:12,color:"#EF4444",background:"rgba(239,68,68,.1)",padding:"8px 12px",borderRadius:8,border:"1px solid rgba(239,68,68,.3)"}}>{error}</div>}
          <button onClick={handleLogin} disabled={loading}
            style={{marginTop:8,padding:"13px",borderRadius:10,border:"none",background:loading?"rgba(255,255,255,.1)":C.gold,color:C.white,fontSize:15,fontWeight:600,cursor:loading?"wait":"pointer",transition:"all .2s",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            {loading ? <><span className="spin-anim" style={{display:"inline-block",width:16,height:16,border:"2px solid rgba(255,255,255,.3)",borderTopColor:"white",borderRadius:"50%"}}/> Verificando...</> : "Ingresar →"}
          </button>
        </div>
        <div style={{textAlign:"center",marginTop:28,fontSize:11,color:"rgba(255,255,255,.2)",lineHeight:1.6}}>
          NOM-013-SSA2-2015 · NOM-004-SSA3-2012<br/>COFEPRIS · MERAR Dental Group<br/>
          <span style={{color:"rgba(255,255,255,.1)"}}>merardental.com</span>
        </div>
      </div>
    </div>
  );
};

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
const Sidebar = ({ active, setActive, collapsed, setCollapsed, dbStatus, especialista, onLogout, LOGO_WHITE }) => {
  const nav = [
    {id:"dashboard",label:"Dashboard",icon:"home"},
    {id:"patients",label:"Mis pacientes",icon:"users"},
    {id:"new",label:"Nuevo paciente",icon:"plus"},
  ];
  return (
    <aside style={{width:collapsed?64:230,flexShrink:0,background:C.graphiteDk,display:"flex",flexDirection:"column",transition:"width .25s",height:"100vh",position:"sticky",top:0}}>
      <div style={{padding:collapsed?"20px 0":"22px 18px",borderBottom:`1px solid rgba(255,255,255,.08)`,display:"flex",alignItems:"center",gap:10,justifyContent:collapsed?"center":"flex-start"}}>
        {collapsed
          ? <div style={{width:34,height:34,borderRadius:8,background:C.gold,display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="tooth" size={18} color={C.white}/></div>
          : <img src={LOGO_WHITE} alt="MERAR" style={{height:30,width:"auto"}}/>
        }
      </div>
      {/* Especialista badge */}
      {!collapsed && especialista && (
        <div style={{padding:"14px 18px",borderBottom:`1px solid rgba(255,255,255,.06)`}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:especialista.color,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cormorant Garamond',serif",fontSize:14,fontWeight:600,color:C.white,flexShrink:0}}>{especialista.initials}</div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:12,fontWeight:600,color:C.white,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{especialista.corto}</div>
              <div style={{fontSize:9,color:"rgba(255,255,255,.35)",marginTop:1}}>Céd. {especialista.cedula_prof}</div>
            </div>
          </div>
        </div>
      )}
      <nav style={{flex:1,padding:"10px 0"}}>
        {nav.map(item=>(
          <div key={item.id} onClick={()=>setActive(item.id)}
            style={{display:"flex",alignItems:"center",gap:12,padding:collapsed?"12px 0":"10px 18px",justifyContent:collapsed?"center":"flex-start",cursor:"pointer",transition:"all .15s",background:active===item.id?`${C.gold}20`:"transparent",borderLeft:active===item.id?`3px solid ${C.gold}`:"3px solid transparent",color:active===item.id?C.gold:C.mutedLight}}>
            <Icon name={item.icon} size={17} color="currentColor"/>
            {!collapsed&&<span style={{fontSize:13,fontWeight:active===item.id?600:400}}>{item.label}</span>}
          </div>
        ))}
      </nav>
      {!collapsed&&(
        <div style={{padding:"8px 18px",borderTop:`1px solid rgba(255,255,255,.06)`}}>
          <div style={{display:"flex",alignItems:"center",gap:6,fontSize:10,color:dbStatus==="connected"?"#4ade80":"rgba(255,255,255,.3)",marginBottom:8}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:dbStatus==="connected"?"#4ade80":"rgba(255,255,255,.3)",boxShadow:dbStatus==="connected"?"0 0 6px #4ade80":""}}/>
            {dbStatus==="connected"?"Supabase · En línea":"Conectando..."}
          </div>
          <div style={{background:`${C.olive}30`,borderRadius:6,padding:"6px 8px",textAlign:"center",fontSize:9,color:C.goldLight,letterSpacing:1,textTransform:"uppercase"}}>NOM-013-SSA2-2015</div>
        </div>
      )}
      <div onClick={()=>setCollapsed(!collapsed)} style={{padding:"12px 0",display:"flex",justifyContent:"center",cursor:"pointer",color:C.mutedLight,borderTop:`1px solid rgba(255,255,255,.06)`}}>
        <Icon name={collapsed?"plus":"back"} size={15} color="currentColor"/>
      </div>
      <div onClick={onLogout} style={{padding:"12px 0",display:"flex",justifyContent:"center",alignItems:"center",gap:6,cursor:"pointer",color:"rgba(255,255,255,.25)",borderTop:`1px solid rgba(255,255,255,.04)`,fontSize:11,transition:"color .2s"}}
        onMouseEnter={e=>e.currentTarget.style.color="rgba(255,255,255,.6)"}
        onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,.25)"}>
        <Icon name="logout" size={14} color="currentColor"/>
        {!collapsed&&"Cambiar usuario"}
      </div>
    </aside>
  );
};

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
const Dashboard = ({ patients, setActive, setSelectedPatient, especialista }) => {
  const total=patients.length, active=patients.filter(p=>p.status==="En tratamiento").length;
  const completed=patients.filter(p=>p.status==="Alta").length;
  const newM=patients.filter(p=>{ const d=new Date(p.createdAt),n=new Date(); return d.getMonth()===n.getMonth()&&d.getFullYear()===n.getFullYear(); }).length;
  const stats=[{label:"Mis pacientes",value:total,icon:"users",color:C.olive},{label:"En tratamiento",value:active,icon:"tooth",color:C.gold},{label:"Altas",value:completed,icon:"check",color:C.oliveLight},{label:"Nuevos este mes",value:newM,icon:"calendar",color:C.goldDark}];
  const recent=[...patients].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,5);
  return (
    <div className="fade-in">
      <div style={{marginBottom:28}}>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:30,fontWeight:400,color:C.graphiteDk}}>Bienvenido, <em style={{color:especialista.color}}>{especialista.corto}</em></div>
        <p style={{color:C.muted,fontSize:13,marginTop:4}}>{new Date().toLocaleDateString("es-MX",{weekday:"long",year:"numeric",month:"long",day:"numeric"})} · Cédula {especialista.cedula_prof}</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:14,marginBottom:28}}>
        {stats.map(s=>(
          <Card key={s.label} style={{padding:"16px 18px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <div style={{fontSize:10,color:C.muted,fontWeight:500,textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>{s.label}</div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:36,fontWeight:500,color:s.color,lineHeight:1}}>{s.value}</div>
              </div>
              <div style={{width:36,height:36,borderRadius:10,background:s.color+"15",display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Icon name={s.icon} size={17} color={s.color}/>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {/* COFEPRIS info card */}
      <Card style={{marginBottom:20,background:C.graphiteDk}}>
        <div style={{display:"flex",alignItems:"center",gap:14,flexWrap:"wrap"}}>
          <Icon name="shield" size={24} color={C.gold}/>
          <div style={{flex:1}}>
            <div style={{fontWeight:600,fontSize:14,color:C.white}}>{especialista.nombre}</div>
            <div style={{fontSize:12,color:"rgba(255,255,255,.5)",marginTop:2}}>
              Cédula Profesional: <strong style={{color:C.gold}}>{especialista.cedula_prof}</strong>
              {especialista.cedula_esp&&<> · Cédula Especialidad: <strong style={{color:C.gold}}>{especialista.cedula_esp}</strong></>}
              <span style={{marginLeft:8}}>· {especialista.rol}</span>
            </div>
          </div>
          <Badge color={C.gold}>COFEPRIS</Badge>
        </div>
      </Card>
      <Card>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:500}}>Pacientes recientes</h3>
          <Btn variant="outline" small icon="users" onClick={()=>setActive("patients")}>Ver todos</Btn>
        </div>
        {recent.length===0?(
          <div style={{textAlign:"center",padding:"36px 0",color:C.muted}}>
            <Icon name="users" size={36} color={C.goldLight} style={{display:"block",margin:"0 auto 12px"}}/>
            <p style={{fontSize:14}}>Sin pacientes aún</p>
            <Btn variant="gold" style={{marginTop:14}} icon="plus" onClick={()=>setActive("new")}>Agregar primer paciente</Btn>
          </div>
        ):recent.map((p,i)=>(
          <div key={p.id} onClick={()=>{setSelectedPatient(p);setActive("record")}}
            style={{display:"flex",alignItems:"center",gap:14,padding:"11px 8px",borderBottom:i<recent.length-1?`1px solid ${C.border}`:"none",cursor:"pointer",borderRadius:8,transition:"background .15s"}}
            onMouseEnter={e=>e.currentTarget.style.background=C.cream}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <div style={{width:38,height:38,borderRadius:"50%",background:C.goldLight,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cormorant Garamond',serif",fontSize:15,fontWeight:600,color:C.goldDark,flexShrink:0}}>
              {(p.nombre?.[0]||"?").toUpperCase()}{(p.apellidoPaterno?.[0]||"").toUpperCase()}
            </div>
            <div style={{flex:1}}>
              <div style={{fontWeight:500,fontSize:14}}>{p.nombre} {p.apellidoPaterno} {p.apellidoMaterno}</div>
              <div style={{fontSize:12,color:C.muted}}>{p.expediente} · {p.diagnostico||"Sin diagnóstico"}</div>
            </div>
            <Badge color={p.status==="En tratamiento"?C.olive:p.status==="Alta"?C.goldDark:C.muted}>{p.status||"Nuevo"}</Badge>
          </div>
        ))}
      </Card>
    </div>
  );
};

// ─── PATIENT LIST ─────────────────────────────────────────────────────────────
const PatientList = ({ patients, setActive, setSelectedPatient, onDelete }) => {
  const [q,setQ]=useState(""); const [fs,setFs]=useState("Todos");
  const filtered=patients.filter(p=>`${p.nombre} ${p.apellidoPaterno} ${p.apellidoMaterno} ${p.expediente}`.toLowerCase().includes(q.toLowerCase())&&(fs==="Todos"||p.status===fs));
  return (
    <div className="fade-in">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
        <div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:500}}>Mis expedientes</h2>
          <p style={{color:C.muted,fontSize:13,marginTop:4}}>{patients.length} pacientes · Supabase</p>
        </div>
        <Btn variant="gold" icon="plus" onClick={()=>setActive("new")}>Nuevo paciente</Btn>
      </div>
      <Card style={{marginBottom:16,padding:"12px 16px"}}>
        <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"center"}}>
          <div style={{flex:1,minWidth:180,position:"relative"}}>
            <Icon name="search" size={14} color={C.muted} style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)"}}/>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar paciente..."
              style={{width:"100%",padding:"7px 12px 7px 32px",border:`1px solid ${C.border}`,borderRadius:8,fontSize:13,background:C.warmWhite,outline:"none"}}/>
          </div>
          {["Todos","Nuevo","En tratamiento","Retención","Alta"].map(s=>(
            <button key={s} onClick={()=>setFs(s)} style={{padding:"6px 14px",borderRadius:20,border:`1px solid ${fs===s?C.olive:C.border}`,background:fs===s?C.olive:"transparent",color:fs===s?C.white:C.muted,fontSize:12,cursor:"pointer",transition:"all .15s"}}>{s}</button>
          ))}
        </div>
      </Card>
      {filtered.length===0?(
        <Card style={{textAlign:"center",padding:"50px 20px"}}>
          <Icon name="users" size={40} color={C.goldLight} style={{display:"block",margin:"0 auto 16px"}}/>
          <p style={{color:C.muted}}>{q?"Sin resultados":"Sin pacientes aún"}</p>
          {!q&&<Btn variant="gold" style={{marginTop:16}} icon="plus" onClick={()=>setActive("new")}>Agregar paciente</Btn>}
        </Card>
      ):(
        <Card style={{padding:0,overflow:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{background:C.cream}}>
              {["Paciente","Expediente","Edad","Diagnóstico","Estado","Acciones"].map(h=>(
                <th key={h} style={{padding:"11px 16px",textAlign:"left",fontSize:11,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:.5}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>{filtered.map(p=>(
              <tr key={p.id} style={{borderTop:`1px solid ${C.border}`,transition:"background .1s"}}
                onMouseEnter={e=>e.currentTarget.style.background=C.warmWhite}
                onMouseLeave={e=>e.currentTarget.style.background=C.white}>
                <td style={{padding:"12px 16px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:34,height:34,borderRadius:"50%",background:C.goldLight,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cormorant Garamond',serif",fontSize:14,fontWeight:600,color:C.goldDark,flexShrink:0}}>{(p.nombre?.[0]||"?").toUpperCase()}</div>
                    <div><div style={{fontWeight:500,fontSize:14}}>{p.nombre} {p.apellidoPaterno}</div><div style={{fontSize:11,color:C.muted}}>{p.telefono||"—"}</div></div>
                  </div>
                </td>
                <td style={{padding:"12px 16px",fontSize:13,color:C.muted,fontWeight:500}}>{p.expediente}</td>
                <td style={{padding:"12px 16px",fontSize:13}}>{p.edad?`${p.edad}a`:"—"}</td>
                <td style={{padding:"12px 16px",fontSize:12,color:C.muted,maxWidth:140}}><div style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.diagnostico||"Pendiente"}</div></td>
                <td style={{padding:"12px 16px"}}><Badge color={p.status==="En tratamiento"?C.olive:p.status==="Alta"?C.goldDark:p.status==="Retención"?C.gold:C.muted}>{p.status||"Nuevo"}</Badge></td>
                <td style={{padding:"12px 16px"}}>
                  <div style={{display:"flex",gap:4}}>
                    <Btn variant="ghost" small icon="file" onClick={()=>{setSelectedPatient(p);setActive("record")}}>Ver</Btn>
                    <Btn variant="ghost" small icon="edit" onClick={()=>{setSelectedPatient(p);setActive("edit")}}>Editar</Btn>
                    <Btn variant="danger" small icon="trash" onClick={()=>{if(confirm("¿Eliminar expediente?"))onDelete(p.id)}}>Borrar</Btn>
                  </div>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </Card>
      )}
    </div>
  );
};

// ─── CLINICAL FORM ────────────────────────────────────────────────────────────
const INITIAL={id:"",expediente:"",createdAt:"",status:"Nuevo",especialistaId:"",nombre:"",apellidoPaterno:"",apellidoMaterno:"",fechaNacimiento:"",edad:"",sexo:"",curp:"",telefono:"",email:"",calle:"",colonia:"",cp:"",municipio:"",estado:"",ocupacion:"",tutor:"",parentesco:"",antHeredofam:[],antPersonalesPatol:[],medicamentos:"",alergias:"",tabaco:"",alcohol:"",antEstomat:[],motivoConsulta:"",tipoMaloclusionRef:"",motivoPred:"",expectativas:"",biotipo:"",simetria:"",perfil:"",lineaMedia:"",tercioInf:"",labios:"",encias:"",atm:"",habitos:[],odontograma:{},overjet:"",overbite:"",apinamientoSup:"",apinamientoInf:"",angleClass:"",diagnostico:"",severidad:"",tipoPlanTx:"",extraccion:"",cirugia:"",pronostico:"",duracionTx:"",anb:"",sna:"",snb:"",sistemaCefalo:"",objetivosTx:"",aparatologia:"",prescripcion:"",extraccionPlanif:"",anclaje:"",faseI:"",faseII:"",faseIII:"",costoTotal:"",formaPago:"",inicioTx:"",finTx:"",seguimientoNotas:[],pagos:[]};
const SECS=[{id:"datos",label:"Datos",icon:"file",nom:"Art. 7.1"},{id:"antec",label:"Antecedentes",icon:"alert",nom:"Art. 7.2"},{id:"motivo",label:"Motivo",icon:"tooth",nom:"Art. 7.3"},{id:"explor",label:"Exploración",icon:"search",nom:"Art. 7.4"},{id:"diag",label:"Diagnóstico",icon:"chart",nom:"Art. 8"},{id:"plan",label:"Plan de tx",icon:"calendar",nom:"Art. 10"}];

// ── ODONTOGRAMA PENTAPARTITO ──────────────────────────────────────────────────
const FACE_STATES = {
  "": { label:"Sano", color:"#F9FAFB", border:"#E5E7EB" },
  "C": { label:"Caries", color:"#FEE2E2", border:"#EF4444" },
  "R": { label:"Restaurado", color:"#DBEAFE", border:"#3B82F6" },
  "S": { label:"Sellador", color:"#FEF9C3", border:"#EAB308" },
};

const TOOTH_STATES = {
  "": { label:"Normal", bg:"transparent", border:C.border, text:C.muted },
  "Au": { label:"Ausente", bg:"#F3F4F6", border:"#6B7280", text:"#6B7280" },
  "Ei": { label:"Extrac. indicada", bg:"#FEE2E2", border:"#EF4444", text:"#EF4444" },
  "Co": { label:"Corona/Prót. fija", bg:"#DBEAFE", border:"#3B82F6", text:"#3B82F6" },
  "Im": { label:"Implante", bg:"#F3E8FF", border:"#A855F7", text:"#A855F7" },
  "Ze": { label:"Zona edéntula", bg:"#F1F5F9", border:"#94A3B8", text:"#94A3B8" },
  "Pr": { label:"Prót. removible", bg:"#FEF3C7", border:"#F59E0B", text:"#F59E0B" },
  "Ep": { label:"Enf. periodontal", bg:"#FFF1F2", border:"#F43F5E", text:"#F43F5E" },
  "En": { label:"Endodoncia", bg:"#EDE9FE", border:"#8B5CF6", text:"#8B5CF6" },
  "Rr": { label:"Resto radicular", bg:"#FFF7ED", border:"#EA580C", text:"#EA580C" },
  "Dr": { label:"Diente retenido", bg:"#F0FDF4", border:"#16A34A", text:"#16A34A" },
};

const UPPER = [[18,17,16,15,14,13,12,11],[21,22,23,24,25,26,27,28]];
const LOWER = [[48,47,46,45,44,43,42,41],[31,32,33,34,35,36,37,38]];
// faces: top=vestibular, bottom=lingual, left=mesial, right=distal, center=oclusal
const FACES = ["top","left","center","right","bottom"];

const Odontograma = ({ value={}, onChange }) => {
  const [selected, setSelected] = useState(null); // {num, mode} mode: 'tooth'|'face'|null
  const [selFace, setSelFace] = useState(null);

  const getToothState = (num) => value[`t_${num}`] || "";
  const getFaceState = (num, face) => value[`f_${num}_${face}`] || "";

  const setToothState = (num, state) => {
    onChange({...value, [`t_${num}`]: state});
    setSelected(null);
  };
  const setFaceState = (num, face, state) => {
    onChange({...value, [`f_${num}_${face}`]: state});
    setSelFace(null);
  };

  const FaceCell = ({num, face, size=10}) => {
    const st = FACE_STATES[getFaceState(num,face)] || FACE_STATES[""];
    const isCenter = face==="center";
    const positions = {
      top:{gridColumn:"2",gridRow:"1"},
      left:{gridColumn:"1",gridRow:"2"},
      center:{gridColumn:"2",gridRow:"2"},
      right:{gridColumn:"3",gridRow:"2"},
      bottom:{gridColumn:"2",gridRow:"3"},
    };
    return (
      <div onClick={(e)=>{e.stopPropagation();setSelFace({num,face});setSelected(null);}}
        style={{...positions[face],width:size,height:size,background:st.color,border:`1px solid ${st.border}`,cursor:"pointer",borderRadius:isCenter?2:1,transition:"all .1s"}}/>
    );
  };

  const ToothDiagram = ({num}) => {
    const ts = getToothState(num);
    const tst = TOOTH_STATES[ts] || TOOTH_STATES[""];
    const isSelected = selected?.num===num;
    const hasState = ts !== "";
    return (
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:1}}>
        <div style={{fontSize:7,color:C.muted,fontWeight:600,lineHeight:1}}>{num}</div>
        {/* Pentapartite diagram */}
        <div style={{position:"relative",width:32,height:32}}>
          {/* tooth state overlay */}
          {hasState && (
            <div style={{position:"absolute",inset:0,background:tst.bg,border:`2px solid ${tst.border}`,borderRadius:4,zIndex:1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,fontWeight:700,color:tst.text}}>{ts}</div>
          )}
          {!hasState && (
            <div style={{display:"grid",gridTemplateColumns:"10px 10px 10px",gridTemplateRows:"10px 10px 10px",gap:1,padding:1,background:isSelected?"#1C1C1E20":"transparent",borderRadius:4,border:`1px solid ${isSelected?C.graphiteDk:C.border}`,cursor:"pointer"}}
              onClick={()=>setSelected(isSelected?null:{num})}>
              {FACES.map(f=><FaceCell key={f} num={num} face={f} size={10}/>)}
            </div>
          )}
          {hasState && (
            <div style={{position:"absolute",inset:0,zIndex:2,cursor:"pointer",borderRadius:4}} onClick={()=>setSelected(isSelected?null:{num})}/>
          )}
        </div>
      </div>
    );
  };

  const allNums = [...UPPER[0],...UPPER[1],...LOWER[0],...LOWER[1]];
  const usedCount = allNums.filter(n=>getToothState(n)!=="").length;

  return (
    <div style={{background:C.cream,borderRadius:12,padding:14}}>

      {/* Tooth state selector popup */}
      {selected && (
        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:10,padding:12,marginBottom:12}}>
          <div style={{fontSize:11,fontWeight:600,color:C.graphite,marginBottom:8}}>Diente {selected.num} — Estado general:</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {Object.entries(TOOTH_STATES).map(([k,v])=>(
              <button key={k} onClick={()=>setToothState(selected.num,k)}
                style={{padding:"4px 10px",borderRadius:8,border:`1px solid ${v.border}`,background:v.bg,color:v.text||C.muted,fontSize:10,fontWeight:600,cursor:"pointer"}}>
                {k||"Sano"} — {v.label}
              </button>
            ))}
          </div>
          <button onClick={()=>setSelected(null)} style={{marginTop:8,fontSize:11,color:C.muted,background:"none",border:"none",cursor:"pointer"}}>✕ Cerrar</button>
        </div>
      )}

      {/* Face state selector popup */}
      {selFace && (
        <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:10,padding:12,marginBottom:12}}>
          <div style={{fontSize:11,fontWeight:600,color:C.graphite,marginBottom:8}}>
            Diente {selFace.num} — Cara {selFace.face==="top"?"Vestibular":selFace.face==="bottom"?"Lingual/Palatino":selFace.face==="left"?"Mesial":selFace.face==="right"?"Distal":"Oclusal/Incisal"}:
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {Object.entries(FACE_STATES).map(([k,v])=>(
              <button key={k} onClick={()=>setFaceState(selFace.num,selFace.face,k)}
                style={{padding:"4px 10px",borderRadius:8,border:`1px solid ${v.border}`,background:v.color,color:C.graphite,fontSize:10,fontWeight:600,cursor:"pointer"}}>
                {k||"Sano"} — {v.label}
              </button>
            ))}
          </div>
          <button onClick={()=>setSelFace(null)} style={{marginTop:8,fontSize:11,color:C.muted,background:"none",border:"none",cursor:"pointer"}}>✕ Cerrar</button>
        </div>
      )}

      {/* SUPERIOR */}
      <div style={{fontSize:9,color:C.muted,textAlign:"center",marginBottom:6,fontWeight:600,letterSpacing:1}}>SUPERIOR</div>
      <div style={{display:"flex",justifyContent:"center",gap:3,marginBottom:4,overflowX:"auto",paddingBottom:4}}>
        {UPPER[0].map(n=><ToothDiagram key={n} num={n}/>)}
        <div style={{width:12,flexShrink:0}}/>
        {UPPER[1].map(n=><ToothDiagram key={n} num={n}/>)}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8,margin:"6px 0"}}>
        <div style={{flex:1,borderTop:`2px dashed ${C.border}`}}/>
        <span style={{fontSize:9,color:C.muted,fontWeight:600}}>LÍNEA MEDIA</span>
        <div style={{flex:1,borderTop:`2px dashed ${C.border}`}}/>
      </div>
      {/* INFERIOR */}
      <div style={{display:"flex",justifyContent:"center",gap:3,marginTop:4,overflowX:"auto",paddingBottom:4}}>
        {LOWER[0].map(n=><ToothDiagram key={n} num={n}/>)}
        <div style={{width:12,flexShrink:0}}/>
        {LOWER[1].map(n=><ToothDiagram key={n} num={n}/>)}
      </div>
      <div style={{fontSize:9,color:C.muted,textAlign:"center",marginTop:6,fontWeight:600,letterSpacing:1}}>INFERIOR</div>

      {/* Legend */}
      <div style={{marginTop:14,paddingTop:12,borderTop:`1px solid ${C.border}`}}>
        <div style={{fontSize:10,fontWeight:600,color:C.muted,marginBottom:8}}>ESTADO GENERAL DEL DIENTE</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:10}}>
          {Object.entries(TOOTH_STATES).filter(([k])=>k!=="").map(([k,v])=>(
            <span key={k} style={{fontSize:9,padding:"2px 7px",borderRadius:8,background:v.bg,border:`1px solid ${v.border}`,color:v.text,fontWeight:600}}>{k} {v.label}</span>
          ))}
        </div>
        <div style={{fontSize:10,fontWeight:600,color:C.muted,marginBottom:6}}>CARAS DEL DIENTE</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:10}}>
          {Object.entries(FACE_STATES).filter(([k])=>k!=="").map(([k,v])=>(
            <span key={k} style={{fontSize:9,padding:"2px 7px",borderRadius:8,background:v.color,border:`1px solid ${v.border}`,color:C.graphite,fontWeight:600}}>{k} {v.label}</span>
          ))}
        </div>
        <div style={{fontSize:9,color:C.muted,lineHeight:1.5}}>
          • Toca el diente para asignar estado general · Toca una cara para marcar caries, restauración o sellador<br/>
          • Caras: V=Vestibular · L=Lingual · M=Mesial · D=Distal · O=Oclusal/Incisal
        </div>
      </div>

      {/* Anotaciones libres */}
      <div style={{marginTop:12}}>
        <div style={{fontSize:11,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>Anotaciones del odontograma</div>
        <textarea
          value={value["notas"]||""}
          onChange={e=>onChange({...value,notas:e.target.value})}
          placeholder="Observaciones generales, zona edéntula extensa, plan de prótesis, condición periodontal general..."
          rows={3}
          style={{width:"100%",padding:"9px 12px",border:`1px solid ${C.border}`,borderRadius:8,fontSize:12,background:C.white,resize:"vertical",outline:"none",lineHeight:1.6,fontFamily:"inherit"}}
        />
      </div>
    </div>
  );
};

// ── Sub-components defined OUTSIDE ClinicalForm to prevent focus loss ────────
const G2=({children})=><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>{children}</div>;
const G3=({children})=><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>{children}</div>;
const Sep=({label})=><div style={{fontSize:11,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:.6,marginTop:16,marginBottom:8,paddingBottom:6,borderBottom:`1px solid ${C.border}`}}>{label}</div>;
const RadioField=({label,field,value,onChange,options})=>(
  <div style={{display:"flex",flexDirection:"column",gap:6}}>
    {label&&<div style={{fontSize:11,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:.5}}>{label}</div>}
    <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
      {options.map(o=><button key={o} type="button" onClick={()=>onChange(field,o)} style={{padding:"5px 12px",borderRadius:20,border:`1px solid ${value===o?C.olive:C.border}`,background:value===o?C.olive:"transparent",color:value===o?C.white:C.muted,fontSize:12,cursor:"pointer",transition:"all .15s"}}>{o}</button>)}
    </div>
  </div>
);
const ChecksField=({field,values,onChange,options})=>(
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:7}}>
    {options.map(o=><label key={o} style={{display:"flex",alignItems:"center",gap:7,fontSize:13,cursor:"pointer",color:C.graphite}}><input type="checkbox" checked={(values||[]).includes(o)} onChange={()=>onChange(field,o)} style={{accentColor:C.olive,width:14,height:14}}/>{o}</label>)}
  </div>
);

const ClinicalForm = ({ initial=null, onSave, onCancel, especialista }) => {
  const [p,setP]=useState(initial?{...initial}:{...INITIAL,id:DB.newId(),createdAt:new Date().toISOString(),expediente:`EXP-${Date.now().toString().slice(-6)}`,especialistaId:especialista.id});
  const [sec,setSec]=useState("datos"); const [saving,setSaving]=useState(false);
  const set=(f,v)=>setP(prev=>({...prev,[f]:v}));
  const toggle=(f,v)=>{const a=p[f]||[];set(f,a.includes(v)?a.filter(x=>x!==v):[...a,v]);};
  const Radio=({label,field,options})=><RadioField label={label} field={field} value={p[field]} onChange={set} options={options}/>;
  const Checks=({field,options})=><ChecksField field={field} values={p[field]} onChange={toggle} options={options}/>;
  const renderSec=()=>{
    if(sec==="datos") return <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <G3><Input label="Nombre(s)" value={p.nombre} onChange={v=>set("nombre",v)} required/><Input label="Apellido paterno" value={p.apellidoPaterno} onChange={v=>set("apellidoPaterno",v)} required/><Input label="Apellido materno" value={p.apellidoMaterno} onChange={v=>set("apellidoMaterno",v)}/></G3>
      <G3><Input label="Fecha nacimiento" type="date" value={p.fechaNacimiento} onChange={v=>set("fechaNacimiento",v)}/><Input label="Edad" type="number" value={p.edad} onChange={v=>set("edad",v)}/><Input label="Sexo" value={p.sexo} onChange={v=>set("sexo",v)} options={["Masculino","Femenino","No especificado"]}/></G3>
      <G3><Input label="CURP" value={p.curp} onChange={v=>set("curp",v)} placeholder="18 caracteres"/><Input label="Teléfono" type="tel" value={p.telefono} onChange={v=>set("telefono",v)}/><Input label="Correo" type="email" value={p.email} onChange={v=>set("email",v)}/></G3>
      <G3><Input label="Calle y número" value={p.calle} onChange={v=>set("calle",v)}/><Input label="Colonia" value={p.colonia} onChange={v=>set("colonia",v)}/><Input label="C.P." value={p.cp} onChange={v=>set("cp",v)}/></G3>
      <G3><Input label="Municipio" value={p.municipio} onChange={v=>set("municipio",v)}/><Input label="Estado" value={p.estado} onChange={v=>set("estado",v)} options={["Guanajuato","Querétaro","Aguascalientes","CDMX","Jalisco","Nuevo León","Otro"]}/><Input label="Ocupación" value={p.ocupacion} onChange={v=>set("ocupacion",v)}/></G3>
      <G2><Input label="Tutor (menores)" value={p.tutor} onChange={v=>set("tutor",v)}/><Input label="Parentesco" value={p.parentesco} onChange={v=>set("parentesco",v)}/></G2>
      <G2><Input label="Estado del tratamiento" value={p.status} onChange={v=>set("status",v)} options={["Nuevo","En tratamiento","Retención","Alta","Suspendido"]}/><div style={{display:"flex",flexDirection:"column",gap:5}}><div style={{fontSize:11,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:.5}}>No. expediente</div><div style={{padding:"9px 12px",border:`1px solid ${C.border}`,borderRadius:8,fontSize:13,color:C.muted,background:C.cream}}>{p.expediente}</div></div></G2>
    </div>;
    if(sec==="antec") return <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <Sep label="Heredo-familiares"/><Checks field="antHeredofam" options={["Diabetes mellitus","Hipertensión arterial","Cardiopatías","Cáncer oral","Labio y paladar hendido","Displasias esqueléticas","Problemas de coagulación","Alergias hereditarias"]}/>
      <Sep label="Personales patológicos"/><Checks field="antPersonalesPatol" options={["Asma / Alergias","Diabetes","Hipertensión","Cardiopatías","Epilepsia","VIH / SIDA","Hepatitis","Artritis reumatoide","Osteoporosis","Tiroides","Coagulación","Cáncer"]}/>
      <G2><Input label="Medicamentos actuales" value={p.medicamentos} onChange={v=>set("medicamentos",v)} multiline/><Input label="Alergias" value={p.alergias} onChange={v=>set("alergias",v)} multiline/></G2>
      <G2><Radio label="¿Fuma?" field="tabaco" options={["No","Sí","Ex-fumador"]}/><Radio label="¿Alcohol?" field="alcohol" options={["No","Ocasional","Frecuente"]}/></G2>
      <Sep label="Estomatológicos"/><Checks field="antEstomat" options={["Ortodoncia previa","Extracciones","Cirugía maxilofacial","Implantes","Apnea del sueño","Bruxismo","Problemas ATM","Caries activa","Enfermedad periodontal"]}/>
    </div>;
    if(sec==="motivo") return <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Input label="Motivo principal (palabras del paciente)" value={p.motivoConsulta} onChange={v=>set("motivoConsulta",v)} multiline rows={3}/>
      <Radio label="Tipo de maloclusión referida" field="tipoMaloclusionRef" options={["Dientes chuecos","Espacios","Mordida cruzada","Mordida abierta","Prognatismo","Retrognatismo","Otro"]}/>
      <Radio label="Motivo predominante" field="motivoPred" options={["Estético","Funcional","Ambos","Referido por médico","Referido por odontólogo"]}/>
      <Input label="Expectativas del paciente" value={p.expectativas} onChange={v=>set("expectativas",v)} multiline rows={3}/>
    </div>;
    if(sec==="explor") return <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <Sep label="Facies y perfil"/>
      <G2><Radio label="Biotipo" field="biotipo" options={["Dolicofacial","Mesofacial","Braquifacial"]}/><Radio label="Perfil" field="perfil" options={["Recto","Convexo","Cóncavo"]}/></G2>
      <G2><Radio label="Simetría" field="simetria" options={["Simétrico","Asimetría leve","Asimetría marcada"]}/><Radio label="Línea media" field="lineaMedia" options={["Centrada","Desviada derecha","Desviada izquierda"]}/></G2>
      <Sep label="Tejidos blandos y ATM"/>
      <G2><Radio label="Encías" field="encias" options={["Sanas","Inflamadas","Recesión","Hiperplasia"]}/><Radio label="ATM" field="atm" options={["Sin alteración","Ruidos","Dolor","Limitación"]}/></G2>
      <Sep label="Hábitos deletéreos"/><Checks field="habitos" options={["Succión digital","Interposición labial","Interposición lingual","Onicofagia","Bruxismo","Respiración oral","Deglución atípica"]}/>
      <Sep label="Odontograma — Sistema FDI (ISO 3950)"/>
      <Odontograma value={p.odontograma||{}} onChange={v=>set("odontograma",v)}/>
      <Sep label="Medidas oclusales"/>
      <G3><Input label="Overjet (mm)" type="number" value={p.overjet} onChange={v=>set("overjet",v)}/><Input label="Overbite (mm)" type="number" value={p.overbite} onChange={v=>set("overbite",v)}/><Input label="Apiñamiento sup." type="number" value={p.apinamientoSup} onChange={v=>set("apinamientoSup",v)}/></G3>
      <Sep label="Clasificación de Angle"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
        {[{cls:"Clase I",desc:"Relación molar normal"},{cls:"Clase II",desc:"Molar sup. adelantada"},{cls:"Clase III",desc:"Molar inf. adelantada"}].map(a=>(
          <div key={a.cls} onClick={()=>set("angleClass",a.cls)} style={{padding:12,border:`2px solid ${p.angleClass===a.cls?C.olive:C.border}`,borderRadius:10,cursor:"pointer",background:p.angleClass===a.cls?C.olive+"10":C.white,textAlign:"center",transition:"all .15s"}}>
            <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,color:p.angleClass===a.cls?C.olive:C.graphiteDk}}>{a.cls}</div>
            <div style={{fontSize:11,color:C.muted,marginTop:3}}>{a.desc}</div>
          </div>
        ))}
      </div>
    </div>;
    if(sec==="diag") return <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Input label="Diagnóstico principal (CIE-10)" value={p.diagnostico} onChange={v=>set("diagnostico",v)} placeholder="Ej: K07.0 Maloclusión — Apiñamiento severo Clase II div 1"/>
      <G2><Radio label="Severidad" field="severidad" options={["Leve","Moderado","Severo","Complejo"]}/><Radio label="Tipo tratamiento" field="tipoPlanTx" options={["Ortodoncia fija","Alineadores","Combinado","Ortopédico"]}/></G2>
      <G2><Radio label="¿Extracción?" field="extraccion" options={["No","Sí","Por definir"]}/><Radio label="¿Cirugía?" field="cirugia" options={["No","Sí","Por evaluar"]}/></G2>
      <G2><Radio label="Pronóstico" field="pronostico" options={["Favorable","Reservado","Desfavorable"]}/><Input label="Duración estimada" value={p.duracionTx} onChange={v=>set("duracionTx",v)} options={["6-12 meses","12-18 meses","18-24 meses","24-30 meses","Más de 30 meses"]}/></G2>
      <Sep label="Análisis cefalométrico"/>
      <G3><Input label="ANB (°)" type="number" value={p.anb} onChange={v=>set("anb",v)}/><Input label="SNA (°)" type="number" value={p.sna} onChange={v=>set("sna",v)}/><Input label="SNB (°)" type="number" value={p.snb} onChange={v=>set("snb",v)}/></G3>
      <Input label="Sistema de análisis" value={p.sistemaCefalo} onChange={v=>set("sistemaCefalo",v)} options={["Steiner","Ricketts","Tweed","McNamara","Jarabak","Downs"]}/>
    </div>;
    if(sec==="plan") return <div style={{display:"flex",flexDirection:"column",gap:14}}>
      <Input label="Objetivos del tratamiento" value={p.objetivosTx} onChange={v=>set("objetivosTx",v)} multiline rows={3}/>
      <G2><Input label="Aparatología" value={p.aparatologia} onChange={v=>set("aparatologia",v)} options={["Brackets metálicos","Brackets autoligado","Brackets cerámicos","Alineadores Invisalign","Alineadores genéricos","Combinado"]}/><Input label="Prescripción" value={p.prescripcion} onChange={v=>set("prescripcion",v)} options={["MBT","Roth","Andrews","McLaughlin-Bennett","Ricketts"]}/></G2>
      <G2><Input label="Extracciones planificadas" value={p.extraccionPlanif} onChange={v=>set("extraccionPlanif",v)} placeholder="Ej: 14, 24, 34, 44"/><Radio label="Anclaje" field="anclaje" options={["Sin anclaje","Máximo","Moderado","Mínimo","Microimplantes"]}/></G2>
      <G2><Input label="Inicio estimado" type="date" value={p.inicioTx} onChange={v=>set("inicioTx",v)}/><Input label="Fin estimado" type="date" value={p.finTx} onChange={v=>set("finTx",v)}/></G2>
      <Input label="Fase I — Preparatoria" value={p.faseI} onChange={v=>set("faseI",v)} multiline rows={2}/>
      <Input label="Fase II — Ortodoncia activa" value={p.faseII} onChange={v=>set("faseII",v)} multiline rows={2}/>
      <Input label="Fase III — Retención" value={p.faseIII} onChange={v=>set("faseIII",v)} multiline rows={2}/>
      <G2><Input label="Costo total ($)" type="number" value={p.costoTotal} onChange={v=>set("costoTotal",v)}/><Input label="Forma de pago" value={p.formaPago} onChange={v=>set("formaPago",v)} options={["Pago único","Mensualidades sin interés","Mensualidades con financiamiento","Seguro dental"]}/></G2>
    </div>;
  };

  const sIdx=SECS.findIndex(s=>s.id===sec);
  return (
    <div className="fade-in">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
        <div>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:500}}>{initial?"Editar expediente":"Nuevo paciente"}</h2>
          <p style={{color:C.muted,fontSize:13,marginTop:4}}>Exp. {p.expediente} · {especialista.nombre}</p>
        </div>
        <div style={{display:"flex",gap:10}}>
          <Btn variant="outline" icon="x" onClick={onCancel}>Cancelar</Btn>
          <Btn variant="gold" icon="save" onClick={async()=>{setSaving(true);try{await onSave(p);}finally{setSaving(false);}}} loading={saving}>Guardar</Btn>
        </div>
      </div>
      <div style={{display:"flex",gap:4,marginBottom:20,overflowX:"auto",paddingBottom:4}}>
        {SECS.map(s=>(
          <button key={s.id} onClick={()=>setSec(s.id)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"9px 12px",borderRadius:10,border:`1px solid ${sec===s.id?C.olive:C.border}`,background:sec===s.id?C.olive:C.white,color:sec===s.id?C.white:C.muted,cursor:"pointer",flexShrink:0,transition:"all .15s",minWidth:86}}>
            <Icon name={s.icon} size={14} color="currentColor"/>
            <span style={{fontSize:10,fontWeight:600,textAlign:"center",lineHeight:1.3}}>{s.label}</span>
            <span style={{fontSize:9,opacity:.6}}>{s.nom}</span>
          </button>
        ))}
      </div>
      <Card>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18,paddingBottom:14,borderBottom:`1px solid ${C.border}`}}>
          <div style={{width:30,height:30,borderRadius:8,background:C.olive+"15",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name={SECS[sIdx].icon} size={15} color={C.olive}/></div>
          <div><div style={{fontWeight:600,fontSize:14}}>{SECS[sIdx].label}</div><div style={{fontSize:11,color:C.muted}}>{SECS[sIdx].nom}</div></div>
          <span style={{marginLeft:"auto",fontSize:10,padding:"2px 9px",borderRadius:20,background:C.olive+"15",color:C.olive,fontWeight:600}}>NOM-013</span>
        </div>
        {renderSec()}
        <div style={{display:"flex",justifyContent:"space-between",marginTop:22,paddingTop:14,borderTop:`1px solid ${C.border}`}}>
          <Btn variant="outline" onClick={()=>sIdx>0&&setSec(SECS[sIdx-1].id)} style={{opacity:sIdx===0?0:1}}>← Anterior</Btn>
          {sIdx<SECS.length-1?<Btn variant="primary" onClick={()=>setSec(SECS[sIdx+1].id)}>Siguiente →</Btn>
          :<Btn variant="gold" icon="save" onClick={async()=>{setSaving(true);try{await onSave(p);}finally{setSaving(false);}}} loading={saving}>Guardar expediente</Btn>}
        </div>
      </Card>
    </div>
  );
};

// ─── PATIENT RECORD ───────────────────────────────────────────────────────────
const PatientRecord = ({ patient, setActive, onAddNota, onAddPago, especialista }) => {
  const [tab,setTab]=useState("info");
  const [noteText,setNoteText]=useState(""); const [addingNote,setAddingNote]=useState(false);
  const [pagoMonto,setPagoMonto]=useState(""); const [pagoConcepto,setPagoConcepto]=useState(""); const [pagoMetodo,setPagoMetodo]=useState(""); const [addingPago,setAddingPago]=useState(false);
  const [saving,setSaving]=useState(false);
  const [sigPad,setSigPad]=useState(null); // {type:'nota'|'pago', callback}
  const [pendingFirma,setPendingFirma]=useState(null);

  const sc=patient.status==="En tratamiento"?C.olive:patient.status==="Alta"?C.goldDark:C.muted;
  const totalPagado=(patient.pagos||[]).reduce((s,p)=>s+parseFloat(p.monto||0),0);
  const totalTx=parseFloat(patient.costoTotal||0);
  const saldo=totalTx-totalPagado;

  const IR=({label,value})=>value?(<div style={{display:"flex",gap:10,padding:"7px 0",borderBottom:`1px solid ${C.border}`}}><span style={{fontSize:12,color:C.muted,fontWeight:500,minWidth:130,flexShrink:0}}>{label}</span><span style={{fontSize:13,color:C.graphiteDk}}>{value}</span></div>):null;

  const handleSaveNota=async(firmaData)=>{
    setSaving(true);
    try{ await onAddNota(patient.id,noteText,especialista.nombre,firmaData); setNoteText(""); setAddingNote(false); setPendingFirma(null); }
    catch(e){}finally{setSaving(false);}
  };
  const handleSavePago=async(firmaData)=>{
    setSaving(true);
    try{ await onAddPago(patient.id,pagoMonto,pagoConcepto,pagoMetodo,firmaData); setPagoMonto(""); setPagoConcepto(""); setPagoMetodo(""); setAddingPago(false); setPendingFirma(null); }
    catch(e){}finally{setSaving(false);}
  };

  const TABS=[{id:"info",label:"Información"},{id:"seguimiento",label:"Notas clínicas"},{id:"pagos",label:"Pagos"}];

  return (
    <div className="fade-in">
      {sigPad && (
        <SignaturePad
          title={sigPad.type==="nota"?"Firmar nota clínica":"Firmar recibo de pago"}
          onSave={(data)=>{ setSigPad(null); sigPad.callback(data); }}
          onCancel={()=>setSigPad(null)}
        />
      )}
      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <div style={{width:54,height:54,borderRadius:"50%",background:C.goldLight,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,color:C.goldDark}}>
            {(patient.nombre?.[0]||"?").toUpperCase()}
          </div>
          <div>
            <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:26,fontWeight:500}}>{patient.nombre} {patient.apellidoPaterno} {patient.apellidoMaterno}</h1>
            <div style={{display:"flex",gap:8,alignItems:"center",marginTop:4,flexWrap:"wrap"}}>
              <span style={{fontSize:13,color:C.muted}}>{patient.expediente}</span>
              <Badge color={sc}>{patient.status||"Nuevo"}</Badge>
              {patient.edad&&<span style={{fontSize:12,color:C.muted}}>{patient.edad} años</span>}
            </div>
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <Btn variant="outline" small icon="back" onClick={()=>setActive("patients")}>Volver</Btn>
          <Btn variant="primary" small icon="edit" onClick={()=>setActive("edit")}>Editar</Btn>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:0,borderBottom:`1px solid ${C.border}`,marginBottom:20}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{padding:"10px 22px",border:"none",background:"transparent",cursor:"pointer",fontSize:13,fontWeight:tab===t.id?600:400,color:tab===t.id?C.olive:C.muted,borderBottom:tab===t.id?`2px solid ${C.olive}`:"2px solid transparent",transition:"all .2s",marginBottom:-1}}>
            {t.label}
          </button>
        ))}
      </div>

      {/* INFO TAB */}
      {tab==="info" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <Card>
            <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,marginBottom:14}}>Datos generales</h3>
            <IR label="Teléfono" value={patient.telefono}/><IR label="Correo" value={patient.email}/>
            <IR label="CURP" value={patient.curp}/><IR label="Sexo" value={patient.sexo}/>
            <IR label="Domicilio" value={patient.calle?`${patient.calle}, ${patient.colonia}, ${patient.municipio}`:null}/>
            <IR label="Ocupación" value={patient.ocupacion}/>
          </Card>
          <Card>
            <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,marginBottom:14}}>Diagnóstico & plan</h3>
            <IR label="Diagnóstico" value={patient.diagnostico}/><IR label="Severidad" value={patient.severidad}/>
            <IR label="Clase Angle" value={patient.angleClass}/><IR label="Aparatología" value={patient.aparatologia}/>
            <IR label="Duración" value={patient.duracionTx}/>
            <IR label="Costo total" value={patient.costoTotal?`$${Number(patient.costoTotal).toLocaleString("es-MX")}`:null}/>
          </Card>
          {(patient.overjet||patient.anb) && (
            <Card style={{gridColumn:"1/-1"}}>
              <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,marginBottom:14}}>Medidas clínicas</h3>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(100px,1fr))",gap:10}}>
                {[["Overjet",patient.overjet,"mm"],["Overbite",patient.overbite,"mm"],["ANB",patient.anb,"°"],["SNA",patient.sna,"°"],["SNB",patient.snb,"°"]].map(([l,v,u])=>v?(
                  <div key={l} style={{background:C.cream,borderRadius:10,padding:"12px",textAlign:"center"}}>
                    <div style={{fontSize:10,color:C.muted,fontWeight:600,textTransform:"uppercase"}}>{l}</div>
                    <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:24,fontWeight:500,color:C.olive}}>{v}<span style={{fontSize:13}}>{u}</span></div>
                  </div>
                ):null)}
              </div>
            </Card>
          )}
          {/* COFEPRIS footer */}
          <Card style={{gridColumn:"1/-1",background:C.cream}}>
            <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
              <Icon name="shield" size={18} color={C.olive}/>
              <div style={{fontSize:12,color:C.muted}}>
                <strong style={{color:C.graphite}}>{especialista.nombre}</strong>
                {" · "}Céd. Prof. <strong>{especialista.cedula_prof}</strong>
                {especialista.cedula_esp && <> · Céd. Esp. <strong>{especialista.cedula_esp}</strong></>}
                {" · "}NOM-013-SSA2-2015
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* NOTAS TAB */}
      {tab==="seguimiento" && (
        <Card>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
            <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20}}>Notas clínicas</h3>
            <Btn variant="outline" small icon="plus" onClick={()=>setAddingNote(true)}>Nueva nota</Btn>
          </div>
          {addingNote && (
            <div style={{background:C.cream,borderRadius:12,padding:16,marginBottom:16}}>
              <Input label="Nota de seguimiento" value={noteText} onChange={setNoteText} multiline rows={4} placeholder="Avance, observaciones, ajustes realizados..."/>
              <div style={{display:"flex",gap:8,marginTop:12,flexWrap:"wrap"}}>
                <Btn variant="primary" small icon="pen" onClick={()=>setSigPad({type:"nota",callback:handleSaveNota})} loading={saving}>Firmar y guardar</Btn>
                <Btn variant="outline" small onClick={()=>handleSaveNota(null)} loading={saving}>Guardar sin firma</Btn>
                <Btn variant="ghost" small onClick={()=>{setAddingNote(false);setNoteText("")}}>Cancelar</Btn>
              </div>
            </div>
          )}
          {(patient.seguimientoNotas||[]).length===0 ? (
            <div style={{textAlign:"center",padding:"32px 0",color:C.muted}}>
              <Icon name="clock" size={32} color={C.goldLight} style={{display:"block",margin:"0 auto 10px"}}/>
              <p style={{fontSize:13}}>Sin notas aún</p>
            </div>
          ):[...patient.seguimientoNotas].reverse().map(n=>(
            <div key={n.id} style={{background:C.cream,borderRadius:12,padding:"14px 16px",borderLeft:`3px solid ${n.firma?C.olive:C.gold}`,marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6,alignItems:"flex-start",flexWrap:"wrap",gap:6}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:12,fontWeight:600,color:C.goldDark}}>{n.author}</span>
                  {n.firma && <span style={{fontSize:10,background:C.olive+"20",color:C.olive,padding:"2px 8px",borderRadius:10,fontWeight:600}}>✓ Firmada</span>}
                </div>
                <span style={{fontSize:11,color:C.muted}}>{new Date(n.date).toLocaleDateString("es-MX",{day:"2-digit",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"})}</span>
              </div>
              <p style={{fontSize:13,color:C.graphite,lineHeight:1.6}}>{n.text}</p>
              {n.firma && <img src={n.firma} alt="Firma" style={{height:50,marginTop:10,opacity:.7,borderTop:`1px solid ${C.border}`,paddingTop:8,display:"block"}}/>}
            </div>
          ))}
        </Card>
      )}

      {/* PAGOS TAB */}
      {tab==="pagos" && (
        <div>
          {/* Resumen */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:16}}>
            {[{label:"Total tratamiento",val:`$${totalTx.toLocaleString("es-MX")}`,color:C.graphite},{label:"Total pagado",val:`$${totalPagado.toLocaleString("es-MX")}`,color:C.olive},{label:"Saldo pendiente",val:`$${saldo.toLocaleString("es-MX")}`,color:saldo>0?C.danger:C.olive}].map(s=>(
              <Card key={s.label} style={{padding:"16px 18px",textAlign:"center"}}>
                <div style={{fontSize:11,color:C.muted,fontWeight:500,textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>{s.label}</div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:500,color:s.color}}>{s.val}</div>
              </Card>
            ))}
          </div>
          <Card>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:20}}>Registro de pagos</h3>
              <Btn variant="outline" small icon="plus" onClick={()=>setAddingPago(true)}>Registrar pago</Btn>
            </div>
            {addingPago && (
              <div style={{background:C.cream,borderRadius:12,padding:16,marginBottom:16}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:12}}>
                  <Input label="Monto ($)" type="number" value={pagoMonto} onChange={setPagoMonto} placeholder="0.00"/>
                  <Input label="Concepto" value={pagoConcepto} onChange={setPagoConcepto} placeholder="Ej: Enganche, mensualidad 1..."/>
                  <Input label="Método de pago" value={pagoMetodo} onChange={setPagoMetodo} options={["Efectivo","Tarjeta débito","Tarjeta crédito","Transferencia","Cheque"]}/>
                </div>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  <Btn variant="primary" small icon="pen" onClick={()=>setSigPad({type:"pago",callback:handleSavePago})} loading={saving}>Firmar recibo</Btn>
                  <Btn variant="outline" small icon="peso" onClick={()=>handleSavePago(null)} loading={saving}>Guardar sin firma</Btn>
                  <Btn variant="ghost" small onClick={()=>setAddingPago(false)}>Cancelar</Btn>
                </div>
              </div>
            )}
            {(patient.pagos||[]).length===0 ? (
              <div style={{textAlign:"center",padding:"32px 0",color:C.muted}}>
                <Icon name="peso" size={32} color={C.goldLight} style={{display:"block",margin:"0 auto 10px"}}/>
                <p style={{fontSize:13}}>Sin pagos registrados</p>
              </div>
            ):[...patient.pagos].reverse().map(pago=>(
              <div key={pago.id} style={{display:"flex",alignItems:"center",gap:14,padding:"12px 14px",background:C.cream,borderRadius:10,marginBottom:8,borderLeft:`3px solid ${pago.firma?C.olive:C.gold}`}}>
                <div style={{width:38,height:38,borderRadius:10,background:C.olive+"15",display:"flex",alignItems:"center",justifyContent:"center"}}><Icon name="peso" size={18} color={C.olive}/></div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:600,fontSize:15,color:C.olive}}>${parseFloat(pago.monto).toLocaleString("es-MX")}</div>
                  <div style={{fontSize:12,color:C.muted,marginTop:2}}>{pago.concepto||"—"} · {pago.metodo||"—"}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:11,color:C.muted}}>{new Date(pago.date).toLocaleDateString("es-MX",{day:"2-digit",month:"short",year:"numeric"})}</div>
                  {pago.firma && <span style={{fontSize:10,background:C.olive+"20",color:C.olive,padding:"2px 7px",borderRadius:8,marginTop:4,display:"inline-block"}}>✓ Firmado</span>}
                </div>
                {pago.firma && <img src={pago.firma} alt="Firma" style={{height:36,opacity:.6,borderLeft:`1px solid ${C.border}`,paddingLeft:10}}/>}
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  );
};

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const LOGO_DARK = "data:image/png;base64,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";
  const LOGO_WHITE = "data:image/png;base64,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";

  const [especialistaId, setEspecialistaId] = useState(null);
  const [patients, setPatients] = useState([]);
  const [active, setActive] = useState("dashboard");
  const [selected, setSelected] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [dbStatus, setDbStatus] = useState("connecting");
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  const esp = especialistaId ? ESPECIALISTAS[especialistaId] : null;
  const showToast = (msg, type="success") => { setToast({msg,type}); setTimeout(()=>setToast(null),3500); };

  const loadPatients = useCallback(async () => {
    if (!especialistaId) return;
    try {
      const data = await DB.getPatients(especialistaId);
      setPatients(data); setDbStatus("connected");
    } catch(e) { setDbStatus("error"); showToast("Error Supabase: "+e.message,"error"); }
    finally { setLoading(false); }
  }, [especialistaId]);

  useEffect(() => { if(especialistaId) { setLoading(true); loadPatients(); } }, [especialistaId, loadPatients]);

  const savePatient = async(p) => {
    try { await DB.savePatient(p); await loadPatients(); const fresh=await DB.getPatient(p.id); setSelected(fresh); showToast("Guardado en Supabase ✓"); setActive("record"); }
    catch(e) { showToast("Error: "+e.message,"error"); }
  };
  const deletePatient = async(id) => {
    try { await DB.deletePatient(id); await loadPatients(); showToast("Eliminado"); setActive("patients"); }
    catch(e) { showToast("Error al eliminar","error"); }
  };
  const addNota = async(patientId, text, author, firma) => {
    try { await DB.addNota(patientId,text,author,firma); const fresh=await DB.getPatient(patientId); setSelected(fresh); setPatients(ps=>ps.map(p=>p.id===patientId?fresh:p)); showToast("Nota guardada ✓"); }
    catch(e) { showToast("Error al guardar nota","error"); }
  };
  const addPago = async(patientId, monto, concepto, metodo, firma) => {
    try { await DB.addPago(patientId,monto,concepto,metodo,firma); const fresh=await DB.getPatient(patientId); setSelected(fresh); setPatients(ps=>ps.map(p=>p.id===patientId?fresh:p)); showToast("Pago registrado ✓"); }
    catch(e) { showToast("Error al registrar pago","error"); }
  };

  if (!especialistaId) return (<><style>{globalCSS}</style><Login onLogin={setEspecialistaId} LOGO_WHITE={LOGO_WHITE}/></>);

  const renderPage = () => {
    if(loading) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"60vh",flexDirection:"column",gap:16}}><div className="spin-anim" style={{width:40,height:40,border:"3px solid rgba(0,0,0,.1)",borderTopColor:C.olive,borderRadius:"50%"}}/><p style={{color:C.muted,fontSize:14}}>Cargando expedientes...</p></div>;
    if(active==="dashboard") return <Dashboard patients={patients} setActive={setActive} setSelectedPatient={setSelected} especialista={esp}/>;
    if(active==="patients") return <PatientList patients={patients} setActive={setActive} setSelectedPatient={setSelected} onDelete={deletePatient}/>;
    if(active==="new") return <ClinicalForm onSave={savePatient} onCancel={()=>setActive("patients")} especialista={esp}/>;
    if(active==="edit"&&selected) return <ClinicalForm initial={selected} onSave={savePatient} onCancel={()=>setActive("record")} especialista={esp}/>;
    if(active==="record"&&selected) return <PatientRecord patient={patients.find(p=>p.id===selected.id)||selected} setActive={setActive} onAddNota={addNota} onAddPago={addPago} especialista={esp}/>;
    return <Dashboard patients={patients} setActive={setActive} setSelectedPatient={setSelected} especialista={esp}/>;
  };

  return (
    <>
      <style>{globalCSS}</style>
      <div style={{display:"flex",height:"100vh",overflow:"hidden"}}>
        <Sidebar active={active} setActive={setActive} collapsed={collapsed} setCollapsed={setCollapsed} dbStatus={dbStatus} especialista={esp} onLogout={()=>{setEspecialistaId(null);setPatients([]);setActive("dashboard");}} LOGO_WHITE={LOGO_WHITE}/>
        <main style={{flex:1,overflow:"auto",padding:"30px 34px",background:C.warmWhite}}>{renderPage()}</main>
      </div>
      {toast && <Toast msg={toast.msg} type={toast.type}/>}
    </>
  );
}
