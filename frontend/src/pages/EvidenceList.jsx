import { useState, useEffect, useCallback } from "react";
import { useContracts } from "../hooks/useContracts";

function formatDate(timestamp) {
  return new Date(Number(timestamp) * 1000).toLocaleString();
}
function shortHash(h) {
  if (!h) return "—";
  return h.length > 20 ? `${h.slice(0, 14)}…${h.slice(-6)}` : h;
}

export default function EvidenceList({ signer, account }) {
  const { evidenceRegistry } = useContracts(signer);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAll = useCallback(async () => {
    if (!evidenceRegistry) return;
    setLoading(true);
    setError("");
    try {
      const count = await evidenceRegistry.count();
      const items = [];
      for (let i = 0; i < Number(count); i++) {
        const ev = await evidenceRegistry.getEvidence(i);
        // ethers v6 returns structs as array-like objects.
        // Access by index as fallback in case named props are undefined.
        items.push({
          id: i,
          hash: ev.hash ?? ev[0] ?? "",
          uploader: ev.uploader ?? ev[1] ?? "",
          timestamp: ev.timestamp ?? ev[2] ?? 0n,
        });
      }
      setRecords(items.reverse()); // newest first
    } catch (err) {
      setError("Failed to load evidence. Are you connected to Sepolia?");
    } finally {
      setLoading(false);
    }
  }, [evidenceRegistry]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-tag">PHASE 02</div>
        <h1 className="page-title">Evidence Records</h1>
        <p className="page-subtitle">
          All evidence permanently stored on the Sepolia blockchain.
        </p>
      </div>

      <div className="list-toolbar">
        <span className="record-count">
          {records.length} record{records.length !== 1 ? "s" : ""} found
        </span>
        <button
          className="btn btn-secondary"
          onClick={fetchAll}
          disabled={loading || !account}
        >
          {loading ? "Loading…" : "↺ Refresh"}
        </button>
      </div>

      {!account && (
        <div className="status error">
          Connect your wallet to view evidence records.
        </div>
      )}

      {error && <div className="status error">{error}</div>}

      {loading && (
        <div className="status loading">
          <span className="spinner" /> Fetching records from blockchain…
        </div>
      )}

      {!loading && records.length === 0 && account && !error && (
        <div className="empty-state">
          <span className="empty-icon">📂</span>
          <p>No evidence records found.</p>
        </div>
      )}

      <div className="evidence-table-wrap">
        {records.length > 0 && (
          <table className="evidence-table">
            <thead>
              <tr>
                <th>#ID</th>
                <th>Evidence Hash</th>
                <th>Uploaded By</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id}>
                  <td className="mono cell-id">#{r.id}</td>
                  <td className="mono cell-hash" title={r.hash}>
                    {shortHash(r.hash)}
                  </td>
                  <td className="mono cell-addr" title={r.uploader}>
                    {r.uploader.slice(0, 8)}…{r.uploader.slice(-6)}
                  </td>
                  <td className="cell-time">{formatDate(r.timestamp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
