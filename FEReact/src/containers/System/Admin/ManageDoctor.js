import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getAllCodeService } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import * as actions from '../../../store/actions';
import './ManageDoctor.scss'
import 'react-image-lightbox/style.css';

import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import Select from 'react-select';
import { getDetailDoctorService } from '../../../services/userService';
import { CRUD_ACTIONS } from '../../../utils';
import { toast } from 'react-toastify';
import {getAllSpecialtyService} from '../../../services/specialtyService'

const mdParser = new MarkdownIt(/* Markdown-it options */);

// Finish!

class ManageDoctor extends Component {

    constructor(props){
        super(props);
        this.state = {

            // save markdown
            contentMarkdown: '',
            contentHTML: '',
            selectedDoctor: '',
            description: '',
            listDoctors: [],
            specialties: [],
            action: CRUD_ACTIONS.CREATE,

            // save to doctor info
            listPrice: [],
            listPayment: [],
            listProvince: [],
            listSpecialty: [],
            listClinic: [],

            selectedPrice: '',
            selectedPayment: '',
            selectedProvince: '',
            selectedSpecialty: '',
            selectedClinic: '',

            nameClinic: '',
            addressClinic: '',
            note: '',
            clinicId: '',
            specialtyId: '', 
        }
    }

    async componentDidMount() {
        this.props.fetchAllDoctors();
        this.props.getDoctorPrices();
        this.props.getPayments();
        this.props.getProvinces();
        let res = await getAllSpecialtyService();
        if (res && res.errCode === 0) {
            this.setState({
                specialties: res.data ? res.data : []
            })
        }
    }

