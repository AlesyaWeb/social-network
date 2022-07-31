import React from "react";
import { useEffect, useState } from "react";
import MyPosts from './MyPosts/MyPosts';
import classes from './Profile.module.css';
import editImage from '../../../assets/images/edit.png'
import MyPostsContainer from "./MyPosts/MyPostsContainer";
import ProfileStatus from "./ProfileStatus/ProfileStatus";
import Popup from "../../common/Popup/Popup";
import DropZonePopup from "./DropZonePopup/DropZonePopup";
import DropZonePopupContainer from "./DropZonePopup/DropZonePopupContainer";
import {NavLink} from "react-router-dom";
const Profile = (props) => {
    const [modalIsActive, setModalIsActive] = useState(false)
    let userData = props.ProfileData;
    let isProfileEqsUser = props.ProfileId === props.UserId
    return(
      <div className={classes.profile__wrapper}>
          <Popup active={modalIsActive} setActive={setModalIsActive} >
              <DropZonePopupContainer active={modalIsActive} currentAvatar={props.photo_50} />
          </Popup>
        <div className={classes.profile_data_wrapper}>
            <div className={classes.profile_avatar}>
                <div className={classes.profile_avatar_wrapper}>
                    {isProfileEqsUser &&
                        <div className={classes.avatar_image_cover} onClick={()=>setModalIsActive(true)}>
                            <img className={classes.edit_avatar_image} src={editImage} alt="" />
                        </div>
                    }
                    <img src={userData.photo_50} className={classes.avatar_img} alt="photo"/>
                </div>
            </div>
            <div className={classes.profile_info}>
                {isProfileEqsUser &&
                    <div className={classes.edit_info_btn}>
                        <NavLink to={'/settings'}>Редактировать</NavLink>
                    </div>

                }
                <h1 className={classes.profile_name}>{userData.first_name + ' ' + userData.last_name}</h1>
                <ProfileStatus status={props.status}
                               updateStatus={props.updateStatus}
                               isProfileEqsUser={isProfileEqsUser}
                />
                <div className={classes.profile_age}>Age: {userData.age}</div>
                <div className={classes.profile_gender}>Gender: {userData.gender}</div>
                <div className={classes.description}>
                <p>About me:</p>
                {userData.description}</div>
            </div>
        </div>
        <MyPostsContainer
                 avatar={userData.photo_50}
                 userName={userData.first_name + " " + userData.last_name}
                 postsData={props.postsData}
                 NewPostTextVal={props.NewPostTextVal}
                 TextareaRows={props.TextareaRows}
                 dispatch={props.dispatch}
        />
      </div>
    );
}

export default Profile;