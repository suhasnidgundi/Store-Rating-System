import { Link, useNavigate } from 'react-router-dom'
import { Moon, Sun, LogOut, User } from 'lucide-react'
import { useAuthStore } from '../../stores/auth'
import { useThemeStore } from '../../stores/theme'
import { Button } from '../ui/Button'

export const Header = () => {
  const { user, logout } = useAuthStore()
  const { mode, toggle } = useThemeStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 dark:bg-gray-900">
      <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white">
        Store Rating
      </Link>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={toggle}>
          {mode === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </Button>
        {user && (
          <>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {user.name} ({user.role})
            </span>
            <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
              <User size={16} />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut size={16} />
            </Button>
          </>
        )}
      </div>
    </header>
  )
}