    buildDataInputSelect = (inputData, type) => {
        let result = [];
        let language = this.props.language;
        
        if(inputData && inputData.length > 0) {
            if(type === 'USER') {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.lastName} ${item.firstName}`;
                    let labelEn = `${item.firstName} ${item.lastName}`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.id;
                    result.push(object)
                })
                return result;
            }

            if (type === 'PRICE') {
                inputData.map((item, index) => {
                    let object = {};
                    let labelVi = `${item.valueVi} VND`;
                    let labelEn = `${item.valueEn} USD`;
                    object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                    object.value = item.keyMap;
                    result.push(object)
                })
                return result;
            }
            if(type === 'SPECIALTY') {
                inputData.map((item, index) => {
                    let object = {};
                    object.label = item.name;
                    object.value = item.id;
                    result.push(object)
                })
            }
            inputData.map((item, index) => {
                let object = {};
                let labelVi = item.valueVi;
                let labelEn = item.valueEn;
                object.label = language === LANGUAGES.VI ? labelVi : labelEn;
                object.value = item.keyMap;
                result.push(object)
            })
        }
        return result;
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.allDoctors !== this.props.allDoctors) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USER');
            this.setState({
                listDoctors: dataSelect
            })
        }

        if (prevProps.allDoctorPrices !== this.props.allDoctorPrices) {
            let dataSelectPrice = this.buildDataInputSelect(this.props.allDoctorPrices, 'PRICE')
            this.setState({
                listPrice: dataSelectPrice
            })
        }

        if (prevProps.allProvinces !== this.props.allProvinces) {
            let dataSelectProvince = this.buildDataInputSelect(this.props.allProvinces)
            this.setState({
                listProvince: dataSelectProvince
            })
        }

        if (prevProps.allPayments !== this.props.allPayments) {
            let dataSelectPayment = this.buildDataInputSelect(this.props.allPayments)
            this.setState({
                listPayment: dataSelectPayment
            })
        }

        if (this.state.specialties !== prevState.specialties) {
            let dataSelectSpecialty = this.buildDataInputSelect(this.state.specialties, 'SPECIALTY');
            this.setState({
                listSpecialty: dataSelectSpecialty
            })
        }

        if (prevProps.language !== this.props.language) {
            let dataSelect = this.buildDataInputSelect(this.props.allDoctors, 'USER');
            let dataSelectPrice = this.buildDataInputSelect(this.props.allDoctorPrices, 'PRICE');
            let dataSelectProvince = this.buildDataInputSelect(this.props.allProvinces)
            let dataSelectPayment = this.buildDataInputSelect(this.props.allPayments);
            let dataSelectSpecialty = this.buildDataInputSelect(this.state.specialties, 'SPECIALTY');
            this.setState({
                listDoctors: dataSelect,
                listPrice: dataSelectPrice,
                listProvince: dataSelectProvince,
                listPayment: dataSelectPayment,
                listSpecialty: dataSelectSpecialty
            })
        }
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown: text,
            contentHTML: html
        })
    }
    
    handleSaveContentDoctor = () => {
        if(!this.state.selectedPrice.value) {
            toast.error('Missing param price');
            return;
        }

        if(!this.state.selectedPayment.value) {
            toast.error('Missing param payment');
            return;
        }

        if(!this.state.selectedProvince.value) {
            toast.error('Missing param province');
            return;
        }

        if(!this.state.nameClinic) {
            toast.error('Missing param name clinic');
            return;
        }

        if(!this.state.addressClinic) {
            toast.error('Missing param address clinic');
            return;
        }

        if(!this.state.selectedSpecialty.value) {
            toast.error('Missing param specialty');
            return;
        }
        
        let data = {
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
            description: this.state.description,
            id: this.state.selectedDoctor.value,
            priceId: this.state.selectedPrice.value,
            paymentId: this.state.selectedPayment.value,
            provinceId: this.state.selectedProvince.value,
            nameClinic: this.state.nameClinic,
            addressClinic: this.state.addressClinic,
            note: this.state.note,
            clinicId: this.state.selectedClinic && this.state.selectedClinic.value ? this.state.selectedClinic.value : '',
            specialtyId: this.state.selectedSpecialty.value,
        }
        if(this.state.action === CRUD_ACTIONS.CREATE) {
            this.props.saveInforDoctor(data);
        }

        if(this.state.action === CRUD_ACTIONS.EDIT) {
            this.props.updateInforDoctor(data);
        }
        this.setState({
            contentMarkdown: '',
            contentHTML: '',
            selectedDoctor: '',
            description: '',
            action: CRUD_ACTIONS.CREATE,
            selectedPrice: '',
            selectedPayment: '',
            selectedProvince: '',
            nameClinic: '',
            addressClinic: '',
            note: '',
            selectedSpecialty: '',
            selectedClinic: ''
        })
    }

    handleChange = async (selectedDoctor) => {
        let res = await getDetailDoctorService(selectedDoctor.value);
        let { listPayment, listPrice, listProvince, listClinic, listSpecialty } = this.state;
        if(res && res.errCode === 0 && res.data && res.data.Markdown) {
            let markdown = res.data.Markdown;
            let addressClinic = '', nameClinic = '', note = '', paymentId = '', priceId = '', provinceId = '', specialtyId = '', clinicId = '';
            let selectedPayment = '', selectedPrice = '', selectedProvince = '', selectedSpecialty = '', selectedClinic = '';
            
            if(res.data.Doctor_Infor) {
                let doctor_Infor = res.data.Doctor_Infor;
                addressClinic = doctor_Infor.addressClinic;
                nameClinic = doctor_Infor.nameClinic;
                note = doctor_Infor.note;
                priceId = doctor_Infor.priceId;
                paymentId = doctor_Infor.paymentId;
                provinceId = doctor_Infor.provinceId;
                specialtyId = doctor_Infor.specialtyId;
                clinicId = doctor_Infor.clinicId;
                selectedPayment = listPayment.find(item => {
                    if(item.value === paymentId) return item
                })
                selectedPrice = listPrice.find(item => {
                    if(item.value === priceId) return item
                })
                selectedProvince = listProvince.find(item => {
                    if(item.value === provinceId) return item
                })
                selectedSpecialty = listSpecialty.find(item => {
                    if(item.value === specialtyId) return item
                })
                selectedClinic = listClinic.find(item => {
                    if(item.value === clinicId) return item
                })
            }
            this.setState({
                contentMarkdown: markdown.contentMarkdown,
                contentHTML: markdown.contentHTML,
                description: markdown.description,
                action: CRUD_ACTIONS.EDIT,
                selectedDoctor: selectedDoctor,
                addressClinic: addressClinic,
                nameClinic: nameClinic,
                note: note,
                selectedPrice: selectedPrice,
                selectedPayment: selectedPayment,
                selectedProvince: selectedProvince,
                selectedClinic: selectedClinic,
                selectedSpecialty: selectedSpecialty,
            })
        } else {
            this.setState({
                contentMarkdown: '',
                contentHTML: '',
                description: '',
                action: CRUD_ACTIONS.CREATE,
                selectedDoctor: selectedDoctor,
                addressClinic: '',
                nameClinic: '',
                note: '',
                selectedPrice: '',
                selectedPayment: '',
                selectedProvince: '',
            })
        }
    };
    
    handleOnChangeText = (event, id) => {
        let copyState = {...this.state};
        copyState[id] = event.target.value
        this.setState({
            ...copyState
        })
    }

    handleChangeDoctorInfor = async (selectedOption, name) => {
        let stateName = name.name;
        let stateCopy = {...this.state};
        stateCopy[stateName] = selectedOption;
        this.setState({
            ...stateCopy
        })
    }

    render() {
        const { selectedDoctor, selectedPrice, selectedPayment, selectedProvince, selectedSpecialty, selectedClinic } = this.state;
        return (
            <div className="manage-doctor-container">
                <div className="manage-doctor-title">
                    <FormattedMessage id="admin.manage-doctor.title"/>
                </div>
                <div className="more-infor">
                    <div className="content-left form-group">
                    <label><FormattedMessage id="admin.manage-doctor.choose-doctor"/></label>
                        <Select
                            value={selectedDoctor}
                            onChange={this.handleChange}
                            options={this.state.listDoctors}
                            placeholder={<FormattedMessage id="admin.manage-doctor.choose-doctor"/>}
                        />
                    </div>
                    <div className="content-right form-group">
                        <label><FormattedMessage id="admin.manage-doctor.introduction-infor"/></label>
                        <textarea 
                            className="form-control" 
                            rows = "4"
                            onChange={(event) => {this.handleOnChangeText(event, 'description')}}
                            value={this.state.description}
                        >
                        </textarea>
                    </div>
                </div>
                <div className="more-infor-extra row">
                    <div className="col-4 form-group">
                        <label><FormattedMessage id="admin.manage-doctor.price"/></label>
                        <Select
                            value={selectedPrice}
                            onChange={this.handleChangeDoctorInfor}
                            options={this.state.listPrice}
                            placeholder={<FormattedMessage id="admin.manage-doctor.price"/>}
                            name = "selectedPrice"
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label><FormattedMessage id="admin.manage-doctor.payment"/></label>
                        <Select
                            value={selectedPayment}
                            onChange={this.handleChangeDoctorInfor}
                            options={this.state.listPayment}
                            placeholder={<FormattedMessage id="admin.manage-doctor.payment"/>}
                            name = "selectedPayment"
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label><FormattedMessage id="admin.manage-doctor.province"/></label>
                        <Select
                            value={selectedProvince}
                            onChange={this.handleChangeDoctorInfor}
                            options={this.state.listProvince}
                            placeholder={<FormattedMessage id="admin.manage-doctor.province"/>}
                            name = "selectedProvince"
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label><FormattedMessage id="admin.manage-doctor.clinic"/></label>
                        <input 
                            className="form-control"
                            onChange={(event) => {this.handleOnChangeText(event, 'nameClinic')}}
                            value={this.state.nameClinic}
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label><FormattedMessage id="admin.manage-doctor.clinic-address"/></label>
                        <input 
                            className="form-control"
                            value={this.state.addressClinic}
                            onChange={(event) => {this.handleOnChangeText(event, 'addressClinic')}}
                        />
                    </div>
                    <div className="col-4 form-group">
                        <label><FormattedMessage id="admin.manage-doctor.note"/></label>
                        <input 
                            className="form-control"
                            value={this.state.note}
                            onChange={(event) => {this.handleOnChangeText(event, 'note')}}
                        />
                    </div>
                    <div className="col-6 form-group">
                        <label><FormattedMessage id="admin.manage-doctor.specialty"/></label>
                        <Select
                            value={selectedSpecialty}
                            onChange={this.handleChangeDoctorInfor}
                            options={this.state.listSpecialty}
                            placeholder={<FormattedMessage id="admin.manage-doctor.specialty"/>}
                            name = "selectedSpecialty"
                        />
                    </div>
                    <div className="col-6 form-group">
                        <label><FormattedMessage id="admin.manage-doctor.choose-clinic"/></label>
                        <Select
                            value={selectedClinic}
                            onChange={this.handleChangeDoctorInfor}
                            options={this.state.listClinic}
                            placeholder={<FormattedMessage id="admin.manage-doctor.choose-clinic"/>}
                            name = "selectedClinic"
                        />
                    </div>
                </div>
                <div className="manage-doctor-editor">
                    <label><FormattedMessage id="admin.manage-doctor.specialized-infor"/></label>
                    <MdEditor 
                        style={{ height: '500px' }}
                        renderHTML={text => mdParser.render(text)} 
                        onChange={this.handleEditorChange}
                        value={this.state.contentMarkdown}
                    />
                </div>
                <button 
                    className="save-content-doctor"
                    onClick={() => this.handleSaveContentDoctor()}
                >
                {this.state.action === CRUD_ACTIONS.CREATE ? <FormattedMessage id="admin.manage-doctor.save"/> : <FormattedMessage id="admin.manage-doctor.change"/>}
                </button>
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        users: state.admin.users,
        allDoctors: state.admin.allDoctors,
        allDoctorPrices: state.admin.allDoctorPrices,
        allProvinces: state.admin.allProvinces,
        allPayments: state.admin.allPayments,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        saveInforDoctor: (data) => dispatch(actions.saveInforDoctor(data)),
        updateInforDoctor: (data) => dispatch(actions.updateInforDoctor(data)),
        getDoctorPrices: () => dispatch(actions.getDoctorPrices()),
        getProvinces: () => dispatch(actions.getProvinces()),
        getPayments: () => dispatch(actions.getPayments()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
