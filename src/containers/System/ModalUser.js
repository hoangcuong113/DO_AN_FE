import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { emitter } from "../../utils/emitter";

class ModalUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      address: "",
      phonenumber: "",
    };
    this.listenToEmitter();
  }

  listenToEmitter() {
    emitter.on("EVENT_CLEAR_MODAL_DATA", () => {
      this.setState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        address: "",
        phonenumber: "",
      });
    });
  }

  componentDidMount() {}

  toggle = () => {
    this.props.toggleModal();
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

  handleSubmit = () => {
    let isValid = this.validInput();
    if (isValid) {
      this.props.createNewUser(this.state);
    }
  };

  render() {
    console.log('456');
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
          Add new user
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
              this.handleSubmit();
            }}
          >
            Add user
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);
