'use client'
import { useState } from 'react'
import FeaturedGrid from './FeaturedGrid'
import ActivityTimeline from './ActivityTimeline'
import ItemDetail from './ItemDetail'
import { PortfolioItem } from '@/types/portfolio'

export default function PortfolioView({ items }: { items: PortfolioItem[] }) {
  const [selected, setSelected] = useState<PortfolioItem | null>(null)

  const featured = items
    .filter(i => i.is_featured)
    .sort((a, b) => (a.featured_rank ?? 99) - (b.featured_rank ?? 99))
  const live = items.filter(i => i.status === 'IN_PROGRESS')

  return (
    <>
      <FeaturedGrid items={featured} live={live} onSelect={setSelected} />
      <ActivityTimeline items={items} onSelect={setSelected} />
      <ItemDetail item={selected} onClose={() => setSelected(null)} />
    </>
  )
}
