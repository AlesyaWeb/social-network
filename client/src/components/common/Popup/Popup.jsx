import React from 'react';
import classes from './Popup.module.css'
const Popup = ({active, setActive, children}) => {
    console.log(active)
    return (
        <div className={active ? classes.modal + " " + classes.active : classes.modal} onClick={() => {setActive(false)}}>
            <div className={classes.modal_content} onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

export default Popup;