import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import _ from "lodash";

class ModalEditUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      address: "",
      phonenumber: "",
    };
  }

  componentDidMount() {
    let user = this.props.currentUser;
    if (user && !_.isEmpty(user)) {
      this.setState({
        id: user.id,
        email: user.email,
        password: "hard password",
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
        phonenumber: user.phonenumber,
      });
    }
  }

  toggle = () => {
    this.props.toggleEditModal();
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
      alert("Vui lòng nhập địa chỉ Email hợp lệ!!");
      return;
    } else {
      let arr = [
        "email",
        "password",
        "firstName",
        "lastName",
        "address",
        "phonenumber",
      ];
      for (let i = 0; i < arr.length; i++) {
        if (!this.state[arr[i]]) {
          isValid = false;
          alert(`Missing ${arr[i]}`);
          break;
        }
      }
    }
    return isValid;
  };

  handleSaveEditUser = () => {
    let isValid = this.validInput();
    if (isValid) {
      this.props.saveEditUser(this.state);
    }
  };

  render() {
    console.log('123');
    return (
      <Modal
        isOpen={this.props.isShow}
        toggle={() => {
          this.toggle();
        }}
        className={"userModal"}
        size="lg"
        backdrop={this.state.backdrop}
      >
        <ModalHeader
          toggle={() => {
            this.toggle();
          }}
        >
          Update User
        </ModalHeader>
        <ModalBody>
          <div className="modal-container">
            <div className="modal-content">
              <label>Email</label>
              <input
                type="email"
                className="modal-input"
                placeholder="Enter email"
                onChange={(e) => {
                  this.handleInput(e, "email");
                }}
                value={this.state.email}
                disabled
              ></input>
            </div>
            <div className="modal-content">
              <label>Password</label>
              <input
                type="password"
                className="modal-input"
                placeholder="Enter password"
                onChange={(e) => {
                  this.handleInput(e, "password");
                }}
                value={this.state.password}
                disabled
              ></input>
            </div>
            <div className="modal-content">
              <label>First Name</label>
              <input
                type="text"
                className="modal-input"
                placeholder="Enter first name"
                onChange={(e) => {
                  this.handleInput(e, "firstName");
                }}
                value={this.state.firstName}
              ></input>
            </div>
            <div className="modal-content">
              <label>Last Name</label>
              <input
                type="text"
                className="modal-input"
                placeholder="Enter last name"
                onChange={(e) => {
                  this.handleInput(e, "lastName");
                }}
                value={this.state.lastName}
              ></input>
            </div>
            <div className="modal-content">
              <label>Address</label>
              <input
                type="text"
                className="modal-input"
                placeholder="Enter address"
                onChange={(e) => {
                  this.handleInput(e, "address");
                }}
                value={this.state.address}
              ></input>
            </div>
            <div className="modal-content">
              <label>Phonenumber</label>
              <input
                type="text"
                className="modal-input"
                placeholder="Enter phonenumber"
                onChange={(e) => {
                  this.handleInput(e, "phonenumber");
                }}
                value={this.state.phonenumber}
              ></input>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            className="px-3"
            color="primary"
            onClick={() => {
              this.handleSaveEditUser();
            }}
          >
            Save
          </Button>{" "}
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
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditUser);
