import { Banner } from '../../banner'
import { NavMenu } from './NavMenu'

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-[100]">
      <Banner />
      <nav className="fixed top-[40px] z-[100] min-h-navbarHeight w-full bg-colorFifteen">
        <NavMenu />
      </nav>
    </header>
  )
}
