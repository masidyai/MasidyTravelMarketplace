import { getDemoMarketplaceData, getMarketplaceData } from '@/lib/marketplace-data'
import Marketplace from './marketplace'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [{ trips, agencies }, { trips: demoTrips }] = await Promise.all([
    getMarketplaceData(),
    getDemoMarketplaceData(),
  ])
  return <Marketplace trips={trips} agencies={agencies} demoTrips={demoTrips} />
}
