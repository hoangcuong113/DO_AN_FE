import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router";
import Select from "react-select";
import HomeHeader from "../../HomeHeader";
import { getAllSpecialtiesForHome } from "../../../../services/userService";
import { LENGUAGES } from "../../../../utils";
import Footer from "../../Section/Footer";

class ViewMoreSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listSpecailty: [],
      selectedSpecailty: "",
      listSpecailtyOptions: [],
    };
  }

  async componentDidMount() {
    let res = await getAllSpecialtiesForHome();
    if (res && res.errCode === 0) {
      let options = this.buildDataForSelectSpecailty(res.data);

      this.setState({
        listSpecailtyOptions: options,
        listSpecailty: res.data,
      });
    }
  }

  buildDataForSelectSpecailty = (inputData) => {
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

  componentDidUpdate() {}

  handleChangeSelect = async (selectedOption) => {
    this.setState({ selectedSpecailty: selectedOption });
    let idSpecailty = selectedOption.value;
    if (this.props.history) {
      this.props.history.push(`/detail-specialty/${idSpecailty}`);
    }
  };

  goToViewDetail = (specailty) => {
    if (this.props.history) {
      this.props.history.push(`/detail-specialty/${specailty.id}`);
    }
  };

  render() {
    let { listSpecailty, selectedSpecailty, listSpecailtyOptions } = this.state;
    return (
      <>
        <div className="detail-specialty-container">
          <HomeHeader />

          <div className="detail-view-more-content container">
            <h1 className="title-content">
              <FormattedMessage id="home-page.search-specialist" />
            </h1>
            <Select
              value={selectedSpecailty}
              onChange={this.handleChangeSelect}
              options={listSpecailtyOptions}
              name={"selectedSpecailty"}
              placeholder={
                <FormattedMessage id="home-page.search-specialist" />
              }
            />
          </div>

          <div className="detail-specialty-body">
            {listSpecailty &&
              listSpecailty.length > 0 &&
              listSpecailty.map((item, index) => {
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
                        {this.props.language === LENGUAGES.VI
                          ? item.nameVi
                          : item.nameEn}
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
  connect(mapStateToProps, mapDispatchToProps)(ViewMoreSpecialty)
);
