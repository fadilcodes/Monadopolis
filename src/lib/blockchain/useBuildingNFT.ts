import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { MONADOPOLIS_CONTRACT_ADDRESS, MONADOPOLIS_ABI } from "./contracts";

export function useBuildingNFT() {
  const { data: hash, isPending, error, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const mintBuilding = (recipient: `0x${string}`) => {
    writeContract({
      address: MONADOPOLIS_CONTRACT_ADDRESS,
      abi: MONADOPOLIS_ABI,
      functionName: "mintBuilding",
      args: [recipient],
    });
  };

  return {
    mintBuilding,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}
