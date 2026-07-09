import { createContext, useContext } from 'react'

export const DarkContext = createContext({ dark: false, toggleDark: () => {} })

export function useLayout() {
  return useContext(DarkContext)
}
