import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal } from "reactstrap";
import "./ManageSpecialty.scss";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router";
import { CommonUtils } from "../../../utils";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import { toast } from "react-toastify";
import {
  saveSpecialtyService,
  getAllSpecialties,
  editSpecialtyService,
  deleteSpecialtyService,
} from "../../../services/userService";
import _ from "lodash";
import LoadingOverlay from "react-loading-overlay";

const mdParser = new MarkdownIt();

class ManageSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameVi: "",
      nameEn: "",
      image: "",
      previewImg: "",
      contentHTML: "",
      contentMarkdown: "",
      listSpecialty: [],
      idSpecialty: "",
      statusSubmit: "ADD",
      token: "",
      isLoading: false,
      isShowModalBooking: false,
      itemSelected: "",
    };
  }

  async componentDidMount() {
    if (this.props.userInfo && this.props.userInfo.accessToken) {
      let res = await getAllSpecialties(this.props.userInfo.accessToken);
      if (res && res.errCode === 0) {
        this.setState({
          listSpecialty: res.data,
          token: this.props.userInfo.accessToken,
        });
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

  handleShowLoading = (boolean) => {
    this.setState({
      isLoading: boolean,
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
        image: base64,
      });
    }
  };

  handleEditorChange = ({ html, text }) => {
    this.setState({
      contentHTML: html,
      contentMarkdown: text,
    });
  };

  handleChangeInput = (e, id) => {
    let copyState = { ...this.state };
    copyState[id] = e.target.value;
    this.setState({
      ...copyState,
    });
  };

  handleSubmit = async (e) => {
    let token = "";
    if (this.props.userInfo && this.props.userInfo.accessToken) {
      token = this.props.userInfo.accessToken;
    }
    e.preventDefault();
    if (this.state.statusSubmit === "ADD") {
      let isValid = this.validInput();
      if (isValid) {
        this.handleShowLoading(true);
        let res = await saveSpecialtyService(
          {
            image: this.state.image,
            nameVi: this.state.nameVi,
            nameEn: this.state.nameEn,
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
          },
          token
        );
        this.handleShowLoading(false);
        if (res && res.errCode === 0) {
          toast.success("Tạo chuyên khoa thành công !!");
          this.setState({
            nameVi: "",
            nameEn: "",
            image: "",
            previewImg: "",
            contentHTML: "",
            contentMarkdown: "",
          });
        } else {
          toast.error("Tạo chuyên khoa thất bại, vui lòng thử lại !!");
        }
      } else {
        return;
      }
    }
    if (this.state.statusSubmit === "EDIT") {
      let isValid = this.validInput();
      if (isValid) {
        this.handleShowLoading(true);
        let res = await editSpecialtyService({
          image: this.state.image,
          nameVi: this.state.nameVi,
          nameEn: this.state.nameEn,
          contentHTML: this.state.contentHTML,
          contentMarkdown: this.state.contentMarkdown,
          id: this.state.idSpecialty,
        });
        this.handleShowLoading(false);
        if (res && res.errCode === 0) {
          toast.success(
            <FormattedMessage id="manage-specialty.save-succeed" />
          );
          this.setState({
            nameVi: "",
            nameEn: "",
            image: "",
            previewImg: "",
            contentHTML: "",
            contentMarkdown: "",
            statusSubmit: "ADD",
          });
        } else {
          toast.error(<FormattedMessage id="manage-specialty.save-failed" />);
        }
      } else {
        return;
      }
    }
    let res = await getAllSpecialties(token);
    if (res && res.errCode === 0) {
      this.setState({
        listSpecialty: res.data,
      });
    }
  };

  validInput = () => {
    let isValid = true;
    let arr = ["nameVi", "nameEn", "image", "contentHTML", "contentMarkdown"];
    for (let i = 0; i < arr.length; i++) {
      if (!this.state[arr[i]]) {
        isValid = false;
        toast.error(<FormattedMessage id="manage-specialty.fill-all" />);
        break;
      }
    }
    return isValid;
  };

  handleEditSpecialty = (item) => {
    this.setState({
      nameVi: item.nameVi,
      nameEn: item.nameEn,
      image: item.image,
      previewImg: item.image,
      contentHTML: item.contentHTML,
      contentMarkdown: item.contentMarkdown,
      idSpecialty: item.id,
      statusSubmit: "EDIT",
    });
  };

  handleDeleteSpecialty = async () => {
    let item = this.state.itemSelected;
    if (item && !_.isEmpty(item)) {
      this.handleShowLoading(true);
      let res = await deleteSpecialtyService(item.id);
      this.handleShowLoading(false);
      if (res && res.errCode === 0) {
        toast.success(
          <FormattedMessage id="manage-specialty.delete-succeed" />
        );
        this.setState({
          isShowModalBooking: false,
        });
      } else {
        toast.error(<FormattedMessage id="manage-specialty.delete-failed" />);
      }
    }
    let res = await getAllSpecialties(this.state.token);
    if (res && res.errCode === 0) {
      this.setState({
        listSpecialty: res.data,
      });
    }
  };

  handleCancel = () => {
    this.setState({
      nameVi: "",
      nameEn: "",
      image: "",
      previewImg: "",
      contentHTML: "",
      contentMarkdown: "",
    });
  };

  render() {
    let {
      listSpecialty,
      nameVi,
      nameEn,
      image,
      previewImg,
      contentHTML,
      contentMarkdown,
      isShowModalBooking,
    } = this.state;
    let file = this.state.previewImg;
    return (
      <>
        <LoadingOverlay active={this.state.isLoading} spinner text="Loading...">
          <div className="manage-specialty-container">
            <div className="title">
              <FormattedMessage id="manage-specialty.title" />
            </div>
            <div className="manage-body container">
              <form className="row g-3 mt-5">
                <div className="col-md-4">
                  <label className="form-label">
                    <FormattedMessage id="manage-specialty.nameVi-specialty" />
                  </label>
                  <input
                    type="nameSpecialty"
                    className="form-control"
                    onChange={(e) => this.handleChangeInput(e, "nameVi")}
                    value={this.state.nameVi}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">
                    <FormattedMessage id="manage-specialty.nameEn-specialty" />
                  </label>
                  <input
                    type="nameSpecialty"
                    className="form-control"
                    onChange={(e) => this.handleChangeInput(e, "nameEn")}
                    value={this.state.nameEn}
                  />
                </div>
                <div className="col-md-4 manage-specialty-img">
                  <label className="form-label">
                    <FormattedMessage id="manage-specialty.image-specialty" />
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
                      ></div>
                    )}
                  </div>
                </div>
                <div className="col-12">
                  <div className="mb-2">
                    <FormattedMessage id="manage-user.desc" />
                  </div>
                  <MdEditor
                    style={{ height: "400px" }}
                    renderHTML={(text) => mdParser.render(text)}
                    onChange={this.handleEditorChange}
                    value={
                      this.state.contentMarkdown
                        ? this.state.contentMarkdown
                        : ""
                    }
                  />
                </div>
                <div className="col-12">
                  <button
                    className="btn-primary px-3 btn-submit"
                    onClick={(e) => this.handleSubmit(e)}
                  >
                    <FormattedMessage id="manage-specialty.save" />
                  </button>
                  {(nameVi ||
                    nameEn ||
                    image ||
                    previewImg ||
                    contentHTML ||
                    contentMarkdown) && (
                    <button
                      type="submit"
                      className="btn btn-primary btn-cancel"
                      onClick={(e) => this.handleCancel(e)}
                    >
                      Huỷ
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
          <div className="users-container container my-5">
            <table id="customers">
              <thead>
                <tr>
                  <th>
                    <FormattedMessage id="manage-specialty.order" />
                  </th>
                  <th>
                    <FormattedMessage id="manage-specialty.nameVi-specialty" />
                  </th>
                  <th>
                    <FormattedMessage id="manage-specialty.nameEn-specialty" />
                  </th>
                  <th>
                    <FormattedMessage id="manage-specialty.options" />
                  </th>
                </tr>
              </thead>

              <tbody>
                {listSpecialty &&
                  listSpecialty.length > 0 &&
                  listSpecialty.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.nameVi}</td>
                        <td>{item.nameEn}</td>
                        <td>
                          <div>
                            <button
                              className="btn btn-edit"
                              onClick={() => this.handleEditSpecialty(item)}
                            >
                              <i className="fas fa-pencil-alt"></i>
                            </button>
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
                  Bạn muốn xoá chuyên khoa ?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn-confirm"
                  onClick={() => this.handleDeleteSpecialty()}
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
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty)
);
