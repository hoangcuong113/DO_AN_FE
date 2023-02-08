import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { ConnectedRouter as Router } from "connected-react-router";
import { history } from "../redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  userIsAuthenticated,
  userIsNotAuthenticated,
} from "../hoc/authentication";
import { path } from "../utils";
import Home from "../routes/Home";
import Login from "./Authentication/Login";
import System from "../routes/System";
import HomePage from "./HomePage/HomePage";
import CustomScrollbars from "../components/CustomScrollbars";
import DetailDoctor from "./HomePage/User_view/Doctor/DetailDoctor";
import Doctor from "../routes/Doctor";
import VerifyEmail from "./HomePage/User_view/VerifyEmail";
import ForgotPW from "./System/Admin/ForgotPW";
import DetailSpecialty from "./HomePage/User_view/Specialty/DetailSpecialty";
import DetailClinic from "./HomePage/User_view/Clinic/DetailClinic";
import ViewMoreDoctor from "./HomePage/User_view/Doctor/ViewMoreDoctor";
import ViewMoreClinic from "./HomePage/User_view/Clinic/ViewMoreClinic";
import ViewMoreSpecialty from "./HomePage/User_view/Specialty/ViewMoreSpecialty";
import DetailHandBook from "./HomePage/User_view/HandBook/DetailHandBook";
import ViewMoreHandBook from "./HomePage/User_view/HandBook/ViewMoreHandBook";
import SignUp from "./System/Admin/SignUp";
import DetailUser from "./HomePage/User_view/User/DetailUser";

class App extends Component {
  handlePersistorState = () => {
    const { persistor } = this.props;
    let { bootstrapped } = persistor.getState();
    if (bootstrapped) {
      if (this.props.onBeforeLift) {
        Promise.resolve(this.props.onBeforeLift())
          .then(() => this.setState({ bootstrapped: true }))
          .catch(() => this.setState({ bootstrapped: true }));
      } else {
        this.setState({ bootstrapped: true });
      }
    }
  };

  componentDidMount() {
    this.handlePersistorState();
  }

  render() {
    return (
      <Fragment>
        <Router history={history}>
          <div className="main-container">
            <div className="content-container">
              <CustomScrollbars style={{ height: "100vh", width: "100%" }}>
                <Switch>
                  <Route path={path.HOME} exact component={Home} />
                  <Route path={path.HOMEPAGE} component={HomePage} />
                  <Route
                    path={path.LOGIN}
                    component={userIsNotAuthenticated(Login)}
                  />
                  <Route
                    path={path.SIGN_UP}
                    component={userIsNotAuthenticated(SignUp)}
                  />
                  <Route
                    path={path.SYSTEM}
                    component={userIsAuthenticated(System)}
                  />

                  <Route
                    path={"/doctor/"}
                    component={userIsAuthenticated(Doctor)}
                  />
                  <Route path={path.DETAIL_DOCTOR} component={DetailDoctor} />
                  <Route path={path.DETAIL_USER} component={DetailUser} />
                  <Route
                    path={path.VIEW_MORE_DOCTOR}
                    component={ViewMoreDoctor}
                  />
                  <Route
                    path={path.DETAIL_SPECIALTY}
                    component={DetailSpecialty}
                  />
                  <Route
                    path={path.VIEW_MORE_SPECIALTY}
                    component={ViewMoreSpecialty}
                  />
                  <Route path={path.DETAIL_CLINIC} component={DetailClinic} />
                  <Route
                    path={path.VIEW_MORE_CLINIC}
                    component={ViewMoreClinic}
                  />
                  <Route
                    path={path.DETAIL_HANDBOOK}
                    component={DetailHandBook}
                  />
                <Route
                    path={path.VIEW_MORE_HANDBOOK}
                    component={ViewMoreHandBook}
                  /> 

                  <Route
                    path={path.VERIFY_BOOKING_EMAIL}
                    component={VerifyEmail}
                  />
                  <Route path={path.FORGOT_PW} component={ForgotPW} />
                </Switch>
              </CustomScrollbars>
            </div>
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
            {/* Same as */}
            <ToastContainer />
          </div>
        </Router>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    started: state.app.started,
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
