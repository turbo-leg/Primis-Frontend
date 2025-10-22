'use client'

import * as React from 'react'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from './theme-provider'
import { Button } from './ui/button'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    console.log('ThemeToggle mounted, theme:', theme)
  }, [theme])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    console.log('Toggling theme from', theme, 'to', newTheme)
    setTheme(newTheme)
  }

  // Always render the button, just disable it when not mounted
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      disabled={!mounted}
      className="text-white/80 hover:text-white rounded-full h-8 w-8 p-0 hover:bg-white/10 transition-colors"
      aria-label="Toggle theme"
      title={mounted ? (theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode') : 'Loading...'}
    >
      {mounted && theme === 'dark' ? (
        <Sun className="h-4 w-4 transition-transform hover:rotate-12" />
      ) : (
        <Moon className="h-4 w-4 transition-transform hover:-rotate-12" />
      )}
    </Button>
  )
}
