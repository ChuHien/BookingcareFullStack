import React, { Component } from 'react';
import { connect } from "react-redux";
import HomeHeader from '../../HomePage/HomeHeader';
import './DoctorExtrainfor.scss'
import localization from 'moment/locale/vi';
import { LANGUAGES } from '../../../utils'
import moment from 'moment';
import { getDetailDoctorService } from '../../../services/userService';
import { getScheduleDoctorService } from '../../../services/userService';
import { FormattedMessage } from 'react-intl';
import * as actions from '../../../store/actions';
import NumberFormat from 'react-number-format';

class DoctorExtrainfor extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isShowDetailPrice: false,
            addressClinic: '',
            nameClinic: '',
            note: '',
            paymentData: '',
            priceData: '',
            provinceData: ''
        }
    }

    async componentDidMount() {
        await this.props.getExtrainforDoctor(this.props.doctorIdFromParent);
        let extrainforDoctor = this.props.extrainforDoctor;
        if(extrainforDoctor){
            this.setState({
                addressClinic: extrainforDoctor.addressClinic,
                nameClinic: extrainforDoctor.nameClinic,
                note: extrainforDoctor.note,
                paymentData: extrainforDoctor.paymentData,
                priceData: extrainforDoctor.priceData,
                provinceData: extrainforDoctor.provinceData
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.language !== prevProps.language) {

        }

        if(this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
            await this.props.getExtrainforDoctor(this.props.doctorIdFromParent);
            let extrainforDoctor = this.props.extrainforDoctor;
            if(extrainforDoctor){
                this.setState({
                    addressClinic: extrainforDoctor.addressClinic,
                    nameClinic: extrainforDoctor.nameClinic,
                    note: extrainforDoctor.note,
                    paymentData: extrainforDoctor.paymentData,
                    priceData: extrainforDoctor.priceData,
                    provinceData: extrainforDoctor.provinceData
                })
            }
        }

    }

    handleShowDetailPrice = () => {
        this.setState({
            isShowDetailPrice: !this.state.isShowDetailPrice
        })
    }

    render() {
        let { isShowDetailPrice, addressClinic, nameClinic, note, paymentData, priceData, provinceData } = this.state;
        return (
            <div className="doctor-extra-infor-container">
                <div className="content-up">
                    <div className="text-address"><FormattedMessage id="doctor-detail.extrainfor.clinic-address-title"/></div>
                    <div className="name-clinic">{nameClinic}</div>
                    <div className="detail-address">{addressClinic}</div>
                </div>
                <div className="content-down">
                    {isShowDetailPrice === false ?
                        <>
                        <div>
                            <span className="title-price"><FormattedMessage id="doctor-detail.extrainfor.price"/></span>
                            {this.props.language === LANGUAGES.VI ?
                                <NumberFormat
                                    value={priceData.valueVi}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    suffix={' VND'}
                                />
                                :
                                <NumberFormat
                                    value={priceData.valueEn}
                                    displayType={'text'}
                                    thousandSeparator={true}
                                    suffix={' USD'}
                                />
                            }
                            <span className="span-show-hide" onClick={() => this.handleShowDetailPrice()}><FormattedMessage id="doctor-detail.extrainfor.show-detail"/></span>
                        </div>
                        </>
                    :
                    <>
                        <div className="title-price"><FormattedMessage id="doctor-detail.extrainfor.price"/></div>
                        <div className="detail-price">
                            <div className="price">
                                <span className="left"><FormattedMessage id="doctor-detail.extrainfor.price"/></span>
                                <span className="right">
                                    {this.props.language === LANGUAGES.VI ?
                                        <NumberFormat
                                            value={priceData.valueVi}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            suffix={' VND'}
                                        />
                                        :
                                        <NumberFormat
                                            value={priceData.valueEn}
                                            displayType={'text'}
                                            thousandSeparator={true}
                                            suffix={' USD'}
                                        />
                                    }
                                </span>
                            </div>
                            <div className="note">
                                {note}  
                            </div>
                            <div className="payment">
                                {this.props.language === LANGUAGES.VI ? paymentData.valueVi : paymentData.valueEn}
                            </div>
                            <div className="hide-price"><span onClick={() => this.handleShowDetailPrice()}><FormattedMessage id="doctor-detail.extrainfor.hide-detail"/></span></div>
                        </div>
                        
                    </>
                    }
                     
                </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DoctorExtrainfor);
