import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import Header from "../containers/Header/Header";
import ManageSchedule from "../containers/System/Doctor/ManageSchedule";
import ManageAppointment from "../containers/System/Doctor/ManageAppointment";
import ManageHistory from "../containers/System/Doctor/ManageHistory";

class Doctor extends Component {
  render() {
    const { isLoggedIn } = this.props;

    return (
      <>
        {isLoggedIn && <Header />}
        <div className="system-container">
          <div className="system-list">
            <Switch>
              <Route
                path="/doctor/manage-schedule"
                component={ManageSchedule}
              />
              <Route
                path="/doctor/manage-appointment"
                component={ManageAppointment}
              />
              <Route
                path="/doctor/history-appointment"
                component={ManageHistory}
              />
            </Switch>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    systemMenuPath: state.app.systemMenuPath,
    isLoggedIn: state.user.isLoggedIn,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Doctor);
