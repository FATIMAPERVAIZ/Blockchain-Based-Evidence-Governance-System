import { useState, useEffect, useCallback } from "react";
import { useContracts } from "../hooks/useContracts";
import StatusMessage from "../components/StatusMessage";

export default function VotingPage({ signer, account }) {
  const { governance, auditLog } = useContracts(signer);
  const [proposals, setProposals] = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");
  const [status,    setStatus]    = useState({ msg: "", type: "" });
  const [voting,    setVoting]    = useState(null); // proposal id being voted on

  const fetchProposals = useCallback(async () => {
    if (!governance) return;
    setLoading(true);
    setError("");
    try {
      const count = await governance.proposalCount();
      const items = [];
      for (let i = 0; i < Number(count); i++) {
        const p = await governance.proposals(i);
        items.push({
          id:          i,
          description: p.description,
          yesVotes:    Number(p.yesVotes),
          noVotes:     Number(p.noVotes),
          executed:    p.executed,
        });
      }
      setProposals(items.reverse());
    } catch (err) {
      setError("Failed to load proposals. Are you connected to Sepolia?");
    } finally {
      setLoading(false);
    }
  }, [governance]);

  useEffect(() => {
    fetchProposals();
  }, [fetchProposals]);

  async function castVote(proposalId, isYes) {
    if (!account) return setStatus({ msg: "Connect your wallet first.", type: "error" });
    setVoting(proposalId);
    setStatus({ msg: `Submitting ${isYes ? "YES" : "NO"} vote…`, type: "loading" });
    try {
      const tx = await governance.vote(proposalId, isYes);
      setStatus({ msg: "Transaction sent. Waiting for confirmation…", type: "loading" });
      await tx.wait();

      if (auditLog) {
        const logTx = await auditLog.addLog(`Voted ${isYes ? "YES" : "NO"} on proposal #${proposalId}`);
        await logTx.wait();
      }

      setStatus({ msg: `✔ Vote recorded! TX: ${tx.hash}`, type: "success" });
      await fetchProposals(); // refresh
    } catch (err) {
      const msg = err?.reason || err?.message || "Vote failed";
      setStatus({ msg: `✘ ${msg}`, type: "error" });
    } finally {
      setVoting(null);
    }
  }

  function votePercent(yes, no) {
    const total = yes + no;
    if (total === 0) return 0;
    return Math.round((yes / total) * 100);
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-tag">PHASE 04</div>
        <h1 className="page-title">DAO Voting</h1>
        <p className="page-subtitle">
          Cast your vote on active governance proposals below.
        </p>
      </div>

      <div className="list-toolbar">
        <span className="record-count">{proposals.length} proposal{proposals.length !== 1 ? "s" : ""}</span>
        <button className="btn btn-secondary" onClick={fetchProposals} disabled={loading || !account}>
          {loading ? "Loading…" : "↺ Refresh"}
        </button>
      </div>

      <StatusMessage status={status} />

      {!account && (
        <div className="status error">Connect your wallet to view and vote on proposals.</div>
      )}
      {error && <div className="status error">{error}</div>}
      {loading && (
        <div className="status loading">
          <span className="spinner" /> Fetching proposals…
        </div>
      )}

      {!loading && proposals.length === 0 && account && !error && (
        <div className="empty-state">
          <span className="empty-icon">🗳️</span>
          <p>No proposals yet. Create one first.</p>
        </div>
      )}

      <div className="proposal-list">
        {proposals.map((p) => {
          const pct   = votePercent(p.yesVotes, p.noVotes);
          const total = p.yesVotes + p.noVotes;
          return (
            <div key={p.id} className={`proposal-card ${p.executed ? "executed" : ""}`}>
              <div className="proposal-meta">
                <span className="proposal-id">#{p.id}</span>
                {p.executed && <span className="badge badge-warn">Executed</span>}
              </div>

              <p className="proposal-desc">{p.description}</p>

              <div className="vote-bar-wrap">
                <div className="vote-bar">
                  <div className="vote-bar-yes" style={{ width: `${pct}%` }} />
                </div>
                <div className="vote-counts">
                  <span className="yes-label">✔ {p.yesVotes} YES</span>
                  <span className="total-label">{total} total votes</span>
                  <span className="no-label">{p.noVotes} NO ✘</span>
                </div>
              </div>

              {!p.executed && (
                <div className="vote-actions">
                  <button
                    className="btn btn-yes"
                    onClick={() => castVote(p.id, true)}
                    disabled={voting === p.id || !account}
                  >
                    {voting === p.id ? "…" : "✔ Vote YES"}
                  </button>
                  <button
                    className="btn btn-no"
                    onClick={() => castVote(p.id, false)}
                    disabled={voting === p.id || !account}
                  >
                    {voting === p.id ? "…" : "✘ Vote NO"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
