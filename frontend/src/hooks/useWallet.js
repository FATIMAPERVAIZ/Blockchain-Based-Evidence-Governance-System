import { useState, useCallback, useEffect } from "react";
import { BrowserProvider } from "ethers";

export function useWallet() {
  const [account, setAccount]   = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner]     = useState(null);
  const [chainId, setChainId]   = useState(null);
  const [error, setError]       = useState(null);

  const connect = useCallback(async () => {
    setError(null);
    if (!window.ethereum) {
      setError("MetaMask not found. Please install it.");
      return;
    }
    try {
      const _provider = new BrowserProvider(window.ethereum);
      await _provider.send("eth_requestAccounts", []);
      const _signer  = await _provider.getSigner();
      const _account = await _signer.getAddress();
      const network  = await _provider.getNetwork();

      setProvider(_provider);
      setSigner(_signer);
      setAccount(_account);
      setChainId(Number(network.chainId));
    } catch (err) {
      setError(err.message || "Connection failed");
    }
  }, []);

  // Auto-reconnect if already authorised
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
        if (accounts.length > 0) connect();
      });

      window.ethereum.on("accountsChanged", () => connect());
      window.ethereum.on("chainChanged",    () => window.location.reload());
    }
  }, [connect]);

  const shortAddress = account
    ? `${account.slice(0, 6)}…${account.slice(-4)}`
    : null;

  const isSepoliaNetwork = chainId === 11155111;

  return { account, provider, signer, chainId, error, connect, shortAddress, isSepoliaNetwork };
}
