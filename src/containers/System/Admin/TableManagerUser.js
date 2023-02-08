import React, { Component } from "react";
import { connect } from "react-redux";
import { Modal } from "reactstrap";
import * as actions from "../../../store/actions";
import { FormattedMessage } from "react-intl";

import "react-markdown-editor-lite/lib/index.css";

class TableManageUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listUsers: [],
      isShowModalBooking: false,
      itemSelected: "",
    };
  }

  componentDidMount() {
    if (this.props.userInfo && this.props.userInfo.accessToken) {
      let accessToken = this.props.userInfo.accessToken;
      if (this.props.userInfo) {
        this.props.fetchUserRedux(accessToken);
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.listUsers !== this.props.listUsers) {
      this.setState({
        listUsers: this.props.listUsers,
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

  handleDeleteUser() {
    let user = this.state.itemSelected;
    if (this.props.userInfo && this.props.userInfo.accessToken) {
      let accessToken = this.props.userInfo.accessToken;
      if (this.props.userInfo) {
        this.props.deleteUserRedux(user.id, accessToken);
        this.setState({ isShowModalBooking: false });
      }
    }
  }

  handleEditUser(user) {
    this.props.editToParent(user);
  }

  render() {
    let users = this.state.listUsers;
    let isShowModalBooking = this.state.isShowModalBooking;
    return (
      <>
        <div className="users-container container my-5">
          <table id="customers">
            <thead>
              <tr>
                <th>Email</th>
                <th>User Name</th>
                {/* <th>Last Name</th> */}
                {/* <th>Address</th> */}
                <th>Phonenumber</th>
                <th>Options</th>
              </tr>
            </thead>

            <tbody>
              {users.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.email}</td>
                    <td>{`${item.lastName} ${item.firstName}`}</td>
                    {/* <td>{item.lastName}</td> */}
                    {/* <td>{item.address}</td> */}
                    <td>{item.phonenumber}</td>
                    <td>
                      <div>
                        <button
                          className="btn btn-edit"
                          onClick={() => this.handleEditUser(item)}
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
                Bạn muốn xoá người dùng ?
              </p>
            </div>
            <div className="modal-footer">
              <button
                className="btn-confirm"
                onClick={() => this.handleDeleteUser()}
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
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    listUsers: state.admin.users,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUserRedux: (token) => dispatch(actions.fetchAllUserStart(token)),
    deleteUserRedux: (userId, token) =>
      dispatch(actions.deleteUser(userId, token)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
