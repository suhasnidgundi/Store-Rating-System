import { NavLink } from 'react-router-dom'
import { Store, Users, BarChart3, Star } from 'lucide-react'
import { useAuthStore } from '../../stores/auth'
import { cn } from '../../utils/cn'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: BarChart3, roles: ['ADMIN', 'USER', 'OWNER'] },
  { to: '/stores', label: 'Stores', icon: Store, roles: ['ADMIN', 'USER', 'OWNER'] },
  { to: '/users', label: 'Users', icon: Users, roles: ['ADMIN'] },
  { to: '/ratings', label: 'Ratings', icon: Star, roles: ['ADMIN', 'OWNER'] },
]

export const Sidebar = () => {
  const { user } = useAuthStore()

  return (
    <aside className="w-64 border-r bg-white dark:bg-gray-800">
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems
            .filter((item) => user?.role && item.roles.includes(user.role))
            .map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    )
                  }
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
        </ul>
      </nav>
    </aside>
  )
}