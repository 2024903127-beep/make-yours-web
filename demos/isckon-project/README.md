# 🕉️ Krishna Prasadam

> **Pure Satvik Prasadam Delivered To Your Home**

A spiritual food delivery platform connecting devotees with ISKCON temple kitchens that cook satvik vegetarian food (no onion, no garlic) offered to Lord Krishna.

![Krishna Prasadam](https://img.shields.io/badge/Spiritual-Food%20Delivery-FF6B00?style=for-the-badge&logo=data:image/svg+xml;base64,...)

---

## ✨ Features

- 🏠 **Home Page** — Hero section, features, how it works, testimonials
- 🍛 **Menu Page** — 15+ prasadam items across 5 categories with cart functionality
- 🏛️ **Temple Finder** — Locate nearest ISKCON kitchens with search & geolocation
- 🛒 **Order System** — Full cart, checkout, mock Razorpay payment integration
- 📍 **Live Order Tracking** — Animated 5-step order progress tracker
- 🙏 **Donation Section** — Annadaan campaigns with progress bars
- ⚙️ **Admin Panel** — Orders dashboard, menu management, temple network view
- 📱 **Mobile First** — Fully responsive across all devices

---

## 🎨 Design System

| Element | Value |
|---|---|
| Primary Font | Cormorant Garamond (Serif) |
| UI Font | DM Sans |
| Saffron | `#FF6B00` |
| Gold | `#C8962E` |
| Cream | `#FDF6EC` |
| Theme | Spiritual + Modern, Lotus patterns, Mandala backgrounds |

---

## 🚀 Deploy on GitHub Pages

### Step 1: Create Repository
```bash
git init
git add .
git commit -m "Initial commit — Krishna Prasadam v1.0"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/krishna-prasadam.git
git push -u origin main
```

### Step 2: Enable GitHub Pages
1. Go to **Settings** → **Pages**
2. Source: **Deploy from a branch**
3. Branch: `main` / `/ (root)`
4. Click **Save**

Your site will be live at: `https://YOUR_USERNAME.github.io/krishna-prasadam`

---

## 📁 Project Structure

```
krishna-prasadam/
├── index.html          # Main SPA — all pages
├── css/
│   └── main.css        # Complete design system
├── js/
│   └── app.js          # Application logic
├── data/
│   └── db.json         # Mock database (temples, menu, orders)
├── README.md
└── .gitignore
```

---

## 🛠️ Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Fonts**: Google Fonts (Cormorant Garamond, DM Sans)
- **Data**: Local JSON database
- **Payment**: Mock Razorpay UI integration
- **Architecture**: Single Page Application (SPA)

---

## 🔌 Integration Points

### Connect Real APIs:
1. **Google Maps** — Replace map placeholder in Temple Finder
2. **Razorpay** — Replace mock payment with real Razorpay SDK
3. **Backend API** — Replace `data/db.json` fetch with REST API calls
4. **Firebase/Supabase** — For real-time order tracking

### Razorpay Integration:
```javascript
// Replace mock in js/app.js processDonation()
const rzp = new Razorpay({
  key: 'YOUR_RAZORPAY_KEY',
  amount: amount * 100,
  currency: 'INR',
  name: 'Krishna Prasadam',
  description: 'Prasadam Order',
  handler: function(response) { /* handle success */ }
});
rzp.open();
```

---

## 🙏 Credits

Inspired by ISKCON's global mission of spreading love, devotion and prasadam to all.

**Hare Krishna Hare Krishna Krishna Krishna Hare Hare** 🌸
**Hare Rama Hare Rama Rama Rama Hare Hare**

---

*Made with 🧡 and devotion | © 2025 Krishna Prasadam*
