/**
 * main.js — Entry point for index.html.
 * Initialises auth UI, cart badge, loads menu data and blogs.
 */

/** Show a toast notification */
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

/** Format number as Vietnamese currency */
function formatVND(n) { return n.toLocaleString('vi-VN') + 'đ'; }

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  updateAuthUI();
  updateCartBadge();

  // Cart button
  document.getElementById('cartBtn')?.addEventListener('click', openCart);
  document.getElementById('cartOverlay')?.addEventListener('click', closeCart);

  // Load data
  if (document.getElementById('menuGrid')) loadMenuData();
  if (document.getElementById('blogGrid')) loadBlogs();
});
