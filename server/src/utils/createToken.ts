import jwt from 'jsonwebtoken'

const SECRET_KEY = process.env.SECRET_KEY
const TOKEN_LIFETIME = process.env.TOKEN_LIFETIME

const createToken = (payload: any) => `Bearer ${jwt.sign(payload, SECRET_KEY, { expiresIn: TOKEN_LIFETIME })}`

export default createToken