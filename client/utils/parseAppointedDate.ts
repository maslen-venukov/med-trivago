const parseAppointedDate = (date: string, time: string) => {
  return new Date(`${date.split('.').reverse().join('-')} ${time}`)
}

export default parseAppointedDate