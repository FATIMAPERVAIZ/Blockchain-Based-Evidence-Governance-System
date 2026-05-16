import { useState, useEffect, useCallback } from "react";
import { formatUnits } from "ethers";
import { useContracts } from "./useContracts";

export function useOfficerToken(signer, account) {
  const { officerToken } = useContracts(signer);

  const [balance,     setBalance]     = useState(null); // formatted OTK
  const [totalSupply, setTotalSupply] = useState(null);
  const [symbol,      setSymbol]      = useState("OTK");
  const [name,        setName]        = useState("OfficerToken");
  const [decimals,    setDecimals]    = useState(18);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");

  const fetch = useCallback(async () => {
    if (!officerToken || !account) return;
    setLoading(true);
    setError("");
    try {
      const [bal, supply, sym, nm, dec] = await Promise.all([
        officerToken.balanceOf(account),
        officerToken.totalSupply(),
        officerToken.symbol(),
        officerToken.name(),
        officerToken.decimals(),
      ]);
      setDecimals(Number(dec));
      setBalance(formatUnits(bal, dec));
      setTotalSupply(formatUnits(supply, dec));
      setSymbol(sym);
      setName(nm);
    } catch (err) {
      setError("Failed to load token data.");
    } finally {
      setLoading(false);
    }
  }, [officerToken, account]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  // Human-readable balance (no trailing zeros)
  const displayBalance = balance
    ? parseFloat(balance).toLocaleString(undefined, { maximumFractionDigits: 4 })
    : null;

  const displaySupply = totalSupply
    ? parseFloat(totalSupply).toLocaleString(undefined, { maximumFractionDigits: 2 })
    : null;

  // What % of total supply does the connected wallet hold?
  const holdingPercent =
    balance && totalSupply && parseFloat(totalSupply) > 0
      ? ((parseFloat(balance) / parseFloat(totalSupply)) * 100).toFixed(2)
      : "0.00";

  return {
    balance, displayBalance,
    totalSupply, displaySupply,
    holdingPercent,
    symbol, name, decimals,
    loading, error,
    refresh: fetch,
  };
}
