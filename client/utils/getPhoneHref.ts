const getPhoneHref = (str: string) => str.replace(/[^+\d]+/g, '')

export default getPhoneHref