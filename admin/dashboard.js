/* ═══════════════════════════════════════
   MAKEYOURWEB ADMIN — DASHBOARD SCRIPT
═══════════════════════════════════════ */

// ── SUPABASE CONFIG ──
const SUPABASE_URL = 'https://mfcievzvojupgxqagmgb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mY2lldnp2b2p1cGd4cWFnbWdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5ODExNzAsImV4cCI6MjA5MDU1NzE3MH0.ADduOhtH8NWJ2DrNWIw0YyiaKobwZyk5pQ_-uK00Hw0';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const SESSION_KEY = 'myw_admin_auth';
const DEMOS_KEY   = 'myw_demos';
const GH_KEY      = 'myw_gh_config';

// Auth guard
async function checkAuth() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session && sessionStorage.getItem(SESSION_KEY) !== 'true') {
    window.location.href = 'index.html';
  }
}
checkAuth();

/* ── DEFAULT DEMOS ── */
const DEFAULT_DEMOS = [
  { id:'hotel',       title:'LUMIÈRE Luxury Hotel',           slug:'demos/hotel',       category:'Hotel & Resort',    color:'#C9A84C', desc:'Elegant rooms, gold aesthetic, fine dining & rooftop pool showcase.',              status:'live', builtin:true },
  { id:'gym',         title:'IRONVAULT Gym',                  slug:'demos/gym',         category:'Gym & Fitness',     color:'#e8ff00', desc:'Dark neon-yellow hardcore aesthetic. Membership plans & class timetable.',          status:'live', builtin:true },
  { id:'restaurant',  title:'EMBER & ASH Restaurant',         slug:'demos/restaurant',  category:'Restaurant & Café', color:'#c0622a', desc:'Warm dark fine-dining theme. Full menu, reservation system & ambiance gallery.',     status:'live', builtin:true },
  { id:'clinic',      title:'SERENOVA Health',                slug:'demos/clinic',      category:'Clinic & Hospital', color:'#0891b2', desc:'Clean teal-white medical design. Doctor profiles & appointment booking.',            status:'live', builtin:true },
  { id:'education',   title:'MERIDIAN Institute',             slug:'demos/education',   category:'Education',         color:'#2563eb', desc:'Light editorial education design. Course listings & online admission form.',         status:'live', builtin:true },
  { id:'real-estate', title:'AURUM Estates',                  slug:'demos/real-estate', category:'Real Estate',       color:'#c9a84c', desc:'Dark gold luxury real estate. Property listings, virtual tours & lead capture.',     status:'live', builtin:true },
  { id:'business',    title:'PRESTIGE — Universal Business',  slug:'demos/business',    category:'Small Business',    color:'#4f7cff', desc:'One template, 6 live switchable colour themes. Works for any business.',             status:'live', builtin:true },
];

/* ── STATE ── */
let demos     = loadDemos();
let uploadedFiles = [];
let deletePendingId = null;

function loadDemos() {
  const saved = localStorage.getItem(DEMOS_KEY);
  if (!saved) return [...DEFAULT_DEMOS];
  try {
    const parsed = JSON.parse(saved);
    const customIds = parsed.map(d => d.id);
    const builtins  = DEFAULT_DEMOS.filter(d => !customIds.includes(d.id));
    return [...parsed, ...builtins.filter(d => d.builtin)];
  } catch(e) {
    return [...DEFAULT_DEMOS];
  }
}

function saveDemos() {
  localStorage.setItem(DEMOS_KEY, JSON.stringify(demos));
  updateStats();
}

/* ── VIEW SWITCHING ── */
const sidebar = document.getElementById('sidebar');
const sbToggle= document.getElementById('sbToggle');
const sbOverlay=document.getElementById('sbOverlay');

if(sbToggle) {
  sbToggle.addEventListener('click', () => {
    sidebar?.classList.toggle('open');
    sbOverlay?.classList.toggle('open');
  });
}
if(sbOverlay) {
  sbOverlay.addEventListener('click', () => {
    sidebar?.classList.remove('open');
    sbOverlay?.classList.remove('open');
  });
}

