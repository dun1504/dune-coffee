/**
 * menu.js — Loads products and accessories from JSON files.
 * Supports filter by category, search by name/description, and sort.
 */

let allProducts = [];
let allAccessories = [];
let currentCategory = 'coffee';
let currentSearch = '';
let currentSort = '';

/** Load products and accessories from data/ JSON files */
async function loadMenuData() {
  try {
    const [pRes, aRes] = await Promise.all([
      fetch('data/products.json'),
      fetch('data/accessories.json')
    ]);
    allProducts = await pRes.json();
    allAccessories = await aRes.json();
    renderMenu();
    renderAccessories();
  } catch (err) {
    console.error('Failed to load menu data:', err);
    const grid = document.getElementById('menuGrid');
    if (grid) grid.innerHTML = '<p class="no-results">Không thể tải sản phẩm</p>';
  }
}

/** Render stars from rating number */
function renderStars(rating) {
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(5 - full) + ` (${rating.toFixed(1)})`;
}

/** Build a product card HTML string */
function productCardHTML(p) {
  const outOfStock = p.stock === 0;
  const cartItem = JSON.stringify({ id: p.id, name: p.name, price: p.price, img: p.image }).replace(/"/g, '&quot;');
  return `
    <div class="product-card">
      <img src="${p.image}" alt="${p.name}" onerror="this.src='img/menu-1.png'" loading="lazy" />
      <div class="product-card-body">
        <span class="badge">${p.category === 'coffee' ? 'Cà phê' : 'Phụ kiện'}</span>
        <h3>${p.name}</h3>
        <p class="desc">${p.description}</p>
        ${p.rating ? `<div class="stars-small">${renderStars(p.rating)}</div>` : ''}
        <p class="price">
          ${formatVND(p.price)}
          ${p.originalPrice ? `<span class="original-price">${formatVND(p.originalPrice)}</span>` : ''}
        </p>
        <button class="btn-add" ${outOfStock ? 'disabled' : ''}
          onclick='handleAddToCart(${JSON.stringify({ id: p.id, name: p.name, price: p.price, img: p.image })})'>
          ${outOfStock ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
        </button>
      </div>
    </div>`;
}

/** Add to cart and show toast */
function handleAddToCart(item) {
  addToCart(item);
  showToast(`Đã thêm "${item.name}" vào giỏ hàng`);
}

/** Apply filters and render menu grid */
function renderMenu() {
  const source = currentCategory === 'coffee' ? allProducts : allAccessories;
  let list = [...source];

  // Search filter
  if (currentSearch) {
    const q = currentSearch.toLowerCase();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q)
    );
  }

  // Sort
  if (currentSort === 'price_asc') list.sort((a, b) => a.price - b.price);
  else if (currentSort === 'price_desc') list.sort((a, b) => b.price - a.price);
  else if (currentSort === 'name_asc') list.sort((a, b) => a.name.localeCompare(b.name));

  const grid = document.getElementById('menuGrid');
  if (!grid) return;
  grid.innerHTML = list.length
    ? list.map(productCardHTML).join('')
    : '<p class="no-results">Không tìm thấy sản phẩm</p>';
}

/** Render accessories section (always shows all accessories) */
function renderAccessories() {
  const grid = document.getElementById('accessoryGrid');
  if (!grid) return;
  grid.innerHTML = allAccessories.length
    ? allAccessories.map(productCardHTML).join('')
    : '<p class="no-results">Không có sản phẩm</p>';
}

/** Category button click */
function filterCategory(cat, btn) {
  currentCategory = cat;
  currentSearch = '';
  currentSort = '';
  const searchEl = document.getElementById('searchInput');
  const sortEl = document.getElementById('sortSelect');
  if (searchEl) searchEl.value = '';
  if (sortEl) sortEl.value = '';
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderMenu();
}

/** Search input handler */
function handleSearch(val) { currentSearch = val; renderMenu(); }

/** Sort select handler */
function handleSort(val) { currentSort = val; renderMenu(); }
