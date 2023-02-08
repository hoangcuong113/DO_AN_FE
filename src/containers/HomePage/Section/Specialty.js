import React, { Component } from "react";
import { connect } from "react-redux";
import { getAllSpecialtiesForHome } from "../../../services/userService";
import { LENGUAGES } from "../../../utils/constant";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router";

import Slider from "react-slick";

class Specialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listSpecialty: [],
    };
  }

  componentDidUpdate(prevProps, prevState) {}

  async componentDidMount() {
    let res = await getAllSpecialtiesForHome();
    if (res && res.errCode === 0) {
      this.setState({
        listSpecialty: res.data,
      });
    }
  }

  handleViewMore = () => {
    if (this.props.history) {
      this.props.history.push(`/view-more-specialty`);
    }
  };

  handleViewDetail = (specialty) => {
    if (this.props.history) {
      this.props.history.push(`/detail-specialty/${specialty.id}`);
    }
  };

  render() {
    let { language } = this.props;
    let { listSpecialty } = this.state;

    return (
      <div className="section-common section-specialty">
        <div className="section-container container">
          <div className="section-header">
            <h3 className="section-title">
              <FormattedMessage id="home-page.specialist" />
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
              {listSpecialty &&
                listSpecialty.length > 0 &&
                listSpecialty.map((item, index) => {
              
                  return (
                    <div
                      className="section-custom"
                      key={index}
                      onClick={() => this.handleViewDetail(item)}
                    >
                      <div
                        className="section-img specialty-img"
                        style={{ backgroundImage: `url(${item.image})` }}
                      ></div>
                      <p>
                        {language === LENGUAGES.VI ? item.nameVi : item.nameEn}
                      </p>
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Specialty)
);
