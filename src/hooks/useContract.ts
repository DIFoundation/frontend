import { useState } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Address } from "viem";

import CONTRACT_ABI from "@/contracts/Messaging.json";
import { CONTRACT_ADDRESS } from "@/config/contracts"; // ensure you export address

export function useContract() {
  const { address: userAddress, isConnected } = useAccount();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const { writeContractAsync } = useWriteContract();

  const getMessages = async (roomId: number) => {
    try {
      const result = await useReadContract({
        address: CONTRACT_ADDRESS as Address,
        abi: CONTRACT_ABI,
        functionName: "getMessages",
        args: [roomId],
      });

      return result.data || [];
    } catch (err) {
      console.error("Error reading messages:", err);
      setError(err);
      return [];
    }
  };

  const waitForReceipt = async (hash: Address) => {
    const receipt = await useWaitForTransactionReceipt({
      hash,
      confirmations: 1,
    });

    return receipt.data;
  };