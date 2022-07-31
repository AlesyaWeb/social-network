import React from 'react';
import preloader from "../../assets/images/Preloader.svg"
import classes from './Preloader.module.css';

const Preloader = (props) => {
    return (
        <div className={classes.preloaderInner}>
            <div className={classes.preloader}>
                { props.isFetching ? <img src={preloader} /> : null }
            </div>
        </div>
    );
};

export default Preloader;