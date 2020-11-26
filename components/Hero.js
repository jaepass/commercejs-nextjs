import Image from 'next/image'

const Hero = () => (

  <div className="hero">
      <Image
        alt="Housewares hero image"
        src="/images/hero.jpg"
        layout="fill"
        objectFit="cover"
        quality={100}
      />
  </div>
);

export default Hero;