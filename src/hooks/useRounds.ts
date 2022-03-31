import MOCK_PREDICTION_ABI from '../constants/abis/mock-prediction.json'
import { useSingleCallResult } from '../state/multicall/hooks'
import { useContract } from './useContract'

export function useRounds() {
  const contract = useContract('0xB1f06d03F907a1DbcA95C37F143B01A3CF023712', MOCK_PREDICTION_ABI, false)
  const rounds = useSingleCallResult(contract, 'currentEpoch')
  console.log('rounds', rounds)
}
