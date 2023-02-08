import React, { Component } from "react";
import { connect } from "react-redux";
import HomeHeader from "./HomeHeader";
import Specialty from "./Section/Specialty";
import MedicalFacility from "./Section/MedicalFacility";
import OutstandingDoctor from "./Section/OutstandingDoctor";
import HandBook from "./Section/HandBook";
import About from "./Section/About";
import Footer from "./Section/Footer";
import Banner from "./Section/Banner";

import "./HomePage.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewWidth: window.innerWidth,
    };
  }

  componentDidMount() {
    this.setState({
      viewWidth: window.innerWidth,
    });
  }

  render() {
    let settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 2,
    };

    let settingsSmall = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 2,
      slidesToScroll: 2,
    };

    return (
      <div>
        <HomeHeader
          handleShowNav={this.handleShowNav}
          isShowNavBar={this.state.isShowNavBar}
        />
        <Banner />
        <Specialty
          settings={this.state.viewWidth >= 800 ? settings : settingsSmall}
        />
        <MedicalFacility
          settings={this.state.viewWidth >= 800 ? settings : settingsSmall}
        />
        <OutstandingDoctor
          settings={this.state.viewWidth >= 800 ? settings : settingsSmall}
        />
        <HandBook />
        <About />
        <Footer />
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

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
