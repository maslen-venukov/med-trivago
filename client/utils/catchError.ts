import message from 'antd/lib/message'

const catchError = (e: any) => {
  message.error(e.response?.data?.message || 'Что-то пошло не так')
}

export default catchError