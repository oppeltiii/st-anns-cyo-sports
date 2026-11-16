/* St. Ann's Saints CYO Sports — local-first administration app */
const STORAGE_KEY = 'stAnnsCyoSports.v2';
const LEGACY_KEY = 'stAnnsCyoSports.v1';
const SESSION_KEY = 'stAnnsCyoSession.v1';
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const uid = (prefix='id') => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`;
const esc = (v='') => String(v ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const initials = name => String(name || 'SA').split(/\s+/).filter(Boolean).map(x=>x[0]).slice(0,2).join('').toUpperCase();
const fmtDate = (v, opts={month:'short',day:'numeric',year:'numeric'}) => {
  try { return new Intl.DateTimeFormat('en-US', opts).format(new Date(`${v}T12:00:00`)); }
  catch { return String(v || ''); }
};
const download = (name, content, type='text/plain') => { const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([content],{type})); a.download=name; a.click(); URL.revokeObjectURL(a.href); };
const csv = rows => rows.map(row => row.map(cell => `"${String(cell??'').replace(/"/g,'""')}"`).join(',')).join('\n');

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const FULL_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const UNIFORM_SIZES = ['YXS', 'YS', 'YM', 'YL', 'YXL', 'AS', 'AM', 'AL', 'AXL'];

const seed = {
  version: 2,
  organization: {name:"St. Ann's Saints CYO Sports", parish:"St. Ann Catholic Church", city:'San Antonio, Texas', email:'cyo@stanns-saints.org', phone:'(210) 555-0147', director:'CYO Athletic Director'},
  activeSeasonId:'basketball-2026-27',
  defaultRegFee: 100,
  users: [
    {id:'u-master', username:'admin', password:'Saints2026!', name:'Master Admin', role:'master', coachName:'', teamIds:[], permissions:['dashboard','sports','registrations','teams','coaches','schedule','volunteers','communications','reports','portal','settings']},
    {id:'u-garcia', username:'dgarcia', password:'Saints2026!', name:'Daniel Garcia', role:'coach', coachName:'Daniel Garcia', teamIds:['t1'], permissions: ['dashboard', 'teams', 'schedule', 'communications']},
    {id:'u-martinez', username:'emartinez', password:'Saints2026!', name:'Elena Martinez', role:'coach', coachName:'Elena Martinez', teamIds:['t2'], permissions: ['dashboard', 'teams', 'schedule', 'communications']}
  ],
  sports:[
    {id:'basketball',name:'Basketball',symbol:'◉',season:'Winter',status:'Active',seasonId:'basketball-2026-27',year:'2026–2027',divisions:['Tot','Tiny','Pee Wee','Mite','Cub','Junior']},
    {id:'volleyball',name:'Volleyball',symbol:'◆',season:'Fall',status:'Planning',year:'2027',divisions:['Tiny','Pee Wee','Mite','Cub','Junior']},
    {id:'soccer',name:'Soccer',symbol:'⬡',season:'Fall',status:'Planning',year:'2027',divisions:['Tot','Tiny','Pee Wee','Mite','Cub','Junior']},
    {id:'baseball',name:'Baseball',symbol:'●',season:'Spring',status:'Archived',year:'2026',divisions:['T-Ball','Pee Wee','Mite','Cub','Junior']},
    {id:'softball',name:'Softball',symbol:'●',season:'Spring',status:'Archived',year:'2026',divisions:['Pee Wee','Mite','Cub','Junior']},
    {id:'track',name:'Track & Field',symbol:'➜',season:'Spring',status:'Planning',year:'2027',divisions:['Elementary','Middle School']},
    {id:'cheer',name:'Cheer',symbol:'✦',season:'Winter',status:'Planning',year:'2027',divisions:['Tiny','Pee Wee','Mite','Cub','Junior']}
  ],
  registrations:[
    {id:'r1',name:'Sofia Martinez',division:'Mite',sport:'Basketball',guardian:'Elena Martinez',email:'elena.martinez@example.org',status:'Payment due',paid:true,teamId:'t2',jersey:'4',uniformSize:'YM',uniformQty:1,uniformPaid:true,fundraiserItem:'Raffle Tickets',fundraiserQty:10,fundraiserAmount:50,fundraiserPaid:true,created:'2026-10-18'},
    {id:'r2',name:'Noah Garcia',division:'Pee Wee',sport:'Basketball',guardian:'Daniel Garcia',email:'daniel.garcia@example.org',status:'Payment due',paid:true,teamId:'t1',jersey:'12',uniformSize:'YS',uniformQty:1,uniformPaid:true,fundraiserItem:'Raffle Tickets',fundraiserQty:5,fundraiserAmount:25,fundraiserPaid:true,created:'2026-10-19'},
    {id:'r3',name:'Ava Rodriguez',division:'Cub',sport:'Basketball',guardian:'Maria Rodriguez',email:'maria.rodriguez@example.org',status:'Needs waiver',paid:true,teamId:'t3',jersey:'22',uniformSize:'YL',uniformQty:1,uniformPaid:false,fundraiserItem:'Raffle Tickets',fundraiserQty:0,fundraiserAmount:0,fundraiserPaid:false,created:'2026-10-21'},
    {id:'r4',name:'Liam Johnson',division:'Tiny',sport:'Basketball',guardian:'Chris Johnson',email:'chris.johnson@example.org',status:'Payment due',paid:false,teamId:'',jersey:'',uniformSize:'YS',uniformQty:1,uniformPaid:false,fundraiserItem:'',fundraiserQty:0,fundraiserAmount:0,fundraiserPaid:false,created:'2026-10-23'},
    {id:'r5',name:'Mia Hernandez',division:'Junior',sport:'Basketball',guardian:'Ana Hernandez',email:'ana.hernandez@example.org',status:'Payment due',paid:true,teamId:'t4',jersey:'10',uniformSize:'AS',uniformQty:1,uniformPaid:true,fundraiserItem:'Raffle Tickets',fundraiserQty:12,fundraiserAmount:60,fundraiserPaid:true,created:'2026-10-24'},
    {id:'r6',name:'Mateo Flores',division:'Tot',sport:'Basketball',guardian:'Rosa Flores',email:'rosa.flores@example.org',status:'Payment due',paid:true,teamId:'t5',jersey:'3',uniformSize:'YXS',uniformQty:1,uniformPaid:true,fundraiserItem:'Raffle Tickets',fundraiserQty:4,fundraiserAmount:20,fundraiserPaid:true,created:'2026-10-25'}
  ],
  teams:[
    {id:'t1',sportId:'basketball',name:'Pee Wee Gold',division:'Pee Wee',coach:'Daniel Garcia',assistant:'Open',practiceDay:'Tue',practiceTime:'6:00 PM',practiceLocation:"St. Ann's Gym",practices:'Tue · 6:00 PM',capacity:10},
    {id:'t2',sportId:'basketball',name:'Mite Black',division:'Mite',coach:'Elena Martinez',assistant:'Sarah Reed',practiceDay:'Wed',practiceTime:'6:00 PM',practiceLocation:"St. Ann's Gym",practices:'Wed · 6:00 PM',capacity:10},
    {id:'t3',sportId:'basketball',name:'Cub Gold',division:'Cub',coach:'David Cruz',assistant:'Monica Lopez',practiceDay:'Thu',practiceTime:'6:30 PM',practiceLocation:"St. Ann's Gym",practices:'Thu · 6:30 PM',capacity:10},
    {id:'t4',sportId:'basketball',name:'Junior Black',division:'Junior',coach:'Andre Brooks',assistant:'Open',practiceDay:'Mon',practiceTime:'7:00 PM',practiceLocation:"St. Ann's Gym",practices:'Mon · 7:00 PM',capacity:10},
    {id:'t5',sportId:'basketball',name:'Tot Saints',division:'Tot',coach:'Rosa Flores',assistant:'Open',practiceDay:'Sat',practiceTime:'9:00 AM',practiceLocation:"St. Ann's Gym",practices:'Sat · 9:00 AM',capacity:8}
  ],
  events:[
    {id:'e1',date:'2026-11-14',time:'9:00 AM',title:'Basketball evaluations',type:'Evaluation',division:'All',location:"St. Ann's Gym",phase:'Preseason'},
    {id:'e2',date:'2026-11-27',time:'5:00 PM',title:'Gym availability due',type:'Deadline',division:'All',location:'CYO Office',phase:'Preseason'},
    {id:'e3',date:'2026-12-05',time:'6:30 PM',title:'Coaches meeting',type:'Meeting',division:'All',location:'Parish Hall',phase:'Preseason'},
    {id:'e4',date:'2027-01-08',time:'6:30 PM',title:'Regular season opens',type:'Game',division:'All',location:"St. Ann's Gym",phase:'Regular season'},
    {id:'e5',date:'2027-01-16',time:'10:00 AM',title:'Pee Wee Gold vs. St. Luke',type:'Game',division:'Pee Wee',location:"St. Ann's Gym",phase:'Regular season'},
    {id:'e6',date:'2027-01-23',time:'12:00 PM',title:'Mite Black vs. Holy Spirit',type:'Game',division:'Mite',location:"St. Ann's Gym",phase:'Regular season'},
    {id:'e7',date:'2027-02-12',time:'6:30 PM',title:'Final regular-season weekend',type:'Game',division:'All',location:"St. Ann's Gym",phase:'Regular season'},
    {id:'e8',date:'2027-02-19',time:'6:30 PM',title:'Zone playoffs begin',type:'Playoff',division:'Qualifiers',location:'Zone facilities',phase:'Zone playoffs'},
    {id:'e9',date:'2027-02-26',time:'6:30 PM',title:'City tournament begins',type:'Tournament',division:'Qualifiers',location:'City facilities',phase:'City tournament'}
  ],
  volunteers:[
    {id:'v1',name:'Elena Martinez',role:'Head Coach',team:'Mite Black',email:'elena.martinez@example.org',status:'Cleared',safe:'Current',background:'Current'},
    {id:'v2',name:'Daniel Garcia',role:'Head Coach',team:'Pee Wee Gold',email:'daniel.garcia@example.org',status:'Cleared',safe:'Current',background:'Current'},
    {id:'v3',name:'David Cruz',role:'Head Coach',team:'Cub Gold',email:'david.cruz@example.org',status:'Cleared',safe:'Current',background:'Current'},
    {id:'v4',name:'Andre Brooks',role:'Head Coach',team:'Junior Black',email:'andre.brooks@example.org',status:'Action needed',safe:'Expiring',background:'Current'},
    {id:'v5',name:'Rosa Flores',role:'Head Coach',team:'Tot Saints',email:'rosa.flores@example.org',status:'Payment due',safe:'Current',background:'Pending'},
    {id:'v6',name:'Sarah Reed',role:'Assistant Coach',team:'Mite Black',email:'sarah.reed@example.org',status:'Cleared',safe:'Current',background:'Current'}
  ],
  announcements:[
    {id:'a1',title:'Basketball registration is open',audience:'All families',body:'Complete registration, payment, and the participation waiver before team placement.',date:'2026-10-20',published:true},
    {id:'a2',title:'Evaluations — November 14',audience:'Basketball families',body:"Players should arrive 15 minutes early at St. Ann's Gym with athletic shoes and water.",date:'2026-10-29',published:true},
    {id:'a3',title:'Coaches meeting reminder',audience:'Coaches',body:'The preseason coaches meeting is December 5 in the parish hall.',date:'2026-11-01',published:true}
  ]
};

let state = loadState();
let currentView = 'dashboard';
let settingsTab = 'org';
let weekOffset = 0;
let selectedCoachFilter = 'ALL';
let activeWorkspaceTeamId = '';
let activeWorkspaceTab = 'uniform'; // 'uniform' | 'regpd' | 'fundraisers'
let selectedRegIds = new Set();
let selectedTeamIds = new Set();

function normalizePlayerFields(r, teamsList) {
  const team = (teamsList || []).find(t => t.id === r.teamId);
  const item = {...r};
  if (team && team.division) {
    item.division = team.division;
  }
  item.phone = item.phone ?? '';
  item.jersey = item.jersey ?? '';
  item.uniformSize = item.uniformSize || 'YS';
  item.uniformQty = Number(item.uniformQty) || 1;
  item.uniformPaid = Boolean(item.uniformPaid);
  item.fundraiserItem = item.fundraiserItem ?? '';
  item.fundraiserQty = Number(item.fundraiserQty) || 0;
  item.fundraiserAmount = Number(item.fundraiserAmount) || 0;
  item.fundraiserPaid = Boolean(item.fundraiserPaid);
  return item;
}

function normalizeState(rawObj) {
  const merged = {...structuredClone(seed), ...(rawObj || {})};
  if (!Array.isArray(merged.users) || !merged.users.length) {
    merged.users = structuredClone(seed.users);
  }
  merged.users = merged.users.map(u => {
    if (u.role === 'coach') {
      return {...u, permissions: ['dashboard', 'teams', 'schedule', 'communications']};
    }
    return u;
  });
  merged.teams = (Array.isArray(merged.teams) ? merged.teams : []).filter(Boolean).map(t => normalizeTeamPractice(t));
  merged.registrations = (Array.isArray(merged.registrations) ? merged.registrations : []).filter(Boolean).map(r => normalizePlayerFields(r, merged.teams));
  merged.events = (Array.isArray(merged.events) ? merged.events : []).filter(Boolean);
  merged.volunteers = (Array.isArray(merged.volunteers) ? merged.volunteers : []).filter(Boolean);
  merged.announcements = (Array.isArray(merged.announcements) ? merged.announcements : []).filter(Boolean);
  merged.sports = (Array.isArray(merged.sports) ? merged.sports : structuredClone(seed.sports)).filter(Boolean);
  return merged;
}

function loadState(){
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return normalizeState(JSON.parse(raw));
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const migrated = normalizeState(JSON.parse(legacy));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    }
    return normalizeState(seed);
  } catch {
    return normalizeState(seed);
  }
}

function normalizeTeamPractice(t) {
  const item = {...t};
  item.name = item.name || 'Unnamed Team';
  item.division = item.division || 'Mite';
  item.coach = item.coach || 'Open';
  item.assistant = item.assistant || 'Open';
  item.capacity = Number(item.capacity) || 10;
  if (!item.practiceDay && item.practices) {
    const parts = String(item.practices).split(/·|-/).map(s => s.trim());
    const foundDay = DAYS.find(d => (parts[0] || '').toLowerCase().startsWith(d.toLowerCase()));
    item.practiceDay = foundDay || 'Tue';
    item.practiceTime = parts[1] || '6:00 PM';
  }
  item.practiceDay = item.practiceDay || 'Tue';
  item.practiceTime = item.practiceTime || '6:00 PM';
  item.practiceLocation = item.practiceLocation || "St. Ann's Gym";
  item.practices = `${item.practiceDay} · ${item.practiceTime}`;
  item.sportId = item.sportId || 'basketball';
  return item;
}

function save(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  updateSeasonSelect();
  updateNoticeCount();
}

function currentUser(){
  const uidStored = sessionStorage.getItem(SESSION_KEY);
  if (!uidStored) return null;
  return state.users.find(u => u.id === uidStored) || null;
}

function isMaster(){
  const u = currentUser();
  return u && u.role === 'master';
}

function allowedTeams(){
  const u = currentUser();
  if (!u) return [];
  if (u.role === 'master') return state.teams;
  return state.teams.filter(t =>
    (u.teamIds || []).includes(t.id) ||
    (u.coachName && String(t.coach).toLowerCase() === String(u.coachName).toLowerCase()) ||
    (u.name && String(t.coach).toLowerCase() === String(u.name).toLowerCase())
  );
}

function allowedRegistrations(){
  const u = currentUser();
  if (!u) return [];
  if (u.role === 'master') return state.registrations;
  const teamIds = new Set(allowedTeams().map(t => t.id));
  return state.registrations.filter(r => r.teamId && teamIds.has(r.teamId));
}

function canView(view){
  const u = currentUser();
  if (!u) return false;
  if (u.role === 'master') return true;
  const perms = u.permissions || ['dashboard', 'teams', 'schedule'];
  return perms.includes(view);
}

function applyAuthUI(){
  const user = currentUser();
  if (!user) {
    $('#loginScreen').hidden = false;
    $('#appShell').hidden = true;
    return;
  }
  $('#loginScreen').hidden = true;
  $('#appShell').hidden = false;
  $('#activeRoleBadge').textContent = user.role === 'master' ? 'Master Admin' : `Coach · ${user.name}`;
  $('#profileBtn').textContent = initials(user.name);

  $$('#nav .nav-item, #navSettings').forEach(btn => {
    const v = btn.dataset.view;
    btn.hidden = !canView(v);
  });

  if (!canView(currentView)) {
    currentView = 'dashboard';
  }
}

function activeSport(){ return state.sports.find(s=>s.seasonId===state.activeSeasonId) || state.sports[0]; }
function statusBadge(status){ const cls = /complete|cleared|active|current|paid/i.test(status)?'green':/due|action|needs/i.test(status)?'red':/planning|pending|preseason/i.test(status)?'gold':'blue'; return `<span class="badge ${cls}">${esc(status)}</span>`; }
function toast(title,message=''){ const el=document.createElement('div'); el.className='toast'; el.innerHTML=`<strong>${esc(title)}</strong>${esc(message)}`; $('#toastStack').append(el); setTimeout(()=>el.remove(),3200); }
function pageHead(kicker,title,desc,actions=''){ return `<div class="page-head"><div><span class="eyebrow">${kicker}</span><h1>${title}</h1><p>${desc}</p></div><div class="actions">${actions}</div></div>`; }
function updateSeasonSelect(){ const s=$('#seasonSelect'); if(!s)return; s.innerHTML=state.sports.filter(x=>x.seasonId).map(x=>`<option value="${x.seasonId}" ${x.seasonId===state.activeSeasonId?'selected':''}>${esc(x.name)} · ${esc(x.year)}</option>`).join('') + state.sports.filter(x=>!x.seasonId).map(x=>`<option disabled>${esc(x.name)} · ${esc(x.year)} (${x.status})</option>`).join(''); }

function updateNoticeCount(){
  const regs = allowedRegistrations();
  const n = regs.filter(r=>r.status!=='Complete' || !r.paid).length + (isMaster() ? state.volunteers.filter(v=>v.status!=='Cleared').length : 0);
  $('#noticeCount').textContent = n;
}

