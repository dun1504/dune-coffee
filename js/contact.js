/**
 * contact.js — Contact form handler.
 * Logs submission to console and shows a toast notification.
 * No backend — data is not persisted.
 */

function submitContact(e) {
  e.preventDefault();
  const name  = document.getElementById('cName').value.trim();
  const email = document.getElementById('cEmail').value.trim();
  const phone = document.getElementById('cPhone').value.trim();

  if (!name || !email || !phone) {
    showToast('Vui lòng điền đầy đủ thông tin');
    return;
  }

  // Log to console (static version — no backend)
  console.log('[Contact Form Submission]', { name, email, phone, timestamp: new Date().toISOString() });

  // Show success message
  const msgEl = document.getElementById('contactMsg');
  if (msgEl) msgEl.textContent = 'Gửi thành công! Chúng tôi sẽ liên hệ sớm.';

  showToast('Gửi liên hệ thành công!');
  document.getElementById('contactForm').reset();
}
