import React, { Component } from 'react';
import { connect } from 'react-redux';
import './HomeHeader.scss';
import { FormattedMessage } from 'react-intl';
import {LANGUAGES} from '../../utils'
import { changeLanguageApp } from '../../store/actions';
import {withRouter} from 'react-router'

class HomeHeader extends Component {

    changeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language);
        //fire redux event: actions
    }

    returnToHome = () => {
        if (this.props.history) {
            this.props.history.push('/home');
        }
    }

    render() {
        let isShowBanner = this.props.isShowBanner;
        let language = this.props.language;
        return (
            <React.Fragment>
            <div className="home-header-container">
                <div className="home-header-content">
                    <div className="left-content">
                        <i className="fas fa-bars"></i>
                        <div className="header-logo" onClick={()=> this.returnToHome()}></div>
                    </div>
                    <div className="center-content">
                        <div className="child-content">
                            <div><b><FormattedMessage id="homeheader.specialty"/></b></div>
                            <div className="sub-title"><FormattedMessage id="homeheader.search-doctor"/></div>
                        </div>
                        <div className="child-content">
                            <div><b><FormattedMessage id="homeheader.health-facility"/></b></div>
                            <div className="sub-title"><FormattedMessage id="homeheader.choose-hospital-clinic"/></div>
                        </div>
                        <div className="child-content">
                            <div><b><FormattedMessage id="homeheader.doctor"/></b></div>
                            <div className="sub-title"><FormattedMessage id="homeheader.choose-good-doctor"/></div>
                        </div>
                        <div className="child-content">
                            <div><b><FormattedMessage id="homeheader.medical-package"/></b></div>
                            <div className="sub-title"><FormattedMessage id="homeheader.genaral-health-check"/></div>
                        </div>
                    </div>
                    <div className="right-content">
                        <div className="support"><i className="fas fa-question"></i><FormattedMessage id="homeheader.support"/></div>
                        <div className={language === LANGUAGES.VI ? 'language-vi active': 'language-vi'}><span onClick={()=>this.changeLanguage(LANGUAGES.VI)}>VI</span></div>
                        <div className={language === LANGUAGES.EN ? 'language-en active': 'language-en'}><span onClick={()=>this.changeLanguage(LANGUAGES.EN)}>EN</span></div>
                    </div>
                </div>
            </div>
            {isShowBanner === true &&
            <div className="home-header-banner">
                <div className="content-up">
                    <div className="title1"><FormattedMessage id="banner.title1"/></div>
                    <div className="title2"><FormattedMessage id="banner.title2"/></div>
                    <div className="search">
                        <i className="fas fa-search"></i>
                        <input type="text" placeholder="search"/>
                    </div>
                </div>
                <div className="content-down">
                    <div className="option">
                        <div className="option-child">
                            <div className="icon-child"><i className="fas fa-hospital"></i></div>
                            <div className="text-child"><FormattedMessage id="banner.child1"/></div>
                        </div>
                        <div className="option-child">
                            <div className="icon-child"><i className="fas fa-mobile-alt"></i></div>
                            <div className="text-child"><FormattedMessage id="banner.child2"/></div>
                        </div>
                        <div className="option-child">
                            <div className="icon-child"><i className="fas fa-procedures"></i></div>
                            <div className="text-child"><FormattedMessage id="banner.child3"/></div>
                        </div>
                        <div className="option-child">
                            <div className="icon-child"><i className="fas fa-flask"></i></div>
                            <div className="text-child"><FormattedMessage id="banner.child4"/></div>
                        </div>
                        <div className="option-child">
                            <div className="icon-child"><i className="fas fa-user-md"></i></div>
                            <div className="text-child"><FormattedMessage id="banner.child5"/></div>
                        </div>
                        <div className="option-child">
                            <div className="icon-child"><i className="fas fa-briefcase-medical"></i></div>
                            <div className="text-child"><FormattedMessage id="banner.child6"/></div>
                        </div>
                    </div>
                </div>
            </div>
            }
            </React.Fragment>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language))
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeHeader));
