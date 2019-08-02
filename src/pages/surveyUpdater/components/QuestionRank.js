import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

import ImagePlaceholder from '../../../imports/images/image.png';

class QuestionRank extends Component {
    constructor(props){
        super(props);
        this.state = {
            valuesAsImages: this.props.valuesAsImages,
            numberOfValues: this.props.numberOfValues,
            values: this.props.values,
            topLabel: this.props.topLabel,
            bottomLabel: this.props.bottomLabel,
        };
    }

    componentWillReceiveProps = (newProps) => {
        this.setState({
            valuesAsImages: newProps.valuesAsImages,
            numberOfValues: newProps.numberOfValues,
            values: newProps.values,
            topLabel: newProps.topLabel,
            bottomLabel: newProps.bottomLabel,
        });
    };

    onChange = (event) => {
        switch(event.target.name){
            case `valuesAsImages`:
                this.setState((previousState) => {
                    return({
                        valuesAsImages: !previousState.valuesAsImages,
                    });
                }, () => this.props.updateQuestion(
                    this.props.index,
                    this.props.sectionIndex,
                    `valuesAsImages`,
                    this.state.valuesAsImages
                ));
                break;
            case `numberOfValues`:
                this.setState({
                    numberOfValues: Math.max(Math.min(Math.floor(+event.target.value), 10), 2),
                });
                break;
            case `values`:
                let values = this.state.values.slice();
                values[event.target.id] = event.target.value;
                this.setState({
                    values: values,
                });
                break;
            case `topLabel`:
                this.setState({
                    topLabel: event.target.value,
                });
                break;
            case `bottomLabel`:
                this.setState({
                    bottomLabel: event.target.value,
                });
                break;
            case `image`:
                event.stopPropagation();
                let images = this.state.values.slice();
                let index = +event.target.id + 10;
                images[index] = ``;
                this.setState({
                    values: images,
                }, () => this.props.updateQuestion(
                    this.props.index,
                    this.props.sectionIndex,
                    `values`,
                    this.state.values
                ));
                break;      
            default:
                break;
        }
    };

    onDrop = (acceptedFiles, rejectedFiles, index) => {
        if(acceptedFiles.length < 1)
            return;
        let self = this;
        let reader = new FileReader();
        let values = this.state.values.slice();
        reader.readAsDataURL(acceptedFiles[0]);
        reader.onloadend = function() {
            values[index] = reader.result;
            self.setState({
                values: values,
            }, () => self.props.updateQuestion(
                self.props.index,
                self.props.sectionIndex,
                `values`,
                self.state.values
            ));
        }
    };

    onBlur = (event) => {
        switch(event.target.name){
            case `numberOfValues`:
                this.props.updateQuestion(
                    this.props.index,
                    this.props.sectionIndex,
                    `numberOfValues`,
                    this.state.numberOfValues
                );
                break;
            case `values`:
                this.props.updateQuestion(
                    this.props.index,
                    this.props.sectionIndex,
                    `values`,
                    this.state.values.slice()
                );
                break;
            case `topLabel`:
                this.props.updateQuestion(
                    this.props.index,
                    this.props.sectionIndex,
                    `topLabel`,
                    this.state.topLabel
                );
                break;
            case `bottomLabel`:
                this.props.updateQuestion(
                    this.props.index,
                    this.props.sectionIndex,
                    `bottomLabel`,
                    this.state.bottomLabel
                );
                break;
            default:
                break;
        }
    };

    render = () => {
        let valuesRows = [];
        for(let i = 0; i < this.state.numberOfValues; i++){
            valuesRows.push(
                <div className={`InlineBlockDiv`} key={i}>
                    <input
                        className={`InputText`}
                        type={`text`}
                        name={`values`}
                        id={i}
                        value={this.state.values[i]}
                        onChange={(event) => this.onChange(event)}
                        onBlur={(event) => this.onBlur(event)}
                        placeholder={`Elément à classer...`}
                        style={{width: '90%'}}
                    /> 
                    <Dropzone
                        accept={`image/*`}
                        name={`values`}
                        onDrop={(accepted, rejected) => {this.onDrop(accepted, rejected, i + 10)}}
                        className={`InputImage`}
                        multiple={false}
                        title={`Cliquez pour importer ou déposez directement une image pour l'afficher`}
                    >
                        {this.state.values[i + 10] === `` || this.state.values[i + 10] === undefined ? 
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
                        {this.state.values[i + 10] === `` || this.state.values[i + 10] === undefined ? 
                            <img 
                                className={`InputImagePlaceholder`} 
                                src={ImagePlaceholder}
                                role={`presentation`}
                            />:
                            <img 
                                className={`InputImageDisplayer`} 
                                src={this.state.values[i + 10]}
                                role={`presentation`}
                            />
                        }
                    </Dropzone>
                </div>
            );
        }

        return(
            <div className={`QuestionRankRoot`}>
                <div className={`InputCheckboxDiv`}>
                    <input
                        name={`valuesAsImages`} 
                        type={`checkbox`}
                        checked={this.state.valuesAsImages}
                        onChange={(event) => this.onChange(event)}
                    />
                    {`N'afficher que les images à l'utilisateur (Masquer les textes associés aux éléments)`}
                </div>
                <div className={`InlineBlockDiv`}>
                    {`Nombre d'éléments à classer (Entre 2 et 10) :`}
                    <input
                        className={`InputNumber`}
                        type={`number`}
                        name={`numberOfValues`}
                        value={this.state.numberOfValues}
                        onChange={(event) => this.onChange(event)}
                        onBlur={(event) => this.onBlur(event)}
                    />
                </div>
                <div className={`InlineBlockDiv`}>
                    {`Indication apparaissant en haut de classement :`}
                    <input
                        className={`InputText`}
                        name={`topLabel`}
                        value={this.state.topLabel}
                        onChange={(event) => this.onChange(event)}
                        onBlur={(event) => this.onBlur(event)}
                        placeholder={`Entrez un critère...`}
                    />
                </div>
                <div className={`InlineBlockDiv`}>
                    {`Indication apparaissant en bas de classement :\u00a0`}
                    <input
                        className={`InputText`}
                        name={`bottomLabel`}
                        value={this.state.bottomLabel}
                        onChange={(event) => this.onChange(event)}
                        onBlur={(event) => this.onBlur(event)}
                        placeholder={`Entrez un critère...`}
                    />
                </div>
                <div className={`LabelsRoot`}>
                    <div className={`LabelsInColumns`}>
                        {valuesRows}
                    </div>
                </div>
            </div>
        );
    };
} export default QuestionRank;