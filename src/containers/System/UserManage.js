import React, { Component } from "react";
import { connect } from "react-redux";
import "./UserManager.scss";
import {
  getAllUsers,
  addUserService,
  deleteUserService,
  editUserService,
} from "../../services/userService";
import ModalUser from "./ModalUser";
import { emitter } from "../../utils/emitter";
import ModalEditUser from "./ModalEditUser";

class UserManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrUsers: [],
      isShowModalUser: false,
      isShowModalEditUser: false,
      currentUser: {},
    };
  }

  async componentDidMount() {
    await this.getAllUsersFromReact();
  }

  getAllUsersFromReact = async () => {
    let response = await getAllUsers("ALL");
    if (response && response.errCode === 0) {
      this.setState({
        arrUsers: response.users,
      });
    }
  };

  handleAddNewUser = () => {
    this.setState({
      isShowModalUser: true,
    });
  };

  toggleModalUser = () => {
    this.setState({
      isShowModalUser: !this.state.isShowModalUser,
    });
  };

  toggleModalEditUser = () => {
    this.setState({
      isShowModalEditUser: !this.state.isShowModalEditUser,
    });
  };

  createNewUser = async (data) => {
    try {
      let response = await addUserService(data);
      if (response && response.errCode !== 0) {
        alert(response.errMessage);
      } else {
        await this.getAllUsersFromReact();
        this.setState({
          isShowModalUser: false,
        });
        emitter.emit("EVENT_CLEAR_MODAL_DATA");
      }
    } catch (e) {
      console.log(e);
    }
  };

  handleDeleteUser = async (user) => {
    try {
      const response = await deleteUserService(user.id);
      if (response && response.errCode === 0) {
        await this.getAllUsersFromReact();
      } else {
        alert(response.errMessage);
      }
    } catch (e) {
      console.log(e);
    }
  };

  handleEditUser = (user) => {
    this.setState({
      isShowModalEditUser: true,
      currentUser: user,
    });
  };

  saveEditUser = async (data) => {
    try {
      let res = await editUserService(data);
      if (res && !res.errCode !== 0) {
        this.setState({
          isShowModalEditUser: false,
        });
        await this.getAllUsersFromReact();
      } else {
        alert(res.errMessage);
      }
    } catch (e) {
      console.log(e);
    }
  };

  render() {
   
    let users = this.state.arrUsers;
    return (
      <div className="users-container">
        <ModalUser
          isShow={this.state.isShowModalUser}
          toggleModal={this.toggleModalUser}
          createNewUser={this.createNewUser}
        />
        {this.state.isShowModalEditUser && (
          <ModalEditUser
            isShow={this.state.isShowModalEditUser}
            toggleEditModal={this.toggleModalEditUser}
            currentUser={this.state.currentUser}
            saveEditUser={this.saveEditUser}
          />
        )}
        <div className="table-title title text-center">Manager Users</div>
        <div className="mx-1">
          <button
            className="btn btn-primary px-2"
            onClick={() => this.handleAddNewUser()}
          >
            <i className="fas fa-plus"></i> Add new user
          </button>
        </div>
        <div className="user-table mt-3 mx-1">
          <table id="customers">
            <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Address</th>
                <th>Phonenumber</th>
                <th>Options</th>
              </tr>
            </thead>

            <tbody>
              {users &&
                users.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td>{item.email}</td>
                      <td>
                        {item.firstName} {item.lastName}
                      </td>
                      <td>{item.address}</td>
                      <td>{item.phonenumber}</td>
                      <td>
                        <div>
                          <button
                            className="btn btn-edit"
                            onClick={() => {
                              this.handleEditUser(item);
                            }}
                          >
                            <i className="fas fa-pencil-alt"></i>
                          </button>
                          <button
                            className="btn btn-delete"
                            onClick={() => {
                              this.handleDeleteUser(item);
                            }}
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
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
