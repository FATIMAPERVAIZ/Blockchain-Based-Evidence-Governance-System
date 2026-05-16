import { useState, useRef } from "react";
import { useContracts } from "../hooks/useContracts";
import StatusMessage from "../components/StatusMessage";

// ── SHA-256 via browser Web Crypto API (no library needed) ──────
async function sha256FromFile(file) {
  const buffer     = await file.arrayBuffer();               // read raw bytes
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer); // hash them
  const hashArray  = Array.from(new Uint8Array(hashBuffer)); // convert to byte array
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join(""); // hex string
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export default function UploadEvidence({ signer, account }) {
  const { evidenceRegistry, auditLog } = useContracts(signer);

  // ── state ──────────────────────────────────────────────────────
  const [file,      setFile]      = useState(null);   // selected File object
  const [hash,      setHash]      = useState("");      // generated SHA-256 hex
  const [hashing,   setHashing]   = useState(false);  // computing hash
  const [status,    setStatus]    = useState({ msg: "", type: "" });
  const [dragging,  setDragging]  = useState(false);
  const fileInputRef = useRef(null);

  // ── Step 1: file selected → auto-generate hash ─────────────────
  async function processFile(selectedFile) {
    if (!selectedFile) return;
    setFile(selectedFile);
    setHash("");
    setStatus({ msg: "", type: "" });
    setHashing(true);
    try {
      const hex = await sha256FromFile(selectedFile);
      setHash(hex);
    } catch {
      setStatus({ msg: "Failed to read file. Try again.", type: "error" });
    } finally {
      setHashing(false);
    }
  }

  function onFileInputChange(e) {
    processFile(e.target.files[0]);
  }

  // ── Drag-and-drop handlers ──────────────────────────────────────
  function onDragOver(e)  { e.preventDefault(); setDragging(true);  }
  function onDragLeave()  { setDragging(false); }
  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) processFile(dropped);
  }

  function clearFile() {
    setFile(null);
    setHash("");
    setStatus({ msg: "", type: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // ── Step 2: submit hash to blockchain ──────────────────────────
  async function handleUpload() {
    if (!account) return setStatus({ msg: "Connect your wallet first.", type: "error" });
    if (!hash)    return setStatus({ msg: "Select a file first so the hash can be generated.", type: "error" });

    setStatus({ msg: "Submitting transaction…", type: "loading" });
    try {
      const tx = await evidenceRegistry.addEvidence(hash);
      setStatus({ msg: "Transaction sent. Waiting for confirmation…", type: "loading" });
      await tx.wait();

      if (auditLog) {
        const logTx = await auditLog.addLog(
          `Evidence uploaded — file: ${file.name}, hash: ${hash.slice(0, 16)}…`
        );
        await logTx.wait();
      }
      const txHash = tx.hash;
      clearFile();
      setStatus({ msg: `✔ Evidence recorded on-chain! TX: ${txHash}`, type: "success" });
     
    } catch (err) {
      const msg = err?.reason || err?.message || "Transaction failed";
      setStatus({ msg: `✘ ${msg}`, type: "error" });
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-tag">PHASE 01</div>
        <h1 className="page-title">Upload Evidence</h1>
        <p className="page-subtitle">
          Select any file — the app generates its SHA-256 fingerprint locally
          and records it permanently on the Sepolia blockchain. The file itself
          never leaves your device.
        </p>
      </div>

      <div className="card">

        {/* ── Drop zone ── */}
        {!file && (
          <div
            className={`drop-zone ${dragging ? "drag-over" : ""} ${!account ? "disabled" : ""}`}
            onClick={() => account && fileInputRef.current?.click()}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <div className="drop-icon">⬡</div>
            <p className="drop-primary">Drop evidence file here</p>
            <p className="drop-secondary">or click to browse — any file type accepted</p>
            <input
              ref={fileInputRef}
              type="file"
              style={{ display: "none" }}
              onChange={onFileInputChange}
              disabled={!account}
            />
          </div>
        )}

        {/* ── File selected: show info + generated hash ── */}
        {file && (
          <div className="file-preview">
            <div className="file-preview-header">
              <div className="file-icon">📄</div>
              <div className="file-meta">
                <span className="file-name">{file.name}</span>
                <span className="file-size">{formatBytes(file.size)} · {file.type || "unknown type"}</span>
              </div>
              <button className="btn-clear" onClick={clearFile} title="Remove file">✕</button>
            </div>

            <div className="hash-result">
              <div className="hash-label-row">
                <span className="field-label">SHA-256 Hash</span>
                {hashing && <span className="hashing-badge"><span className="spinner" /> Computing…</span>}
                {!hashing && hash && <span className="hash-ready-badge">✔ Ready</span>}
              </div>
              <div className="hash-value mono">
                {hashing ? "————————————————————————————————" : hash || "—"}
              </div>
              <p className="field-hint">
                This 64-character fingerprint uniquely identifies your file. Only this
                hash is stored on-chain — the original file stays on your device.
              </p>
            </div>
          </div>
        )}

        <button
          className="btn btn-primary"
          onClick={handleUpload}
          disabled={!account || !hash || hashing || status.type === "loading"}
        >
          {status.type === "loading" ? "Processing…" : "Submit Hash to Blockchain"}
        </button>

        <StatusMessage status={status} />
      </div>

      <div className="info-grid">
        <div className="info-card">
          <div className="info-icon">🔒</div>
          <div className="info-text">
            <strong>File Never Leaves Device</strong>
            <span>SHA-256 is computed locally in your browser. Only the hash goes on-chain.</span>
          </div>
        </div>
        <div className="info-card">
          <div className="info-icon">🪪</div>
          <div className="info-text">
            <strong>Officer-Only Access</strong>
            <span>Only wallets granted the officer role may submit evidence.</span>
          </div>
        </div>
        <div className="info-card">
          <div className="info-icon">📋</div>
          <div className="info-text">
            <strong>Audit Trail</strong>
            <span>Every upload (filename + hash prefix) is logged in the on-chain AuditLog.</span>
          </div>
        </div>
      </div>
    </div>
  );
}