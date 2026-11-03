'use client'
import { useState } from 'react'
import FeaturedGrid from './FeaturedGrid'
import ProjectsSection from './ProjectsSection'
import ActivityTimeline from './ActivityTimeline'
import ItemDetail from './ItemDetail'
import { PortfolioItem } from '@/types/portfolio'

export default function PortfolioView({ items }: { items: PortfolioItem[] }) {
  const [selected, setSelected] = useState<PortfolioItem | null>(null)

  const projects = items.filter(i => i.category === 'PROJECT')
  const activities = items.filter(i => i.category !== 'PROJECT')
  const featured = activities
    .filter(i => i.is_featured)
    .sort((a, b) => (a.featured_rank ?? 99) - (b.featured_rank ?? 99))
  const live = activities.filter(i => i.status === 'IN_PROGRESS')

  return (
    <>
      <FeaturedGrid items={featured} live={live} onSelect={setSelected} />
      <ProjectsSection items={projects} onSelect={setSelected} />
      <ActivityTimeline items={activities} onSelect={setSelected} />
      <ItemDetail item={selected} onClose={() => setSelected(null)} />
    </>
  )
}
