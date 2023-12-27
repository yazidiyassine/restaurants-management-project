import Banner from './Banner';
import { useKeenSlider } from 'keen-slider/react';
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import ShimmerBanner from "./ShimmerBanner";
import 'keen-slider/keen-slider.min.css';

const BannerList = ({ isLoading, banners }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider({
    mode: 'free',
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    breakpoints: {
      '(max-width: 480px)': {
        slides: { perView: 1, spacing: 10 },
      },
      '(min-width: 480px)': {
        slides: { perView: 2, spacing: 10 },
      },
      '(min-width: 768px)': {
        slides: { perView: 3, spacing: 10 },
      },
    },
  });

  return (
      <div className='container mx-auto mt-2 mb-16 p-4'>
        <div className='flex justify-between items-center mb-4'>
          <h1 className='font-bold text-2xl text-zinc-700'>
            Best offers for you
          </h1>

          {instanceRef.current && (
              <div className='flex gap-2 items-center'>
                <button
                    disabled={currentSlide === 0}
                    onClick={() => instanceRef.current?.prev()}
                    className='bg-gray-100 p-2 rounded-full disabled:text-gray-300'
                >
                  <ArrowLongLeftIcon className='w-4 h-4'/>{' '}
                </button>
                <button
                    disabled={
                        currentSlide ===
                        instanceRef?.current?.track?.details?.slides?.length - 1
                    }
                    onClick={() => instanceRef.current?.next()}
                    className='bg-gray-100 p-2 rounded-full disabled:text-gray-300'
                >
                  <ArrowLongRightIcon className='w-4 h-4'/>{' '}
                </button>
              </div>
          )}
        </div>

        {isLoading ? (
            <div className='flex gap-4 md:gap-8 mb-8'>
              {Array.from({length: 3}).map((_, i) => (
                  <ShimmerBanner key={i}/>
              ))}
            </div>
        ) : (
            <div ref={sliderRef} className='keen-slider'>
              {banners.map((banner) => (
                  (banner.ispromoting === "true") ? <Banner banner={banner} key={banner.id}/> : null
              ))}
            </div>
        )}
      </div>
  );
};
export default BannerList;
