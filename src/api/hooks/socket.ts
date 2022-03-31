import { io } from 'socket.io-client'
import { API_ROOT_URL } from '../../constants/api-constants'

export const socket = io(API_ROOT_URL, { transports: ['polling'] })
