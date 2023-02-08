import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal } from "reactstrap";
import { FormattedMessage } from "react-intl";
import { LENGUAGES } from "../../../utils";
import * as actions from "../../../store/actions";
import Select from "react-select";
import DatePicker from "../../../components/Input/DatePicker";
import "./ManageSchedule.scss";
import { toast } from "react-toastify";
import _ from "lodash";
import {
  saveScheduleService,
  getScheduleDoctorService,
  deleteScheduleDoctorService,
} from "../../../services/userService";
import moment from "moment";
import LoadingOverlay from "react-loading-overlay";

class ManageSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDoctor: {},
      currentDate: "",
      listDoctors: [],
      rangeTime: [],
      dataTime: [],
      isLoading: false,
      isShowModalBooking: false,
      itemSelected: "",
    };
  }

  async componentDidMount() {
    if (this.props.userInfo && this.props.userInfo.accessToken) {
      let accessToken = this.props.userInfo.accessToken;
      if (this.props.userInfo.roleId === "R1") {
        await this.props.fetchAllDoctors(accessToken);
      }
    }
    this.props.fetchAllTime();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.allDoctor !== this.props.allDoctor ||
      prevProps.language !== this.props.language
    ) {
      let options = this.buildDataForSelect(this.props.allDoctor);
      this.setState({
        listDoctors: options,
      });
    }
    if (prevProps.timeArr !== this.props.timeArr) {
      let data = this.props.timeArr;
      if (data && data.length > 0) {
        data = data.map((item) => ({ ...item, isSelected: false }));
      }
      this.setState({
        rangeTime: data,
      });
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

  buildDataForSelect = (inputData) => {
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

  handleChangeSelect = async (selectedOption) => {
    this.setState({ selectedDoctor: selectedOption });
  };

  handleOnchangeDatePicker = async (date) => {
    this.setState({
      currentDate: date[0],
    });
    let role = "",
      id = "";
    if (
      this.props.userInfo &&
      this.props.userInfo.roleId &&
      this.props.userInfo.id
    ) {
      role = this.props.userInfo.roleId;
      id = this.props.userInfo.id;
    }
    let { selectedDoctor, currentDate } = this.state;
    if (selectedDoctor && currentDate) {
      let res = await getScheduleDoctorService(
        role && role === "R1" ? selectedDoctor.value : id,
        currentDate.getTime()
      );
      if (res && res.errCode === 0) {
        this.setState({
          timeData: res.data,
        });
      }
    }
  };

  handleSelectSchedule = (time) => {
    let rangeTime = this.state.rangeTime;
    if (rangeTime && rangeTime.length > 0) {
      rangeTime = rangeTime.map((item) => {
        if (item.id === time.id) {
          item.isSelected = !item.isSelected;
        }
        return item;
      });
    }
    this.setState({
      rangeTime,
    });
  };

  handleSubmit = async () => {
    let role = "",
      id = "";
    if (
      this.props.userInfo &&
      this.props.userInfo.roleId &&
      this.props.userInfo.id
    ) {
      role = this.props.userInfo.roleId;
      id = this.props.userInfo.id;
    }
    let { rangeTime, selectedDoctor, currentDate } = this.state;
    let result = [];

    if (role === "R1") {
      if (selectedDoctor && _.isEmpty(selectedDoctor)) {
        toast.error("Vui lòng chọn bác sĩ !!");
        return;
      }
    }

    if (!currentDate) {
      toast.error("Vui lòng chọn ngày !!");
      return;
    }

    let formatDate = new Date(currentDate).getTime();

    if (rangeTime && rangeTime.length > 0) {
      let selectedTime = rangeTime.filter((item) => item.isSelected === true);
      if (selectedTime && selectedTime.length > 0) {
        selectedTime.map((item) => {
          let obj = {};
          obj.doctorId = role && role === "R1" ? selectedDoctor.value : id;
          obj.date = formatDate;
          obj.timeType = item.keyMap;
          return result.push(obj);
        });
      } else {
        toast.error("Vui lòng chọn thời gian !!");
        return;
      }
    }
    this.handleShowLoading(true);
    let res = await saveScheduleService({
      arrSchedule: result,
      doctorId: role && role === "R1" ? selectedDoctor.value : id,
      formatDate: formatDate,
    });
    this.handleShowLoading(false);
    if (res && res.errCode === 0) {
      toast.success("Lưu lịch khám thành công !!");
      let { selectedDoctor, currentDate } = this.state;
      if (selectedDoctor && currentDate) {
        let res = await getScheduleDoctorService(
          role && role === "R1" ? selectedDoctor.value : id,
          currentDate.getTime()
        );
        if (res && res.errCode === 0) {
          this.setState({
            timeData: res.data,
          });
        }
      }
    } else {
      toast.error("Lưu lịch khám thất bại, vui lòng thử lại!!");
    }
  };

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  handleDeleteSchedule = async () => {
    let item = this.state.itemSelected;
    let role = "",
      id = "";
    if (
      this.props.userInfo &&
      this.props.userInfo.roleId &&
      this.props.userInfo.id
    ) {
      role = this.props.userInfo.roleId;
      id = this.props.userInfo.id;
    }
    this.handleShowLoading(true);
    let res = await deleteScheduleDoctorService(item.id);
    this.handleShowLoading(false);
    if (res && res.errCode === 0) {
      toast.success("Delete Schedule Succeed !!");
      this.setState({
        isShowModalBooking: false,
      });
    } else {
      toast.error("Delete Schedule failed");
    }
    let { selectedDoctor, currentDate } = this.state;
    if (selectedDoctor && currentDate) {
      let res = await getScheduleDoctorService(
        role && role === "R1" ? selectedDoctor.value : id,
        currentDate.getTime()
      );
      if (res && res.errCode === 0) {
        this.setState({
          timeData: res.data,
        });
      }
    }
  };

  handleShowLoading = (boolean) => {
    this.setState({
      isLoading: boolean,
    });
  };

  render() {
    let role = "";
    if (this.props.userInfo && this.props.userInfo.roleId) {
      role = this.props.userInfo.roleId;
    }
    let { rangeTime, timeData, isShowModalBooking } = this.state;
    let { language } = this.props;
    return (
      <LoadingOverlay active={this.state.isLoading} spinner text="Loading...">
        <div className="manage-schedule-container">
          <div className="title mb-4">
            <FormattedMessage id="menu.doctor.manage-schedule" />
          </div>
          <div className="container">
            <div className="row content-top center">
              {role && role === "R1" && (
                <div className="col-6 form-group content-top-left">
                  <label>
                    <FormattedMessage id="menu.doctor.choose-doctor" />
                  </label>
                  <Select
                    value={this.state.selectedDoctor}
                    onChange={this.handleChangeSelect}
                    options={this.state.listDoctors}
                  />
                </div>
              )}
              <div className="col-6 form-group content-top-right">
                <label>
                  <FormattedMessage id="menu.doctor.choose-date" />
                </label>
                <DatePicker
                  className="form-control"
                  onChange={this.handleOnchangeDatePicker}
                  value={this.state.currentDate}
                  minDate={new Date().setHours(0, 0, 0, 0)}
                />
              </div>
            </div>
          </div>
          <div className="content-bottom">
            <div className="container">
              <div className="row">
                {rangeTime &&
                  rangeTime.length > 0 &&
                  rangeTime.map((item, index) => {
                    return (
                      <div key={index} className="col-3 time-schedule">
                        <button
                          onClick={() => this.handleSelectSchedule(item)}
                          className={
                            item.isSelected === true
                              ? "btn-time selected"
                              : "btn-time"
                          }
                        >
                          {language === LENGUAGES.VI
                            ? item.valueVi
                            : item.valueEn}
                        </button>
                      </div>
                    );
                  })}
              </div>
              <button
                className="btn-primary btn-save"
                onClick={() => this.handleSubmit()}
              >
                <FormattedMessage id="menu.doctor.save-schedule" />
              </button>
            </div>
          </div>
          <div className="users-container container my-5">
            <table id="customers">
              <thead>
                <tr>
                  <th>
                    <FormattedMessage id="menu.doctor.date" />
                  </th>
                  <th>
                    <FormattedMessage id="menu.doctor.time" />
                  </th>
                  <th>
                    <FormattedMessage id="manage-specialty.options" />
                  </th>
                </tr>
              </thead>

              <tbody>
                {timeData &&
                  timeData.length > 0 &&
                  timeData.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          {this.props.language === LENGUAGES.VI
                            ? this.capitalizeFirstLetter(
                                moment
                                  .unix(+item.date / 1000)
                                  .format("dddd - DD/MM/YYYY")
                              )
                            : moment
                                .unix(+item.date / 1000)
                                .locale("en")
                                .format("ddd - MM/DD/YYYY")}
                        </td>
                        <td>
                          {this.props.language === LENGUAGES.VI
                            ? item.timeTypeData.valueVi
                            : item.timeTypeData.valueEn}
                        </td>
                        <td>
                          <div>
                            <button
                              className="btn btn-delete"
                              onClick={() => this.showModalBooking(item)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
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
                Bạn muốn huỷ lịch khám ?
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="btn-confirm"
                onClick={() => this.handleDeleteSchedule()}
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
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
    allDoctor: state.admin.allDoctors,
    timeArr: state.admin.timeArr,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllTime: () => dispatch(actions.fetchAllTime()),
    fetchAllDoctors: (token) => dispatch(actions.fetchAllDoctors(token)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
