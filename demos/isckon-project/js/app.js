// =============================================
//  KRISHNA PRASADAM — MAIN APPLICATION JS
// =============================================

// ===== STATE =====
const AppState = {
  cart: JSON.parse(localStorage.getItem('kp_cart') || '[]'),
  currentPage: 'home',
  currentCategory: 'all',
  currentOrderId: null,
  db: null
};

// ===== LOAD DATA =====
async function loadDB() {
  try {
    const res = await fetch('data/db.json');
    AppState.db = await res.json();
  } catch (e) {
    // Fallback inline data if fetch fails
    AppState.db = getInlineDB();
  }
}

function getInlineDB() {
  return {
    temples: [
      { id: 1, name: "ISKCON Mumbai", address: "Hare Krishna Land, Juhu, Mumbai", lat: 19.1075, lng: 72.8263, phone: "+91-22-26206860", timings: "4:30 AM - 9:00 PM", rating: 4.9 },
      { id: 2, name: "ISKCON Delhi", address: "Sant Nagar, East of Kailash, New Delhi", lat: 28.5494, lng: 77.2437, phone: "+91-11-26234942", timings: "4:30 AM - 9:00 PM", rating: 4.8 },
      { id: 3, name: "ISKCON Vrindavan", address: "Bhaktivedanta Swami Marg, Vrindavan", lat: 27.5706, lng: 77.6721, phone: "+91-565-2540021", timings: "4:30 AM - 9:00 PM", rating: 5.0 },
      { id: 4, name: "ISKCON Bangalore", address: "Hare Krishna Hill, Rajaji Nagar, Bangalore", lat: 12.9891, lng: 77.5553, phone: "+91-80-23471956", timings: "4:30 AM - 9:00 PM", rating: 4.9 },
      { id: 5, name: "ISKCON Kolkata", address: "3C Albert Road, Kolkata", lat: 22.5408, lng: 88.3489, phone: "+91-33-22872777", timings: "4:30 AM - 9:00 PM", rating: 4.7 }
    ],
    categories: [
      { id: 1, name: "Prasadam Thali", icon: "🍱", description: "Complete blessed meal offerings" },
      { id: 2, name: "Satvik Lunch", icon: "🥘", description: "Pure vegetarian afternoon meals" },
      { id: 3, name: "Ekadashi Meals", icon: "🌿", description: "Special fasting day preparations" },
      { id: 4, name: "Temple Sweets", icon: "🍬", description: "Handmade sacred confections" },
      { id: 5, name: "Festival Specials", icon: "🪔", description: "Festive occasion delicacies" }
    ],
    menu: [
      { id: 1, categoryId: 1, name: "Maha Prasadam Thali", description: "Complete thali with 2 sabzis, dal, rice, roti, raita, papad, and kheer — offered to Lord Krishna", price: 180, image: "🍛", badge: "Bestseller" },
      { id: 2, categoryId: 1, name: "Ekadashi Thali", description: "Special fasting thali with sabudana khichdi, sendha namak preparations, fruits and falahaar", price: 160, image: "🥗", badge: "Ekadashi" },
      { id: 3, categoryId: 1, name: "Janmashtami Thali", description: "Festive thali prepared on auspicious occasions with panchamrit and special bhog items", price: 220, image: "🎋", badge: "Festival" },
      { id: 4, categoryId: 2, name: "Satvik Dal Rice", description: "Simple pure dal chawal with ghee, cooked without onion-garlic in the temple tradition", price: 120, image: "🍚", badge: null },
      { id: 5, categoryId: 2, name: "Paneer Sabzi & Roti", description: "Fresh paneer cooked in tomato-based masala, served with soft whole wheat rotis", price: 150, image: "🧀", badge: "Popular" },
      { id: 6, categoryId: 2, name: "Khichdi Prasadam", description: "The sacred khichdi of Jagannath, cooked in earthen pots with pure ghee and temple spices", price: 110, image: "🥣", badge: "Temple Special" },
      { id: 7, categoryId: 3, name: "Sabudana Khichdi", description: "Light and nutritious sago pearls with peanuts, cooked in pure ghee — perfect for Ekadashi", price: 100, image: "🫙", badge: "Ekadashi" },
      { id: 8, categoryId: 3, name: "Makhana Kheer", description: "Fox nut kheer slow-cooked in full cream milk with cardamom, saffron and dry fruits", price: 90, image: "🥛", badge: null },
      { id: 9, categoryId: 3, name: "Aloo Sendha Namak", description: "Satvik potatoes cooked in rock salt and pure ghee, a staple Ekadashi preparation", price: 80, image: "🥔", badge: null },
      { id: 10, categoryId: 4, name: "Ladoo Prasadam", description: "The legendary besan ladoos of ISKCON, offered to Radha-Krishna and then distributed as prasadam", price: 60, image: "🟡", badge: "Divine" },
      { id: 11, categoryId: 4, name: "Panchamrit", description: "Sacred mixture of milk, curd, ghee, honey, and sugar — used in abhishek rituals", price: 50, image: "🍯", badge: "Sacred" },
      { id: 12, categoryId: 4, name: "Mathura Peda", description: "Soft milk-based sweets from the land of Krishna, made with pure khoya and cardamom", price: 80, image: "🍮", badge: "Mathura Special" },
      { id: 13, categoryId: 5, name: "Janmashtami Bhog", description: "56 item bhog prepared on the auspicious birthday of Lord Krishna — a divine feast", price: 350, image: "🎊", badge: "Festival" },
      { id: 14, categoryId: 5, name: "Holi Thandai", description: "Traditional chilled thandai with almonds, rose petals, cardamom and milk", price: 70, image: "🌸", badge: "Holi Special" },
      { id: 15, categoryId: 5, name: "Diwali Mithai Box", description: "Assorted temple sweets — kaju katli, barfi, besan ladoo packed in an auspicious gift box", price: 250, image: "🪔", badge: "Diwali" }
    ],
    donations: [
      { id: 1, name: "Annadaan - Feed the Needy", description: "Sponsor a complete meal for someone in need. ₹50 feeds one person.", target: 100000, raised: 67500, icon: "🍽️" },
      { id: 2, name: "Temple Kitchen Support", description: "Help maintain and upgrade ISKCON temple kitchens across India.", target: 500000, raised: 234000, icon: "🏛️" },
      { id: 3, name: "Go-Seva (Cow Protection)", description: "Support temple cows that provide pure milk for prasadam preparations.", target: 200000, raised: 89000, icon: "🐄" }
    ]
  };
}

