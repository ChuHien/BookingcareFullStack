import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader';
import './DetailDoctor.scss'
import {getDetailDoctorService} from "../../../services/userService";
import { LANGUAGES } from '../../../utils'

class DetailDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            detailDoctor: '',
        }
    }

    async componentDidMount() {
        if(this.props.match && this.props.match.params.id) {
            let response = await getDetailDoctorService(this.props.match.params.id);
            if(response.errCode === 0 && response) {
                this.setState({
                    detailDoctor: response.data
                })
            } else {
                console.log(response.errMessage)
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    render() {
        let { detailDoctor } = this.state;
        let nameVi='', nameEn='';
        if(detailDoctor && detailDoctor.positionData) {
            nameVi = `${detailDoctor.positionData.valueVi}, ${detailDoctor.lastName} ${detailDoctor.firstName}`;
            nameEn = `${detailDoctor.positionData.valueEn}, ${detailDoctor.firstName} ${detailDoctor.lastName}`;
        }
        return (
            <>
               <HomeHeader isShowBanner={false}/>
               <div className="detail-doctor-container">
                    <div className="intro-doctor">
                        <div className="content-left"
                            style = {{backgroundImage: `url(${detailDoctor && detailDoctor.image ? detailDoctor.image : ''})`}}
                        >
                        </div>
                        <div className="content-right">
                            <div className="up">
                                {this.props.language === LANGUAGES.VI ? nameVi : nameEn}
                            </div>
                            <div className="down">
                                {detailDoctor && detailDoctor.Markdown && detailDoctor.Markdown.description 
                                && <span>
                                    { detailDoctor.Markdown.description }
                                </span>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="schudule-doctor">

                    </div>
                    <div className="detail-infor-doctor">
                        {detailDoctor && detailDoctor.Markdown && detailDoctor.Markdown.contentHTML &&
                            <div dangerouslySetInnerHTML={{__html: detailDoctor.Markdown.contentHTML}}></div>
                        }
                    </div>
                    <div className="comment-doctor">

                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailDoctor);
