import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router";
import Select from "react-select";
import HomeHeader from "../../HomeHeader";
import "./ViewMoreClinic.scss";
import { getAllClinicForHome } from "../../../../services/userService";
import Footer from "../../Section/Footer";

class ViewMoreClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listClinic: [],
      selectedClinic: "",
      listClinicOptions: [],
    };
  }

  async componentDidMount() {
    let res = await getAllClinicForHome();
    if (res && res.errCode === 0) {
      let options = this.buildDataForSelectClinic(res.data);

      this.setState({
        listClinicOptions: options,
        listClinic: res.data,
      });
    }
  }

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

  componentDidUpdate() {}

  handleChangeSelect = async (selectedOption) => {
    this.setState({ selectedClinic: selectedOption });
    let idClinic = selectedOption.value;
    if (this.props.history) {
      this.props.history.push(`/detail-clinic/${idClinic}`);
    }
  };

  goToViewDetail = (clinic) => {
    if (this.props.history) {
      this.props.history.push(`/detail-clinic/${clinic.id}`);
    }
  };

  render() {
    let { listClinic, selectedClinic, listClinicOptions } = this.state;
    return (
      <>
        <div className="detail-specialty-container">
          <HomeHeader />

          <div className="detail-view-more-content container">
            <h1 className="title-content">
              <FormattedMessage id="home-page.search-clinic" />
            </h1>
            <Select
              value={selectedClinic}
              onChange={this.handleChangeSelect}
              options={listClinicOptions}
              name={"selectedClinic"}
              placeholder={<FormattedMessage id="home-page.search-clinic" />}
            />
          </div>

          <div className="detail-specialty-body">
            {listClinic &&
              listClinic.length > 0 &&
              listClinic.map((item, index) => {
                return (
                  <div
                    className="about-doctor more-content-container container"
                    key={index}
                  >
                    <div
                      className="image-detail-more"
                      style={{ backgroundImage: `url(${item.image})` }}
                      onClick={() => this.goToViewDetail(item)}
                    ></div>
                    <div className="content-detail-more">
                      <div
                        className="name-clinc"
                        onClick={() => this.goToViewDetail(item)}
                      >
                        {item.name}
                      </div>
                      <div className="address-clinic">
                        <i className="fas fa-map-marker-alt"></i>
                        {item.address}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <Footer />
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

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ViewMoreClinic)
);
