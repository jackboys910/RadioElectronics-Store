declare module '*.svg' {
  import React from 'react'
  import { SvgProps } from 'react-native-svg'
  const content: React.FC<SvgProps>
  export default content
}

declare module '@env' {
  export const REACT_APP_API_URL: string
  export const REACT_APP_CURRENCY_ACCESS_KEY: string
}
