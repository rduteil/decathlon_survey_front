import React, { Component } from 'react';

import '../styles/SurveyFormHeader.css';

class SurveyFormHeader extends Component {
    render(){   
        return(
            <div className='SurveyFormHeaderRoot'>
                <div className='SurveyFormHeaderName'>
                    {this.props.name}
                </div>
                {this.props.description === `` ? 
                    null:
                    <div className='SurveyFormHeaderDescription'>
                        {this.props.description}
                    </div>
                }
                <div className='SurveyFormHeaderImageDiv'>
                    <img className='SurveyFormHeaderImage' src={this.props.image} alt=''/>
                </div>
            </div>
        );
    }
}

export default SurveyFormHeader;