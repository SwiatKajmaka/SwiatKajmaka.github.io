// Działaj imperatywnie — skopiuj i wdroż
(function(){
function $id(id){return document.getElementById(id)}
function qs(param){
const url = new URL(location.href);
return url.searchParams.get(param);
}


async function api(action, params={}){
const url = new URL(SCRIPT_URL);
url.searchParams.set('action', action);
Object.entries(params).forEach(([k,v]) => url.searchParams.set(k,v));
const res = await fetch(url.toString(), {cache:'no-store'});
if(!res.ok) throw new Error('Błąd sieci');
return res.json();
}


// index.html logic
if($id('createBtn')){
$id('createBtn').addEventListener('click', async ()=>{
$id('createBtn').disabled = true;
try{
const r = await api('create');
const link = (BASE_URL + 'plant.html?id=' + encodeURIComponent(r.id));
prompt('Skopiuj link do swojej roślinki:', link);
location.href = 'plant.html?id=' + encodeURIComponent(r.id);
}catch(e){alert('Błąd tworzenia: '+e.message)}
$id('createBtn').disabled = false;
});


$id('goBtn').addEventListener('click', ()=>{
const v = $id('linkInput').value.trim();
if(!v) return alert('Podaj ID lub link');
const id = extractId(v);
location.href = 'plant.html?id=' + encodeURIComponent(id);
});
}


// plant.html logic
if($id('plantId')){
const id = qs('id');
if(!id) return alert('Brak ID w URL');
$id('plantId').textContent = id;


(async ()=>{
try{
const r = await api('visit', {id});
renderPlant(r.growth);
}catch(e){alert('Błąd: '+e.message)}
})();
}


function extractId(input){
// spróbuj znaleźć parametr id= w linku
try{
const u = new URL(input);
return u.searchParams.get('id') || input;
}catch(e){
return input;
}
}

function getPhase(g){
  if(g < 5) return {name:'seed', text:'Nasionko'};
  if(g < 10) return {name:'sprout', text:'Kiełek'};
  if(g < 20) return {name:'young', text:'Młoda roślina'};
  return {name:'bloom', text:'Kwitnąca roślina'};
}

function renderPlant(growth){
$id('growth').textContent = growth;
const phase = getPhase(growth);
$id('phase').textContent = phase.text;

function makeSVG(g){
  const phase = getPhase(g).name;

  // skalowanie rośliny względem poziomu wzrostu
  const scale = 0.6 + Math.min(g, 30) / 30;
  const leafScale = 0.6 + Math.min(g, 30) / 20;

  return `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="100%" height="100%" fill="none"/>

      <g transform="translate(100,160) scale(${scale}) translate(-100,-160)">
        <!-- ziemia -->
        <ellipse cx="100" cy="170" rx="70" ry="12" fill="#5a3a2b" />

        <!-- łodyga -->
        <rect x="96" y="80" width="8" height="80" rx="4" fill="#2f9e44" />

        <!-- liście -->
        <g transform="translate(100,110) scale(${leafScale})">
          <path d="M0 0 C -40 -20 -40 -60 0 -50 C 10 -45 10 -10 0 0"
                fill="#2f9e44"
                transform="translate(-70,20) rotate(-20)" />
          <path d="M0 0 C 40 -20 40 -60 0 -50 C -10 -45 -10 -10 0 0"
                fill="#2f9e44"
                transform="translate(70,20) rotate(20)" />
        </g>
      </g>

      <!-- kwiatek dla dużej rośliny -->
      ${g >= 20 ? `
        <g transform="translate(100,70)">
          <circle r="14" fill="#ffd166" />
          <circle cx="0" cy="0" r="6" fill="#ef476f" />
        </g>
      ` : ''}
    </svg>
  `;
}


const svg = makeSVG(growth);
$id('svgContainer').innerHTML = svg;
}
})();

