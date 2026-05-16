import { NavLink } from "react-router-dom";

export default function Navbar({ account, connect, shortAddress, isSepoliaNetwork, otkBalance, otkSymbol }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">⬡</span>
        <span className="brand-name">FORENSI<span className="brand-accent">CHAIN</span></span>
      </div>

      <div className="navbar-links">
        <NavLink to="/"          className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Upload Evidence</NavLink>
        <NavLink to="/evidence"  className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Evidence List</NavLink>
        <NavLink to="/proposal"  className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Create Proposal</NavLink>
        <NavLink to="/vote"      className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>Voting</NavLink>
        <NavLink to="/token"     className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>OTK Token</NavLink>
      </div>

      <div className="navbar-wallet">
        {account ? (
          <div className="wallet-connected">
            {!isSepoliaNetwork && (
              <span className="badge badge-warn">Wrong Network</span>
            )}
            {/* Live OTK balance pill */}
            {otkBalance !== null && (
              <span className="badge badge-token" title="Your OfficerToken balance">
                ◈ {otkBalance} {otkSymbol}
              </span>
            )}
            <span className="badge badge-online">{shortAddress}</span>
          </div>
        ) : (
          <button className="btn btn-connect" onClick={connect}>
            Connect MetaMask
          </button>
        )}
      </div>
    </nav>
  );
}