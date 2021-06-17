import React from 'react'

import Spin from 'antd/lib/spin'

const Loading: React.FC = () => {
  return (
    <div className="loading">
      <Spin size="large" />
    </div>
  )
}

export default Loading
