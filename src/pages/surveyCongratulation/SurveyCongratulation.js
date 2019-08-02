import React, { Component } from 'react';

import './styles/SurveyCongratulation.css';

class SurveyCongratulation extends Component {
    render = () => {
        return(
            <div className={`SurveyCongratulationRoot`}>
                <div className={`SurveyCongratulationHint`}>
                    {`Merci d'avoir répondu à ce questionnaire. Pour y répondre à nouveau, cliquez sur le bouton : `}
                </div>
                <button className={`SurveyCongratulationReturn`} onClick={() => this.props.history.push(`/forms/${this.props.match.params.link}`)}>
                    {`Retourner au questionnaire`}
                </button>
            
            </div>
        );
    };
} export default SurveyCongratulation;