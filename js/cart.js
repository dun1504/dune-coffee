/**
 * cart.js — Shopping cart logic
 * Cart items stored in localStorage as: { id, name, price, img, qty }
 * Dispatches 'cartUpdated' event on every change.
 */

const CART_KEY = 'cart';

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event('cartUpdated'));
}

/** Add item to cart; increments qty if already present */
function addToCart(item) {
  const cart = getCart();
  const ex = cart.find(i => i.id === item.id);
  ex ? ex.qty++ : cart.push({ ...item, qty: 1 });
  saveCart(cart);
}

/** Set qty for an item; removes if qty <= 0 */
function updateQty(id, qty) {
  let cart = getCart();
  if (qty <= 0) cart = cart.filter(i => i.id !== id);
  else { const it = cart.find(i => i.id === id); if (it) it.qty = qty; }
  saveCart(cart);
}

/** Remove item by id */
function removeFromCart(id) { saveCart(getCart().filter(i => i.id !== id)); }

/** Clear entire cart */
function clearCart() { localStorage.removeItem(CART_KEY); window.dispatchEvent(new Event('cartUpdated')); }

/** Total item count */
function getCartCount() { return getCart().reduce((s, i) => s + i.qty, 0); }

/** Total price */
function getCartTotal() { return getCart().reduce((s, i) => s + i.price * i.qty, 0); }

/** Format VND */
function formatVND(n) { return n.toLocaleString('vi-VN') + 'đ'; }

/** Render cart items into sidebar */
function renderCartItems() {
  const cart = getCart();
  const el = document.getElementById('cartItems');
  if (!el) return;
  if (!cart.length) {
    el.innerHTML = '<p class="empty-cart">Giỏ hàng trống</p>';
  } else {
    el.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.name}" onerror="this.src='img/menu-1.png'" />
        <div class="cart-item-info">
          <p>${item.name}</p>
          <small>${formatVND(item.price)}</small>
          <div class="cart-qty">
            <button onclick="updateQty('${item.id}', ${item.qty - 1})">−</button>
            <span>${item.qty}</span>
            <button onclick="updateQty('${item.id}', ${item.qty + 1})">+</button>
            <button class="cart-remove" onclick="removeFromCart('${item.id}')">🗑</button>
          </div>
        </div>
      </div>`).join('');
  }
  const totalEl = document.getElementById('cartTotal');
  if (totalEl) totalEl.textContent = formatVND(getCartTotal());
}

/** Update cart badge count in navbar */
function updateCartBadge() {
  const badge = document.getElementById('cartBadge');
  if (badge) badge.textContent = getCartCount();
}

/** Open cart sidebar */
function openCart() {
  renderCartItems();
  document.getElementById('cartSidebar')?.classList.add('open');
  document.getElementById('cartOverlay')?.classList.add('open');
}

/** Close cart sidebar */
function closeCart() {
  document.getElementById('cartSidebar')?.classList.remove('open');
  document.getElementById('cartOverlay')?.classList.remove('open');
}

// Keep badge and items in sync
window.addEventListener('cartUpdated', () => { updateCartBadge(); renderCartItems(); });
