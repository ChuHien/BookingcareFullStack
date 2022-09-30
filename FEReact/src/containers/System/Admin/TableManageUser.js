import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getAllCodeService } from '../../../services/userService';
import { LANGUAGES } from '../../../utils';
import * as actions from '../../../store/actions';
import './TableManageUser.scss'
import 'react-image-lightbox/style.css';

import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';

// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

// Finish!
function handleEditorChange({ html, text }) {
  console.log('handleEditorChange', html, text);
}

class TableManageUser extends Component {

    constructor(props){
        super(props);
        this.state = {
           users: []
        }
    }

    async componentDidMount() {
        this.props.getAllUser();
    }

    componentDidUpdate(prevState, prevProps) {
        if(prevProps.users !== this.props.users) {
            this.setState({
                users: this.props.users
            })
        }
    }

    handleDeleteUser = (user) => {
        this.props.deleteUser(user.id);
    }

    handleEditUser = (user) => {
        this.props.handleEditUserFromParent(user)
    }
    render() {
        let users = this.state.users
        return (
            <React.Fragment>
                <div className="users-container">
                    <div className="title text-center">Manage Users</div>
                    <div className="users-table mt-3 mx-1">
                        <table id="customers">
                            <tbody>
                                <tr>
                                    <th>No</th>
                                    <th>Email</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Adress</th>
                                    <th>Actions</th>
                                </tr>
                                {
                                    users && users.map((item, index) => {
                                        return (
                                            <tr>
                                                <td>{index+1}</td>
                                                <td>{item.email}</td>
                                                <td>{item.firstName}</td>
                                                <td>{item.lastName}</td>
                                                <td>{item.address}</td>
                                                <td>
                                                    <button className="btn-edit" onClick={() => this.handleEditUser(item)}><i className="fas fa-pencil-alt"></i></button>
                                                    <button className="btn-delete" onClick={()=>this.handleDeleteUser(item)}><i className="fas fa-trash"></i></button>
                                                </td>
                                            </tr>
                                            )
                                        })
                                }
                            </tbody>
                        </table>
                    </div>

                </div>
                <MdEditor style={{ height: '500px' }} renderHTML={text => mdParser.render(text)} onChange={handleEditorChange} />
            </React.Fragment>
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

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
