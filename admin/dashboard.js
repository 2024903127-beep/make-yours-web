/* ═══════════════════════════════════════
   MAKEYOURWEB ADMIN — DASHBOARD SCRIPT
═══════════════════════════════════════ */

// ── SUPABASE CONFIG ──
const SUPABASE_URL = 'https://mfcievzvojupgxqagmgb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mY2lldnp2b2p1cGd4cWFnbWdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5ODExNzAsImV4cCI6MjA5MDU1NzE3MH0.ADduOhtH8NWJ2DrNWIw0YyiaKobwZyk5pQ_-uK00Hw0';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ── AUTH GUARD ──
async function checkAuth() {
  const { data: { session } } = await supabaseClient.auth.getSession();
  if (!session) {
    window.location.href = 'index.html';
  }
}
checkAuth();

// Logout Handler
async function handleLogout() {
  await supabaseClient.auth.signOut();
  window.location.href = 'index.html';
}

/* ── STATE ── */
let demos = [];
let uploadedFiles = [];
let deletePendingId = null;

/* ── DATA SYNC ── */
async function loadAllDemos() {
  try {
    // 1. Try Supabase first
    const { data, error } = await supabaseClient
      .from('demos')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      demos = data;
      console.log('Demos loaded from Supabase');
    } else {
      // 2. Fallback to LocalStorage or Static JSON
      const saved = localStorage.getItem(DEMOS_KEY);
      if (saved) {
        demos = JSON.parse(saved);
      } else {
        const res = await fetch('../demos.json');
        demos = await res.json();
      }
    }
  } catch (e) {
    console.error('Fetch error:', e);
  }
  renderTables();
}

async function saveToSupabase(demo) {
  const { error } = await supabaseClient.from('demos').upsert(demo);
  if (error) console.error('Supabase Sync Error:', error);
  // Also save locally for instant UI update
  localStorage.setItem(DEMOS_KEY, JSON.stringify(demos));
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
          <div class="dt-slug">${d.slug || (d.external_url ? 'External URL' : '')}/</div>
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
        <a class="dt-act-btn" href="${d.external_url || '../' + d.slug + '/index.html'}" target="_blank"
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

async function toggleStatus(id) {
  const demo = demos.find(d => d.id === id);
  if (!demo) return;
  demo.status = demo.status === 'live' ? 'draft' : 'live';
  await saveToSupabase(demo);
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

document.getElementById('deleteConfirmBtn')?.addEventListener('click', async () => {
  if (!deletePendingId) return;
  const name = demos.find(d => d.id === deletePendingId)?.title;
  
  // Delete from Supabase
  const { error } = await supabaseClient.from('demos').delete().eq('id', deletePendingId);
  if (error) { showToast('Supabase Delete Error', 'error'); return; }

  demos = demos.filter(d => d.id !== deletePendingId);
  localStorage.setItem(DEMOS_KEY, JSON.stringify(demos));
  renderTables();
  document.getElementById('deleteModal').classList.remove('open');
  deletePendingId = null;
  showToast(`"${name}" removed from portfolio`, 'success');
});

/* ── FILE UPLOAD ── */
const dropZone = document.getElementById('dropZone');
const folderInput = document.getElementById('folderInput');
const fileInput = document.getElementById('fileInput');
const fileList = document.getElementById('fileList');
const metaForm = document.getElementById('metaForm');
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
dropZone?.addEventListener('dragleave', e => { if (!dropZone.contains(e.relatedTarget)) dropZone.classList.remove('drag-over'); });

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
    } else { resolve([]); }
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
    const htmlFile = newFiles.find(f => f._cleanPath === 'index.html' || f.name === 'index.html');
    let suggested = rootFolder || (htmlFile ? '' : (newFiles[0]?.name || ''));
    if (suggested) {
      const nice = suggested.replace(/[_-]/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
      titleIn.value = nice;
      const slugIn = document.getElementById('mSlug');
      if(slugIn) slugIn.value = 'demos/' + suggested.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
    }
  }
}

function renderFileList() {
  if (!fileList) return;
  if (!uploadedFiles.length) { fileList.innerHTML = ''; return; }
  let html = '';
  uploadedFiles.forEach((f, i) => {
    html += `<div class="file-item">
      <div class="file-icon"><i class="fas fa-file"></i></div>
      <span class="file-name">${f._cleanPath || f.name}</span>
      <span class="file-size">${(f.size/1024).toFixed(1)}KB</span>
      <button class="file-remove" onclick="removeFile(${i})"><i class="fas fa-xmark"></i></button>
    </div>`;
  });
  fileList.innerHTML = html;
}

window.removeFile = function(i) {
  uploadedFiles.splice(i, 1);
  renderFileList();
}

/* ── PUBLISH ── */
document.getElementById('publishBtn')?.addEventListener('click', () => publishDemo(false));
document.getElementById('saveDraftBtn')?.addEventListener('click', () => publishDemo(true));

