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

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' },
];

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
        }
    }

    async componentDidMount() {
       
    }

    componentDidUpdate(prevState, prevProps) {
        
    }

    handleEditorChange = ({ html, text }) => {
        this.setState({
            contentMarkdown: text,
            contentHTML: html
        })
    }
    
    handleSaveContentDoctor = () => {
        console.log('check state', this.state);
    }

    handleChange = (selectedDoctor) => {
        this.setState({ selectedDoctor }, () =>
            console.log(`Option selected:`, this.state.selectedDoctor)
        );
    };
    
    handleOnChangeDesc = (event) => {
        this.setState({
            description: event.target.value
        })
    }
    render() {
        const { selectedDoctor } = this.state;
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
                            options={options}
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
                        onChange={this.handleEditorChange} />
                </div>
                <button 
                    className="save-content-doctor"
                    onClick={() => this.handleSaveContentDoctor()}
                >
                    Save
                </button>
            </div>
        )
    }

}

const mapStateToProps = state => {
    return {
        language: state.app.language,
        users: state.admin.users
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getAllUser: () => dispatch(actions.getAllUser()),
        deleteUser: (userId) => dispatch(actions.deleteUser(userId)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
