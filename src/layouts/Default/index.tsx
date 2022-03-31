import Header from '../../components/Header'
import Main from '../../components/Main'
import Banner from '../../components/Banner'

const Layout = ({ children, banner = undefined }) => {
  return (
    <div className="z-0 flex flex-col items-center w-full h-screen lg:pb-0">
      {banner && <Banner />}
      <Header />
      <Main>{children}</Main>
    </div>
  )
}

export default Layout