function navigate(view){
  if (!canView(view)) {
    toast('Access restricted', 'Your role does not have permission for that section.');
    return;
  }
  currentView = view;
  $$('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
  $('#sidebar').classList.remove('open');
  render();
  window.scrollTo({top:0,behavior:'smooth'});
}

function render(){
  if (!currentUser()) return;
  try {
    const fn = views[currentView] || views.dashboard;
    $('#main').innerHTML = fn();
    bindView();
  } catch (err) {
    console.error('Render error in view:', currentView, err);
    $('#main').innerHTML = `<div class="card"><h3>View Error</h3><p class="card-subtitle">${esc(err.message)}</p><button class="btn primary" onclick="navigate('dashboard')">Return to Overview</button></div>`;
  }
}

function getWeekDates(offset = 0) {
  const now = new Date();
  const base = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset * 7);
  const sunday = new Date(base);
  sunday.setDate(base.getDate() - base.getDay());
  return Array.from({length: 7}, (_, i) => {
    const d = new Date(sunday);
    d.setDate(sunday.getDate() + i);
    const iso = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const todayIso = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`;
    return {
      dateObj: d,
      iso,
      dayShort: DAYS[d.getDay()],
      dayFull: FULL_DAYS[d.getDay()],
      dayNum: d.getDate(),
      monthShort: d.toLocaleString('en-US', {month: 'short'}),
      isToday: iso === todayIso
    };
  });
}

function renderWeeklyCalendar() {
  const days = getWeekDates(weekOffset);
  const teams = allowedTeams();
  const rangeLabel = `${days[0].monthShort} ${days[0].dayNum} – ${days[6].monthShort} ${days[6].dayNum}, ${days[6].dateObj.getFullYear()}`;

  const gridHtml = days.map(day => {
    const dayPractices = teams.filter(t => t.practiceDay && String(t.practiceDay).toLowerCase() === day.dayShort.toLowerCase());
    const dayEvents = state.events.filter(e => e.date === day.iso);

    const slotsHtml = [
      ...dayPractices.map(t => `
        <div class="week-slot">
          <span class="badge gold" style="font-size:8px;padding:2px 6px;margin-bottom:3px">Practice</span>
          <strong>${esc(t.name)}</strong>
          <small>${esc(t.practiceTime)} · ${esc(t.practiceLocation || "St. Ann's Gym")}</small>
          <small>Coach: ${esc(t.coach)}</small>
        </div>
      `),
      ...dayEvents.map(e => `
        <div class="week-slot game">
          <span class="badge blue" style="font-size:8px;padding:2px 6px;margin-bottom:3px">${esc(e.type)}</span>
          <strong>${esc(e.title)}</strong>
          <small>${esc(e.time)} · ${esc(e.location)}</small>
        </div>
      `)
    ].join('');

    return `
      <div class="week-day ${day.isToday ? 'today' : ''}">
        <div class="week-day-head">
          <small>${day.dayShort}</small>
          <b>${day.monthShort} ${day.dayNum}</b>
        </div>
        ${slotsHtml || '<small style="color:#aaa;margin-top:8px">No scheduled slots</small>'}
      </div>
    `;
  }).join('');

  return `
    <article class="card" style="margin-bottom:22px">
      <div class="card-head">
        <div>
          <h2 class="card-title">Weekly Practice & Game Calendar</h2>
          <div class="card-subtitle">Auto-updates each week · ${esc(rangeLabel)}</div>
        </div>
        <div class="actions">
          <button class="btn small" data-action="week-prev">← Prev Week</button>
          <button class="btn small gold" data-action="week-current">Current Week</button>
          <button class="btn small" data-action="week-next">Next Week →</button>
        </div>
      </div>
      <div class="week-grid">${gridHtml}</div>
    </article>
  `;
}

function renderAdminCoachCollectionsCard() {
  if (!isMaster()) return '';
  const defaultFee = Number(state.defaultRegFee) || 100;
  const rows = state.teams.map(t => {
    const players = state.registrations.filter(r => r.teamId === t.id);
    let collected = 0, balDue = 0, cashApp = 0, cash = 0, card = 0, unpaidCount = 0;
    players.forEach(p => {
      const fee = Number(p.regFee ?? defaultFee);
      const pd = Number(p.regAmountPaid) || 0;
      const due = Math.max(0, fee - pd);
      collected += pd;
      balDue += due;
      if (due > 0 || !p.paid) unpaidCount++;
      if (p.regPaymentMethod === 'Cash App') cashApp += pd;
      else if (p.regPaymentMethod === 'Cash') cash += pd;
      else if (p.regPaymentMethod === 'Card') card += pd;
    });
    return { team: t, players, collected, balDue, cashApp, cash, card, unpaidCount };
  });

  const grandCollected = rows.reduce((s, r) => s + r.collected, 0);
  const grandDue = rows.reduce((s, r) => s + r.balDue, 0);
  const grandCashApp = rows.reduce((s, r) => s + r.cashApp, 0);
  const grandCash = rows.reduce((s, r) => s + r.cash, 0);
  const grandCard = rows.reduce((s, r) => s + r.card, 0);

  return `
    <section class="card" style="margin-top:20px;border:1px solid #d7bd78">
      <div class="card-head">
        <div>
          <span class="eyebrow">ADMIN END-OF-SEASON COLLECTIONS</span>
          <h2 class="card-title">Registration Balances & Payment Methods by Coach</h2>
          <div class="card-subtitle">Collected: <b style="color:#15803d">${grandCollected.toFixed(2)}</b> · Balance Due: <b style="color:#b91c1c">${grandDue.toFixed(2)}</b> · Cash App: <b>${grandCashApp.toFixed(2)}</b> · Cash: <b>${grandCash.toFixed(2)}</b> · Card: <b>${grandCard.toFixed(2)}</b></div>
        </div>
      </div>
      <div class="table-wrap">
        <table class="data-table" style="min-width:760px">
          <thead>
            <tr>
              <th>Coach</th>
              <th>Team / Division</th>
              <th>Roster</th>
              <th>Due Count</th>
              <th>Amt Paid</th>
              <th>Balance Due</th>
              <th>Cash App</th>
              <th>Cash</th>
              <th>Card</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${rows.map(r => `
              <tr>
                <td><strong>${esc(r.team.coach || 'Unassigned')}</strong></td>
                <td>${esc(r.team.name)} <small style="color:var(--muted)">(${esc(r.team.division)})</small></td>
                <td>${r.players.length}</td>
                <td>${r.unpaidCount > 0 ? statusBadge(`${r.unpaidCount} due`) : statusBadge('All paid')}</td>
                <td style="color:#15803d;font-weight:700">${r.collected.toFixed(2)}</td>
                <td style="color:${r.balDue > 0 ? '#b91c1c' : '#15803d'};font-weight:700">${r.balDue.toFixed(2)}</td>
                <td>${r.cashApp.toFixed(2)}</td>
                <td>${r.cash.toFixed(2)}</td>
                <td>${r.card.toFixed(2)}</td>
                <td><button class="btn small gold" data-push-collections="${r.team.id}">Push Collections →</button></td>
              </tr>
            `).join('') || '<tr><td colspan="10"><div class="empty">No teams created yet.</div></td></tr>'}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderTrackerSummaryCard() {
  const teams = allowedTeams();
  const regs = allowedRegistrations();
  const totalUniformsPaid = regs.filter(r => r.uniformPaid).length;
  const totalRegPaid = regs.filter(r => r.paid).length;
  const totalFundraiserDollars = regs.reduce((sum, r) => sum + (Number(r.fundraiserAmount) || 0), 0);

  return `
    <section class="card" style="margin-top:20px">
      <div class="card-head">
        <div>
          <h2 class="card-title">Uniform Roster, Registration PD & Fundraisers Summary</h2>
          <div class="card-subtitle">${isMaster() ? 'Live breakdown across all teams & coaches' : 'Live breakdown for your assigned team(s)'}</div>
        </div>
        <button class="btn small gold" data-view-link="teams">Open Team Tracker →</button>
      </div>
      <div class="stats-grid" style="margin-bottom:16px">
        ${stat('Uniforms Paid', `${totalUniformsPaid} / ${regs.length}`, '❖', 'Jersey sizes & numbers tracked', 'good', 'stat-teams')}
        ${stat('Registration PD', `${totalRegPaid} / ${regs.length}`, '✓', 'Registration payments verified', 'good', 'stat-payments')}
        ${stat('Fundraisers Raised', `$${totalFundraiserDollars.toFixed(0)}`, '$', `${regs.filter(r=>r.fundraiserPaid).length} players turned in`, 'good', 'stat-teams')}
        ${stat('Active Teams', teams.length, '◉', 'Click to manage rosters & jerseys', 'good', 'stat-teams')}
      </div>
      <div class="table-wrap">
        <table class="data-table" style="min-width:620px">
          <thead>
            <tr>
              <th>Team</th>
              <th>Coach</th>
              <th>Division</th>
              <th>Roster</th>
              <th>Uniforms Paid</th>
              <th>Registration PD</th>
              <th>Fundraisers</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${teams.map(t => {
              const tr = regs.filter(r => r.teamId === t.id);
              const uPaid = tr.filter(r => r.uniformPaid).length;
              const rPaid = tr.filter(r => r.paid).length;
              const fSum = tr.reduce((acc, r) => acc + (Number(r.fundraiserAmount) || 0), 0);
              return `
                <tr>
                  <td><strong>${esc(t.name)}</strong></td>
                  <td>${esc(t.coach)}</td>
                  <td>${esc(t.division)}</td>
                  <td>${tr.length} / ${t.capacity}</td>
                  <td>${statusBadge(`${uPaid}/${tr.length} Paid`)}</td>
                  <td>${statusBadge(`${rPaid}/${tr.length} PD`)}</td>
                  <td><strong>$${fSum.toFixed(2)}</strong></td>
                  <td><button class="btn small primary" data-open-workspace="${t.id}">Manage →</button></td>
                </tr>
              `;
            }).join('') || '<tr><td colspan="8"><div class="empty">No teams created yet.</div></td></tr>'}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderTeamWorkspace(team) {
  if (!team) return '';
  const roster = state.registrations.filter(r => r.teamId === team.id);
  const uPaidCount = roster.filter(r => r.uniformPaid).length;
  const rPaidCount = roster.filter(r => r.paid).length;
  const fTotal = roster.reduce((s, r) => s + (Number(r.fundraiserAmount) || 0), 0);

  let tabBody = '';

  if (activeWorkspaceTab === 'uniform') {
    tabBody = `
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:14px">
        <div>
          <strong>Uniform Roster — ${esc(team.name)} (${esc(team.division)})</strong>
          <p class="card-subtitle">${uPaidCount} of ${roster.length} uniforms paid · Changes save automatically</p>
        </div>
        <div class="actions">
    <button class="btn small danger" data-action="workspace-clear-roster" data-id="${team.id}">Clear Roster</button>
    <button class="btn gold small" data-action="workspace-add-player" data-id="${team.id}">＋ Add Player</button>
  </div>
      </div>
      <div class="table-wrap">
        <table class="data-table" style="min-width:680px">
          <thead>
            <tr>
              <th>Player Name</th>
              <th style="width:95px">Jersey #</th>
              <th style="width:115px">Size</th>
              <th style="width:95px">Quantity</th>
              <th style="width:80px;text-align:center">Paid</th>
              <th style="width:95px">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${roster.map(r => `
              <tr>
                <td><input class="inline-input" data-player-field="name" data-id="${r.id}" value="${esc(r.name)}"></td>
                <td><input class="inline-input num" data-player-field="jersey" data-id="${r.id}" value="${esc(r.jersey || '')}" placeholder="#"></td>
                <td>
                  <select class="inline-input" data-player-field="uniformSize" data-id="${r.id}">
                    ${UNIFORM_SIZES.map(sz => `<option value="${sz}" ${r.uniformSize===sz?'selected':''}>${sz}</option>`).join('')}
                  </select>
                </td>
                <td><input type="number" min="1" max="10" class="inline-input num" data-player-field="uniformQty" data-id="${r.id}" value="${r.uniformQty || 1}"></td>
                <td style="text-align:center"><input type="checkbox" class="inline-check" data-player-check="uniformPaid" data-id="${r.id}" ${r.uniformPaid?'checked':''}></td>
                <td><button class="btn small danger" data-workspace-remove="${r.id}">Remove</button></td>
              </tr>
            `).join('') || '<tr><td colspan="6"><div class="empty">No players on this roster yet. Click "+ Add Player" above.</div></td></tr>'}
          </tbody>
        </table>
      </div>
    `;
  } else if (activeWorkspaceTab === 'regpd') {
    const defaultFee = Number(state.defaultRegFee) || 100;
    const totalCollected = roster.reduce((sum, r) => sum + (Number(r.regAmountPaid) || 0), 0);
    const totalDue = roster.reduce((sum, r) => {
      const fee = Number(r.regFee ?? defaultFee);
      const pd = Number(r.regAmountPaid) || 0;
      return sum + Math.max(0, fee - pd);
    }, 0);

    tabBody = `
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:14px">
        <div>
          <strong>Registration PD — ${esc(team.name)} (${esc(team.division)})</strong>
          <p class="card-subtitle">${rPaidCount} of ${roster.length} paid · Collected: <b>${totalCollected.toFixed(2)}</b> · Balance Due: <b style="color:${totalDue > 0 ? '#b91c1c' : '#15803d'}">${totalDue.toFixed(2)}</b></p>
        </div>
        <div class="actions">
          <label style="font-size:12px;font-weight:700;display:flex;align-items:center;gap:6px">
            Season Fee ($)
            <input type="number" min="0" step="5" class="inline-input num" data-action="set-default-reg-fee" value="${defaultFee}">
          </label>
          <button class="btn gold small" data-action="workspace-add-player" data-id="${team.id}">＋ Add Player</button>
        </div>
      </div>
      <div class="table-wrap">
        <table class="data-table" style="min-width:780px">
          <thead>
            <tr>
              <th>Player Name</th>
              <th>Contact Email</th>
              <th style="width:105px">Amt Paid ($)</th>
              <th style="width:105px">Balance Due</th>
              <th style="width:130px">Method of Pymt</th>
              <th style="width:65px;text-align:center">PD</th>
              <th style="width:150px">Status</th>
            </tr>
          </thead>
          <tbody>
            ${roster.map(r => {
              const fee = Number(r.regFee ?? defaultFee);
              const amtPaid = Number(r.regAmountPaid) || 0;
              const balDue = Math.max(0, fee - amtPaid);
              const method = r.regPaymentMethod || '';
              return `
                <tr>
                  <td><strong>${esc(r.name)}</strong><small style="display:block;color:var(--muted);font-size:10px">${esc(team.division)}</small></td>
                  <td><input class="inline-input" data-player-field="email" data-id="${r.id}" value="${esc(r.email || '')}" placeholder="email@example.com"></td>
                  <td><input type="number" min="0" step="5" class="inline-input num" data-player-field="regAmountPaid" data-id="${r.id}" value="${amtPaid}"></td>
                  <td><strong style="color:${balDue > 0 ? '#b91c1c' : '#15803d'}">${balDue.toFixed(2)}</strong></td>
                  <td>
                    <select class="inline-input" data-player-field="regPaymentMethod" data-id="${r.id}">
                      <option value="" ${method === '' ? 'selected' : ''}>— Select —</option>
                      <option value="Cash App" ${method === 'Cash App' ? 'selected' : ''}>Cash App</option>
                      <option value="Cash" ${method === 'Cash' ? 'selected' : ''}>Cash</option>
                      <option value="Card" ${method === 'Card' ? 'selected' : ''}>Card</option>
                    </select>
                  </td>
                  <td style="text-align:center"><input type="checkbox" class="inline-check" data-player-check="paid" data-id="${r.id}" ${r.paid?'checked':''}></td>
                  <td>
                    <select class="inline-input" data-player-field="status" data-id="${r.id}">
                      ${['Payment due','Partial','Complete','Pending review','Needs waiver'].map(st => `<option value="${st}" ${r.status===st?'selected':''}>${st}</option>`).join('')}
                    </select>
                  </td>
                </tr>
              `;
            }).join('') || '<tr><td colspan="7"><div class="empty">No players on this roster yet.</div></td></tr>'}
          </tbody>
        </table>
      </div>
    `;
  } else if (activeWorkspaceTab === 'fundraisers') {
    tabBody = `
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:14px">
        <div>
          <strong>Fundraisers — ${esc(team.name)}</strong>
          <p class="card-subtitle">Total Raised: <b>$${fTotal.toFixed(2)}</b> · ${roster.filter(r=>r.fundraiserPaid).length} of ${roster.length} players turned in</p>
        </div>
        <button class="btn gold small" data-action="workspace-add-player" data-id="${team.id}">＋ Add Player</button>
      </div>
      <div class="table-wrap">
        <table class="data-table" style="min-width:680px">
          <thead>
            <tr>
              <th>Player Name</th>
              <th>Fundraiser / Item</th>
              <th style="width:105px">Qty / Tickets</th>
              <th style="width:120px">Amount ($)</th>
              <th style="width:95px;text-align:center">Turned In</th>
            </tr>
          </thead>
          <tbody>
            ${roster.map(r => `
              <tr>
                <td><strong>${esc(r.name)}</strong></td>
                <td><input class="inline-input" data-player-field="fundraiserItem" data-id="${r.id}" value="${esc(r.fundraiserItem || '')}" placeholder="e.g. Raffle Tickets"></td>
                <td><input type="number" min="0" class="inline-input num" data-player-field="fundraiserQty" data-id="${r.id}" value="${r.fundraiserQty || 0}"></td>
                <td><input type="number" min="0" step="0.01" class="inline-input num" data-player-field="fundraiserAmount" data-id="${r.id}" value="${r.fundraiserAmount || 0}"></td>
                <td style="text-align:center"><input type="checkbox" class="inline-check" data-player-check="fundraiserPaid" data-id="${r.id}" ${r.fundraiserPaid?'checked':''}></td>
              </tr>
            `).join('') || '<tr><td colspan="5"><div class="empty">No players on this roster yet.</div></td></tr>'}
          </tbody>
        </table>
      </div>
    `;
  }

  return `
    <section class="card" id="teamWorkspaceCard" style="margin-bottom:24px;border:2px solid var(--gold)">
      <div class="card-head">
        <div>
          <span class="eyebrow">TEAM LEAGUE TRACKER WORKSPACE</span>
          <h2 class="card-title">${esc(team.name)} · Coach ${esc(team.coach)} (${esc(team.division)})</h2>
          <div class="card-subtitle">${esc(team.practices)} · ${esc(team.practiceLocation)}</div>
        </div>
        <button class="btn small" data-action="close-workspace">Close Workspace ✕</button>
      </div>
      <div class="tracker-tabs">
        <button class="tracker-tab ${activeWorkspaceTab==='uniform'?'active':''}" data-workspace-tab="uniform">Uniform Roster (${roster.length})</button>
        <button class="tracker-tab ${activeWorkspaceTab==='regpd'?'active':''}" data-workspace-tab="regpd">Registration PD (${rPaidCount}/${roster.length})</button>
        <button class="tracker-tab ${activeWorkspaceTab==='fundraisers'?'active':''}" data-workspace-tab="fundraisers">Fundraisers ($${fTotal.toFixed(0)})</button>
      </div>
      ${tabBody}
    </section>
  `;
}

const views = {
  dashboard(){
    const reg = allowedRegistrations();
    const teams = allowedTeams();
    const complete = reg.filter(r=>r.status==='Complete').length;
    const paid = reg.filter(r=>r.paid).length;
    const rostered = reg.filter(r=>r.teamId).length;
    const todayIso = new Date().toISOString().slice(0,10);
    const upcoming = [...state.events].filter(e=>e.date>=todayIso).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,5);

    const adminActions = isMaster()
      ? `<button class="btn" data-action="import-legacy-json-modal">↑ Import Legacy Tracker JSON</button><button class="btn" data-action="export-backup">↓ Backup</button><button class="btn primary" data-action="add-registration">＋ Add athlete</button>`
      : `<button class="btn primary" data-view-link="teams">Open my teams</button>`;

    return `
      ${pageHead('SAINTS COMMAND CENTER','Season overview', isMaster() ? 'Everything needed to run St. Ann’s CYO athletics in one place.' : `Coach portal view for ${esc(currentUser().name)}.`, adminActions)}
      <section class="hero"><div class="hero-copy"><span class="eyebrow">CURRENT ACTIVE SEASON</span><h2>Basketball 2026–2027</h2><p>${isMaster() ? 'Registration, team formation, facilities, and communications for all six CYO divisions—from Tot through Junior.' : 'Manage your Uniform Roster, Registration PD, Fundraisers, and practice schedule.'}</p>${canView('registrations') ? `<button class="btn gold" data-view-link="registrations">Manage registrations</button>` : `<button class="btn gold" data-view-link="teams">My teams & tracker</button>`}<button class="btn" data-view-link="schedule">View schedule & calendar</button></div><div class="season-roundel"><small>SAINTS</small><strong>26 / 27</strong><small>BASKETBALL</small></div></section>
      <section class="stats-grid">
        ${stat(isMaster() ? 'Registered athletes' : 'My team athletes', reg.length, '◎', `${complete} complete →`, 'good', 'stat-athletes')}
        ${stat(isMaster() ? 'Teams formed' : 'Assigned teams', teams.length, '❖', `${rostered} athletes placed →`, 'good', 'stat-teams')}
        ${stat('Payments received', paid, '$', `${reg.length-paid} outstanding →`, reg.length===paid?'good':'', 'stat-payments')}
        ${stat(isMaster() ? 'Volunteers cleared' : 'Practice slots', isMaster() ? state.volunteers.filter(v=>v.status==='Cleared').length : teams.length, '♙', isMaster() ? `${state.volunteers.length} total volunteers →` : 'Weekly recurring →', 'good', 'stat-fourth')}
      </section>
      ${renderTrackerSummaryCard()}
      ${renderAdminCoachCollectionsCard()}
      <section class="grid-2" style="margin-top:20px">
        <article class="card"><div class="card-head"><div><h2 class="card-title">Upcoming dates</h2><div class="card-subtitle">Basketball 2026–2027</div></div><button class="link-btn" data-view-link="schedule">VIEW ALL →</button></div><div class="event-list">${upcoming.map(eventRow).join('') || '<div class="empty">No upcoming dates.</div>'}</div></article>
        <article class="card"><div class="card-head"><div><h2 class="card-title">Season readiness</h2><div class="card-subtitle">${isMaster() ? 'Live completion indicators' : 'Team roster readiness'}</div></div></div>
          ${progress('Registration files',complete,reg.length)}${progress('Athletes rostered',rostered,reg.length)}${progress('Payments complete',paid,reg.length)}${isMaster() ? progress('Volunteer clearances',state.volunteers.filter(v=>v.status==='Cleared').length,state.volunteers.length) : ''}
          ${canView('reports') ? `<button class="btn" data-view-link="reports" style="width:100%;margin-top:12px">Open readiness reports</button>` : ''}</article>
      </section>
      <section class="card" style="margin-top:20px">
        <div class="card-head">
          <div>
            <h2 class="card-title">Needs attention</h2>
            <div class="card-subtitle">${isMaster() ? 'All teams & players — grouped by team' : 'Action items for your assigned team(s)'}</div>
          </div>
        </div>
        <div>${attentionItemsByTeam() || '<div class="empty"><span>✓</span>Nothing needs attention.</div>'}</div>
      </section>`;
  },

  sports(){
    return `${pageHead('PROGRAMS','Sports & seasons','Showcase of Saints CYO sports programs and active teams competing this season.','')}
    <div class="sport-grid">
      ${state.sports.map(s => {
        const playingTeams = state.teams.filter(t => (t.sportId || 'basketball') === s.id);
        return `
          <article class="card sport-card ${s.status==='Active'?'active':''}" data-action="sport-detail" data-id="${s.id}">
            <div class="sport-banner" data-symbol="${esc(s.symbol)}">
              <div><span class="eyebrow">${esc(s.season)} · ${esc(s.year)}</span><h3>${esc(s.name)}</h3></div>
            </div>
            <div class="sport-body">
              <div class="sport-meta"><span>${s.divisions.length} divisions · ${playingTeams.length} team${playingTeams.length===1?'':'s'} playing</span>${statusBadge(s.status)}</div>
              <div class="sport-actions">
                <small>${playingTeams.length ? playingTeams.map(t=>esc(t.name)).join(', ') : 'No active teams assigned'}</small>
                <span class="link-btn">View teams →</span>
              </div>
            </div>
          </article>
        `;
      }).join('')}
    </div>`;
  },

  registrations(){
    const regs = allowedRegistrations();
    return `${pageHead('ATHLETE ADMINISTRATION','Registrations','Review enrollment, payments, waivers, CSV roster imports, and team placement.',`
      <button class="btn danger" id="massDeleteRegBtn" data-action="mass-delete-registrations" style="display:${selectedRegIds.size?'inline-flex':'none'}">🗑 Delete Selected (${selectedRegIds.size})</button>
      <button class="btn" data-action="import-csv-modal">↑ Import CSV</button>
      <button class="btn" data-action="export-registrations">↓ CSV</button>
      <button class="btn primary" data-action="add-registration">＋ New registration</button>
    `)}
    <section class="card flush">
      <div style="padding:18px 20px 0">
        <div class="toolbar">
          <div class="search-box"><input id="regSearch" placeholder="Search athlete, email, or team…" aria-label="Search registrations"></div>
          <div class="filters">
            <select id="divisionFilter"><option value="">All divisions</option>${activeSport().divisions.map(d=>`<option>${d}</option>`).join('')}</select>
            <select id="statusFilter"><option value="">All statuses</option><option>Complete</option><option>Pending review</option><option>Payment due</option><option>Needs waiver</option></select>
          </div>
        </div>
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width:36px"><input type="checkbox" id="selectAllRegs" aria-label="Select all registrations"></th>
              <th>Athlete</th>
              <th>Division</th>
              <th>Email / Contact</th>
              <th>Jersey / Size</th>
              <th>Registration</th>
              <th>Payment</th>
              <th>Team</th>
              <th></th>
            </tr>
          </thead>
          <tbody id="registrationRows">${registrationRows(regs)}</tbody>
        </table>
      </div>
    </section>`;
  },

  teams(){
    const allAllowed = allowedTeams();
    const uniqueCoaches = [...new Set(allAllowed.map(t => t.coach).filter(Boolean))];
    if (selectedCoachFilter !== 'ALL' && !uniqueCoaches.includes(selectedCoachFilter)) {
      selectedCoachFilter = 'ALL';
    }
    const visibleTeams = selectedCoachFilter === 'ALL'
      ? allAllowed
      : allAllowed.filter(t => t.coach === selectedCoachFilter);

    // Auto-select first team for a coach if none is open yet so they see their tracker immediately
    if (!isMaster() && !activeWorkspaceTeamId && visibleTeams.length > 0) {
      activeWorkspaceTeamId = visibleTeams[0].id;
    }
    const workspaceTeam = allAllowed.find(t => t.id === activeWorkspaceTeamId) || null;

    const actions = isMaster()
      ? `<button class="btn danger" id="massDeleteTeamBtn" data-action="mass-delete-teams" style="display:${selectedTeamIds.size?'inline-flex':'none'}">🗑 Delete Selected (${selectedTeamIds.size})</button>
         <button class="btn" data-action="import-legacy-json-modal">↑ Import Legacy JSON</button>
         <button class="btn" data-action="import-csv-modal">↑ Import CSV</button>
         <button class="btn" data-action="export-rosters">↓ Rosters</button>
         <button class="btn primary" data-action="add-team">＋ Create Team</button>`
      : `<button class="btn" data-action="export-rosters">↓ Export My Rosters</button>`;

    const coachSubBar = allAllowed.length ? `
      <div class="card" style="margin-bottom:20px;padding:16px 20px">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;margin-bottom:10px">
          <span class="eyebrow">${isMaster() ? 'SELECT COACH OR TEAM TRACKER' : 'SELECT YOUR TEAM TO MANAGE UNIFORM ROSTER, REGISTRATION PD & FUNDRAISERS'}</span>
          <small style="color:var(--muted)">Showing ${visibleTeams.length} of ${allAllowed.length} team(s)</small>
        </div>
        ${isMaster() ? `
          <div class="actions" style="margin-bottom:10px">
            <button class="btn small ${selectedCoachFilter==='ALL'?'gold':''}" data-coach-filter="ALL">All Coaches (${allAllowed.length})</button>
            ${uniqueCoaches.map(coachName => {
              const count = allAllowed.filter(t => t.coach === coachName).length;
              return `<button class="btn small ${selectedCoachFilter===coachName?'gold':''}" data-coach-filter="${esc(coachName)}">Coach ${esc(coachName)} (${count})</button>`;
            }).join('')}
          </div>
        ` : ''}
        <div class="actions">
          ${visibleTeams.map(t => `
            <button class="btn small ${activeWorkspaceTeamId===t.id?'primary':''}" data-open-workspace="${t.id}">
              ❖ ${esc(t.name)} (${esc(t.division)})
            </button>
          `).join('')}
        </div>
      </div>
    ` : '';

    return `${pageHead('TEAM ROSTERS & LEAGUE TRACKER','Teams', isMaster() ? 'Click any coach or team to open their Uniform Roster, Registration PD, and Fundraiser tracker.' : 'Switch between your teams to manage Uniform Roster, Registration PD, and Fundraisers.', actions)}
    ${coachSubBar}
    ${workspaceTeam ? renderTeamWorkspace(workspaceTeam) : ''}
    <div class="team-grid">${visibleTeams.map(t => teamCardWithKids(t)).join('') || '<div class="card empty" style="grid-column:1/-1"><span>❖</span>No teams assigned yet.</div>'}</div>`;
  },

  coaches(){
    const teams = allowedTeams();
    const uniqueCoaches = [...new Set(teams.map(t => t.coach).filter(Boolean))];
    const actions = isMaster()
      ? `<button class="btn" data-action="add-user">＋ Add Coach Login</button>
         <button class="btn primary" data-action="add-team">＋ Add Coach & Team</button>`
      : '';

    const coachCards = uniqueCoaches.map(coachName => {
      const coachTeams = teams.filter(t => t.coach === coachName);
      const totalKids = state.registrations.filter(r => coachTeams.some(ct => ct.id === r.teamId)).length;
      return `
        <article class="card team-card">
          <i class="team-color"></i>
          <div class="team-head">
            <div class="team-badge">${initials(coachName)}</div>
            <div>
              <h3>${esc(coachName)}</h3>
              <p>${coachTeams.length} Team${coachTeams.length===1?'':'s'} · ${totalKids} Total Kids</p>
            </div>
          </div>
          <div class="activity-list" style="margin-top:14px">
            ${coachTeams.map(ct => {
              const kidsCount = state.registrations.filter(r => r.teamId === ct.id).length;
              return `
                <div class="activity" style="grid-template-columns:9px 1fr auto;align-items:center">
                  <i></i>
                  <div>
                    <h4>${esc(ct.name)} (${esc(ct.division)})</h4>
                    <p>${esc(ct.practices)} · ${kidsCount}/${ct.capacity} kids</p>
                  </div>
                  <button class="btn small primary" data-open-workspace-nav="${ct.id}">Tracker (${kidsCount})</button>
                </div>
              `;
            }).join('')}
          </div>
          <div style="margin-top:14px;display:flex;justify-content:flex-end">
            <button class="btn small" data-jump-coach-teams="${esc(coachName)}">Open in Teams Tab →</button>
          </div>
        </article>
      `;
    }).join('');

    return `${pageHead('COACHING STAFF','Coaches','Click any coach to view their teams, rosters, uniforms, and fundraisers.', actions)}
    <div class="team-grid">${coachCards || '<div class="card empty" style="grid-column:1/-1"><span>◉</span>No coaches assigned yet.</div>'}</div>`;
  },

  schedule(){
    const events=[...state.events].sort((a,b)=>a.date.localeCompare(b.date));
    const teams = allowedTeams();
    const actions = isMaster()
      ? `<button class="btn" onclick="window.print()">⎙ Print</button><button class="btn" data-action="add-practice-slot">＋ Add Practice Slot</button><button class="btn primary" data-action="add-event">＋ Add event</button>`
      : `<button class="btn" onclick="window.print()">⎙ Print</button>`;

    return `${pageHead('MASTER CALENDAR','Schedule','Weekly auto-updating practice calendar plus preseason, regular-season, and playoff milestones.', actions)}
      ${renderWeeklyCalendar()}
      <article class="card" style="margin-bottom:22px">
        <div class="card-head">
          <div>
            <h2 class="card-title">Recurring Team Practice Slots</h2>
            <div class="card-subtitle">Automatically synced to the weekly calendar above</div>
          </div>
          ${isMaster() ? `<button class="btn small" data-action="add-practice-slot">＋ Assign / Edit Slot</button>` : ''}
        </div>
        <div class="grid-3">
          ${teams.map(t => `
            <div class="attention-team-group" style="margin:0">
              <div class="attention-team-head">
                <strong>${esc(t.name)}</strong>
                ${statusBadge(t.practiceDay)}
              </div>
              <p style="margin:0;font-size:12px"><b>${esc(t.practiceTime)}</b> · ${esc(t.practiceLocation || "St. Ann's Gym")}</p>
              <small style="color:var(--muted)">Coach: ${esc(t.coach)} · ${esc(t.division)}</small>
            </div>
          `).join('') || '<div class="empty" style="grid-column:1/-1">No practice slots scheduled yet.</div>'}
        </div>
      </article>
      <div class="toolbar"><div class="kicker">Basketball 2026–2027 master schedule</div><div class="filters"><select id="phaseFilter"><option value="">All phases</option><option>Preseason</option><option>Regular season</option><option>Zone playoffs</option><option>City tournament</option></select></div></div>
      <section class="timeline" id="scheduleList">${events.map(timelineItem).join('') || '<div class="card empty">No master schedule events yet.</div>'}</section>
      <article class="card" style="margin-top:20px"><div class="card-head"><div><h2 class="card-title">Scheduling notes</h2><div class="card-subtitle">Winter 2026–2027 facility plan</div></div></div><div class="grid-3"><div><b>Weeks 1–6</b><p class="card-subtitle">Regular season · Jan 8–Feb 14</p></div><div><b>Week 7</b><p class="card-subtitle">Zone playoffs · Feb 19–21</p></div><div><b>Week 8</b><p class="card-subtitle">City tournament · Feb 26–28</p></div></div></article>`;
  },

  volunteers(){ return `${pageHead('SAFE ENVIRONMENT','Volunteers','Coordinate coaches and required clearances before athletes take the court.',`<button class="btn" data-action="export-volunteers">↓ CSV</button><button class="btn primary" data-action="add-volunteer">＋ Add volunteer</button>`)}<section class="card flush"><div class="table-wrap"><table class="data-table"><thead><tr><th>Volunteer</th><th>Assignment</th><th>Safe environment</th><th>Background check</th><th>Overall</th><th></th></tr></thead><tbody>${state.volunteers.map(v=>`<tr><td><div class="person"><span class="person-mark">${initials(v.name)}</span><div><strong>${esc(v.name)}</strong><small>${esc(v.email)}</small></div></div></td><td><b>${esc(v.role)}</b><br><small>${esc(v.team)}</small></td><td>${statusBadge(v.safe)}</td><td>${statusBadge(v.background)}</td><td>${statusBadge(v.status)}</td><td><button class="btn small" data-action="edit-volunteer" data-id="${v.id}">Update</button></td></tr>`).join('') || '<tr><td colspan="6"><div class="empty">No volunteers listed.</div></td></tr>'}</tbody></table></div></section>`; },

  communications(){ return `${pageHead('FAMILY OUTREACH','Communications','Create clear, season-specific updates for families, coaches, and volunteers.',`<button class="btn primary" data-action="add-announcement">＋ New announcement</button>`)}<section class="grid-2"><article class="card"><div class="card-head"><div><h2 class="card-title">Published announcements</h2><div class="card-subtitle">Visible in the family portal</div></div></div><div class="announcement-list">${state.announcements.map(a=>`<div class="activity"><i></i><div><div style="display:flex;justify-content:space-between;gap:10px"><h4>${esc(a.title)}</h4>${statusBadge(a.audience)}</div><p>${esc(a.body)}</p><small style="color:#999">${fmtDate(a.date)}</small></div></div>`).join('') || '<div class="empty">No announcements published.</div>'}</div></article><article class="card"><div class="card-head"><div><h2 class="card-title">Audience shortcuts</h2><div class="card-subtitle">Start a targeted message</div></div></div>${['All basketball families','Coaches & assistants','Unpaid registrations','Missing waivers'].map(x=>`<button class="btn" data-action="quick-message" data-audience="${x}" style="width:100%;margin-bottom:9px;justify-content:space-between">${x}<span>→</span></button>`).join('')}<div class="card" style="background:var(--gold-pale);margin-top:10px"><b>Delivery note</b><p class="card-subtitle">This local version publishes to the family portal. Connect an email/SMS provider for external delivery.</p></div></article></section>`; },

  reports(){ return `${pageHead('OPERATIONS','Reports & exports','Download clean working lists for check-in, coaches, parish leadership, and CYO reporting.',`<button class="btn primary" data-action="export-backup">↓ Full backup</button>`)}<div class="report-grid">${[
    ['◎','Registration report','Athletes, division, email, status, payment, and team.','export-registrations'],['❖','Team rosters & uniforms','Roster with jersey numbers, uniform sizes, and coaches.','export-rosters'],['▦','Master schedule','All milestones and games in chronological order.','export-schedule'],['♙','Volunteer compliance','Assignments, safe-environment status, and background checks.','export-volunteers'],['$','Payment & fundraiser report','Outstanding balances and fundraiser totals.','export-payments'],['✓','Season readiness','Print the current operating dashboard.','print-dashboard']
  ].map(r=>`<article class="card report-card" data-action="${r[3]}"><div class="report-icon">${r[0]}</div><h3>${r[1]}</h3><p>${r[2]}</p><button class="link-btn">CREATE REPORT →</button></article>`).join('')}</div>`; },

  portal(){ const next=state.events.filter(e=>e.date>='2026-11-01').sort((a,b)=>a.date.localeCompare(b.date)).slice(0,3); return `${pageHead('PUBLIC EXPERIENCE','Family portal','Preview the information families see without exposing administration tools.',`<button class="btn" data-action="copy-portal">⧉ Copy portal link</button>`)}<section class="portal-shell"><div class="portal-hero"><div style="position:relative;z-index:1"><span class="eyebrow">ST. ANN'S SAINTS</span><h2>Faith. Teamwork. Community.</h2><p>Welcome to the home of St. Ann’s CYO Sports. Registration for the 2026–2027 basketball season is now open.</p><button class="btn gold" data-action="family-register">Register an athlete</button></div></div><div class="portal-content"><div class="quick-grid"><button class="quick-card" data-action="family-register"><span>◎</span><b>Registration</b><small>Start or complete enrollment</small></button><button class="quick-card" data-view-link="schedule"><span>▦</span><b>Schedule</b><small>Games and important dates</small></button><button class="quick-card" data-view-link="teams"><span>❖</span><b>Teams</b><small>Rosters and practices</small></button><button class="quick-card" data-view-link="communications"><span>✦</span><b>Updates</b><small>News for Saints families</small></button></div><div class="grid-2" style="margin-top:25px"><article class="card"><div class="card-head"><h2 class="card-title">Next up</h2></div>${next.map(eventRow).join('') || '<div class="empty">No upcoming events.</div>'}</article><article class="card"><div class="card-head"><h2 class="card-title">Latest updates</h2></div>${state.announcements.slice(-3).reverse().map(a=>`<div class="activity"><i></i><div><h4>${esc(a.title)}</h4><p>${esc(a.body)}</p></div></div>`).join('') || '<div class="empty">No updates yet.</div>'}</article></div></div></section>`; },

  settings(){
    const o = state.organization;
    let panelHtml = '';

    if (settingsTab === 'org') {
      panelHtml = `
        <form class="card" id="orgForm">
          <div class="card-head"><div><h2 class="card-title">Organization profile</h2><div class="card-subtitle">Used throughout the administration and family views</div></div></div>
          <div class="form-grid">
            <div class="field full"><label>Organization name</label><input name="name" value="${esc(o.name)}" required></div>
            <div class="field"><label>Parish / school</label><input name="parish" value="${esc(o.parish)}"></div>
            <div class="field"><label>City</label><input name="city" value="${esc(o.city)}"></div>
            <div class="field"><label>Program email</label><input type="email" name="email" value="${esc(o.email)}"></div>
            <div class="field"><label>Program phone</label><input name="phone" value="${esc(o.phone)}"></div>
            <div class="field full"><label>Director title</label><input name="director" value="${esc(o.director)}"></div>
          </div>
          <div class="form-actions"><button class="btn primary">Save profile</button></div>
        </form>
      `;
    } else if (settingsTab === 'data') {
      panelHtml = `
        <section class="card">
          <div class="card-head"><div><h2 class="card-title">Data management</h2><div class="card-subtitle">Convert & import JSON from stanns.opp-solutions.com, export backups, import CSV rosters, or clear demo data</div></div></div>
          <div class="actions" style="margin-bottom:16px">
            <button class="btn gold" data-action="import-legacy-json-modal">↑ Convert & Import stanns.opp-solutions.com JSON</button>
            <button class="btn" data-action="export-backup">↓ Export JSON backup</button>
            <button class="btn" data-action="import-backup">↑ Import JSON backup</button>
            <button class="btn" data-action="import-csv-modal">↑ Import Team CSV Roster</button>
            <button class="btn danger-solid" data-action="delete-all-data">🗑 Delete All Data (Clear Demo)</button>
            <button class="btn danger" data-action="reset-data">Restore demo data</button>
          </div>
          <div class="card" style="background:var(--gold-pale)">
            <b>Storage Status</b>
            <p class="card-subtitle">Currently storing ${state.registrations.length} athletes, ${state.teams.length} teams, ${state.events.length} schedule events, and ${state.users.length} user accounts locally in this browser.</p>
          </div>
        </section>
      `;
    } else if (settingsTab === 'access') {
      panelHtml = `
        <section class="card">
          <div class="card-head">
            <div>
              <h2 class="card-title">Access & Roles</h2>
              <div class="card-subtitle">Manage Master Admin credentials and Coach multi-team logins</div>
            </div>
            <button class="btn primary small" data-action="add-user">＋ Add Coach Login</button>
          </div>
          <div class="table-wrap">
            <table class="data-table" style="min-width:540px">
              <thead>
                <tr><th>Name</th><th>Username</th><th>Role</th><th>Assigned Team(s)</th><th>Access Tabs</th><th></th></tr>
              </thead>
              <tbody>
                ${state.users.map(u => {
                  const assigned = u.role === 'master'
                    ? ['All Teams']
                    : state.teams.filter(t => (u.teamIds || []).includes(t.id) || String(t.coach).toLowerCase() === String(u.coachName || u.name).toLowerCase()).map(t => t.name);
                  const teamNames = assigned.length ? assigned.join(', ') : 'None';
                  return `
                    <tr>
                      <td><strong>${esc(u.name)}</strong></td>
                      <td><code>${esc(u.username)}</code></td>
                      <td>${statusBadge(u.role === 'master' ? 'Master Admin' : 'Coach')}</td>
                      <td>${esc(teamNames)}</td>
                      <td><small>${u.role === 'master' ? 'Full Access' : 'Overview, Teams, Schedule'}</small></td>
                      <td>
                        <button class="btn small" data-action="edit-user" data-id="${u.id}">Edit</button>
                        ${u.role !== 'master' ? `<button class="btn small danger" data-action="delete-user" data-id="${u.id}">Remove</button>` : ''}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </section>
      `;
    }

    return `${pageHead('ADMINISTRATION','Settings','Manage organization details, legacy JSON migration, backups, and coach logins.','')}
      <div class="settings-grid">
        <aside class="card settings-nav">
          <button class="${settingsTab==='org'?'active':''}" data-settings-tab="org">Organization</button>
          <button class="${settingsTab==='data'?'active':''}" data-settings-tab="data">Data management</button>
          <button class="${settingsTab==='access'?'active':''}" data-settings-tab="access">Access & roles</button>
        </aside>
        <section>${panelHtml}</section>
      </div>`;
  }
};

function stat(label,value,icon,note,cls='',actionName=''){
  return `<article class="stat-card ${actionName ? 'clickable' : ''}" ${actionName ? `data-action="${actionName}"` : ''}><div class="stat-top"><span class="stat-label">${label}</span><span class="stat-icon">${icon}</span></div><div class="stat-value">${value}</div><div class="stat-note ${cls}">${note}</div></article>`;
}
function progress(label,value,total){ const pct=total?Math.round(value/total*100):0; return `<div class="progress-row"><div class="progress-meta"><span>${label}</span><b>${value}/${total} · ${pct}%</b></div><div class="progress"><i style="width:${pct}%"></i></div></div>`; }
function eventRow(e){ const d=new Date(`${e.date}T12:00:00`); return `<div class="event"><div class="date-box"><small>${d.toLocaleString('en-US',{month:'short'}).toUpperCase()}</small><b>${d.getDate()}</b></div><div><h4>${esc(e.title)}</h4><p>${esc(e.time)} · ${esc(e.location)}</p></div>${statusBadge(e.type)}</div>`; }

function attentionItemsByTeam(){
  const teams = allowedTeams();
  const regs = allowedRegistrations();
  const blocks = [];

  teams.forEach(team => {
    const teamIssues = regs.filter(r => r.teamId === team.id && (r.status !== 'Complete' || !r.paid));
    if (teamIssues.length > 0) {
      blocks.push(`
        <div class="attention-team-group">
          <div class="attention-team-head">
            <strong>${esc(team.name)} · Coach ${esc(team.coach)} (${esc(team.division)})</strong>
            ${statusBadge(`${teamIssues.length} player${teamIssues.length===1?'':'s'}`)}
          </div>
          <div class="activity-list">
            ${teamIssues.map(r => `
              <div class="activity"><i></i><div><h4>${esc(r.name)} — ${esc(r.status)} ${!r.paid ? '(Payment Due)' : ''}</h4><p>${esc(r.email || r.guardian || 'No email on file')}</p></div></div>
            `).join('')}
          </div>
        </div>
      `);
    }
  });

  if (isMaster()) {
    const unassignedIssues = state.registrations.filter(r => !r.teamId && (r.status !== 'Complete' || !r.paid));
    if (unassignedIssues.length > 0) {
      blocks.push(`
        <div class="attention-team-group">
          <div class="attention-team-head">
            <strong>Unassigned Athletes</strong>
            ${statusBadge(`${unassignedIssues.length} player${unassignedIssues.length===1?'':'s'}`)}
          </div>
          <div class="activity-list">
            ${unassignedIssues.map(r => `
              <div class="activity"><i></i><div><h4>${esc(r.name)} — ${esc(r.status)} ${!r.paid ? '(Payment Due)' : ''}</h4><p>${esc(r.division)} · ${esc(r.email || r.guardian || '')}</p></div></div>
            `).join('')}
          </div>
        </div>
      `);
    }

    const volIssues = state.volunteers.filter(v => v.status !== 'Cleared');
    if (volIssues.length > 0) {
      blocks.push(`
        <div class="attention-team-group">
          <div class="attention-team-head">
            <strong>Coach & Volunteer Clearances</strong>
            ${statusBadge(`${volIssues.length} pending`)}
          </div>
          <div class="activity-list">
            ${volIssues.map(v => `
              <div class="activity"><i></i><div><h4>${esc(v.name)} — ${esc(v.status)}</h4><p>${esc(v.role)} · ${esc(v.team)}</p></div></div>
            `).join('')}
          </div>
        </div>
      `);
    }
  }

  return blocks.join('');
}

function registrationRows(rows){
  if(!rows.length) return `<tr><td colspan="9"><div class="empty"><span>◎</span>No registrations match these filters.</div></td></tr>`;
  return rows.map(r=>{
    const t = state.teams.find(x=>x.id===r.teamId);
    const displayDivision = (t && t.division) ? t.division : (r.division || 'Unassigned');
    const checked = selectedRegIds.has(r.id) ? 'checked' : '';
    const jerseyInfo = r.jersey ? `#${esc(r.jersey)} · ${esc(r.uniformSize||'YS')}` : `${esc(r.uniformSize||'YS')}`;
    return `<tr>
      <td><input type="checkbox" class="reg-checkbox" data-id="${r.id}" ${checked} aria-label="Select ${esc(r.name)}"></td>
      <td><div class="person"><span class="person-mark">${initials(r.name)}</span><div><strong>${esc(r.name)}</strong></div></div></td>
      <td>${esc(displayDivision)}</td>
      <td><b>${esc(r.email || r.guardian || '—')}</b></td>
      <td><small>${jerseyInfo}</small></td>
      <td>${statusBadge(r.status)}</td>
      <td>${statusBadge(r.paid?'Paid':'Due')}</td>
      <td>${t?esc(t.name):'<span style="color:#999">Unassigned</span>'}</td>
      <td><button class="row-menu" data-action="registration-menu" data-id="${r.id}" aria-label="Manage registration">•••</button></td>
    </tr>`;
  }).join('');
}

function teamCardWithKids(t){
  const roster = state.registrations.filter(r=>r.teamId===t.id);
  const checked = selectedTeamIds.has(t.id) ? 'checked' : '';
  const cap = Number(t.capacity) || 10;
  const fSum = roster.reduce((s, r) => s + (Number(r.fundraiserAmount) || 0), 0);

  const kidsListHtml = roster.length
    ? `<div style="margin-top:12px;border-top:1px solid var(--line);padding-top:10px">
         <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin-bottom:6px">Rostered Kids (${roster.length})</div>
         <div style="display:grid;gap:5px;max-height:190px;overflow:auto">
           ${roster.map(kid => `
             <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;padding:6px 8px;background:#faf8f2;border-radius:8px;border:1px solid #ece8dc">
               <div>
                 <strong>${kid.jersey ? `#${esc(kid.jersey)} ` : ''}${esc(kid.name)}</strong>
                 <small style="display:block;color:var(--muted);font-size:10px">Size: ${esc(kid.uniformSize || 'YS')} · Uniform: ${kid.uniformPaid ? 'Paid' : 'Due'} · Fundraiser: $${Number(kid.fundraiserAmount||0).toFixed(0)}</small>
               </div>
               <div style="display:flex;gap:4px;align-items:center">
                 ${statusBadge(kid.paid ? 'Reg PD' : 'Reg Due')}
               </div>
             </div>
           `).join('')}
         </div>
       </div>`
    : `<div style="margin-top:12px;border-top:1px solid var(--line);padding-top:10px;font-size:11px;color:var(--muted)">No kids assigned to this team yet.</div>`;

  return `<article class="card team-card">
    <i class="team-color"></i>
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px">
      <div class="team-head">
        <div class="team-badge">⚜</div>
        <div>
          <h3>${esc(t.name)}</h3>
          <p style="font-weight:700;color:var(--ink)">Coach ${esc(t.coach)} · ${esc(t.division)}</p>
          <p>${esc(t.practiceDay)} · ${esc(t.practiceTime)} (${esc(t.practiceLocation || "St. Ann's Gym")})</p>
        </div>
      </div>
      ${isMaster() ? `<input type="checkbox" class="team-checkbox" data-id="${t.id}" ${checked} title="Select team for mass delete">` : ''}
    </div>
    <div class="team-counts">
      <div><b>${roster.length}/${cap}</b><small>Kids</small></div>
      <div><b>${roster.filter(r=>r.uniformPaid).length}/${roster.length}</b><small>Uniforms PD</small></div>
      <div><b>$${fSum.toFixed(0)}</b><small>Fundraisers</small></div>
    </div>
    ${kidsListHtml}
    <div style="margin-top:15px;display:flex;justify-content:space-between;align-items:center;gap:6px;flex-wrap:wrap">
      <small><b>Asst:</b> ${esc(t.assistant)}</small>
      <div class="actions">
        ${isMaster() ? `<button class="btn small" data-action="edit-team" data-id="${t.id}">Edit</button>` : ''}
        ${isMaster() ? `<button class="btn small danger" data-action="delete-team" data-id="${t.id}">Delete</button>` : ''}
        <button class="btn small gold" data-open-workspace="${t.id}">Open Tracker</button>
      </div>
    </div>
  </article>`;
}

function timelineItem(e){ const d=new Date(`${e.date}T12:00:00`); return `<article class="timeline-item" data-phase="${esc(e.phase)}"><div class="timeline-dot">${d.toLocaleString('en-US',{month:'short'}).toUpperCase()}<br>${d.getDate()}</div><div class="timeline-card"><div><h3>${esc(e.title)}</h3><p>${fmtDate(e.date)} · ${esc(e.time)} · ${esc(e.location)} · ${esc(e.division)}</p></div>${statusBadge(e.phase)}</div></article>`; }

function bindView(){
  $$('[data-view-link]').forEach(b=>b.onclick=()=>navigate(b.dataset.viewLink));
  $$('[data-action]').forEach(b=>b.onclick=()=>handleAction(b.dataset.action,b.dataset));
  $$('[data-settings-tab]').forEach(b=>b.onclick=()=>{ settingsTab = b.dataset.settingsTab; render(); });
  $$('[data-coach-filter]').forEach(b=>b.onclick=()=>{ selectedCoachFilter = b.dataset.coachFilter; render(); });
  $$('[data-jump-coach-teams]').forEach(b=>b.onclick=()=>{ selectedCoachFilter = b.dataset.jumpCoachTeams; navigate('teams'); });

  $$('[data-open-workspace]').forEach(b=>b.onclick=()=>{
    activeWorkspaceTeamId = b.dataset.openWorkspace;
    if (currentView !== 'teams') {
      navigate('teams');
    } else {
      render();
      $('#teamWorkspaceCard')?.scrollIntoView({behavior:'smooth', block:'start'});
    }
  });

  $$('[data-push-collections]').forEach(b=>b.onclick=()=>{
    activeWorkspaceTeamId = b.dataset.pushCollections;
    activeWorkspaceTab = 'regpd';
    navigate('teams');
  });

  $$('[data-action="set-default-reg-fee"]').forEach(inp=>inp.onchange=()=>{
    const newFee = Math.max(0, Number(inp.value) || 0);
    state.defaultRegFee = newFee;
    state.registrations.forEach(r => {
      if (r.paid && Number(r.regAmountPaid) === Number(r.regFee)) {
        r.regAmountPaid = newFee;
      }
      r.regFee = newFee;
    });
    save();
    render();
    toast('Season fee updated', `Default registration fee set to ${newFee.toFixed(2)}.`);
  });

  $$('[data-open-workspace-nav]').forEach(b=>b.onclick=()=>{
    activeWorkspaceTeamId = b.dataset.openWorkspaceNav;
    navigate('teams');
  });

  $$('[data-workspace-tab]').forEach(b=>b.onclick=()=>{
    activeWorkspaceTab = b.dataset.workspaceTab;
    render();
  });

  // Inline edits inside Team Tracker Workspace (auto-saved immediately)
  $$('[data-player-field]').forEach(inp => {
    const handler = () => {
      const reg = state.registrations.find(r => r.id === inp.dataset.id);
      if (!reg) return;
      const field = inp.dataset.playerField;
      const defFee = Number(state.defaultRegFee) || 100;
      reg.regFee = Number(reg.regFee ?? defFee);
      if (field === 'uniformQty' || field === 'fundraiserQty' || field === 'fundraiserAmount') {
        reg[field] = Number(inp.value) || 0;
      } else if (field === 'regAmountPaid') {
        const paidVal = Math.max(0, Number(inp.value) || 0);
        reg.regAmountPaid = paidVal;
        if (paidVal >= reg.regFee && reg.regFee > 0) {
          reg.paid = true;
          reg.status = 'Complete';
        } else if (paidVal > 0) {
          reg.paid = false;
          reg.status = 'Partial';
        } else {
          reg.paid = false;
          reg.status = 'Payment due';
        }
      } else if (field === 'status') {
        reg.status = inp.value;
        if (reg.status === 'Complete') {
          reg.paid = true;
          if ((Number(reg.regAmountPaid) || 0) < reg.regFee) reg.regAmountPaid = reg.regFee;
        } else if (reg.status === 'Payment due') {
          reg.paid = false;
        }
      } else {
        reg[field] = inp.value;
      }
      save();
    };
    inp.addEventListener('change', handler);
    inp.addEventListener('blur', render);
  });

  $$('[data-player-check]').forEach(chk => {
    chk.addEventListener('change', () => {
      const reg = state.registrations.find(r => r.id === chk.dataset.id);
      if (!reg) return;
      const field = chk.dataset.playerCheck;
      reg[field] = chk.checked;
      const defFee = Number(state.defaultRegFee) || 100;
      reg.regFee = Number(reg.regFee ?? defFee);
      if (field === 'paid') {
        if (chk.checked) {
          if ((Number(reg.regAmountPaid) || 0) < reg.regFee) reg.regAmountPaid = reg.regFee;
          reg.status = 'Complete';
        } else {
          reg.regAmountPaid = 0;
          reg.status = 'Payment due';
        }
      }
      save();
      render();
    });
  });

  $$('[data-workspace-remove]').forEach(btn => {
    btn.onclick = () => {
      const reg = state.registrations.find(r => r.id === btn.dataset.workspaceRemove);
      if (!reg) return;
      if (confirm(`Remove ${reg.name} from this team roster?`)) {
        reg.teamId = '';
        save();
        render();
        toast('Player removed from team');
      }
    };
  });

  const rs=$('#regSearch'), df=$('#divisionFilter'), sf=$('#statusFilter');
  [rs,df,sf].filter(Boolean).forEach(el=>el.addEventListener(el.tagName==='INPUT'?'input':'change',filterRegistrations));

  $('#selectAllRegs')?.addEventListener('change', e => {
    const checkboxes = $$('.reg-checkbox');
    checkboxes.forEach(cb => {
      cb.checked = e.target.checked;
      if (e.target.checked) selectedRegIds.add(cb.dataset.id);
      else selectedRegIds.delete(cb.dataset.id);
    });
    updateMassDeleteUI();
  });

  $$('.reg-checkbox').forEach(cb => cb.addEventListener('change', e => {
    if (e.target.checked) selectedRegIds.add(e.target.dataset.id);
    else selectedRegIds.delete(e.target.dataset.id);
    updateMassDeleteUI();
  }));

  $$('.team-checkbox').forEach(cb => cb.addEventListener('change', e => {
    if (e.target.checked) selectedTeamIds.add(e.target.dataset.id);
    else selectedTeamIds.delete(e.target.dataset.id);
    const btn = $('#massDeleteTeamBtn');
    if (btn) {
      btn.style.display = selectedTeamIds.size ? 'inline-flex' : 'none';
      btn.textContent = `🗑 Delete Selected (${selectedTeamIds.size})`;
    }
  }));

  $('#phaseFilter')?.addEventListener('change',e=>$$('.timeline-item').forEach(x=>x.hidden=!!e.target.value&&x.dataset.phase!==e.target.value));
  $('#orgForm')?.addEventListener('submit',e=>{e.preventDefault();state.organization=Object.fromEntries(new FormData(e.target));save();toast('Organization saved','Profile details were updated.');});
}

function updateMassDeleteUI(){
  const btn = $('#massDeleteRegBtn');
  if (btn) {
    btn.style.display = selectedRegIds.size ? 'inline-flex' : 'none';
    btn.textContent = `🗑 Delete Selected (${selectedRegIds.size})`;
  }
}

function filterRegistrations(){
  const q=($('#regSearch')?.value||'').toLowerCase(), d=$('#divisionFilter')?.value||'', s=$('#statusFilter')?.value||'';
  const rows=allowedRegistrations().filter(r=>{
    const t = state.teams.find(x=>x.id===r.teamId);
    const div = (t && t.division) ? t.division : r.division;
    const teamName = t ? t.name : '';
    return (!q||`${r.name} ${r.guardian} ${r.email} ${teamName}`.toLowerCase().includes(q))&&(!d||div===d)&&(!s||r.status===s);
  });
  $('#registrationRows').innerHTML=registrationRows(rows);
  $$('[data-action="registration-menu"]').forEach(b=>b.onclick=()=>handleAction('registration-menu',b.dataset));
  $$('.reg-checkbox').forEach(cb => cb.addEventListener('change', e => {
    if (e.target.checked) selectedRegIds.add(e.target.dataset.id);
    else selectedRegIds.delete(e.target.dataset.id);
    updateMassDeleteUI();
  }));
}

function openModal(title,html,eyebrow='SAINTS ADMIN'){ $('#modalTitle').textContent=title; $('#modalEyebrow').textContent=eyebrow; $('#modalBody').innerHTML=html; $('#modalBackdrop').hidden=false; document.body.style.overflow='hidden'; setTimeout(()=>$('#modalBody input, #modalBody select, #modalBody button')?.focus(),50); }
function closeModal(){ $('#modalBackdrop').hidden=true; document.body.style.overflow=''; $('#modalBody').innerHTML=''; }
function formActions(label='Save'){ return `<div class="form-actions"><button type="button" class="btn" data-close-modal>Cancel</button><button class="btn primary">${label}</button></div>`; }
function wireModal(formId,onSubmit){ $$('[data-close-modal]').forEach(b=>b.onclick=closeModal); const f=$(`#${formId}`); if(f)f.onsubmit=e=>{e.preventDefault();onSubmit(Object.fromEntries(new FormData(e.target)));}; }

function showCoachPaymentsModal(){
  const regs = allowedRegistrations();
  const paidCount = regs.filter(r => r.paid).length;
  openModal('Team Payment Status', `
    <div class="card" style="background:var(--gold-pale);margin-bottom:14px">
      <b>${paidCount} of ${regs.length} Athletes Paid</b>
      <p class="card-subtitle">${regs.length - paidCount} outstanding balance(s) across your assigned team(s)</p>
    </div>
    <div class="activity-list">
      ${regs.map(r => {
        const t = state.teams.find(x => x.id === r.teamId);
        return `
          <div class="activity" style="grid-template-columns:9px 1fr auto;align-items:center">
            <i></i>
            <div>
              <h4>${esc(r.name)}</h4>
              <p>${t ? esc(t.name) : ''} · ${esc(r.email || 'No email')}</p>
            </div>
            ${statusBadge(r.paid ? 'Paid' : 'Due')}
          </div>
        `;
      }).join('') || '<div class="empty">No athletes rostered on your teams yet.</div>'}
    </div>
    <div class="form-actions"><button class="btn primary" data-close-modal>Close</button></div>
  `, 'PAYMENTS OVERVIEW');
  $$('[data-close-modal]').forEach(b=>b.onclick=closeModal);
}

function handleAction(action,data={}){
  const actions={
    'stat-athletes': () => isMaster() ? navigate('registrations') : navigate('teams'),
    'stat-teams': () => navigate('teams'),
    'stat-payments': () => isMaster() ? navigate('registrations') : showCoachPaymentsModal(),
    'stat-fourth': () => isMaster() ? navigate('volunteers') : navigate('schedule'),
    'close-workspace': () => { activeWorkspaceTeamId = ''; render(); },
    'workspace-add-player': () => showWorkspaceAddPlayerModal(data.id),
    'workspace-clear-roster': () => {
      const t = state.teams.find(x => x.id === data.id);
      if (!t) return;
      if (confirm(`Remove all players from ${t.name}?`)) {
        state.registrations = state.registrations.filter(r => r.teamId !== t.id);
        save();
        render();
        toast('Roster cleared', `All players removed from ${t.name}.`);
      }
    },
    'import-legacy-json-modal': showLegacyJsonImportModal,
    'week-prev': () => { weekOffset--; render(); },
    'week-current': () => { weekOffset = 0; render(); },
    'week-next': () => { weekOffset++; render(); },
    'add-registration':showRegistrationForm,
    'family-register':()=>showRegistrationForm(true),
    'registration-menu':()=>showRegistrationMenu(data.id),
    'mass-delete-registrations': massDeleteRegistrations,
    'import-csv-modal': showCsvImportModal,
    'add-team': () => showTeamForm(),
    'edit-team': () => showTeamForm(state.teams.find(t=>t.id===data.id)),
    'delete-team': () => deleteSingleTeam(data.id),
    'mass-delete-teams': massDeleteTeams,
    'team-detail':()=> { activeWorkspaceTeamId = data.id; render(); },
    'add-practice-slot': showPracticeSlotModal,
    'add-event':showEventForm,
    'add-volunteer':showVolunteerForm,
    'edit-volunteer':()=>showVolunteerForm(state.volunteers.find(v=>v.id===data.id)),
    'add-announcement':()=>showAnnouncementForm(),
    'quick-message':()=>showAnnouncementForm(data.audience),
    'sport-detail':()=>showSportDetail(data.id),
    'add-user': () => showUserForm(),
    'edit-user': () => showUserForm(state.users.find(u=>u.id===data.id)),
    'delete-user': () => deleteUser(data.id),
    'export-registrations':exportRegistrations,
    'export-rosters':exportRosters,
    'export-schedule':exportSchedule,
    'export-volunteers':exportVolunteers,
    'export-payments':exportPayments,
    'export-backup':()=>{download('st-anns-cyo-backup.json',JSON.stringify(state,null,2),'application/json');toast('Backup downloaded','Your complete Saints data file is ready.');},
    'import-backup':()=>$('#importFile').click(),
    'delete-all-data': deleteAllDemoData,
    'reset-data':resetData,
    'print-dashboard':()=>{navigate('dashboard');setTimeout(()=>window.print(),200);},
    'copy-portal':()=>{navigator.clipboard?.writeText(location.href.split('#')[0]+'#family-portal');toast('Portal link copied','The family portal URL is on your clipboard.');}
  };
  (actions[action]||(()=>toast('Action ready','Control triggered.')))();
}

function showWorkspaceAddPlayerModal(teamId) {
  const team = state.teams.find(t => t.id === teamId);
  if (!team) return;
  const unassigned = state.registrations.filter(r => !r.teamId);

  openModal(`Add Player to ${team.name}`, `
    <form id="wsAddPlayerForm">
      <div class="form-grid">
        <div class="field full"><label>Player Full Name</label><input name="name" required placeholder="First and Last Name"></div>
        <div class="field"><label>Jersey #</label><input name="jersey" placeholder="e.g. 12"></div>
        <div class="field"><label>Uniform Size</label><select name="uniformSize">${UNIFORM_SIZES.map(s=>`<option ${s==='YS'?'selected':''}>${s}</option>`).join('')}</select></div>
        <div class="field"><label>Quantity</label><input type="number" min="1" max="10" name="uniformQty" value="1"></div>
        <div class="field"><label>Uniform Paid</label><select name="uniformPaid"><option value="false">Due</option><option value="true">Paid</option></select></div>
        <div class="field full"><label>Email (Optional)</label><input type="email" name="email" placeholder="parent@example.com"></div>
      </div>
      ${formActions('Add Player to Roster')}
    </form>
    ${unassigned.length ? `
      <hr style="margin:18px 0;border:0;border-top:1px solid var(--line)">
      <form id="wsAssignExistingForm">
        <div class="field"><label>Or Assign Unassigned Registered Athlete</label><select name="regId">${unassigned.map(r=>`<option value="${r.id}">${esc(r.name)}</option>`).join('')}</select></div>
        <div class="form-actions"><button class="btn gold">Assign to ${esc(team.name)}</button></div>
      </form>
    ` : ''}
  `, 'TEAM ROSTER');

  $$('[data-close-modal]').forEach(b=>b.onclick=closeModal);
  wireModal('wsAddPlayerForm', d => {
    state.registrations.unshift(normalizePlayerFields({
      id: uid('r'),
      name: d.name.trim(),
      division: team.division,
      sport: 'Basketball',
      guardian: '',
      email: d.email || '',
      status: 'Payment due',
      paid: false,
      teamId: team.id,
      jersey: d.jersey || '',
      uniformSize: d.uniformSize || 'YS',
      uniformQty: Number(d.uniformQty) || 1,
      uniformPaid: d.uniformPaid === 'true',
      fundraiserItem: '',
      fundraiserQty: 0,
      fundraiserAmount: 0,
      fundraiserPaid: false,
      created: new Date().toISOString().slice(0,10)
    }, state.teams));
    save();
    closeModal();
    render();
    toast('Player added', `${d.name} added to ${team.name}.`);
  });

  const existForm = $('#wsAssignExistingForm');
  if (existForm) {
    existForm.onsubmit = e => {
      e.preventDefault();
      const fd = new FormData(existForm);
      const reg = state.registrations.find(r => r.id === fd.get('regId'));
      if (reg) {
        reg.teamId = team.id;
        reg.division = team.division;
        save();
        closeModal();
        render();
        toast('Player assigned', `${reg.name} assigned to ${team.name}.`);
      }
    };
  }
}

function convertAndImportLegacyJson(rawData) {
  let parsed = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;
  if (!parsed || typeof parsed !== 'object') throw new Error('Invalid JSON structure');

  if (parsed.value && typeof parsed.value === 'string') parsed = JSON.parse(parsed.value);
  if (parsed.data && typeof parsed.data === 'object') parsed = parsed.data;

  const toList = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val === 'object') return Object.values(val);
    return [];
  };

  const extractLists = (obj) => ({
    roster: toList(obj.roster || obj.uniformRoster || obj.uniforms || obj.uniform || obj.players || obj.members),
    registrations: toList(obj.registrations || obj.registrationPd || obj.regPd || obj.registration || obj.reg),
    fundraisers: toList(obj.fundraisers || obj.fundraiser || obj.fundraising)
  });

  const teamEntries = [];

  if (Array.isArray(parsed.teams)) {
    parsed.teams.forEach(t => {
      const lists = extractLists(t);
      teamEntries.push({
        teamName: t.name || t.teamName || 'Imported Team',
        coachName: t.coach || t.coachName || t.name || 'Coach',
        division: t.division || 'Tot',
        ...lists
      });
    });
  } else if (parsed.teams && typeof parsed.teams === 'object') {
    Object.entries(parsed.teams).forEach(([key, val]) => {
      const lists = extractLists(val || {});
      teamEntries.push({
        teamName: val.name || key,
        coachName: val.coach || key,
        division: val.division || (/tot/i.test(key) ? 'Tot' : /tiny/i.test(key) ? 'Tiny' : /pee/i.test(key) ? 'Pee Wee' : /mite/i.test(key) ? 'Mite' : /cub/i.test(key) ? 'Cub' : /jun/i.test(key) ? 'Junior' : 'Tot'),
        ...lists
      });
    });
  } else {
    Object.entries(parsed).forEach(([key, val]) => {
      if (val && typeof val === 'object' && !Array.isArray(val)) {
        const lists = extractLists(val);
        teamEntries.push({
          teamName: val.name || key,
          coachName: val.coach || key,
          division: val.division || (/tot/i.test(key) ? 'Tot' : /tiny/i.test(key) ? 'Tiny' : /pee/i.test(key) ? 'Pee Wee' : /mite/i.test(key) ? 'Mite' : /cub/i.test(key) ? 'Cub' : /jun/i.test(key) ? 'Junior' : 'Tot'),
          ...lists
        });
      }
    });
  }

  let importedTeams = 0;
  let importedPlayers = 0;

  teamEntries.forEach(entry => {
    let team = state.teams.find(t => t.name.toLowerCase() === entry.teamName.toLowerCase());
    if (!team) {
      team = normalizeTeamPractice({
        id: uid('t'),
        sportId: 'basketball',
        name: entry.teamName,
        division: entry.division,
        coach: entry.coachName,
        assistant: 'Open',
        practiceDay: 'Tue',
        practiceTime: '6:00 PM',
        practiceLocation: "St. Ann's Gym",
        capacity: Math.max(10, entry.roster.length, entry.registrations.length)
      });
      state.teams.push(team);
      importedTeams++;
    }

    const playerMap = new Map();
    const getOrCreatePlayer = (rawName) => {
      const cleanName = String(rawName || '').trim();
      if (!cleanName || /^\d+$/.test(cleanName)) return null;
      const key = cleanName.toLowerCase();
      if (!playerMap.has(key)) {
        let existing = state.registrations.find(r => r.name.toLowerCase() === key && r.teamId === team.id);
        if (!existing) {
          existing = normalizePlayerFields({
            id: uid('r'),
            name: cleanName,
            division: team.division,
            sport: 'Basketball',
            guardian: '',
            email: '',
            status: 'Payment due',
            paid: false,
            teamId: team.id,
            jersey: '',
            uniformSize: 'YS',
            uniformQty: 1,
            uniformPaid: false,
            fundraiserItem: '',
            fundraiserQty: 0,
            fundraiserAmount: 0,
            fundraiserPaid: false,
            created: new Date().toISOString().slice(0,10)
          }, state.teams);
          state.registrations.push(existing);
          importedPlayers++;
        }
        playerMap.set(key, existing);
      }
      return playerMap.get(key);
    };

    const getName = (obj) => typeof obj === 'string' ? obj : (obj.name || obj.playerName || obj.athlete || `${obj.firstName || ''} ${obj.lastName || ''}`.trim());

    entry.roster.forEach(p => {
      const rec = getOrCreatePlayer(getName(p));
      if (!rec || typeof p !== 'object') return;
      rec.jersey = String(p.jersey ?? p.jerseyNumber ?? p.number ?? rec.jersey ?? '');
      rec.uniformSize = p.size || p.uniformSize || rec.uniformSize || 'YS';
      rec.uniformQty = Number(p.qty ?? p.quantity ?? p.uniformQty ?? 1) || 1;
      rec.uniformPaid = Boolean(p.paid ?? p.uniformPaid);
      if (p.email) rec.email = p.email;
    });

    entry.registrations.forEach(r => {
      const rec = getOrCreatePlayer(getName(r));
      if (!rec || typeof r !== 'object') return;
      rec.paid = Boolean(r.paid ?? r.regPaid ?? r.pd ?? true);
      rec.status = rec.paid ? 'Complete' : (r.status || 'Payment due');
      if (r.email) rec.email = r.email;
    });

    entry.fundraisers.forEach(f => {
      const rec = getOrCreatePlayer(getName(f));
      if (!rec || typeof f !== 'object') return;
      rec.fundraiserItem = f.item || f.fundraiser || f.type || rec.fundraiserItem || 'Fundraiser';
      rec.fundraiserQty = Number(f.qty ?? f.quantity ?? f.tickets ?? rec.fundraiserQty ?? 0) || 0;
      rec.fundraiserAmount = Number(f.amount ?? f.total ?? f.raised ?? rec.fundraiserAmount ?? 0) || 0;
      rec.fundraiserPaid = Boolean(f.paid ?? f.turnedIn ?? rec.fundraiserPaid);
    });
  });

  save();
  return {importedTeams, importedPlayers};
}

function showLegacyJsonImportModal() {
  openModal('Import Legacy Tracker JSON (stanns.opp-solutions.com)', `
    <form id="legacyJsonForm">
      <div class="card" style="background:var(--gold-pale);margin-bottom:14px">
        <b>Converts Uniform Roster, Registration PD & Fundraisers</b>
        <p class="card-subtitle">Upload the JSON file pulled from <code>stanns.opp-solutions.com</code> or paste the raw JSON below. All teams, jersey numbers, sizes, Registration PD statuses, and fundraiser amounts will convert automatically.</p>
      </div>
      <div class="form-grid">
        <div class="field full">
          <label>Option 1: Upload JSON File</label>
          <input type="file" id="legacyJsonFile" accept=".json,application/json">
        </div>
        <div class="field full">
          <label>Option 2: Or Paste Raw JSON Output</label>
          <textarea id="legacyJsonText" rows="6" placeholder='{"Alfred Tot1": {"roster": [...], "registrations": [...], "fundraisers": [...]}}'></textarea>
        </div>
      </div>
      ${formActions('Convert & Import Data')}
    </form>
  `, 'LEGACY TRACKER MIGRATION');

  $$('[data-close-modal]').forEach(b=>b.onclick=closeModal);

  $('#legacyJsonForm').onsubmit = e => {
    e.preventDefault();
    const file = $('#legacyJsonFile').files[0];
    const pasted = $('#legacyJsonText').value.trim();

    const finishImport = (rawText) => {
      try {
        const res = convertAndImportLegacyJson(rawText);
        closeModal();
        render();
        toast('Legacy Data Converted', `Imported ${res.importedTeams} new team(s) and ${res.importedPlayers} player record(s).`);
      } catch (err) {
        toast('Invalid JSON', err.message || 'Could not parse the JSON data.');
      }
    };

    if (file) {
      const reader = new FileReader();
      reader.onload = () => finishImport(reader.result);
      reader.readAsText(file);
    } else if (pasted) {
      finishImport(pasted);
    } else {
      toast('No JSON provided', 'Upload a JSON file or paste the JSON output.');
    }
  };
}

function showRegistrationForm(family=false){
  const divisions=activeSport().divisions;
  openModal(family?'Register an athlete':'New athlete registration',`<form id="registrationForm"><div class="form-grid"><div class="field full"><label>Athlete name (First & Last)</label><input name="name" required placeholder="First and last name"></div><div class="field"><label>Division</label><select name="division">${divisions.map(x=>`<option>${x}</option>`).join('')}</select></div><div class="field"><label>Email</label><input type="email" name="email" required></div><div class="field"><label>Jersey #</label><input name="jersey" placeholder="Optional"></div><div class="field"><label>Uniform Size</label><select name="uniformSize">${UNIFORM_SIZES.map(s=>`<option ${s==='YS'?'selected':''}>${s}</option>`).join('')}</select></div><div class="field"><label>Registration status</label><select name="status"><option>Complete</option><option>Pending review</option><option>Payment due</option><option>Needs waiver</option></select></div><div class="field"><label>Registration Payment</label><select name="paid"><option value="false">Due</option><option value="true">Paid</option></select></div><div class="field full"><label>Team placement</label><select name="teamId"><option value="">Unassigned</option>${state.teams.map(t=>`<option value="${t.id}">${esc(t.name)} — Coach ${esc(t.coach)} (${esc(t.division)})</option>`).join('')}</select></div></div>${formActions(family?'Submit registration':'Add registration')}</form>`,family?'BASKETBALL 2026–2027':'SAINTS ADMIN');
  wireModal('registrationForm',d=>{
    const assignedTeam = state.teams.find(t => t.id === d.teamId);
    const finalDivision = assignedTeam ? assignedTeam.division : d.division;
    state.registrations.unshift(normalizePlayerFields({id:uid('r'),...d,division:finalDivision,sport:'Basketball',paid:d.paid==='true',created:new Date().toISOString().slice(0,10)}, state.teams));
    save();
    closeModal();
    render();
    toast('Registration added',`${d.name} (${finalDivision}) added.`);
  });
}

function showRegistrationMenu(id){
  const r=state.registrations.find(x=>x.id===id); if(!r)return;
  const currentTeam = state.teams.find(t=>t.id===r.teamId);
  const currentDiv = currentTeam ? currentTeam.division : r.division;
  openModal(r.name,`<div class="card" style="background:var(--gold-pale)"><b>Division: ${esc(currentDiv)}</b><p class="card-subtitle">${esc(r.email || r.guardian || '')}</p></div><form id="regUpdateForm" style="margin-top:16px"><div class="form-grid"><div class="field"><label>Status</label><select name="status">${['Complete','Pending review','Payment due','Needs waiver'].map(x=>`<option ${r.status===x?'selected':''}>${x}</option>`).join('')}</select></div><div class="field"><label>Registration Payment</label><select name="paid"><option value="true" ${r.paid?'selected':''}>Paid</option><option value="false" ${!r.paid?'selected':''}>Due</option></select></div><div class="field"><label>Jersey #</label><input name="jersey" value="${esc(r.jersey || '')}"></div><div class="field"><label>Uniform Size</label><select name="uniformSize">${UNIFORM_SIZES.map(s=>`<option ${r.uniformSize===s?'selected':''}>${s}</option>`).join('')}</select></div><div class="field full"><label>Team</label><select name="teamId"><option value="">Unassigned</option>${state.teams.map(t=>`<option value="${t.id}" ${r.teamId===t.id?'selected':''}>${esc(t.name)} — Coach ${esc(t.coach)} (${esc(t.division)})</option>`).join('')}</select></div></div><div class="form-actions"><button type="button" class="btn danger" id="deleteReg">Delete</button><button type="button" class="btn" data-close-modal>Cancel</button><button class="btn primary">Save changes</button></div></form>`,'REGISTRATION');
  wireModal('regUpdateForm',d=>{
    const newTeam = state.teams.find(t=>t.id===d.teamId);
    Object.assign(r,d,{paid:d.paid==='true', division: newTeam ? newTeam.division : r.division});
    save();
    closeModal();
    render();
    toast('Registration updated',r.name);
  });
  $('#deleteReg').onclick=()=>{if(confirm(`Delete ${r.name}'s registration?`)){state.registrations=state.registrations.filter(x=>x.id!==id);selectedRegIds.delete(id);save();closeModal();render();toast('Registration deleted');}};
}

function massDeleteRegistrations(){
  if (!selectedRegIds.size) return;
  if (confirm(`Permanently delete ${selectedRegIds.size} selected athlete registration(s)?`)) {
    state.registrations = state.registrations.filter(r => !selectedRegIds.has(r.id));
    selectedRegIds.clear();
    save();
    render();
    toast('Mass delete complete', 'Selected registrations have been removed.');
  }
}

function parseCsvLine(line) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(cur.trim());
      cur = '';
    } else {
      cur += ch;
    }
  }
  result.push(cur.trim());
  return result;
}

