import React, { Component } from "react";
import { connect } from "react-redux";
import "./DetailSpecialty.scss";
import { withRouter } from "react-router";
import HomeHeader from "../../HomeHeader";
import DoctorSchedule from "../Doctor/DoctorSchedule";
import DoctorMore from "../Doctor/DoctorMore";
import DoctorInfo from "../Doctor/DoctorInfo";
import Footer from "../../Section/Footer";
import {
  getSpecialyById,
  getAllCodeService,
} from "../../../../services/userService";
import _ from "lodash";
import { LENGUAGES } from "../../../../utils/constant";
import LoadingOverlay from "react-loading-overlay";

class DetailSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listDoctorId: [],
      dataDetailSpecialty: [],
      listProvince: [],
      isShowMore: false,
      isLoading: false,
    };
  }

  async componentDidMount() {
    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id
    ) {
      let id = this.props.match.params.id;
      let res = await getSpecialyById({
        id: id,
        location: "ALL",
      });
      let resProvince = await getAllCodeService("PROVINCE");
      if (
        res &&
        res.errCode === 0 &&
        resProvince &&
        resProvince.errCode === 0
      ) {
        let data = res.data[0];
        let listDoctorId = [];
        if (data && !_.isEmpty(data)) {
          let arrDoctor = data.doctorInfoData;
          if (arrDoctor && arrDoctor.length > 0) {
            arrDoctor.map((item) => {
              return listDoctorId.push(item.doctorId);
            });
          }
          let listProvince = resProvince.data;
          if (listProvince && listProvince.length > 0) {
            listProvince.unshift({
              keyMap: "ALL",
              type: "PROVINCE",
              valueVi: "Toàn quốc",
              valueEn: "All",
            });
          }
          this.setState({
            listDoctorId: listDoctorId ? listDoctorId : [],
            dataDetailSpecialty: data,
            listProvince: listProvince ? listProvince : [],
          });
        }
      }
    }
  }

  componentDidUpdate() {}

  handleOnchangeProv = async (e) => {
    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id
    ) {
      let id = this.props.match.params.id;
      let location = e.target.value;
      let res = await getSpecialyById({
        id: id,
        location: location,
      });

      if (res && res.errCode === 0) {
        let data = res.data[0];
        let listDoctorId = [];
        if (data && !_.isEmpty(data)) {
          let arrDoctor = data.doctorInfoData;
          if (arrDoctor && arrDoctor.length > 0) {
            arrDoctor.map((item) => {
              return listDoctorId.push(item.doctorId);
            });
          }
          this.setState({
            listDoctorId: listDoctorId ? listDoctorId : [],
            dataDetailSpecialty: data,
          });
        } else {
          this.setState({
            listDoctorId: [],
          });
        }
      }
    }
  };

  handleShowContent = () => {
    this.setState({
      isShowMore: !this.state.isShowMore,
    });
  };

  handleShowLoading = (boolean) => {
    this.setState({
      isLoading: boolean,
    });
  };

  render() {
    const { listDoctorId, dataDetailSpecialty, listProvince, isShowMore } =
      this.state;
    const language = this.props.language;
    let dataContent = dataDetailSpecialty.contentHTML;
    return (
      <>
        <LoadingOverlay active={this.state.isLoading} spinner text="Loading...">
          <div className="detail-specialty-container">
            <HomeHeader />
            {isShowMore === false ? (
              <div
                className="detail-specialty-content container"
                style={{ height: "500px", overflow: "hidden" }}
              >
                <div dangerouslySetInnerHTML={{ __html: dataContent }} />
                <div
                  className="view-more"
                  onClick={() => this.handleShowContent()}
                >
                  Xem thêm
                </div>
              </div>
            ) : (
              <div className="detail-specialty-content container">
                <div dangerouslySetInnerHTML={{ __html: dataContent }} />
                <div
                  className="view-more"
                  onClick={() => this.handleShowContent()}
                >
                  Ẩn bớt
                </div>
              </div>
            )}

            <div className="detail-specialty-body">
              <div className="select-province container">
                <select onChange={(e) => this.handleOnchangeProv(e)}>
                  {listProvince &&
                    listProvince.length > 0 &&
                    listProvince.map((item, index) => {
                      return (
                        <option key={index} value={item.keyMap}>
                          {language === LENGUAGES.VI
                            ? item.valueVi
                            : item.valueEn}
                        </option>
                      );
                    })}
                </select>
              </div>
              {listDoctorId && listDoctorId.length > 0 ? (
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
                })
              ) : (
                <div className="about-doctor container">
                  {language === LENGUAGES.VI
                    ? "Không có thông tin bác sĩ, vui lòng thử lại !!"
                    : "No doctor information, please try again !!"}
                </div>
              )}
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
  connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty)
);
