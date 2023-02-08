import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { toast } from "react-toastify";
import { changePWService } from "../../../services/userService";
import * as actions from "../../../store/actions";
import LoadingOverlay from "react-loading-overlay";

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowPassword: false,
      errMessage: "",
      oldPW: "",
      newPW: "",
      reNewPW: "",
      email: "",
      isLoading: false,
    };
  }

  componentDidMount() {
    if (this.props.userInfo && this.props.userInfo.email) {
      this.setState({
        email: this.props.userInfo.email,
      });
    }
  }

  componentDidUpdate(prevProps, prevStates) {
    if (prevProps.userInfo !== this.props.userInfo) {
      this.setState({
        email: this.props.userInfo.email,
      });
    }
  }

  goToHome = () => {
    if (this.props.history) {
      this.props.history.push(`/login`);
    }
  };

  handleCancel = () => {
    if (this.props.history) {
      this.props.history.push(`/`);
    }
  };

  handleShowHidePassword = () => {
    this.setState({
      isShowPassword: !this.state.isShowPassword,
    });
  };

  validatePassword = (password) => {
    return String(password).match(
      /^(?=.*\p{Ll})(?=.*\p{Lu})(?=.*[\d|@#$!%*?&])[\p{L}\d@#$!%*?&]{6,36}$/gu
    );
  };

  validInput = () => {
    let isValid = true;
    let arr = ["oldPW", "newPW", "reNewPW"];
    for (let i = 0; i < arr.length; i++) {
      if (!this.state[arr[i]]) {
        isValid = false;
        toast.error(`Vui lòng điền đủ thông tin !!`);
        break;
      }
    }
    if (!this.validatePassword(this.state.newPW)) {
      isValid = false;
      toast.error(
        "Mật khẩu mới cần dài ít nhất 6 ký tự và có chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số !!"
      );
      return;
    }
    return isValid;
  };

  handleChangePassword = async () => {
    let { email, oldPW, newPW, reNewPW } = this.state;
    let isValid = this.validInput();
    if (isValid) {
      if (newPW !== reNewPW) {
        this.setState({
          errMessage: "Vui lòng nhập lại đúng mật khẩu mới",
        });
        return;
      } else {
        this.setState({
          errMessage: "",
        });
        this.setState({ isLoading: true });
        let res = await changePWService({
          email: email,
          newPassword: newPW,
          oldPassword: oldPW,
        });
        this.setState({ isLoading: false });
        if (res && res.errCode === 0) {
          toast.success(
            "Thay đổi mật khẩu thành công, vui lòng đăng nhập lại !!"
          );
          this.props.processLogout();
        } else {
          toast.error(res.errMessage);
        }
      }
    }
  };

  handleEnterPress = (e) => {
    if (e.key === "Enter") {
      this.handleChangePassword();
    }
  };

  handleChangeInput = (e, id) => {
    let copyState = { ...this.state };
    copyState[id] = e.target.value;
    this.setState({ ...copyState });
  };

  render() {
    return (
      <>
        <LoadingOverlay active={this.state.isLoading} spinner text="Loading...">
          <div className="login-background">
            <div className="login-container">
              <div className="login-content row">
                <div className="col-12 login-title">ĐỔI MẬT KHẨU</div>
                <div className="col-12 form-group login-input">
                  <label className="login-label">Mật khẩu cũ:</label>
                  <div className="login-password">
                    <input
                      type={this.state.isShowPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="Nhập mật khẩu cũ"
                      onChange={(e) => this.handleChangeInput(e, "oldPW")}
                      onKeyDown={(e) => this.handleEnterPress(e)}
                    />
                    <div
                      className="login-password-icon"
                      onClick={() => this.handleShowHidePassword()}
                    >
                      <i
                        className={
                          this.state.isShowPassword
                            ? "far fa-eye"
                            : "far fa-eye-slash"
                        }
                      ></i>
                    </div>
                  </div>
                </div>
                <div className="col-12 form-group login-input">
                  <label className="login-label">Mật khẩu mới:</label>
                  <div className="login-password">
                    <input
                      type={this.state.isShowPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="Nhập mật khẩu mới"
                      onChange={(e) => this.handleChangeInput(e, "newPW")}
                      onKeyDown={(e) => this.handleEnterPress(e)}
                    />
                  </div>
                </div>
                <div className="col-12 form-group login-input">
                  <label className="login-label">Nhập lại khẩu mới:</label>
                  <div className="login-password">
                    <input
                      type={this.state.isShowPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="Nhập lại mật khẩu mới"
                      onChange={(e) => this.handleChangeInput(e, "reNewPW")}
                      onKeyDown={(e) => this.handleEnterPress(e)}
                    />
                  </div>
                </div>
                <div className="col-12" style={{ color: "red" }}>
                  {this.state.errMessage}
                </div>
                <div className="col-12">
                  <button
                    className="btn-login"
                    onClick={() => this.handleChangePassword()}
                  >
                    Đổi mật khẩu
                  </button>
                </div>
                <div className="col-12">
                  <button
                    className="btn-login btn-cancel-change"
                    onClick={() => this.handleCancel()}
                  >
                    Huỷ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </LoadingOverlay>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    processLogout: () => dispatch(actions.processLogout()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ChangePassword)
);
