import React, { Component } from 'react';
import { connect } from "react-redux";
import './BookingModal.scss'
import { LANGUAGES } from '../../../../utils'
import { FormattedMessage } from 'react-intl';
import * as actions from '../../../../store/actions';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ProfileDoctor from '../ProfileDoctor';
import DatePicker from '../../../../components/Input/DatePicker'
import Select from 'react-select'
import _ from 'lodash';
import {bookAppointmentService} from '../../../../services/userService';
import {toast} from 'react-toastify';

class BookingModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            fullName: '',
            phoneNumber: '',
            email: '',
            address: '',
            reason: '',
            birthday: '',
            gender: '',
            doctorId: '',
            genders: [],
            seletedGender: ''
        }
    }

    async componentDidMount() {
        this.props.fetchGenderStart();
    }

    buildDataGender = (data) => {
        let result = [];
        let language = this.props.language;
        
        if(data && data.length > 0) {
            data.map(item => {
                let object = {}
                object.label = language === LANGUAGES.VI ? item.valueVi : item.valueEn;
                object.value = item.keyMap;
                result.push(object)
            })
        }
        return result
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.language !== prevProps.language) {
            this.setState({
                genders: this.buildDataGender(this.props.genders)
           })
        }

        if(this.props.genders !== prevProps.genders) {
            this.setState({
                genders: this.buildDataGender(this.props.genders)
           })
        }

        if(this.props.dataTime !== prevProps.dataTime) {
            if(this.props.dataTime && !_.isEmpty(this.props.dataTime)) {
                let doctorId = this.props.dataTime.doctorId
                this.setState({
                    doctorId
                })
            }
        }

    }

    handleCloseModal = () => {
        this.setState({
            isOpen: false
        })
    }

    handleOnChangeInput = (event, id) => {
        let copyState = {...this.state};
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        })
    }

    handleChangeDatePicker = (date) => {
        this.setState({
            birthday: date[0]
        })
    }

    handleChangeSelect = (selectedOption) => {
        this.setState({
            seletedGender: selectedOption,
            gender: selectedOption.value
        })
    }

    handleConfirmBooking = async () => {
        console.log('check state', this.state)
        //validate
        let res = await bookAppointmentService({
            fullName: this.state.fullName,
            phoneNumber: this.state.phoneNumber,
            email: this.state.email,
            address: this.state.address,
            reason: this.state.reason,
            birthday: this.state.birthday,
            gender: this.state.gender,
            doctorId: this.state.doctorId
        })

        if(res && res.errCode ===0) {
            toast.success('success')
        } else {
            toast.error('faild')
        }
    }

    render() {

        let {isOpen, closeBookingModal, dataTime} = this.props;

        return (
            <Modal 
                isOpen={isOpen}
                 
                className={'booking-modal-container'}
                size="lg"
                centered
                // backdrop={true}
            >
                <div className="booking-modal-content">
                    <div className="booking-modal-header">
                        <span className="left">Thông tin đặt lịch khám bệnh</span>
                        <span className="right" onClick={closeBookingModal}><i className="fas fa-times"></i></span>
                    </div>

                    <div className="booking-modal-body">
                        <div className="doctor-infor">
                            <ProfileDoctor 
                                doctorId = {dataTime.doctorId}
                                isShowDescription = {false}
                                dataTime = {dataTime}
                            />
                        </div>
                        <div className="row">
                            <div className="form-group col-6">
                                <label>Họ tên</label>
                                <input 
                                    className="form-control"
                                    type="text"
                                    value={this.state.fullName}
                                    onChange={(event)=>this.handleOnChangeInput(event, 'fullName')}
                                />
                            </div>
                            <div className="form-group col-6">
                                <label>Số điện thoại</label>
                                <input 
                                    className="form-control"
                                    value={this.state.phoneNumber}
                                    onChange={(event)=> this.handleOnChangeInput(event, 'phoneNumber')}    
                                />
                            </div>
                            <div className="form-group col-6">
                                <label>Địa chỉ email</label>
                                <input 
                                    className="form-control"
                                    value={this.state.email}
                                    onChange={(event)=>this.handleOnChangeInput(event, 'email')}
                                />
                            </div>
                            <div className="form-group col-6">
                                <label>Địa chỉ liên hệ</label>
                                <input 
                                    className="form-control"
                                    value={this.state.address}
                                    onChange={(event)=>this.handleOnChangeInput(event, 'address')}
                                />
                            </div>
                            <div className="form-group col-12">
                                <label>Lý do khám</label>
                                <input 
                                    className="form-control"
                                    value={this.state.reason}
                                    onChange={(event)=>this.handleOnChangeInput(event, 'reason')}
                                />
                            </div>
                            <div className="form-group col-6">
                                <label>Ngày sinh</label>
                                <DatePicker
                                    onChange={this.handleChangeDatePicker}
                                    className="form-control"
                                    value = {this.state.birthday}
                                    
                                />
                            </div>
                            <div className="form-group col-6">
                                <label>Giới tính</label>
                                <Select
                                    value={this.state.seletedGender}
                                    onChange={this.handleChangeSelect}
                                    options={this.state.genders}
                                    placeholder='Giới tính'
                                    name = "selectedGender"
                                />
                                
                            </div>
                            {/* {JSON.stringify(dataTime)} */}
                        </div>
                    </div>
                    <div className="booking-modal-footer">
                        <button 
                            className="btn-booking-confirm"
                            onClick={()=>this.handleConfirmBooking()}
                        >Xac nhan</button>
                        <button className="btn-booking-cancel" onClick={closeBookingModal}>Huy</button>
                    </div>
                </div>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        extrainforDoctor: state.admin.extrainforDoctor,
        genders: state.admin.genders
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getExtrainforDoctor: (doctorId) => dispatch(actions.getExtrainforDoctor(doctorId)),
        fetchGenderStart: () => dispatch(actions.fetchGenderStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
