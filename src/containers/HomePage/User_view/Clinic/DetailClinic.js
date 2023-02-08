import React, { Component } from "react";
import { connect } from "react-redux";
import "./DetailClinic.scss";
import { withRouter } from "react-router";
import HomeHeader from "../../HomeHeader";
import DoctorSchedule from "../Doctor/DoctorSchedule";
import DoctorMore from "../Doctor/DoctorMore";
import DoctorInfo from "../Doctor/DoctorInfo";
import Footer from "../../Section/Footer";
import {
  getClinicById,
  getAllSpecialtiesForHome,
} from "../../../../services/userService";
import _ from "lodash";
import LoadingOverlay from "react-loading-overlay";
import { LENGUAGES } from "../../../../utils";

class DetailClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listDoctorId: [],
      dataDetailClinic: [],
      listSpecialty: [],
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
      let res = await getClinicById(id);

      if (res && res.errCode === 0) {
        let data = res.data[0];

        let listDoctorId = [];
        if (data && !_.isEmpty(data)) {
          let arrDoctor = data.doctorClinicData;

          if (arrDoctor && arrDoctor.length > 0) {
            arrDoctor.map((item) => {
              return listDoctorId.push(item.doctorId);
            });
          }
          this.setState({
            listDoctorId: listDoctorId ? listDoctorId : [],
            dataDetailClinic: data,
          });
        }
      }
    }
    let res = await getAllSpecialtiesForHome();
    if (res && res.errCode === 0) {
      this.setState({
        listSpecialty: res.data,
      });
    }
  }

  componentDidUpdate() {}

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

  handleChangeSelect = async (e) => {
    let specialtyId = e.target.value;
    if (specialtyId === 0) {
      if (
        this.props.match &&
        this.props.match.params &&
        this.props.match.params.id
      ) {
        let id = this.props.match.params.id;
        let res = await getClinicById(id);

        if (res && res.errCode === 0) {
          let data = res.data[0];

          let listDoctorId = [];
          if (data && !_.isEmpty(data)) {
            let arrDoctor = data.doctorClinicData;

            if (arrDoctor && arrDoctor.length > 0) {
              arrDoctor.map((item) => {
                return listDoctorId.push(item.doctorId);
              });
            }
            this.setState({
              listDoctorId: listDoctorId ? listDoctorId : [],
              dataDetailClinic: data,
            });
          }
        }
      }
    } else {
      if (
        this.props.match &&
        this.props.match.params &&
        this.props.match.params.id
      ) {
        let id = this.props.match.params.id;
        let res = await getClinicById(id);

        if (res && res.errCode === 0) {
          let data = res.data[0];
          let listDoctorId = [];
          if (data && !_.isEmpty(data)) {
            let arrDoctor = data.doctorClinicData;
            if (arrDoctor && arrDoctor.length > 0) {
              arrDoctor.map((item) => {
                if (item.doctorInfoData.id === +specialtyId) {
                  listDoctorId.push(item.doctorId);
                }
                return listDoctorId;
              });
            }
            this.setState({
              listDoctorId: listDoctorId ? listDoctorId : [],
              dataDetailClinic: data,
            });
          }
        }
      }
    }
  };

  render() {
    const { listDoctorId, dataDetailClinic, isShowMore, listSpecialty } =
      this.state;
    let dataContent = dataDetailClinic.contentHTML;
    let language = this.props.language;
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
                <h2 className="clinic-name">{dataDetailClinic.name}</h2>
                <div
                  dangerouslySetInnerHTML={{ __html: dataContent }}
                  className="content-html"
                />
                <div
                  className="view-more"
                  onClick={() => this.handleShowContent()}
                >
                  {language === LENGUAGES.VI ? "Xem thêm" : "View More"}
                </div>
              </div>
            ) : (
              <div className="detail-specialty-content container">
                <h2 className="clinic-name">{dataDetailClinic.name}</h2>
                <div dangerouslySetInnerHTML={{ __html: dataContent }} />
                <div
                  className="view-more"
                  onClick={() => this.handleShowContent()}
                >
                  {language === LENGUAGES.VI ? "Ẩn bớt" : "Hide"}
                </div>
              </div>
            )}

            <div className="container mt-3">
              <select
                onChange={(e) => this.handleChangeSelect(e)}
                className=" form-select"
                style={{ width: "20%" }}
              >
                <option value={0}>
                  {language === LENGUAGES.VI ? "Tất cả" : "ALL"}
                </option>
                {listSpecialty &&
                  listSpecialty.length > 0 &&
                  listSpecialty.map((item, index) => {
                    return (
                      <option key={index} value={item.id}>
                        {language === LENGUAGES.VI ? item.nameVi : item.nameEn}
                      </option>
                    );
                  })}
              </select>
            </div>

            <div className="detail-specialty-body">
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
                    ? "Không có thông tin bác sĩ, vui lòng chọn chuyên khoa khác"
                    : "No doctor information, please choose another specialty"}
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
  connect(mapStateToProps, mapDispatchToProps)(DetailClinic)
);
