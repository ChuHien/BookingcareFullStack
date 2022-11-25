import React, { Component } from 'react';
import { connect } from "react-redux";
import './RemedyModal.scss'
import { LANGUAGES, CommonUtils } from '../../../utils'
import { FormattedMessage } from 'react-intl';
import * as actions from '../../../store/actions';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Select from 'react-select'
import _ from 'lodash';
import {toast} from 'react-toastify';
import moment from 'moment';

class RemedyModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            imgBase64: ''
        }
    }

    async componentDidMount() {
        if(this.props.dataModal) {
            this.setState({
                email: this.props.dataModal.email
            })
        }
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.dataModal !== prevProps.dataModal) {
            this.setState({
                email: this.props.dataModal.email
            })
        }

    }

    handleOnChangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if(file){
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imgBase64: base64
            })
        }
    }

    handleOnChangeEmail = (event) => {
        this.setState({
            email: event.target.value
        })
    }

    sendRemedy = ()  => {
        this.props.sendRemedy(this.state)
    }

    render() {

        let {isOpenModal, closeRemedyModal, dataModal, sendRemedy} = this.props;

        return (
            <>
            <Modal isOpen={isOpenModal} 
                className={'remedy-modal-container'}
                size="md"
                centered
                // backdrop={true}
            >
            <div className="modal-header">
                <h5 className='modal-title'>Gửi hóa đơn khám bệnh thành công</h5>
                <button type="button" className="close" aria-label="close">
                    <span aria-hidden="true" onClick={closeRemedyModal}>x</span>
                </button>
            </div>
            <ModalBody>
                <div className="row">
                    <div className="col-6 form-group">
                        <label>Email bệnh nhân</label>
                        <input type="email" className="form-control" value={this.state.email} onChange={(event)=>this.handleOnChangeEmail(event)}/>
                    </div>
                    <div className="col-6 form-group">
                        <label>Chọn file đơn thuốc</label>
                        <input type="file" className="form-control-file" onChange={(event)=>this.handleOnChangeImage(event)}/>
                    </div>
                </div>

            </ModalBody>
            <ModalFooter>
            <Button color="primary" onClick={()=>this.sendRemedy()}>Send</Button>{' '}
            <Button color="secondary" onClick={closeRemedyModal}>Cancel</Button>
            </ModalFooter>
        </Modal>
        </>
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

export default connect(mapStateToProps, mapDispatchToProps)(RemedyModal);