// ===== CART FUNCTIONS =====
function saveCart() {
  localStorage.setItem('kp_cart', JSON.stringify(AppState.cart));
  updateCartUI();
}

function addToCart(itemId) {
  const item = AppState.db.menu.find(m => m.id === itemId);
  if (!item) return;
  const existing = AppState.cart.find(c => c.id === itemId);
  if (existing) {
    existing.qty++;
  } else {
    AppState.cart.push({ id: itemId, name: item.name, price: item.price, image: item.image, qty: 1 });
  }
  saveCart();
  showToast(`${item.name} added to cart 🙏`, 'success');
  updateMenuCardQty(itemId);
}

function removeFromCart(itemId) {
  const existing = AppState.cart.find(c => c.id === itemId);
  if (!existing) return;
  if (existing.qty > 1) {
    existing.qty--;
  } else {
    AppState.cart = AppState.cart.filter(c => c.id !== itemId);
  }
  saveCart();
  updateMenuCardQty(itemId);
}

function clearCart() {
  AppState.cart = [];
  saveCart();
}

function getCartTotal() {
  return AppState.cart.reduce((s, c) => s + c.price * c.qty, 0);
}

function getCartCount() {
  return AppState.cart.reduce((s, c) => s + c.qty, 0);
}

function updateCartUI() {
  const count = getCartCount();
  const badge = document.getElementById('cart-badge');
  const countEl = document.getElementById('cart-count');
  if (badge) badge.textContent = count;
  if (countEl) countEl.textContent = count;
  badge && (badge.style.display = count > 0 ? 'flex' : 'none');
  renderCartItems();
}

