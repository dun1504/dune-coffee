# Na Coffee — Static Website

Pure HTML, CSS, and vanilla JS. No backend, no build tools.

## Structure

```
na-coffee/
├── index.html          # Home page (all sections)
├── login.html          # Login page
├── register.html       # Register page
├── dashboard.html      # User dashboard (orders + profile)
├── checkout.html       # Checkout page
├── order-success.html  # Order confirmation page
├── style/
│   ├── style.css       # Global styles, navbar, auth, dashboard, checkout
│   ├── hero.css        # Hero section
│   ├── menu.css        # Product cards, filters, blog cards
│   └── cart.css        # Cart sidebar
├── js/
│   ├── main.js         # Entry point — init, toast, formatVND
│   ├── auth.js         # Auth helpers (localStorage-based)
│   ├── cart.js         # Cart logic (localStorage)
│   ├── menu.js         # Load + filter products from JSON
│   ├── blog.js         # Load blogs from JSON
│   └── contact.js      # Contact form (logs to console)
├── data/
│   ├── products.json   # Coffee products
│   ├── accessories.json # Accessories
│   └── blogs.json      # Blog posts
└── img/                # All images
```

## How to run

Open `index.html` in a browser. Because JS uses `fetch()` to load JSON files,
you need a local server (CORS blocks file:// fetches):

```bash
# Python
python -m http.server 8080

# Node (npx)
npx serve .
```

Then open http://localhost:8080

## Auth

Users are stored in localStorage (`na_users`). Register creates an account,
login checks against stored users. No real password hashing (static demo).

## Cart

Cart is stored in localStorage as `cart`. Persists across page reloads.
