import io from 'socket.io-client'

import { API_URL } from '../constants'

const connectSocket = () => io(API_URL)

export default connectSocket