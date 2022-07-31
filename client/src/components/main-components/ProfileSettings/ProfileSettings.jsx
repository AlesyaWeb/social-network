import React from 'react';
import ProfileSettingsForm from "./ProfileSettingsForm";

const ProfileSettings = (props) => {
    const onApplyChanges = (profileNewData) => {
        props.updateUserProfileData(profileNewData)
    }
    console.log(props.profileInfo)
    return (
        <div>
            <h1>Edit your profile</h1>
            <ProfileSettingsForm initialValues={props.profileInfo} onSubmit={onApplyChanges}  />
        </div>
    );
};

export default ProfileSettings;