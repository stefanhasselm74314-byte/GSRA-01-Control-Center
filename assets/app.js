"use strict";

const C = 299792458.0;
const LY_M = 9460730472580800.0;
const YEAR_S = 365.25 * 24 * 3600;
const G0 = 9.80665;

const fallbackSolvers = [
  ["GS-01","Mission & Relativity","ACTIVE","Distanz, Reisezeit, Eigenzeit und SR-Designhülle"],
  ["GS-02","Propulsion","PLANNED","Antriebskandidaten, Schub, Δv und Massenverhältnis"],
  ["GS-03","Energy","PLANNED","Erzeugung, Speicherung und Leistungsbudget"],
  ["GS-04","Thermal","PLANNED","Abwärme, Radiatoren und Temperaturregime"],
  ["GS-05","Structure & Rotation","PLANNED","Tragstruktur, künstliche Gravitation und Dynamik"],
  ["GS-06","Radiation & High-Speed Impact","PLANNED","GCR, Partikel, Staub und Schutzsysteme"],
  ["GS-07","Life Support","PLANNED","Luft, Wasser und Stoffkreisläufe"],
  ["GS-08","Biosphere & Agriculture","PLANNED","Nahrung, Ökosystem und Landwirtschaft"],
  ["GS-09","Population & Genetics","PLANNED","Demografie, effektive Population, Drift und Genbank"],
  ["GS-10","Medicine","PLANNED","Medizinische Autonomie und Bioproduktion"],
  ["GS-11","Industry & Raw Materials","PLANNED","Rohstoffe, Metallurgie und Chemie"],
  ["GS-12","Manufacturing & Repair","PLANNED","Fertigung, Ersatzteile und Maschinenkreislauf"],
  ["GS-13","Robotics & Autonomy","PLANNED","Robotik, Wartung und autonome Operation"],
  ["GS-14","Computing & Knowledge Archive","PLANNED","Rechner, Daten und Wissenskontinuität"],
  ["GS-15","Governance & Society","PLANNED","Institutionen, Gesellschaft und Langzeitstabilität"],
  ["GS-16","Navigation & Communications","PLANNED","Trajektorie, Sensorik und Kommunikation"],
  ["GS-17","Science","PLANNED","Forschung, Beobachtung und Missionswissenschaft"],
  ["GS-18","Auxiliary Craft & Probes","PLANNED","Sonden, Lander und Reparaturfahrzeuge"],
  ["GS-19","Safety, Reliability & Redundancy","PLANNED","Fehlertoleranz, Katastrophen und Redundanz"],
  ["GS-20","HZT Interface","PLANNED_FIREWALLED","Isolierter Forschungs- und Upgrade-Pfad"]
].map(([id,name,status,summary]) => ({id,name,status,summary,evidence:"OPEN",depends_on:[],outputs:[],next_gate:"Noch nicht veröffentlicht"}));

const $ = (id) => document.getElementById(id);
const de = new Intl.NumberFormat("de-DE", {maximumFractionDigits: 2});