function switchView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.sb-link').forEach(l => l.classList.remove('active'));
  const viewEl = document.getElementById('view-' + name);
  if(viewEl) viewEl.classList.add('active');
  document.querySelector(`[data-view="${name}"]`)?.classList.add('active');

  const titles = { overview:'Overview', upload:'Upload Demo', demos:'Manage Demos', github:'GitHub & Deploy' };
  const subtitles = {
    overview:'Welcome back, Rahul. Here\'s your portfolio at a glance.',
    upload:'Add a new website demo to your portfolio.',
    demos:'View, edit, and manage all your demo websites.',
    github:'Configure GitHub & Netlify auto-deploy.'
  };
  
  const titleEl = document.querySelector('#pageTitle h2');
  const subEl = document.querySelector('#pageTitle p');
  if(titleEl) titleEl.textContent = titles[name] || name;
  if(subEl) subEl.textContent  = subtitles[name] || '';

  sidebar?.classList.remove('open');
  sbOverlay?.classList.remove('open');

  if (name === 'demos' || name === 'overview') renderTables();
  if (name === 'github') loadGhConfigIntoForm();
}

document.querySelectorAll('.sb-link[data-view]').forEach(btn => {
  btn.addEventListener('click', () => switchView(btn.dataset.view));
});

/* ── STATS ── */
function updateStats() {
  const liveCount = demos.filter(d => d.status === 'live').length;
  const sDemo = document.getElementById('statDemoCount');
  const sLive = document.getElementById('statLiveCount');
  if(sDemo) sDemo.textContent = demos.length;
  if(sLive) sLive.textContent = liveCount;
}

/* ── RENDER TABLES ── */
function renderTables() {
  renderTable('overviewTableBody', demos.slice(0, 6));
  renderTable('demosTableBody', demos);
  const countLbl = document.getElementById('demosCountLabel');
  if(countLbl) countLbl.textContent = `${demos.length} demos (${demos.filter(d=>d.status==='live').length} live)`;
  updateStats();
}

function renderTable(containerId, list) {
  const el = document.getElementById(containerId);
  if(!el) return;
  if (!list.length) {
    el.innerHTML = `<div class="dt-empty"><i class="fas fa-folder-open"></i><p>No demos yet. <a style="color:var(--acc);cursor:pointer" onclick="switchView('upload')">Upload your first one →</a></p></div>`;
    return;
  }
  el.innerHTML = list.map(d => `
    <div class="dt-row">
      <div class="dt-name">
        <div class="dt-dot" style="background:${d.color}"></div>
        <div>
          <div class="dt-title">${d.title}</div>
          <div class="dt-slug">${d.slug || (d.externalUrl ? 'External URL' : '')}/</div>
        </div>
      </div>
      <div class="dt-tag-col">
        <span class="dt-tag" style="color:${d.color};background:${d.color}18;border-color:${d.color}38">${d.category}</span>
      </div>
      <div>
        <span class="dt-status ${d.status}">
          ${d.status === 'live' ? '● Live' : '○ Draft'}
        </span>
      </div>
      <div class="dt-actions">
        <a class="dt-act-btn" href="${d.externalUrl || '../' + d.slug + '/index.html'}" target="_blank"
           style="background:rgba(108,99,255,.1);color:var(--acc)"
           title="Preview"><i class="fas fa-eye"></i></a>
        ${!d.builtin ? `
          <button class="dt-act-btn" onclick="toggleStatus('${d.id}')"
            style="background:rgba(67,233,123,.1);color:var(--acc3)"
            title="Toggle status"><i class="fas fa-toggle-${d.status==='live'?'on':'off'}"></i></button>
          <button class="dt-act-btn" onclick="confirmDelete('${d.id}')"
            style="background:rgba(255,101,132,.1);color:var(--acc2)"
            title="Delete"><i class="fas fa-trash"></i></button>
        ` : `<span style="font-size:.7rem;color:var(--muted);padding:0 .25rem">built-in</span>`}
      </div>
    </div>
  `).join('');
}

function toggleStatus(id) {
  const demo = demos.find(d => d.id === id);
  if (!demo) return;
  demo.status = demo.status === 'live' ? 'draft' : 'live';
  saveDemos();
  renderTables();
  showToast(`"${demo.title}" set to ${demo.status}`, 'info');
}

function confirmDelete(id) {
  const demo = demos.find(d => d.id === id);
  if (!demo) return;
  deletePendingId = id;
  document.getElementById('deleteModalName').textContent = demo.title;
  document.getElementById('deleteModal').classList.add('open');
}

document.getElementById('deleteCancelBtn')?.addEventListener('click', () => {
  document.getElementById('deleteModal').classList.remove('open');
  deletePendingId = null;
});

