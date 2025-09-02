import { useState } from 'react'
import { useStores } from '../hooks/useStores'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { StarRating } from '../components/ui/StarRating'
import { useDebounce } from '../hooks/useDebounce'

export const Stores = () => {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const { data, isLoading } = useStores({ q: debouncedSearch })

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Stores</h1>
      <Input
        placeholder="Search stores..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data?.items.map((store) => (
            <Card key={store.id}>
              <h3 className="text-lg font-semibold">{store.name}</h3>
              <p className="text-gray-600">{store.address}</p>
              <div className="flex items-center space-x-2">
                <StarRating value={store.averageRating} readonly />
                <span>({store.totalRatings})</span>
              </div>
              <Button className="mt-4">View Details</Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}