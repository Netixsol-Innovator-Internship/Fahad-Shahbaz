import Hero from '../components/Hero';
import Features from '../components/Features';
import Collections from '../components/Collections';

const LandingPage = () => {
  return (
    <div className='container mx-w-[1660px] mx-auto'>
      <Hero />
      <Features />
      <Collections />
    </div>
  )
}

export default LandingPage