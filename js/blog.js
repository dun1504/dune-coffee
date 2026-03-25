/**
 * blog.js — Loads blog posts from data/blogs.json and renders them.
 */

/** Load and render blog cards */
async function loadBlogs() {
  const grid = document.getElementById('blogGrid');
  if (!grid) return;
  try {
    const res = await fetch('data/blogs.json');
    const blogs = await res.json();
    grid.innerHTML = blogs.map(b => `
      <div class="blog-card">
        <img src="${b.image}" alt="${b.title}" onerror="this.src='img/blog-1.jpeg'" loading="lazy" />
        <div class="blog-card-body">
          <p class="blog-date">${new Date(b.date).toLocaleDateString('vi-VN')}</p>
          <h3>${b.title}</h3>
          <p>${b.excerpt}</p>
          <a href="#blog" onclick="showBlogDetail(${JSON.stringify(b).replace(/"/g, '&quot;')})">Đọc thêm →</a>
        </div>
      </div>`).join('');
  } catch (err) {
    console.error('Failed to load blogs:', err);
    grid.innerHTML = '<p class="no-results">Không thể tải bài viết</p>';
  }
}

/** Show blog detail in a simple modal */
function showBlogDetail(blog) {
  // Remove existing modal if any
  document.getElementById('blogModal')?.remove();

  const modal = document.createElement('div');
  modal.id = 'blogModal';
  modal.style.cssText = `
    position:fixed;inset:0;z-index:999;background:rgba(0,0,0,.6);
    display:flex;align-items:center;justify-content:center;padding:1rem;
  `;
  modal.innerHTML = `
    <div style="background:#fff;border-radius:12px;max-width:640px;width:100%;max-height:80vh;overflow-y:auto;padding:2rem;position:relative;">
      <button onclick="document.getElementById('blogModal').remove()"
        style="position:absolute;top:1rem;right:1rem;background:none;border:none;font-size:1.4rem;cursor:pointer;">✕</button>
      <img src="${blog.image}" alt="${blog.title}" style="width:100%;border-radius:8px;margin-bottom:1rem;max-height:240px;object-fit:cover;" />
      <p style="font-size:.8rem;color:#aaa;margin-bottom:.5rem;">${new Date(blog.date).toLocaleDateString('vi-VN')}</p>
      <h2 style="font-size:1.2rem;font-weight:700;margin-bottom:1rem;">${blog.title}</h2>
      <p style="color:#555;line-height:1.7;">${blog.content}</p>
    </div>`;
  modal.addEventListener('click', e => { if (e.target === modal) modal.remove(); });
  document.body.appendChild(modal);
}
