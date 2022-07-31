import './App.css';
import HeaderContainer from './components/Header/HeaderContainer';
import Main from './components/Main/Main';
import {Component} from "react";
import {compose} from "redux";
import {connect} from "react-redux";
import {initializeApp} from "./redux/app-reducer";
import Preloader from "./components/common/Preloader";
import {withRouter} from "react-router-dom";
import {checkAuth} from "./redux/authReducer";
import {withUsersSockets} from "./components/hoc/WithUsersSockets";
class App extends Component {
    componentDidMount() {
        this.props.initializeApp();
    }

    render() {
        if(!this.props.initialized) return <Preloader />
        return (
            <div className="App">
                <HeaderContainer/>
                <Main/>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    initialized: state.appe.initialized
})

export default compose(
    connect(mapStateToProps, {initializeApp, checkAuth}),
    withUsersSockets,
    withRouter
)(App)
