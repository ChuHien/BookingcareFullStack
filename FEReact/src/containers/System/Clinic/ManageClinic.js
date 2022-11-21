import React, { Component } from 'react';
import { connect } from "react-redux";
import { LANGUAGES, CommonUtils} from '../../../utils'
import { FormattedMessage } from 'react-intl';
import * as actions from '../../../store/actions';
import './ManageClinic.scss';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { createClinicService } from '../../../services/clinicService';
import { toast } from 'react-toastify';

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ManageClinic extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            address: '',
            imageBase64: '',
            descriptionHTML: '',
            descriptionMarkdown: '',
        }
    }

    async componentDidMount() {
        
    }

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.language !== prevProps.language) {

        }

        if(this.props.doctorIdFromParent !== prevProps.doctorIdFromParent) {
           
        }

    }

    handleOnchangeInput = (event, id) => {
        let copyState = {...this.state};
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        })
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            descriptionMarkdown: text,
            descriptionHTML: html
        })
    }

    handleOnchangeImage = async (event) => {
        let data = event.target.files;
        let file = data[0];
        if(file){
            let base64 = await CommonUtils.getBase64(file);
            this.setState({
                imageBase64: base64
            })
        }
        
    }

    handleSaveSpecialty = async() => {
        console.log('check state', this.state)
        let res = await createClinicService({
            name: this.state.name,
            image: this.state.imageBase64,
            descriptionHTML: this.state.descriptionHTML,
            descriptionMarkdown: this.state.descriptionMarkdown,
            address: this.state.address
        })
        
        if(res && res.errCode === 0) {
            toast.success('Create clinic success');
            this.setState({
                name: '',
                imageBase64: '',
                descriptionHTML: '',
                descriptionMarkdown: '',
                address: ''
            })
        } else {
            toast.error('Somethings error...')
            console.log('check error', res.errMessage)
        }
    }

    render() {
        return (
            <div className="manage-specialty-container">
                <div className="ms-title">Quản lí chuyên khoa</div>
                <div className="add-new-specialty row">
                    <div className="col-6 form-group">
                        <label>Tên phòng khám</label>
                        <input 
                            className="form-control"
                            type="text"
                            value={this.state.name}
                            onChange={(event)=>this.handleOnchangeInput(event, 'name')}
                        />
                    </div>
                    <div className="col-6 form-group">
                        <label>Ảnh phòng khám</label>
                        <input
                            // value={this.state.imageBase64}
                            className="form-control-file"
                            type="file"
                            onChange={(event)=>this.handleOnchangeImage(event)}
                        />
                    </div>
                    <div className="col-6 form-group">
                        <label>Địa chỉ phòng khám</label>
                        <input 
                            className="form-control"
                            type="text"
                            value={this.state.address}
                            onChange={(event)=>this.handleOnchangeInput(event, 'address')}
                        />
                    </div>
                    <div className="col-12">
                        <label>Markdown</label>
                        <MdEditor 
                            style={{ height: '300px' }}
                            renderHTML={text => mdParser.render(text)} 
                            onChange={this.handleEditorChange}
                            value={this.state.descriptionMarkdown}
                        />
                    </div>
                    <div className="col-12">
                        <button 
                            className="btn-save-new-specialty"
                            onClick={()=>this.handleSaveSpecialty()}
                        >Save
                        </button>
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
        extrainforDoctor: state.admin.extrainforDoctor
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getExtrainforDoctor: (doctorId) => dispatch(actions.getExtrainforDoctor(doctorId)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageClinic);
