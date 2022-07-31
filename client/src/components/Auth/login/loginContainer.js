
import React from 'react';
import {connect} from "react-redux";
import Login from "../login/login";
import {updateEmailText, updatePasswordText, setAuth} from "../../../redux/loginReducer"
import {login, logout} from "../../../redux/authReducer";
import {setUsers} from "../../../redux/UsersReducer";
class LoginContainer extends React.Component {
    componentDidMount(){

    }
    login = (email, password, captcha) => {
        this.props.login(email, password, captcha)
    }
    getUser = () => {
        this.props.setUsers()
    }
    Logout = () => {
        this.props.logout(this.props.email, this.props.password)
    }
    render() {
        return <>
            {this.props.isAuth ? <div>Вы успешно авторизованы 
            <div>
                <button onClick={this.Logout}>logout</button>
                <button onClick={this.getUser}>Get user</button>
            </div></div> : 
            < Login data={this.props} login={this.login} /> }
        </>
    }
}

const mapStateToProps = (state) => {
    return {
        email: state.login.emailText,
        password: state.login.passwordText,
        isAuth: state.auth.isAuth
    }
}

export default connect(mapStateToProps, {login, logout ,updateEmailText, updatePasswordText, setAuth, setUsers})(LoginContainer);