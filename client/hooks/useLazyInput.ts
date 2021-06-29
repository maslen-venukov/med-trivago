import { useState } from 'react'

const useLazyInput = (timeout = 250) => {
  const [timer, setTimer] = useState(0)

  const lazy = (cb: () => void) => {
    if(timer) {
      clearTimeout(timer)
    }
    setTimer(window.setTimeout(cb, timeout))
  }

  return lazy
}

export default useLazyInput
