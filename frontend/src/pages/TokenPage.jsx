import { useState } from "react";
import { parseUnits } from "ethers";
import { useContracts } from "../hooks/useContracts";
import StatusMessage from "../components/StatusMessage";

export default function TokenPage({ signer, account, token }) {
  const { officerToken, auditLog } = useContracts(signer);
  const [recipient,   setRecipient]   = useState("");
  const [amount,      setAmount]      = useState("");
  const [status,      setStatus]      = useState({ msg: "", type: "" });
  const [transferring, setTransferring] = useState(false);

  async function handleTransfer() {
    if (!account)     return setStatus({ msg: "Connect your wallet first.", type: "error" });
    if (!recipient.trim()) return setStatus({ msg: "Enter a recipient address.", type: "error" });
    if (!amount || isNaN(amount) || Number(amount) <= 0)
      return setStatus({ msg: "Enter a valid amount.", type: "error" });

    setTransferring(true);
    setStatus({ msg: "Sending transfer transaction…", type: "loading" });
    try {
      const value = parseUnits(amount, token.decimals);
      const tx    = await officerToken.transfer(recipient.trim(), value);
      setStatus({ msg: "Waiting for confirmation…", type: "loading" });
      await tx.wait();

      if (auditLog) {
        const logTx = await auditLog.addLog(
          `Transferred ${amount} ${token.symbol} to ${recipient.trim().slice(0, 10)}…`
        );
        await logTx.wait();
      }

      setStatus({ msg: `✔ Transferred ${amount} ${token.symbol}! TX: ${tx.hash}`, type: "success" });
      setRecipient("");
      setAmount("");
      token.refresh(); // refresh balance
    } catch (err) {
      const msg = err?.reason || err?.message || "Transfer failed";
      setStatus({ msg: `✘ ${msg}`, type: "error" });
    } finally {
      setTransferring(false);
    }
  }

  // Progress bar: % of supply held
  const pct = Math.min(parseFloat(token.holdingPercent || 0), 100);

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-tag">OFFICER TOKEN</div>
        <h1 className="page-title">OTK Token Dashboard</h1>
        <p className="page-subtitle">
          View your OfficerToken (OTK) balance, token stats, and transfer tokens to other officers.
        </p>
      </div>

      {/* ── Token Stats ─────────────────────────── */}
      {!account && (
        <div className="status error">Connect your wallet to view token information.</div>
      )}

      {token.error && <div className="status error">{token.error}</div>}

      {account && (
        <>
          <div className="token-stat-grid">
            <div className="token-stat-card accent">
              <div className="stat-label">Your Balance</div>
              <div className="stat-value">
                {token.loading ? "—" : token.displayBalance ?? "0"}
              </div>
              <div className="stat-unit">{token.symbol}</div>
            </div>

            <div className="token-stat-card">
              <div className="stat-label">Total Supply</div>
              <div className="stat-value">
                {token.loading ? "—" : token.displaySupply ?? "—"}
              </div>
              <div className="stat-unit">{token.symbol}</div>
            </div>

            <div className="token-stat-card">
              <div className="stat-label">Token Name</div>
              <div className="stat-value small">{token.name}</div>
              <div className="stat-unit">ERC-20</div>
            </div>

            <div className="token-stat-card">
              <div className="stat-label">Decimals</div>
              <div className="stat-value">{token.decimals}</div>
              <div className="stat-unit">precision</div>
            </div>
          </div>

          {/* ── Supply ownership bar ─── */}
          <div className="card">
            <div className="supply-bar-header">
              <span className="field-label">Your Share of Total Supply</span>
              <span className="supply-pct">{token.holdingPercent}%</span>
            </div>
            <div className="supply-bar-track">
              <div
                className="supply-bar-fill"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="field-hint">
              You hold {token.displayBalance ?? "0"} out of {token.displaySupply ?? "—"} total {token.symbol} tokens.
              OTK tokens represent officer identity and voting weight in the DAO.
            </p>

            <button
              className="btn btn-secondary"
              style={{ alignSelf: "flex-start" }}
              onClick={token.refresh}
              disabled={token.loading}
            >
              {token.loading ? "Refreshing…" : "↺ Refresh Balance"}
            </button>
          </div>

          {/* ── Transfer ────────────────────────── */}
          <div className="card">
            <div className="page-tag" style={{ marginBottom: "0.2rem" }}>TRANSFER</div>
            <h2 className="section-title">Send OTK to Another Officer</h2>

            <label className="field-label">Recipient Address</label>
            <div className="input-row">
              <span className="input-icon">◎</span>
              <input
                className="field-input mono"
                type="text"
                placeholder="0xRecipientAddress…"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                disabled={!account || transferring}
              />
            </div>

            <label className="field-label">Amount ({token.symbol})</label>
            <div className="input-row">
              <span className="input-icon">◈</span>
              <input
                className="field-input"
                type="number"
                min="0"
                step="any"
                placeholder={`e.g. 10`}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={!account || transferring}
              />
            </div>

            <p className="field-hint">
              Transfers are recorded in the on-chain AuditLog. Make sure the recipient is a verified officer wallet.
            </p>

            <button
              className="btn btn-primary"
              onClick={handleTransfer}
              disabled={!account || transferring}
            >
              {transferring ? "Processing…" : `Send ${token.symbol}`}
            </button>

            <StatusMessage status={status} />
          </div>

          {/* ── Info cards ──────────────────────── */}
          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">🪙</div>
              <div className="info-text">
                <strong>ERC-20 Standard</strong>
                <span>OTK follows the ERC-20 standard — compatible with all Ethereum wallets.</span>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon">🗳️</div>
              <div className="info-text">
                <strong>Voting Weight</strong>
                <span>Token holdings determine your influence in DAO governance proposals.</span>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon">🔗</div>
              <div className="info-text">
                <strong>Audit Logged</strong>
                <span>Every transfer is recorded in the on-chain AuditLog contract.</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
