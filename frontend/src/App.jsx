import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useWallet }       from "./hooks/useWallet";
import { useOfficerToken } from "./hooks/useOfficerToken";
import Navbar              from "./components/Navbar";
import UploadEvidence      from "./pages/UploadEvidence";
import EvidenceList        from "./pages/EvidenceList";
import CreateProposal      from "./pages/CreateProposal";
import VotingPage          from "./pages/VotingPage";
import TokenPage           from "./pages/TokenPage";

export default function App() {
  const wallet = useWallet();

  // Fetch OTK balance whenever wallet is connected
  const token = useOfficerToken(wallet.signer, wallet.account);

  const pageProps = {
    signer:  wallet.signer,
    account: wallet.account,
  };

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="app-shell">
        <Navbar
          account={wallet.account}
          connect={wallet.connect}
          shortAddress={wallet.shortAddress}
          isSepoliaNetwork={wallet.isSepoliaNetwork}
          otkBalance={token.displayBalance}
          otkSymbol={token.symbol}
        />

        {wallet.error && (
          <div className="global-error">{wallet.error}</div>
        )}

        {wallet.account && !wallet.isSepoliaNetwork && (
          <div className="global-warn">
            ⚠ You are not on Sepolia testnet. Switch network in MetaMask.
          </div>
        )}

        <main className="main-content">
          <Routes>
            <Route path="/"          element={<UploadEvidence {...pageProps} />} />
            <Route path="/evidence"  element={<EvidenceList   {...pageProps} />} />
            <Route path="/proposal"  element={<CreateProposal {...pageProps} />} />
            <Route path="/vote"      element={<VotingPage     {...pageProps} />} />
            <Route path="/token"     element={<TokenPage      {...pageProps} token={token} />} />
          </Routes>
        </main>

        <footer className="footer">
          <span>ForensiChain — Blockchain Evidence Management</span>
          <span className="footer-chain">Sepolia Testnet ⬡</span>
        </footer>
      </div>
    </BrowserRouter>
  );
}