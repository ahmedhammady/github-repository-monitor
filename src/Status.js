import React from 'react';

export const Status = (props) => {
    if (props.data.status==='failure') {
        return <span className='testFailed'>Fail</span>
    } else {
        return <span className='testPassed'>Pass</span>
    }
}