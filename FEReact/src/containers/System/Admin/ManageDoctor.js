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

const mdParser = new MarkdownIt(/* Markdown-it options */);

// Finish!

class ManageDoctor extends Component {

    constructor(props){
        super(props);
        this.state = {
            contentMarkdown: '',
            contentHTML: '',
            selectedDoctor: '',
            description: '',
            listDoctors: [],
            action: CRUD_ACTIONS.CREATE
        }
    }

    async componentDidMount() {
        this.props.fetchAllDoctors()
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
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown: text,
            contentHTML: html
        })
    }
    
    handleSaveContentDoctor = () => {
        let data = {
            contentHTML: this.state.contentHTML,
            contentMarkdown: this.state.contentMarkdown,
            description: this.state.description,
            id: this.state.selectedDoctor.value
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
            action: CRUD_ACTIONS.CREATE
        })
    }

    handleChange = async (selectedDoctor) => {
        let res = await getDetailDoctorService(selectedDoctor.value);
        if(res && res.errCode === 0 && res.data && res.data.Markdown) {
            let markdown = res.data.Markdown;
            this.setState({
                contentMarkdown: markdown.contentMarkdown,
                contentHTML: markdown.contentHTML,
                description: markdown.description,
                action: CRUD_ACTIONS.EDIT,
                selectedDoctor: selectedDoctor
            })
        } else {
            this.setState({
                contentMarkdown: '',
                contentHTML: '',
                description: '',
                action: CRUD_ACTIONS.CREATE,
                selectedDoctor: selectedDoctor
            })
        }
    };
    
    handleOnChangeDesc = (event) => {
        this.setState({
            description: event.target.value
        })
    }
    render() {
        const { selectedDoctor, listDoctors } = this.state;
        return (
            <div className="manage-doctor-container">
                <div className="manage-doctor-title">
                    Manage Doctor
                    
                </div>
                <div className="more-infor">
                    <div className="content-left form-group">
                    <label>Chon bac si</label>
                        <Select
                            value={selectedDoctor}
                            onChange={this.handleChange}
                            options={this.state.listDoctors}
                        />
                    </div>
                    <div className="content-right form-group">
                        <label>Thong tin  gioi thieu</label>
                        <textarea 
                            className="form-control" 
                            rows = "4"
                            onChange={(event) => {this.handleOnChangeDesc(event)}}
                            value={this.state.description}
                        >
                        </textarea>
                    </div>
                </div>
                <div className="manage-doctor-editor">
                    <label>Markdown doctor</label>
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
                {this.state.action === CRUD_ACTIONS.CREATE ? 'Save' : 'Edit'}
                </button>
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        users: state.admin.users,
        allDoctors: state.admin.allDoctors
    };
};

const mapDispatchToProps = dispatch => {
    return {
        fetchAllDoctors: () => dispatch(actions.fetchAllDoctors()),
        saveInforDoctor: (data) => dispatch(actions.saveInforDoctor(data)),
        updateInforDoctor: (data) => dispatch(actions.updateInforDoctor(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
