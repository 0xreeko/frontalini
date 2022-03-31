export interface UserType {
  user: string
  avatar: string
  hide_profile: boolean
}

export interface TokenPayload {
  payload: {
    address: string
    timestamp: Date
  }
  signature: string
}

export interface TossType {
  HeadAmount: number
  TailAmount: number
  closePrice: number
  closeTimestamp: number
  epoch: number
  lockPrice: number
  totalAmount: number
  lockTimestamp: number
  status: number
  winner: boolean
  Headpayout: number
  Tailpayout: number
  winnerList: boolean[]
  oracleCalled: boolean
}

export interface HouseType {
  HeadAmount: number
  TailAmount: number
  closePrice: number
  closeTimestamp: number
  epoch: number
  lockPrice: number
  totalAmount: number
  lockTimestamp: number
  status: number
  winner: boolean
  Headpayout: number
  Tailpayout: number
  winnerList: boolean[]
  oracleCalled: boolean
}

export interface PredictionType {
  BullAmount: number
  BearAmount: number
  closePrice: number
  closeTimestamp: number
  epoch: number
  lockPrice: number
  totalAmount: number
  lockTimestamp: number
  status: number
  winner: boolean
  Headpayout: number
  Tailpayout: number
  winnerList: boolean[]
  oracleCalled: boolean
}

export interface NotificationList {
  winType?: string
  amount?: number
  panel?: string
  coinType?: string
  time?: number
}
