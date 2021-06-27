import moment from 'moment'

const renderDate = (text: string) => moment(text).format('HH:mm, DD.MM.YYYY')

export default renderDate