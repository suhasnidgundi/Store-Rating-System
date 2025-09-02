import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
  mode: 'light' | 'dark'
  toggle: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'light',
      toggle: () =>
        set((state) => {
          const newMode = state.mode === 'light' ? 'dark' : 'light'
          document.documentElement.classList.toggle('dark', newMode === 'dark')
          return { mode: newMode }
        }),
    }),
    { name: 'theme-storage' }
  )
)