function gamma(beta){ return 1 / Math.sqrt(1 - beta * beta); }
function formatYears(y){
  if (y >= 1e6) return `${de.format(y/1e6)} Mio. a`;
  if (y >= 1e3) return `${de.format(y)} a`;
  if (y >= 1) return `${de.format(y)} a`;
  return `${de.format(y*365.25)} d`;
}
function formatEnergy(jkg){
  const units = [[1e18,"EJ"],[1e15,"PJ"],[1e12,"TJ"],[1e9,"GJ"],[1e6,"MJ"]];
  for (const [scale,label] of units) if (jkg >= scale) return `${de.format(jkg/scale)} ${label}`;
  return `${de.format(jkg)} J`;
}
function fixed(value, digits=4){ return Number(value).toLocaleString("de-DE",{maximumFractionDigits:digits}); }
function escapeHtml(value){
  return String(value ?? "").replace(/[&<>'"]/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[ch]));
}

function updateMission(){
  const Dly = Number($("distance").value);
  const beta = Number($("beta").value);
  const g = gamma(beta);
  const tYears = Dly / beta;
  const tauYears = tYears / g;
  const eps = (g - 1) * C * C;

  $("distance-out").textContent = `${Math.round(Dly).toLocaleString("de-DE")} ly`;
  $("beta-out").textContent = `${beta.toLocaleString("de-DE",{minimumFractionDigits:2,maximumFractionDigits:2})} c`;
  $("gamma").textContent = fixed(g, 5);
  $("coord-time").textContent = formatYears(tYears);
  $("proper-time").textContent = formatYears(tauYears);
  $("energy").textContent = formatEnergy(eps);

  updateAcceleration(Dly);
  drawChart(Dly, beta);
}

function updateAcceleration(Dly){
  const a = Number($("acceleration").value);
  const D = Dly * LY_M;
  const q = a * D / (2 * C * C);
  const gmax = 1 + q;
  const bmax = Math.sqrt(1 - 1/(gmax*gmax));
  const root = Math.sqrt(q * (q + 2));
  const rapidity = Math.log1p(q + root);
  const t = 2 * (C/a) * root / YEAR_S;
  const tau = 2 * (C/a) * rapidity / YEAR_S;

  $("accel-label").textContent = `${fixed(a/G0,2)} g`;
  $("accel-coord").textContent = formatYears(t);
  $("accel-proper").textContent = formatYears(tau);
  $("accel-beta").textContent = fixed(bmax, 9);
  $("accel-gamma").textContent = fixed(gmax, 2);
  $("accel-q").textContent = fixed(q, 2);
}

function drawChart(Dly, selectedBeta){
  const svg = $("trade-chart");
  const W=760,H=300,L=58,R=16,T=16,B=42;
  const xMin=.01,xMax=.99;
  const samples=[];
  for(let i=0;i<=98;i++){
    const b=.01+i*.01;
    const t=Dly/b;
    const tau=t/gamma(b);
    samples.push({b,t,tau});
  }
  const minY=Math.log10(Dly);
  const maxY=Math.log10(Dly/.01);
  const x=b=>L+(b-xMin)/(xMax-xMin)*(W-L-R);
  const y=v=>T+(maxY-Math.log10(v))/(maxY-minY)*(H-T-B);
  const path=key=>samples.map((p,i)=>`${i?"L":"M"}${x(p.b).toFixed(1)},${y(p[key]).toFixed(1)}`).join(" ");
  const current=samples[Math.max(0,Math.min(98,Math.round((selectedBeta-.01)/.01)))];
  const grid=[1,10,100].map(mult=>Dly*mult).filter(v=>Math.log10(v)<=maxY+.001);
  svg.innerHTML=`
    <defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#57d6ff" stop-opacity=".12"/><stop offset="1" stop-color="#57d6ff" stop-opacity="0"/></linearGradient></defs>
    ${grid.map(v=>`<line x1="${L}" x2="${W-R}" y1="${y(v)}" y2="${y(v)}" stroke="#244159" stroke-width="1"/><text x="${L-8}" y="${y(v)+4}" fill="#71899e" font-size="9" text-anchor="end">${v>=1e6?(v/1e6).toFixed(1)+"M":Math.round(v/1000)+"k"}</text>`).join("")}
    <line x1="${L}" x2="${W-R}" y1="${H-B}" y2="${H-B}" stroke="#31506a"/>
    ${[.01,.2,.4,.6,.8,.99].map(v=>`<text x="${x(v)}" y="${H-15}" fill="#71899e" font-size="9" text-anchor="middle">${v.toFixed(2)}c</text>`).join("")}
    <path d="${path("t")}" fill="none" stroke="#57d6ff" stroke-width="2.4"/>
    <path d="${path("tau")}" fill="none" stroke="#aa8cff" stroke-width="2.4"/>
    <line x1="${x(selectedBeta)}" x2="${x(selectedBeta)}" y1="${T}" y2="${H-B}" stroke="#ffffff" stroke-opacity=".22" stroke-dasharray="4 5"/>
    <circle cx="${x(selectedBeta)}" cy="${y(current.t)}" r="4" fill="#57d6ff"/>
    <circle cx="${x(selectedBeta)}" cy="${y(current.tau)}" r="4" fill="#aa8cff"/>
    <text x="${W-R}" y="${T+8}" fill="#6d8599" font-size="9" text-anchor="end">logarithmische Zeitachse</text>`;
}

function stateClass(status){
  if(status === "ACTIVE") return "active";
  if(status.includes("FIREWALLED")) return "firewalled";
  return "planned";
}
function stateLabel(status){
  if(status === "ACTIVE") return "ACTIVE";
  if(status.includes("FIREWALLED")) return "FIREWALLED";
  return "PLANNED";
}

function openSolverDialog(solver){
  const dialog = $("solver-dialog");
  const deps = solver.depends_on?.length ? solver.depends_on.map(x=>`<span>${escapeHtml(x)}</span>`).join("") : "<em>Keine vorgelagerten Solver veröffentlicht.</em>";
  const outputs = solver.outputs?.length ? solver.outputs.map(x=>`<li>${escapeHtml(x)}</li>`).join("") : "<li>Noch keine öffentlichen Outputs.</li>";
  $("solver-dialog-content").innerHTML = `
    <p class="eyebrow">${escapeHtml(solver.id)} · SOLVER DETAIL</p>
    <div class="dialog-title"><h2>${escapeHtml(solver.name)}</h2><span class="solver-state ${stateClass(solver.status)}">${stateLabel(solver.status)}</span></div>
    <p class="dialog-summary">${escapeHtml(solver.summary)}</p>
    <div class="dialog-grid">
      <section><span>Evidenzstatus</span><strong>${escapeHtml(solver.evidence || "OPEN")}</strong></section>
      <section><span>Nächstes Gate</span><strong>${escapeHtml(solver.next_gate || "OPEN")}</strong></section>
    </div>
    <div class="dialog-block"><span>Abhängigkeiten</span><div class="dependency-tags">${deps}</div></div>
    <div class="dialog-block"><span>Öffentliche Ziel-Outputs</span><ul>${outputs}</ul></div>
    <p class="dialog-firewall">Detailansicht = veröffentlichter Projektstatus. Sie ist keine technische Freigabe und enthält keine privaten Solver-Implementierungen.</p>`;
  if(typeof dialog.showModal === "function") dialog.showModal(); else dialog.setAttribute("open", "");
}

function renderSolvers(solvers, filter="ALL"){
  const visible = solvers.filter(s => filter === "ALL" || (filter === "FIREWALLED" ? s.status.includes("FIREWALLED") : s.status === filter));
  $("solver-grid").innerHTML = visible.map(s=>`
    <button class="solver-card" type="button" data-solver="${escapeHtml(s.id)}" aria-label="${escapeHtml(s.id)} ${escapeHtml(s.name)} öffnen">
      <header><span class="solver-id">${escapeHtml(s.id)}</span><span class="solver-state ${stateClass(s.status)}">${stateLabel(s.status)}</span></header>
      <h3>${escapeHtml(s.name)}</h3><p>${escapeHtml(s.summary || "Workstream gemäß GSRA Solver Registry.")}</p>
      <span class="solver-open">DETAILS →</span>
    </button>`).join("");
  visible.forEach(solver => {
    const card = document.querySelector(`[data-solver="${solver.id}"]`);
    if(card) card.addEventListener("click", ()=>openSolverDialog(solver));
  });
}

async function loadSolvers(){
  let solvers=fallbackSolvers;
  try{
    const response=await fetch("data/solvers.json",{cache:"no-store"});
    if(response.ok) solvers=await response.json();
  }catch(_){ /* local file fallback */ }
  renderSolvers(solvers);
  document.querySelectorAll(".filter").forEach(btn=>btn.addEventListener("click",()=>{
    document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    renderSolvers(solvers,btn.dataset.filter);
  }));
}

$("distance").addEventListener("input",updateMission);
$("beta").addEventListener("input",updateMission);
$("acceleration").addEventListener("change",updateMission);
$("solver-dialog").addEventListener("click", event => {
  if(event.target === $("solver-dialog")) $("solver-dialog").close();
});
updateMission();
loadSolvers();