document.getElementById('deleteConfirmBtn')?.addEventListener('click', () => {
  if (!deletePendingId) return;
  const name = demos.find(d => d.id === deletePendingId)?.title;
  demos = demos.filter(d => d.id !== deletePendingId);
  saveDemos();
  renderTables();
  document.getElementById('deleteModal').classList.remove('open');
  deletePendingId = null;
  showToast(`"${name}" removed from portfolio`, 'success');
});

/* ── FILE UPLOAD ── */
const dropZone    = document.getElementById('dropZone');
const folderInput = document.getElementById('folderInput');
const fileInput   = document.getElementById('fileInput');
const fileList    = document.getElementById('fileList');
const metaForm    = document.getElementById('metaForm');
const uploadActions = document.getElementById('uploadActions');

document.getElementById('pickFolderBtn')?.addEventListener('click', e => { e.stopPropagation(); folderInput.click(); });
document.getElementById('pickFilesBtn')?.addEventListener('click',  e => { e.stopPropagation(); fileInput.click(); });

folderInput?.addEventListener('change', e => {
  const files = Array.from(e.target.files);
  files.forEach(f => { if (!f._relativePath) f._relativePath = f.webkitRelativePath || f.name; });
  handleFiles(files);
  folderInput.value = '';
});

fileInput?.addEventListener('change', e => {
  const files = Array.from(e.target.files);
  files.forEach(f => { f._relativePath = f.name; });
  handleFiles(files);
  fileInput.value = '';
});

dropZone?.addEventListener('dragover', e => { e.preventDefault(); dropZone.classList.add('drag-over'); });
dropZone?.addEventListener('dragleave', e => {
  if (!dropZone.contains(e.relatedTarget)) dropZone.classList.remove('drag-over');
});

dropZone?.addEventListener('drop', async e => {
  e.preventDefault();
  dropZone.classList.remove('drag-over');
  const items = Array.from(e.dataTransfer.items || []);
  if (!items.length) return;
  showToast('Reading dropped items…', 'info');
  const allFiles = [];
  for (const item of items) {
    if (item.kind !== 'file') continue;
    const entry = item.webkitGetAsEntry ? item.webkitGetAsEntry() : null;
    if (entry) {
      const collected = await readEntry(entry, '');
      allFiles.push(...collected);
    } else {
      const f = item.getAsFile();
      if (f) { f._relativePath = f.name; allFiles.push(f); }
    }
  }
  if (allFiles.length) handleFiles(allFiles);
});

function readEntry(entry, pathPrefix) {
  return new Promise(resolve => {
    if (entry.isFile) {
      entry.file(f => {
        f._relativePath = pathPrefix ? pathPrefix + '/' + entry.name : entry.name;
        resolve([f]);
      }, () => resolve([]));
    } else if (entry.isDirectory) {
      const reader = entry.createReader();
      const results = [];
      function readBatch() {
        reader.readEntries(async entries => {
          if (!entries.length) { resolve(results); return; }
          for (const child of entries) {
            const sub = await readEntry(child, pathPrefix ? pathPrefix + '/' + entry.name : entry.name);
            results.push(...sub);
          }
          readBatch();
        }, () => resolve(results));
      }
      readBatch();
    } else {
      resolve([]);
    }
  });
}

