import { ChainId, JSBI, Percent } from '@sushiswap/sdk'
import MUMBAI_ROUTER_JSON from './deployments/mumbai/Router.json'
import MUMBAI_EQUIVALENCE_JSON from './deployments/mumbai/EquivalenceFormula.json'
import MUMBAI_BOLDTOKEN_JSON from './deployments/mumbai/BoldToken.json'
import MUMBAI_COINTOSS_JSON from './deployments/mumbai/OFCointossP2P.json'
import MUMBAI_COINTOSSHOUSE_JSON from './deployments/mumbai/OFCointossHouse.json'
import MUMBAI_PREDICTION_JSON from './deployments/mumbai/OFPredictionP2P.json'
import MUMBAI_PREDICTIONHOUSE_JSON from './deployments/mumbai/OFPredictionsHouse.json'
import MUMBAI_STAKINGBOLD_JSON from './deployments/mumbai/OFStaking.json'
import MUMBAI_STAKINGLP_JSON from './deployments/mumbai/OFStaking_lp.json'
import MUMBAI_LPTOKEN_JSON from './deployments/mumbai/SpoxToken.json'

import MAIN_EQUIVALENCE_JSON from './deployments/mainnet/EquivalenceFormula.json'
import MAIN_ROUTER_JSON from './deployments/mainnet/Router.json'
import MAIN_BOLDTOKEN_JSON from './deployments/mainnet/BoldToken.json'
import MAIN_COINTOSS_JSON from './deployments/mainnet/OFCointossP2P.json'
import MAIN_COINTOSSHOUSE_JSON from './deployments/mainnet/OFCointossHouse.json'
import MAIN_PREDICTION_JSON from './deployments/mainnet/OFPredictionP2P.json'
import MAIN_PREDICTIONHOUSE_JSON from './deployments/mainnet/OFPredictionsHouse.json'
import MAIN_STAKINGBOLD_JSON from './deployments/mainnet/OFStaking_Proxy.json'
import MAIN_STAKINGLP_JSON from './deployments/mainnet/OFStaking_lp.json'
import MAIN_LPTOKEN_JSON from './deployments/mainnet/SpoxToken.json'

export const POOL_DENY = ['14', '29', '45', '30']

export const EQUIVALENCE_ADDRESS =
  process.env.NEXT_PUBLIC_NETWORK === 'MUMBAI' ? MUMBAI_EQUIVALENCE_JSON.address : MAIN_EQUIVALENCE_JSON.address
export const ROUTER_ADDRESS =
  process.env.NEXT_PUBLIC_NETWORK === 'MUMBAI' ? MUMBAI_ROUTER_JSON.address : MAIN_ROUTER_JSON.address
export const BOLDTOKEN_ADDRESS =
  process.env.NEXT_PUBLIC_NETWORK === 'MUMBAI' ? MUMBAI_BOLDTOKEN_JSON.address : MAIN_BOLDTOKEN_JSON.address
export const COINTOSS_ADDRESS =
  process.env.NEXT_PUBLIC_NETWORK === 'MUMBAI' ? MUMBAI_COINTOSS_JSON.address : MAIN_COINTOSS_JSON.address
export const COINTOSS_HOUSE_ADDRESS =
  process.env.NEXT_PUBLIC_NETWORK === 'MUMBAI' ? MUMBAI_COINTOSSHOUSE_JSON.address : MAIN_COINTOSSHOUSE_JSON.address
export const PREDICTION_ADDRESS =
  process.env.NEXT_PUBLIC_NETWORK === 'MUMBAI' ? MUMBAI_PREDICTION_JSON.address : MAIN_PREDICTION_JSON.address
export const PREDICTION_HOUSE_ADDRESS =
  process.env.NEXT_PUBLIC_NETWORK === 'MUMBAI' ? MUMBAI_PREDICTIONHOUSE_JSON.address : MAIN_PREDICTIONHOUSE_JSON.address
export const SPOXTOKEN_ADDRESS = '0xB3Ed75aC9F971AB0BeFFbe34D1985F4E791151c1'
export const STAKING_BOLD_ADDRESS =
  process.env.NEXT_PUBLIC_NETWORK === 'MUMBAI' ? MUMBAI_STAKINGBOLD_JSON.address : MAIN_STAKINGBOLD_JSON.address
export const STAKING_LP_ADDRESS =
  process.env.NEXT_PUBLIC_NETWORK === 'MUMBAI' ? MUMBAI_STAKINGLP_JSON.address : MAIN_STAKINGLP_JSON.address
export const LPTOKEN_ADDRESS =
  process.env.NEXT_PUBLIC_NETWORK === 'MUMBAI' ? MUMBAI_LPTOKEN_JSON.address : MAIN_LPTOKEN_JSON.address
export const CHAINID = process.env.NEXT_PUBLIC_NETWORK === 'MUMBAI' ? 80001 : 137
export const CHAINID_HEX = process.env.NEXT_PUBLIC_NETWORK === 'MUMBAI' ? '0x13881' : '0x89'

// Block time here is slightly higher (~1s) than average in order to avoid ongoing proposals past the displayed time
export const AVERAGE_BLOCK_TIME_IN_SECS = 13

export const MERKLE_ROOT =
  'https://raw.githubusercontent.com/sushiswap/sushi-vesting/master/merkle/week-19/merkle-10959148-11824101.json'

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 30 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 30

// used for rewards deadlines
export const BIG_INT_SECONDS_IN_WEEK = JSBI.BigInt(60 * 60 * 24 * 7)

export const BIG_INT_ZERO = JSBI.BigInt(0)

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)

// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%

// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%

// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH

export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), JSBI.BigInt(10000))

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')

// SDN OFAC addresses
export const BLOCKED_ADDRESSES: string[] = [
  '0x7F367cC41522cE07553e823bf3be79A889DEbe1B',
  '0xd882cFc20F52f2599D84b8e8D58C7FB62cfE344b',
  '0x901bb9583b24D97e995513C6778dc6888AB6870e',
  '0xA7e5d5A720f06526557c513402f2e6B5fA20b008',
]

export const ANALYTICS_URL: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: 'https://analytics.sushi.com',
  [ChainId.MATIC]: 'https://analytics-polygon.sushi.com',
  [ChainId.FANTOM]: 'https://analytics-ftm.sushi.com',
  [ChainId.BSC]: 'https://analytics-bsc.sushi.com',
  [ChainId.XDAI]: 'https://analytics-xdai.sushi.com',
  [ChainId.HARMONY]: 'https://analytics-harmony.sushi.com',
  [ChainId.ARBITRUM]: undefined,
}

export const EIP_1559_ACTIVATION_BLOCK: { [chainId in ChainId]?: number } = {
  [ChainId.ROPSTEN]: 10499401,
  [ChainId.GÖRLI]: 5062605,
  [ChainId.RINKEBY]: 8897988,
}