function showCsvImportModal(){
  if (!state.teams.length) {
    toast('Create a team first', 'Add at least one Coach & Team before importing a CSV roster.');
    return;
  }
  const coaches = [...new Set(state.teams.map(t => t.coach).filter(Boolean))];
  openModal('Import Roster CSV', `
    <form id="csvImportForm">
      <div class="card" style="background:var(--gold-pale);margin-bottom:15px">
        <b>CSV Format Guide</b>
        <p class="card-subtitle">Imports <b>First Name</b>, <b>Last Name</b>, and <b>Email</b> (automatically skips a leading <code>Row</code> number column if present) and assigns the selected team's default <b>Division</b>.</p>
      </div>
      <div class="form-grid">
        <div class="field">
          <label>Select Coach</label>
          <select id="csvCoachSelect" name="coachName" required>
            ${coaches.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join('')}
          </select>
        </div>
        <div class="field">
          <label>Assign to Team (Sets Default Division)</label>
          <select id="csvTeamSelect" name="teamId" required>
            ${state.teams.map(t => `<option value="${t.id}" data-coach="${esc(t.coach)}">${esc(t.name)} (${esc(t.division)})</option>`).join('')}
          </select>
        </div>
        <div class="field full">
          <label>Choose .CSV File</label>
          <input type="file" id="csvFileInput" accept=".csv,text/csv" required>
        </div>
      </div>
      ${formActions('Import Roster')}
    </form>
  `, 'CSV ROSTER IMPORT');

  $$('[data-close-modal]').forEach(b=>b.onclick=closeModal);

  const coachSel = $('#csvCoachSelect');
  const teamSel = $('#csvTeamSelect');
  const syncTeamsForCoach = () => {
    const chosenCoach = coachSel.value;
    const matching = state.teams.filter(t => t.coach === chosenCoach);
    teamSel.innerHTML = (matching.length ? matching : state.teams)
      .map(t => `<option value="${t.id}">${esc(t.name)} — Division: ${esc(t.division)}</option>`).join('');
  };
  coachSel.onchange = syncTeamsForCoach;
  syncTeamsForCoach();

  $('#csvImportForm').onsubmit = e => {
    e.preventDefault();
    const file = $('#csvFileInput').files[0];
    if (!file) return;
    const teamId = teamSel.value;
    const targetTeam = state.teams.find(t => t.id === teamId);
    const defaultDivision = targetTeam ? targetTeam.division : 'Mite';

    const reader = new FileReader();
    reader.onload = () => {
      const lines = reader.result.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      if (!lines.length) {
        toast('Empty file', 'No rows found in CSV.');
        return;
      }

      const firstCols = parseCsvLine(lines[0]).map(c => c.toLowerCase());
      let startIdx = 0;
      let fnIdx = -1;
      let lnIdx = -1;
      let fullIdx = -1;
      let emIdx = -1;
      let cellIdx = -1;
      let homeIdx = -1;
      let phoneIdx = -1;

      const hasHeader = firstCols.some(c => c.includes('first') || c.includes('last') || c.includes('email') || c === 'row' || c === '#' || c.includes('name') || c.includes('player') || c.includes('athlete'));
      if (hasHeader) {
        startIdx = 1;
        fnIdx = firstCols.findIndex(c => c.includes('first'));
        lnIdx = firstCols.findIndex(c => c.includes('last'));
        if (fnIdx === -1 && lnIdx === -1) {
          fullIdx = firstCols.findIndex(c => c.includes('name') || c.includes('player') || c.includes('athlete'));
        }
        emIdx = firstCols.findIndex(c => c.includes('email') || c.includes('mail'));
        cellIdx = firstCols.findIndex(c => (c.includes('cell') || c.includes('mobile') || c.includes('sms')) && !c.includes('coach'));
        homeIdx = firstCols.findIndex(c => c.includes('home') && c.includes('phone') && !c.includes('coach'));
        phoneIdx = firstCols.findIndex(c => (c.includes('phone') || c.includes('telephone')) && !c.includes('coach') && !c.includes('cell') && !c.includes('home'));
      }

      let addedCount = 0;
      for (let i = startIdx; i < lines.length; i++) {
        const cols = parseCsvLine(lines[i]);
        if (!cols.length) continue;

        let fullName = '';
        let email = '';
        let phone = '';
        const rawPh = [cellIdx, homeIdx, phoneIdx]
          .map(idx => (idx !== -1 && cols[idx]) ? String(cols[idx]).trim() : '')
          .find(v => v.replace(/\D/g, '').length >= 7) || '';
        if (rawPh) {
          const d = rawPh.replace(/\D/g, '');
          phone = d.length === 10 ? `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`
                : (d.length === 11 && d.startsWith('1')) ? `(${d.slice(1,4)}) ${d.slice(4,7)}-${d.slice(7)}`
                : rawPh;
        }

        if (fullIdx !== -1) {
          fullName = (cols[fullIdx] || '').trim();
          email = emIdx !== -1 ? (cols[emIdx] || '').trim() : '';
        } else if (fnIdx !== -1 || lnIdx !== -1) {
          const fn = fnIdx !== -1 ? (cols[fnIdx] || '').trim() : '';
          const ln = lnIdx !== -1 ? (cols[lnIdx] || '').trim() : '';
          fullName = `${fn} ${ln}`.trim();
          email = emIdx !== -1 ? (cols[emIdx] || '').trim() : '';
        } else {
          // Strip leading row index number (e.g. "1", "2", "3") regardless of column count
          const nonIndexCols = (/^\d+$/.test(cols[0]) && cols.length >= 2) ? cols.slice(1) : cols;
          const emailCol = nonIndexCols.findIndex(c => c.includes('@'));
          if (emailCol !== -1) {
            email = nonIndexCols[emailCol].trim();
            fullName = nonIndexCols.filter((_, idx) => idx !== emailCol).join(' ').trim();
          } else {
            fullName = nonIndexCols.slice(0, 2).join(' ').trim();
          }
        }

        if (!fullName || /^\d+$/.test(fullName)) continue;

        state.registrations.unshift(normalizePlayerFields({
          id: uid('r'),
          name: fullName,
          division: defaultDivision,
          sport: 'Basketball',
          guardian: '',
          email: email,
          phone: phone,
          status: 'Payment due',
          paid: false,
          teamId: teamId,
          created: new Date().toISOString().slice(0,10)
        }, state.teams));
        addedCount++;
      }
      save();
      closeModal();
      render();
      toast('CSV Imported', `Added ${addedCount} athlete(s) to ${targetTeam ? targetTeam.name : 'team'} (${defaultDivision}).`);
    };
    reader.readAsText(file);
  };
}

