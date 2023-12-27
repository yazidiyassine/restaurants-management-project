import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import {Link} from 'react-router-dom';

const Error = () => {
    const error = {
        status: 404,
        statusText: 'Not Found',
    };
    return (
        <div className='min-h-screen flex flex-col justify-center items-center'>
            <h1 className='text-4xl font-bold uppercase my-4 flex gap-2 items-center'>
                <ExclamationTriangleIcon className='w-10 h-10 text-yellow-500' /> Oops!!
            </h1>
            <h1 className='text-xl'>
                {error.status}: {error.statusText}
            </h1>
            <Link to={'/'} className='text-orange-500 hover:underline'>Return to Home</Link>
        </div>
    );
};

export default Error;
