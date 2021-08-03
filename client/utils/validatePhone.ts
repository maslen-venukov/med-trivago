import { RuleObject } from 'antd/lib/form'
import { StoreValue } from 'antd/lib/form/interface'

const validatePhone = () => ({
  validator(_: RuleObject, value: StoreValue) {
    if(!value || value === '+7 (___) ___-__-__') {
      return Promise.reject(new Error('Пожалуйста введите ваш номер телефона!'))
    }
    if(value.includes('_')) {
      return Promise.reject(new Error('Некорректный формат номера телефона!'))
    }
    return Promise.resolve()
  }
})

export default validatePhone