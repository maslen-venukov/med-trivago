const getPhoneHref = (str: string) => `tel:${str.replace(/[^+\d]+/g, '')}`

export default getPhoneHref