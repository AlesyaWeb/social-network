import React from 'react';
import {connect} from "react-redux";
import Redirect from "react-router-dom/es/Redirect";

let mapStateToPropsForRedirect = (state) => ({
    isAuth: state.auth.isAuth
});

const WithAuthRedirect = (Component) => {
    class RedirectComponent extends React.Component {
        render(){
            if(this.props.isAuth === false) return <Redirect to={"/login"} />
            return <Component {...this.props} />
        }

    }

    let ConnectedAuthRedirectComponent = connect(mapStateToPropsForRedirect)(RedirectComponent)

    return ConnectedAuthRedirectComponent;
};

export default WithAuthRedirect;