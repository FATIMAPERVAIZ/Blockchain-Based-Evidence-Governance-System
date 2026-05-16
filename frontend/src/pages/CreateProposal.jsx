import { useState } from "react";
import { useContracts } from "../hooks/useContracts";
import StatusMessage from "../components/StatusMessage";

export default function CreateProposal({ signer, account }) {
  const { governance, auditLog } = useContracts(signer);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState({ msg: "", type: "" });
  const MAX = 300;

  async function handleCreate() {
    if (!account)          return setStatus({ msg: "Connect your wallet first.", type: "error" });
    if (!description.trim()) return setStatus({ msg: "Proposal description cannot be empty.", type: "error" });

    setStatus({ msg: "Submitting proposal to chain…", type: "loading" });
    try {
      const tx = await governance.createProposal(description.trim());
      setStatus({ msg: "Transaction sent. Waiting for confirmation…", type: "loading" });
      await tx.wait();

      if (auditLog) {
        const logTx = await auditLog.addLog(`Proposal created: ${description.trim().slice(0, 60)}`);
        await logTx.wait();
      }

      setStatus({ msg: `✔ Proposal submitted! TX: ${tx.hash}`, type: "success" });
      setDescription("");
    } catch (err) {
      const msg = err?.reason || err?.message || "Transaction failed";
      setStatus({ msg: `✘ ${msg}`, type: "error" });
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-tag">PHASE 03</div>
        <h1 className="page-title">Create Proposal</h1>
        <p className="page-subtitle">
          Submit a DAO governance proposal for officers to vote on.
        </p>
      </div>

      <div className="card">
        <label className="field-label">Proposal Description</label>
        <textarea
          className="field-textarea"
          placeholder="Describe the proposal clearly. e.g. 'Approve release of evidence item #12 for court proceedings on 2025-09-15.'"
          value={description}
          maxLength={MAX}
          rows={5}
          onChange={(e) => setDescription(e.target.value)}
          disabled={!account}
        />
        <div className="char-counter">{description.length}/{MAX}</div>

        <button
          className="btn btn-primary"
          onClick={handleCreate}
          disabled={!account || status.type === "loading"}
        >
          {status.type === "loading" ? "Processing…" : "Submit Proposal"}
        </button>

        <StatusMessage status={status} />
      </div>

      <div className="info-grid">
        <div className="info-card">
          <div className="info-icon">🗳️</div>
          <div className="info-text">
            <strong>Open Voting</strong>
            <span>All officers can cast YES or NO votes on every proposal.</span>
          </div>
        </div>
        <div className="info-card">
          <div className="info-icon">⛓️</div>
          <div className="info-text">
            <strong>On-Chain Governance</strong>
            <span>Proposals and vote counts are stored permanently on Sepolia.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
