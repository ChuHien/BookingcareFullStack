import React, { Component } from 'react';
import { connect } from "react-redux";
import { LANGUAGES } from '../../../utils'
import { FormattedMessage } from 'react-intl';
import * as actions from '../../../store/actions';
import HomeHeader from '../../HomePage/HomeHeader';
import DoctorSchedule from '../../Patient/Doctor/DoctorSchedule';
import DoctorExtrainfor from '../../Patient/Doctor/DoctorExtrainfor'
import './DetailClinic.scss';
import ProfileDoctor from '../../Patient/Doctor/ProfileDoctor';
import _ from 'lodash';
import { getClinicByIdService } from '../../../services/clinicService';

class DetailClinic extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrDoctorId: [],
            DetailClinic: {},
            listProvince: [],
            location: 'ALL',
            id: ''
        }
    }

    async componentDidMount() {
        this.props.getProvinces();
        if(this.props.match && this.props.match.params.id) {
            let id = this.props.match.params.id;
            this.setState({
                id: id
            })
            this.setDetailClinic(id, 'ALL')
        }
    }

    setDetailClinic = async (id, location) => {
        let res = await getClinicByIdService({
                id: id,
                location: location
            });
            if(res && res.errCode === 0) {
                let data = res.data;
                let arrDoctorId = [];
                if(data && !_.isEmpty(data)) {
                    let arr = data.doctorClinic;
                    if(arr && arr.length > 0) {
                        arr.map(item => {
                            arrDoctorId.push(item.doctorId)
                        })
                    }
                }
                this.setState({
                    DetailClinic: res.data ? res.data : {},
                    arrDoctorId: arrDoctorId
                })
            }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.language !== prevProps.language) {

        }

        if(this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
           
        }

        if (prevProps.allProvinces !== this.props.allProvinces) {
            this.setState({
                listProvince: this.props.allProvinces
            })
        }

        if(prevState.location !== this.state.location) {
            this.setState({
                location: this.state.location
            })
            this.setDetailClinic(this.state.id, this.state.location)
        }

    }

    handleOnchangeSelect = (event) => {
        this.setState({
            location: event.target.value
        })
        console.log(event.target.value)
    }

    render() {
        let {arrDoctorId, DetailClinic, listProvince} = this.state;
        let language = this.props.language;
        return (
            <>
                <div className="detail-specialty-container">
                    <HomeHeader/>
                    
                    <div className="detail-specialty-body">
                        <div className="specialty-description">
                            {DetailClinic && !_.isEmpty(DetailClinic) &&
                                <div dangerouslySetInnerHTML={{__html: DetailClinic.descriptionHTML}}></div>
                            }
                        </div>
                        <div className="search-sp-doctor">
                            <select onChange={(event) => this.handleOnchangeSelect(event)}>
                                <option value='ALL' key= '0' selected>{language === LANGUAGES.VI ? 'Toàn quốc' : 'Nationwide'}</option>
                                {listProvince && listProvince.length > 0 && 
                                    listProvince.map((item, index) => {
                                        return(
                                            <option value={item.keyMap} key={index+1}>{language === LANGUAGES.VI ? item.valueVi : item.valueEn }</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        {arrDoctorId && arrDoctorId.length > 0 && arrDoctorId.map((item, index)=>{
                            return (
                                <div className="each-doctor">
                                    <div className="dt-content-left">
                                        <div className="profile-doctor">
                                            <ProfileDoctor 
                                                doctorId = {item}
                                                isShowDescription = {true}
                                                // dataTime = {dataTime}
                                                isShowLink={true}
                                                isShowPrice={false}
                                            />
                                        </div>
                                    </div>
                                    <div className="dt-content-right">
                                        <div className="doctor-schedule">
                                        <DoctorSchedule 
                                            doctorIdFromParent = {item}
                                            key ={index}
                                        />
                                        </div>
                                        <div className="doctor-extra-infor">
                                        <DoctorExtrainfor
                                            doctorIdFromParent = {item}
                                        />
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    
                </div>
               
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        extrainforDoctor: state.admin.extrainforDoctor,
        allProvinces: state.admin.allProvinces,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getExtrainforDoctor: (doctorId) => dispatch(actions.getExtrainforDoctor(doctorId)),
        getProvinces: () => dispatch(actions.getProvinces()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailClinic);
