import React, { Component } from 'react';
import { connect } from 'react-redux';
import './UserManage.scss';
import { getAllUsers, createNewUserService, deleteUserService, editUserService } from "../../services/userService";
import ModalUser from './ModalUser';
import ModalEditUser from './ModalEditUser';
import { emitter } from '../../utils/emitter';

class UserManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
            isOpenModalUser: false,
            isOpenModalEditUser: false,
            editUser: ''
        }
    }

    async componentDidMount() {
        await this.getAllUsersFromReact();
    }

    getAllUsersFromReact = async () => {
        try {
            let response = await getAllUsers('ALL');
            if(response && response.errCode === 0) {
                this.setState({
                    arrUsers: response.users
                })
            }
        } catch (e) {
            console.log(e);
        }
    }
    handleAddNewUser = () => {
        this.setState({
            isOpenModalUser: true
        })
    }

    toggleUserModal = () => {
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser
        })
    }

    toggleEditUserModal = () => {
        this.setState({
            isOpenModalEditUser: !this.state.isOpenModalEditUser
        })
    }

    createNewUser = async(data) => {
        try {
            let respone = await createNewUserService(data);
            if(respone && respone.errCode !== 0) {
                alert(respone.errMessage)
            } else {
                await this.getAllUsersFromReact()
                this.setState({
                    isOpenModalUser: false
                })
                emitter.emit('EVENT_CLEAR_MODAL_DATA')
            }
        } catch (e) {
            console.log(e)
        }
    }

    handleDeleteUser = async (user) => {
        try {
            let respone = await deleteUserService(user.id);
            if(respone && respone.errCode !== 0) {
                console.log(respone.errMessage)
            } else {
                await this.getAllUsersFromReact()
            }
        } catch (e) {
            console.log(e)
        }
    }

    handleEditUser = (data) => {
        this.setState({
            isOpenModalEditUser: true,
            editUser: data
        })
    }

    editUser = async (data) => {
        try {
            let respone = await editUserService(data);
            if(respone && respone.errCode !== 0) {
                alert(respone.errMessage)
            } else {
                await this.getAllUsersFromReact()
                this.setState({
                    isOpenModalEditUser: false
                })
            }

        } catch (e) {
            console.log(e)
        }
    }
    /**Life cycle
     * Run component:
     * 1. Run construct -> init state
     * 2. Did mount (set state) => goi API => lay gia tri => set state: born >< unmount
     * 3. Render (re-render = render again)
     * 
     */
    render() {
        let arrUsers = this.state.arrUsers;
        return (
            <div className="users-container">
                <ModalUser
                    isOpen = {this.state.isOpenModalUser}
                    toggle = {this.toggleUserModal}
                    createNewUser= {this.createNewUser}
                />
                {this.state.isOpenModalEditUser &&
                    <ModalEditUser
                        isOpen = {this.state.isOpenModalEditUser}
                        toggle = {this.toggleEditUserModal}
                        editUser = {this.state.editUser}
                        editAUser= {this.editUser}
                    />
                }
                <div className="title text-center">Manage Users</div>
                <div className="mx-1">
                    <button 
                        className="btn btn-primary px-3"
                        onClick={()=>this.handleAddNewUser()}
                    >
                        <i className="fas fa-plus"></i>
                    Add new user
                    </button>
                </div>
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
                                arrUsers && arrUsers.map((item, index) => {
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
        );
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
