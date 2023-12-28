import React, { useState } from 'react';
import FoodItem from './FoodItem';
import { useKeenSlider } from 'keen-slider/react';
import { ArrowLongLeftIcon, ArrowLongRightIcon } from '@heroicons/react/24/outline';
import 'keen-slider/keen-slider.min.css';
import {Skeleton} from "@mui/material";
import {Link} from "react-router-dom";

const FoodList = ({ menuItems }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [sliderRef, instanceRef] = useKeenSlider({
        mode: 'free-snap',
        renderMode: 'performance',
        slideChanged(slider) {
            if (slider && slider.track && slider.track.details) {
                setCurrentSlide(slider.track.details.rel);
            }
        },
        slidesPerView: 5,
        initial: 0,
        breakpoints: {
            '(max-width: 480px)': {
                slides: { perView: 4, spacing: 10 },
            },
            '(min-width: 480px)': {
                slides: { perView: 5, spacing: 10 },
            },
            '(min-width: 768px)': {
                slides: { perView: 5, spacing: 5 },
            },
        },
    });

    const handlePrevClick = () => {
        if (instanceRef.current && instanceRef.current.prev) {
            instanceRef.current.prev();
        }
    };

    const handleNextClick = () => {
        if (
            instanceRef.current &&
            instanceRef.current.next &&
            instanceRef.current.track &&
            instanceRef.current.track.details &&
            currentSlide <
            instanceRef.current.track.details.slides.length - 1
        ) {
            instanceRef.current.next();
        }
    };

    return (
        <div className='container mx-auto mt-8 mb-16 p-4'>
            <div className='flex items-center justify-between'>
                <h1 className='mb-4 font-bold text-2xl text-zinc-700'>
                    Menu Items
                </h1>

                {menuItems.length > 1 && (
                    <div className='flex gap-2 items-center'>
                        <button
                            disabled={currentSlide === 0}
                            onClick={handlePrevClick}
                            className='bg-gray-100 p-2 rounded-full disabled:text-gray-300'
                        >
                            <ArrowLongLeftIcon className='w-4 h-4' />{' '}
                        </button>
                        <button
                            disabled={
                                currentSlide ===
                                instanceRef?.current?.track?.details?.slides?.length - 1
                            }
                            onClick={handleNextClick}
                            className='bg-gray-100 p-2 rounded-full disabled:text-gray-300'
                        >
                            <ArrowLongRightIcon className='w-4 h-4' />{' '}
                        </button>
                    </div>
                )}
            </div>

            <div ref={sliderRef} className='keen-slider'>
                {menuItems.map((menuItem, index) => (
                    <div className='keen-slider__slide' key={index}>
                        {menuItem ? (
                            <Link
                                to={`/get-restaurant-info/${menuItem.restaurant.id}`}
                                className='hover:scale-95 transition ease-in-out duration-300 relative z-10 flex'
                                key={index}
                            >
                            <FoodItem menuItem={menuItem} />
                            </Link>
                        ) : (
                            <Skeleton animation="wave" variant="circular" width={104} height={129} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FoodList;
