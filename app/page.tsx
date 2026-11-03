import { createClient } from '@/lib/supabase-server'
import HeroSection from '@/components/HeroSection'
import PortfolioView from '@/components/PortfolioView'
import SkillsSection from '@/components/SkillsSection'
import FooterSection from '@/components/FooterSection'
import { PortfolioItem } from '@/types/portfolio'

export const revalidate = 60

async function getItems(): Promise<PortfolioItem[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*, item_attachments(*)')
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
  const metrics = {
    total: items.length,
    awards: items.filter(i => i.is_awarded).length,
    live: items.filter(i => i.status === 'IN_PROGRESS').length,
    domains: new Set(items.map(i => i.domain_tag)).size,
  }

  return (
    <main className="min-h-screen">
      <HeroSection metrics={metrics} />
      <PortfolioView items={items} />
      <SkillsSection />
      <FooterSection />
    </main>
  )
}
