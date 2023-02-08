import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { withRouter } from "react-router";

class About extends Component {
  handleViewDetail = (handbook) => {
    if (this.props.history) {
      this.props.history.push(`/detail-handbook/7`);
    }
  };
  render() {
    return (
      <div className="section-common">
        <div className="section-container container">
          <div className="section-header">
            <h3 className="section-title">
              <FormattedMessage id="home-page.about" />
            </h3>
          </div>
          <div className="section-body section-about">
            <div
              className="about-image"
              onClick={() => this.handleViewDetail()}
            ></div>
            <div className="about-content">
              <p>
                <strong>Health Care</strong> là nền tảng tập trung vào việc đặt
                khám chuyên khoa, kết nối bệnh nhân với bác sĩ, cơ sở y tế và
                giúp trải nghiệm đi khám của người bệnh được tốt hơn, hiệu quả
                hơn. Đồng thời, góp phần giải quyết vấn đề quá tải của các bệnh
                viện hiện nay.
              </p>
              <p>
                Nền tảng này được xây dựng đơn giản, dễ sử dụng, phản ánh hành
                trình đi khám thực tế của người bệnh. Tập trung vào nhóm bệnh
                chuyên khoa, không có tính chất cấp cứu, bệnh mãn tính, những
                người biết rõ tình trạng bệnh của mình và chủ động sắp xếp kế
                hoạch đi khám.
              </p>
              <p>
                Đặt lịch khám qua HealthCare, người bệnh chỉ cần đến nơi khám
                trước 15 - 30 phút, được hướng dẫn cụ thể quy trình khám, biết
                bác sĩ nào khám cho mình và chuẩn bị sao cho quá trình đi khám
                thuận lợi nhất.{" "}
              </p>
              <p>
                Nền tảng này còn chia sẻ các bài viết kinh nghiệm khám chữa bệnh
                tại các bệnh viện uy tín (cả bệnh viện công và bệnh viện tư),
                đây là tài liệu tham khảo thực tế, hữu ích cho người bệnh và
                người nhà khi đi khám. Từ đó, quá trình đi khám của người bệnh
                được hỗ trợ, hiệu quả hơn so với cách truyền thống, tiết kiệm
                thời gian, chi phí, giúp cho người bệnh gặp được bác sĩ và
                phương pháp phù hợp với tình hình bệnh tật của mình.
              </p>
            </div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(About));