function showTeamForm(existing = null){
  const t = existing || {name:'', division: activeSport().divisions[0], capacity:10, coach:'', assistant:'Open', practiceDay:'Tue', practiceTime:'6:00 PM', practiceLocation:"St. Ann's Gym", sportId: activeSport().id};
  openModal(existing ? 'Edit Coach & Team' : 'Add Coach & Team', `
    <form id="teamForm">
      <div class="form-grid">
        <div class="field"><label>Head Coach Name</label><input name="coach" value="${esc(t.coach)}" required placeholder="Example: Carlos Mendez"></div>
        <div class="field"><label>Team Name</label><input name="name" value="${esc(t.name)}" required placeholder="Example: Mite Gold"></div>
        <div class="field"><label>Sport</label><select name="sportId">${state.sports.map(s=>`<option value="${s.id}" ${t.sportId===s.id?'selected':''}>${esc(s.name)}</option>`).join('')}</select></div>
        <div class="field"><label>Division (Default for Roster)</label><select name="division">${activeSport().divisions.map(x=>`<option ${t.division===x?'selected':''}>${x}</option>`).join('')}</select></div>
        <div class="field"><label>Coach Phone</label><input name="coachPhone" type="tel" value="${esc(t.coachPhone || '')}" placeholder="(210) 555-0199"></div>
        <div class="field"><label>Assistant Coach</label><input name="assistant" value="${esc(t.assistant)}"></div>
        <div class="field"><label>Roster Capacity</label><input type="number" min="5" max="25" name="capacity" value="${t.capacity}"></div>
        <div class="field"><label>Practice Day</label><select name="practiceDay">${DAYS.map(d=>`<option value="${d}" ${t.practiceDay===d?'selected':''}>${d}</option>`).join('')}</select></div>
        <div class="field"><label>Practice Time</label><input name="practiceTime" value="${esc(t.practiceTime)}" placeholder="6:00 PM" required></div>
        <div class="field full"><label>Practice Location</label><input name="practiceLocation" value="${esc(t.practiceLocation)}" placeholder="St. Ann's Gym"></div>
      </div>
      ${formActions(existing ? 'Save Changes' : 'Create Coach & Team')}
    </form>
  `, 'COACHES & TEAMS');

  wireModal('teamForm', d => {
    const updated = normalizeTeamPractice({
      ...d,
      capacity: Number(d.capacity) || 10
    });
    if (existing) {
      Object.assign(existing, updated);
      state.registrations.forEach(r => {
        if (r.teamId === existing.id) r.division = existing.division;
      });
    } else {
      state.teams.push({id: uid('t'), ...updated});
    }
    save();
    closeModal();
    render();
    toast(existing ? 'Team & Schedule Updated' : 'Coach & Team Created', `${d.name} (${updated.practices}) synced to schedule.`);
  });
}

function showPracticeSlotModal(){
  if (!state.teams.length) {
    toast('No teams available', 'Create a team first before assigning a practice slot.');
    return;
  }
  openModal('Assign Team Practice Slot', `
    <form id="practiceSlotForm">
      <div class="form-grid">
        <div class="field full">
          <label>Select Team</label>
          <select name="teamId" required>
            ${state.teams.map(t => `<option value="${t.id}">${esc(t.name)} — Coach ${esc(t.coach)}</option>`).join('')}
          </select>
        </div>
        <div class="field">
          <label>Practice Day</label>
          <select name="practiceDay">${DAYS.map(d=>`<option value="${d}">${d}</option>`).join('')}</select>
        </div>
        <div class="field">
          <label>Practice Time</label>
          <input name="practiceTime" value="6:00 PM" required>
        </div>
        <div class="field full">
          <label>Location</label>
          <input name="practiceLocation" value="St. Ann's Gym" required>
        </div>
      </div>
      ${formActions('Save Practice Slot')}
    </form>
  `, 'WEEKLY PRACTICE SCHEDULE');

  wireModal('practiceSlotForm', d => {
    const team = state.teams.find(t => t.id === d.teamId);
    if (team) {
      team.practiceDay = d.practiceDay;
      team.practiceTime = d.practiceTime;
      team.practiceLocation = d.practiceLocation;
      normalizeTeamPractice(team);
      save();
      closeModal();
      render();
      toast('Practice Slot Populated', `${team.name} scheduled for ${team.practices}.`);
    }
  });
}

function deleteSingleTeam(id){
  const t = state.teams.find(x => x.id === id);
  if (!t) return;
  if (confirm(`Delete team "${t.name}" (Coach ${t.coach})? Assigned players will become unassigned.`)) {
    state.teams = state.teams.filter(x => x.id !== id);
    state.registrations.forEach(r => { if (r.teamId === id) r.teamId = ''; });
    if (activeWorkspaceTeamId === id) activeWorkspaceTeamId = '';
    selectedTeamIds.delete(id);
    save();
    render();
    toast('Team deleted', `${t.name} has been removed.`);
  }
}

function massDeleteTeams(){
  if (!selectedTeamIds.size) return;
  if (confirm(`Delete ${selectedTeamIds.size} selected team(s)? Their players will be marked unassigned.`)) {
    state.teams = state.teams.filter(t => !selectedTeamIds.has(t.id));
    state.registrations.forEach(r => { if (selectedTeamIds.has(r.teamId)) r.teamId = ''; });
    if (selectedTeamIds.has(activeWorkspaceTeamId)) activeWorkspaceTeamId = '';
    selectedTeamIds.clear();
    save();
    render();
    toast('Mass team delete complete', 'Selected teams have been removed.');
  }
}

