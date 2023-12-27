// Search.js
import React, { useState } from 'react';
import {MagnifyingGlassIcon} from "@heroicons/react/16/solid";

const Search = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleInputChange = (event) => {
        setQuery(event.target.value);
        onSearch(event.target.value);
    };

    return (
        <form className='flex gap-2 md:gap-4 max-w-[560px] w-[90%] mx-auto mt-6'>
            <input
                type='search'
                name='search'
                id='search'
                placeholder='Search for Italian food, burger, etc.'
                className='p-2 px-4 rounded-md border outline-none focus-within:border-orange-400 border-gray-200 grow w-full'
                value={query}
                onChange={handleInputChange}
            />
            <button
                type='submit'
                className='bg-orange-400 basis-2/12 text-center text-white p-2 flex justify-center gap-2 items-center md:px-8 rounded-md text-sm md:text-base'
            >
                <MagnifyingGlassIcon className='w-4 h-4'/>{' '}
                <span className='hidden md:block'>Search</span>
            </button>
        </form>
    );
};

export default Search;