function renderCartItems() {
  const container = document.getElementById('cart-items');
  if (!container) return;
  if (AppState.cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        <span class="icon">🛒</span>
        <p>Your cart is empty.<br>Discover our divine prasadam.</p>
      </div>`;
    document.getElementById('cart-total-row').style.display = 'none';
    return;
  }
  document.getElementById('cart-total-row').style.display = 'block';
  container.innerHTML = AppState.cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-icon">${item.image}</div>
      <div class="cart-item-info">
        <h5>${item.name}</h5>
        <span class="price">₹${item.price} × ${item.qty} = ₹${item.price * item.qty}</span>
      </div>
      <div class="qty-control">
        <button class="qty-btn" onclick="removeFromCart(${item.id})">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" onclick="addToCart(${item.id})">+</button>
      </div>
    </div>`).join('');

  const subtotal = getCartTotal();
  const delivery = subtotal > 0 ? 30 : 0;
  document.getElementById('cart-subtotal').textContent = `₹${subtotal}`;
  document.getElementById('cart-delivery').textContent = `₹${delivery}`;
  document.getElementById('cart-grand').textContent = `₹${subtotal + delivery}`;
}

function updateMenuCardQty(itemId) {
  const card = document.querySelector(`[data-item-id="${itemId}"]`);
  if (!card) return;
  const cartItem = AppState.cart.find(c => c.id === itemId);
  const addBtn = card.querySelector('.add-btn');
  const qtyCtrl = card.querySelector('.qty-control');
  const qtyNum = card.querySelector('.qty-num');
  if (cartItem && cartItem.qty > 0) {
    if (addBtn) addBtn.style.display = 'none';
    if (qtyCtrl) { qtyCtrl.style.display = 'flex'; if (qtyNum) qtyNum.textContent = cartItem.qty; }
  } else {
    if (addBtn) addBtn.style.display = 'flex';
    if (qtyCtrl) qtyCtrl.style.display = 'none';
  }
}

// ===== NAVIGATION =====
function showPage(page) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(`page-${page}`);
  if (target) target.classList.add('active');
  AppState.currentPage = page;

  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.dataset.page === page);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
  closeCart();

  if (page === 'menu') renderMenu();
  if (page === 'temples') renderTemples();
  if (page === 'donate') renderDonations();
  if (page === 'checkout') renderCheckout();
  if (page === 'admin') renderAdmin();
}

// ===== NAVBAR SCROLL =====
function initNavbar() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  });
}

// ===== HAMBURGER MENU =====
function initMobileMenu() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-nav');
  btn && btn.addEventListener('click', () => {
    menu.classList.toggle('open');
  });
}

// ===== CART SIDEBAR =====
function openCart() {
  document.getElementById('cart-sidebar').classList.add('open');
  document.getElementById('cart-overlay').classList.add('visible');
}

function closeCart() {
  document.getElementById('cart-sidebar').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('visible');
}