function showEventForm(){ openModal('Add schedule event',`<form id="eventForm"><div class="form-grid"><div class="field full"><label>Event title</label><input name="title" required></div><div class="field"><label>Date</label><input type="date" name="date" required></div><div class="field"><label>Time</label><input type="time" name="time" required></div><div class="field"><label>Type</label><select name="type"><option>Game</option><option>Practice</option><option>Evaluation</option><option>Meeting</option><option>Deadline</option><option>Playoff</option><option>Tournament</option></select></div><div class="field"><label>Phase</label><select name="phase"><option>Preseason</option><option>Regular season</option><option>Zone playoffs</option><option>City tournament</option></select></div><div class="field"><label>Division</label><select name="division"><option>All</option>${activeSport().divisions.map(x=>`<option>${x}</option>`).join('')}</select></div><div class="field"><label>Location</label><input name="location" value="St. Ann's Gym"></div></div>${formActions('Add event')}</form>`); wireModal('eventForm',d=>{d.time=new Date(`2000-01-01T${d.time}`).toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'});state.events.push({id:uid('e'),...d});save();closeModal();render();toast('Event scheduled',d.title);}); }
function showVolunteerForm(existing){ const v=existing||{}; openModal(existing?'Update volunteer':'Add volunteer',`<form id="volunteerForm"><div class="form-grid"><div class="field full"><label>Volunteer name</label><input name="name" value="${esc(v.name||'')}" required></div><div class="field"><label>Email</label><input type="email" name="email" value="${esc(v.email||'')}" required></div><div class="field"><label>Role</label><select name="role">${['Head Coach','Assistant Coach','Team Parent','Scorekeeper','Gym Monitor'].map(x=>`<option ${v.role===x?'selected':''}>${x}</option>`).join('')}</select></div><div class="field"><label>Team</label><select name="team"><option>Unassigned</option>${state.teams.map(t=>`<option ${v.team===t.name?'selected':''}>${esc(t.name)}</option>`).join('')}</select></div><div class="field"><label>Safe environment</label><select name="safe">${['Current','Expiring','Pending'].map(x=>`<option ${v.safe===x?'selected':''}>${x}</option>`).join('')}</select></div><div class="field"><label>Background check</label><select name="background">${['Current','Expiring','Pending'].map(x=>`<option ${v.background===x?'selected':''}>${x}</option>`).join('')}</select></div><div class="field"><label>Overall status</label><select name="status">${['Cleared','Pending','Action needed'].map(x=>`<option ${v.status===x?'selected':''}>${x}</option>`).join('')}</select></div></div>${formActions(existing?'Save changes':'Add volunteer')}</form>`); wireModal('volunteerForm',d=>{if(existing)Object.assign(existing,d);else state.volunteers.push({id:uid('v'),...d});save();closeModal();render();toast(existing?'Volunteer updated':'Volunteer added',d.name);}); }
function showAnnouncementForm(audience='All families'){ openModal('New announcement',`<form id="announcementForm"><div class="form-grid"><div class="field full"><label>Headline</label><input name="title" required></div><div class="field full"><label>Audience</label><select name="audience">${['All families','Basketball families','Coaches','Volunteers','Unpaid registrations','Missing waivers'].map(x=>`<option ${audience===x?'selected':''}>${x}</option>`).join('')}</select></div><div class="field full"><label>Message</label><textarea name="body" required></textarea></div></div>${formActions('Publish announcement')}</form>`); wireModal('announcementForm',d=>{state.announcements.push({id:uid('a'),...d,date:new Date().toISOString().slice(0,10),published:true});save();closeModal();render();toast('Announcement published',d.title);}); }

function showSportDetail(id){
  const s = state.sports.find(x=>x.id===id);
  if (!s) return;
  const playingTeams = state.teams.filter(t => (t.sportId || 'basketball') === s.id);
  openModal(`${s.name} — Active Teams`, `
    <div class="card" style="background:var(--black);color:white;margin-bottom:16px">
      <span class="eyebrow">${esc(s.season)} · ${esc(s.year)} · ${esc(s.status)}</span>
      <h2 style="margin:5px 0">${esc(s.name)}</h2>
      <p class="card-subtitle" style="color:#ccc">Divisions: ${s.divisions.map(esc).join(' · ')}</p>
    </div>
    <h4 style="margin:0 0 10px;text-transform:uppercase;font-size:12px;color:var(--muted)">Teams Currently Playing (${playingTeams.length})</h4>
    <div class="activity-list">
      ${playingTeams.map(t => {
        const count = state.registrations.filter(r=>r.teamId===t.id).length;
        return `<div class="activity"><i></i><div><h4>${esc(t.name)} (${esc(t.division)})</h4><p>Head Coach: ${esc(t.coach)} · ${esc(t.practices)} · ${count}/${t.capacity} athletes</p></div></div>`;
      }).join('') || '<div class="empty">No teams are currently playing in this sport program.</div>'}
    </div>
    <div class="form-actions"><button class="btn primary" data-close-modal>Close</button></div>
  `, 'SPORTS & SEASONS SHOWCASE');
  $$('[data-close-modal]').forEach(b=>b.onclick=closeModal);
}

function showUserForm(existing = null){
  const u = existing || {name:'', username:'', password:'', role:'coach', coachName:'', teamIds:[]};
  openModal(existing ? `Edit Account: ${u.name}` : 'Add Coach Login', `
    <form id="userForm">
      <div class="form-grid">
        <div class="field"><label>Display Name (Matches Head Coach Name)</label><input name="name" value="${esc(u.name)}" required placeholder="Coach Full Name"></div>
        <div class="field"><label>Login Username</label><input name="username" value="${esc(u.username)}" required placeholder="e.g. dcruz"></div>
        <div class="field full"><label>Password</label><input name="password" value="${esc(u.password)}" required placeholder="Set password"></div>
        ${u.role !== 'master' ? `
          <div class="field full">
            <label>Assign Multiple Teams (Coach sees all selected teams in Teams, Overview & Schedule)</label>
            <div style="display:grid;gap:6px;padding:10px;border:1px solid var(--line);border-radius:10px;max-height:200px;overflow:auto">
              ${state.teams.map(t => {
                const isChecked = (u.teamIds||[]).includes(t.id) || (u.name && String(t.coach).toLowerCase() === String(u.name).toLowerCase());
                return `
                  <label style="display:flex;align-items:center;gap:8px;font-size:13px;text-transform:none;color:var(--ink)">
                    <input type="checkbox" name="teamIds" value="${t.id}" ${isChecked?'checked':''}>
                    <span><b>${esc(t.name)}</b> — Coach ${esc(t.coach)} (${esc(t.division)})</span>
                  </label>
                `;
              }).join('') || '<small style="color:var(--muted)">No teams created yet.</small>'}
            </div>
          </div>
        ` : ''}
      </div>
      ${formActions('Save Credentials')}
    </form>
  `, 'ACCESS & ROLES');

  $$('[data-close-modal]').forEach(b=>b.onclick=closeModal);
  $('#userForm').onsubmit = e => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const name = fd.get('name').trim();
    const username = fd.get('username').trim();
    const password = fd.get('password').trim();
    const teamIds = fd.getAll('teamIds');

    if (existing) {
      existing.name = name;
      existing.username = username;
      existing.password = password;
      if (existing.role !== 'master') {
        existing.coachName = name;
        existing.teamIds = teamIds;
        existing.permissions = ['dashboard', 'teams', 'schedule'];
      }
    } else {
      state.users.push({
        id: uid('u'),
        username,
        password,
        name,
        role: 'coach',
        coachName: name,
        teamIds,
        permissions: ['dashboard', 'teams', 'schedule', 'communications']
      });
    }
    save();
    closeModal();
    render();
    toast('Credentials saved', `${name} (${username}) updated.`);
  };
}

function deleteUser(id){
  const u = state.users.find(x=>x.id===id);
  if (!u || u.role === 'master') return;
  if (confirm(`Remove login access for ${u.name}?`)) {
    state.users = state.users.filter(x=>x.id!==id);
    save();
    render();
    toast('Account removed');
  }
}

function deleteAllDemoData(){
  if (confirm('Delete ALL demo registrations, teams, schedule events, volunteers, announcements, and coach logins? Your Master Admin account and sports templates will be kept.')) {
    state.registrations = [];
    state.teams = [];
    state.events = [];
    state.volunteers = [];
    state.announcements = [];
    state.users = state.users.filter(u => u.role === 'master');
    selectedRegIds.clear();
    selectedTeamIds.clear();
    selectedCoachFilter = 'ALL';
    activeWorkspaceTeamId = '';
    save();
    render();
    toast('All demo data deleted', 'Your portal is now clean and ready for live data.');
  }
}

function exportRegistrations(){ download('basketball-2026-2027-registrations.csv',csv([['Athlete','Division','Email','Jersey','Size','Uniform Paid','Status','Registration Paid','Fundraiser Amount','Team'],...allowedRegistrations().map(r=>[r.name,r.division,r.email,r.jersey||'',r.uniformSize||'YS',r.uniformPaid?'Paid':'Due',r.status,r.paid?'Paid':'Due',r.fundraiserAmount||0,state.teams.find(t=>t.id===r.teamId)?.name||'Unassigned'])]),'text/csv');toast('Registration report downloaded'); }
function exportRosters(){ const teamIds = new Set(allowedTeams().map(t=>t.id)); download('basketball-2026-2027-rosters.csv',csv([['Team','Division','Athlete','Jersey #','Uniform Size','Uniform Paid','Registration PD','Fundraiser ($)','Coach'],...state.registrations.filter(r=>r.teamId && teamIds.has(r.teamId)).map(r=>{const t=state.teams.find(x=>x.id===r.teamId);return[t.name,t.division,r.name,r.jersey||'',r.uniformSize||'YS',r.uniformPaid?'Paid':'Due',r.paid?'Paid':'Due',r.fundraiserAmount||0,t.coach]})]),'text/csv');toast('Roster report downloaded'); }
function exportSchedule(){ download('basketball-2026-2027-schedule.csv',csv([['Date','Time','Event','Type','Division','Location','Phase'],...state.events.sort((a,b)=>a.date.localeCompare(b.date)).map(e=>[e.date,e.time,e.title,e.type,e.division,e.location,e.phase])]),'text/csv');toast('Schedule report downloaded'); }
function exportVolunteers(){ download('basketball-2026-2027-volunteers.csv',csv([['Volunteer','Email','Role','Team','Safe Environment','Background Check','Overall'],...state.volunteers.map(v=>[v.name,v.email,v.role,v.team,v.safe,v.background,v.status])]),'text/csv');toast('Volunteer report downloaded'); }
function exportPayments(){ const rows=allowedRegistrations().filter(r=>!r.paid); download('basketball-2026-2027-payment-follow-up.csv',csv([['Athlete','Email','Division','Status','Uniform Paid','Fundraiser ($)'],...rows.map(r=>[r.name,r.email,r.division,r.status,r.uniformPaid?'Paid':'Due',r.fundraiserAmount||0])]),'text/csv');toast('Payment follow-up downloaded',`${rows.length} outstanding registration${rows.length===1?'':'s'}.`); }
function resetData(){ if(confirm('Restore the starter demo data?')){state=normalizeState(seed);save();navigate('dashboard');toast('Demo data restored');} }

$('#loginForm').addEventListener('submit', e => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const username = fd.get('username').trim();
  const password = fd.get('password').trim();
  const matched = state.users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);
  const errEl = $('#loginError');
  if (!matched) {
    errEl.textContent = 'Invalid username or password.';
    errEl.hidden = false;
    return;
  }
  errEl.hidden = true;
  sessionStorage.setItem(SESSION_KEY, matched.id);
  activeWorkspaceTeamId = '';
  applyAuthUI();
  updateSeasonSelect();
  updateNoticeCount();
  navigate('dashboard');
  toast(`Welcome, ${matched.name}`, matched.role === 'master' ? 'Signed in as Master Admin.' : 'Signed in to Coach Portal.');
});

$('#logoutBtn').onclick = () => {
  sessionStorage.removeItem(SESSION_KEY);
  activeWorkspaceTeamId = '';
  applyAuthUI();
};

