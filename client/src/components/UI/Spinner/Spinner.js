import React from 'react';
import 'components/UI/Spinner/Spinner.css';

const spinner = (props) => {
    if(props.color === 2){
        return <div className="pLoader">Loading</div>;
    }
    else{
        return <div className="loader">Loading</div>;
    }
};

    
export default spinner;