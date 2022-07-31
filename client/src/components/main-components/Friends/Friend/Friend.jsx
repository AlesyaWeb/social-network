import React from 'react';
import classes from "../../Users/User/User.module.css";
import {NavLink} from "react-router-dom";

const Friend = (props) => {
    return (
        <div className={classes.Friend}>
            <NavLink to={'/profile/' + props.id} className={classes.friend__avatar}>
                <img width="60" src={props.avatar} alt=""/>
            </NavLink>
            <div className={classes.friend__name}>
                {props.first_name}
                <span>    </span>
                {props.last_name}
            </div>
            <div className={classes.isOnline}>{props.online ? <div className={classes.online}>Online</div> :
                <div className={classes.ofline}>offline</div>}</div>
        </div>
    );
};

export default Friend;