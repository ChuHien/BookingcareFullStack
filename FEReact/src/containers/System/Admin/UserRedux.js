import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getAllCodeService } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import * as actions from '../../../store/actions';
import './UserRedux.scss';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css'; 

class UserRedux extends Component {

    constructor(props){
        super(props);
        this.state = {
            genderArr: [],
            positionArr: [],
            roleArr: [],
            previewImgURL: '',
            isOpen: false,

            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            gender: '',
            position: '',
            role: '',
            avatar: ''
        }
    }

    async componentDidMount() {
        this.props.getGenderStart();
        this.props.getRoleStart();
        this.props.getPositionStart();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.genderRedux !== this.props.genderRedux) {
            let genderRedux = this.props.genderRedux;
            this.setState({
                genderArr: this.props.genderRedux,
                gender: genderRedux && genderRedux.length > 0 ? genderRedux[0].key : ''
            })
        }
        if (prevProps.positions !== this.props.positions) {
            let positions = this.props.positions;
            this.setState({
                positionArr: this.props.positions,
                position: positions && positions.length > 0 ? positions[0].key : ''
            })
        }
        if (prevProps.roles !== this.props.roles) {
            let roles = this.props.roles;
            this.setState({
                roleArr: this.props.roles,
                role: roles && roles.length > 0 ? roles[0].key : ''
            })
        }
    }

    handleOnChangeImage = (event) => {
        let data = event.target.files;
        let file = data[0];
        if(file){
            let objectUrl = URL.createObjectURL(file);
            this.setState({
                previewImgURL: objectUrl,
                avatar: file
            })
        }
        
    }

    handleOpenImage = () => {
        if(!this.state.previewImgURL) return;
        this.setState({
            isOpen: true,
        })
    }
    handleSaveUser = () => {
        let isValid = this.checkValidateInput();
        if(isValid === false) return;
        //fire redux action
        this.props.createNewUser({
            email: this.state.email,
            password: this.state.password,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            address: this.state.address,
            phonenumber: this.state.phoneNumber,
            gender: this.state.gender,
            roleId: this.state.role,
            positionId: this.state.position
        })
    }

    checkValidateInput = () => {
        let isValid = true;
        let arrCheck = ['email', 'password', 'firstName', 'lastName', 'phoneNumber', 'address']
        for(let i = 0; i < arrCheck.length; i++) {
            if(!this.state[arrCheck[i]]) {
                isValid = false;
                alert(' This input is required: ' +arrCheck[i]);
                break;
            }
        }
    }
    onChangeInput = (event, id) => {
        let copyState = {...this.state}
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        }, ()=>{
            console.log(this.state)
        })
    }
    render() {
        // let genderArr = this.props.genderRedux;
        let { email, password, firstName, lastName, phoneNumber, address, gender, role, position, avatar} = this.state;
        let { genderArr, roleArr, positionArr }= this.state;
        let { language, isLoadingGender } = this.props;
        return (
            <div className="user-redux-container">
                <div className="title">
                    Quản lý người dùng với React-Redux
                </div>
                <div>{isLoadingGender===true ? 'Loading genders' : ''}</div>
                <div className="user-redux-body">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 my-3"><FormattedMessage id="manage-user.add"/></div>
                            <div className="col-6">
                                <label><FormattedMessage id="manage-user.email"/></label>
                                <input 
                                    className="form-control" 
                                    type="email"
                                    value={email}
                                    onChange={(event) => this.onChangeInput(event, 'email')}
                                />
                            </div>
                            <div className="col-6">
                                <label><FormattedMessage id="manage-user.password"/></label>
                                <input 
                                    className="form-control"
                                    type="password"
                                    value={password}
                                    onChange={(event) => this.onChangeInput(event, 'password')}
                                />
                            </div>
                            <div className="col-6">
                                <label><FormattedMessage id="manage-user.first-name"/></label>
                                <input 
                                    className="form-control"
                                    type="text"
                                    value={firstName}
                                    onChange={(event) => this.onChangeInput(event, 'firstName')}
                                />
                            </div>
                            <div className="col-6">
                                <label><FormattedMessage id="manage-user.last-name"/></label>
                                <input 
                                    className="form-control"
                                    type="text"
                                    value={lastName}
                                    onChange={(event) => this.onChangeInput(event, 'lastName')}
                                />
                            </div>
                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.phone-number"/></label>
                                <input 
                                    className="form-control"
                                    type="text"
                                    value={phoneNumber}
                                    onChange={(event) => this.onChangeInput(event, 'phoneNumber')}
                                />
                            </div>
                            <div className="col-9">
                                <label><FormattedMessage id="manage-user.address"/></label>
                                <input 
                                    className="form-control"
                                    type="text"
                                    value={address}
                                    onChange={(event) => this.onChangeInput(event, 'address')}
                                />
                            </div>
                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.gender"/></label>
                                <select class="form-control"
                                        onChange={(event) => this.onChangeInput(event, 'gender')}
                                >
                                    {genderArr && genderArr.length > 0 &&
                                    genderArr.map((item, index) => {
                                        return (
                                            <option key={index} value={item.key}>
                                                {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                            </option>
                                        )
                                    })}
                                </select>
                            </div>
                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.position"/></label>
                                <select class="form-control"
                                        onChange={(event) => this.onChangeInput(event, 'position')}
                                >
                                    {positionArr && positionArr.length > 0 &&
                                    positionArr.map((item, index) => {
                                        return (
                                            <option key={index} value={item.key}>
                                                {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                            </option>
                                        )
                                    })}
                                </select>
                            </div>
                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.role"/></label>
                                <select class="form-control"
                                onChange={(event) => this.onChangeInput(event, 'role')}
                                >
                                    {roleArr && roleArr.length > 0 &&
                                    roleArr.map((item, index) => {
                                        return (
                                            <option key={index} value={item.key}>
                                                {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                            </option>
                                        )
                                    })}
                                </select>
                            </div>
                            <div className="col-3">
                                <label><FormattedMessage id="manage-user.image"/></label>
                                <div className="img-preview-container">
                                    <input 
                                        id="previewImg"
                                        type="file" 
                                        hidden
                                        onChange={(event) => this.handleOnChangeImage(event)}/>
                                    <label htmlFor="previewImg" className="label-upload">upload image<i className="fas fa-upload"></i></label>
                                    <div className="preview-image"
                                        style = {{backgroundImage: `url(${this.state.previewImgURL})`}}
                                        onClick={() => this.handleOpenImage()}
                                    >
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 mt-3">
                                <button 
                                    className="btn btn-primary"
                                    onClick={()=> this.handleSaveUser()}
                                ><FormattedMessage id="manage-user.save"/></button>
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.isOpen === true &&
                    <Lightbox
                        mainSrc={this.state.previewImgURL}
                        onCloseRequest={() => this.setState({ isOpen: false })}
                    />
                }
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        genderRedux: state.admin.genders,
        isLoadingGender: state.admin.isLoadingGender,
        positions: state.admin.positions,
        roles: state.admin.roles
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        getPositionStart: () => dispatch(actions.fetchPositionStart()),
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
        createNewUser: (data) => dispatch(actions.createNewUser(data))
        // processLogout: () => dispatch(actions.processLogout()),
        // changeLanguage: (language) => dispatch(actions.changeLanguageApp(language))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
