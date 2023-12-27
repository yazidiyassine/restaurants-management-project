import React from 'react';
import Avatar from "@mui/material/Avatar";

const FoodItem = ({ menuItem }) => {
    return (
        <div className='w-full keen-slider__slide'>
            <Avatar src={menuItem.image}
                    className=' w-full pointer-events-none'
                    sx={{ width: 104, height: 129 }}
                    alt={menuItem.name}
            />
        </div>
    );
};

export default FoodItem;
