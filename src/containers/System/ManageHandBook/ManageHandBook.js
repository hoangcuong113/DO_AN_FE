import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router";
import { CommonUtils } from "../../../utils";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import { toast } from "react-toastify";
import { Modal } from "reactstrap";
import {
  saveHandBookService,
  getAllHandBook,
  editHandBookService,
  deleteHandBookService,
} from "../../../services/userService";
import _ from "lodash";
import LoadingOverlay from "react-loading-overlay";

const mdParser = new MarkdownIt();

class ManageHandBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      image: "",
      author: "",
      previewImg: "",
      contentHTML: "",
      contentMarkdown: "",
      listHandBook: [],
      idHandBook: "",
      statusSubmit: "ADD",
      isLoading: false,
      isShowModalBooking: false,
      itemSelected: "",
    };
  }

  async componentDidMount() {
    let res = await getAllHandBook();
    if (res && res.errCode === 0) {
      this.setState({
        listHandBook: res.data,
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

  handleShowLoading = (boolean) => {
    this.setState({
      isLoading: boolean,
    });
  };

  handleSubmit = async (e) => {
    let userId = "";
    if (this.props.userInfo && this.props.userInfo.id) {
      userId = this.props.userInfo.id;
    }
    e.preventDefault();
    if (this.state.statusSubmit === "ADD") {
      let isValid = this.validInput();
      if (isValid) {
        this.handleShowLoading(true);
        let res = await saveHandBookService({
          userId: userId,
          image: this.state.image,
          name: this.state.name,
          author: this.state.author,
          contentHTML: this.state.contentHTML,
          contentMarkdown: this.state.contentMarkdown,
        });
        this.handleShowLoading(false);
        if (res && res.errCode === 0) {
          toast.success("Tạo bài đăng thành công");
          this.setState({
            name: "",
            author: "",
            image: "",
            previewImg: "",
            contentHTML: "",
            contentMarkdown: "",
          });
        } else {
          toast.error("Tạo bài đăng thất bại !!");
        }
      } else {
        return;
      }
    }
    if (this.state.statusSubmit === "EDIT") {
      let isValid = this.validInput();
      if (isValid) {
        this.handleShowLoading(true);
        let res = await editHandBookService({
          image: this.state.image,
          name: this.state.name,
          author: this.state.author,
          contentHTML: this.state.contentHTML,
          contentMarkdown: this.state.contentMarkdown,
          id: this.state.idHandBook,
        });
        this.handleShowLoading(false);
        if (res && res.errCode === 0) {
          toast.success(
            <FormattedMessage id="manage-specialty.save-succeed" />
          );
          this.setState({
            name: "",
            author: "",
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
    let res = await getAllHandBook();
    if (res && res.errCode === 0) {
      this.setState({
        listHandBook: res.data,
      });
    }
  };

  validInput = () => {
    let isValid = true;
    let arr = ["name", "author", "image", "contentHTML", "contentMarkdown"];
    for (let i = 0; i < arr.length; i++) {
      if (!this.state[arr[i]]) {
        isValid = false;
        toast.error(<FormattedMessage id="manage-specialty.fill-all" />);
        break;
      }
    }
    return isValid;
  };

  handleEditClinic = (item) => {
    this.setState({
      name: item.name,
      author: item.author,
      image: item.image,
      previewImg: item.image,
      contentHTML: item.contentHTML,
      contentMarkdown: item.contentMarkdown,
      idHandBook: item.id,
      statusSubmit: "EDIT",
    });
  };

  handleDeleteClinic = async () => {
    let item = this.state.itemSelected;
    if (item && !_.isEmpty(item)) {
      this.handleShowLoading(true);
      let res = await deleteHandBookService(item.id);
      this.handleShowLoading(false);
      if (res && res.errCode === 0) {
        toast.success("Xoá bài đăng thành công !!");
      } else {
        toast.error("Xoá bài đăng thất bại, vui lòng thử lại !!");
      }
    }
    let res = await getAllHandBook();
    if (res && res.errCode === 0) {
      this.setState({
        listHandBook: res.data,
        name: "",
        author: "",
        image: "",
        previewImg: "",
        contentHTML: "",
        contentMarkdown: "",
        statusSubmit: "ADD",
        isShowModalBooking: false,
      });
    }
  };

  handleCancel = () => {
    this.setState({
      name: "",
      image: "",
      author: "",
      previewImg: "",
      contentHTML: "",
      contentMarkdown: "",
    });
  };

  render() {
    let {
      isShowModalBooking,
      listHandBook,
      name,
      image,
      author,
      previewImg,
      contentHTML,
      contentMarkdown,
    } = this.state;
    let file = this.state.previewImg;
    return (
      <>
        <LoadingOverlay active={this.state.isLoading} spinner text="Loading...">
          <div className="manage-specialty-container">
            <div className="title">
              <FormattedMessage id="manage-handbook.title" />
            </div>
            <div className="manage-body container">
              <form className="row g-3 mt-5">
                <div className="col-md-4">
                  <label className="form-label">
                    <FormattedMessage id="manage-handbook.name" />
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={(e) => this.handleChangeInput(e, "name")}
                    value={this.state.name}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">
                    <FormattedMessage id="manage-handbook.author" />
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={(e) => this.handleChangeInput(e, "author")}
                    value={this.state.author}
                  />
                </div>
                <div className="col-md-4 manage-specialty-img">
                  <label className="form-label">
                    <FormattedMessage id="manage-handbook.image" />
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
                    <FormattedMessage id="manage-handbook.content" />
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
                  {(name ||
                    image ||
                    author ||
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
                    <FormattedMessage id="manage-handbook.name" />
                  </th>
                  <th>
                    <FormattedMessage id="manage-handbook.author" />
                  </th>
                  <th>
                    <FormattedMessage id="manage-specialty.options" />
                  </th>
                </tr>
              </thead>

              <tbody>
                {listHandBook &&
                  listHandBook.length > 0 &&
                  listHandBook.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.author}</td>
                        <td>
                          <div>
                            <button
                              className="btn btn-edit"
                              onClick={() => this.handleEditClinic(item)}
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
                  Bạn muốn xoá bài đăng ?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn-confirm"
                  onClick={() => this.handleDeleteClinic()}
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
  connect(mapStateToProps, mapDispatchToProps)(ManageHandBook)
);