function handleFiles(newFiles) {
  if (!newFiles.length) return;
  const paths = newFiles.map(f => f._relativePath || f.name);
  const topFolders = [...new Set(paths.map(p => p.split('/')[0]))];
  let stripPrefix = '';
  if (topFolders.length === 1 && paths.some(p => p.includes('/'))) {
    stripPrefix = topFolders[0] + '/';
  }
  newFiles.forEach(f => {
    const rel = (f._relativePath || f.name).replace(/^\/+/, '');
    f._cleanPath = stripPrefix && rel.startsWith(stripPrefix) ? rel.slice(stripPrefix.length) : rel;
  });
  const existingPaths = new Set(uploadedFiles.map(f => f._cleanPath));
  const toAdd = newFiles.filter(f => f._cleanPath && !existingPaths.has(f._cleanPath));
  uploadedFiles = [...uploadedFiles, ...toAdd];
  renderFileList();
  if(metaForm) metaForm.style.display = 'grid';
  if(uploadActions) uploadActions.style.display = 'flex';
  const titleIn = document.getElementById('mTitle');
  if (titleIn && !titleIn.value) {
    const rootFolder = stripPrefix ? stripPrefix.replace(/\/$/, '') : '';
    const htmlFile   = newFiles.find(f => f._cleanPath === 'index.html' || f.name === 'index.html');
    let suggested = rootFolder || (htmlFile ? '' : (newFiles[0]?.name || ''));
    if (suggested) {
      const nice = suggested.replace(/[_-]/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
      titleIn.value = nice;
      const slugIn = document.getElementById('mSlug');
      if(slugIn) slugIn.value  = 'demos/' + suggested.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
    }
  }
}

function renderFileList() {
  if (!fileList) return;
  if (!uploadedFiles.length) { fileList.innerHTML = ''; return; }
  const groups = {};
  uploadedFiles.forEach((f, i) => {
    const parts = (f._cleanPath || f.name).split('/');
    const folder = parts.length > 1 ? parts[0] : '(root)';
    if (!groups[folder]) groups[folder] = [];
    groups[folder].push({ f, i });
  });
  let html = '';
  for (const [folder, items] of Object.entries(groups)) {
    if (folder !== '(root)') {
      html += `<div style="font-size:.7rem;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);padding:.3rem 0 .1rem;margin-top:.4rem;">
        <i class="fas fa-folder" style="color:var(--acc);margin-right:.35rem;font-size:.65rem"></i>${folder}/
      </div>`;
    }
    items.forEach(({ f, i }) => {
      const name = (f._cleanPath || f.name).split('/').pop();
      html += `<div class="file-item">
        <div class="file-icon"><i class="fas fa-${getFileIcon(name)}"></i></div>
        <span class="file-name">${f._cleanPath || f.name}</span>
        <span class="file-size">${formatSize(f.size)}</span>
        <button class="file-remove" onclick="removeFile(${i})" title="Remove"><i class="fas fa-xmark"></i></button>
      </div>`;
    });
  }
  fileList.innerHTML = html;
}

function removeFile(i) {
  uploadedFiles.splice(i, 1);
  renderFileList();
  if (!uploadedFiles.length) {
    if(metaForm) metaForm.style.display = 'none';
    if(uploadActions) uploadActions.style.display = 'none';
  }
}

function getFileIcon(name) {
  if (!name) return 'file';
  const n = name.toLowerCase();
  if (n.endsWith('.html')) return 'code';
  if (n.endsWith('.css'))  return 'palette';
  if (n.endsWith('.js'))   return 'bolt';
  if (/\.(jpg|jpeg|png|gif|svg|webp|ico)$/i.test(n)) return 'image';
  if (/\.(woff|woff2|ttf|eot)$/i.test(n)) return 'font';
  if (n.endsWith('.json')) return 'brackets-curly';
  return 'file';
}

function formatSize(bytes) {
  if (!bytes || bytes === 0) return '—';
  if (bytes < 1024) return bytes + 'B';
  if (bytes < 1024*1024) return (bytes/1024).toFixed(1) + 'KB';
  return (bytes/1024/1024).toFixed(1) + 'MB';
}

document.getElementById('mColor')?.addEventListener('input', e => {
  const hex = document.getElementById('mColorHex');
  if(hex) hex.value = e.target.value;
});
document.getElementById('mColorHex')?.addEventListener('input', e => {
  const cp = document.getElementById('mColor');
  if (cp && /^#[0-9a-fA-F]{6}$/.test(e.target.value)) cp.value = e.target.value;
});

document.getElementById('mTitle')?.addEventListener('input', e => {
  const slugInput = document.getElementById('mSlug');
  if(!slugInput) return;
  const existing = slugInput.value;
  const autoSlug = 'demos/' + e.target.value.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  if (!existing || existing.startsWith('demos/')) {
    slugInput.value = autoSlug;
  }
});

/* ── PUBLISH ── */
document.getElementById('publishBtn')?.addEventListener('click', () => publishDemo(false));
document.getElementById('saveDraftBtn')?.addEventListener('click', () => publishDemo(true));

async function publishDemo(asDraft) {
  const title    = document.getElementById('mTitle').value.trim();
  const slug     = document.getElementById('mSlug').value.trim().replace(/\/+$/, '');
  const category = document.getElementById('mCategory').value;
  const color    = document.getElementById('mColorHex').value || '#6c63ff';
  const desc     = document.getElementById('mDesc').value.trim();
  const status   = asDraft ? 'draft' : (document.getElementById('mStatus').value || 'live');

  if (!title || !slug || !category || !desc) { showToast('Please fill in all required fields.', 'error'); return; }
  if (!uploadedFiles.length) { showToast('Please upload at least one file.', 'error'); return; }

  const ghConfig = loadGhConfig();
  const hasGh    = ghConfig && ghConfig.token && ghConfig.user && ghConfig.repo;

  const newDemo = {
    id: slug.split('/').pop() + '-' + Date.now(),
    title, slug, category, color, desc, status,
    tags: document.getElementById('mTags').value.split(',').map(t=>t.trim()).filter(Boolean),
    createdAt: new Date().toISOString(),
    builtin: false
  };

  if (!asDraft && hasGh) {
    await pushToGitHub(ghConfig, slug, uploadedFiles, newDemo);
  } else {
    demos.unshift(newDemo);
    saveDemos();
    showToast(asDraft ? `"${title}" saved as draft.` : `"${title}" added! Configure GitHub to auto-deploy.`, 'success');
    resetUploadForm();
    switchView('demos');
  }
}

async function pushToGitHub(cfg, slug, files, demo) {
  const progWrap = document.getElementById('progressWrap');
  const progBar  = document.getElementById('progressBar');
  const progPct  = document.getElementById('progressPct');
  const progLbl  = document.getElementById('progressLabel');
  const publishBtn = document.getElementById('publishBtn');

  progWrap?.classList.add('show');
  if(publishBtn) publishBtn.disabled = true;

  const total = files.length + 1;
  let done = 0;

  function setProgress(label, pct) {
    if(progLbl) progLbl.textContent = label;
    if(progPct) progPct.textContent = pct + '%';
    if(progBar) progBar.style.width = pct + '%';
  }

  try {
    const base = `https://api.github.com/repos/${cfg.user}/${cfg.repo}/contents`;
    const headers = { 'Authorization': `Bearer ${cfg.token}`, 'Content-Type': 'application/json', 'Accept': 'application/vnd.github.v3+json' };

    for (const file of files) {
      setProgress(`Uploading ${file.name}…`, Math.round((done / total) * 80));
      const content = await readFileAsBase64(file);
      const relativePath = file._cleanPath || file.name;
      const path    = `${slug}/${relativePath}`;

      let sha = null;
      try {
        const check = await fetch(`${base}/${path}`, { headers });
        if (check.ok) { const j = await check.json(); sha = j.sha; }
      } catch(e) {}

      const body = { message: `Upload ${path}`, content };
      if (sha) body.sha = sha;
      const res = await fetch(`${base}/${path}`, { method:'PUT', headers, body: JSON.stringify(body) });
      if (!res.ok) throw new Error(`Failed to upload ${file.name}: ${await res.text()}`);
      done++;
    }

    setProgress('Updating demos registry…', 85);
    demos.unshift(demo);
    const demosJson   = JSON.stringify(demos, null, 2);
    const demosB64    = btoa(unescape(encodeURIComponent(demosJson)));
    let demosSha = null;
    try {
      const r = await fetch(`${base}/demos.json`, { headers });
      if (r.ok) { const j = await r.json(); demosSha = j.sha; }
    } catch(e) {}

    const dBody = { message:'Update demos.json', content: demosB64 };
    if (demosSha) dBody.sha = demosSha;
    await fetch(`${base}/demos.json`, { method:'PUT', headers, body: JSON.stringify(dBody) });

    setProgress('Finalising…', 95);
    saveDemos();
    setTimeout(() => {
      setProgress('Published! Netlify deploying…', 100);
      setTimeout(() => {
        progWrap?.classList.remove('show');
        if(publishBtn) publishBtn.disabled = false;
        showToast(`🚀 "${demo.title}" published! Live in ~30 seconds.`, 'success');
        resetUploadForm();
        switchView('demos');
      }, 1200);
    }, 600);
  } catch(err) {
    progWrap?.classList.remove('show');
    if(publishBtn) publishBtn.disabled = false;
    showToast('GitHub error: ' + err.message, 'error');
  }
}

function readFileAsBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload  = () => res(r.result.split(',')[1]);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

function resetUploadForm() {
  uploadedFiles = [];
  if(fileList) fileList.innerHTML = '';
  if(metaForm) metaForm.style.display = 'none';
  const ua = document.getElementById('uploadActions');
  if(ua) ua.style.display = 'none';
  ['mTitle','mSlug','mCategory','mDesc','mTags','fileInput','folderInput'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.value = '';
  });
  document.getElementById('progressWrap')?.classList.remove('show');
}

document.getElementById('clearUploadBtn')?.addEventListener('click', resetUploadForm);

/* ── GITHUB CONFIG ── */
function loadGhConfig() {
  const s = localStorage.getItem(GH_KEY);
  return s ? JSON.parse(s) : null;
}

function loadGhConfigIntoForm() {
  const cfg = loadGhConfig();
  if (!cfg) return;
  if (cfg.user)   document.getElementById('ghUser').value   = cfg.user;
  if (cfg.repo)   document.getElementById('ghRepo').value   = cfg.repo;
  if (cfg.branch) document.getElementById('ghBranch').value = cfg.branch;
  if (cfg.token)  document.getElementById('ghToken').value  = cfg.token;
}

document.getElementById('ghSaveBtn')?.addEventListener('click', () => {
  const cfg = {
    user:   document.getElementById('ghUser').value.trim(),
    repo:   document.getElementById('ghRepo').value.trim(),
    branch: document.getElementById('ghBranch').value.trim() || 'main',
    token:  document.getElementById('ghToken').value.trim()
  };
  if (!cfg.user || !cfg.repo || !cfg.token) { showGhStatus('Please fill in username, repo, and token.', 'err'); return; }
  localStorage.setItem(GH_KEY, JSON.stringify(cfg));
  showGhStatus('✓ Configuration saved!', 'ok');
  showToast('GitHub config saved.', 'success');
});

document.getElementById('ghTestBtn')?.addEventListener('click', async () => {
  const cfg = loadGhConfig();
  if (!cfg) { showGhStatus('Save your config first.', 'err'); return; }
  showGhStatus('Testing connection…', 'info');
  try {
    const res = await fetch(`https://api.github.com/repos/${cfg.user}/${cfg.repo}`, {
      headers:{ 'Authorization': `Bearer ${cfg.token}`, 'Accept':'application/vnd.github.v3+json' }
    });
    if (res.ok) {
      const data = await res.json();
      showGhStatus(`✓ Connected! Repo: ${data.full_name} (${data.visibility})`, 'ok');
      showToast('GitHub connected ✓', 'success');
    } else {
      const e = await res.json();
      showGhStatus('✗ ' + (e.message || 'Connection failed'), 'err');
    }
  } catch(err) {
    showGhStatus('✗ Network error: ' + err.message, 'err');
  }
});

function showGhStatus(msg, type) {
  const el = document.getElementById('ghStatus');
  if(!el) return;
  el.style.display = 'flex';
  el.className = 'gh-status ' + type;
  el.innerHTML = `<i class="fas fa-${type==='ok'?'check-circle':type==='err'?'circle-xmark':'circle-info'}"></i> ${msg}`;
}

/* ── TOAST ── */
function showToast(msg, type = 'info') {
  const stack = document.getElementById('toastStack');
  if(!stack) return;
  const t = document.createElement('div');
  const icons = { success:'circle-check', error:'circle-xmark', info:'circle-info' };
  t.className = `toast ${type}`;
  t.innerHTML = `<i class="fas fa-${icons[type]||'circle-info'}"></i><span>${msg}</span>`;
  stack.appendChild(t);
  requestAnimationFrame(() => { requestAnimationFrame(() => t.classList.add('show')); });
  setTimeout(() => {
    t.classList.add('hide');
    setTimeout(() => t.remove(), 350);
  }, 4000);
}

/* ── LOGOUT ── */
const logoutBtn = document.getElementById('logoutBtn');
const logoutModal = document.getElementById('logoutModal');
const confirmLogoutBtn = document.getElementById('confirmLogoutBtn');

if(logoutBtn && logoutModal) {
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    logoutModal.classList.add('open');
  });
}

