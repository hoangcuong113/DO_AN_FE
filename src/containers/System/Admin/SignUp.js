import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { LENGUAGES, CommonUtils } from "../../../utils";
import { withRouter } from "react-router";
import * as actions from "../../../store/actions";
import "./UserRedux.scss";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { userSignUp } from "../../../services/userService";
import { toast } from "react-toastify";
import HomeHeader from "../../HomePage/HomeHeader";
import "./SignUp.scss";

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      signUpSucceed: "false",
      genderArr: [],
      previewImg: "",
      isOpen: false,
      id: "",
      email: "",
      password: "",
      password2: "",
      firstName: "",
      lastName: "",
      address: "",
      phonenumber: "",
      gender: "",
      position: "P0",
      role: "R3",
      avatar: "",
    };
  }

  componentDidMount() {
    this.props.getGenderStart();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.gender !== this.props.gender) {
      let arrGender = this.props.gender;
      this.setState({
        genderArr: this.props.gender,
        gender: arrGender && arrGender.length > 0 ? arrGender[0].keyMap : "",
      });
    }
  }

  handleAddImg = async (e) => {
    let data = e.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      let objectUrl = URL.createObjectURL(file);
      this.setState({
        previewImg: objectUrl,
        avatar: base64,
      });
    }
  };

  showLightbox = () => {
    if (!this.state.previewImg) return;
    this.setState({
      isOpen: true,
    });
  };

  handleChangeInput = (e, id) => {
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

  validatePassword = (password) => {
    return String(password).match(
      /^(?=.*\p{Ll})(?=.*\p{Lu})(?=.*[\d|@#$!%*?&])[\p{L}\d@#$!%*?&]{6,36}$/gu
    );
  };

  validatePhone = (number) => {
    return /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/.test(number);
  };

  validInput = () => {
    let isValid = true;
    if (!this.validateEmail(this.state.email)) {
      isValid = false;
      alert("Vui lòng điền chính xác địa chỉ Email!!");
      return;
    } else if (!this.validatePassword(this.state.password)) {
      isValid = false;
      alert(
        "Mật khẩu phải dài ít nhất 6 ký tự và phải chứa ít nhất 1 chữ in hoa, 1 chữ thường và 1 số !!"
      );
      return;
    } else if (this.state.password !== this.state.password2) {
      alert("Vui lòng nhập lại chính xác mật khẩu !!");
      return;
    } else if (!this.validatePhone(this.state.phonenumber)) {
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
      let res = await userSignUp({
        email: this.state.email,
        password: this.state.password,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        address: this.state.address,
        phonenumber: this.state.phonenumber,
        gender: this.state.gender,
        roleId: this.state.role,
        positionId: this.state.position,
        image: this.state.avatar,
      });
      if (res && res.errCode === 0) {
        toast.success("Đăng ký thành công !!");
        this.setState({
          signUpSucceed: true,
        });
      } else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại !!");
      }
    } else {
      return;
    }
  };

  goToLogin = () => {
    if (this.props.history) {
      this.props.history.push(`/login`);
    }
  };

  render() {
    let { genderArr } = this.state;

    let language = this.props.language;
    let file = this.state.previewImg;
    let {
      email,
      password,
      password2,
      firstName,
      lastName,
      address,
      phonenumber,
      gender,
      avatar,
      signUpSucceed,
    } = this.state;
    console.log("sigup", avatar);
    return (
      <>
        <HomeHeader />
        <div className="manage-container">
          <div className="manage-body container manage-container-signup">
            <div className="title mt-5">Đăng ký</div>
            {signUpSucceed === "false" ? (
              <form className="row g-3 mt-3">
                <div className="col-md-4">
                  <label className="form-label">
                    <FormattedMessage id="manage-user.email" />
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    onChange={(e) => this.handleChangeInput(e, "email")}
                    value={email}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">
                    <FormattedMessage id="manage-user.password" />
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    onChange={(e) => this.handleChangeInput(e, "password")}
                    value={password}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">
                    <FormattedMessage id="manage-user.password2" />
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    onChange={(e) => this.handleChangeInput(e, "password2")}
                    value={password2}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">
                    <FormattedMessage id="manage-user.first-name" />
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={(e) => this.handleChangeInput(e, "firstName")}
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
                    onChange={(e) => this.handleChangeInput(e, "lastName")}
                    value={lastName}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">
                    <FormattedMessage id="manage-user.phonenumber" />
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={(e) => this.handleChangeInput(e, "phonenumber")}
                    value={phonenumber}
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
                <div className="col-md-8">
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
                <div className="col-12">
                  <button
                    type="submit"
                    className="btn btn-primary px-3 btn-submit"
                    onClick={(e) => this.handleSubmit(e)}
                  >
                    <FormattedMessage id="manage-user.sign-up" />
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary btn-cancel"
                    onClick={() => this.goToLogin()}
                    style={{ height: "40px" }}
                  >
                    Huỷ
                  </button>
                </div>
              </form>
            ) : (
              <h3 className="text-center" style={{ marginTop: "90px" }}>
                Đăng ký thành công, bấm{" "}
                <span
                  onClick={() => this.goToLogin()}
                  style={{
                    textDecoration: "underline",
                    color: "blue",
                    cursor: "pointer",
                  }}
                >
                  vào đây
                </span>{" "}
                để tới trang đăng nhập !!
              </h3>
            )}
          </div>
          {this.state.isOpen === true && (
            <Lightbox
              mainSrc={file}
              onCloseRequest={() => this.setState({ isOpen: false })}
            />
          )}
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    gender: state.admin.genders,
    position: state.admin.positions,
    role: state.admin.roles,
    listUsers: state.admin.users,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGenderStart: () => dispatch(actions.fetchGenderStart()),
    getPositionStart: () => dispatch(actions.fetchPositionStart()),
    getRoleStart: () => dispatch(actions.fetchRoleStart()),
    createUser: (data, token) => dispatch(actions.createUser(data, token)),
    fetchUserRedux: () => dispatch(actions.fetchAllUserStart()),
    editUser: (data, token) => dispatch(actions.editUser(data, token)),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SignUp));
