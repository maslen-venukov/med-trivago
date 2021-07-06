const formatPrice = (price: number) => `${new Intl.NumberFormat('ru-RU').format(price)} ₽`

export default formatPrice