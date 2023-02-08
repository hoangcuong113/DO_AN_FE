import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router";
import Select from "react-select";
import HomeHeader from "../../HomeHeader";
import "./ViewMoreHandBook.scss";
import { getAllHandBook } from "../../../../services/userService";
import Footer from "../../Section/Footer";

class ViewMoreHandBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listHandBook: [],
      selectedHandBook: "",
      listHandBookOptions: [],
    };
  }

  async componentDidMount() {
    let res = await getAllHandBook();
    if (res && res.errCode === 0) {
      let options = this.buildDataForSelectHandBook(res.data);

      this.setState({
        listHandBookOptions: options,
        listHandBook: res.data,
      });
    }
  }

  buildDataForSelectHandBook = (inputData) => {
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
    this.setState({ selectedHandBook: selectedOption });
    let idHandBook = selectedOption.value;
    if (this.props.history) {
      this.props.history.push(`/detail-handbook/${idHandBook}`);
    }
  };

  goToViewDetail = (handbook) => {
    if (this.props.history) {
      this.props.history.push(`/detail-handbook/${handbook.id}`);
    }
  };

  render() {
    let { listHandBook, selectedHandBook, listHandBookOptions } = this.state;
    return (
      <>
        <div className="detail-specialty-container">
          <HomeHeader />

          <div className="detail-view-more-content container">
            <h1 className="title-content">
              <FormattedMessage id="manage-handbook.search" />
            </h1>
            <Select
              value={selectedHandBook}
              onChange={this.handleChangeSelect}
              options={listHandBookOptions}
              name={"selectedHandBook"}
              placeholder={<FormattedMessage id="manage-handbook.search" />}
            />
          </div>

          <div className="detail-specialty-body">
            {listHandBook &&
              listHandBook.length > 0 &&
              listHandBook.map((item, index) => {
                return (
                  <div
                    className="about-doctor more-handbook-container container"
                    key={index}
                  >
                    <div
                      className="image-handBook-more"
                      style={{ backgroundImage: `url(${item.image})` }}
                      onClick={() => this.goToViewDetail(item)}
                    ></div>
                    <div className="content-handBook-more">
                      <div
                        className="name-handBook"
                        onClick={() => this.goToViewDetail(item)}
                      >
                        {item.name}
                      </div>
                      <div className="author-handBook">
                        <i className="fas fa-user"></i>
                        {item.author}
                      </div>
                      <div className="content-handBook">
                        <div
                          dangerouslySetInnerHTML={{ __html: item.contentHTML }}
                        />
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
  connect(mapStateToProps, mapDispatchToProps)(ViewMoreHandBook)
);
