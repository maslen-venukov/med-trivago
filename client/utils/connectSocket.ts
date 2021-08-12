import io from 'socket.io-client'

const connectSocket = () => io(process.env.NEXT_PUBLIC_ENV_API_URL + '')

export default connectSocket