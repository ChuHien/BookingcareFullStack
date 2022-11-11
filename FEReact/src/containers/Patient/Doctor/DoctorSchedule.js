import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader';
import './DoctorSchedule.scss'
import localization from 'moment/locale/vi';
import { LANGUAGES } from '../../../utils'
import moment from 'moment';
import { getScheduleDoctorService } from '../../../services/userService';
import { FormattedMessage } from 'react-intl';
import BookingModal from './Modal/BookingModal';

class DoctorSchedule extends Component {

    constructor(props) {
        super(props);
        this.state = {
            allDays: [],
            allAvailableTime: [],
            isOpenModal: false,
            dataScheduleTimeModal: {}
        }
    }

    async componentDidMount() {
        let arrDays = this.getArrDays();
        if(arrDays && arrDays.length > 0) {
            this.setState({
                allDays: arrDays,
            })
        }
        if(this.props.doctorIdFromParent) {
            let res = await getScheduleDoctorService(this.props.doctorIdFromParent, arrDays[0].value);
            this.setState({
                allAvailableTime: res.data ? res.data : ''
            })
        }
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    getArrDays = () => {
        let { language } = this.props;
        let arrDate = []
        for (let i = 0; i< 7; i++) {
            let object = {};
            if(language === LANGUAGES.VI) {
                if(i === 0) {
                    let labelVi2 = moment(new Date()).add(i, 'days').format('DD/MM');
                    let today = `Hôm nay - ${labelVi2}`;
                    object.label = today;
                } else {
                    let labelVi = moment(new Date()).add(i, 'days').format('dddd- DD/MM');
                    object.label = this.capitalizeFirstLetter(labelVi)
                }
            } else {
                if(i === 0) {
                    let labelEn2 = moment(new Date()).add(i, 'days').locale('en').format('DD/MM');
                    let today = `Today - ${labelEn2}`;
                    object.label = today;
                } else {
                    object.label = moment(new Date()).add(i, 'days').locale('en').format('ddd- DD/MM');
                }
            }
            object.value = moment(new Date()).add(i, 'days').startOf('day').valueOf();
            arrDate.push(object);
        }
        
        return arrDate;
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.language !== prevProps.language) {
            let arrDays = this.getArrDays();
            this.setState({
                allDays: arrDays
            })
        }

        if(this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
            let arrDays = this.getArrDays();
            let res = await getScheduleDoctorService(this.props.doctorIdFromParent, arrDays[0].value);
            this.setState({
                allAvailableTime: res.data ? res.data : ''
            })
        }
    }

    handleOnChangeSelect = async (event) => {
        if (this.props.doctorIdFromParent && this.props.doctorIdFromParent !== -1) {
            let doctorId = this.props.doctorIdFromParent;
            let date = event.target.value;
            let res = await getScheduleDoctorService(doctorId, date);
            if(res && res.errCode === 0) {
                this.setState({
                    allAvailableTime: res.data ? res.data : []
                })
            }
        }
    }

    handleClickScheduleTime = (time) => {
        this.setState({
            isOpenModal: true,
            dataScheduleTimeModal: time
        })
    }

    closeBookingModal = () => {
        this.setState({
            isOpenModal: false
        })
    }

    render() {
        let {allDays, allAvailableTime} = this.state;
        return (
            <>
                <div className="doctor-schedule-container">
                    <div className="all-schedule">
                        <select onChange={(event)=> this.handleOnChangeSelect(event)}>
                            {allDays && allDays.length>0 && allDays.map((item, index) => {
                                return (
                                    <option value={item.value} key={index}>{item.label}</option>
                                )
                            })}
                        </select>
                    </div>
                    <div className="all-available-time">
                        <div className="text-calendar">
                            <i className="fas fa-calendar-alt"><span><FormattedMessage id='doctor-detail.schedule'/></span></i>
                        </div>
                        <div className="time-content">
                            { allAvailableTime && allAvailableTime.length > 0 ? 
                                <>
                                    <div className="time-content-btns">
                                        {allAvailableTime. map((item, index) => {
                                            let timeType = this.props.language === LANGUAGES.VI ? item.timeTypeData.valueVi : item.timeTypeData.valueEn;
                                            return (
                                                <button 
                                                    key={index}
                                                    className={this.props.language === LANGUAGES.VI ? "btn-vi" : "btn-en"}
                                                    onClick={()=>this.handleClickScheduleTime(item)}
                                                >
                                                    {timeType}
                                                </button>
                                            )
                                        })
                                        }
                                    </div>
                                    <div className="book-free">
                                        <span><FormattedMessage id="doctor-detail.choose"/><i className="far fa-hand-point-up"></i><FormattedMessage id="doctor-detail.book-free"/></span>
                                    </div>
                                </>
                            :
                                <div className="no-schedule"><FormattedMessage id="doctor-detail.no-schedule"/></div>
                            }
                        </div>
                    </div>
                </div>
                <BookingModal
                    isOpen = {this.state.isOpenModal}
                    closeBookingModal = {this.closeBookingModal}
                    dataTime = {this.state.dataScheduleTimeModal}
                />
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule);
