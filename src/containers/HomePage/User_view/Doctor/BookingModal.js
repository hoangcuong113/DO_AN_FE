import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Modal } from "reactstrap";
import { push } from "connected-react-router";
import "./BookingModal.scss";
import DoctorInfo from "./DoctorInfo";
import { LENGUAGES } from "../../../../utils/constant";
import DatePicker from "../../../../components/Input/DatePicker";
import * as actions from "../../../../store/actions";
import Select from "react-select";
import _ from "lodash";
import {
  getInfoUser,
  savePatientBooking,
} from "../../../../../src/services/userService";
import { toast } from "react-toastify";
import moment from "moment";

class BookingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scheduleId: "",
      doctorId: "",
      fullName: "",
      phonenumber: "",
      address: "",
      email: "",
      dateOfBirth: "",
      selectedGender: "",
      reason: "",
      listGender: [],
      date: "",
    };
  }

  async componentDidMount() {
    this.props.getGender();

    if (this.props.userInfo && this.props.userInfo.id) {
      let id = this.props.userInfo.id;
      let res = await getInfoUser(id);
      if (res && res.errCode === 0) {
        let data = res.users;
        this.setValueInput(data);
      }
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.gender !== this.props.gender ||
      this.props.language !== prevProps.language
    ) {
      let lisGender = this.buildDataForSelect(this.props.gender);
      this.setState({
        listGender: lisGender,
        gender: lisGender && lisGender.length > 0 ? lisGender[0].keyMap : "",
      });
    }
    if (prevProps.dataTime !== this.props.dataTime) {
      if (this.props.dataTime && !_.isEmpty(this.props.dataTime)) {
        let scheduleId = this.props.dataTime.id;
        let doctorId = this.props.dataTime.doctorId;
        let timeType = this.props.dataTime.timeType;
        let date = this.props.dataTime.date;
        this.setState({
          scheduleId: scheduleId,
          doctorId: doctorId,
          timeType: timeType,
          date: date,
        });
      }
    }
  }

  setValueInput = (input) => {
    let data = input;
    if (data) {
      this.state.listGender.map((item, index) => {
        if (item.value === data.gender) {
          this.setState({
            selectedGender: item,
          });
        }
      });
    }
    this.setState({
      userInfo: data,
      email: data.email,
      fullName: `${data.firstName} ${data.lastName}`,
      address: data.address,
      phonenumber: data.phonenumber,
    });
  };

  buildDataForSelect = (inputData) => {
    let listOptions = [];
    if (inputData && inputData.length > 0) {
      inputData.map((item, index) => {
        let obj = {};
        let label =
          this.props.language === LENGUAGES.VI
            ? `${item.valueVi}`
            : `${item.valueEn}`;
        let value = item.keyMap;
        obj.value = value;
        obj.label = label;
        return listOptions.push(obj);
      });
    }
    return listOptions;
  };

  handleOnchangeInput = (e, id) => {
    let copyState = { ...this.state };
    copyState[id] = e.target.value;
    this.setState({ ...copyState });
  };

  handleOnchangeDatePicker = (date) => {
    this.setState({
      dateOfBirth: date[0],
    });
  };

  handleChangeSelect = (selectedOption) => {
    this.setState({ selectedGender: selectedOption });
  };

  //start
  validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  validatePhone = (number) => {
    return /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(number);
  };

  validInput = () => {
    let isValid = true;
    if (!this.validateEmail(this.state.email)) {
      isValid = false;
      toast.error("Địa chỉ email không hợp lệ!!");
      return;
    } else if (!this.validatePhone(this.state.phonenumber)) {
      isValid = false;
      toast.error("Số điện thoại không hợp lệ !!");
      return;
    } else {
      let arr = [
        "fullName",
        "phonenumber",
        "address",
        "email",
        "reason",
        "dateOfBirth",
        "selectedGender",
      ];
      for (let i = 0; i < arr.length; i++) {
        if (!this.state[arr[i]]) {
          isValid = false;
          toast.error(`Vui lòng điền đầy đủ thông tin !!`);
          break;
        }
      }
    }
    return isValid;
  };
  //end

  handleSubmit = async () => {
    let isValid = this.validInput();
    if (isValid) {
      this.props.handleLoadingToChild(true);
      let timeString = this.buildTimeBooking(this.props.dataTime);
      let doctorName = this.buildDoctorName(this.props.dataTime);
      let res = await savePatientBooking({
        scheduleId: this.state.scheduleId,
        doctorId: this.state.doctorId,
        fullName: this.state.fullName,
        phonenumber: this.state.phonenumber,
        address: this.state.address,
        email: this.state.email,
        dateOfBirth: new Date(this.state.dateOfBirth).getTime(),
        gender: this.state.selectedGender.value,
        reason: this.state.reason,
        timeType: this.state.timeType,
        date: this.state.date,
        doctorName: doctorName,
        timeString: timeString,
        language: this.props.language,
      });

      console.log("res", res);
      if (res && res.errCode === 0) {
        this.props.handleLoadingToChild(false);
        toast.success("Đặt lịch thành công !!");
        this.props.closeModalBooking();
      } else {
        this.props.handleLoadingToChild(false);
        toast.error(res.message);
      }
    } else {
      return;
    }
  };

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  buildTimeBooking = (dataTime) => {
    if (dataTime && !_.isEmpty(dataTime)) {
      let date =
        this.props.language === LENGUAGES.VI
          ? this.capitalizeFirstLetter(
              moment.unix(+dataTime.date / 1000).format("dddd - DD/MM/YYYY")
            )
          : moment
              .unix(+dataTime.date / 1000)
              .locale("en")
              .format("ddd - MM/DD/YYYY");
      let time =
        this.props.language === LENGUAGES.VI
          ? dataTime.timeTypeData.valueVi
          : dataTime.timeTypeData.valueEn;
      return `${time} - ${date}`;
    } else return "";
  };

  buildDoctorName = (dataTime) => {
    if (dataTime && !_.isEmpty(dataTime)) {
      let name =
        this.props.language === LENGUAGES.VI
          ? `${dataTime.doctorData.lastName} ${dataTime.doctorData.firstName}`
          : `${dataTime.doctorData.firstName} ${dataTime.doctorData.lastName}`;
      return name;
    }
    return "";
  };

  goToLogin = () => {
    const { navigate } = this.props;
    const redirectPath = "/login";
    navigate(`${redirectPath}`);
  };

  render() {
    let { isShowModalBooking, closeModalBooking, dataTime, isLoggedIn } =
      this.props;
    return (
      <Modal isOpen={isShowModalBooking} className={"schedule-modal"} size="lg">
        <div className="modal-schedule-container">
          <div className="modal-header">
            <span>
              <FormattedMessage id="user-view.booking-modal.info-booking" />
            </span>
            <span>
              <i className="fas fa-times" onClick={closeModalBooking}></i>
            </span>
          </div>
          <div className="modal-body">
            <div className="info-schedule">
              <DoctorInfo
                idDoctor={
                  dataTime && dataTime.doctorId ? dataTime.doctorId : ""
                }
                timeData={dataTime}
                isShowDesc={false}
                isShowPrice={true}
                isShowMore={false}
              />
            </div>

            {isLoggedIn && isLoggedIn === true ? (
              <>
                <div className="row container">
                  <div className="col-6 form-group my-2">
                    <label>
                      <FormattedMessage id="user-view.booking-modal.full-name" />
                    </label>
                    <input
                      className="form-control"
                      onChange={(e) => this.handleOnchangeInput(e, "fullName")}
                      value={this.state.fullName}
                    />
                  </div>
                  <div className="col-6 form-group my-2">
                    <label>
                      <FormattedMessage id="user-view.booking-modal.phonenumber" />
                    </label>
                    <input
                      className="form-control"
                      onChange={(e) =>
                        this.handleOnchangeInput(e, "phonenumber")
                      }
                      value={this.state.phonenumber}
                    />
                  </div>
                  <div className="col-6 form-group my-2">
                    <label>
                      <FormattedMessage id="user-view.booking-modal.email" />
                    </label>
                    <input
                      className="form-control"
                      onChange={(e) => this.handleOnchangeInput(e, "email")}
                      value={this.state.email}
                      disabled
                    />
                  </div>
                  <div className="col-6 form-group my-2">
                    <label>
                      <FormattedMessage id="user-view.booking-modal.address" />
                    </label>
                    <input
                      className="form-control"
                      onChange={(e) => this.handleOnchangeInput(e, "address")}
                      value={this.state.address}
                    />
                  </div>
                  <div className="col-6 form-group my-2">
                    <label>
                      <FormattedMessage id="user-view.booking-modal.date-of-birth" />
                    </label>
                    <DatePicker
                      className="form-control"
                      onChange={this.handleOnchangeDatePicker}
                      value={this.state.currentDate}
                      minDate={new Date("01/01/1920")}
                    />
                  </div>
                  <div className="col-6 form-group my-2">
                    <label>
                      <FormattedMessage id="user-view.booking-modal.sex" />
                    </label>
                    <Select
                      value={this.state.selectedGender}
                      onChange={this.handleChangeSelect}
                      options={this.state.listGender}
                    />
                  </div>

                  <div className="col-12 form-group my-2">
                    <label>
                      <FormattedMessage id="user-view.booking-modal.reason" />
                    </label>
                    <input
                      className="form-control"
                      onChange={(e) => this.handleOnchangeInput(e, "reason")}
                      value={this.state.reason}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center">
                Vui lòng{" "}
                <span
                  onClick={() => this.goToLogin()}
                  style={{
                    textDecoration: "underline",
                    color: "blue",
                    cursor: "pointer",
                  }}
                >
                  đăng nhập
                </span>{" "}
                để tiếp tục !!
              </div>
            )}
          </div>
          {isLoggedIn && isLoggedIn === true && (
            <div className="modal-footer">
              <button
                className="btn-confirm"
                onClick={() => this.handleSubmit()}
              >
                <FormattedMessage id="user-view.booking-modal.confirm" />
              </button>
              <button className="btn-cancel" onClick={closeModalBooking}>
                <FormattedMessage id="user-view.booking-modal.cancel" />
              </button>
            </div>
          )}
        </div>
      </Modal>
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
    getGender: () => dispatch(actions.fetchGenderStart()),
    navigate: (path) => dispatch(push(path)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
