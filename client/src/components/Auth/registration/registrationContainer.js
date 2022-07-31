import React from 'react';
import {connect} from "react-redux";
import Registration from "./registration";
import {regUser} from "../../../redux/authReducer";

class RegistrationContainer extends React.Component {
    regUser = (email, password, userData) => {
        this.props.regUser(email, password, userData)
    }
    render() {
        console.log(this.props)
        return (
            <Registration regUser={this.regUser} />
        );
    }
}

const mapStateToProps = (state) => ({
    isAuth: state.auth.isAuth
})

export default connect(mapStateToProps, {regUser})(RegistrationContainer)