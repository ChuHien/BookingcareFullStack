import React, { Component } from 'react';
import { connect } from "react-redux";
import './ManagePatient.scss';
import { FormattedMessage } from 'react-intl';
import Select from 'react-select';
import { LANGUAGES, dateFormat } from '../../../utils';
import * as actions from '../../../store/actions';
import moment from 'moment';
import _, { times } from 'lodash';
import { toast } from 'react-toastify';
import { bulkCreateScheduleService, sendRemedyService } from '../../../services/userService';
import DatePicker from '../../../components/Input/DatePicker';
import { getListPatientForDoctorService } from '../../../services/userService';
import RemedyModal from './RemedyModal';
import LoadingOverlay from 'react-loading-overlay';

class ManagePatient extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            currentDate: new Date(),
            id: '',
            listPatient: [],
            isOpenModal: false,
            dataModal: {},
            isShowLoading: false
        }
    }

    async componentDidMount() {
        this.setState({
            id: this.props.userInfo.id
        })
        this.setListPatientData(); 
    }

    setListPatientData = async () => {
        let formatedDate = new Date(this.state.currentDate).getTime();
        let res = await getListPatientForDoctorService(this.props.userInfo.id, formatedDate);
        if(res && res.errCode === 0) {
            this.setState({
                listPatient: res.data
            })
        }
    }
    async componentDidUpdate(prevProps, prevState) {
        if (prevProps.language !== this.props.language) {
            
        }

        if (prevState.currentDate !== this.state.currentDate) {
            this.setListPatientData();
        }
    }

    handleChangeDatePicker = (date) => {
        this.setState({
            currentDate: date[0]
        })
    }

    handleBtnConfirm = (item) => {
        let data = {
            doctorId: item.doctorId,
            patientId: item.patientId,
            email: item.patientData.email,
            timeType: item.timeType,
            patientName: item.patientData.firstName
        }
        this.setState({
            isOpenModal: true,
            dataModal: data
        })
    }

    closeRemedyModal = () => {
        this.setState({
            isOpenModal: false,
            dataModal: {}
        })
    }

    sendRemedy = async (dataModal) => {
        this.setState({
            isShowLoading: true
        })
        let res = await sendRemedyService({
            email: dataModal.email,
            patientId: this.state.dataModal.patientId,
            doctorId: this.state.dataModal.doctorId,
            timeType: this.state.dataModal.timeType,
            imgBase64: dataModal.imgBase64,
            language: this.props.language,
            patientName: this.state.dataModal.patientName
        })
        if( res && res.errCode === 0) {
            this.setState({
                isShowLoading: false
            })
            toast.success('Gửi hóa đơn thành công');
            this.setListPatientData();
            this.closeRemedyModal();
        } else {
            this.setState({
                isShowLoading: false
            })
            toast.error('Xảy ra lỗi, chưa gửi được hóa đơn')
        }
    }

    render() {
        let { listPatient, isOpenModal, dataModal } = this.state;
        let {language} = this.props;
        return (
            <>
             <LoadingOverlay
                active={this.state.isShowLoading}
                spinner
                text='Loading...'
                >
            <div className="manage-patient-container">
                <div className="m-p-title"><FormattedMessage id="manage-patient.title"/></div>
                <div className="manage-patient-body row">
                    <div className="col-6 form-group">
                        <label><FormattedMessage id="manage-patient.choose-date"/></label>
                        <DatePicker
                            onChange={this.handleChangeDatePicker}
                            className="form-control"
                            value = {this.state.currentDate}
                        />
                    </div>
                    <div className="col-12 manage-patient-table">
                        <table>
                            <tbody>
                                <tr>
                                    <th><FormattedMessage id="manage-patient.stt"/></th>
                                    <th><FormattedMessage id="manage-patient.time"/></th>
                                    <th><FormattedMessage id="manage-patient.fullname"/></th>
                                    <th><FormattedMessage id="manage-patient.address"/></th>
                                    <th><FormattedMessage id="manage-patient.gender"/></th>
                                    <th><FormattedMessage id="manage-patient.confirm"/></th>
                                </tr>
                                {listPatient && listPatient.length > 0
                                ? listPatient.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <th>{index+1}</th>
                                            <th>{language === LANGUAGES.VI ? item.timeTypeDataPatient.valueVi : item.timeTypeDataPatient.valueEn}</th>
                                            <th>{item.patientData.firstName}</th>
                                            <th>{item.patientData.address}</th>
                                            <th>{language === LANGUAGES.VI ? item.patientData.genderData.valueVi : item.patientData.genderData.valueEn}</th>
                                            <th>
                                                <button 
                                                    className="mp-btn-confirm"
                                                    onClick={()=>this.handleBtnConfirm(item)}
                                                ><FormattedMessage id="manage-patient.confirm"/></button>
                                            </th>
                                        </tr>
                                    )
                                })
                                :
                                <tr>
                                    <td colSpan="6" style={{textAlign: "center"}}>No data in date</td>
                                </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {isOpenModal=== true &&
                <RemedyModal 
                    isOpenModal = {isOpenModal}
                    dataModal = {dataModal}
                    closeRemedyModal={this.closeRemedyModal}
                    sendRemedy = {this.sendRemedy}
                />
            }
            </LoadingOverlay>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        userInfo: state.user.userInfo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        fetchAllScheduleHours: () => dispatch(actions.fetchAllScheduleHours())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManagePatient);
