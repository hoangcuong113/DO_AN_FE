import React, { Component } from "react";
import { connect } from "react-redux";
import "./HomeHeader.scss";
import { FormattedMessage } from "react-intl";
import * as actions from "../../store/actions";
import { LENGUAGES } from "../../utils/constant";
import { changeLanguageApp } from "../../store/actions";
import mainLogo from "../../assets/images/Logo.png";
import { withRouter } from "react-router";
import SliderNav from "./SliderNav";
import { push } from "connected-react-router";
import _ from "lodash";

class HomeHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowNavBar: false,
      userInfo: "",
      login: false,
      roleId: "",
    };
  }
  changeLanguage = (language) => {
    this.props.changeLanguageAppRedux(language);
  };

  componentDidMount() {
    this.setState({
      login: this.props.isLoggedIn,
    });
    if (this.props.userInfo) {
      this.setState({
        userInfo: this.props.userInfo,
        roleId: this.props.userInfo.roleId,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isLoggedIn !== this.props.isLoggedIn) {
      this.setState({
        login: this.props.isLoggedIn,
      });
    }
    if (this.props.userInfo && !_.isEmpty(this.props.userInfo)) {
      if (this.props.userInfo !== prevProps.userInfo) {
        this.setState({
          userInfo: this.props.userInfo,
          roleId: this.props.userInfo.roleId,
        });
      }
    }
  }

  goToHome = () => {
    if (this.props.history) {
      this.props.history.push(`/`);
    }
  };

  redirectToSystemPage = (path) => {
    const { navigate } = this.props;
    const redirectPath = path;
    navigate(`${redirectPath}`);
  };

  goToManage = () => {
    let role = this.state.roleId;
    if (role) {
      if (role === "R1") {
        this.redirectToSystemPage("/system/user-redux");
      } else if (role === "R2") {
        this.redirectToSystemPage("/doctor/manage-schedule");
      } else if (role === "R3") {
        this.redirectToSystemPage("/");
      }
    }
  };

  handleViewMore = (id) => {
    let userId = this.state.userInfo.id;
    if (this.props.history) {
      if (id === "specialist") this.props.history.push(`/view-more-specialty`);
    }
    if (this.props.history) {
      if (id === "doctor") this.props.history.push(`/view-more-doctor`);
    }
    if (this.props.history) {
      if (id === "handbook") this.props.history.push(`/view-more-handbook`);
    }
    if (this.props.history) {
      if (id === "facilities") this.props.history.push(`/view-more-clinic`);
    }
    if (this.props.history) {
      if (id === "login") this.props.history.push(`/login`);
    }
    if (this.props.history) {
      if (id === "password") this.props.history.push(`/system/manage-password`);
    }
    if (this.props.history) {
      if (id === "account")
        this.props.history.push(`/detail-user/id=${userId}`);
    }
  };

  changeStateShowNav = () => {
    this.setState({
      isShowNavBar: !this.state.isShowNavBar,
    });
  };

  handleShowNav = (boolean) => {
    this.setState({
      isShowNavBar: boolean,
    });
  };

  redirectToSystemPage = (path) => {
    const { navigate } = this.props;
    const redirectPath = path;
    navigate(`${redirectPath}`);
  };

  handleLogout = () => {
    this.props.processLogout();
    this.redirectToSystemPage("/home");
  };

  render() {
    let language = this.props.language;
    let { login } = this.state;
    let { roleId } = this.state;
    return (
      <>
        <SliderNav
          handleShowNav={this.handleShowNav}
          isShowNavBar={this.state.isShowNavBar}
        />
        <div className="home-header-container">
          <div className="home-header-content container">
            <div className="content-left">
              <i
                className="fas fa-bars icon"
                onClick={() => this.changeStateShowNav()}
              ></i>
              <div className="header-logo">
                <img
                  src={mainLogo}
                  alt="logo"
                  onClick={() => this.goToHome()}
                ></img>
              </div>
            </div>
            <ul className="content-center">
              <li
                className="content-child"
                onClick={() => this.handleViewMore("specialist")}
              >
                <div className="child-title">
                  <FormattedMessage id="homeheader.specialist" />
                </div>
                <div className="child-subtitle">
                  <FormattedMessage id="homeheader.find-doctor" />
                </div>
              </li>
              <li
                className="content-child"
                onClick={() => this.handleViewMore("facilities")}
              >
                <div className="child-title">
                  <FormattedMessage id="homeheader.health-facilities" />
                </div>
                <div className="child-subtitle">
                  <FormattedMessage id="homeheader.select-clinic" />
                </div>
              </li>
              <li
                className="content-child"
                onClick={() => this.handleViewMore("doctor")}
              >
                <div className="child-title">
                  {" "}
                  <FormattedMessage id="homeheader.doctor" />
                </div>
                <div className="child-subtitle">
                  {" "}
                  <FormattedMessage id="homeheader.choose-doctor" />
                </div>
              </li>
              <li
                className="content-child"
                onClick={() => this.handleViewMore("handbook")}
              >
                <div className="child-title">
                  <FormattedMessage id="homeheader.fee" />
                </div>
                <div className="child-subtitle">
                  <FormattedMessage id="homeheader.check-health" />
                </div>
              </li>
            </ul>
            <div className="content-right">
              <div className="content-support">
                <span className="content-question">
                  {login === false ? (
                    <i
                      onClick={() => this.handleViewMore("login")}
                      className="fas fa-sign-in-alt sign-in"
                      title={
                        language === LENGUAGES.VI ? "Đăng nhập" : "Sign in"
                      }
                    ></i>
                  ) : (
                    <span className="user">
                      <i className="fas fa-user sign-in"></i>
                      <ul className="list-options">
                        <li
                          className="list-item"
                          onClick={() => this.handleViewMore("account")}
                        >
                          <FormattedMessage id="homeheader.my-account" />
                        </li>
                        {roleId === "R1" && (
                          <li
                            className="list-item"
                            onClick={() => this.goToManage()}
                          >
                            <FormattedMessage id="homeheader.go-manage" />
                          </li>
                        )}
                        {roleId === "R2" && (
                          <li
                            className="list-item"
                            onClick={() => this.goToManage()}
                          >
                            <FormattedMessage id="homeheader.go-manage" />
                          </li>
                        )}
                        <li
                          className="list-item"
                          onClick={() => this.handleViewMore("password")}
                        >
                          <FormattedMessage id="homeheader.change-password" />
                        </li>
                        <li
                          className="list-item"
                          onClick={() => this.handleLogout()}
                        >
                          <FormattedMessage id="homeheader.log-out" />
                        </li>
                      </ul>
                    </span>
                  )}
                </span>
              </div>
              <div className="content-lang">
                <span
                  className={
                    language === LENGUAGES.VI
                      ? "content-lang-vi isActive"
                      : "content-lang-vi"
                  }
                  onClick={() => this.changeLanguage(LENGUAGES.VI)}
                >
                  VI
                </span>
                <span>/</span>
                <span
                  className={
                    language === LENGUAGES.EN
                      ? "content-lang-en isActive"
                      : "content-lang-en"
                  }
                  onClick={() => this.changeLanguage(LENGUAGES.EN)}
                >
                  EN
                </span>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    navigate: (path) => dispatch(push(path)),
    changeLanguageAppRedux: (languages) =>
      dispatch(changeLanguageApp(languages)),
    processLogout: () => dispatch(actions.processLogout()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(HomeHeader)
);
