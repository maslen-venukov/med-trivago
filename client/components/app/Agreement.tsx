import React from 'react'
import Link from 'next/link'

import Typography from 'antd/lib/typography'

const Agreement: React.FC = () => {
  return (
    <Typography.Text type="secondary" className="text-center">
      <small>Нажимая на кнопку, вы даете согласие на обработку своих персональных данных и соглашаетесь с <Link href="/privacy"><a>политикой конфиденциальности</a></Link></small>
    </Typography.Text>
  )
}

export default Agreement