/**
 * App
 * Data flow:
 * - On mount: fetch users + leaderboard + history (page 1)
 * - On Add: refresh users/leaderboard; select new user
 * - On Claim: refresh users/leaderboard; reset history to page 1
 * - On pagination changes: fetch history for the new page/limit
 * No polling: refresh only on user actions or pagination changes.
 */

import { useEffect, useMemo, useState } from 'react';
import { getUsers, addUser, claim, getLeaderboard, getHistory } from './api';
import AddUser from './components/AddUser';
import Leaderboard from './components/Leaderboard';
import History from './components/History';
import { ToastContainer, toast } from 'react-toastify';

export default function App() {
  // Data state
  const [users, setUsers] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);

  // History state with pagination
  const [historyItems, setHistoryItems] = useState([]);
  const [historyTotal, setHistoryTotal] = useState(0);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyLimit, setHistoryLimit] = useState(5);
  const [historyLoading, setHistoryLoading] = useState(false);

  // UI state
  const [claiming, setClaiming] = useState(false);

  const selectedUser = useMemo(
    () => users.find(u => u.id === selectedId),
    [users, selectedId]
  );

  // Fetches the two lists affected by Add/Claim actions.
  async function refreshUsersAndBoard() {
    const [u, lb] = await Promise.all([getUsers(), getLeaderboard()]);
    setUsers(u);
    setLeaderboard(lb);
  }

  async function refreshHistory(page = historyPage, limit = historyLimit) {
    setHistoryLoading(true);
    try {
      const h = await getHistory(page, limit);
      setHistoryItems(h.items || []);
      setHistoryTotal(h.total || 0);
    } finally {
      setHistoryLoading(false);
    }
  }

  // Initial load 
  useEffect(() => {
    (async () => {
      await refreshUsersAndBoard();
      await refreshHistory(1, historyLimit);
      setHistoryPage(1);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // React to pagination changes only 
  useEffect(() => {
    refreshHistory(historyPage, historyLimit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [historyPage, historyLimit]);


  // Handlers (these trigger targeted refreshes) 
  async function onAdd(name, done) {
    const trimmed = (name || '').trim();
    if (!trimmed) return toast.info('Enter a name');
    try {
      const res = await addUser(trimmed);
      toast.success(`Added "${res.name}"`);
      done?.();
      // Refresh lists affected by adding a user
      await refreshUsersAndBoard();
      // Select the newly added user
      setSelectedId(res.id);
    } catch (e) {
      toast.error(e?.error || 'Failed to add user');
    }
  }

  // After claiming, show newest claim (page 1) so the action is visible to the user.
  async function onClaim() {
    if (!selectedId) return toast.info('Select a user first');
    setClaiming(true);
    try {
      const res = await claim(selectedId);
      toast.success(`+${res.points} points awarded to ${selectedUser?.name || 'User'}!`);

      await refreshUsersAndBoard();

      await refreshHistory(1, historyLimit);
      setHistoryPage(1);
    } catch (e) {
      toast.error(e?.error || 'Failed to claim points');
    } finally {
      setClaiming(false);
    }
  }

  // Basic stats
  const totalUsers = users.length;
  const totalClaims = historyTotal;

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-primary bg-gradient navbar-shadow">
        <div className="container">
          <a className="navbar-brand fw-semibold fs-3 m-0 text-white" href="#">3W Leaderboard</a>
        </div>
      </nav>

      {/* Header / Hero strip */}
      <header className="hero-gradient border-bottom py-3">
        <div className="container text-white">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-lg">
              <h1 className="fs-5 m-0">Claim Points & Dynamic Ranking</h1>
              <small className="text-white-50">
                Select a user, award random points, and see the leaderboard update instantly.
              </small>
            </div>
            <div className="col-auto">
              <span className="badge badge-soft-secondary me-2">Users: {totalUsers}</span>
              <span className="badge badge-soft-success">Total Claims: {totalClaims}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container my-4">
        
        {/* Controls card */}
        <div className="card shadow-sm rounded-3 mb-4 card-accent-info">
          <div className="card-body">
            <label className="form-label fw-semibold">Select user & claim points</label>
            <div className="input-group">
              <select
                className="form-select"
                value={selectedId}
                onChange={e => setSelectedId(e.target.value)}
              >
                <option value="">Select user...</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>

              <button
                className="btn btn-success d-flex align-items-center justify-content-center"
                disabled={!selectedId || claiming}
                onClick={onClaim}
                type="button"
              >
                {claiming && (
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                )}
                {claiming ? 'Claiming…' : `Claim for ${selectedUser?.name || 'User'}`}
              </button>
            </div>
            <div className="form-text mt-1 text-muted">Awards 1–10 points randomly.</div>
          </div>
        </div>



        {/* Content grid */}
        <div className="row g-4">
          <div className="col-12 col-lg-7">
            <Leaderboard rows={leaderboard} />
          </div>

          <div className="col-12 col-lg-5">
            <AddUser onAdd={onAdd} />

            {/* History controls (page size) */}
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div className="form-text">Recent claims</div>
              <div className="d-flex align-items-center gap-2">
                <label className="form-label m-0 small">Rows:</label>
                <select
                  className="form-select form-select-sm"
                  style={{ width: 80 }}
                  value={historyLimit}
                  onChange={e => setHistoryLimit(Number(e.target.value))}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
            </div>

            <History
              page={historyPage}
              limit={historyLimit}
              total={historyTotal}
              items={historyItems}
              loading={historyLoading}
              onPageChange={setHistoryPage}
            />
          </div>
        </div>
      </main>

      <footer className="container my-4 text-center text-muted small">
        React + Bootstrap · Deterministic ranking
      </footer>

      <ToastContainer position="top-right" autoClose={1400} />
    </>
  );
}
