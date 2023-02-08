import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../../store/actions";
import { LENGUAGES } from "../../../../utils/constant";
import HomeHeader from "../../HomeHeader";
import "./DetailDoctor.scss";
import DoctorSchedule from "./DoctorSchedule";
import DoctorMore from "./DoctorMore";
import Footer from "../../Section/Footer";
import LoadingOverlay from "react-loading-overlay";
import StarRatings from "react-star-ratings";
import { getRating } from "../../../../services/userService";

class DetailDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      infoDoctor: [],
      isLoading: false,
      dataRating: [],
    };
  }

  async componentDidUpdate(prevProps, prevState) {
    if (prevProps.infoDoctor !== this.props.infoDoctor) {
      this.setState({
        infoDoctor: this.props.infoDoctor,
      });
    }
    if (prevProps.match.params.id !== this.props.match.params.id) {
      if (
        this.props.match &&
        this.props.match.params &&
        this.props.match.params.id
      ) {
        let doctorId = this.props.match.params.id;
        let res = await getRating(doctorId);
        if (res && res.errCode === 0) {
          this.setState({
            dataRating: res.data,
          });
        }
      }
    }
  }

  async componentDidMount() {
    this.props.getInfoDoctor(this.props.match.params.id);
    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id
    ) {
      let doctorId = this.props.match.params.id;
      let res = await getRating(doctorId);
      if (res && res.errCode === 0) {
        this.setState({
          dataRating: res.data,
        });
      }
    }
  }

  handleShowLoading = (boolean) => {
    this.setState({
      isLoading: boolean,
    });
  };

  render() {
    let { infoDoctor, dataRating } = this.state;
    let language = this.props.language;
    let valueVi = "",
      valueEn = "";
    if (infoDoctor && infoDoctor.positionData) {
      valueVi = `${infoDoctor.positionData.valueVi}, ${infoDoctor.lastName} ${infoDoctor.firstName}`;
      valueEn = `${infoDoctor.positionData.valueEn}, ${infoDoctor.firstName} ${infoDoctor.lastName}`;
    }
    let dataContent =
      infoDoctor && infoDoctor.Doctor_Intro
        ? infoDoctor.Doctor_Intro.contentHTML
        : "";
    let rating = 0;
    if (dataRating && dataRating.length > 0) {
      rating =
        dataRating[0].ratingDoctor.Doctor_Info.total /
        dataRating[0].ratingDoctor.Doctor_Info.count;
    }
    return (
      <>
        <LoadingOverlay active={this.state.isLoading} spinner text="Loading...">
          <HomeHeader />

          <div className="container detail-doctor-top">
            <div className="content-detail-top">
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
                <p className="detail-doctor-des">
                  {infoDoctor && infoDoctor.Doctor_Intro
                    ? infoDoctor.Doctor_Intro.description
                    : ""}
                </p>
              </div>
            </div>
            <div className="schedule-doctor-container">
              <div className="schedule-left">
                <DoctorSchedule
                  idDoctor={
                    this.state.infoDoctor && this.state.infoDoctor.id
                      ? this.state.infoDoctor.id
                      : -1
                  }
                  handleShowLoadingFromParent={this.handleShowLoading}
                />
              </div>
              <div className="schedule-right">
                <DoctorMore
                  idDoctor={
                    this.state.infoDoctor && this.state.infoDoctor.id
                      ? this.state.infoDoctor.id
                      : -1
                  }
                />
              </div>
            </div>
          </div>
          <div className="detail-doctor-content">
            <div className="container detail-content">
              <div dangerouslySetInnerHTML={{ __html: dataContent }} />
            </div>
          </div>
          {dataRating && dataRating.length > 0 ? (
            <div className="detail-doctor-comments container">
              <div className="total-rating">
                <span className="rating">Rating:</span>
                <StarRatings
                  rating={rating}
                  starRatedColor="rgb(230, 67, 47)"
                  numberOfStars={5}
                  name="rating"
                  starDimension="15px"
                  isSelectable={false}
                />
                <span>{`(${dataRating[0].ratingDoctor.Doctor_Info.count})`}</span>
              </div>
              <div className="title-comment">Nhận xét của khách hàng:</div>
              {dataRating.map((item, index) => {
                return (
                  <div className="comment-content-block" key={index}>
                    <div className="user-name">
                      {language === LENGUAGES.VI
                        ? `${item.ratingPatient.lastName} ${item.ratingPatient.firstName}`
                        : `${item.ratingPatient.firstName} ${item.ratingPatient.lastName}`}
                    </div>
                    <div className="user-rating">
                      <StarRatings
                        rating={item.rating}
                        starRatedColor="rgb(230, 67, 47)"
                        numberOfStars={5}
                        name="rating"
                        starDimension="13px"
                        isSelectable={false}
                      />
                    </div>
                    <div className="user-comment">{item.comment}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="detail-doctor-comments container">
              <p>Bác sĩ hiện chưa có đánh giá !!</p>
            </div>
          )}

          <Footer />
        </LoadingOverlay>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    infoDoctor: state.admin.infoDoctor,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getInfoDoctor: (id) => dispatch(actions.getInfoDoctor(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);
