import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import './Login.scss';
import { FormattedMessage } from 'react-intl';
import { handleLoginAPI }from "../../services/userService"

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            showPassword: false,
            errMessage: ''
        }
    }

    handleOnChangeUsername = (event) => {
        this.setState({
            username: event.target.value
        })
    }

    handleOnChangePassword = (event) => {
        this.setState({
            password: event.target.value
        })
    }

    handleLoginButton = async () => {
        this.setState({
            errMessage: ''
        })
        try {
            let data = await handleLoginAPI(this.state.username, this.state.password);
            if(data && data.errCode !== 0) {
                this.setState({
                    errMessage: data.message
                })
            }
            if(data && data.errCode === 0) {
                this.props.userLoginSuccess(data.user)
            }
        } catch (err) {
            if(err.response) {
                if(err.response.data) {
                    this.setState({
                        errMessage: err.response.data.message
                    })
                }
            }
        }
    }

    handleShowHidePassword = () => {
        this.setState({
            showPassword: !this.state.showPassword
        })
    }

    handleKeyDown = (event) => {
        if(event.key === 'Enter' || event.key === 13) {
            this.handleLoginButton()
        }
    }
    render() {
        let showPassword = this.state.showPassword;
        return (
            <div className="login-background">
                <div className="login-container">
                    <div className="login-content">
                        <div className="col-12 text-login">Login</div>
                        <div className="col-12 form-group login-input">
                            <label>Username</label>
                            <input 
                                type="text"
                                className="form-control"
                                placeholder="Enter your username"
                                value={this.state.username}
                                onChange={(event)=>this.handleOnChangeUsername(event)}
                            />
                        </div>
                        <div className="col-12 form-group login-input">
                            <label>Password</label>
                            <div className="custom-input-password">
                                <input 
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-control"
                                    placeholder="Enter your password"
                                    value={this.state.password}
                                    onChange={(event)=>this.handleOnChangePassword(event)}
                                    onKeyDown={(event) => this.handleKeyDown(event)}
                                />
                                <span onClick={()=>this.handleShowHidePassword()}>
                                    <i className={showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'}></i>
                                </span>
                            </div>
                        </div>
                        <div className="col-12" style={{ color: 'red'}}>
                            {this.state.errMessage}
                        </div>
                        <div className="col-12">
                            <button 
                                className="btn-login"
                                onClick={()=>this.handleLoginButton()}
                            >Login</button>
                        </div>
                        <div className="col-12">
                            <span className="forgot-password">Forgot your password</span>
                        </div>
                        <div className="col-12 text-center mt-3">
                            <span className="text-or-login">Or Login with</span>
                        </div>
                        <div className="col-12 social-login">
                            <i className="fab fa-google-plus-g google"></i>
                            <i className="fab fa-facebook-f facebook"></i>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
        // adminLoginFail: () => dispatch(actions.adminLoginFail()),
        userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