// ===== TOAST =====
function showToast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${type === 'success' ? '✅' : 'ℹ️'}</span> ${msg}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideInRight 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ===== RENDER MENU =====
function renderMenu(catId = null) {
  const grid = document.getElementById('menu-grid');
  if (!grid || !AppState.db) return;

  const items = catId
    ? AppState.db.menu.filter(m => m.categoryId === catId)
    : AppState.db.menu;

  grid.innerHTML = items.map(item => {
    const cartItem = AppState.cart.find(c => c.id === item.id);
    const qty = cartItem ? cartItem.qty : 0;
    return `
    <div class="menu-card slide-up" data-item-id="${item.id}">
      <div class="menu-card-img">
        <span style="font-size:4rem">${item.image || '🍛'}</span>
        ${item.badge ? `<span class="menu-badge">${item.badge}</span>` : ''}
      </div>
      <div class="menu-card-body">
        <h4>${item.name}</h4>
        <p>${item.description}</p>
        <div class="menu-card-footer">
          <div class="menu-price">₹${item.price} <span>/ serving</span></div>
          <button class="add-btn" onclick="addToCart(${item.id})" style="display:${qty > 0 ? 'none' : 'flex'}">+</button>
          <div class="qty-control" style="display:${qty > 0 ? 'flex' : 'none'}">
            <button class="qty-btn" onclick="removeFromCart(${item.id})">−</button>
            <span class="qty-num">${qty}</span>
            <button class="qty-btn" onclick="addToCart(${item.id})">+</button>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');
}

function renderCategoryTabs() {
  const tabs = document.getElementById('category-tabs');
  if (!tabs || !AppState.db) return;
  tabs.innerHTML = `
    <button class="cat-tab active" data-cat-id="all" onclick="filterMenu(this, null)">🕉️ All Items</button>
    ${AppState.db.categories.map(c => `
      <button class="cat-tab" data-cat-id="${c.id}" onclick="filterMenu(this, ${c.id})">${c.icon} ${c.name}</button>
    `).join('')}`;
}

function filterMenu(btn, catId) {
  document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  renderMenu(catId);
}

// ===== RENDER TEMPLES =====
function renderTemples(query = '') {
  const container = document.getElementById('temple-list');
  if (!container || !AppState.db) return;
  const temples = query
    ? AppState.db.temples.filter(t =>
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.address.toLowerCase().includes(query.toLowerCase()))
    : AppState.db.temples;

  container.innerHTML = temples.map(t => `
    <div class="temple-card slide-up">
      <div class="temple-card-top">
        <div class="temple-icon">🏛️</div>
        <div class="temple-info">
          <h4>${t.name}</h4>
          <p>📍 ${t.address}</p>
        </div>
      </div>
      <div class="temple-meta">
        <span class="temple-tag">⏰ ${t.timings}</span>
        <span class="temple-tag">📞 ${t.phone}</span>
      </div>
      <div style="display:flex; justify-content:space-between; align-items:center">
        <div class="temple-rating">⭐ ${t.rating} <span style="color:var(--text-light);font-weight:400;font-size:0.78rem"> / 5.0</span></div>
        <button class="btn btn-primary btn-sm" onclick="selectTemple('${t.name}')">Order from here</button>
      </div>
    </div>`).join('');
}

function selectTemple(name) {
  showToast(`${name} selected as your temple kitchen 🏛️`, 'success');
  setTimeout(() => showPage('menu'), 1000);
}

// ===== RENDER DONATIONS =====
function renderDonations() {
  const container = document.getElementById('donation-cards');
  if (!container || !AppState.db) return;
  container.innerHTML = AppState.db.donations.map(d => {
    const pct = Math.round((d.raised / d.target) * 100);
    return `
    <div class="donation-card slide-up">
      <div class="donation-icon-wrap">${d.icon}</div>
      <h4>${d.name}</h4>
      <p>${d.description}</p>
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
      <div class="progress-text">
        <span>₹${(d.raised/1000).toFixed(1)}K raised</span>
        <span>${pct}% of ₹${(d.target/1000).toFixed(0)}K</span>
      </div>
      <button class="btn btn-primary" style="width:100%" onclick="openDonateModal('${d.name}')">🙏 Donate Now</button>
    </div>`;
  }).join('');
}

function openDonateModal(cause) {
  const modal = document.getElementById('donate-modal');
  document.getElementById('donate-cause').textContent = cause;
  modal.classList.add('open');
}

// ===== RENDER CHECKOUT =====
function renderCheckout() {
  if (AppState.cart.length === 0) {
    showPage('menu');
    showToast('Add items to cart first!', 'info');
    return;
  }
  const summaryEl = document.getElementById('checkout-summary-items');
  if (summaryEl) {
    const subtotal = getCartTotal();
    const delivery = 30;
    summaryEl.innerHTML = AppState.cart.map(item => `
      <div style="display:flex;justify-content:space-between;margin-bottom:10px;font-size:0.88rem">
        <span style="color:var(--text-mid)">${item.image} ${item.name} ×${item.qty}</span>
        <span style="color:var(--text-dark);font-weight:600">₹${item.price * item.qty}</span>
      </div>`).join('') +
    `<div style="border-top:var(--border-gold);padding-top:12px;margin-top:4px">
      <div style="display:flex;justify-content:space-between;font-size:0.85rem;color:var(--text-light);margin-bottom:6px">
        <span>Subtotal</span><span>₹${subtotal}</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:0.85rem;color:var(--text-light);margin-bottom:6px">
        <span>Delivery</span><span>₹${delivery}</span>
      </div>
      <div style="display:flex;justify-content:space-between;font-family:var(--font-serif);font-size:1.1rem;font-weight:600;margin-top:10px;padding-top:10px;border-top:var(--border-gold)">
        <span>Total</span><span style="color:var(--saffron)">₹${subtotal + delivery}</span>
      </div>
    </div>`;
  }
}

// ===== MOCK RAZORPAY =====
function initRazorpay() {
  const payBtn = document.getElementById('pay-btn');
  if (!payBtn) return;
  payBtn.addEventListener('click', () => {
    const name = document.getElementById('checkout-name')?.value?.trim();
    const address = document.getElementById('checkout-address')?.value?.trim();
    if (!name || !address) {
      showToast('Please fill in your name and address', 'info');
      return;
    }
    payBtn.disabled = true;
    payBtn.textContent = 'Processing...';
    // Simulate Razorpay
    setTimeout(() => {
      const orderId = 'KP' + Date.now().toString().slice(-6);
      AppState.currentOrderId = orderId;
      clearCart();
      showOrderSuccess(orderId);
    }, 2000);
  });
}

function showOrderSuccess(orderId) {
  const modal = document.getElementById('order-success-modal');
  document.getElementById('success-order-id').textContent = orderId;
  modal.classList.add('open');
}

// ===== ORDER TRACKING =====
function startTracking(orderId) {
  const modal = document.getElementById('order-success-modal');
  modal.classList.remove('open');
  document.getElementById('track-order-id').textContent = orderId || AppState.currentOrderId || 'KP' + Date.now().toString().slice(-6);
  showPage('tracking');
  simulateOrderProgress();
}

function simulateOrderProgress() {
  const steps = ['placed', 'confirmed', 'preparing', 'transit', 'delivered'];
  const stepEls = document.querySelectorAll('.track-step');
  let current = 0;

  // Reset
  stepEls.forEach(s => { s.classList.remove('done', 'active', 'pending'); s.classList.add('pending'); });

  function advance() {
    if (current < steps.length) {
      stepEls.forEach((s, i) => {
        s.classList.remove('done', 'active', 'pending');
        if (i < current) s.classList.add('done');
        else if (i === current) s.classList.add('active');
        else s.classList.add('pending');
      });
      current++;
      if (current < steps.length) setTimeout(advance, 3000);
    }
  }
  advance();
}

// ===== RENDER ADMIN =====
function renderAdmin() {
  renderAdminOrders();
  renderAdminMenu();
}

function renderAdminOrders() {
  const tbody = document.getElementById('admin-orders-tbody');
  if (!tbody || !AppState.db) return;
  const mockOrders = [
    { id: 'KP001', customer: 'Radha Sharma', items: 'Maha Prasadam Thali ×2', total: 390, status: 'delivered', time: '12:30 PM' },
    { id: 'KP002', customer: 'Govind Patel', items: 'Khichdi Prasadam ×1, Makhana Kheer ×2', total: 290, status: 'preparing', time: '1:00 PM' },
    { id: 'KP003', customer: 'Tulsi Devi', items: 'Ladoo Prasadam ×4, Satvik Dal Rice', total: 360, status: 'transit', time: '1:30 PM' },
    { id: 'KP004', customer: 'Arjun Singh', items: 'Ekadashi Thali ×2', total: 320, status: 'pending', time: '1:45 PM' },
    { id: 'KP005', customer: 'Meera Bai', items: 'Diwali Mithai Box ×1', total: 250, status: 'delivered', time: '11:00 AM' },
  ];
  tbody.innerHTML = mockOrders.map(o => `
    <tr>
      <td><strong>${o.id}</strong></td>
      <td>${o.customer}</td>
      <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis">${o.items}</td>
      <td style="font-weight:600;color:var(--saffron)">₹${o.total}</td>
      <td>${o.time}</td>
      <td><span class="status-badge status-${o.status}">${o.status.charAt(0).toUpperCase() + o.status.slice(1)}</span></td>
      <td>
        <select onchange="updateOrderStatus('${o.id}', this.value)" style="padding:4px 8px;border:var(--border-gold);border-radius:6px;font-size:0.78rem;background:var(--cream)">
          <option value="pending" ${o.status==='pending'?'selected':''}>Pending</option>
          <option value="preparing" ${o.status==='preparing'?'selected':''}>Preparing</option>
          <option value="transit" ${o.status==='transit'?'selected':''}>Out for Delivery</option>
          <option value="delivered" ${o.status==='delivered'?'selected':''}>Delivered</option>
        </select>
      </td>
    </tr>`).join('');
}

function renderAdminMenu() {
  const tbody = document.getElementById('admin-menu-tbody');
  if (!tbody || !AppState.db) return;
  tbody.innerHTML = AppState.db.menu.slice(0, 8).map(item => `
    <tr>
      <td>${item.image} ${item.name}</td>
      <td>${AppState.db.categories.find(c => c.id === item.categoryId)?.name || '-'}</td>
      <td style="font-weight:600">₹${item.price}</td>
      <td><span class="status-badge status-delivered">Active</span></td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="showToast('Edit feature coming soon', 'info')">Edit</button>
      </td>
    </tr>`).join('');
}

function updateOrderStatus(id, status) {
  showToast(`Order ${id} status updated to ${status}`, 'success');
}

function showAdminTab(tab) {
  document.querySelectorAll('.admin-panel').forEach(p => p.style.display = 'none');
  document.getElementById(`admin-${tab}`).style.display = 'block';
  document.querySelectorAll('.admin-nav-item').forEach(i => i.classList.remove('active'));
  document.querySelector(`[data-admin="${tab}"]`).classList.add('active');
}

// ===== TEMPLE SEARCH =====
function initTempleSearch() {
  const input = document.getElementById('temple-search-input');
  if (!input) return;
  input.addEventListener('input', () => renderTemples(input.value));
}

function detectLocation() {
  if (!navigator.geolocation) { showToast('Geolocation not supported', 'info'); return; }
  showToast('Detecting your location...', 'info');
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      showToast('Found your location! Showing nearest temples 📍', 'success');
      renderTemples();
    },
    () => showToast('Could not detect location. Showing all temples.', 'info')
  );
}

// ===== SMOOTH COUNTER =====
function animateCounters() {
  const counters = document.querySelectorAll('[data-count]');
  counters.forEach(el => {
    const target = parseInt(el.dataset.count);
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current).toLocaleString();
    }, 20);
  });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
        if (entry.target.dataset.count) animateCounters();
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.step-card, .feature-item, .donation-card, .temple-card').forEach(el => {
    observer.observe(el);
  });
}

// ===== PAYMENT METHOD SELECTION =====
function initPaymentMethods() {
  document.querySelectorAll('.payment-opt').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.payment-opt').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
    });
  });
  // Select first by default
  const first = document.querySelector('.payment-opt');
  if (first) first.classList.add('selected');
}

// ===== INIT =====
async function init() {
  await loadDB();

  // Hide loading screen
  setTimeout(() => {
    const ls = document.getElementById('loading-screen');
    if (ls) { ls.style.opacity = '0'; setTimeout(() => ls.remove(), 500); }
  }, 1500);

  initNavbar();
  initMobileMenu();
  renderCategoryTabs();
  updateCartUI();
  initScrollAnimations();
  initTempleSearch();
  initPaymentMethods();
  initRazorpay();
  animateCounters();

  // Initial page
  showPage('home');
}

document.addEventListener('DOMContentLoaded', init);
