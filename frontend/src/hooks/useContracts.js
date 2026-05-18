import { useMemo } from "react";
import { Contract } from "ethers";
import ADDRESSES from "../utils/addresses";

import EvidenceRegistryABI from "../abis/EvidenceRegistry.json";
import GovernanceABI        from "../abis/Governance.json";
import AuditLogABI          from "../abis/AuditLog.json";
import OfficerTokenABI      from "../abis/OfficerToken.json";

export function useContracts(signer) {
  const evidenceRegistry = useMemo(
    () =>
      signer
        ? new Contract(ADDRESSES.EvidenceRegistry, EvidenceRegistryABI.abi, signer)
        : null,
    [signer]
  );

  const governance = useMemo(
    () =>
      signer
        ? new Contract(ADDRESSES.Governance, GovernanceABI.abi, signer)
        : null,
    [signer]
  );

  const auditLog = useMemo(
    () =>
      signer
        ? new Contract(ADDRESSES.AuditLog, AuditLogABI.abi, signer)
        : null,
    [signer]
  );

  // OfficerToken — ERC-20 used to represent officer voting weight & identity
  const officerToken = useMemo(
    () =>
      signer
        ? new Contract(ADDRESSES.OfficerToken, OfficerTokenABI.abi, signer)
        : null,
    [signer]
  );

  return { evidenceRegistry, governance, auditLog, officerToken };
}
