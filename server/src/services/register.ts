import bcrypt from 'bcryptjs'

import User from '../models/User'


interface IRegisterServiceResult {
  error?: string
  email?: string
  password?: string
}

const register = async (
  email: string,
  password: string,
  passwordCheck: string
): Promise<IRegisterServiceResult> => {
  if(!email || !password || !passwordCheck) {
    return { error: 'Заполните все поля' }
  }

  if(password !== passwordCheck) {
    return { error: 'Пароли не совпадают' }
  }

  const passwordRegExp = /(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/g
  if(!password.match(passwordRegExp)) {
    return { error: 'Пароль должен содержать не менее 6 символов, строчные и заглавные буквы латинского алфавита, хотя бы одно число и специальный символ' }
  }

  const candidate = await User.findOne({ email })
  if(candidate) {
    return { error: 'Пользователь с таким email уже зарегистрирован' }
  }

  const hashedPassword = bcrypt.hashSync(password, 7)

  return {
    email,
    password: hashedPassword
  }
}

export default register