/**
 * auth.js — Authentication helpers
 * Handles login, register, logout, and auth state stored in localStorage.
 * No backend — users are stored in localStorage under 'na_users'.
 */

const AUTH_KEY = 'na_user';
const USERS_KEY = 'na_users';

/** Get currently logged-in user object or null */
function getUser() {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY) || 'null'); } catch { return null; }
}

/** Get token (just the user id for this static version) */
function getToken() { return localStorage.getItem(AUTH_KEY) ? 'local' : null; }

/** Check if user is logged in */
function isLoggedIn() { return !!getUser(); }

/** Check if user has admin role */
function isAdmin() { return getUser()?.role === 'admin'; }

/** Save user to localStorage (login) */
function setUser(user) { localStorage.setItem(AUTH_KEY, JSON.stringify(user)); }

/** Log out */
function logout() {
  localStorage.removeItem(AUTH_KEY);
  window.location.href = 'index.html';
}

/** Register a new user. Returns { ok, error } */
function register(name, email, password) {
  const users = getUsers();
  if (users.find(u => u.email === email.toLowerCase())) {
    return { ok: false, error: 'Email đã được sử dụng' };
  }
  const user = { id: Date.now().toString(), name, email: email.toLowerCase(), password, role: 'customer' };
  users.push(user);
  saveUsers(users);
  const { password: _, ...safe } = user;
  setUser(safe);
  return { ok: true, user: safe };
}

/** Login. Returns { ok, error } */
function login(email, password) {
  const users = getUsers();
  const user = users.find(u => u.email === email.toLowerCase() && u.password === password);
  if (!user) return { ok: false, error: 'Email hoặc mật khẩu không đúng' };
  const { password: _, ...safe } = user;
  setUser(safe);
  return { ok: true, user: safe };
}

function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); } catch { return []; }
}

function saveUsers(users) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }

/** Update navbar based on auth state */
function updateAuthUI() {
  const user = getUser();
  const loginEl = document.getElementById('navLogin');
  const registerEl = document.getElementById('navRegister');
  const dashEl = document.getElementById('navDashboard');
  const logoutEl = document.getElementById('navLogout');
  if (loginEl) loginEl.style.display = user ? 'none' : 'inline';
  if (registerEl) registerEl.style.display = user ? 'none' : 'inline';
  if (dashEl) dashEl.style.display = user ? 'inline' : 'none';
  if (logoutEl) logoutEl.style.display = user ? 'inline' : 'none';
}