if(confirmLogoutBtn) {
  confirmLogoutBtn.addEventListener('click', async () => {
    await supabaseClient.auth.signOut();
    sessionStorage.removeItem(SESSION_KEY);
    window.location.href = 'index.html';
  });
}

/* ── UPLOAD TAB INJECTION ── */
function injectUploadTabs() {
  const view = document.getElementById('view-upload');
  if (!view || view.querySelector('.upload-tabs')) return;

  const tabBar = document.createElement('div');
  tabBar.className = 'upload-tabs';
  tabBar.innerHTML = `
    <button class="utab active" id="utabFiles" onclick="switchUploadTab('files')">
      <i class="fas fa-cloud-arrow-up"></i> Upload Files
    </button>
    <button class="utab" id="utabUrl" onclick="switchUploadTab('url')">
      <i class="fas fa-link"></i> Add by URL
    </button>`;
  view.insertBefore(tabBar, view.firstChild);

  // Wrap existing content in "files" pane
  const existingChildren = Array.from(view.children).filter(el => !el.classList.contains('upload-tabs'));
  const filesPane = document.createElement('div');
  filesPane.className = 'utab-pane active';
  filesPane.id = 'upPane-files';
  existingChildren.forEach(el => filesPane.appendChild(el));
  view.appendChild(filesPane);

  // Add URL pane
  const urlPane = document.createElement('div');
  urlPane.className = 'utab-pane';
  urlPane.id = 'upPane-url';
  urlPane.innerHTML = `
    <div class="url-upload-wrap">
      <div class="cf-group" style="margin-bottom:1.5rem">
        <label>Website URL (HTTPS recommended)</label>
        <div style="display:flex;gap:.75rem">
          <input type="url" id="uUrl" placeholder="https://example.com" style="flex:1">
          <button class="btn btn-ghost" onclick="previewUrl()"><i class="fas fa-eye"></i> Preview</button>
        </div>
      </div>
      
      <div class="url-preview-box" id="urlPreviewBox">
        <div class="upb-head">
          <div id="urlFavicon" class="upb-fav">🌐</div>
          <div>
            <div id="urlPreviewTitle" class="upb-title">Example Site</div>
            <div id="urlPreviewHref" class="upb-url">https://example.com</div>
          </div>
        </div>
      </div>

      <div class="meta-form" style="display:grid;margin-top:1.5rem">
        <div class="cf-row">
          <div class="cf-group"><label>Demo Title</label><input type="text" id="uTitle" placeholder="My Awesome Project"></div>
          <div class="cf-group">
            <label>Category</label>
            <select id="uCategory">
              <option value="">Select Category</option>
              <option>Gym & Fitness</option><option>Restaurant & Café</option>
              <option>Hotel & Resort</option><option>Clinic & Hospital</option>
              <option>Real Estate</option><option>Education</option>
              <option>Small Business</option><option>E-Commerce</option>
            </select>
          </div>
        </div>
        <div class="cf-row">
          <div class="cf-group">
            <label>Accent Color</label>
            <div style="display:flex;gap:.75rem;align-items:center">
              <input type="color" id="uColor" value="#6c63ff" style="width:44px;height:44px;padding:2px">
              <input type="text" id="uColorHex" value="#6c63ff" style="flex:1" placeholder="#6c63ff">
            </div>
          </div>
          <div class="cf-group"><label>Tags (comma-separated)</label><input type="text" id="uTags" placeholder="modern, dark, fast"></div>
        </div>
        <div class="cf-group"><label>Description</label><textarea id="uDesc" rows="3" placeholder="A brief description of this demo…"></textarea></div>
      </div>

      <div class="upload-actions" style="display:flex;margin-top:2rem">
        <button class="btn btn-primary" id="publishUrlBtn" onclick="publishUrlDemo()">
          <i class="fas fa-rocket"></i> Add to Portfolio
        </button>
        <button class="btn btn-ghost" onclick="clearUrlForm()">Clear</button>
      </div>
    </div>`;
  view.appendChild(urlPane);
  
  // Sync color picker for URL pane
  const colPicker = document.getElementById('uColor');
  const colHex = document.getElementById('uColorHex');
  if(colPicker && colHex) {
    colPicker.addEventListener('input', e => colHex.value = e.target.value);
    colHex.addEventListener('input', e => { if(/^#[0-9a-fA-F]{6}$/.test(e.target.value)) colPicker.value = e.target.value; });
  }
}

/* ── INIT ── */
renderTables();
updateStats();
injectUploadTabs();

document.querySelector('[data-view="github"]')?.addEventListener('click', () => {
  setTimeout(loadGhConfigIntoForm, 50);
});

/* ── ACTIONS ── */
window.previewUrl = function() {
  const url = (document.getElementById('uUrl')?.value || '').trim();
  if (!url) { showToast('Please enter a URL first.', 'error'); return; }
  const box    = document.getElementById('urlPreviewBox');
  const title  = document.getElementById('urlPreviewTitle');
  const href   = document.getElementById('urlPreviewHref');
  const fav    = document.getElementById('urlFavicon');
  try {
    const parsed = new URL(url);
    const faviconUrl = parsed.origin + '/favicon.ico';
    if(box) box.classList.add('show');
    if(title) title.textContent = parsed.hostname;
    if(href) href.textContent  = url;
    if(fav) fav.innerHTML = `<img src="${faviconUrl}" onerror="this.parentElement.textContent='🌐'" style="width:32px;height:32px;object-fit:contain;border-radius:4px"/>`;
    const titleInput = document.getElementById('uTitle');
    if (titleInput && !titleInput.value) titleInput.value = parsed.hostname.replace('www.','');
  } catch(e) {
    showToast('Invalid URL. Make sure it starts with https://', 'error');
  }
};

window.publishUrlDemo = function() {
  const url      = (document.getElementById('uUrl')?.value || '').trim();
  const title    = (document.getElementById('uTitle')?.value || '').trim();
  const category = (document.getElementById('uCategory')?.value || '').trim();
  const color    = (document.getElementById('uColorHex')?.value || '#6c63ff').trim();
  const desc     = (document.getElementById('uDesc')?.value || '').trim();
  const status   = document.getElementById('uStatus')?.value || 'live';
  const tagsRaw  = (document.getElementById('uTags')?.value || '').trim();
  const tags     = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];

  if (!url)      { showToast('Please enter the demo URL.', 'error'); return; }
  if (!title)    { showToast('Please enter a demo title.', 'error'); return; }
  if (!category) { showToast('Please select a category.', 'error'); return; }
  if (!desc)     { showToast('Please add a short description.', 'error'); return; }

  const entry = {
    id: title.toLowerCase().replace(/\s+/g,'-') + '-' + Date.now(),
    title, externalUrl: url, slug: '', category, color, desc, status, tags,
    createdAt: new Date().toISOString(), builtin: false
  };

  const cfg = loadGhConfig();
  if (!cfg) {
    demos.push(entry); saveDemos();
    showToast('⚠️ GitHub not configured. Saved locally.', 'info');
    renderTables(); updateStats(); clearUrlForm();
    return;
  }

  const btn = document.getElementById('publishUrlBtn');
  if(btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publishing…'; }

  const GH_API = `https://api.github.com/repos/${cfg.user}/${cfg.repo}/contents/demos.json`;
  const headers = { 'Authorization': `Bearer ${cfg.token}`, 'Accept': 'application/vnd.github.v3+json', 'Content-Type': 'application/json' };

  fetch(GH_API, { headers })
    .then(r => r.json())
    .then(existing => {
      let list = [];
      try { list = JSON.parse(atob(existing.content.replace(/\n/g,''))); } catch(e) {}
      list.push(entry);
      const newContent = btoa(unescape(encodeURIComponent(JSON.stringify(list, null, 2))));
      return fetch(GH_API, {
        method: 'PUT', headers,
        body: JSON.stringify({ message: `Add URL demo: ${title}`, content: newContent, sha: existing.sha })
      });
    })
    .then(async r => {
      if (r.ok) {
        showToast(`✓ "${title}" added to portfolio!`, 'success');
        demos.push(entry); saveDemos();
        renderTables(); updateStats(); clearUrlForm();
      } else {
        const e = await r.json();
        showToast('GitHub error: ' + (e.message || 'Unknown'), 'error');
      }
    })
    .catch(err => showToast('Error: ' + err.message, 'error'))
    .finally(() => {
      if(btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-rocket"></i> Add to Portfolio'; }
    });
};

window.switchUploadTab = function(tab) {
  document.querySelectorAll('.utab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.utab-pane').forEach(p => p.classList.remove('active'));
  const tBtn = document.getElementById('utab' + tab.charAt(0).toUpperCase() + tab.slice(1));
  const tPane = document.getElementById('upPane-' + tab);
  if(tBtn) tBtn.classList.add('active');
  if(tPane) tPane.classList.add('active');
};

function clearUrlForm() {
  ['uUrl','uTitle','uDesc','uTags'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const cat = document.getElementById('uCategory');
  const col = document.getElementById('uColorHex');
  const cp = document.getElementById('uColor');
  if (cat) cat.value = '';
  if (col) col.value = '#6c63ff';
  if (cp) cp.value = '#6c63ff';
  document.getElementById('urlPreviewBox')?.classList.remove('show');
}
