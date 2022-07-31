import classes from './Side.module.css';
import {NavLink} from "react-router-dom";

const Side = (props) => {
    return(
        <>
          <aside className={classes.main_side}>
            <div className={classes.side}>
              <ul className={classes.side__list}>
                <li className={classes['side__list-item']}>
                  <NavLink to={`/profile`} onClick={props.onProfileClick} className={classes["side__list-link"]} activeClassName={classes.active}>Profile</NavLink>
                </li>
                <li className={classes['side__list-item']}>
                  <NavLink to="/dialogs" className={classes["side__list-link"]} activeClassName={classes.active}>Messages</NavLink>
                </li>
                <li className={classes['side__list-item']}>
                  <a href="#" className={classes["side__list-link"]}>News</a>
                </li>
                <li className={classes['side__list-item']}>
                  <a href="#" className={classes["side__list-link"]}>Music</a>
                </li>
                <li className={classes['side__list-item']}>
                  <NavLink to="/friends" className={classes["side__list-link"]} activeClassName={classes.active}>Friends</NavLink>
                </li>
                <li className={classes['side__list-item']}>
                  <NavLink to="/users" className={classes["side__list-link"]} activeClassName={classes.active}>Users</NavLink>
                </li>
              </ul>
            </div>
          </aside>
          <div className={classes.mobileMenu}>
            <ul className={classes.mobileMenu__list}>
              <li className={classes['mobileMenu-item']}>
                <NavLink to={`/profile`} onClick={props.onProfileClick} className={classes["side__list-link"]} activeClassName={classes.active}>Profile</NavLink>
                <NavLink to={`/profile`} onClick={props.onProfileClick} className={classes["footer__list-link"] + ' ' + classes["profile"]} activeClassName={classes.active}></NavLink>
              </li>
              <li className={classes['mobileMenu-item']}>
                <NavLink to="/dialogs" className={classes["side__list-link"]} activeClassName={classes.active}>Messages</NavLink>
                <NavLink to={`/dialogs`} onClick={props.onProfileClick} className={classes["footer__list-link"] + ' ' + classes["messages"]} activeClassName={classes.active}></NavLink>
              </li>
              <li className={classes['mobileMenu-item']}>
                <NavLink to="/users" className={classes["side__list-link"]} activeClassName={classes.active}>Users</NavLink>
                <NavLink to="/users" className={classes["footer__list-link"] + ' ' + classes["users"]} activeClassName={classes.active}></NavLink>
              </li>
              <li className={classes['mobileMenu-item']}>
                <NavLink to="/friends" className={classes["side__list-link"]} activeClassName={classes.active}>Friends</NavLink>
                <NavLink to="/friends" className={classes["footer__list-link"] + ' ' + classes["friends"]} activeClassName={classes.active}></NavLink>
              </li>
            </ul>
          </div>
        </>
    );
}
export default Side;