$('#nav').addEventListener('click',e=>{const b=e.target.closest('[data-view]');if(b)navigate(b.dataset.view);});
$('.sidebar-foot').addEventListener('click',e=>{const b=e.target.closest('[data-view]');if(b)navigate(b.dataset.view);});
$('#menuBtn').onclick=()=>$('#sidebar').classList.toggle('open');
$('#modalClose').onclick=closeModal;
$('#modalBackdrop').addEventListener('click',e=>{if(e.target===e.currentTarget)closeModal();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
$('#seasonSelect').onchange=e=>{state.activeSeasonId=e.target.value;save();render();toast('Season changed',e.target.options[e.target.selectedIndex].text);};
$('#globalSearchBtn').onclick=()=>{if(canView('registrations')){navigate('registrations');setTimeout(()=>$('#regSearch')?.focus(),50);}};
$('#profileBtn').onclick=()=>{if(canView('settings')){settingsTab='access';navigate('settings');}};
$('#notificationBtn').onclick=()=>{const old=$('.notice-panel');if(old){old.remove();return;}const p=document.createElement('aside');p.className='notice-panel';p.innerHTML=`<h3>Needs attention</h3>${attentionItemsByTeam()||'<p class="card-subtitle">All caught up.</p>'}`;document.body.append(p);};
$('#importFile').onchange=e=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{try{const incoming=JSON.parse(reader.result);if(!incoming.sports||!incoming.registrations)throw new Error('Invalid backup');state=normalizeState(incoming);save();applyAuthUI();navigate('dashboard');toast('Backup imported','Saints data was restored successfully.');}catch(err){toast('Import failed','Choose a valid St. Ann’s CYO JSON backup.');}e.target.value='';};reader.readAsText(file);};

applyAuthUI();
if (currentUser()) {
  updateSeasonSelect();
  updateNoticeCount();
  render();
}

/* === Admin Coach Profile & Practice Slot Editor + 1st & 2nd Practice Day Toggles & Half-Court Drag & Drop === */
(function initCoachAndPracticeEditor() {
  if (window.__coachPracticeEditorLoaded) return;
  window.__coachPracticeEditorLoaded = true;

  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const DEFAULT_SLOTS = ['5:00 PM', '6:00 PM', '7:00 PM', '8:00 PM'];
  const COMMON_TIMES = ['5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 AM', '10:00 AM'];

  function canEditAdmin() {
    try {
      const headerPill = Array.from(document.querySelectorAll('header button, header span, .topbar button, .topbar span, button'))
        .map(el => (el.textContent || '').trim())
        .find(txt => /^(Master Admin|Coach\b|Family\b)/i.test(txt));
      if (headerPill && /^Coach\b/i.test(headerPill)) return false;
      if (typeof state !== 'undefined' && state) {
        const roleVal = String(state.role || state.mode || state.viewAs || state.userRole || '').toLowerCase();
        if (roleVal.includes('coach') || roleVal.includes('family') || roleVal.includes('parent')) return false;
        if (state.currentCoach || state.coachId || state.loggedInCoach) return false;
      }
      const navText = Array.from(document.querySelectorAll('.nav-item, nav a, nav button'))
        .map(el => (el.textContent || '').trim().toLowerCase())
        .join(' ');
      if (navText && navText.includes('schedule') && !navText.includes('settings') && !navText.includes('registrations')) {
        return false;
      }
      return typeof isMaster === 'function' ? Boolean(isMaster()) : true;
    } catch (_) {
      return false;
    }
  }
  function _unusedOldCanEditAdmin() {
    try {
      if (typeof state !== 'undefined' && state) {
        const roleVal = String(state.role || state.mode || state.viewAs || state.userRole || '').toLowerCase();
        if (roleVal.includes('coach') || roleVal.includes('family') || roleVal.includes('parent')) return false;
        if (state.currentCoach || state.coachId || state.loggedInCoach) return false;
      }
      // Also check sidebar: Master Admin has "Coaches", "Registrations", "Settings"; Coach login only has Overview, Teams, Schedule
      const navText = Array.from(document.querySelectorAll('.nav-item, nav a, nav button'))
        .map(el => (el.textContent || '').trim().toLowerCase())
        .join(' ');
      if (navText && navText.includes('schedule') && !navText.includes('settings') && !navText.includes('registrations')) {
        return false;
      }
      return typeof isMaster === 'function' ? Boolean(isMaster()) : true;
    } catch (_) {
      return false;
    }
  }

  function isDay1Enabled(team) {
    if (!team) return false;
    if (team.practiceEnabled === false) return false;
    return Boolean(team.practiceDay);
  }

  function normalizeTimeLabel(raw) {
    const s = String(raw || '').trim();
    if (!s) return '6:00 PM';
    const compact = s.match(/^(\d{1,2})(\d{2})\s*(am|pm)?$/i);
    if (compact) {
      let hr = parseInt(compact[1], 10);
      const min = compact[2];
      let mer = (compact[3] || '').toUpperCase();
      if (!mer) mer = (hr >= 8 && hr <= 11) ? 'AM' : 'PM';
      return `${hr}:${min} ${mer}`;
    }
    const m = s.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);
    if (!m) return s;
    let hr = parseInt(m[1], 10);
    const min = m[2] || '00';
    let mer = (m[3] || '').toUpperCase();
    if (!mer) mer = (hr >= 8 && hr <= 11) ? 'AM' : 'PM';
    return `${hr}:${min} ${mer}`;
  }

  function timeToMinutes(label) {
    const norm = normalizeTimeLabel(label);
    const m = norm.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!m) return 9999;
    let hr = parseInt(m[1], 10) % 12;
    const min = parseInt(m[2], 10);
    if (m[3].toUpperCase() === 'PM') hr += 12;
    return hr * 60 + min;
  }

  function getActiveTimeSlots() {
    const set = new Set(DEFAULT_SLOTS);
    if (typeof state !== 'undefined' && Array.isArray(state.teams)) {
      state.teams.forEach(t => {
        if (isDay1Enabled(t) && t.practiceTime) {
          t.practiceTime = normalizeTimeLabel(t.practiceTime);
          set.add(t.practiceTime);
        }
        if (t.practiceDay2 && t.practiceTime2) {
          t.practiceTime2 = normalizeTimeLabel(t.practiceTime2);
          set.add(t.practiceTime2);
        }
      });
    }
    return Array.from(set).sort((a, b) => timeToMinutes(a) - timeToMinutes(b));
  }

  function findCoachRecord(coachName, coachId) {
    if (!state || !Array.isArray(state.coaches)) return null;
    if (coachId) {
      const byId = state.coaches.find(c => String(c.id) === String(coachId));
      if (byId) return byId;
    }
    if (coachName) {
      const target = coachName.trim().toLowerCase();
      return state.coaches.find(c => String(c.name || '').trim().toLowerCase() === target) || null;
    }
    return null;
  }

  function getCoachTeams(coachName) {
    if (!state || !Array.isArray(state.teams) || !coachName) return [];
    const target = coachName.trim().toLowerCase();
    return state.teams.filter(t => String(t.coach || '').trim().toLowerCase() === target);
  }

  function getSlotBookings(day, time, excludeTeamId, excludeSlotNum) {
    if (!state || !Array.isArray(state.teams) || !day || !time) return [];
    const d = String(day).trim().toLowerCase().slice(0, 3);
    const tm = normalizeTimeLabel(time).toLowerCase();
    const results = [];

    state.teams.forEach(t => {
      if (isDay1Enabled(t) && String(t.practiceDay).trim().toLowerCase().startsWith(d)) {
        const t1 = normalizeTimeLabel(t.practiceTime || '6:00 PM').toLowerCase();
        if (t1 === tm && !(String(t.id) === String(excludeTeamId) && Number(excludeSlotNum) === 1)) {
          results.push({ team: t, slotNum: 1, halfCourt: t.halfCourt || '' });
        }
      }
      if (t.practiceDay2 && String(t.practiceDay2).trim().toLowerCase().startsWith(d)) {
        const t2 = normalizeTimeLabel(t.practiceTime2 || t.practiceTime || '6:00 PM').toLowerCase();
        if (t2 === tm && !(String(t.id) === String(excludeTeamId) && Number(excludeSlotNum) === 2)) {
          results.push({ team: t, slotNum: 2, halfCourt: t.halfCourt2 || '' });
        }
      }
    });

    return results;
  }

  function syncTeamPracticeAcrossState(team, oldName) {
    if (team.practiceEnabled === false) {
      team.practiceDay = '';
      team.practiceTime = '';
      team.halfCourt = '';
    } else {
      team.practiceEnabled = true;
      team.practiceDay = team.practiceDay || 'Tue';
      team.practiceTime = normalizeTimeLabel(team.practiceTime || '6:00 PM');
      team.practiceLocation = team.practiceLocation || "St. Ann's Gym";
    }

    if (team.practiceDay2) {
      team.practiceTime2 = normalizeTimeLabel(team.practiceTime2 || team.practiceTime || '6:00 PM');
      team.practiceLocation2 = team.practiceLocation2 || team.practiceLocation || "St. Ann's Gym";
    } else {
      team.practiceDay2 = '';
      team.practiceTime2 = '';
      team.halfCourt2 = '';
    }

    if (typeof normalizeTeamPractice === 'function') {
      normalizeTeamPractice(team);
      // Re-enforce off-site toggle in case normalizeTeamPractice defaults empty practiceDay
      if (team.practiceEnabled === false) {
        team.practiceDay = '';
        team.practiceTime = '';
        team.halfCourt = '';
      }
    }

    ['schedule', 'events', 'practices'].forEach(arrKey => {
      if (Array.isArray(state[arrKey])) {
        state[arrKey].forEach(ev => {
          if (
            String(ev.teamId) === String(team.id) ||
            (ev.team && (ev.team === team.name || ev.team === oldName) && /practice/i.test(ev.type || ev.title || ''))
          ) {
            const isSlot2 = Number(ev.slotNum) === 2;
            if (isSlot2 && team.practiceDay2) {
              ev.day = team.practiceDay2;
              ev.practiceDay = team.practiceDay2;
              ev.time = team.practiceTime2;
              ev.practiceTime = team.practiceTime2;
              ev.location = team.practiceLocation2;
              ev.halfCourt = team.halfCourt2 || '';
            } else {
              ev.day = team.practiceDay;
              ev.practiceDay = team.practiceDay;
              ev.time = team.practiceTime;
              ev.practiceTime = team.practiceTime;
              ev.location = team.practiceLocation;
              ev.halfCourt = team.halfCourt || '';
            }
            ev.coach = team.coach;
          }
        });
      }
    });
  }

  window.moveTeamPracticeSlot = function moveTeamPracticeSlot(teamId, newDay, newTime, slotNum = 1) {
    if (!canEditAdmin() || !state || !Array.isArray(state.teams)) return;
    const team = state.teams.find(t => String(t.id) === String(teamId));
    if (!team || !newDay) return;

    const sNum = Number(slotNum) === 2 ? 2 : 1;
    const curDay = sNum === 2 ? (team.practiceDay2 || '') : (isDay1Enabled(team) ? (team.practiceDay || '') : '');
    const curTime = sNum === 2 ? (team.practiceTime2 || team.practiceTime || '6:00 PM') : (team.practiceTime || '6:00 PM');
    const targetTime = newTime ? normalizeTimeLabel(newTime) : normalizeTimeLabel(curTime);

    const sameDay = String(curDay).toLowerCase().startsWith(newDay.toLowerCase().slice(0, 3));
    const sameTime = normalizeTimeLabel(curTime).toLowerCase() === targetTime.toLowerCase();
    if (sameDay && sameTime) return;

    const existingInSlot = getSlotBookings(newDay, targetTime, team.id, sNum);
    if (existingInSlot.length >= 2) {
      if (!confirm(`${newDay} at ${targetTime} already has 2 half-court teams (${existingInSlot.map(x => x.team.name).join(' & ')}).\n\nAdd ${team.name} (Practice ${sNum}) as a 3rd team anyway?`)) {
        return;
      }
    }

    if (sNum === 2) {
      team.practiceDay2 = newDay;
      team.practiceTime2 = targetTime;
      if (!team.practiceLocation2) team.practiceLocation2 = team.practiceLocation || "St. Ann's Gym";
    } else {
      team.practiceEnabled = true;
      team.practiceDay = newDay;
      team.practiceTime = targetTime;
    }

    if (existingInSlot.length === 1) {
      const other = existingInSlot[0];
      const otherCourt = other.slotNum === 2 ? other.team.halfCourt2 : other.team.halfCourt;
      if (!otherCourt || otherCourt === 'Full Court') {
        if (other.slotNum === 2) other.team.halfCourt2 = 'Half Court A';
        else other.team.halfCourt = 'Half Court A';
        syncTeamPracticeAcrossState(other.team, other.team.name);
      }
      const updatedOtherCourt = other.slotNum === 2 ? other.team.halfCourt2 : other.team.halfCourt;
      const assignedCourt = updatedOtherCourt === 'Half Court A' ? 'Half Court B' : 'Half Court A';
      if (sNum === 2) team.halfCourt2 = assignedCourt;
      else team.halfCourt = assignedCourt;
    } else if (existingInSlot.length === 0) {
      if (sNum === 2 && (team.halfCourt2 === 'Half Court A' || team.halfCourt2 === 'Half Court B')) team.halfCourt2 = '';
      if (sNum === 1 && (team.halfCourt === 'Half Court A' || team.halfCourt === 'Half Court B')) team.halfCourt = '';
    }

    syncTeamPracticeAcrossState(team, team.name);

    if (typeof save === 'function') save();
    if (typeof render === 'function') render();
    if (typeof toast === 'function') {
      const courtLabel = sNum === 2 ? team.halfCourt2 : team.halfCourt;
      if (existingInSlot.length === 1) {
        toast('Half-Court Paired (2/2)', `${team.name} Practice ${sNum} (${courtLabel}) paired with ${existingInSlot[0].team.name} on ${newDay} at ${targetTime}.`);
      } else {
        toast('Practice Slot Updated', `${team.name} Practice ${sNum} → ${newDay} at ${targetTime}.`);
      }
    }
  };

  window.openCoachPracticeModal = function openCoachPracticeModal(opts = {}) {
    if (!canEditAdmin()) return;
    const existingOverlay = document.getElementById('adminCoachPracticeOverlay');
    if (existingOverlay) existingOverlay.remove();

    let selectedTeam = opts.teamId ? (state.teams || []).find(t => String(t.id) === String(opts.teamId)) : null;
    let coachRec = findCoachRecord(opts.coachName || (selectedTeam && selectedTeam.coach), opts.coachId);
    const coachName = (selectedTeam && selectedTeam.coach) || (coachRec && coachRec.name) || opts.coachName || '';
    let teams = selectedTeam ? [selectedTeam] : getCoachTeams(coachName);
    if (!selectedTeam && teams.length > 0) {
      selectedTeam = teams[0];
    }

    const overlay = document.createElement('div');
    overlay.id = 'adminCoachPracticeOverlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(15,15,18,0.62);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;';

    const allCoaches = Array.from(new Set([
      ...((state.coaches || []).map(c => c.name).filter(Boolean)),
      ...((state.teams || []).map(t => t.coach).filter(Boolean))
    ]));

    const buildTeamSlotRows = (teamList) => {
      if (!teamList.length) {
        const unassignedTeams = (state.teams || []).filter(t => !t.coach || t.coach === 'Open' || t.coach === 'Unassigned' || t.coach === 'no coach');
        return `
          <div style="padding:12px;background:#faf7ef;border:1px dashed #d7bd78;border-radius:8px;margin-top:8px;">
            <p style="margin:0 0 8px;font-size:13px;">No team currently assigned to this coach.</p>
            ${unassignedTeams.length ? `
              <label style="font-size:12px;font-weight:700;display:block;margin-bottom:4px;">Assign Team to Coach</label>
              <select id="cpAssignTeamId" class="inline-input" style="width:100%;">
                <option value="">— Keep Unassigned —</option>
                ${unassignedTeams.map(t => `<option value="${esc(t.id)}">${esc(t.name)} (${esc(t.division)})</option>`).join('')}
              </select>
            ` : '<span class="muted" style="font-size:12px;">Create a team in Teams or reassign an existing team to add practice slots.</span>'}
          </div>
        `;
      }

      return teamList.map((t, idx) => {
        const hasDay1 = isDay1Enabled(t);
        const normTime1 = normalizeTimeLabel(t.practiceTime || '6:00 PM');
        const courtVal1 = t.halfCourt || '';
        const hasDay2 = Boolean(t.practiceDay2);
        const normTime2 = normalizeTimeLabel(t.practiceTime2 || t.practiceTime || '6:00 PM');
        const courtVal2 = t.halfCourt2 || '';

        return `
        <div class="cp-team-block" data-team-id="${esc(t.id)}" style="padding:14px;background:#faf7ef;border:1px solid #e6d7ad;border-radius:10px;margin-top:${idx === 0 ? '8px' : '12px'};">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <div>
              <strong style="font-size:14px;">${esc(t.name)}</strong>
              <span style="font-size:12px;color:#6b7280;margin-left:6px;">(${esc(t.division || 'Division')})</span>
            </div>
            <span style="font-size:11px;font-weight:700;color:#9a7b2c;text-transform:uppercase;">Gym Practice Slots</span>
          </div>

          <div style="padding-top:4px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
              <span style="font-size:11px;font-weight:800;color:#9a7b2c;text-transform:uppercase;">Practice Day 1 (Primary Gym Slot)</span>
              <label style="font-size:12px;font-weight:700;display:flex;align-items:center;gap:6px;cursor:pointer;">
                <input type="checkbox" class="cp-enable-day1" ${hasDay1 ? 'checked' : ''} />
                Enable 1st Practice Day
              </label>
            </div>

            <div class="cp-day1-offsite-note" style="display:${hasDay1 ? 'none' : 'block'};padding:8px 10px;border-radius:6px;background:#f3f4f6;color:#4b5563;font-size:12px;font-weight:600;margin-bottom:6px;">
              Off-site / External gym — Day 1 does not reserve a St. Ann's gym slot.
            </div>

            <div class="cp-day1-fields" style="display:${hasDay1 ? 'grid' : 'none'};grid-template-columns:1fr 1fr;gap:10px;">
              <div>
                <label style="display:block;font-size:11px;font-weight:700;margin-bottom:4px;">DAY 1</label>
                <select class="inline-input cp-day" style="width:100%;">
                  ${DAYS.map(d => `<option value="${d}" ${String(t.practiceDay || 'Tue').toLowerCase().startsWith(d.toLowerCase()) ? 'selected' : ''}>${d}</option>`).join('')}
                </select>
              </div>
              <div>
                <label style="display:block;font-size:11px;font-weight:700;margin-bottom:4px;">TIME 1</label>
                <input type="text" list="cpTimePresets" class="inline-input cp-time" value="${esc(normTime1)}" placeholder="e.g. 6:00 PM" style="width:100%;" />
              </div>
              <div>
                <label style="display:block;font-size:11px;font-weight:700;margin-bottom:4px;">COURT OPTION 1</label>
                <select class="inline-input cp-court" style="width:100%;">
                  <option value="" ${courtVal1 === '' ? 'selected' : ''}>Standard / Open Court</option>
                  <option value="Half Court A" ${courtVal1 === 'Half Court A' ? 'selected' : ''}>Half Court A (North / Left)</option>
                  <option value="Half Court B" ${courtVal1 === 'Half Court B' ? 'selected' : ''}>Half Court B (South / Right)</option>
                  <option value="Full Court" ${courtVal1 === 'Full Court' ? 'selected' : ''}>Full Court</option>
                </select>
              </div>
              <div>
                <label style="display:block;font-size:11px;font-weight:700;margin-bottom:4px;">GYM / LOCATION 1</label>
                <input type="text" class="inline-input cp-loc" value="${esc(t.practiceLocation || "St. Ann's Gym")}" placeholder="St. Ann's Gym" style="width:100%;" />
              </div>
            </div>
            <div class="cp-conflict-msg-1" style="margin-top:6px;font-size:12px;font-weight:600;display:none;"></div>
          </div>

          <div style="margin-top:12px;padding-top:12px;border-top:1px dashed #d8c696;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
              <span style="font-size:11px;font-weight:800;color:#7a5e1a;text-transform:uppercase;">Practice Day 2 (Optional Second Practice)</span>
              <label style="font-size:12px;font-weight:700;display:flex;align-items:center;gap:6px;cursor:pointer;">
                <input type="checkbox" class="cp-enable-day2" ${hasDay2 ? 'checked' : ''} />
                Enable 2nd Practice Day
              </label>
            </div>

            <div class="cp-day2-fields" style="display:${hasDay2 ? 'grid' : 'none'};grid-template-columns:1fr 1fr;gap:10px;">
              <div>
                <label style="display:block;font-size:11px;font-weight:700;margin-bottom:4px;">DAY 2</label>
                <select class="inline-input cp-day2" style="width:100%;">
                  ${DAYS.map(d => `<option value="${d}" ${String(t.practiceDay2 || 'Thu').toLowerCase().startsWith(d.toLowerCase()) ? 'selected' : ''}>${d}</option>`).join('')}
                </select>
              </div>
              <div>
                <label style="display:block;font-size:11px;font-weight:700;margin-bottom:4px;">TIME 2</label>
                <input type="text" list="cpTimePresets" class="inline-input cp-time2" value="${esc(normTime2)}" placeholder="e.g. 6:00 PM" style="width:100%;" />
              </div>
              <div>
                <label style="display:block;font-size:11px;font-weight:700;margin-bottom:4px;">COURT OPTION 2</label>
                <select class="inline-input cp-court2" style="width:100%;">
                  <option value="" ${courtVal2 === '' ? 'selected' : ''}>Standard / Open Court</option>
                  <option value="Half Court A" ${courtVal2 === 'Half Court A' ? 'selected' : ''}>Half Court A (North / Left)</option>
                  <option value="Half Court B" ${courtVal2 === 'Half Court B' ? 'selected' : ''}>Half Court B (South / Right)</option>
                  <option value="Full Court" ${courtVal2 === 'Full Court' ? 'selected' : ''}>Full Court</option>
                </select>
              </div>
              <div>
                <label style="display:block;font-size:11px;font-weight:700;margin-bottom:4px;">GYM / LOCATION 2</label>
                <input type="text" class="inline-input cp-loc2" value="${esc(t.practiceLocation2 || t.practiceLocation || "St. Ann's Gym")}" placeholder="St. Ann's Gym" style="width:100%;" />
              </div>
            </div>
            <div class="cp-conflict-msg-2" style="margin-top:6px;font-size:12px;font-weight:600;display:none;"></div>
          </div>

          <div style="margin-top:10px;padding-top:10px;border-top:1px solid #eee4c8;">
            <label style="display:block;font-size:11px;font-weight:700;margin-bottom:4px;">ASSISTANT COACH</label>
            <input type="text" class="inline-input cp-asst" value="${esc(t.assistant || '')}" placeholder="Assistant name" style="width:100%;" />
          </div>
        </div>
      `;
      }).join('');
    };

    overlay.innerHTML = `
      <div style="background:#fff;border:1px solid #d7bd78;border-radius:14px;max-width:580px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 20px 45px rgba(0,0,0,0.28);">
        <div style="padding:16px 20px;border-bottom:1px solid #eee6d3;display:flex;justify-content:space-between;align-items:center;background:#fcfaf3;border-radius:14px 14px 0 0;">
          <div>
            <span style="font-size:11px;font-weight:700;letter-spacing:.08em;color:#9a7b2c;text-transform:uppercase;">Admin Schedule & Coach Editor</span>
            <h3 style="margin:2px 0 0;font-size:18px;">${selectedTeam ? `Edit Practice & Coach — ${esc(selectedTeam.name)}` : `Edit Coach Profile — ${esc(coachName || 'Coach')}`}</h3>
          </div>
          <button type="button" id="cpCloseBtn" class="btn small">✕</button>
        </div>
        <form id="cpEditorForm" style="padding:18px 20px;">
          <datalist id="cpTimePresets">
            ${COMMON_TIMES.map(tm => `<option value="${tm}"></option>`).join('')}
          </datalist>
          <datalist id="cpCoachList">
            ${allCoaches.map(cn => `<option value="${esc(cn)}"></option>`).join('')}
          </datalist>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;">
            <div style="grid-column:1 / -1;">
              <label style="display:block;font-size:11px;font-weight:700;margin-bottom:4px;">HEAD COACH NAME</label>
              <input type="text" id="cpCoachName" list="cpCoachList" class="inline-input" value="${esc(coachName)}" required style="width:100%;font-weight:600;" />
            </div>
            <div>
              <label style="display:block;font-size:11px;font-weight:700;margin-bottom:4px;">COACH EMAIL</label>
              <input type="email" id="cpCoachEmail" class="inline-input" value="${esc((coachRec && coachRec.email) || '')}" placeholder="coach@example.com" style="width:100%;" />
            </div>
            <div>
              <label style="display:block;font-size:11px;font-weight:700;margin-bottom:4px;">COACH PHONE</label>
              <input type="text" id="cpCoachPhone" class="inline-input" value="${esc((coachRec && coachRec.phone) || '')}" placeholder="(210) 555-0199" style="width:100%;" />
            </div>
          </div>

          <div style="border-top:1px solid #eee6d3;padding-top:12px;">
            <strong style="font-size:13px;">Assigned Practice Slots (0, 1, or 2 Days/Week · Uncheck Day 1 for Off-Site Teams)</strong>
            ${buildTeamSlotRows(teams)}
          </div>

          <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:18px;padding-top:14px;border-top:1px solid #eee6d3;">
            <button type="button" id="cpCancelBtn" class="btn">Cancel</button>
            <button type="submit" class="btn gold">Save Coach & Practice</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(overlay);

    const close = () => overlay.remove();
    overlay.querySelector('#cpCloseBtn').onclick = close;
    overlay.querySelector('#cpCancelBtn').onclick = close;
    overlay.onclick = (e) => { if (e.target === overlay) close(); };

    const updateConflictWarnings = () => {
      overlay.querySelectorAll('.cp-team-block').forEach(block => {
        const tId = block.getAttribute('data-team-id');

        // Slot 1 toggle & check
        const enabled1 = block.querySelector('.cp-enable-day1').checked;
        const fields1 = block.querySelector('.cp-day1-fields');
        const note1 = block.querySelector('.cp-day1-offsite-note');
        const msgEl1 = block.querySelector('.cp-conflict-msg-1');
        fields1.style.display = enabled1 ? 'grid' : 'none';
        note1.style.display = enabled1 ? 'none' : 'block';

        if (!enabled1) {
          msgEl1.style.display = 'none';
        } else {
          const day1 = block.querySelector('.cp-day').value;
          const time1 = block.querySelector('.cp-time').value;
          const others1 = getSlotBookings(day1, time1, tId, 1);
          if (others1.length === 1) {
            msgEl1.style.color = '#15803d';
            msgEl1.textContent = `✓ Day 1 half-court pair available: shares ${day1} ${normalizeTimeLabel(time1)} with ${others1[0].team.name}.`;
            msgEl1.style.display = 'block';
          } else if (others1.length >= 2) {
            msgEl1.style.color = '#b91c1c';
            msgEl1.textContent = `⚠ Day 1 full slot (2/2): ${others1.map(o => o.team.name).join(' & ')} already booked ${day1} at ${normalizeTimeLabel(time1)}.`;
            msgEl1.style.display = 'block';
          } else {
            msgEl1.style.display = 'none';
          }
        }

        // Slot 2 toggle & check
        const enabled2 = block.querySelector('.cp-enable-day2').checked;
        const fields2 = block.querySelector('.cp-day2-fields');
        const msgEl2 = block.querySelector('.cp-conflict-msg-2');
        fields2.style.display = enabled2 ? 'grid' : 'none';
        if (!enabled2) {
          msgEl2.style.display = 'none';
          return;
        }
        const day2 = block.querySelector('.cp-day2').value;
        const time2 = block.querySelector('.cp-time2').value;
        const others2 = getSlotBookings(day2, time2, tId, 2);
        if (others2.length === 1) {
          msgEl2.style.color = '#15803d';
          msgEl2.textContent = `✓ Day 2 half-court pair available: shares ${day2} ${normalizeTimeLabel(time2)} with ${others2[0].team.name}.`;
          msgEl2.style.display = 'block';
        } else if (others2.length >= 2) {
          msgEl2.style.color = '#b91c1c';
          msgEl2.textContent = `⚠ Day 2 full slot (2/2): ${others2.map(o => o.team.name).join(' & ')} already booked ${day2} at ${normalizeTimeLabel(time2)}.`;
          msgEl2.style.display = 'block';
        } else {
          msgEl2.style.display = 'none';
        }
      });
    };

    overlay.querySelectorAll('.cp-enable-day1, .cp-day, .cp-time, .cp-court, .cp-enable-day2, .cp-day2, .cp-time2, .cp-court2').forEach(el => {
      el.addEventListener('input', updateConflictWarnings);
      el.addEventListener('change', updateConflictWarnings);
    });
    updateConflictWarnings();

    overlay.querySelector('#cpEditorForm').onsubmit = (e) => {
      e.preventDefault();
      const newCoachName = overlay.querySelector('#cpCoachName').value.trim();
      const newEmail = overlay.querySelector('#cpCoachEmail').value.trim();
      const newPhone = overlay.querySelector('#cpCoachPhone').value.trim();

      let targetCoachRec = findCoachRecord(newCoachName, coachRec && coachRec.id);
      if (targetCoachRec) {
        targetCoachRec.name = newCoachName || targetCoachRec.name;
        if ('email' in targetCoachRec || newEmail) targetCoachRec.email = newEmail;
        if ('phone' in targetCoachRec || newPhone) targetCoachRec.phone = newPhone;
      } else if (Array.isArray(state.coaches) && newCoachName) {
        state.coaches.push({
          id: typeof uid === 'function' ? uid('c') : 'c_' + Date.now(),
          name: newCoachName,
          email: newEmail,
          phone: newPhone,
          status: 'Active'
        });
      }

      const assignSelect = overlay.querySelector('#cpAssignTeamId');
      if (assignSelect && assignSelect.value) {
        const targetTeam = (state.teams || []).find(t => String(t.id) === String(assignSelect.value));
        if (targetTeam) {
          targetTeam.coach = newCoachName;
          syncTeamPracticeAcrossState(targetTeam, targetTeam.name);
        }
      }

      overlay.querySelectorAll('.cp-team-block').forEach(block => {
        const tId = block.getAttribute('data-team-id');
        const team = (state.teams || []).find(t => String(t.id) === String(tId));
        if (!team) return;

        const oldName = team.name;
        team.coach = newCoachName || team.coach;

        const enableDay1 = block.querySelector('.cp-enable-day1').checked;
        if (enableDay1) {
          team.practiceEnabled = true;
          team.practiceDay = block.querySelector('.cp-day').value;
          team.practiceTime = normalizeTimeLabel(block.querySelector('.cp-time').value || '6:00 PM');
          team.halfCourt = block.querySelector('.cp-court').value;
          team.practiceLocation = block.querySelector('.cp-loc').value.trim() || "St. Ann's Gym";
        } else {
          team.practiceEnabled = false;
          team.practiceDay = '';
          team.practiceTime = '';
          team.halfCourt = '';
        }

        const enableDay2 = block.querySelector('.cp-enable-day2').checked;
        if (enableDay2) {
          team.practiceDay2 = block.querySelector('.cp-day2').value;
          team.practiceTime2 = normalizeTimeLabel(block.querySelector('.cp-time2').value || '6:00 PM');
          team.halfCourt2 = block.querySelector('.cp-court2').value;
          team.practiceLocation2 = block.querySelector('.cp-loc2').value.trim() || team.practiceLocation || "St. Ann's Gym";
        } else {
          team.practiceDay2 = '';
          team.practiceTime2 = '';
          team.halfCourt2 = '';
          team.practiceLocation2 = '';
        }

        team.assistant = block.querySelector('.cp-asst').value.trim() || team.assistant || 'Open';
        syncTeamPracticeAcrossState(team, oldName);
      });

      if (typeof save === 'function') save();
      close();
      if (typeof render === 'function') render();
      if (typeof toast === 'function') {
        toast('Saved', `Updated ${newCoachName || 'coach'} and practice schedule.`);
      }
    };
  };

  function makeEditButton(label, onClickFn) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn small gold cp-inline-edit-btn';
    btn.style.cssText = 'font-size:11px;padding:3px 8px;cursor:pointer;';
    btn.textContent = label || 'Edit';
    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      onClickFn();
    };
    return btn;
  }

  function buildPracticeCardElement(team, slotNum, slotTime) {
    const isSlot2 = slotNum === 2;
    const loc = isSlot2 ? (team.practiceLocation2 || team.practiceLocation || "St. Ann's Gym") : (team.practiceLocation || "St. Ann's Gym");
    const card = document.createElement('div');
    card.style.cssText = 'border:1px solid #e5d8b4;border-radius:8px;padding:8px 10px;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,0.03);';
    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;gap:4px;">
        <span style="font-size:10px;font-weight:800;letter-spacing:.05em;color:${isSlot2 ? '#1d4ed8' : '#9a7b2c'};text-transform:uppercase;">
          • PRACTICE ${isSlot2 ? '2' : '1'}
        </span>
        <button type="button" class="btn small cp-card-edit-btn" style="font-size:10px;padding:1px 6px;line-height:1.4;background:#faf5e4;border:1px solid #dfc88a;color:#7a5e1a;font-weight:700;cursor:pointer;">Edit</button>
      </div>
      <div style="font-weight:700;font-size:13px;color:#111827;margin-top:2px;">${esc(team.name)}</div>
      <div style="font-size:11px;color:#6b7280;margin-top:1px;">${esc(slotTime)} · ${esc(loc)}</div>
      <div style="font-size:11px;color:#4b5563;">Coach: ${esc(team.coach || 'Unassigned')}</div>
    `;
    const editBtn = card.querySelector('.cp-card-edit-btn');
    if (editBtn) {
      editBtn.addEventListener('mousedown', (e) => e.stopPropagation());
      editBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openCoachPracticeModal({ teamId: team.id, coachName: team.coach });
      });
    }
    return card;
  }

  function syncAllTeamsAndCoachesNow() {
    if (typeof state === 'undefined' || !Array.isArray(state.teams)) return;
    state.teams.forEach(t => syncTeamPracticeAcrossState(t, t.name));
  }

  function enhanceCoachAndScheduleUI() {
    if (typeof state === 'undefined') return;
    const isAdmin = canEditAdmin();
    syncAllTeamsAndCoachesNow();
    const activeNav = document.querySelector('.nav-item.active, [data-nav].active');
    const navKey = (activeNav && (activeNav.dataset.nav || activeNav.textContent || '')).trim().toLowerCase();

    // 1. Coaches view
    if (navKey.includes('coach')) {
      const coachNames = Array.from(new Set([
        ...((state.coaches || []).map(c => c.name).filter(Boolean)),
        ...((state.teams || []).map(t => t.coach).filter(Boolean))
      ]));

      document.querySelectorAll('table tbody tr, .coach-card').forEach(el => {
        if (el.dataset.cpEnhanced || el.querySelector('table')) return;
        const text = (el.textContent || '').trim();
        const matchedCoach = coachNames.find(name => name && text.includes(name));
        if (!matchedCoach) return;

        el.dataset.cpEnhanced = '1';
        if (isAdmin) {
          el.style.cursor = 'pointer';
          el.title = 'Click to edit coach profile & practice slots';
          el.addEventListener('click', (e) => {
            if (e.target.closest('button, a, input, select')) return;
            openCoachPracticeModal({ coachName: matchedCoach });
          });
        }

        const btnHost = el.querySelector('td:last-child, .actions') || el;
        if (isAdmin && !btnHost.querySelector('.cp-inline-edit-btn')) {
          btnHost.appendChild(makeEditButton('Edit Practice', () => openCoachPracticeModal({ coachName: matchedCoach })));
        }
      });
    }

    // 2. Teams view: show Off-site badge when Day 1 is disabled + Day 2 badge when enabled
    if (navKey.includes('team')) {
      (state.teams || []).forEach(t => {
        document.querySelectorAll('.team-card, .card, table tbody tr').forEach(el => {
          if (el.dataset.cpTeamEditWired || el.querySelector('table')) return;
          if (!(el.textContent || '').includes(t.name)) return;
          if (el.tagName === 'BUTTON' || el.closest('.team-pills')) return;
          el.dataset.cpTeamEditWired = '1';

          const metaHost = el.querySelector('.card-subtitle, .meta, td:nth-child(3)') || el;

          if (!isDay1Enabled(t) && !t.practiceDay2 && !el.querySelector('.cp-team-offsite-badge')) {
            const offBadge = document.createElement('div');
            offBadge.className = 'cp-team-offsite-badge';
            offBadge.style.cssText = 'display:inline-block;margin-top:4px;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:700;background:#f3f4f6;color:#4b5563;border:1px solid #d1d5db;';
            offBadge.textContent = 'Off-site / No Gym Slot';
            metaHost.appendChild(offBadge);
          }

          if (t.practiceDay2 && !el.querySelector('.cp-team-day2-badge')) {
            const badge = document.createElement('div');
            badge.className = 'cp-team-day2-badge';
            badge.style.cssText = 'display:inline-block;margin-top:4px;margin-left:4px;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:700;background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe;';
            badge.textContent = `2nd Practice: ${t.practiceDay2} · ${normalizeTimeLabel(t.practiceTime2 || t.practiceTime || '6:00 PM')}${t.halfCourt2 ? ` (${t.halfCourt2})` : ''}`;
            metaHost.appendChild(badge);
          }

          if (t.practiceDay2) {
            el.querySelectorAll('div, p, span').forEach(sub => {
              if (sub.children.length === 0 && !sub.dataset.cpSubDay2) {
                const txt = (sub.textContent || '').trim();
                if (txt.includes("St. Ann's Gym") && txt.includes(t.practiceDay || 'Mon') && !txt.includes(t.practiceDay2)) {
                  sub.dataset.cpSubDay2 = '1';
                  sub.textContent = `${txt}  •  Practice 2: ${t.practiceDay2} · ${normalizeTimeLabel(t.practiceTime2 || t.practiceTime || '6:00 PM')} · ${t.practiceLocation2 || t.practiceLocation || "St. Ann's Gym"}`;
                }
              }
            });
          }

          const actionHost = el.querySelector('.actions, .card-head, td:last-child');
          if (actionHost && !actionHost.querySelector('.cp-inline-edit-btn')) {
            actionHost.appendChild(makeEditButton('Edit Practice', () => openCoachPracticeModal({ teamId: t.id, coachName: t.coach })));
          }
        });
      });
    }

    // 3. Schedule / Calendar view
    if (navKey.includes('schedule') || navKey.includes('calendar')) {
      const teams = state.teams || [];
      const timeSlots = getActiveTimeSlots();
      let draggedPayload = null;

      document.querySelectorAll('button').forEach(btn => {
        if (btn.dataset.cpTopEditWired) return;
        if (/^edit practice$/i.test((btn.textContent || '').trim())) {
          btn.dataset.cpTopEditWired = '1';
          btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const firstTeam = teams[0];
            openCoachPracticeModal(firstTeam ? { teamId: firstTeam.id, coachName: firstTeam.coach } : {});
          };
        }
      });

      const dayColumns = [];
      document.querySelectorAll('div, section, td').forEach(col => {
        if (col.children.length < 2) return;
        const headerText = (col.firstElementChild && col.firstElementChild.textContent || '').trim().toUpperCase();
        const matchedDay = DAYS.find(d => headerText.startsWith(d.toUpperCase()));
        if (matchedDay && col.offsetHeight >= 200 && col.offsetWidth <= 360) {
          dayColumns.push({ el: col, day: matchedDay });
        }
      });

      dayColumns.forEach(({ el: col, day }) => {
        if (col.dataset.timeGridBuilt) return;
        col.dataset.timeGridBuilt = '1';

        const headerEl = col.firstElementChild;
        const nonPracticeNodes = [];

        Array.from(col.children).slice(1).forEach(child => {
          const txt = (child.textContent || '').trim();
          if (/No scheduled slots/i.test(txt) || /PRACTICE/i.test(txt)) {
            child.remove();
          } else {
            nonPracticeNodes.push(child);
          }
        });

        const gridWrap = document.createElement('div');
        gridWrap.className = 'cp-day-timeslots';
        gridWrap.style.cssText = 'display:flex;flex-direction:column;gap:8px;margin-top:8px;';

        timeSlots.forEach(slotTime => {
          const bookings = getSlotBookings(day, slotTime, null, null);
          const count = bookings.length;

          const zone = document.createElement('div');
          zone.className = 'cp-timeslot-zone';
          zone.dataset.day = day;
          zone.dataset.time = slotTime;

          const borderColor = count >= 2 ? '#b8943a' : count === 1 ? '#d7bd78' : '#e2d5b5';
          const bgColor = count >= 2 ? '#faf5e4' : '#fcfbf7';
          zone.style.cssText = `border:1px ${count > 0 ? 'solid' : 'dashed'} ${borderColor};border-radius:8px;padding:6px;background:${bgColor};min-height:54px;transition:all 0.15s ease;`;

          let statusTag = '<span class="cp-drop-hint" style="font-weight:600;color:#b5a47a;font-size:9px;">Drop here (2 half-courts)</span>';
          if (count === 1) {
            statusTag = '<span style="font-weight:700;color:#9a7b2c;font-size:9px;">1/2 Courts · +1 Half-Court</span>';
          } else if (count === 2) {
            statusTag = '<span style="font-weight:700;color:#15803d;font-size:9px;">2/2 Half-Courts Paired</span>';
          } else if (count > 2) {
            statusTag = `<span style="font-weight:700;color:#b91c1c;font-size:9px;">${count}/2 Overbooked</span>`;
          }

          const timeLabel = document.createElement('div');
          timeLabel.style.cssText = 'font-size:10px;font-weight:800;letter-spacing:.04em;color:#8c7335;text-transform:uppercase;margin-bottom:4px;display:flex;justify-content:space-between;align-items:center;gap:4px;';
          timeLabel.innerHTML = `<span>${slotTime}</span>${statusTag}`;
          zone.appendChild(timeLabel);

          bookings.forEach((b, cardIdx) => {
            const t = b.team;
            const sNum = b.slotNum;
            const cardEl = buildPracticeCardElement(t, sNum, slotTime);
            cardEl.dataset.cpEnhanced = '1';
            cardEl.draggable = true;
            cardEl.style.cursor = 'grab';
            cardEl.style.marginTop = '4px';
            cardEl.title = `Drag ${t.name} (Practice ${sNum}) to any date & time slot, or click Edit`;

            const courtBadgeText = b.halfCourt || (count >= 2 ? (cardIdx === 0 ? 'Half Court A' : 'Half Court B') : '');
            if (courtBadgeText) {
              const pill = document.createElement('div');
              pill.className = 'cp-court-pill';
              pill.style.cssText = 'display:inline-block;margin-top:4px;padding:1px 6px;border-radius:4px;font-size:10px;font-weight:700;background:#f3e8c8;color:#7a5e1a;border:1px solid #dfc88a;';
              pill.textContent = courtBadgeText;
              cardEl.appendChild(pill);
            }

            cardEl.addEventListener('dragstart', (e) => {
              draggedPayload = { teamId: String(t.id), slotNum: sNum };
              e.dataTransfer.setData('text/plain', JSON.stringify(draggedPayload));
              e.dataTransfer.effectAllowed = 'move';
              cardEl.style.opacity = '0.5';
            });

            cardEl.addEventListener('dragend', () => {
              cardEl.style.opacity = '1';
              draggedPayload = null;
              document.querySelectorAll('.cp-timeslot-zone').forEach(z => {
                z.style.outline = '';
              });
            });

            cardEl.addEventListener('click', (e) => {
              if (e.target.closest('button, a, input, select')) return;
              e.stopPropagation();
              openCoachPracticeModal({ teamId: t.id, coachName: t.coach });
            });

            zone.appendChild(cardEl);
          });

          zone.addEventListener('dragover', (e) => {
            if (!draggedPayload && !e.dataTransfer.types.includes('text/plain')) return;
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            zone.style.outline = '2px dashed #c59b27';
          });

          zone.addEventListener('dragleave', (e) => {
            if (!zone.contains(e.relatedTarget)) {
              zone.style.outline = '';
            }
          });

          zone.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            zone.style.outline = '';
            let payload = draggedPayload;
            if (!payload) {
              try {
                const raw = e.dataTransfer.getData('text/plain');
                payload = raw.startsWith('{') ? JSON.parse(raw) : { teamId: raw, slotNum: 1 };
              } catch (_) {}
            }
            draggedPayload = null;
            if (payload && payload.teamId) {
              moveTeamPracticeSlot(payload.teamId, day, slotTime, payload.slotNum || 1);
            }
          });

          gridWrap.appendChild(zone);
        });

        col.innerHTML = '';
        if (headerEl) col.appendChild(headerEl);
        nonPracticeNodes.forEach(n => col.appendChild(n));
        col.appendChild(gridWrap);
      });

      // Enhance Recurring Team Practice Slots table rows below
      document.querySelectorAll('table tbody tr').forEach(tr => {
        if (tr.dataset.cpRowDragWired) return;
        const txt = (tr.textContent || '').trim();
        const matchedTeam = teams.find(t => t.name && txt.includes(t.name));
        if (!matchedTeam) return;
        tr.dataset.cpRowDragWired = '1';
        tr.draggable = true;
        tr.style.cursor = 'pointer';
        tr.title = `Click Edit to toggle Day 1 / Day 2 / Off-site or drag ${matchedTeam.name} onto a calendar slot above`;

        const dayCell = tr.querySelector('td:nth-child(3)') || tr.querySelector('td:nth-child(2)');
        if (dayCell) {
          if (!isDay1Enabled(matchedTeam) && !matchedTeam.practiceDay2) {
            dayCell.innerHTML = '<span style="display:inline-block;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:700;background:#f3f4f6;color:#4b5563;border:1px solid #d1d5db;">Off-site / No Gym Slot</span>';
          } else if (!isDay1Enabled(matchedTeam) && matchedTeam.practiceDay2) {
            dayCell.innerHTML = `<span style="font-size:12px;font-weight:700;color:#1d4ed8;">Day 2 Only: ${matchedTeam.practiceDay2} ${normalizeTimeLabel(matchedTeam.practiceTime2 || '6:00 PM')}${matchedTeam.halfCourt2 ? ` (${matchedTeam.halfCourt2})` : ''}</span>`;
          } else if (matchedTeam.practiceDay2 && !dayCell.querySelector('.cp-day2-pill')) {
            const p2 = document.createElement('div');
            p2.className = 'cp-day2-pill';
            p2.style.cssText = 'font-size:11px;font-weight:700;color:#1d4ed8;margin-top:2px;';
            p2.textContent = `+ Day 2: ${matchedTeam.practiceDay2} ${normalizeTimeLabel(matchedTeam.practiceTime2 || matchedTeam.practiceTime || '6:00 PM')}${matchedTeam.halfCourt2 ? ` (${matchedTeam.halfCourt2})` : ''}`;
            dayCell.appendChild(p2);
          }
        }

        const lastCell = tr.querySelector('td:last-child');
        if (lastCell && !lastCell.querySelector('.cp-inline-edit-btn')) {
          lastCell.appendChild(makeEditButton('Edit / Slots', () => openCoachPracticeModal({ teamId: matchedTeam.id, coachName: matchedTeam.coach })));
        }

        tr.addEventListener('click', (e) => {
          if (e.target.closest('button, a, input, select')) return;
          openCoachPracticeModal({ teamId: matchedTeam.id, coachName: matchedTeam.coach });
        });

        tr.addEventListener('dragstart', (e) => {
          draggedPayload = { teamId: String(matchedTeam.id), slotNum: 1 };
          e.dataTransfer.setData('text/plain', JSON.stringify(draggedPayload));
          e.dataTransfer.effectAllowed = 'move';
        });
        tr.addEventListener('dragend', () => {
          draggedPayload = null;
        });
      });
    }
  }


    // 4. Coach Portal / Logged-in Coach Dashboard: always display live synced practice slots for their team(s)
    const activeCoachName = (state.currentCoach && (state.currentCoach.name || state.currentCoach)) ||
      (state.session && state.session.coachName) ||
      (state.role && state.role !== 'admin' && state.role !== 'Master Admin' ? state.role : '');
    if (activeCoachName && !isAdmin) {
      const myTeams = getCoachTeams(String(activeCoachName));
      const mainHost = document.querySelector('main, .main, #app, .content');
      if (myTeams.length && mainHost && !document.getElementById('cpLoggedInCoachScheduleBanner')) {
        const banner = document.createElement('div');
        banner.id = 'cpLoggedInCoachScheduleBanner';
        banner.style.cssText = 'margin:12px 0 16px;padding:14px 16px;border-radius:12px;background:#fcfaf3;border:1px solid #d7bd78;';
        banner.innerHTML = `
          <div style="font-size:11px;font-weight:800;letter-spacing:.06em;color:#9a7b2c;text-transform:uppercase;margin-bottom:6px;">
            Official Published Practice Schedule — Coach ${esc(String(activeCoachName))}
          </div>
          ${myTeams.map(mt => `
            <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;padding:6px 0;border-top:1px solid #eee6d3;">
              <strong>${esc(mt.name)} <span style="font-weight:400;color:#6b7280;">(${esc(mt.division || '')})</span></strong>
              <span style="font-weight:700;color:#111827;">${esc(mt.practiceSummary || 'Off-site / No Gym Slot')} · ${esc(mt.practiceLocation || "St. Ann's Gym")}</span>
            </div>
          `).join('')}
        `;
        const firstHeading = mainHost.querySelector('h1, h2, .page-header');
        if (firstHeading && firstHeading.parentNode) {
          firstHeading.parentNode.insertBefore(banner, firstHeading.nextSibling);
        } else {
          mainHost.prepend(banner);
        }
      }
    }

  if (typeof render === 'function') {
    const origRender = render;
    window.render = render = function patchedRender() {
      const res = origRender.apply(this, arguments);
      enhanceCoachAndScheduleUI();
      return res;
    };
  }
  setTimeout(enhanceCoachAndScheduleUI, 150);
})();

