
const Banner = ({ banner }) => {
  return (
    <div className='keen-slider__slide'>
      <img className='block w-full' src={banner.image} alt='' />
    </div>
  );
};

export default Banner;
