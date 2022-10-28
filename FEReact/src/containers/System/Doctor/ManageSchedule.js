import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManageSchedule.scss';
import { FormattedMessage } from 'react-intl';
import Select from 'react-select';
import { LANGUAGES, dateFormat } from '../../../utils';
import * as actions from '../../../store/actions';
import DatePicker from '../../../components/Input/DatePicker'
import moment from 'moment';
import _, { times } from 'lodash';
import { toast } from 'react-toastify';
import { bulkCreateScheduleService } from '../../../services/userService'

class ManageSchedule extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            selectedDoctor: '',
            listDoctors: [],
            currentDate: '',
            rangeTime: []
        }
    }

    async componentDidMount() {
        this.props.fetchAllDoctors();
        this.props.fetchAllScheduleHours();
    }

    buildDataInputSelect = (inputData) => {
        let result = [];
        let language = this.props.language;
        if(inputData && inputData.length > 0) {
            inputData.map((item, index) => {
                let object = {};
                let labelVi = `${item.lastName} ${item.firstName}`;
                let labelEn = `${item.firstName} ${item.lastName}`;
                object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                object.value = item.id;
                result.push(object)
            })
        }
        return result;
    }

     componentDidUpdate(prevProps, prevState) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
            this.setState({
                listDoctors: dataSelect
            })
        }

        if (prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors);
            this.setState({
                listDoctors: dataSelect
            })
        }

        if (prevProps.allTimeHours !== this.props.allTimeHours) {
            let data = this.props.allTimeHours;
            if(data && data.length > 0) {
                data = data.map(item => ({...item, isSeleted: false}))
            }
            this.setState({
                rangeTime: data
            })
        }
    }

     handleChange = async (selectedDoctor) => {
        this.setState({
            selectedDoctor: selectedDoctor
        })
    };

    handleChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        })
    }

    handleClickBtnTime = (time) => {
        let {rangeTime} = this.state;
        if(rangeTime && rangeTime.length > 0) {
            rangeTime = rangeTime.map(item => {
                if(item.id === time.id) item.isSeleted = !item.isSeleted;
                return item;
            })
        }

        this.setState({
            rangeTime: rangeTime
        })
    }

    handleSaveSchedule = async () => {
        let { rangeTime, selectedDoctor, currentDate } = this.state;
        let result = [];
        if(!currentDate) {
            toast.error("Missing params date !");
            return
        }
        if(!selectedDoctor && _.isEmpty(selectedDoctor)) {
            toast.error("Missing params doctor !");
            return;
        }

        let formatedDate = new Date(currentDate).getTime();
        if(rangeTime && rangeTime.length > 0) {
            let seletedTime = rangeTime.filter(item => item.isSeleted === true);
            if(seletedTime && seletedTime.length > 0) {
                seletedTime.map(schedule => {
                    let object = {};
                    object.doctorId = selectedDoctor.value;
                    object.date = formatedDate;
                    object.timeType = schedule.keyMap;
                    result.push(object)
                })
            } else {
                toast.error('Missing params time');
                return;
            }
        }

        let res = await bulkCreateScheduleService({
            arrSchedule: result,
            doctorId: selectedDoctor.value,
            date: formatedDate
        });
        if(res && res.errCode === 0 ) {
            toast.success("Create oke");
        } else {
            toast.error("Create failed");
        }
    }

    render() {
        let { rangeTime } = this.state;
        return (
            <div className="manage-schedule-container">
                <div className="m-s-title"><FormattedMessage id = "manage-schedule.title"/></div>
                <div className="container">
                    <div className="row">
                        <div className="col-6 form-group">
                            <label><FormattedMessage id="manage-schedule.choose-doctor"/></label>
                            <Select
                                value={this.state.selectedDoctor}
                                onChange={this.handleChange}
                                options={this.state.listDoctors}
                            />
                        </div>
                        <div className="col-6 form-group">
                            <label><FormattedMessage id="manage-schedule.choose-date"/></label>
                            <DatePicker
                                onChange={this.handleChangeDatePicker}
                                className="form-control"
                                value = {this.state.currentDate}
                                minDate={new Date(new Date().setDate(new Date().getDate()-1))}
                            />
                        </div>
                        <div className="col-12 pick-hour-container">
                            {rangeTime && rangeTime.length > 0 && rangeTime.map((item, index) => {
                                return (
                                    <button 
                                        className={item.isSeleted === true ? "btn btn-schedule active" : "btn btn-schedule"}
                                        key={index}
                                        onClick={() => this.handleClickBtnTime(item)}
                                    >
                                        {this.props.language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                    </button>
                                )
                            })}
                        </div>
                        <div className="col-12">
                            <button 
                                className="btn btn-primary btn-save-schedule"
                                onClick={() => this.handleSaveSchedule()}
                            >
                                <FormattedMessage id="manage-schedule.save"/>
                            </button>
                        </div>
                    </div>
                </div>
            </div> 
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        users: state.admin.users,
        allDoctors: state.admin.allDoctors,
        allTimeHours: state.admin.allTimeHours
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        fetchAllScheduleHours: () => dispatch(actions.fetchAllScheduleHours())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
