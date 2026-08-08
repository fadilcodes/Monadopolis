import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { MONADOPOLIS_CONTRACT_ADDRESS, MONADOPOLIS_ABI } from "./contracts";

export function useCityVote() {
  const { data: hash, isPending, error, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const voteOnChain = (disasterId: bigint, optionIndex: number) => {
    writeContract({
      address: MONADOPOLIS_CONTRACT_ADDRESS,
      abi: MONADOPOLIS_ABI,
      functionName: "voteSolution",
      args: [disasterId, optionIndex],
      gas: BigInt(500000),
    });
  };

  return {
    voteOnChain,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}
