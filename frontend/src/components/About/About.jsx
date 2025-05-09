
import aboutImg from '../../assets/images/about.png';
import aboutCardImg from '../../assets/images/about-card.png';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <section>
      <div className='container'>
        <div className='flex justify-between gap-[50px] lg:gap-[130px] xl:ap-8 flex-col lg:flex-row'>
          <div className='relative w-3/4 lg:w-1/2 xl:w-[770px] z-10 order-2 lg:order-1'>
            <img src={aboutImg} alt=""></img>
            <div className='absolute z-20 bottom-4 w-[200px] md:w-[300px] right-[-30px] md:right-[-7%] lg:right-[22%]'>
              <img src={aboutCardImg} alt=""></img>
               </div>
          </div>
          <div className='w-full lg:w-1/2 xl:w-[670px] order-1 lg:order-2'>
            <h2 className='heading'>Proud to be one of the nations best</h2>
            <p className='text_para'>For 30 years in row, U.S. News & World report has recognised us as one the best publics hospitals in the Nation and #1 in Texas. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Harum, ducimus! </p>
            <p className="text_para mt-[30px]">Our best is something we strive for each day, caring for out patients-not looking back at what we accomplished but towards what we can do tomorrow. Provinding the best. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia, pariatur! </p>
            <Link to='/'><button className="btn">Learn More</button></Link>
          </div>

        </div>
      </div>
    </section>
  )
}

export default About