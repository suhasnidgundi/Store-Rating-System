import { useAuthStore } from '../stores/auth'
import { Card } from '../components/ui/Card'

export const Dashboard = () => {
  const { user } = useAuthStore()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <Card>
        <h2 className="text-xl font-semibold">Welcome, {user?.name}!</h2>
        <p className="text-gray-600 dark:text-gray-400">Role: {user?.role}</p>
      </Card>
      {/* Add dashboard widgets based on role */}
    </div>
  )
}