import React from "react";
import Profile from "./Profile";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {acceptUserProfile, setUserProfile, setAuth, updateUserStatus, getUserStatus} from "../../../redux/ProfileReducer";
import {compose} from "redux";
import WithAuthRedirect from "../../hoc/WithAuthRedirect";
import Preloader from "../../common/Preloader";

class ProfileContainer extends React.Component {

    refreshProfile() {
        let userId = this.props.match.params.userId;
        if(!userId){
            userId = this.props.logginedUserId
            if(!userId){
                this.props.history.push('/login')
            }
        }
        this.props.setUserProfile(userId)
        this.props.getUserStatus(userId)
    }

    componentDidMount() {
        this.refreshProfile()
    }
    componentDidUpdate(prevProps, prevState) {
        if(prevProps.match.params.userId != this.props.match.params.userId){
            this.refreshProfile()
        }
    }

    render() {
        return <>
            {this.props.isFetching ? <Preloader isFetching={this.props.isFetching} /> :
                <Profile {...this.props}
                         ProfileData={this.props.ProfileData}
                         status={this.props.status}
                         updateStatus={this.props.updateUserStatus}
                         ProfileId={this.props.ProfileId}
                         UserId={this.props.logginedUserId}
                />
            }

        </>
    }
}

const mapStateToProps = (state) => {
    return{
        ProfileData: state.ProfilePage.ProfileData,
        status: state.ProfilePage.status,
        ProfileId: state.ProfilePage.ProfileData.user,
        logginedUserId: state.auth.userInfo.id,
        userId: state.auth.id,
        isFetching: state.ProfilePage.isFetching,
    }
}


export default compose(
    connect(mapStateToProps, {getUserStatus, updateUserStatus, acceptUserProfile, setUserProfile, setAuth}),
    withRouter
)(ProfileContainer)