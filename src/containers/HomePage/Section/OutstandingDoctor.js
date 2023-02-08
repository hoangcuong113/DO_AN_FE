import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import { LENGUAGES } from "../../../utils/constant";
import Slider from "react-slick";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router";

class OutstandingDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDoctors: [],
      idInfo: "",
      infoDoctor: [],
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.topDoctors !== this.props.topDoctors) {
      this.setState({
        arrDoctors: this.props.topDoctors,
      });
    }
  }

  componentDidMount() {
    this.props.getTopDoctors();
  }

  handleViewDetail = (doctor) => {
    if (this.props.history) {
      this.props.history.push(`/detail-doctor/${doctor.id}`);
    }
  };

  handleViewMore = () => {
    if (this.props.history) {
      this.props.history.push(`/view-more-doctor`);
    }
  };

  render() {
    let { arrDoctors } = this.state;
    let { language } = this.props;
    return (
      <div className="section-common section-outstanding-doctor">
        <div className="section-container container">
          <div className="section-header">
            <h3 className="section-title">
              <FormattedMessage id="home-page.outstanding-doctor" />
            </h3>
            <button
              className="section-btn"
              onClick={() => this.handleViewMore()}
            >
              <FormattedMessage id="home-page.view-all" />
            </button>
          </div>
          <div className="section-body">
            <Slider {...this.props.settings}>
              {arrDoctors &&
                arrDoctors.length > 0 &&
                arrDoctors.map((item, index) => {
                  let imgBase64 = "";
                  if (item.image) {
                    imgBase64 = Buffer.from(item.image, "base64").toString(
                      "binary"
                    );
                  }
                  let valueVi = `${item.positionData.valueVi}, ${item.lastName} ${item.firstName}`;
                  let valueEn = `${item.positionData.valueEn}, ${item.firstName} ${item.lastName}`;
                  return (
                    <div
                      className="section-custom text-center"
                      key={index}
                      onClick={() => this.handleViewDetail(item)}
                    >
                      <div className="custom-img">
                        <div
                          className="section-img doctor-img"
                          style={{ backgroundImage: `url(${imgBase64})` }}
                        ></div>
                        <p>{language === LENGUAGES.VI ? valueVi : valueEn}</p>
                      </div>
                    </div>
                  );
                })}
            </Slider>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
    topDoctors: state.admin.doctors,
    infoDoctor: state.admin.infoDoctor,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getTopDoctors: () => dispatch(actions.fetchTopDoctor()),
    getInfoDoctor: (id) => dispatch(actions.getInfoDoctor(id)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(OutstandingDoctor)
);
