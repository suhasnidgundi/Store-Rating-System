import { useEffect } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../utils/cn'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  onClose: () => void
}

export const Toast = ({ message, type = 'info', onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 flex items-center space-x-2 rounded-md p-4 text-white shadow-lg',
        {
          'bg-green-500': type === 'success',
          'bg-red-500': type === 'error',
          'bg-blue-500': type === 'info',
        }
      )}
    >
      <span>{message}</span>
      <button onClick={onClose} className="ml-2">
        <X size={16} />
      </button>
    </div>
  )
}