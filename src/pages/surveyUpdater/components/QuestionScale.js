import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

import ImagePlaceholder from '../../../imports/images/image.png';
import Gradient0 from '../../../imports/images/gradient0.png';
import Gradient1 from '../../../imports/images/gradient1.png';
import Gradient2 from '../../../imports/images/gradient2.png';
import Gradient3 from '../../../imports/images/gradient3.png';

import '../styles/QuestionScale.css';

class QuestionScale extends Component {
    constructor(props){
        super(props);
        this.state = {
            scaleMin: this.props.scaleMin,
            scaleMax: this.props.scaleMax,
            step: this.props.step,
            labelsValues: this.props.labelsValues,
            selectedValue: this.props.selectedValue,
            graduation: this.props.graduation,
            gradient: this.props.gradient,
            gradientType: this.props.gradientType,

            gradients: [Gradient0, Gradient1, Gradient2, Gradient3],
        };
    }

    componentWillReceiveProps = (newProps) => {
        this.setState({
            scaleMin: newProps.scaleMin,
            scaleMax: newProps.scaleMax,
            step: newProps.step,
            labelsValues: newProps.labelsValues,
            selectedValue: newProps.selectedValue,
            graduation: newProps.graduation,
            gradient: newProps.gradient,
            gradientType: newProps.gradientType,
        });
    };

    onChange = (event) => {
        switch(event.target.name){
            case `scaleMin`:
                this.setState({
                    scaleMin: Math.min(Math.floor(+event.target.value), this.state.scaleMax),
                });
                break;
            case `scaleMax`:
                this.setState({
                    scaleMax: Math.max(Math.floor(+event.target.value), this.state.scaleMin),
                });
                break;
            case `step`:
                this.setState({
                    step: +event.target.value,
                });
                break;
            case `labelsValues`:
                let labelsValues = this.state.labelsValues.slice();
                labelsValues[event.target.id] = event.target.value;
                this.setState({
                    labelsValues: labelsValues,
                });
                break;
            case `image`:
                event.stopPropagation();
                let image = this.state.labelsValues.slice();
                let index = +event.target.id + 5;
                image[index] = ``;
                this.setState({
                    labelsValues: image,
                }, () => this.props.updateQuestion(
                    this.props.index,
                    this.props.sectionIndex,
                    `labelsValues`,
                    this.state.labelsValues
                ));
                break;
            case `selectedValue`:
                this.setState((previousState) => {
                    return({
                        selectedValue: !previousState.selectedValue,
                    });
                }, () => this.props.updateQuestion(
                    this.props.index,
                    this.props.sectionIndex,
                    `selectedValue`,
                    this.state.selectedValue
                ));
                break;
            case `graduation`:
                this.setState((previousState) => {
                    return({
                        graduation: !previousState.graduation,
                    });
                }, () => this.props.updateQuestion(
                    this.props.index,
                    this.props.sectionIndex,
                    `graduation`,
                    this.state.graduation
                ));
                break;
            case `gradient`:
                this.setState((previousState) => {
                    return({
                        gradient: !previousState.gradient,
                    });
                }, () => this.props.updateQuestion(
                    this.props.index,
                    this.props.sectionIndex,
                    `gradient`,
                    this.state.gradient
                ));
                break;
            case `gradientType`:
                this.setState({
                    gradientType: Math.floor(+event.target.value),
                }, () => this.props.updateQuestion(
                    this.props.index,
                    this.props.sectionIndex,
                    `gradientType`,
                    this.state.gradientType
                ));
                break;
            default:
                break;
        }
    };

    onDrop = (acceptedFiles, rejectedFiles, index) => {
        if(acceptedFiles.length < 1) return;
        let self = this;
        let reader = new FileReader();
        let labelsValues = this.state.labelsValues.slice();
        reader.readAsDataURL(acceptedFiles[0]);
        reader.onloadend = function() {
            labelsValues[index] = reader.result;
            self.setState({
                labelsValues: labelsValues,
            }, () => self.props.updateQuestion(
                self.props.index,
                self.props.sectionIndex,
                `labelsValues`,
                self.state.labelsValues
            ));
        }
    };

    onBlur = (event) => {
        switch(event.target.name){
            case `scaleMin`:
                this.props.updateQuestion(
                    this.props.index,
                    this.props.sectionIndex,
                    `scaleMin`,
                    this.state.scaleMin
                );
                break;
            case `scaleMax`:
                this.props.updateQuestion(
                    this.props.index,
                    this.props.sectionIndex,
                    `scaleMax`,
                    this.state.scaleMax
                );
                break;
            case `step`:
                this.setState({
                    step: Math.min(+event.target.value, (this.state.scaleMax - this.state.scaleMin)),
                }, () => this.props.updateQuestion(
                    this.props.index,
                    this.props.sectionIndex,
                    `step`,
                    this.state.step
                ));
                break;
            case `labelsValues`:
                this.props.updateQuestion(
                    this.props.index,
                    this.props.sectionIndex,
                    `labelsValues`,
                    this.state.labelsValues
                );
                break;
            default:
                break;
        }
    };

