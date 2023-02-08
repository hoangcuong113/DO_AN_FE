import React, { Component } from "react";
import { connect } from "react-redux";
import "./DetailUser.scss";
import { withRouter } from "react-router";
import HomeHeader from "../../HomeHeader";
import Footer from "../../Section/Footer";
import {
  userEditInfo,
  getInfoUser,
  getPatientAppointmentService,
  postRating,
  patientCancelAppointment,
} from "../../../../services/userService";
import { LENGUAGES, CommonUtils } from "../../../../utils";
import LoadingOverlay from "react-loading-overlay";
import { FormattedMessage } from "react-intl";
import * as actions from "../../../../store/actions";
import { toast } from "react-toastify";
import Lightbox from "react-image-lightbox";
import moment from "moment";
import localization from "moment/locale/vi";
import _ from "lodash";
import { Modal } from "reactstrap";
import StarRatings from "react-star-ratings";

class DetailUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowInfo: true,
      isShowAppointment: false,
      isShowHistory: false,
      isLoading: false,
      email: "",
      firstName: "",
      lastName: "",
      address: "",
      phonenumber: "",
      gender: "",
      genderArr: [],
      previewImg: "",
      id: "",
      avatar: "",
      userInfo: [],
      isOpen: false,
      isChanged: false,
      listAppointment: [],
      isShowModalDetail: false,
      selectedAppointment: "",
      isShowModalRating: false,
      rating: 0,
      comment: "",
      doctorId: "",
      patientId: "",
      bookingId: "",
      showBtn: true,
      isShowModalBooking: false,
      itemSelected: "",
    };
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.gender !== this.props.gender) {
      let arrGender = this.props.gender;
      this.setState({
        genderArr: this.props.gender,
        gender: arrGender && arrGender.length > 0 ? arrGender[0].keyMap : "",
      });
    }
    if (prevProps.userInfo !== this.props.userInfo) {
      if (this.props.userInfo && this.props.userInfo.id) {
        let id = this.props.userInfo.id;
        let res = await getInfoUser(id);
        if (res && res.errCode === 0) {
          let data = res.users;
          this.setValueInput(data);
        }
        let appoinment = await getPatientAppointmentService(id);
        if (appoinment && appoinment.errCode === 0) {
          this.setState({
            listAppointment: appoinment.data,
          });
        }
      }
    }
  }

  showModalBooking = (item) => {
    this.setState({
      isShowModalBooking: true,
      itemSelected: item,
    });
  };

  closeModalBooking = () => {
    this.setState({
      isShowModalBooking: false,
    });
  };

  handleAddImg = async (e) => {
    let data = e.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      let objectUrl = URL.createObjectURL(file);
      this.setState({
        previewImg: objectUrl,
        avatar: base64,
        isChanged: true,
      });
    }
  };

  handleChangeInput = (e, id) => {
    let copyState = { ...this.state };
    copyState[id] = e.target.value;
    this.setState({
      ...copyState,
      isChanged: true,
    });
  };

  setValueInput = (input) => {
    let data = input;
    let imgBase64 = "";
    if (data.image && data.image.data) {
      imgBase64 = Buffer.from(data.image.data, "base64").toString("binary");
    }
    this.setState({
      userInfo: data,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      address: data.address,
      phonenumber: data.phonenumber,
      previewImg: imgBase64,
      avatar: data.image && data.image.data ? data.image.data : "",
      gender: data.gender,
    });
  };

  async componentDidMount() {
    this.props.getGenderStart();
    if (this.props.userInfo && this.props.userInfo.id) {
      let id = this.props.userInfo.id;
      let res = await getInfoUser(id);
      if (res && res.errCode === 0) {
        let data = res.users;
        this.setValueInput(data);
      }
      let appoinment = await getPatientAppointmentService(id);
      if (appoinment && appoinment.errCode === 0) {
        this.setState({
          listAppointment: appoinment.data,
        });
      }
    }
  }

  handleShowLoading = (boolean) => {
    this.setState({
      isLoading: boolean,
    });
  };

  validatePhone = (number) => {
    return /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(number);
  };

  validInput = () => {
    let isValid = true;
    if (!this.validatePhone(this.state.phonenumber)) {
      isValid = false;
      alert("Vui lòng điền chính xác số điện thoại !!");
      return;
    } else {
      let arr = ["firstName", "lastName", "address"];
      for (let i = 0; i < arr.length; i++) {
        if (!this.state[arr[i]]) {
          isValid = false;
          alert(`Vui lòng điền đủ thông tin !!`);
          break;
        }
      }
    }
    return isValid;
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = this.validInput();
    if (isValid) {
      this.setState({ isLoading: true });
      let res = await userEditInfo({
        id:
          this.props.userInfo && this.props.userInfo.id
            ? this.props.userInfo.id
            : -1,
        password: this.state.password,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        address: this.state.address,
        phonenumber: this.state.phonenumber,
        gender: this.state.gender,
        image: this.state.avatar,
      });
      this.setState({ isLoading: false, isChanged: false });
      if (res && res.errCode === 0) {
        toast.success("Lưu thay đổi thành công !!");
        if (this.props.userInfo && this.props.userInfo.id) {
          let id = this.props.userInfo.id;
          let res = await getInfoUser(id);
          if (res && res.errCode === 0) {
            let data = res.users;
            this.setValueInput(data);
          }
        }
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại !!");
      }
    } else {
      return;
    }
  };

  handleCancel = async () => {
    if (this.props.userInfo && this.props.userInfo.id) {
      let id = this.props.userInfo.id;
      let res = await getInfoUser(id);
      if (res && res.errCode === 0) {
        let data = res.users;
        this.setValueInput(data);
      }
    }
  };

  showLightbox = () => {
    if (!this.state.previewImg) return;
    this.setState({
      isOpen: true,
    });
  };

  handleShowContent = (id) => {
    if (id === "info") {
      this.setState({
        isShowInfo: true,
        isShowAppointment: false,
      });
    } else if (id === "appointment") {
      this.setState({
        isShowInfo: false,
        isShowAppointment: true,
      });
    }
  };

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  showTime = (dataTime) => {
    if (dataTime && !_.isEmpty(dataTime)) {
      let date =
        this.props.language === LENGUAGES.VI
          ? this.capitalizeFirstLetter(
              moment.unix(+dataTime / 1000).format("dddd - DD/MM/YYYY")
            )
          : moment
              .unix(+dataTime / 1000)
              .locale("en")
              .format("ddd - MM/DD/YYYY");
      return date;
    }
  };

  handleSelectedAppointment = (item) => {
    this.setState({
      isShowModalDetail: true,
      selectedAppointment: item,
    });
  };

  closeModal = () => {
    this.setState({
      isShowModalDetail: false,
      isShowModalRating: false,
    });
  };

  handleRating = (item) => {
    this.setState({
      isShowModalRating: true,
      selectedAppointment: item,
      doctorId: item.doctorId,
      bookingId: item.id,
      patientId: item.patientId,
    });
  };

  changeRating(newRating, name) {
    this.setState({
      rating: newRating,
    });
  }

  sendRating = async () => {
    let { doctorId, comment, rating, patientId, bookingId } = this.state;
    this.setState({ isLoading: true });
    let res = await postRating({
      doctorId: doctorId,
      patientId: patientId,
      bookingId: bookingId,
      comment: comment,
      rating: rating,
    });
    this.setState({ isLoading: false });
    if (res && res.errCode === 0) {
      toast.success("Gửi đánh giá thành công !!");
      this.setState({
        showBtn: false,
        isShowModalRating: false,
      });
      if (this.props.userInfo && this.props.userInfo.id) {
        let id = this.props.userInfo.id;
        let appoinment = await getPatientAppointmentService(id);
        if (appoinment && appoinment.errCode === 0) {
          this.setState({
            listAppointment: appoinment.data,
          });
        }
      }
    } else {
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    }
  };

  handleCancelAppointment = async () => {
    let item = this.state.itemSelected;
    this.setState({
      isLoading: true,
    });
    let res = await patientCancelAppointment({
      bookingId: item.id,
      doctorId: item.doctorId,
      patientId: item.patientId,
      date: item.date,
      timeType: item.timeType,
    });
    this.setState({
      isLoading: false,
    });
    if (res && res.errCode === 0) {
      toast.success("Huỷ lịch hẹn thành công !!");
      this.setState({ isShowModalBooking: false });
      if (this.props.userInfo && this.props.userInfo.id) {
        let id = this.props.userInfo.id;
        let appoinment = await getPatientAppointmentService(id);
        if (appoinment && appoinment.errCode === 0) {
          this.setState({
            listAppointment: appoinment.data,
          });
        }
      }
    } else {
      this.setState({ isShowModalBooking: false });
      toast.error("Huỷ lịch hẹn thất bại, vui lòng thử lại !!");
    }
  };

  render() {
    let { genderArr, isShowModalBooking } = this.state;
    let language = this.props.language;
    let file = this.state.previewImg;
    let {
      email,
      firstName,
      lastName,
      address,
      phonenumber,
      gender,
      isChanged,
      isShowInfo,
      isShowAppointment,
      listAppointment,
      isShowModalDetail,
      selectedAppointment,
      isShowModalRating,
      showBtn,
      userInfo,
    } = this.state;

    return (
      <>
        <LoadingOverlay active={this.state.isLoading} spinner text="Loading...">
          <div className="detail-specialty-container">
            <HomeHeader />
            <div className="detail-specialty-content container user-detail">
              <div className="user-option">
                <div className="about-user">
                  <div
                    className="user-img"
                    style={{ backgroundImage: `url(${file})` }}
                  ></div>
                  <div className="user-name">
                    {language === LENGUAGES.VI
                      ? `${lastName} ${firstName}`
                      : `${firstName} ${lastName}`}
                  </div>
                </div>
                <div className="user-list-options">
                  <div
                    className="user-list-item"
                    onClick={() => this.handleShowContent("info")}
                  >
                    <FormattedMessage id="homeheader.user-info" />
                  </div>
                  {userInfo && userInfo.roleId === "R3" ? (
                    <div
                      className="user-list-item"
                      onClick={() => this.handleShowContent("appointment")}
                    >
                      <FormattedMessage id="homeheader.appointments-status" />
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <div className="user-content">
                {isShowInfo === true ? (
                  <>
                    <div className="content-title">
                      <FormattedMessage id="homeheader.user-info" />
                    </div>
                    <form className="row g-3 mt-5">
                      <div className="col-md-4">
                        <label className="form-label">
                          <FormattedMessage id="manage-user.email" />
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          onChange={(e) => this.handleChangeInput(e, "email")}
                          value={email}
                          disabled
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">
                          <FormattedMessage id="manage-user.first-name" />
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          onChange={(e) =>
                            this.handleChangeInput(e, "firstName")
                          }
                          value={firstName}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">
                          <FormattedMessage id="manage-user.last-name" />
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          onChange={(e) =>
                            this.handleChangeInput(e, "lastName")
                          }
                          value={lastName}
                        />
                      </div>
                      <div className="col-4">
                        <label className="form-label">
                          <FormattedMessage id="manage-user.phonenumber" />
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          onChange={(e) =>
                            this.handleChangeInput(e, "phonenumber")
                          }
                          value={phonenumber}
                        />
                      </div>
                      <div className="col-8">
                        <label className="form-label">
                          <FormattedMessage id="manage-user.address" />
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          onChange={(e) => this.handleChangeInput(e, "address")}
                          value={address}
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">
                          <FormattedMessage id="manage-user.gender" />
                        </label>
                        <select
                          className="form-select"
                          onChange={(e) => this.handleChangeInput(e, "gender")}
                          value={gender}
                        >
                          {genderArr &&
                            genderArr.length > 0 &&
                            genderArr.map((item, index) => {
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

                      <div className="col-md-4">
                        <label className="form-label">
                          <FormattedMessage id="manage-user.image" />
                        </label>
                        <div className="input-img-container">
                          <input
                            type="file"
                            id="input-img"
                            hidden
                            onChange={(e) => this.handleAddImg(e)}
                          />
                          <label htmlFor="input-img" className="img-label">
                            <FormattedMessage id="manage-user.upload" />{" "}
                            <i className="fas fa-upload"></i>
                          </label>
                          {this.state.previewImg && (
                            <div
                              className="img-preview"
                              style={{ backgroundImage: `url(${file})` }}
                              title="View Full"
                              onClick={() => this.showLightbox()}
                            ></div>
                          )}
                        </div>
                      </div>
                      {isChanged === true ? (
                        <div className="col-12">
                          <button
                            type="submit"
                            className="btn btn-primary px-3 btn-submit"
                            onClick={(e) => this.handleSubmit(e)}
                          >
                            <FormattedMessage id="menu.doctor.save-schedule" />
                          </button>
                          <button
                            type="submit"
                            className="btn btn-primary btn-cancel"
                            onClick={() => this.handleCancel()}
                            style={{ height: "40px" }}
                          >
                            <FormattedMessage id="user-view.booking-modal.cancel" />
                          </button>
                        </div>
                      ) : (
                        <></>
                      )}
                    </form>
                  </>
                ) : (
                  <></>
                )}

                {isShowAppointment === true ? (
                  <>
                    <div className="content-title">
                      <FormattedMessage id="homeheader.appointments-status" />
                    </div>
                    <div className="users-container container my-5">
                      <table id="customers">
                        <thead>
                          <tr>
                            <th>
                              <FormattedMessage id="homeheader.date" />
                            </th>
                            <th>
                              <FormattedMessage id="homeheader.time" />
                            </th>
                            <th>
                              <FormattedMessage id="homeheader.doctor" />
                            </th>
                            <th>
                              <FormattedMessage id="homeheader.status" />
                            </th>
                            <th>
                              <FormattedMessage id="homeheader.options" />
                            </th>
                          </tr>
                        </thead>

                        <tbody>
                          {listAppointment &&
                            listAppointment.length > 0 &&
                            listAppointment.map((item, index) => {
                         
                              return (
                                <tr key={index}>
                                  <td>{this.showTime(item.date)}</td>
                                  <td>
                                    {language === LENGUAGES.VI
                                      ? item.timeBookingData.valueVi
                                      : item.timeBookingData.valueEn}
                                  </td>
                                  <td>
                                    {language === LENGUAGES.VI
                                      ? `${item.bookingDoctorData.lastName} ${item.bookingDoctorData.firstName}`
                                      : `${item.bookingDoctorData.firstName} ${item.bookingDoctorData.lastName}`}
                                  </td>
                                  <td>
                                    {language === LENGUAGES.VI
                                      ? item.statusData.valueVi
                                      : item.statusData.valueEn}
                                  </td>

                           
                                  <td>
                                    <div>
                                      <button
                                        className="btn btn-edit"
                                        onClick={() =>
                                          this.handleSelectedAppointment(item)
                                        }
                                      >
                                        <FormattedMessage id="homeheader.view-detail" />
                                      </button>
                                      {item.statusId === "S3" &&
                                        showBtn === true && (
                                          <button
                                            className="btn btn-send"
                                            onClick={() =>
                                              this.handleRating(item)
                                            }
                                          >
                                            <FormattedMessage id="homeheader.rating" />
                                          </button>
                                        )}
                                      {item.statusId === "S2" &&
                                        showBtn === true && (
                                          <button
                                            className="btn btn-danger px-2"
                                            onClick={() =>
                                              this.showModalBooking(item)
                                            }
                                          >
                                            <FormattedMessage id="homeheader.cancel" />
                                          </button>
                                        )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
          <Footer />
          {this.state.isOpen === true && (
            <Lightbox
              mainSrc={file}
              onCloseRequest={() => this.setState({ isOpen: false })}
            />
          )}
          {selectedAppointment && !_.isEmpty(selectedAppointment) && (
            <Modal
              isOpen={isShowModalDetail}
              className={"schedule-modal"}
              size="md"
            >
              <div className="modal-schedule-container">
                <div className="modal-header">
                  <span>
                    <FormattedMessage id="user-view.booking-modal.info-booking" />
                  </span>
                  <span>
                    <i
                      className="fas fa-times"
                      onClick={() => this.closeModal()}
                    ></i>
                  </span>
                </div>
                <div className="modal-body">
                  <div className="info-schedule"></div>
                  <div className="row container">
                    <div className="col-12 my-2">
                      {language === LENGUAGES.VI
                        ? `Bác sĩ: ${selectedAppointment.bookingDoctorData.lastName} ${selectedAppointment.bookingDoctorData.firstName}`
                        : `Doctor: ${selectedAppointment.bookingDoctorData.firstName} ${selectedAppointment.bookingDoctorData.lastName}`}
                    </div>
                    <div className="col-12 my-2">
                      {language === LENGUAGES.VI
                        ? `Tên cơ sở: ${selectedAppointment.bookingDoctorData.Doctor_Info.doctorClinicData.name}`
                        : `Clinic's name: ${selectedAppointment.bookingDoctorData.Doctor_Info.doctorClinicData.name}`}
                    </div>
                    <div className="col-12 my-2">
                      {language === LENGUAGES.VI
                        ? `Địa chỉ: ${selectedAppointment.bookingDoctorData.Doctor_Info.doctorClinicData.address}`
                        : `Address: ${selectedAppointment.bookingDoctorData.Doctor_Info.doctorClinicData.address}`}
                    </div>
                    <div className="col-12 my-2">
                      {language === LENGUAGES.VI
                        ? `Ngày: ${this.showTime(selectedAppointment.date)}`
                        : `Date: ${this.showTime(selectedAppointment.date)}`}
                    </div>
                    <div className="col-12 my-2">
                      {language === LENGUAGES.VI
                        ? `Thời gian: ${selectedAppointment.timeBookingData.valueVi}`
                        : `Time: ${selectedAppointment.timeBookingData.valueEn}`}
                    </div>
                    <div className="col-12 my-2">
                      {language === LENGUAGES.VI
                        ? `Trạng thái: ${selectedAppointment.statusData.valueVi}`
                        : `Status: ${selectedAppointment.statusData.valueEn}`}
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
          )}
          {selectedAppointment && !_.isEmpty(selectedAppointment) && (
            <Modal
              isOpen={isShowModalRating}
              className={"schedule-modal"}
              size="lg"
            >
              <div className="modal-schedule-container">
                <div className="modal-header">
                  <span>
                    <FormattedMessage id="homeheader.rating" />
                  </span>
                  <span>
                    <i
                      className="fas fa-times"
                      onClick={() => this.closeModal()}
                    ></i>
                  </span>
                </div>
                <div className="modal-body">
                  <div className="info-schedule"></div>
                  <div className="row container">
                    <div className="col-12 my-2">
                      {language === LENGUAGES.VI
                        ? `Bác sĩ: ${selectedAppointment.bookingDoctorData.lastName} ${selectedAppointment.bookingDoctorData.firstName}`
                        : `Doctor: ${selectedAppointment.bookingDoctorData.firstName} ${selectedAppointment.bookingDoctorData.lastName}`}
                    </div>
                    <div className="col-12 my-2">
                      {language === LENGUAGES.VI
                        ? `Tên cơ sở: ${selectedAppointment.bookingDoctorData.Doctor_Info.doctorClinicData.name}`
                        : `Clinic's name: ${selectedAppointment.bookingDoctorData.Doctor_Info.doctorClinicData.name}`}
                    </div>
                    <div className="col-12 my-2">
                      {language === LENGUAGES.VI
                        ? `Địa chỉ: ${selectedAppointment.bookingDoctorData.Doctor_Info.doctorClinicData.address}`
                        : `Address: ${selectedAppointment.bookingDoctorData.Doctor_Info.doctorClinicData.address}`}
                    </div>
                    <div className="col-12 my-2">
                      <label>
                        <FormattedMessage id="homeheader.comment" />
                      </label>
                      <textarea
                        className="form-control"
                        rows={4}
                        onChange={(e) => this.handleChangeInput(e, "comment")}
                      ></textarea>
                    </div>
                    <div className="col-12 my-2">
                      <label className="mr-4" style={{ marginRight: "15px" }}>
                        <FormattedMessage id="homeheader.rating" />
                      </label>
                      <StarRatings
                        rating={this.state.rating}
                        starRatedColor="rgb(230, 67, 47)"
                        changeRating={(e) => this.changeRating(e)}
                        numberOfStars={5}
                        name="rating"
                        starDimension="30px"
                      />
                    </div>
                    <div className="col-12 my-2">
                      <button
                        className="btn btn-primary px-2"
                        onClick={() => this.sendRating()}
                      >
                        <FormattedMessage id="homeheader.send-rating" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Modal>
          )}
          <Modal
            isOpen={isShowModalBooking}
            className={"schedule-modal"}
            size="md"
          >
            <div className="modal-schedule-container">
              <div className="modal-header">
                <span>
                  <i
                    className="fas fa-times"
                    onClick={() => this.closeModalBooking()}
                  ></i>
                </span>
              </div>
              <div className="modal-body">
                <p className="text-center mt-4" style={{ fontSize: "20px" }}>
                  Bạn muốn huỷ lịch hẹn ?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn-confirm"
                  onClick={() => this.handleCancelAppointment()}
                >
                  <FormattedMessage id="user-view.booking-modal.confirm" />
                </button>
                <button
                  className="btn-cancel"
                  onClick={() => this.closeModalBooking()}
                >
                  <FormattedMessage id="user-view.booking-modal.cancel" />
                </button>
              </div>
            </div>
          </Modal>
        </LoadingOverlay>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    gender: state.admin.genders,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGenderStart: () => dispatch(actions.fetchGenderStart()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DetailUser)
);
