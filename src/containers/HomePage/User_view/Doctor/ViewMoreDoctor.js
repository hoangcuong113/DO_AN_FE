import React, { Component } from "react";
import { connect } from "react-redux";
import "./ViewMoreDoctor.scss";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router";
import Select from "react-select";
import HomeHeader from "../../HomeHeader";
import DoctorSchedule from "../Doctor/DoctorSchedule";
import DoctorMore from "../Doctor/DoctorMore";
import DoctorInfo from "../Doctor/DoctorInfo";
import { getAllDoctorForHome } from "../../../../services/userService";
import { LENGUAGES } from "../../../../utils";
import Footer from "../../Section/Footer";
import LoadingOverlay from "react-loading-overlay";

class ViewMoreDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listDoctorId: [],
      listDoctors: [],
      selectedDoctor: "",
      isLoading: false,
    };
  }

  async componentDidMount() {
    let res = await getAllDoctorForHome();
    if (res && res.errCode === 0) {
      let arr = [];
      let userArr = res.data;
      if (userArr && userArr.length > 0) {
        userArr.forEach((item) => {
          arr.push(item.id);
        });
      }
      let options = this.buildDataForSelectDoctor(res.data);

      this.setState({
        listDoctors: options,
        listDoctorId: arr,
      });
    }
  }

  buildDataForSelectDoctor = (inputData) => {
    let listOptions = [];
    if (inputData && inputData.length > 0) {
      inputData.map((item, index) => {
        let obj = {};
        let label =
          this.props.language === LENGUAGES.VI
            ? `${item.lastName} ${item.firstName}`
            : `${item.firstName} ${item.lastName}`;
        let value = item.id;
        obj.value = value;
        obj.label = label;
        return listOptions.push(obj);
      });
    }
    return listOptions;
  };

  componentDidUpdate() {}

  handleChangeSelect = async (selectedOption) => {
    this.setState({ selectedDoctor: selectedOption });
    let idDoctor = selectedOption.value;
    if (this.props.history) {
      this.props.history.push(`/detail-doctor/${idDoctor}`);
    }
  };

  handleShowLoading = (boolean) => {
    this.setState({
      isLoading: boolean,
    });
  };

  render() {
    let { listDoctorId, selectedDoctor } = this.state;
    return (
      <>
        <LoadingOverlay active={this.state.isLoading} spinner text="Loading...">
          <div className="detail-specialty-container">
            <HomeHeader />

            <div className="detail-view-more-content container">
              <h1 className="title-content">
                <FormattedMessage id="home-page.search-doctor" />
              </h1>
              <Select
                value={selectedDoctor}
                onChange={this.handleChangeSelect}
                options={this.state.listDoctors}
                name={"selectedDoctor"}
                placeholder={<FormattedMessage id="home-page.search-doctor" />}
              />
            </div>

            <div className="detail-specialty-body">
              {listDoctorId &&
                listDoctorId.length > 0 &&
                listDoctorId.map((item, index) => {
                  return (
                    <div className="about-doctor container" key={index}>
                      <div className="about-detail-doctor">
                        <DoctorInfo
                          idDoctor={item}
                          isShowDesc={true}
                          isShowPrice={false}
                          isShowMore={true}
                        />
                      </div>
                      <div className="about-schedule-doctor">
                        <div className="schedule-doctor">
                          <DoctorSchedule
                            idDoctor={item}
                            handleShowLoadingFromParent={this.handleShowLoading}
                          />
                        </div>
                        <div className="more-info-doctor">
                          <DoctorMore idDoctor={item} />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          <Footer />
        </LoadingOverlay>
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
  connect(mapStateToProps, mapDispatchToProps)(ViewMoreDoctor)
);