async function publishDemo(asDraft) {
  const title = document.getElementById('mTitle').value.trim();
  const slug = document.getElementById('mSlug').value.trim().replace(/\/+$/, '');
  const category = document.getElementById('mCategory').value;
  const color = document.getElementById('mColorHex').value || '#6c63ff';
  const desc = document.getElementById('mDesc').value.trim();
  const status = asDraft ? 'draft' : (document.getElementById('mStatus').value || 'live');

  if (!title || !slug || !category || !desc) { showToast('Please fill in all required fields.', 'error'); return; }

  const newDemo = {
    id: slug.split('/').pop() + '-' + Date.now(),
    title, slug, category, color, description: desc, status,
    tags: document.getElementById('mTags').value.split(',').map(t=>t.trim()).filter(Boolean),
    created_at: new Date().toISOString(),
    builtin: false
  };

  const ghConfig = loadGhConfig();
  if (ghConfig && ghConfig.token && ghConfig.user && ghConfig.repo) {
    await pushToGitHub(ghConfig, slug, uploadedFiles, newDemo);
  } else {
    // Just Supabase
    await saveToSupabase(newDemo);
    demos.unshift(newDemo);
    renderTables();
    showToast(`"${title}" saved to database. Configure GitHub to deploy files.`, 'success');
    resetUploadForm();
    switchView('demos');
  }
}

async function pushToGitHub(cfg, slug, files, demo) {
  const progWrap = document.getElementById('progressWrap');
  const progBar = document.getElementById('progressBar');
  const progPct = document.getElementById('progressPct');
  const progLbl = document.getElementById('progressLabel');
  
  if(progWrap) progWrap.classList.add('show');

  try {
    const base = `https://api.github.com/repos/${cfg.user}/${cfg.repo}/contents`;
    const headers = { 'Authorization': `Bearer ${cfg.token}`, 'Accept': 'application/vnd.github.v3+json' };

    for (const file of files) {
      if(progLbl) progLbl.textContent = `Uploading ${file._cleanPath}...`;
      const reader = new FileReader();
      const contentB64 = await new Promise(res => {
        reader.onload = () => res(reader.result.split(',')[1]);
        reader.readAsDataURL(file);
      });

      const path = `${slug}/${file._cleanPath}`;
      await fetch(`${base}/${path}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ message: `Add ${path}`, content: contentB64 })
      });
    }

    // Update demos.json registry in GitHub
    if(progLbl) progLbl.textContent = 'Updating registry...';
    const regRes = await fetch(`${base}/demos.json`, { headers });
    let regData = [];
    let sha = null;
    if (regRes.ok) {
       const j = await regRes.json();
       sha = j.sha;
       regData = JSON.parse(atob(j.content));
    }
    regData.unshift(demo);
    await fetch(`${base}/demos.json`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ message: 'Update demos.json', content: btoa(JSON.stringify(regData, null, 2)), sha })
    });

    // Save to Supabase
    await saveToSupabase(demo);
    demos.unshift(demo);
    renderTables();

    showToast('🚀 Successfully pushed to GitHub & Database!', 'success');
    resetUploadForm();
    switchView('demos');
  } catch (err) {
    showToast('Error: ' + err.message, 'error');
  } finally {
    if(progWrap) progWrap.classList.remove('show');
  }
}

function resetUploadForm() {
  uploadedFiles = [];
  renderFileList();
  if(metaForm) metaForm.style.display = 'none';
  if(uploadActions) uploadActions.style.display = 'none';
}

/* ── GITHUB CONFIG ── */
function loadGhConfig() {
  const s = localStorage.getItem(GH_KEY);
  return s ? JSON.parse(s) : null;
}

function loadGhConfigIntoForm() {
  const cfg = loadGhConfig();
  if (!cfg) return;
  ['ghUser','ghRepo','ghBranch','ghToken'].forEach(id => {
    const val = cfg[id.replace('gh','').toLowerCase()];
    const el = document.getElementById(id);
    if(el && val) el.value = val;
  });
}

document.getElementById('ghSaveBtn')?.addEventListener('click', () => {
  const cfg = {
    user: document.getElementById('ghUser').value.trim(),
    repo: document.getElementById('ghRepo').value.trim(),
    branch: document.getElementById('ghBranch').value.trim() || 'main',
    token: document.getElementById('ghToken').value.trim()
  };
  localStorage.setItem(GH_KEY, JSON.stringify(cfg));
  showToast('GitHub config saved.', 'success');
});

document.getElementById('ghTestBtn')?.addEventListener('click', async () => {
  const cfg = loadGhConfig();
  if (!cfg) { showToast('Save config first', 'error'); return; }
  try {
    const res = await fetch(`https://api.github.com/repos/${cfg.user}/${cfg.repo}`, {
      headers: { 'Authorization': `Bearer ${cfg.token}` }
    });
    if (res.ok) showToast('GitHub Connected!', 'success');
    else showToast('Connection Failed', 'error');
  } catch(e) { showToast('Network Error', 'error'); }
});

/* ── TOAST ── */
function showToast(msg, type = 'info') {
  const stack = document.getElementById('toastStack');
  if(!stack) return;
  const t = document.createElement('div');
  t.className = `toast ${type} show`;
  t.innerHTML = `<i class="fas fa-info-circle"></i> <span>${msg}</span>`;
  stack.appendChild(t);
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 500); }, 3000);
}

/* ── INIT ── */
loadAllDemos();