    render = () => {
        let labelsRows = [];
        for(let i = 0; i < 5; i++){
            labelsRows.push(
                <div className={`QuestionScaleLabelDiv`} key={i}>
                    <Dropzone
                        accept={`image/*`}
                        name={`labelsValues`}
                        onDrop={(accepted, rejected) => {this.onDrop(accepted, rejected, i + 5)}}
                        className={`InputImage`}
                        multiple={false}
                        title={`Cliquez pour importer ou déposez directement une image pour l'afficher`}
                    >
                        {this.state.labelsValues[i + 5] === `` || this.state.labelsValues[i + 5] === undefined ?
                            null:
                            <button 
                                className={`InputImageRemover`} 
                                name={`image`}
                                id={i}
                                title={`Cliquez pour supprimer l'image`}
                                onClick={(event) => this.onChange(event)}
                            >
                                {`x`}
                            </button>
                        }
                        {this.state.labelsValues[i + 5] === `` || this.state.labelsValues[i + 5] === undefined ?
                            <img 
                                className={`InputImagePlaceholder`} 
                                src={ImagePlaceholder}
                                role={`presentation`}
                            />:
                            <img 
                                className={`InputImageDisplayer`} 
                                src={this.state.labelsValues[i + 5]}
                                role={`presentation`}
                            />
                        }
                    </Dropzone>
                    <input
                        className={`QuestionScaleInputLabel`}
                        type={`text`}
                        name={`labelsValues`}
                        id={i}
                        value={this.state.labelsValues === undefined ? ``: this.state.labelsValues[i]}
                        onChange={(event) => this.onChange(event)}
                        onBlur={(event) => this.onBlur(event)}
                        placeholder={`Ajouter un texte...`}
                    />
                </div>
            );
        }

        let tickmarks = [];
        if(this.state.graduation){
            for(let i = this.state.scaleMin; i < this.state.scaleMax + 1; i++){
                tickmarks.push(
                    <div key={i} className={`QuestionScaleTick${this.state.scaleMax - this.state.scaleMin < 21 ? `Minus`: `Plus`}20`}>
                        {this.state.scaleMax - this.state.scaleMin < 21 ? i: null}
                    </div>
                );
            }
        }

        return(
            <div className={`QuestionScaleRoot`}>
                <div className={`QuestionScaleLabelsDiv`}>
                    {labelsRows}
                </div>
                <div className={`QuestionScaleSliderDiv`}>
                    <input
                        className={`InputNumber`}
                        name={`scaleMin`}
                        type={`number`}
                        value={this.state.scaleMin}
                        onChange={(event) => this.onChange(event)}
                        onBlur={(event) => this.onBlur(event)}
                    />
                    <div className={`QuestionScaleDisplayDiv`}>
                        {this.state.gradient ?
                            <img 
                                className={`QuestionScaleGradient`}
                                src={this.state.gradients[this.state.gradientType]}
                                role={`presentation`}
                            />:
                            null
                        }
                        <input
                            className={`QuestionScaleSlider`}
                            type={`range`}
                            value={undefined}
                            min={this.state.scaleMin}
                            max={this.state.scaleMax}
                            step={this.state.step}
                        />
                    </div>
                    <input
                        className={`InputNumber`}
                        name={`scaleMax`}
                        type={`number`}
                        value={this.state.scaleMax}
                        onChange={(event) => this.onChange(event)}
                        onBlur={(event) => this.onBlur(event)}
                    />
                </div>
                <div className={`QuestionScaleTicksDiv${this.state.scaleMax - this.state.scaleMin < 21 ? `Minus`: `Plus`}20`}>
                    {tickmarks}
                </div>
                <div className={`QuestionScaleCheckboxesDiv`}>
                    <div className={`InputCheckboxDiv`}>
                        <input
                            name={`graduation`} 
                            type={`checkbox`}
                            checked={this.state.graduation}
                            onChange={(event) => this.onChange(event)}
                        />
                        {`Afficher des graduations pour les valeurs entières`}
                    </div>
                    <div className={`InputCheckboxDiv`}>
                        <input
                            name={`gradient`} 
                            type={`checkbox`}
                            checked={this.state.gradient}
                            onChange={(event) => this.onChange(event)}
                        />
                        {`Afficher un dégradé au dessus du curseur :`}
                        <select
                            className={`InputSelect`}
                            name={`gradientType`}
                            value={this.state.gradientType}
                            onChange={(event) => this.onChange(event)}
                        >
                            <option style={{color: `#000F`}} value={0}>
                                {`croissant`}
                            </option>
                            <option style={{color: '#000F'}} value={1}>
                                {`décroissant`}
                            </option>
                            <option style={{color: `#000F`}} value={2}>
                                {`croissant puis décroissant`}
                            </option>
                            <option style={{color: `#000F`}} value={3}>
                                {`décroissant puis croissant`}
                            </option>
                        </select>
                    </div>
                    <div className={`InputCheckboxDiv`}>
                        <input
                            name={`selectedValue`} 
                            type={`checkbox`}
                            checked={this.state.selectedValue}
                            onChange={(event) => this.onChange(event)}
                        />
                        {`Afficher à l'utilisateur la valeur selectionnée`}
                    </div>
                </div>
                {`Pas de l'échelle : `}
                <input
                    className={`InputNumber`}
                    name={`step`}
                    type={`number`}
                    step={0.1}
                    value={this.state.step}
                    onChange={(event) => this.onChange(event)}
                    onBlur={(event) => this.onBlur(event)}
                />
                {`(Le séparateur décimal doit être une virgule, pas minimum: 0,1)`}       
            </div>
        );
    };
} export default QuestionScale;