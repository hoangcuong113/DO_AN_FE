import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { LENGUAGES } from "../../../../utils/constant";
import "./DoctorMore.scss";
import { getExtraDoctorInfoService } from "../../../../services/userService";

class DoctorMore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowDetailPrice: false,
      doctorExtraInfo: [],
    };
  }

  async componentDidMount() {
    let res = await getExtraDoctorInfoService(this.props.idDoctor);
    this.setState({
      doctorExtraInfo: res.data,
    });
  }

  async componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.language !== this.props.language ||
      this.props.idDoctor !== prevProps.idDoctor
    ) {
      let res = await getExtraDoctorInfoService(this.props.idDoctor);
      this.setState({
        doctorExtraInfo: res.data,
      });
    }
  }

  handleDisplayDetail = (stateView) => {
    this.setState({
      isShowDetailPrice: stateView,
    });
  };

  render() {
    let { language } = this.props;
    let { isShowDetailPrice, doctorExtraInfo } = this.state;
    return (
      <div className="doctor-more-detail">
        <div className="content-up">
          <div className="content-up-title">
            <FormattedMessage id="user-view.detail-doctor.address-clinic" />
          </div>
          <div className="content-up-specialty">
            {doctorExtraInfo &&
            doctorExtraInfo.doctorClinicData &&
            doctorExtraInfo.doctorClinicData.name
              ? doctorExtraInfo.doctorClinicData.name
              : ""}
          </div>
          <div className="content-up-address">
            {doctorExtraInfo &&
            doctorExtraInfo.doctorClinicData &&
            doctorExtraInfo.doctorClinicData.address
              ? doctorExtraInfo.doctorClinicData.address
              : ""}
          </div>
        </div>
        <div className="content-down">
          {isShowDetailPrice === false ? (
            <div className="content-down-shot">
              <span className="content-down-shot-title">
                <FormattedMessage id="user-view.detail-doctor.price" />
              </span>
              <span className="content-down-shot-price">
                {language === LENGUAGES.VI
                  ? doctorExtraInfo &&
                    doctorExtraInfo.priceTypeData &&
                    doctorExtraInfo.priceTypeData.valueVi
                  : doctorExtraInfo &&
                    doctorExtraInfo.priceTypeData &&
                    doctorExtraInfo.priceTypeData.valueEn}
              </span>
              <span
                className="content-down-shot-more"
                onClick={() => this.handleDisplayDetail(true)}
              >
                <FormattedMessage id="user-view.detail-doctor.view-detail" />
              </span>
            </div>
          ) : (
            <div className="content-down-detail">
              <div className="content-down-detail-title">
                <FormattedMessage id="user-view.detail-doctor.price" />
              </div>
              <div className="content-down-detail-up">
                <div className="content-detail-up-price">
                  <span className="content-down-shot-up-title">
                    <FormattedMessage id="user-view.detail-doctor.price" />
                  </span>
                  <span className="content-down-shot-up-price">
                    {language === LENGUAGES.VI
                      ? doctorExtraInfo &&
                        doctorExtraInfo.priceTypeData &&
                        doctorExtraInfo.priceTypeData.valueVi
                      : doctorExtraInfo &&
                        doctorExtraInfo.priceTypeData &&
                        doctorExtraInfo.priceTypeData.valueEn}
                  </span>
                </div>
                <div className="content-detail-up-text">
                  {doctorExtraInfo && doctorExtraInfo.note}
                </div>
              </div>
              <div className="content-down-detail-down">
                <FormattedMessage id="user-view.detail-doctor.payment" />
                {language === LENGUAGES.VI
                  ? doctorExtraInfo &&
                    doctorExtraInfo.paymentTypeData &&
                    doctorExtraInfo.paymentTypeData.valueVi
                  : doctorExtraInfo &&
                    doctorExtraInfo.paymentTypeData &&
                    doctorExtraInfo.paymentTypeData.valueEn}
              </div>
              <span
                className="content-down-shot-more"
                onClick={() => this.handleDisplayDetail(false)}
              >
                <FormattedMessage id="user-view.detail-doctor.hide-detail" />
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(DoctorMore);
