import React from 'react';
import {connect} from "react-redux";
import ProfileSettings from "./ProfileSettings";
import {compose} from "redux";
import withAuthRedirect from "../../hoc/WithAuthRedirect";
import {setUserProfile, updateUserProfileData} from "../../../redux/ProfileReducer";

class ProfileSettingsContainer extends React.Component {


    render() {
        return (
            <ProfileSettings profileInfo={this.props.profileInfo} updateUserProfileData={this.props.updateUserProfileData} />
        );
    }
}
const mapStateToProps = (state) => {
    return{
        profileInfo: state.ProfilePage.ProfileData
    }
}
export default compose(
    withAuthRedirect,
    connect(mapStateToProps, {updateUserProfileData, setUserProfile})
)(ProfileSettingsContainer)