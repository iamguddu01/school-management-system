"use client"
import React, { useState } from 'react'
import { Provider } from 'react-redux'
import makeStore from './store.js'

const StoreProvider = ({children}) => {
  // Use lazy state initialization so makeStore() runs only once on mount
  const [store] = useState(() => makeStore())

  return (
    <Provider store={store}>{children}</Provider>
  )
}
// 
export default StoreProvider