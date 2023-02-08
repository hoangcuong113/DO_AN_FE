import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import Slider from "react-slick";
import { withRouter } from "react-router";
import { getAllHandBook } from "../../../services/userService";

class HandBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listHandBook: [],
      viewWidth: window.innerWidth,
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

  componentDidUpdate(prevProps, prevState) {}

  handleViewDetail = (handbook) => {
    if (this.props.history) {
      this.props.history.push(`/detail-handbook/${handbook.id}`);
    }
  };

  handleViewMore = () => {
    if (this.props.history) {
      this.props.history.push(`/view-more-handbook`);
    }
  };

  render() {
    let settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 2,
    };

    
    let { listHandBook } = this.state;
    console.log(this.props.settings);
    return (
      <div className="section-common section-medical-facility">
        <div className="section-container container">
          <div className="section-header">
            <h3 className="section-title">
              <FormattedMessage id="home-page.handbook" />
            </h3>
            <button
              className="section-btn"
              onClick={() => this.handleViewMore()}
            >
              <FormattedMessage id="home-page.view-all" />
            </button>
          </div>
          <div className="section-body">
            <Slider {...settings}>
              {listHandBook &&
                listHandBook.length > 0 &&
                listHandBook.map((item, index) => {
                  return (
                    <div
                      className="section-custom"
                      key={index}
                      onClick={() => this.handleViewDetail(item)}
                    >
                      <div className="custom-handbook-section">
                        <div
                          className="section-img handbook-img"
                          style={{ backgroundImage: `url(${item.image})` }}
                        ></div>
                        <p className="title-handbook">{item.name}</p>
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(HandBook)
);
