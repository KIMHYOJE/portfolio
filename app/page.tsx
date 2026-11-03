import { createClient } from '@/lib/supabase-server'
import HeroSection from '@/components/HeroSection'
import FeaturedGrid from '@/components/FeaturedGrid'
import ActivityTimeline from '@/components/ActivityTimeline'
import SkillsSection from '@/components/SkillsSection'
import FooterSection from '@/components/FooterSection'
import { PortfolioItem } from '@/types/portfolio'

export const revalidate = 60

async function getItems(): Promise<PortfolioItem[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .eq('is_published', true)
      .order('start_date', { ascending: false })
    if (error) throw error
    return data ?? []
  } catch {
    return []
  }
}

export default async function Home() {
  const items = await getItems()
  const featured = items.filter(i => i.is_featured)
  const awarded = items.filter(i => i.is_awarded)

  return (
    <main className="min-h-screen">
      <HeroSection awardCount={awarded.length} totalCount={items.length} />
      <FeaturedGrid items={featured} />
      <ActivityTimeline items={items} />
      <SkillsSection />
      <FooterSection />
    </main>
  )
}
