import classes from './Header.module.css';
import {NavLink} from "react-router-dom";
const Header = (props) => {
    let userData = props.data.currUserData;
    return(
        <header className={classes.header}>
            <div className="container">
            <div className={classes.header__content}>
                <div className={classes.container}>
                    <div className={classes.header__wrapper}>
                        <div className={classes.header__logo}>PN</div>
                        {props.data.isAuth ? 
                        <div className={classes.header_user_wrapper}>
                            <img  className={classes.header_avatar} src={userData.photo_50} />
                            <p onClick={props.Logout} className={classes.header_logout}>logout</p>
                        </div> : <NavLink to="/Login" className={classes.header_login}>Login</NavLink> }
                    </div>
                </div>
            </div>
            </div>
        </header>
    );
}
export default Header;