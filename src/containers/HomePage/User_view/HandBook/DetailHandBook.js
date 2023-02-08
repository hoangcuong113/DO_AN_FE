import React, { Component } from "react";
import { connect } from "react-redux";
import "./DetailHandBook.scss";
import { withRouter } from "react-router";
import HomeHeader from "../../HomeHeader";
import Footer from "../../Section/Footer";
import { getHandBookById } from "../../../../services/userService";

class DetailHandBook extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataDetailHandbook: [],
    };
  }

  async componentDidMount() {
    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id
    ) {
      let id = this.props.match.params.id;
      let res = await getHandBookById(id);
      if (res && res.errCode === 0) {
        this.setState({
          dataDetailHandbook: res.data,
        });
      }
    }
  }

  componentDidUpdate() {}

  render() {
    const { dataDetailHandbook } = this.state;
    let dataContent = dataDetailHandbook.contentHTML;
    return (
      <>
        <div className="detail-specialty-container detail-handbook">
          <HomeHeader />
          <div className="detail-specialty-content container">
            <h2 className="clinic-name">{dataDetailHandbook.name}</h2>
            <div
              className="content-handbook"
              dangerouslySetInnerHTML={{ __html: dataContent }}
            />
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
  connect(mapStateToProps, mapDispatchToProps)(DetailHandBook)
);
