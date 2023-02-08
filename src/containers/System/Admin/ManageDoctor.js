import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import { LENGUAGES } from "../../../utils";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import Select from "react-select";
import "./ManageDoctor.scss";
import { FormattedMessage } from "react-intl";
import { saveInfoDoctorService } from "../../../services/userService";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";

const mdParser = new MarkdownIt();

class ManageDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      //markdown
      contentHTML: "",
      contentMarkdown: "",
      doctorDesc: "",
      selectedDoctor: "",
      listDoctors: [],
      infoDoctor: {},
      editInfo: false,

      //info_doctor
      listPrice: [],
      listPayment: [],
      listProvice: [],
      listSpecialty: [],
      listClinic: [],

      selectedPrice: "",
      selectedPayment: "",
      selectedProvice: "",
      selectedSpecialty: "",
      selectedClinic: "",
      note: "",
      accessToken: "",
    };
  }

  async componentDidMount() {
    if (this.props.userInfo && this.props.userInfo.accessToken) {
      let accessToken = this.props.userInfo.accessToken;
      this.setState({ accessToken });
      await this.props.fetchAllDoctors(accessToken);
      await this.props.fetchRequiredDoctorStart(accessToken);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    //markdown
    if (
      prevProps.allDoctor !== this.props.allDoctor ||
      prevProps.language !== this.props.language
    ) {
      let options = this.buildDataForSelectDoctor(this.props.allDoctor);
      this.setState({
        listDoctors: options,
      });
    }
    //price
    if (
      prevProps.requiredInfoDoctor !== this.props.requiredInfoDoctor ||
      prevProps.language !== this.props.language
    ) {
      let optionsPrice = this.buildDataForSelectInfoDoctor(
        this.props.requiredInfoDoctor.priceId
      );
      this.setState({
        listPrice: optionsPrice,
      });
      let optionsPayment = this.buildDataForSelectInfoDoctor(
        this.props.requiredInfoDoctor.paymentId
      );
      this.setState({
        listPayment: optionsPayment,
      });
      let optionsProvice = this.buildDataForSelectInfoDoctor(
        this.props.requiredInfoDoctor.proviceId
      );
      this.setState({
        listProvice: optionsProvice,
      });
      let optionsSpecialty = this.buildDataForSelectSpecialty(
        this.props.requiredInfoDoctor.specialtyId
      );
      this.setState({
        listSpecialty: optionsSpecialty,
      });
      let optionsClinic = this.buildDataForSelectClinic(
        this.props.requiredInfoDoctor.clinicId
      );
      this.setState({
        listClinic: optionsClinic,
      });
    }

    if (
      prevProps.infoDoctor !== this.props.infoDoctor ||
      prevProps.language !== this.props.language
    ) {
      this.setState({
        infoDoctor: this.props.infoDoctor,
        contentHTML:
          this.props.infoDoctor &&
          this.props.infoDoctor.Doctor_Intro &&
          this.props.infoDoctor.Doctor_Intro.contentHTML
            ? this.props.infoDoctor.Doctor_Intro.contentHTML
            : "",
        contentMarkdown:
          this.props.infoDoctor &&
          this.props.infoDoctor.Doctor_Intro &&
          this.props.infoDoctor.Doctor_Intro.contentMarkdown
            ? this.props.infoDoctor.Doctor_Intro.contentMarkdown
            : "",
        doctorDesc:
          this.props.infoDoctor &&
          this.props.infoDoctor.Doctor_Intro &&
          this.props.infoDoctor.Doctor_Intro.description
            ? this.props.infoDoctor.Doctor_Intro.description
            : "",
        note:
          this.props.infoDoctor &&
          this.props.infoDoctor.Doctor_Info &&
          this.props.infoDoctor.Doctor_Info.note
            ? this.props.infoDoctor.Doctor_Info.note
            : "",
      });
      if (
        this.props.infoDoctor &&
        this.props.infoDoctor.Doctor_Info &&
        this.props.infoDoctor.Doctor_Info.paymentId &&
        this.props.infoDoctor.Doctor_Info.priceId &&
        this.props.infoDoctor.Doctor_Info.proviceId &&
        this.props.infoDoctor.Doctor_Info.specialtyId &&
        this.props.infoDoctor.Doctor_Info.clinicId
      ) {
        let { listPayment, listPrice, listProvice, listSpecialty, listClinic } =
          this.state;
        let findPayment = listPayment.find(
          (item) => item.value === this.props.infoDoctor.Doctor_Info.paymentId
        );
        this.setState({ selectedPayment: findPayment });
        let findPrice = listPrice.find(
          (item) => item.value === this.props.infoDoctor.Doctor_Info.priceId
        );
        this.setState({ selectedPrice: findPrice });
        let findProvince = listProvice.find(
          (item) => item.value === this.props.infoDoctor.Doctor_Info.proviceId
        );
        this.setState({ selectedProvice: findProvince });
        let findSpecialty = listSpecialty.find(
          (item) => item.value === this.props.infoDoctor.Doctor_Info.specialtyId
        );
        this.setState({ selectedSpecialty: findSpecialty });
        let findClinic = listClinic.find(
          (item) => item.value === this.props.infoDoctor.Doctor_Info.clinicId
        );
        this.setState({ selectedClinic: findClinic });
      } else {
        this.setState({
          selectedPayment: "",
          selectedPrice: "",
          selectedProvice: "",
          selectedClinic: "",
          selectedSpecialty: "",
        });
      }
    }
  }

  buildDataForSelectDoctor = (inputData) => {
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

  buildDataForSelectSpecialty = (inputData) => {
    let listOptions = [];
    if (inputData && inputData.length > 0) {
      inputData.map((item, index) => {
        let obj = {};
        let label =
          this.props.language === LENGUAGES.VI
            ? `${item.nameVi}`
            : `${item.nameEn}`;
        let value = item.id;
        obj.value = value;
        obj.label = label;
        return listOptions.push(obj);
      });
    }
    return listOptions;
  };

  buildDataForSelectClinic = (inputData) => {
    let listOptions = [];
    if (inputData && inputData.length > 0) {
      inputData.map((item, index) => {
        let obj = {};
        let label = `${item.name}`;
        let value = item.id;
        obj.value = value;
        obj.label = label;
        return listOptions.push(obj);
      });
    }
    return listOptions;
  };

  buildDataForSelectInfoDoctor = (inputData) => {
    let listOptions = [];
    if (inputData && inputData.length > 0) {
      inputData.map((item, index) => {
        let obj = {};
        let label =
          this.props.language === LENGUAGES.VI
            ? `${item.valueVi}`
            : `${item.valueEn}`;
        let value = item.keyMap;
        obj.value = value;
        obj.label = label;
        return listOptions.push(obj);
      });
    }
    return listOptions;
  };

  handleEditorChange = ({ html, text }) => {
    this.setState({
      contentHTML: html,
      contentMarkdown: text,
    });
  };

  handleChangeSelect = async (selectedOption) => {
    this.setState({ selectedDoctor: selectedOption });
    await this.props.getInfoDoctor(selectedOption.value);
    this.setState({ editInfo: true });
  };

  handleChangeSelectInfoDoctor = (selectedOption, name) => {
    let statename = name.name;
    let copyState = { ...this.state };
    copyState[statename] = selectedOption;
    this.setState({
      ...copyState,
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

  handleSaveDoctor = async () => {
    this.handleShowLoading(true);
    let res = await saveInfoDoctorService({
      contentHTML: this.state.contentHTML,
      contentMarkdown: this.state.contentMarkdown,
      description: this.state.doctorDesc,
      doctorId: this.state.selectedDoctor.value,
      priceId: this.state.selectedPrice.value,
      paymentId: this.state.selectedPayment.value,
      proviceId: this.state.selectedProvice.value,
      note: this.state.note,
      clinicId: this.state.selectedClinic.value,
      specialtyId: this.state.selectedSpecialty.value,
    });
    this.handleShowLoading(false);
    if (res && res.errCode === 0) {
      toast.success("Lưu thông tin thành công !!");
      this.setState({
        contentHTML: "",
        contentMarkdown: "",
        doctorDesc: "",
        selectedPrice: "",
        selectedPayment: "",
        selectedProvice: "",
        note: "",
        selectedDoctor: "",
        selectedClinic: "",
        selectedSpecialty: "",
      });
    } else {
      toast.error("Lưu thông tin thất bại, vui lòng thử lại !!");
    }
  };

  handleCancel = () => {
    this.setState({
      contentHTML: "",
      contentMarkdown: "",
      doctorDesc: "",
      selectedPrice: "",
      selectedPayment: "",
      selectedProvice: "",
      note: "",
      selectedDoctor: "",
      selectedClinic: "",
      selectedSpecialty: "",
    });
  };

  render() {
    const {
      selectedDoctor,
      selectedPayment,
      selectedPrice,
      selectedProvice,
      selectedClinic,
      selectedSpecialty,
      contentHTML,
      contentMarkdown,
      doctorDesc,
      note,
    } = this.state;
    return (
      <LoadingOverlay active={this.state.isLoading} spinner text="Loading...">
        <div className="container">
          <div className="title mb-5">
            <FormattedMessage id="admin.manage-doctor.title" />
          </div>
          <div className="desc-doctor">
            <div className="content-left">
              <label>
                <FormattedMessage id="admin.manage-doctor.select-doctor" />
              </label>
              <Select
                value={selectedDoctor}
                onChange={this.handleChangeSelect}
                options={this.state.listDoctors}
                name={"selectedDoctor"}
                placeholder={
                  <FormattedMessage id="admin.manage-doctor.select-doctor" />
                }
              />
            </div>
            <div className="content-right">
              <label>
                <FormattedMessage id="admin.manage-doctor.intro-doctor" />
              </label>
              <textarea
                className="doctor-desc"
                onChange={(e) => this.handleChangeInput(e, "doctorDesc")}
                value={this.state.doctorDesc}
              ></textarea>
            </div>
          </div>
          <div className="required-info row">
            <div className="col-4 form-group">
              <label>
                <FormattedMessage id="admin.manage-doctor.price" />
              </label>
              <Select
                value={selectedPrice}
                onChange={this.handleChangeSelectInfoDoctor}
                options={this.state.listPrice}
                name={"selectedPrice"}
                placeholder={
                  <FormattedMessage id="admin.manage-doctor.price" />
                }
              />
            </div>
            <div className="col-4 form-group">
              <label>
                <FormattedMessage id="admin.manage-doctor.payment" />
              </label>
              <Select
                value={selectedPayment}
                onChange={this.handleChangeSelectInfoDoctor}
                options={this.state.listPayment}
                name={"selectedPayment"}
                placeholder={
                  <FormattedMessage id="admin.manage-doctor.payment" />
                }
              />
            </div>

            <div className="col-4 form-group">
              <label>
                <FormattedMessage id="admin.manage-doctor.province" />
              </label>
              <Select
                value={selectedProvice}
                onChange={this.handleChangeSelectInfoDoctor}
                options={this.state.listProvice}
                name={"selectedProvice"}
                placeholder={
                  <FormattedMessage id="admin.manage-doctor.province" />
                }
              />
            </div>

            <div className="col-4 form-group">
              <label>
                <FormattedMessage id="admin.manage-doctor.specialty" />
              </label>
              <Select
                value={this.state.selectedSpecialty}
                onChange={this.handleChangeSelectInfoDoctor}
                options={this.state.listSpecialty}
                name={"selectedSpecialty"}
                placeholder={
                  <FormattedMessage id="admin.manage-doctor.specialty" />
                }
              />
            </div>

            <div className="col-4 form-group clinic-block">
              <label>
                <FormattedMessage id="admin.manage-doctor.clinic" />
              </label>
              <Select
                style={{ lineHight: "100%" }}
                value={this.state.selectedClinic}
                onChange={this.handleChangeSelectInfoDoctor}
                options={this.state.listClinic}
                name={"selectedClinic"}
                placeholder={
                  <FormattedMessage id="admin.manage-doctor.clinic" />
                }
              />
            </div>

            <div className="col-4 form-group my-4">
              <label>
                <FormattedMessage id="admin.manage-doctor.note" />
              </label>
              <input
                className="form-control"
                onChange={(e) => this.handleChangeInput(e, "note")}
                value={this.state.note}
              />
            </div>
          </div>
          <div className="markdown-doctor">
            <div className="mb-2">
              <FormattedMessage id="admin.manage-doctor.desc" />
            </div>
            <MdEditor
              style={{ height: "500px" }}
              renderHTML={(text) => mdParser.render(text)}
              onChange={this.handleEditorChange}
              value={
                this.state.contentMarkdown ? this.state.contentMarkdown : ""
              }
            />
          </div>
          <button
            className="save-doctor-desc btn-primary"
            onClick={() => this.handleSaveDoctor()}
          >
            {" "}
            {this.state.editInfo === true ? (
              <FormattedMessage id="admin.manage-doctor.add" />
            ) : (
              <FormattedMessage id="admin.manage-doctor.save" />
            )}
          </button>
          {(contentHTML ||
            contentMarkdown ||
            doctorDesc ||
            note ||
            selectedPrice ||
            selectedPayment ||
            selectedProvice ||
            selectedDoctor ||
            selectedClinic ||
            selectedSpecialty) && (
            <button
              type="submit"
              className="btn btn-primary btn-cancel"
              onClick={(e) => this.handleCancel(e)}
            >
              Huỷ
            </button>
          )}
        </div>
      </LoadingOverlay>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    allDoctor: state.admin.allDoctors,
    infoDoctor: state.admin.infoDoctor,
    requiredInfoDoctor: state.admin.requiredInfoDoctor,
    userInfo: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllDoctors: (token) => dispatch(actions.fetchAllDoctors(token)),
    getInfoDoctor: (id) => dispatch(actions.getInfoDoctor(id)),
    saveInfoDoctor: (data) => dispatch(actions.saveInfoDoctor(data)),
    fetchRequiredDoctorStart: (token) =>
      dispatch(actions.fetchRequiredDoctorStart(token)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
