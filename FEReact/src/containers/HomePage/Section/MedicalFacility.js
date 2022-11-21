import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Slider from "react-slick";
import { getAllClinicService } from '../../../services/clinicService';
import { withRouter } from 'react-router';

class MedicalFacility extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataClinic: []
        }
    }

    async componentDidMount () {
        let res = await getAllClinicService();
        if(res && res.errCode === 0 && res.data) {
            this.setState({
                dataClinic: res.data
            })
        }
    }

    handleViewDetailSpeciaty = (id) => {
        this.props.history.push(`/clinics/${id}`)
    }

    render() {
        let {dataClinic} = this.state;
        return (
            <div className="section-share section-medical-facility">
                <div className="section-container">
                    <div className="section-header">
                        <span className="title-section"><FormattedMessage id="homepage.medical-facility"/></span>
                        <button className="btn-section"><FormattedMessage id="homepage.more-info"/></button>
                    </div>
                    <div className="section-body">
                        <Slider {...this.props.settings}>
                            {dataClinic && dataClinic.length > 0 &&
                                dataClinic.map((item, index) => {
                                    return (
                                        <div className="section-customize specialty-child" key={index} 
                                            onClick = {()=>this.handleViewDetailSpeciaty(item.id)}
                                        >
                                            <div className="bg-image section-specialty"
                                                 style={{backgroundImage: `url(${item.image})`}}
                                            />
                                            <div className="specialty-name">{item.name}</div>
                                        </div>
                                    )
                                })
                            }
                        </Slider>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MedicalFacility));
