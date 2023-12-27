import {StarIcon} from '@heroicons/react/24/solid';
const RestaurantCard = ({restaurant}) => {

    return (
        <>
            <div className='overlay-container'>
                <img
                    src={restaurant.image}
                    alt='restaurant'
                    height={190}
                    width={120}
                    className='relative w-full min-h-[180px] overflow-hidden aspect-video object-cover block rounded-md'
                />
            </div>

            <h2 className='text-lg font-semibold mt-2 text-zinc-800'>{restaurant.name}</h2>
            <div className='flex items-center gap-2'>
                <StarIcon className='w-6 h-6 text-orange-400'/>{' '}
                <p className='font-semibold text-gray-700 text-sm'>
                    {restaurant.pincode}
                </p>
            </div>

            <p className='text-zinc-600'>{restaurant.address.line_1}</p>
            <p className='text-zinc-600'>{restaurant.state.name}</p>
            
        </>
    );
};

export default RestaurantCard;

//  HOC for Top Rated Restaurants
export const withTopRatedLabel = (RestaurantCard) => {
    return (props) => {
        return (
            <div className='relative'>
                <p className='absolute z-10 -top-2 -left-2 rounded-md p-2 px-4 bg-zinc-900 text-white text-xs'>
                    Top Rated
                </p>
                <RestaurantCard {...props} />
            </div>
        );
    };
};
