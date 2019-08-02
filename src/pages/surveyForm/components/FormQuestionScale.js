import React, { Component } from 'react';

import Gradient0 from '../../../imports/images/gradient0.png';
import Gradient1 from '../../../imports/images/gradient1.png';
import Gradient2 from '../../../imports/images/gradient2.png';
import Gradient3 from '../../../imports/images/gradient3.png';

import '../styles/FormQuestionScale.css';

class FormQuestionScale extends Component {
    constructor(props){
        super(props);
        this.state = {
            answer: this.props.scaleMin,
            gradients: [Gradient0, Gradient1, Gradient2, Gradient3],
        };
    }

    onChange = (event) => {
        this.setState({
            answer: event.target.value,
        }, () => this.props.handleChangeAnswer(this.props.id, this.state.answer));
    }

    render = () => {
        let labelsRows = [];
        for(let i = 0; i < 5; i++){
            labelsRows.push(
                <div className={`FormQuestionScaleLabelDiv`} key={i}>
                    <div className={`FormQuestionScaleImageDiv`}>
                        <img 
                            className={`FormQuestionScaleImage`} 
                            src={this.props.labelsValues === undefined ? ``: this.props.labelsValues[i + 5]}
                            role={`presentation`}
                        />
                    </div>
                    <div className={`FormQuestionScaleLabel`}>
                        {this.props.labelsValues[i]}
                    </div>
                </div>
            );
        }

        let tickmarks = [];
        if(this.props.graduation){
            for(let i = this.props.scaleMin; i < this.props.scaleMax + 1; i++){
                tickmarks.push(
                    <div key={i} className={`FormQuestionScaleTick${this.props.scaleMax - this.props.scaleMin < 21 ? `Minus`: `Plus`}20`}>
                        {this.props.scaleMax - this.props.scaleMin < 21 ? i: null}
                    </div>
                );
            }
        }

        return(
            <div className={`FormQuestionScaleRoot`}>
                <div className={`FormQuestionScaleLabelsDiv`}>
                    {labelsRows}
                </div>

                {this.props.gradient ?
                    <img 
                        className={`FormQuestionScaleGradient`}
                        src={this.state.gradients[this.props.gradientType]}
                        role={`presentation`}
                    />:
                    null    
                }
                <div className={`FormQuestionScaleSliderDiv`}>
                    <input
                        id={`slider`}
                        type={`range`}
                        className={`FormQuestionScaleSlider`}
                        value={this.state.answer}
                        onChange={(event) => this.onChange(event)}
                        min={this.props.scaleMin}
                        max={this.props.scaleMax}
                        step={this.props.step}
                    />
                </div>
                <div className={`FormQuestionScaleTicksDiv${this.props.scaleMax - this.props.scaleMin < 21 ? `Minus`: `Plus`}20`}>
                    {tickmarks}
                </div>
                {this.props.selectedValue ? 
                    <div className={`FormQuestionScaleSelectedValue`}>
                        {`Valeur sélectionnée : ${this.state.answer}`}
                    </div>:
                    null
                }
            </div>
        );
    }
}

export default FormQuestionScale;