/* === Admin Individual Delete & Go-Live Demo Data Reset === */
(function initAdminDeleteAndGoLive() {
  if (window.__adminDeleteModuleLoaded) return;
  window.__adminDeleteModuleLoaded = true;

  function canDeleteAdmin() {
    try {
      return typeof isMaster === 'function' ? isMaster() : true;
    } catch (_) {
      return true;
    }
  }

  function persistAndRefresh(title, msg) {
    if (typeof state === 'object' && state) {
      state.demoCleared = true;
    }
    if (typeof save === 'function') save();
    if (typeof render === 'function') render();
    if (typeof toast === 'function' && title) toast(title, msg || '');
  }

  // Delete helpers by record type
  window.adminDeleteItem = function adminDeleteItem(type, id, label) {
    if (!canDeleteAdmin() || typeof state !== 'object' || !state) return;
    const display = label || type;
    if (!confirm(`Delete ${display}? This cannot be undone.`)) return;

    if (type === 'team') {
      const team = (state.teams || []).find(t => String(t.id) === String(id));
      state.teams = (state.teams || []).filter(t => String(t.id) !== String(id));
      if (team && Array.isArray(state.registrations)) {
        const unassign = confirm(`Also delete all rostered players on "${team.name}"?\n\nClick OK to delete those players too, or Cancel to keep them as unassigned registrations.`);
        if (unassign) {
          state.registrations = state.registrations.filter(r => String(r.teamId) !== String(id));
        } else {
          state.registrations.forEach(r => { if (String(r.teamId) === String(id)) r.teamId = ''; });
        }
      }
      if (typeof activeWorkspaceTeamId !== 'undefined' && String(activeWorkspaceTeamId) === String(id)) {
        activeWorkspaceTeamId = null;
      }
      persistAndRefresh('Team deleted', `Removed ${display}.`);
    } else if (type === 'registration') {
      state.registrations = (state.registrations || []).filter(r => String(r.id) !== String(id));
      persistAndRefresh('Player deleted', `Removed ${display}.`);
    } else if (type === 'coach') {
      const coach = (state.coaches || []).find(c => String(c.id) === String(id));
      state.coaches = (state.coaches || []).filter(c => String(c.id) !== String(id));
      if (coach && coach.name && Array.isArray(state.teams)) {
        state.teams.forEach(t => {
          if (String(t.coach || '').trim().toLowerCase() === coach.name.trim().toLowerCase()) {
            t.coach = 'Unassigned';
          }
        });
      }
      persistAndRefresh('Coach deleted', `Removed ${display}.`);
    } else if (type === 'schedule') {
      ['schedule', 'events', 'games', 'practices'].forEach(k => {
        if (Array.isArray(state[k])) {
          state[k] = state[k].filter(ev => String(ev.id) !== String(id));
        }
      });
      persistAndRefresh('Schedule item deleted', `Removed ${display}.`);
    } else if (type === 'volunteer') {
      ['volunteers', 'volunteerSlots', 'shifts'].forEach(k => {
        if (Array.isArray(state[k])) {
          state[k] = state[k].filter(v => String(v.id) !== String(id));
        }
      });
      persistAndRefresh('Volunteer deleted', `Removed ${display}.`);
    } else if (type === 'communication') {
      ['communications', 'announcements', 'messages'].forEach(k => {
        if (Array.isArray(state[k])) {
          state[k] = state[k].filter(m => String(m.id) !== String(id));
        }
      });
      persistAndRefresh('Message deleted', `Removed ${display}.`);
    }
  };

  window.adminBulkClear = function adminBulkClear(scope) {
    if (!canDeleteAdmin() || typeof state !== 'object' || !state) return;

    const labels = {
      all: 'ALL demo teams, players/registrations, coaches, schedule events, volunteers, and messages (keeping your Seasons & Sports setup)',
      registrations: 'ALL players and registrations',
      teams: 'ALL teams (and unassign rostered players)',
      coaches: 'ALL coaches',
      schedule: 'ALL scheduled games & events',
      volunteers: 'ALL volunteer entries'
    };

    if (!confirm(`⚠️ Go-Live Data Wipe:\n\nAre you sure you want to permanently delete ${labels[scope] || scope}?`)) return;

    if (scope === 'all' || scope === 'registrations') {
      state.registrations = [];
    }
    if (scope === 'all' || scope === 'teams') {
      state.teams = [];
      if (typeof activeWorkspaceTeamId !== 'undefined') activeWorkspaceTeamId = null;
      if (scope === 'teams' && Array.isArray(state.registrations)) {
        state.registrations.forEach(r => { r.teamId = ''; });
      }
    }
    if (scope === 'all' || scope === 'coaches') {
      state.coaches = [];
      if (scope === 'coaches' && Array.isArray(state.teams)) {
        state.teams.forEach(t => { t.coach = 'Unassigned'; });
      }
    }
    if (scope === 'all' || scope === 'schedule') {
      ['schedule', 'events', 'games', 'practices'].forEach(k => {
        if (Array.isArray(state[k])) state[k] = [];
      });
    }
    if (scope === 'all' || scope === 'volunteers') {
      ['volunteers', 'volunteerSlots', 'shifts'].forEach(k => {
        if (Array.isArray(state[k])) state[k] = [];
      });
    }
    if (scope === 'all') {
      ['communications', 'announcements', 'messages'].forEach(k => {
        if (Array.isArray(state[k])) state[k] = [];
      });
    }

    persistAndRefresh('Demo data cleared', 'Ready for live season entry.');
  };

  function makeDeleteBtn(type, id, label) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn small danger admin-row-del-btn';
    btn.style.cssText = 'margin-left:6px;background:#fee2e2;color:#b91c1c;border:1px solid #fecaca;';
    btn.textContent = 'Delete';
    btn.onclick = (e) => {
      e.stopPropagation();
      adminDeleteItem(type, id, label);
    };
    return btn;
  }

  function injectDeleteControls() {
    if (!canDeleteAdmin() || typeof state !== 'object' || !state) return;

    const activeNav = document.querySelector('.nav-item.active, [data-nav].active');
    const navKey = (activeNav && (activeNav.dataset.nav || activeNav.textContent || '')).trim().toLowerCase();

    // 1. Teams view: add Delete button to team cards/rows
    if (navKey.includes('team')) {
      (state.teams || []).forEach(t => {
        document.querySelectorAll('.team-card, .card, table tbody tr').forEach(el => {
          if (el.dataset.delWired || el.querySelector('table')) return;
          const txt = el.textContent || '';
          if (!t.name || !txt.includes(t.name)) return;
          // Skip top team switcher pills
          if (el.tagName === 'BUTTON' || el.closest('.team-pills')) return;
          const host = el.querySelector('.actions, .card-head, td:last-child');
          if (!host || host.querySelector('.admin-row-del-btn')) return;
          el.dataset.delWired = '1';
          host.appendChild(makeDeleteBtn('team', t.id, t.name));
        });
      });
    }

    // 2. Registrations view: add Delete button to each player row
    if (navKey.includes('registrat')) {
      document.querySelectorAll('table tbody tr').forEach(tr => {
        if (tr.dataset.delWired) return;
        const txt = tr.textContent || '';
        const match = (state.registrations || []).find(r => r.name && txt.includes(r.name));
        if (!match) return;
        const cell = tr.querySelector('td:last-child');
        if (!cell || cell.querySelector('.admin-row-del-btn')) return;
        tr.dataset.delWired = '1';
        cell.appendChild(makeDeleteBtn('registration', match.id, match.name));
      });
    }

    // 3. Coaches view: add Delete button to each coach row/card
    if (navKey.includes('coach')) {
      document.querySelectorAll('table tbody tr, .coach-card, .card').forEach(el => {
        if (el.dataset.delWired || el.querySelector('table')) return;
        const txt = el.textContent || '';
        const match = (state.coaches || []).find(c => c.name && txt.includes(c.name));
        if (!match) return;
        const host = el.querySelector('td:last-child, .actions, .card-head');
        if (!host || host.querySelector('.admin-row-del-btn')) return;
        el.dataset.delWired = '1';
        host.appendChild(makeDeleteBtn('coach', match.id, match.name));
      });
    }

    // 4. Schedule view: add Delete button to scheduled games/events
    if (navKey.includes('schedule') || navKey.includes('calendar')) {
      const schedLists = ['schedule', 'events', 'games', 'practices'].flatMap(k => Array.isArray(state[k]) ? state[k] : []);
      document.querySelectorAll('table tbody tr, .schedule-item, .event-card, .card').forEach(el => {
        if (el.dataset.delWired || el.querySelector('table')) return;
        const txt = el.textContent || '';
        const match = schedLists.find(ev => (ev.title && txt.includes(ev.title)) || (ev.home && ev.away && txt.includes(ev.home) && txt.includes(ev.away)));
        if (!match) return;
        const host = el.querySelector('td:last-child, .actions, .card-head');
        if (!host || host.querySelector('.admin-row-del-btn')) return;
        el.dataset.delWired = '1';
        host.appendChild(makeDeleteBtn('schedule', match.id, match.title || `${match.home} vs ${match.away}`));
      });
    }

    // 5. Volunteers view: add Delete button to volunteer rows
    if (navKey.includes('volunteer')) {
      const volLists = ['volunteers', 'volunteerSlots', 'shifts'].flatMap(k => Array.isArray(state[k]) ? state[k] : []);
      document.querySelectorAll('table tbody tr, .card').forEach(el => {
        if (el.dataset.delWired || el.querySelector('table')) return;
        const txt = el.textContent || '';
        const match = volLists.find(v => (v.name && txt.includes(v.name)) || (v.role && txt.includes(v.role)));
        if (!match) return;
        const host = el.querySelector('td:last-child, .actions, .card-head');
        if (!host || host.querySelector('.admin-row-del-btn')) return;
        el.dataset.delWired = '1';
        host.appendChild(makeDeleteBtn('volunteer', match.id, match.name || match.role));
      });
    }

    // 6. Settings view: inject "Go Live — Clear Demo Data" management card
    if (navKey.includes('setting')) {
      const mainHost = document.querySelector('#view, main, .main-content, .content');
      if (mainHost && !document.getElementById('goLiveResetCard')) {
        const regCount = (state.registrations || []).length;
        const teamCount = (state.teams || []).length;
        const coachCount = (state.coaches || []).length;
        const schedCount = ['schedule', 'events', 'games'].reduce((n, k) => n + (Array.isArray(state[k]) ? state[k].length : 0), 0);
        const volCount = ['volunteers', 'volunteerSlots', 'shifts'].reduce((n, k) => n + (Array.isArray(state[k]) ? state[k].length : 0), 0);

        const card = document.createElement('section');
        card.id = 'goLiveResetCard';
        card.className = 'card';
        card.style.cssText = 'margin-top:20px;border:1px solid #fca5a5;background:#fffbfb;';
        card.innerHTML = `
          <div class="card-head" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
            <div>
              <span class="eyebrow" style="color:#b91c1c;">GO-LIVE DATA MANAGEMENT</span>
              <h2 class="card-title" style="margin:2px 0;">Clear Demo Data & Start Live Season</h2>
              <p class="card-subtitle" style="margin:0;">Wipe sample records permanently while preserving your active season, divisions, and registration fee settings.</p>
            </div>
            <button type="button" class="btn" id="btnWipeAllDemo" style="background:#b91c1c;color:#fff;font-weight:700;">🗑 Wipe All Demo Data (Go Live)</button>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:14px;padding-top:14px;border-top:1px solid #fee2e2;">
            <button type="button" class="btn small" data-bulk-clear="registrations" style="border-color:#fca5a5;color:#b91c1c;">Delete All Players/Registrations (${regCount})</button>
            <button type="button" class="btn small" data-bulk-clear="teams" style="border-color:#fca5a5;color:#b91c1c;">Delete All Teams (${teamCount})</button>
            <button type="button" class="btn small" data-bulk-clear="coaches" style="border-color:#fca5a5;color:#b91c1c;">Delete All Coaches (${coachCount})</button>
            <button type="button" class="btn small" data-bulk-clear="schedule" style="border-color:#fca5a5;color:#b91c1c;">Delete All Schedule/Games (${schedCount})</button>
            <button type="button" class="btn small" data-bulk-clear="volunteers" style="border-color:#fca5a5;color:#b91c1c;">Delete All Volunteers (${volCount})</button>
          </div>
        `;
        mainHost.appendChild(card);

        card.querySelector('#btnWipeAllDemo').onclick = () => adminBulkClear('all');
        card.querySelectorAll('[data-bulk-clear]').forEach(btn => {
          btn.onclick = () => adminBulkClear(btn.getAttribute('data-bulk-clear'));
        });
      }
    }
  }

  if (typeof render === 'function') {
    const prevRender = render;
    window.render = render = function wrappedDeleteRender() {
      const out = prevRender.apply(this, arguments);
      injectDeleteControls();
      return out;
    };
  }
  setTimeout(injectDeleteControls, 150);
})();

/* === Ensure 8:00 PM Option in Practice Time Dropdowns === */
(function __ensure8PmOption() {
  const observer = new MutationObserver(() => {
    document.querySelectorAll("select").forEach(sel => {
      const opts = Array.from(sel.options).map(o => o.value.trim().toLowerCase());
      if ((opts.includes("6:00 pm") || opts.includes("7:00 pm")) && !opts.includes("8:00 pm")) {
        const opt = document.createElement("option");
        opt.value = "8:00 PM";
        opt.textContent = "8:00 PM";
        sel.appendChild(opt);
      }
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();


/* === Staging-to-Production Approval & Live Cloud Sync === */
(function initStagingToProdSync() {
  if (window.__stagingProdSyncLoaded) return;
  window.__stagingProdSyncLoaded = true;

  const PROD_ORIGIN = 'https://stanns.opp-solutions.com';
  const isProdHost = window.location.hostname === 'stanns.opp-solutions.com';

  // 1. On Production (stanns.opp-solutions.com): safely merge remote KV state without wiping local work
  if (isProdHost) {
    fetch('/api/state', { cache: 'no-store' })
      .then(r => r.ok ? r.json() : null)
      .then(remoteData => {
        if (remoteData && typeof remoteData === 'object' && Object.keys(remoteData).length > 0) {
          let changed = false;
          Object.entries(remoteData).forEach(([k, v]) => {
            if (k === '__cyo_publish_key') return;
            const nextStr = typeof v === 'string' ? v : JSON.stringify(v);
            if (localStorage.getItem(k) !== nextStr) {
              localStorage.setItem(k, nextStr);
              changed = true;
            }
          });
          if (changed && !sessionStorage.getItem('__cyo_reloaded_after_merge')) {
            sessionStorage.setItem('__cyo_reloaded_after_merge', '1');
            location.reload();
          } else {
            sessionStorage.removeItem('__cyo_reloaded_after_merge');
          }
        }
      })
      .catch(err => console.warn('Cloud state check skipped:', err));

    // Auto-sync work entered on the live website back to /api/live-merge whenever save() runs
    if (typeof save === 'function' && !window.__liveAutoMergeWired) {
      window.__liveAutoMergeWired = true;
      const origSave = save;
      let syncTimer = null;
      window.save = save = function patchedLiveSave() {
        const res = origSave.apply(this, arguments);
        clearTimeout(syncTimer);
        syncTimer = setTimeout(() => {
          const snapshot = {};
          for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && !k.startsWith('__cyo_')) snapshot[k] = localStorage.getItem(k);
          }
          fetch('/api/live-merge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(snapshot)
          }).catch(() => {});
        }, 600);
        return res;
      };
    }
  }

  // 2. Publish helper: sends exact localStorage snapshot from staging to stanns.opp-solutions.com
  window.approveAndPublishToProduction = async function approveAndPublishToProduction() {
    if (!confirm('Approve all current rosters, schedules, court pairings, and payments and publish them live to https://stanns.opp-solutions.com/?')) {
      return;
    }
    let key = localStorage.getItem('__cyo_publish_key') || '';
    if (!key) {
      key = prompt('Enter your Production Publish Key (set via wrangler secret put PUBLISH_KEY):') || '';
      if (!key) return;
      localStorage.setItem('__cyo_publish_key', key.trim());
    }

    const payload = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k === '__cyo_publish_key') continue;
      payload[k] = localStorage.getItem(k);
    }

    try {
      const res = await fetch(`${PROD_ORIGIN}/api/state`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key.trim()}`
        },
        body: JSON.stringify(payload)
      });
      if (res.status === 401) {
        localStorage.removeItem('__cyo_publish_key');
        alert('Invalid Publish Key. Please try again with the PUBLISH_KEY configured on Cloudflare.');
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      if (typeof toast === 'function') {
        toast('Published Live!', 'All approved changes are now live on https://stanns.opp-solutions.com/.');
      } else {
        alert('Published Live! All approved changes are now live on https://stanns.opp-solutions.com/.');
      }
    } catch (err) {
      alert('Publish failed: ' + err.message);
    }
  };

  function injectPublishButtons() {
    if (isProdHost) return;
    // Add Approve & Publish Live button inside Settings
    const settingsCard = document.getElementById('btnWipeAllDemo') && document.getElementById('btnWipeAllDemo').parentElement;
    if (settingsCard && !document.getElementById('btnApprovePublishLive')) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.id = 'btnApprovePublishLive';
      btn.className = 'btn gold';
      btn.style.cssText = 'font-weight:800;background:#15803d;color:#fff;border-color:#166534;';
      btn.textContent = '✓ Approve & Publish Live to opp-solutions.com';
      btn.onclick = window.approveAndPublishToProduction;
      settingsCard.prepend(btn);
    }
  }

  if (typeof render === 'function') {
    const origRender = render;
    window.render = render = function patchedPublishRender() {
      const r = origRender.apply(this, arguments);
      injectPublishButtons();
      return r;
    };
  }
  setTimeout(injectPublishButtons, 200);
})();


/* === Default $80 Registration Fee & Payment Due Status === */
(function initDefaultFeeAndStatus() {
  if (window.__defaultFee80Applied) return;
  window.__defaultFee80Applied = true;

  function applyFee80Defaults() {
    try {
      if (typeof state === 'undefined' || !state) return;
      let changed = false;

      if (!localStorage.getItem('__cyo_fee80_migrated')) {
        if (state.seasonFee === undefined || state.seasonFee === null || Number(state.seasonFee) === 100) {
          state.seasonFee = 80;
          changed = true;
        }
        if (state.registrationFee === undefined || state.registrationFee === null || Number(state.registrationFee) === 100) {
          state.registrationFee = 80;
          changed = true;
        }
        if (Array.isArray(state.seasons)) {
          state.seasons.forEach(s => {
            if (s && (s.fee === undefined || s.fee === null || Number(s.fee) === 100)) {
              s.fee = 80;
              changed = true;
            }
          });
        }
        localStorage.setItem('__cyo_fee80_migrated', '1');
      }

      const fee = Number(state.seasonFee || state.registrationFee || 80);
      ['players', 'registrations', 'athletes'].forEach(key => {
        if (!Array.isArray(state[key])) return;
        state[key].forEach(p => {
          if (!p) return;
          if (p.fee === undefined || p.fee === null || Number(p.fee) === 100) {
            p.fee = fee;
            changed = true;
          }
          if (!p.status) {
            p.status = 'Payment due';
            changed = true;
          }
        });
      });

      if (changed && typeof save === 'function') save();
    } catch (err) {
      console.error('Fee80 migration error:', err);
    }
  }

  function enforcePaymentDueSelectDefaults() {
    document.querySelectorAll('select').forEach(sel => {
      if (sel.dataset.defaultPayDueWired) return;
      const opts = Array.from(sel.options || []);
      const payDueOpt = opts.find(o => /^payment due$/i.test((o.value || o.text || '').trim()));
      if (payDueOpt && !sel.closest('tr')) {
        sel.dataset.defaultPayDueWired = '1';
        if (!sel.value || /^complete$/i.test(sel.value)) {
          sel.value = payDueOpt.value;
        }
      }
    });
  }

  if (typeof render === 'function') {
    const origRender = render;
    window.render = render = function patchedFee80Render() {
      applyFee80Defaults();
      const res = origRender.apply(this, arguments);
      enforcePaymentDueSelectDefaults();
      return res;
    };
  }
  setTimeout(() => {
    applyFee80Defaults();
    enforcePaymentDueSelectDefaults();
  }, 150);
})();

/* === Direct Coach Calendar Practice 2 Fallback === */
(function ensureCoachCalendarHasPractice2() {
  if (window.__coachP2FallbackLoaded) return;
  window.__coachP2FallbackLoaded = true;
  const DAY_KEYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  function injectMissingPractice2Cards() {
    if (typeof state === 'undefined' || !Array.isArray(state.teams)) return;

    // Remove any stray card that was previously placed inside a day header flex row
    document.querySelectorAll('[id^="cp-p2-card-"]').forEach(el => {
      if (!el.parentElement || !el.parentElement.parentElement || el.parentElement.parentElement.children.length < 5) {
        el.remove();
      }
    });

    const headerBtn = Array.from(document.querySelectorAll('button, span'))
      .map(el => (el.textContent || '').trim())
      .find(txt => /^Coach\s+/i.test(txt));
    const coachLabelName = headerBtn ? headerBtn.replace(/^Coach\s+/i, '').trim().toLowerCase() : '';

    let targetTeams = state.teams.filter(t => t && t.practiceDay2);
    if (coachLabelName) {
      const byCoach = targetTeams.filter(t => String(t.coach || '').trim().toLowerCase() === coachLabelName);
      if (byCoach.length) targetTeams = byCoach;
    } else {
      const pageUpper = (document.body.textContent || '').toUpperCase();
      const byPage = targetTeams.filter(t => t.name && pageUpper.includes(t.name.toUpperCase()));
      if (byPage.length) targetTeams = byPage;
    }
    if (!targetTeams.length) return;

    // Only target the 7 outer day column containers (whose parent grid holds the 7 days of the week)
    document.querySelectorAll('div, section, td').forEach(col => {
      if (!col.parentElement || col.parentElement.children.length < 5) return;
      if (col.children.length < 2 || col.offsetWidth < 110 || col.offsetWidth > 420) return;
      if (col.querySelector('.cp-day-timeslots')) return;

      const headTxt = (col.firstElementChild && col.firstElementChild.textContent || '').trim().toUpperCase();
      const dayName = DAY_KEYS.find(d => headTxt.startsWith(d.toUpperCase()));
      if (!dayName) return;

      targetTeams.forEach(t => {
        if (!String(t.practiceDay2 || '').toLowerCase().startsWith(dayName.toLowerCase())) return;
        const cardId = `cp-p2-card-${t.id}-${dayName}`;
        if (col.querySelector(`#${cardId}`)) return;
        if ((col.textContent || '').includes(t.name)) return;

        Array.from(col.children).slice(1).forEach(ch => {
          if (/No scheduled slots/i.test((ch.textContent || '').trim())) ch.remove();
        });

        const time2 = t.practiceTime2 || t.practiceTime || '6:00 PM';
        const loc2 = t.practiceLocation2 || t.practiceLocation || "St. Ann's Gym";
        const court2 = t.halfCourt2 ? ` · ${t.halfCourt2}` : '';

        const card = document.createElement('div');
        card.id = cardId;
        card.style.cssText = 'margin-top:8px;border:1px solid #bfdbfe;border-radius:10px;padding:10px;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,0.04);';
        card.innerHTML = `
          <span style="display:inline-block;padding:2px 7px;border-radius:999px;font-size:10px;font-weight:800;letter-spacing:.04em;background:#eff6ff;color:#1d4ed8;text-transform:uppercase;margin-bottom:4px;">• PRACTICE 2</span>
          <div style="font-weight:700;font-size:13px;color:#111827;">${t.name}</div>
          <div style="font-size:11px;color:#6b7280;margin-top:2px;">${time2} · ${loc2}${court2}</div>
          <div style="font-size:11px;color:#4b5563;margin-top:1px;">Coach: ${t.coach || 'Unassigned'}</div>
        `;
        col.appendChild(card);
      });
    });

    const recHeader = Array.from(document.querySelectorAll('h2, h3, div'))
      .find(el => el.children.length === 0 && /^RECURRING TEAM PRACTICE SLOTS$/i.test((el.textContent || '').trim()));
    if (recHeader && recHeader.parentElement) {
      const recSection = recHeader.parentElement;
      targetTeams.forEach(t => {
        const recId = `cp-rec-p2-${t.id}`;
        if (recSection.querySelector(`#${recId}`)) return;
        const gridHost = recSection.querySelector('div[style*="grid"], .grid') || recSection;
        const time2 = t.practiceTime2 || t.practiceTime || '6:00 PM';
        const loc2 = t.practiceLocation2 || t.practiceLocation || "St. Ann's Gym";
        const slotCard = document.createElement('div');
        slotCard.id = recId;
        slotCard.style.cssText = 'margin-top:10px;border:1px solid #bfdbfe;border-radius:12px;padding:14px 16px;background:#fff;display:flex;justify-content:space-between;align-items:flex-start;';
        slotCard.innerHTML = `
          <div>
            <div style="font-weight:800;font-size:14px;color:#111827;text-transform:uppercase;">${t.name} <span style="font-size:11px;color:#1d4ed8;">(PRACTICE 2)</span></div>
            <div style="font-size:13px;color:#374151;margin-top:4px;"><strong>${time2}</strong> · ${loc2}${t.halfCourt2 ? ` (${t.halfCourt2})` : ''}</div>
            <div style="font-size:12px;color:#6b7280;margin-top:2px;">Coach: ${t.coach || 'Unassigned'} · ${t.division || ''}</div>
          </div>
          <span style="padding:3px 10px;border-radius:999px;font-size:11px;font-weight:800;background:#eff6ff;color:#1d4ed8;text-transform:uppercase;">• ${t.practiceDay2}</span>
        `;
        gridHost.appendChild(slotCard);
      });
    }
  }
  setInterval(injectMissingPractice2Cards, 400);
})();


