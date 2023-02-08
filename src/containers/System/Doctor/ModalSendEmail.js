import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { FormattedMessage } from "react-intl";
import { CommonUtils } from "../../../utils";
import _ from "lodash";
import moment from "moment";
import { sendEmailToCustomer } from "../../../services/userService";
import { toast } from "react-toastify";

class ModalSendEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      bill: "",
      message: "",
      doctorId: "",
      patientId: "",
      fullNamePatient: "",
      timeAppointment: "",
      dateAppointment: "",
      date: "",
      timeType: "",
    };
  }

  componentDidMount() {
    let { dataFromParent } = this.props;
    if (dataFromParent && !_.isEmpty(dataFromParent)) {
      this.setState({
        email: dataFromParent.bookingData.email,
        doctorId: dataFromParent.doctorId,
        patientId: dataFromParent.patientId,
        fullNamePatient: dataFromParent.bookingData.firstName,
        dateAppointment: this.buildTimeBooking(dataFromParent.date),
        timeAppointment: dataFromParent.timeBookingData.valueEn,
        date: dataFromParent.date,
        timeType: dataFromParent.timeType,
      });
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.dataFromParent !== this.props.dataFromParent) {
      let { dataFromParent } = this.props;
      if (dataFromParent && !_.isEmpty(dataFromParent)) {
        this.setState({
          email: dataFromParent.bookingData.email,
          doctorId: dataFromParent.doctorId,
          patientId: dataFromParent.patientId,
          fullNamePatient: dataFromParent.bookingData.firstName,
          dateAppointment: this.buildTimeBooking(dataFromParent.date),
          timeAppointment: dataFromParent.timeBookingData.valueEn,
          date: dataFromParent.date,
          timeType: dataFromParent.timeType,
        });
      }
    }
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  buildTimeBooking = (dataTime) => {
    let date = this.capitalizeFirstLetter(
      moment.unix(+dataTime / 1000).format("dddd - DD/MM/YYYY")
    );
    return date;
  };

  handleInput = (e, id) => {
    let copyState = { ...this.state };
    copyState[id] = e.target.value;
    this.setState({
      ...copyState,
    });
  };

  validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  validInput = () => {
    let isValid = true;
    if (!this.validateEmail(this.state.email)) {
      alert("Vui lòng điền địa chỉ email hợp lệ!!");
      return;
    } else {
      if (!this.state.email) {
        isValid = false;
        alert(`Vui lòng nhập địa chỉ email`);
      }
    }
    return isValid;
  };

  handleAddImg = async (e) => {
    let data = e.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      this.setState({
        bill: base64,
      });
    }
  };

  toggle = () => {
    this.props.changeShowModal();
  };

  handleSubmit = async () => {
    let isValid = this.validInput();
    if (isValid) {
      this.props.changeShowLoading(true);
      let res = await sendEmailToCustomer({
        email: this.state.email,
        bill: this.state.bill,
        message: this.state.message,
        doctorId: this.state.doctorId,
        patientId: this.state.patientId,
        fullNamePatient: this.state.fullNamePatient,
        timeAppointment: this.state.timeAppointment,
        dateAppointment: this.state.dateAppointment,
        date: this.state.date,
        timeType: this.state.timeType,
      });
      if (res && res.errCode === 0) {
        this.props.changeShowLoading(false);
        toast.success("Gửi email thành công!!");
        this.setState({
          bill: "",
          message: "",
        });
        this.toggle();
      } else {
        this.props.changeShowLoading(false);
        toast.error("Có lỗi xảy ra, vui lòng thử lại !!");
      }
    }
  };

  render() {
    return (
      <>
        <Modal
          isOpen={this.props.isShowModal}
          className={"userModal"}
          size="lg"
    
        >
          <ModalHeader>
            <span>Send bill to customers</span>
     
          </ModalHeader>
          <ModalBody>
            <div className="row">
              <div className="col-6">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                  onChange={(e) => {
                    this.handleInput(e, "email");
                  }}
                  value={this.state.email}
                ></input>
              </div>

              <div className="col-6">
                <label className="form-label">
                  <FormattedMessage id="manage-user.add-image" />
                </label>
                <div className="input-img-container">
                  <input
                    type="file"
                    id="input-img"
                    onChange={(e) => this.handleAddImg(e)}
                  />
                </div>
              </div>

              <div className="col-12 mt-3">
                <label>Message</label>
                <textarea
                  rows={4}
                  className="form-control"
                  onChange={(e) => {
                    this.handleInput(e, "message");
                  }}
                  value={this.state.message}
                ></textarea>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              className="px-3"
              color="primary"
              onClick={() => {
                this.handleSubmit();
              }}
            >
              Send
            </Button>
            <Button
              className="px-3"
              color="secondary"
              onClick={() => {
                this.toggle();
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalSendEmail);
