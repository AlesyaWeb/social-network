import React from 'react';
import {connect} from "react-redux";
import DropZonePopup from "./DropZonePopup";
import {uploadAvatar} from "../../../../redux/authReducer";
import Preloader from "../../../common/Preloader";


class DropZonePopupContainer extends React.Component {
        render() {
            return <>
                {
                    this.props.isFetching ? <Preloader isFetching={this.props.isFetching} /> :
                        <DropZonePopup uploadAvatar={this.props.uploadAvatar}
                                       currentAvatar={this.props.currentAvatar}
                                       isFetching={this.props.isFetching}
                                       active={this.props.active}
                        />
                }
            </>
        }
}

const mapStateToProps = (state) => {
    return {
        currentAvatar: state.ProfilePage.ProfileData.photo_50,
        isFetching: state.auth.isFetching
    }

}

export default connect(mapStateToProps, {uploadAvatar})(DropZonePopupContainer)