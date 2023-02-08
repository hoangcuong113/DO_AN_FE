import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router";

class Banner extends Component {
  componentDidMount() {}
  handleViewMore = (id) => {
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
  };
  render() {
    return (
      <>
        <div className="home-header-banner">
          <div className="banner-up">
            <h1 className="banner-title">
              <FormattedMessage id="banner.base" />
            </h1>
            <h1 className="banner-title banner-main-title">
              <FormattedMessage id="banner.health-care" />
            </h1>
            {/* <div className="banner-search">
              <i className="fas fa-search"></i>
              <input
                className="banner-input"
                type="text"
                placeholder="Tìm chuyên khoa"
              />
            </div> */}
          </div>
          <div className="banner-down">
            <ul className="banner-down-options">
              <li
                className="banner-options"
                onClick={() => this.handleViewMore("specialist")}
              >
                <i className="fas fa-hospital-alt"></i>
                <div className="options-title">
                  <FormattedMessage id="banner.specialist" />
                </div>
              </li>
              <li
                className="banner-options"
                onClick={() => this.handleViewMore("handbook")}
              >
                <i className="fas fa-notes-medical"></i>
                <div className="options-title">
                  <FormattedMessage id="banner.check-health" />
                </div>
              </li>
              <li
                className="banner-options"
                onClick={() => this.handleViewMore("facilities")}
              >
                <i className="fas fa-map-marker-alt"></i>
                <div className="options-title">
                  <FormattedMessage id="banner.clinic" />
                </div>
              </li>
              <li
                className="banner-options"
                onClick={() => this.handleViewMore("doctor")}
              >
                <i className="fas fa-user-md"></i>
                <div className="options-title">
                  <FormattedMessage id="banner.doctor" />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Banner));
