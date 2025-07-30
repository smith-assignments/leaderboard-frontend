/**
 * API client
 * - BASE is read from VITE_API_BASE_URL
 * - handle(): normalizes error responses so UI can toast a friendly message
 */


const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

async function handle(res) {
  if (!res.ok) {
    let err;
    try { err = await res.json(); } catch { err = { error: res.statusText }; }
    throw err;
  }
  return res.json();
}

export async function getUsers() {
  return handle(await fetch(`${BASE}/api/users`));
}

export async function addUser(name) {
  return handle(await fetch(`${BASE}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  }));
}

// server returns { userId, points: 1..10, totalPoints } on success
export async function claim(userId) {
  return handle(await fetch(`${BASE}/api/users/claim`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  }));
}

export async function getLeaderboard() {
  return handle(await fetch(`${BASE}/api/users/leaderboard`));
}

export async function getHistory(page=1, limit=20) {
  return handle(await fetch(`${BASE}/api/users/history?page=${page}&limit=${limit}`));
}

export async function getUserHistory(userId, page=1, limit=10) {
  return handle(await fetch(`${BASE}/api/users/history/${userId}?page=${page}&limit=${limit}`));
}