/* === $80 Fee, Numbered Dashboard Balance & 3-Dots Multi-Select Edit === */
(function initReg3DotsBulkEdit() {
  if (window.__reg3DotsBulkLoaded) return;
  window.__reg3DotsBulkLoaded = true;

  let activeBulkSelection = [];

  function getRegCollection() {
    if (typeof state === 'undefined' || !state) return [];
    if (Array.isArray(state.registrations) && state.registrations.length) return state.registrations;
    if (Array.isArray(state.players) && state.players.length) return state.players;
    if (Array.isArray(state.athletes) && state.athletes.length) return state.athletes;
    return Array.isArray(state.registrations) ? state.registrations : [];
  }

  function migrateFeesTo80Only() {
    if (typeof state === 'undefined' || !state) return;
    let changed = false;

    if (state.seasonFee === undefined || state.seasonFee === null || Number(state.seasonFee) === 100) {
      state.seasonFee = 80;
      changed = true;
    }
    if (state.registrationFee === undefined || state.registrationFee === null || Number(state.registrationFee) === 100) {
      state.registrationFee = 80;
      changed = true;
    }
    if (Array.isArray(state.seasons)) {
      state.seasons.forEach(s => {
        if (s && (s.fee === undefined || s.fee === null || Number(s.fee) === 100)) {
          s.fee = 80;
          changed = true;
        }
      });
    }

    ['registrations', 'players', 'athletes'].forEach(key => {
      if (!Array.isArray(state[key])) return;
      state[key].forEach(item => {
        if (!item) return;
        if (item.fee === undefined || item.fee === null || Number(item.fee) === 100) {
          item.fee = 80;
          changed = true;
        }
      });
    });

    if (changed && typeof save === 'function') {
      save();
    }
  }

  function isRecordPaid(r) {
    if (!r) return false;
    const payField = String(r.paymentStatus || r.payment || r.regPayment || '').trim().toLowerCase();
    if (payField) {
      return payField === 'paid' || payField === 'complete' || payField === 'completed';
    }
    if (r.paid === true || r.regPaid === true) return true;
    const st = String(r.status || '').trim().toLowerCase();
    return st === 'paid';
  }

  function computeRegistrationMetrics() {
    const list = getRegCollection();
    const activeSeason = (typeof state !== 'undefined' && state && (state.activeSeason || state.season)) || '';
    const filtered = activeSeason
      ? list.filter(r => !r.season || String(r.season) === String(activeSeason))
      : list;

    let totalCount = 0;
    let paidCount = 0;
    let dueCount = 0;
    let totalExpected = 0;
    let totalCollected = 0;
    let totalBalanceDue = 0;

    filtered.forEach(r => {
      if (!r) return;
      totalCount += 1;
      const fee = 80;
      totalExpected += fee;
      if (isRecordPaid(r)) {
        paidCount += 1;
        totalCollected += fee;
      } else {
        dueCount += 1;
        totalBalanceDue += fee;
      }
    });

    return { totalCount, paidCount, dueCount, totalExpected, totalCollected, totalBalanceDue };
  }

  // Render Numbered Balance Card on Season Overview Dashboard
  function renderDashboardNumberedBalance() {
    const isOverview = !!Array.from(document.querySelectorAll('h1, h2, .page-title'))
      .find(el => /SEASON OVERVIEW/i.test((el.textContent || '').trim()));
    if (!isOverview) return;

    const metrics = computeRegistrationMetrics();
    let card = document.getElementById('cpDashboardBalanceCard');
    if (!card) {
      const targetAnchor = Array.from(document.querySelectorAll('div, section'))
        .find(el => el.children.length >= 2 && /REGISTERED ATHLETES/i.test((el.textContent || '').trim()) && el.offsetWidth > 200 && el.offsetWidth < 900);
      if (!targetAnchor || !targetAnchor.parentElement) return;

      card = document.createElement('div');
      card.id = 'cpDashboardBalanceCard';
      card.style.cssText = 'margin:14px 0;padding:18px 20px;border-radius:16px;background:#fff;border:1px solid #e6dcc2;box-shadow:0 1px 3px rgba(0,0,0,0.04);';
      targetAnchor.parentElement.insertBefore(card, targetAnchor.nextSibling);
    }

    const sig = JSON.stringify(metrics);
    if (card.dataset.sig === sig) return;
    card.dataset.sig = sig;

    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <span style="font-size:11px;font-weight:800;letter-spacing:.08em;color:#9a7b2c;text-transform:uppercase;">Registration Balance ($80 / Athlete)</span>
        <span style="font-size:11px;font-weight:700;padding:2px 8px;border-radius:999px;background:${metrics.totalBalanceDue > 0 ? '#fef2f2' : '#f0fdf4'};color:${metrics.totalBalanceDue > 0 ? '#b91c1c' : '#15803d'};border:1px solid ${metrics.totalBalanceDue > 0 ? '#fecaca' : '#bbf7d0'};">
          ${metrics.dueCount} Due · ${metrics.paidCount} Paid
        </span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;">
        <div style="padding:10px 12px;border-radius:10px;background:#fef2f2;border:1px solid #fecaca;">
          <div style="font-size:11px;font-weight:700;color:#991b1b;text-transform:uppercase;">Balance Due</div>
          <div style="font-size:26px;font-weight:800;color:#b91c1c;line-height:1.15;margin-top:2px;">$${metrics.totalBalanceDue.toLocaleString()}</div>
          <div style="font-size:11px;color:#7f1d1d;margin-top:2px;">${metrics.dueCount} unpaid athlete${metrics.dueCount === 1 ? '' : 's'}</div>
        </div>
        <div style="padding:10px 12px;border-radius:10px;background:#f0fdf4;border:1px solid #bbf7d0;">
          <div style="font-size:11px;font-weight:700;color:#166534;text-transform:uppercase;">Collected</div>
          <div style="font-size:26px;font-weight:800;color:#15803d;line-height:1.15;margin-top:2px;">$${metrics.totalCollected.toLocaleString()}</div>
          <div style="font-size:11px;color:#14532d;margin-top:2px;">${metrics.paidCount} paid athlete${metrics.paidCount === 1 ? '' : 's'}</div>
        </div>
        <div style="padding:10px 12px;border-radius:10px;background:#fcfaf3;border:1px solid #e6dcc2;">
          <div style="font-size:11px;font-weight:700;color:#7a5e1a;text-transform:uppercase;">Total Season Billed</div>
          <div style="font-size:26px;font-weight:800;color:#111827;line-height:1.15;margin-top:2px;">$${metrics.totalExpected.toLocaleString()}</div>
          <div style="font-size:11px;color:#6b7280;margin-top:2px;">${metrics.totalCount} total @ $80</div>
        </div>
      </div>
    `;
  }

  // Capture all checked rows in the single native checkbox column whenever any "..." button is clicked
  function captureCheckedRegistrations(clickedBtn) {
    const table = clickedBtn.closest('table');
    if (!table || !table.tBodies || !table.tBodies[0]) return [];

    const regList = getRegCollection();
    const checkedRows = Array.from(table.tBodies[0].rows).filter(tr => {
      const cb = tr.querySelector('input[type="checkbox"]');
      return cb && cb.checked;
    });

    // Also include the clicked row itself if user checked multiple rows and clicked "..." on one of them
    const clickedRow = clickedBtn.closest('tr');
    if (checkedRows.length > 0 && clickedRow && !checkedRows.includes(clickedRow)) {
      checkedRows.push(clickedRow);
    }

    if (checkedRows.length <= 1) return [];

    return checkedRows.map(tr => {
      const rowTxt = (tr.textContent || '').toLowerCase();
      const matched = regList.find(item => {
        if (!item) return false;
        const nm = String(item.name || item.athleteName || item.playerName || '').trim().toLowerCase();
        const em = String(item.email || '').trim().toLowerCase();
        return (nm && rowTxt.includes(nm)) && (!em || rowTxt.includes(em));
      }) || regList.find(item => {
        const nm = String(item && (item.name || item.athleteName || item.playerName) || '').trim().toLowerCase();
        return nm && rowTxt.includes(nm);
      });
      return {
        record: matched || null,
        rowText: rowTxt
      };
    }).filter(x => x.record);
  }

  function applyStatusAndPaymentToRecord(rec, newStatus, newPayment) {
    if (!rec) return;
    if (newStatus) rec.status = newStatus;
    if (newPayment) {
      if ('paymentStatus' in rec) rec.paymentStatus = newPayment;
      if ('payment' in rec) rec.payment = newPayment;
      if ('regPayment' in rec) rec.regPayment = newPayment;
      if (!('paymentStatus' in rec) && !('payment' in rec) && !('regPayment' in rec)) {
        rec.paymentStatus = newPayment;
      }
      const isPaid = /^(paid|complete|completed)$/i.test(String(newPayment).trim());
      rec.paid = isPaid;
      rec.regPaid = isPaid;
    }
    rec.fee = 80;

    // Mirror onto matching team roster entries
    const normName = String(rec.name || rec.athleteName || rec.playerName || '').trim().toLowerCase();
    if (normName && typeof state !== 'undefined' && Array.isArray(state.teams)) {
      const isPaid = /^(paid|complete|completed)$/i.test(String(newPayment || rec.paymentStatus || '').trim());
      state.teams.forEach(team => {
        if (!team) return;
        ['roster', 'players', 'athletes', 'members'].forEach(rKey => {
          if (!Array.isArray(team[rKey])) return;
          team[rKey].forEach(m => {
            if (!m || typeof m !== 'object') return;
            const mName = String(m.name || m.athleteName || m.playerName || '').trim().toLowerCase();
            if (mName === normName) {
              if (newStatus) m.status = newStatus;
              if (newPayment) m.paymentStatus = newPayment;
              m.paid = isPaid;
              m.regPaid = isPaid;
              m.fee = 80;
            }
          });
        });
      });
    }
  }

  // Listen in capture phase for clicks on any row's three-dots ("...") button
  if (!window.__reg3DotsClickListener) {
    window.__reg3DotsClickListener = true;
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      const txt = (btn.textContent || '').trim();
      const isThreeDots = txt === '...' || txt === '•••' || txt === '⋯' || btn.querySelector('svg circle');
      if (!isThreeDots || !btn.closest('table')) return;

      activeBulkSelection = captureCheckedRegistrations(btn);
      if (activeBulkSelection.length > 1) {
        setTimeout(() => enhanceOpenRegistrationModal(), 30);
        setTimeout(() => enhanceOpenRegistrationModal(), 150);
      }
    }, true);
  }

  function enhanceOpenRegistrationModal() {
    if (!activeBulkSelection || activeBulkSelection.length <= 1) return;

    // Locate the open REGISTRATION modal by finding the "Save changes" button inside a modal container
    const saveBtn = Array.from(document.querySelectorAll('button'))
      .find(b => /^save changes$/i.test((b.textContent || '').trim()) && b.offsetParent !== null);
    if (!saveBtn) return;

    const modalBox = saveBtn.closest('div[style*="border-radius"], .modal, [role="dialog"]') || saveBtn.parentElement.parentElement;
    if (!modalBox) return;

    // Show clear multi-select banner inside the modal
    if (!modalBox.querySelector('#cpModalBulkBanner')) {
      const banner = document.createElement('div');
      banner.id = 'cpModalBulkBanner';
      banner.style.cssText = 'margin:10px 0 12px;padding:10px 12px;border-radius:10px;background:#fef9c3;border:1px solid #eab308;color:#854d0e;font-size:12px;font-weight:700;';
      const names = activeBulkSelection.map(x => x.record.name || x.record.athleteName || 'Athlete').join(', ');
      banner.innerHTML = `Bulk Edit Active (${activeBulkSelection.length} selected): <span style="font-weight:500;">${names}</span><br><span style="font-size:11px;font-weight:600;">Clicking "Save changes" will update Status &amp; Registration Payment for all ${activeBulkSelection.length} selected athletes.</span>`;
      const headerEl = modalBox.querySelector('h1, h2, h3');
      if (headerEl && headerEl.parentNode) {
        headerEl.parentNode.insertBefore(banner, headerEl.nextSibling);
      } else {
        modalBox.prepend(banner);
      }
    }

    if (!saveBtn.dataset.cpBulkSaveWired) {
      saveBtn.dataset.cpBulkSaveWired = '1';
      saveBtn.addEventListener('click', () => {
        if (!activeBulkSelection || activeBulkSelection.length <= 1) return;

        // Read the STATUS and REGISTRATION PAYMENT dropdowns from the modal
        const selects = Array.from(modalBox.querySelectorAll('select'));
        let chosenStatus = '';
        let chosenPayment = '';

        selects.forEach(sel => {
          const prevLabel = (sel.previousElementSibling && sel.previousElementSibling.textContent || '').trim().toUpperCase();
          const parentTxt = (sel.parentElement && sel.parentElement.textContent || '').trim().toUpperCase();
          if (prevLabel === 'STATUS' || parentTxt.startsWith('STATUS')) {
            chosenStatus = sel.value;
          } else if (prevLabel.includes('REGISTRATION PAYMENT') || parentTxt.startsWith('REGISTRATION PAYMENT')) {
            chosenPayment = sel.value;
          }
        });

        const targets = [...activeBulkSelection];
        activeBulkSelection = [];

        // Let native single-row save finish first, then apply Status & Payment to all selected records
        setTimeout(() => {
          targets.forEach(item => {
            applyStatusAndPaymentToRecord(item.record, chosenStatus, chosenPayment);
          });
          if (typeof save === 'function') save();
          if (typeof render === 'function') render();
          if (typeof toast === 'function') {
            toast('Bulk Update Saved', `Updated ${targets.length} selected athletes.`);
          }
        }, 40);
      }, true);
    }
  }

  function runAllCleanEnhancements() {
    try {
      migrateFeesTo80Only();
      renderDashboardNumberedBalance();
    } catch (err) {
      console.error('Clean Reg80/Balance error:', err);
    }
  }

  if (typeof render === 'function') {
    const origRender = render;
    window.render = render = function patchedCleanReg80Render() {
      migrateFeesTo80Only();
      const res = origRender.apply(this, arguments);
      renderDashboardNumberedBalance();
      return res;
    };
  }
  setInterval(runAllCleanEnhancements, 450);
})();







/* === Staging <-> Live Merge & Publish Bar (app.js native) === */
(function initCyoStagingLiveSyncBar() {
  if (window.__cyoSyncBarInitialized) return;
  window.__cyoSyncBarInitialized = true;

  const PROD_ORIGIN = 'https://stanns.opp-solutions.com';
  const isProd = window.location.hostname === 'stanns.opp-solutions.com';
  if (isProd) return;

  window.pullLiveWorkToStaging = async function pullLiveWorkToStaging() {
    try {
      const res = await fetch(PROD_ORIGIN + '/api/state', { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const remoteData = await res.json();
      if (!remoteData || typeof remoteData !== 'object' || Object.keys(remoteData).length === 0) {
        alert('No live data found on opp-solutions.com yet.');
        return;
      }
      Object.entries(remoteData).forEach(([k, v]) => {
        if (k !== '__cyo_publish_key') {
          localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
        }
      });
      alert('Pulled latest live data (rosters, uniforms, fundraisers, registrations) into Staging! Reloading...');
      location.reload();
    } catch (err) {
      alert('Pull from live failed: ' + err.message);
    }
  };

  window.approveAndPublishToProduction = async function approveAndPublishToProduction() {
    if (!confirm('Approve your staging updates and MERGE them with live data on https://stanns.opp-solutions.com/?\n\n(Existing live rosters, uniform payments, fundraisers, and live registrations will be preserved.)')) {
      return;
    }
    let key = localStorage.getItem('__cyo_publish_key') || '';
    if (!key) {
      key = prompt('Enter your Production Publish Key:') || '';
      if (!key) return;
      localStorage.setItem('__cyo_publish_key', key.trim());
    }

    const payload = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k !== '__cyo_publish_key') payload[k] = localStorage.getItem(k);
    }

    try {
      const res = await fetch(PROD_ORIGIN + '/api/state', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + key.trim()
        },
        body: JSON.stringify(payload)
      });
      if (res.status === 401) {
        localStorage.removeItem('__cyo_publish_key');
        alert('Invalid Publish Key. Please try again.');
        return;
      }
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      if (data && data.mergedState && typeof data.mergedState === 'object') {
        Object.entries(data.mergedState).forEach(([k, v]) => {
          if (k !== '__cyo_publish_key') {
            localStorage.setItem(k, typeof v === 'string' ? v : JSON.stringify(v));
          }
        });
      }
      if (typeof toast === 'function') {
        toast('Published & Merged Live!', 'Approved updates are live and all live-entered work was preserved.');
      } else {
        alert('Published & Merged Live! All live-entered work was preserved.');
      }
      if (typeof render === 'function') render();
    } catch (err) {
      alert('Publish failed: ' + err.message);
    }
  };

  function buildActionButtons(idPrefix) {
    const wrap = document.createElement('div');
    wrap.id = idPrefix;
    wrap.style.cssText = 'display:inline-flex;gap:8px;align-items:center;flex-wrap:wrap;';

    const pubBtn = document.createElement('button');
    pubBtn.type = 'button';
    pubBtn.textContent = '✓ Approve & Publish Live';
    pubBtn.style.cssText = 'font-weight:800;background:#15803d;color:#fff;border:1px solid #166534;padding:9px 15px;border-radius:10px;cursor:pointer;font-size:13px;box-shadow:0 1px 2px rgba(0,0,0,0.12);';
    pubBtn.onclick = window.approveAndPublishToProduction;

    const pullBtn = document.createElement('button');
    pullBtn.type = 'button';
    pullBtn.textContent = '⬇ Pull Live Work';
    pullBtn.style.cssText = 'font-weight:700;background:#fff;color:#111827;border:1px solid #d1d5db;padding:9px 13px;border-radius:10px;cursor:pointer;font-size:13px;';
    pullBtn.onclick = window.pullLiveWorkToStaging;

    wrap.appendChild(pubBtn);
    wrap.appendChild(pullBtn);
    return wrap;
  }

  function renderSyncControls() {
    if (!document.body) return;

    // 1. Always keep a compact Staging Sync Dock in the bottom-right corner on the staging server
    if (!document.getElementById('cyoStagingFloatingDock')) {
      const dock = document.createElement('div');
      dock.id = 'cyoStagingFloatingDock';
      dock.style.cssText = 'position:fixed;bottom:16px;right:16px;z-index:99999;display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:14px;background:#111827;border:1px solid #374151;box-shadow:0 10px 25px rgba(0,0,0,0.3);';
      const badge = document.createElement('span');
      badge.textContent = 'STAGING';
      badge.style.cssText = 'font-size:10px;font-weight:800;letter-spacing:.08em;color:#fbbf24;padding-right:4px;';
      dock.appendChild(badge);
      dock.appendChild(buildActionButtons('cyoDockBtns'));
      document.body.appendChild(dock);
    }

    // 2. Also inject inline inside Settings -> GO-LIVE DATA MANAGEMENT right above the Delete buttons
    const delBtn = Array.from(document.querySelectorAll('button'))
      .find(b => /Delete All Players\/Registrations/i.test((b.textContent || '').trim()));
    if (delBtn && delBtn.parentElement && delBtn.parentElement.parentElement && !document.getElementById('cyoSettingsInlineSync')) {
      const inlineBar = buildActionButtons('cyoSettingsInlineSync');
      inlineBar.style.margin = '0 0 12px 0';
      delBtn.parentElement.parentElement.insertBefore(inlineBar, delBtn.parentElement);
    }
  }

  setInterval(renderSyncControls, 300);
  renderSyncControls();
})();

/* === Unified Phone Numbers & Scoped Coach/Admin Group SMS === */
(function initCyoPhoneAndGroupSms() {
  if (window.__cyoPhoneSmsV2Loaded) return;
  window.__cyoPhoneSmsV2Loaded = true;

  const SMS_BATCH_SIZE = 15;

  function normalizePhone(raw) {
    if (!raw) return '';
    const digits = String(raw).replace(/\D/g, '');
    if (digits.length === 10) return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    if (digits.length === 11 && digits.startsWith('1')) {
      return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    }
    return String(raw).trim();
  }

  function toSmsDialable(raw) {
    const digits = String(raw || '').replace(/\D/g, '');
    if (digits.length === 10) return '+1' + digits;
    if (digits.length === 11 && digits.startsWith('1')) return '+' + digits;
    return digits ? '+' + digits : '';
  }

  function getSessionUser() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.userId && Array.isArray(state.users)) {
        return state.users.find(u => u.id === parsed.userId) || parsed;
      }
      return parsed;
    } catch {
      return null;
    }
  }

  function getAllowedTeams() {
    const allTeams = Array.isArray(state.teams) ? state.teams : [];
    const user = getSessionUser();
    if (!user || user.role !== 'coach') return allTeams;
    const ids = Array.isArray(user.teamIds) ? user.teamIds : [];
    const byId = allTeams.filter(t => ids.includes(t.id));
    if (byId.length) return byId;
    const cName = String(user.coachName || user.name || '').trim().toLowerCase();
    return allTeams.filter(t => cName && String(t.coach || '').toLowerCase().includes(cName));
  }

  function getTeamRecipients(teamId) {
    const regs = Array.isArray(state.registrations) ? state.registrations : [];
    return regs
      .filter(r => r && r.teamId === teamId && r.phone)
      .map(r => ({ name: r.name || 'Athlete', phone: r.phone }));
  }

  function getAllCoachRecipients() {
    const teams = Array.isArray(state.teams) ? state.teams : [];
    const list = [];
    teams.forEach(t => {
      if (t && t.coach && t.coachPhone) {
        list.push({ name: `${t.coach} (${t.name})`, phone: t.coachPhone });
      }
    });
    return list;
  }

  function buildSmsUri(dialList) {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    return isIOS
      ? `sms:/open?addresses=${dialList.join(',')}`
      : `sms:${dialList.join(',')}`;
  }

  function launchGroupSms(recipients, groupTitle) {
    const valid = [];
    const seen = new Set();
    recipients.forEach(r => {
      const dial = toSmsDialable(r.phone);
      if (dial && !seen.has(dial)) {
        seen.add(dial);
        valid.push({ name: r.name || 'Contact', phone: normalizePhone(r.phone), dial });
      }
    });

    if (!valid.length) {
      alert(`No phone numbers saved for "${groupTitle}" yet.\n\nImport a CSV with Cell Phone / Home Phone / Phone columns or edit a record to add a phone number.`);
      return;
    }

    const isMobile = /iPad|iPhone|iPod|Android/.test(navigator.userAgent);
    if (isMobile && valid.length <= SMS_BATCH_SIZE) {
      window.location.href = buildSmsUri(valid.map(v => v.dial));
      return;
    }

    const existing = document.getElementById('cyoSmsBatchModal');
    if (existing) existing.remove();

    const batches = [];
    for (let i = 0; i < valid.length; i += SMS_BATCH_SIZE) {
      batches.push(valid.slice(i, i + SMS_BATCH_SIZE));
    }

    const overlay = document.createElement('div');
    overlay.id = 'cyoSmsBatchModal';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(17,24,39,0.6);z-index:100000;display:flex;align-items:center;justify-content:center;padding:16px;';

    const batchRowsHtml = batches.map((batch, idx) => {
      const nums = batch.map(b => b.phone).join(', ');
      const names = batch.map(b => `${b.name}: ${b.phone}`).join(', ');
      return `
        <div style="padding:12px;border:1px solid #e5e7eb;border-radius:10px;background:#f9fafb;margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
            <strong style="font-size:13px;color:#111827;">Batch ${idx + 1} of ${batches.length} (${batch.length} recipients)</strong>
            <div style="display:flex;gap:6px;">
              <a href="${buildSmsUri(batch.map(b => b.dial))}"
                 style="text-decoration:none;padding:6px 11px;border-radius:8px;background:#15803d;color:#fff;font-weight:700;font-size:12px;">
                💬 Open in Messages
              </a>
              <button type="button" class="cyo-copy-batch-btn" data-nums="${nums}"
                 style="padding:6px 11px;border-radius:8px;border:1px solid #d1d5db;background:#fff;color:#111827;font-weight:700;font-size:12px;cursor:pointer;">
                Copy Numbers
              </button>
            </div>
          </div>
          <div style="font-size:11px;color:#4b5563;line-height:1.45;word-break:break-word;">${names}</div>
        </div>
      `;
    }).join('');

    overlay.innerHTML = `
      <div style="width:100%;max-width:540px;max-height:85vh;overflow:auto;background:#fff;border-radius:16px;padding:20px;box-shadow:0 20px 40px rgba(0,0,0,0.28);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <h3 style="margin:0;font-size:16px;color:#111827;">💬 Group Text: ${groupTitle}</h3>
          <button type="button" id="cyoCloseSmsModal" style="border:none;background:transparent;font-size:20px;cursor:pointer;color:#6b7280;">&times;</button>
        </div>
        <p style="margin:0 0 14px 0;font-size:12px;color:#4b5563;">
          Messages send directly from <strong>your phone's number</strong> via your device Messages app (batched by ${SMS_BATCH_SIZE} for carrier compatibility).
        </p>
        ${batchRowsHtml}
      </div>
    `;
    document.body.appendChild(overlay);

    overlay.querySelectorAll('.cyo-copy-batch-btn').forEach(btn => {
      btn.onclick = () => {
        const txt = btn.getAttribute('data-nums') || '';
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(txt).catch(() => {});
        }
        btn.textContent = '✓ Copied';
        setTimeout(() => { btn.textContent = 'Copy Numbers'; }, 1500);
      };
    });
    document.getElementById('cyoCloseSmsModal').onclick = () => overlay.remove();
    overlay.onclick = (ev) => { if (ev.target === overlay) overlay.remove(); };
  }

  // Persist coachPhone on teamForm submit & add Phone input to Athlete edit modals
  document.addEventListener('submit', (e) => {
    const form = e.target;
    if (form && form.id === 'teamForm') {
      const phInput = form.querySelector('input[name="coachPhone"]');
      const teamNameInput = form.querySelector('input[name="name"]');
      if (phInput && teamNameInput) {
        const normPh = normalizePhone(phInput.value);
        const tName = teamNameInput.value.trim();
        setTimeout(() => {
          const team = (state.teams || []).find(t => t.name === tName);
          if (team) {
            team.coachPhone = normPh;
            if (typeof save === 'function') save();
          }
        }, 50);
      }
    }
  }, true);

  function wireAthleteModalPhoneField() {
    const modal = document.querySelector('#modalBody, .modal-body, .modal');
    if (!modal || modal.querySelector('#cyoAthletePhoneWrap')) return;
    const emailInput = modal.querySelector('input[name="email"], input[type="email"]');
    if (!emailInput || !emailInput.parentElement) return;
    if (modal.querySelector('#teamForm')) return; // teamForm already has Coach Phone

    const curEmail = String(emailInput.value || '').trim().toLowerCase();
    const nameInput = modal.querySelector('input[name="name"]');
    const curName = nameInput ? String(nameInput.value || '').trim().toLowerCase() : '';
    const reg = (state.registrations || []).find(r =>
      (curEmail && String(r.email || '').trim().toLowerCase() === curEmail) ||
      (curName && String(r.name || '').trim().toLowerCase() === curName)
    );

    const wrap = document.createElement('div');
    wrap.id = 'cyoAthletePhoneWrap';
    wrap.className = 'field';
    wrap.innerHTML = `<label>Phone</label><input id="cyoAthletePhoneInput" name="phone" type="tel" value="${esc(reg && reg.phone ? reg.phone : '')}" placeholder="(210) 555-0199">`;
    emailInput.parentElement.insertAdjacentElement('afterend', wrap);

    const form = modal.querySelector('form');
    if (form) {
      form.addEventListener('submit', () => {
        const val = normalizePhone(document.getElementById('cyoAthletePhoneInput')?.value || '');
        const emAfter = String(emailInput.value || '').trim().toLowerCase();
        const nmAfter = nameInput ? String(nameInput.value || '').trim().toLowerCase() : '';
        setTimeout(() => {
          const target = (state.registrations || []).find(r =>
            (emAfter && String(r.email || '').trim().toLowerCase() === emAfter) ||
            (nmAfter && String(r.name || '').trim().toLowerCase() === nmAfter)
          );
          if (target) {
            target.phone = val;
            if (typeof save === 'function') save();
          }
        }, 50);
      }, true);
    }
  }

  function injectGroupSmsControls() {
    if (typeof state === 'undefined' || !state) return;
    const user = getSessionUser();
    const isCoach = user && user.role === 'coach';
    const scopedTeams = getAllowedTeams();

    // 1. Overview & Communications Group Text Bar (Scoped for Coaches, Full for Master Admin)
    const pageHeadEl = document.querySelector('.page-head');
    if (pageHeadEl && (currentView === 'dashboard' || currentView === 'communications') && !document.getElementById('cyoGroupSmsBar')) {
      const bar = document.createElement('div');
      bar.id = 'cyoGroupSmsBar';
      bar.style.cssText = 'margin:0 0 18px 0;padding:14px 18px;border-radius:14px;background:#fff;border:1px solid #e6dcc2;display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between;';

      const teamOptions = scopedTeams.map(t => {
        const count = getTeamRecipients(t.id).length;
        return `<option value="${esc(t.id)}">${esc(t.name)} (${count} phone${count === 1 ? '' : 's'})</option>`;
      }).join('');

      if (isCoach) {
        bar.innerHTML = `
          <div>
            <div style="font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#9a7b2c;">💬 Coach Team Group Text</div>
            <div style="font-size:12px;color:#4b5563;">Sends from your own phone number to parents on your assigned team.</div>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">
            <select id="cyoSmsTeamSelect" style="padding:7px 10px;border-radius:8px;border:1px solid #d1d5db;font-size:12px;">
              ${teamOptions || '<option value="">No assigned teams</option>'}
            </select>
            <button type="button" id="cyoSmsSelectedTeam" class="btn primary" style="background:#15803d;border-color:#15803d;color:#fff;">💬 Group Text My Team</button>
          </div>
        `;
      } else {
        const coachCount = getAllCoachRecipients().length;
        const parentCount = (state.registrations || []).filter(r => r && r.phone).length;
        bar.innerHTML = `
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#9a7b2c;">💬 Admin Group Text</span>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center;">
            <button type="button" id="cyoSmsAllCoaches" class="btn small">Text All Coaches (${coachCount})</button>
            <button type="button" id="cyoSmsAllParents" class="btn small">Text All Parents (${parentCount})</button>
            <select id="cyoSmsTeamSelect" style="padding:7px 10px;border-radius:8px;border:1px solid #d1d5db;font-size:12px;">
              <option value="">Select a Team...</option>
              ${teamOptions}
            </select>
            <button type="button" id="cyoSmsSelectedTeam" class="btn small primary">Group Text Team</button>
          </div>
        `;
      }

      pageHeadEl.insertAdjacentElement('afterend', bar);

      const allCoachesBtn = document.getElementById('cyoSmsAllCoaches');
      if (allCoachesBtn) {
        allCoachesBtn.onclick = () => launchGroupSms(getAllCoachRecipients(), 'All Coaches');
      }
      const allParentsBtn = document.getElementById('cyoSmsAllParents');
      if (allParentsBtn) {
        allParentsBtn.onclick = () => {
          const list = (state.registrations || []).filter(r => r && r.phone).map(r => ({ name: r.name, phone: r.phone }));
          launchGroupSms(list, 'All Parents');
        };
      }
      const teamBtn = document.getElementById('cyoSmsSelectedTeam');
      if (teamBtn) {
        teamBtn.onclick = () => {
          const tid = document.getElementById('cyoSmsTeamSelect')?.value;
          if (!tid) { alert('Select a team first.'); return; }
          const team = (state.teams || []).find(t => t.id === tid);
          launchGroupSms(getTeamRecipients(tid), team ? team.name : 'Team');
        };
      }
    }

    // 2. Team League Tracker Workspace on Teams Tab (right next to Fundraisers ($0))
    const fundraisersBtn = Array.from(document.querySelectorAll('button'))
      .find(b => /^Fundraisers\s*\(/i.test((b.textContent || '').trim()) && b.offsetParent !== null);

    if (fundraisersBtn && fundraisersBtn.parentElement && !document.getElementById('cyoWorkspaceGroupSmsBtn')) {
      const tid = activeWorkspaceTeamId || (scopedTeams[0] && scopedTeams[0].id) || '';
      const team = (state.teams || []).find(t => t.id === tid);
      const count = tid ? getTeamRecipients(tid).length : 0;

      const wsBtn = document.createElement('button');
      wsBtn.id = 'cyoWorkspaceGroupSmsBtn';
      wsBtn.type = 'button';
      wsBtn.className = 'btn';
      wsBtn.style.cssText = 'background:#15803d;color:#fff;border-color:#15803d;font-weight:700;';
      wsBtn.textContent = `💬 Group Text Team (${count})`;
      wsBtn.onclick = () => {
        const curTid = activeWorkspaceTeamId || (scopedTeams[0] && scopedTeams[0].id) || '';
        const curTeam = (state.teams || []).find(t => t.id === curTid);
        launchGroupSms(getTeamRecipients(curTid), curTeam ? curTeam.name : 'Team');
      };
      fundraisersBtn.parentElement.appendChild(wsBtn);
    }
  }

  setInterval(() => {
    try {
      wireAthleteModalPhoneField();
      injectGroupSmsControls();
    } catch (_) {}
  }, 250);
})();
