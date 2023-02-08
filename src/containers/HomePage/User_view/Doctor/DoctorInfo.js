import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./DoctorInfo.scss";
import { getInfoDoctorService } from "../../../../services/userService";
import { LENGUAGES } from "../../../../utils/constant";
import _ from "lodash";
import moment from "moment";
import localization from "moment/locale/vi";
import { Link } from "react-router-dom";

class DoctorInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      infoDoctor: {},
    };
  }

  async componentDidMount() {
    let res = await getInfoDoctorService(this.props.idDoctor);
    if (res && res.errCode === 0) {
      this.setState({
        infoDoctor: res.data,
      });
    }
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.idDoctor !== this.props.idDoctor) {
      let res = await getInfoDoctorService(this.props.idDoctor);
      if (res && res.errCode === 0) {
        this.setState({
          infoDoctor: res.data,
        });
      }
    }
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  showTime = (dataTime) => {
    if (dataTime && !_.isEmpty(dataTime)) {
      let date =
        this.props.language === LENGUAGES.VI
          ? this.capitalizeFirstLetter(
              moment.unix(+dataTime.date / 1000).format("dddd - DD/MM/YYYY")
            )
          : moment
              .unix(+dataTime.date / 1000)
              .locale("en")
              .format("ddd - MM/DD/YYYY");
      let time =
        this.props.language === LENGUAGES.VI
          ? dataTime.timeTypeData.valueVi
          : dataTime.timeTypeData.valueEn;
      return (
        <>
          <div className="doctor-schedule">{`${time} - ${date}`}</div>
          <div>
            <FormattedMessage id="user-view.booking-modal.free-booking" />
          </div>
        </>
      );
    } else return <></>;
  };

  render() {
    let { infoDoctor } = this.state;
    let { language, timeData, isShowPrice, isShowMore, idDoctor } = this.props;
    let valueVi = "",
      valueEn = "";
    if (infoDoctor && infoDoctor.positionData) {
      valueVi = `${infoDoctor.positionData.valueVi}, ${infoDoctor.lastName} ${infoDoctor.firstName}`;
      valueEn = `${infoDoctor.positionData.valueEn}, ${infoDoctor.firstName} ${infoDoctor.lastName}`;
    }
    return (
      <>
        <div className="doctor-info-container container">
          <div className="detail-doctor-top-left">
            <div
              className="avatar-doctor"
              style={{
                backgroundImage:
                  infoDoctor && infoDoctor.image
                    ? `url(${infoDoctor.image})`
                    : "",
              }}
            ></div>
          </div>
          <div className="detail-doctor-top-right">
            <p className="detail-doctor-title">
              {language === LENGUAGES.VI ? valueVi : valueEn}
            </p>
            {this.props.isShowDesc === true ? (
              <>
                <p className="detail-doctor-des">
                  {infoDoctor && infoDoctor.Doctor_Intro
                    ? infoDoctor.Doctor_Intro.description
                    : ""}
                </p>
              </>
            ) : (
              <>{this.showTime(timeData)}</>
            )}
            {isShowPrice === true && (
              <div className="doctor-price">
                <FormattedMessage id="user-view.booking-modal.price" />{" "}
                {language === LENGUAGES.VI
                  ? infoDoctor &&
                    infoDoctor.Doctor_Info &&
                    infoDoctor.Doctor_Info.priceTypeData &&
                    infoDoctor.Doctor_Info.priceTypeData.valueVi
                  : infoDoctor &&
                    infoDoctor.Doctor_Info &&
                    infoDoctor.Doctor_Info.priceTypeData &&
                    infoDoctor.Doctor_Info.priceTypeData.valueEn}
              </div>
            )}
            {isShowMore === true && (
              <div className="redirect-doctorInfo">
                <Link to={`/detail-doctor/${idDoctor}`}>
                  <FormattedMessage id="home-page.view-more" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </>
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorInfo);
