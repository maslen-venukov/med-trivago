import React from 'react'
import Link from 'next/link'

import Result from 'antd/lib/result'
import Button from 'antd/lib/button'

const NotFound: React.FC = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle="Страница не найдена"
      extra={
        <Button type="primary">
          <Link href="/">На главную</Link>
        </Button>
      }
    />
  )
}

export default NotFound
