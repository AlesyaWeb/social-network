import React from "react";
import {connect} from "react-redux";
import Header from "./Header";
import {setUserData, logout, uploadAvatarSuccess} from "../../redux/authReducer";


class HeaderContainer extends React.Component {
    Logout = () => {
        this.props.logout(this.props.email, this.props.password)
    }

    render() {
        return <Header {...this.props} data={this.props} Logout={this.Logout} />
    }
}


const mapStateToProps = (state) => {
    return{
        isAuth: state.login.isAuth,
        currUserData: state.auth.userInfo
    }
}

export default connect(mapStateToProps, {setUserData, logout})(HeaderContainer)