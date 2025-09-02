import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '../../utils/cn'

interface StarRatingProps {
  value: number
  onChange?: (value: number) => void
  readonly?: boolean
  size?: number
}

export const StarRating = ({ value, onChange, readonly = false, size = 20 }: StarRatingProps) => {
  const [hoverValue, setHoverValue] = useState(0)

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onMouseEnter={() => !readonly && setHoverValue(star)}
          onMouseLeave={() => !readonly && setHoverValue(0)}
          onClick={() => !readonly && onChange?.(star)}
          className={cn(
            'transition-colors',
            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          )}
        >
          <Star
            size={size}
            className={cn(
              'fill-current',
              (hoverValue || value) >= star
                ? 'text-yellow-400'
                : 'text-gray-300'
            )}
          />
        </button>
      ))}
    </div>
  )
}