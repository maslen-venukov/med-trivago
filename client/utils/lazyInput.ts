import React from 'react'

const lazyInput = (
  timer: number,
  setTimer: React.Dispatch<React.SetStateAction<number>>,
  cb: () => void,
  timeout: number = 500
) => {
  if(timer) clearTimeout(timer)
  setTimer(window.setTimeout(cb, timeout))
}

export default lazyInput