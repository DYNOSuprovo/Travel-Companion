"use client"

import * as React from "react"

interface ThemeProviderProps {
  children: React.ReactNode
  attribute?: string
  defaultTheme?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
}

export function ThemeProvider({ children, defaultTheme = "light", ...props }: ThemeProviderProps) {
  const [theme, setTheme] = React.useState(defaultTheme)

  React.useEffect(() => {
    // Set initial theme
    const htmlElement = document.documentElement
    htmlElement.classList.remove("light", "dark")
    htmlElement.classList.add(theme)
  }, [theme])

  return <div data-theme={theme}>{children}</div>
}
