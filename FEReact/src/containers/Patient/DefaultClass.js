import React, { Component } from 'react';
import { connect } from "react-redux";
import { LANGUAGES } from '../../utils'
import { FormattedMessage } from 'react-intl';
import * as actions from '../../store/actions';

class DefaultClass extends Component {

    constructor(props) {
        super(props);
        this.state = {

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


    render() {
        return (
            <div>
                hello world form default
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

export default connect(mapStateToProps, mapDispatchToProps)(DefaultClass);
