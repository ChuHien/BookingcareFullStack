import React, { Component } from 'react';
import { connect } from "react-redux";
import './ProfileDoctor.scss'
import { LANGUAGES } from '../../../utils'
import { FormattedMessage } from 'react-intl';
import * as actions from '../../../store/actions';
import {getProfileDoctorService} from '../../../services/userService';
import NumberFormat from 'react-number-format';
import _ from 'lodash';
import moment from 'moment';
import {Link} from 'react-router-dom';

class ProfileDoctor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataProfile: {}
        }
    }

    async componentDidMount() {
        this.getProfileDoctor(this.props.doctorId)        
    }

    getProfileDoctor = async (id) => {
        if(id) {
            let res = await getProfileDoctorService(id);
            if(res && res.errCode === 0) {
                let data = res.data;
                this.setState({
                    dataProfile: data
                })
            } else {
                console.log(res.errMessage);
            }
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.language !== prevProps.language) {

        }

        if(this.props.doctorId !== prevProps.doctorId) {
            this.getProfileDoctor(this.props.doctorId) 
        }


    }

    handleSeeMore = () => {
        
    }

    renderTimeBooking = (dataTime) => {
        if(dataTime && !_.isEmpty(dataTime)) {
            let time = this.props.language ===LANGUAGES.VI ? dataTime.timeTypeData.valueVi : dataTime.timeTypeData.valueEn;
            let date = this.props.language === LANGUAGES.VI ? 
                       moment.unix(+dataTime.date/1000).format('dddd - DD/MM/YYYY')
                       :
                       moment.unix(+dataTime.date/1000).locale('en').format('ddd - MM/DD/YYYY')
            return(
                <>
                    <div>{time} - {date}</div>
                    <div><FormattedMessage id="book-appointment.profile-doctor.booking-free"/></div>
                </>
            )
        }

        return <></>
        
    }

    render() {
        let { dataProfile } = this.state;
        let { isShowDescription, dataTime, isShowPrice, isShowLink, doctorId } = this.props;
        let nameVi='', nameEn='';
        if(dataProfile && dataProfile.positionData) {
            nameVi = `${dataProfile.positionData.valueVi}, ${dataProfile.lastName} ${dataProfile.firstName}`;
            nameEn = `${dataProfile.positionData.valueEn}, ${dataProfile.firstName} ${dataProfile.lastName}`;
        }
        return (
            <div className="profile-doctor-container">
                <div className="intro-doctor">
                    <div className="content-left"
                        style = {{backgroundImage: `url(${dataProfile && dataProfile.image ? dataProfile.image : ''})`}}
                    >
                    </div>
                    <div className="content-right">
                        <div className="up">
                            {this.props.language === LANGUAGES.VI ? nameVi : nameEn}
                        </div>
                        {isShowDescription === true ?
                            <div className="down">
                                {dataProfile && dataProfile.Markdown && dataProfile.Markdown.description 
                                && <span>
                                    { dataProfile.Markdown.description }
                                </span>
                                }
                            </div>
                            :
                            this.renderTimeBooking(dataTime)
                            
                        }
                    </div>
                </div>
                {isShowPrice === true &&
                    <div className="price">
                        <FormattedMessage id="book-appointment.profile-doctor.price"/> 
                        {dataProfile && dataProfile.Doctor_Infor && this.props.language === LANGUAGES.VI ?
                            <NumberFormat
                                value={dataProfile.Doctor_Infor.priceData.valueVi}
                                displayType={'text'}
                                thousandSeparator={true}
                                suffix={' VND'}
                            />
                            : ''
                        }

                        {dataProfile && dataProfile.Doctor_Infor && this.props.language === LANGUAGES.EN ?
                            <NumberFormat
                                value={dataProfile.Doctor_Infor.priceData.valueEn}
                                displayType={'text'}
                                thousandSeparator={true}
                                suffix={' USD'}
                            />
                            : ''
                        }
                    </div>
                }
                {isShowLink === true &&
                    <div className="see-more">
                        <Link to={`/doctors/${doctorId}`}>Xem them</Link>
                    </div>
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        extrainforDoctor: state.admin.extrainforDoctor
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getExtrainforDoctor: (doctorId) => dispatch(actions.getExtrainforDoctor(doctorId)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor);
