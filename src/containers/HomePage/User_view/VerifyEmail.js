import React, { Component } from "react";
import { connect } from "react-redux";
import "./VerifyEmail.scss";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router";
import { postVerifyPatientBooking } from "../../../services/userService";
import HomeHeader from "../HomeHeader";

class VerifyEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusVerify: false,
      errCode: 0,
    };
  }

  async componentDidMount() {
    if (this.props.location && this.props.location.search) {
      let urlParams = new URLSearchParams(this.props.location.search);
      let doctorId = urlParams.get("doctorId");
      let token = urlParams.get("token");
      let scheduleId = urlParams.get("scheduleId");
      let res = await postVerifyPatientBooking({
        token,
        doctorId,
        scheduleId,
      });

      if (res && res.errCode === 0) {
        this.setState({
          statusVerify: true,
          errCode: res.errCode,
        });
      } else {
        this.setState({
          statusVerify: true,
          errCode: res && res.errCode ? res.errCode : -1,
        });
      }
    }
  }

  goToHome = () => {
    if (this.props.history) {
      this.props.history.push(`/home`);
    }
  };
  render() {
    return (
      <>
        <HomeHeader />
        <div className="verify-email-container text-center">
          {this.state.statusVerify === false ? (
            <div className="title-loading">
              <FormattedMessage id="user-view.booking-modal.loading" />
            </div>
          ) : (
            <div className="title-verify">
              {this.state.errCode === 0 ? (
                <div className="title-verify-succeed">
                  <FormattedMessage id="user-view.booking-modal.verify-succeed" />
                </div>
              ) : (
                <div className="title-verify-failed">
                  <FormattedMessage id="user-view.booking-modal.verify-failed" />
                </div>
              )}
            </div>
          )}
          <div className="more-verify">
            <span onClick={() => this.goToHome()} className="link-verify">
              <FormattedMessage id="user-view.booking-modal.click" />
            </span>
            <FormattedMessage id="user-view.booking-modal.go-to-home" />
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(VerifyEmail)
);
