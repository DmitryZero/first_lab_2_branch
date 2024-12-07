import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

export default function Spinner() {
    return (
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
            <CircularProgress/>
        </div>
    );
}