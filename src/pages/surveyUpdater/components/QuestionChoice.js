import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

import ImagePlaceholder from '../../../imports/images/image.png';

class QuestionChoice extends Component {
    constructor(props){
        super(props);
        this.state = {
            linesNumber: this.props.linesNumber,
            columnsNumber: this.props.columnsNumber,
            linesLabels: this.props.linesLabels,
            columnsLabels: this.props.columnsLabels,
            linesImages: this.props.linesImages,
            columnsImages: this.props.columnsImages,
            numberOfAnswers: this.props.numberOfAnswers,
        };
    }

    componentWillReceiveProps = (newProps) => {
        this.setState({
            linesNumber: newProps.linesNumber,
            columnsNumber: newProps.columnsNumber,
            linesLabels: newProps.linesLabels,
            columnsLabels: newProps.columnsLabels,
            linesImages: newProps.linesImages,
            columnsImages: newProps.columnsImages,
            numberOfAnswers: newProps.numberOfAnswers,
        });
    };

    onChange = (event) => {
        switch(event.target.name){
            case `gridLayout`:
                this.setState((previousState) => {
                    return({
                        linesNumber: previousState.linesNumber === 1 ? 2: 1,
                    });
                }, () => this.props.updateQuestion(
                    this.props.index,
                    this.props.sectionIndex,
                    `linesNumber`,
                    this.state.linesNumber
                ));
                break;
            case `linesNumber`:
                this.setState({
                    linesNumber: Math.floor(+event.target.value < 1 ? 1 : Math.floor(+event.target.value)),
                });
                break;
            case `columnsNumber`:
                this.setState({
                    columnsNumber: Math.max(this.state.numberOfAnswers, Math.floor(+event.target.value)) < 2 ? 2: Math.max(Math.floor(+event.target.value), this.state.numberOfAnswers),
                });
                break;
            case `linesLabels`:
                let linesLabels = this.state.linesLabels.slice();
                linesLabels[event.target.id] = event.target.value;
                this.setState({
                    linesLabels: linesLabels,
                });
                break;
            case `columnsLabels`:
                let columnsLabels = this.state.columnsLabels.slice();
                columnsLabels[event.target.id] = event.target.value;
                this.setState({
                    columnsLabels: columnsLabels,
                });
                break;
            case `linesImages`:
                event.stopPropagation();
                let linesImages = this.state.linesImages.slice();
                linesImages[event.target.id] = ``;
                this.setState({
                    linesImages: linesImages,
                }, () => this.props.updateQuestion(
                    this.props.index,
                    this.props.sectionIndex,
                    `linesImages`,
                    this.state.linesImages
                ));
                break;
            case `columnsImages`:
                event.stopPropagation();
                let columnsImages = this.state.columnsImages.slice();
                columnsImages[event.target.id] = ``;
                this.setState({
                    columnsImages: columnsImages,
                }, () => this.props.updateQuestion(
                    this.props.index,
                    this.props.sectionIndex,
                    `columnsImages`,
                    this.state.columnsImages
                ));
                break;
            case `numberOfAnswers`:
                this.setState({
                    numberOfAnswers: Math.min(this.state.columnsNumber, Math.floor(+event.target.value)) < 1 ? 1: Math.min(Math.floor(+event.target.value), this.state.columnsNumber),
                });
                break;
            default:
                break;
        }
    };

    onBlur = (event) => {
        switch(event.target.name){
            case `linesNumber`:
                this.props.updateQuestion(
                    this.props.index,
                    this.props.sectionIndex,
                    `linesNumber`,
                    this.state.linesNumber
                );
                break;
            case `columnsNumber`:
                this.props.updateQuestion(
                    this.props.index,
                    this.props.sectionIndex,
                    `columnsNumber`,
                    this.state.columnsNumber
                );
                break;
            case `linesLabels`:
                this.props.updateQuestion(
                    this.props.index,
                    this.props.sectionIndex,
                    `linesLabels`,
                    this.state.linesLabels.slice()
                );
                break;
            case `columnsLabels`:
                this.props.updateQuestion(
                    this.props.index,
                    this.props.sectionIndex,
                    `columnsLabels`,
                    this.state.columnsLabels.slice()
                );
                break;
            case `numberOfAnswers`:
                this.props.updateQuestion(
                    this.props.index,
                    this.props.sectionIndex,
                    `numberOfAnswers`,
                    this.state.numberOfAnswers
                );
                break;
            default:
                break;
        }
    };

    onDropLinesImages = (acceptedFiles, rejectedFiles, index) => {
        if(acceptedFiles.length < 1) return;
        let self = this;
        let reader = new FileReader();
        let linesImages = this.state.linesImages.slice();
        reader.readAsDataURL(acceptedFiles[0]);
        reader.onloadend = function() {
            linesImages[index] = reader.result;
            self.setState({
                linesImages: linesImages,
            }, () => self.props.updateQuestion(
                self.props.index,
                self.props.sectionIndex,
                `linesImages`,
                self.state.linesImages
            ));
        }
    };

    onDropColumnsImages = (acceptedFiles, rejectedFiles, index) => {
        if(acceptedFiles.length < 1) return;
        let self = this;
        let reader = new FileReader();
        let columnsImages = this.state.columnsImages.slice();
        reader.readAsDataURL(acceptedFiles[0]);
        reader.onloadend = function() {
            columnsImages[index] = reader.result;
            self.setState({
                columnsImages: columnsImages,
            }, () => self.props.updateQuestion(
                self.props.index,
                self.props.sectionIndex,
                `columnsImages`,
                self.state.columnsImages
            ));
        }
    };

    render = () => {
        if(this.state.linesNumber !== 1){
            let linesLabels = [];
            for(let i = 0; i < this.state.linesNumber; i++){
                linesLabels.push(
                    <div className={`InlineBlockDiv`} key={i}>
                        <input
                            className={`InputText`}
                            type={`text`}
                            name={`linesLabels`}
                            id={i}
                            value={this.state.linesLabels[i]}
                            onChange={(event) => this.onChange(event)}
                            onBlur={(event) => this.onBlur(event)}
                            placeholder={`Ligne ${i + 1}...`}
                            style={{width: '90%'}}
                        />
                        <Dropzone
                            accept={`image/*`}
                            name={`linesImages`}
                            onDrop={(accepted, rejected) => {this.onDropLinesImages(accepted, rejected, i)}}
                            className={`InputImage`}
                            multiple={false}
                            title={`Cliquez pour importer ou déposez directement une image pour l'afficher`}
                        >
                            {this.state.linesImages[i] === `` || this.state.linesImages[i] === undefined ?    
                                null:
                                <button 
                                    className={`InputImageRemover`} 
                                    name={`linesImages`}
                                    id={i}
                                    title={`Cliquez pour supprimer l'image`}
                                    onClick={(event) => this.onChange(event)}
                                >
                                    {`x`}
                                </button>
                            }
                            {this.state.linesImages[i] === `` || this.state.linesImages[i] === undefined ? 
                                <img 
                                    className={`InputImagePlaceholder`} 
                                    src={ImagePlaceholder}
                                    role={`presentation`}
                                />:
                                <img 
                                    className={`InputImageDisplayer`} 
                                    src={this.state.linesImages[i]}
                                    role={`presentation`}
                                />
                            }
                        </Dropzone>
                    </div>
                );
            }
    
            let columnsLabels = [];
            for(let i = 0; i < this.state.columnsNumber; i++){
                columnsLabels.push(
                    <div className={`InlineBlockDiv`} key={i}>
                        <input
                            className={`InputText`}
                            type={`text`}
                            name={`columnsLabels`}
                            id={i}
                            value={this.state.columnsLabels[i]}
                            onChange={(event) => this.onChange(event)}
                            onBlur={(event) => this.onBlur(event)}
                            placeholder={`Colonne ${i + 1}...`}
                            style={{width: '90%'}}
                        />
                        <Dropzone
                            accept={`image/*`}
                            name={`columnsImages`}
                            onDrop={(accepted, rejected) => {this.onDropColumnsImages(accepted, rejected, i)}}
                            className={`InputImage`}
                            multiple={false}
                            title={`Cliquez pour importer ou déposez directement une image pour l'afficher`}
                        >
                            {this.state.columnsImages[i] === `` || this.state.columnsImages[i] === undefined ?      
                                null:
                                <button 
                                    className={`InputImageRemover`} 
                                    name={`columnsImages`}
                                    id={i}
                                    title={`Cliquez pour supprimer l'image`}
                                    onClick={(event) => this.onChange(event)}
                                >
                                    {`x`}
                                </button>
                            }
                            {this.state.columnsImages[i] === `` || this.state.columnsImages[i] === undefined ?
                                <img 
                                    className={`InputImagePlaceholder`} 
                                    src={ImagePlaceholder}
                                    role={`presentation`}
                                />:
                                <img 
                                    className={`InputImageDisplayer`} 
                                    src={this.state.columnsImages[i]}
                                    role={`presentation`}
                                />
                            }
                        </Dropzone>
                    </div>
                );
            }

            return(
                <div className={`QuestionChoiceRoot`}>
                    <div className={`InputCheckboxDiv`}>
                        <input
                            name={`gridLayout`} 
                            type={`checkbox`}
                            checked={true}
                            onChange={(event) => this.onChange(event)}
                        />
                        {`Afficher la question sous forme de grille`}
                    </div>
                    {`Nombre de lignes :`}
                    <input
                        className={`InputNumber`}
                        name={`linesNumber`}
                        type={`number`}
                        value={this.state.linesNumber}
                        onChange={(event) => this.onChange(event)}
                        onBlur={(event) => this.onBlur(event)}
                    />
                    {`Nombre de colonnes :`}
                    <input
                        className={`InputNumber`}
                        name={`columnsNumber`}
                        type={`number`}
                        value={this.state.columnsNumber}
                        onChange={(event) => this.onChange(event)}
                        onBlur={(event) => this.onBlur(event)}
                    />
                    {`Nombre de réponses maximum par ligne :`}
                    <input 
                        className={`InputNumber`}
                        name={`numberOfAnswers`}
                        type={`number`}
                        value={this.state.numberOfAnswers}
                        onChange={(event) => this.onChange(event)}
                        onBlur={(event) => this.onBlur(event)}
                    />
                    <div className={`LabelsRoot`}>
                        <div className={`LabelsInColumns`}>
                            {linesLabels}
                        </div>
                        <div className={`LabelsInColumns`}>
                            {columnsLabels}
                        </div>
                    </div>
                </div>
            );
        }
        else {
            let columnsLabels = [];
            for(let i = 0; i < this.state.columnsNumber; i++){
                columnsLabels.push(
                    <div className={`InlineBlockDiv`} key={i}>
                        <input
                            className={`InputText`}
                            type={`text`}
                            name={`columnsLabels`}
                            id={i}
                            value={this.state.columnsLabels[i]}
                            onChange={(event) => this.onChange(event)}
                            onBlur={(event) => this.onBlur(event)}
                            placeholder={`Choix ${i + 1}...`}
                            style={{width: '90%'}}
                        />
                        <Dropzone
                            accept={`image/*`}
                            name={`columnsImages`}
                            onDrop={(accepted, rejected) => {this.onDropColumnsImages(accepted, rejected, i)}}
                            className={`InputImage`}
                            multiple={false}
                            title={`Cliquez pour importer ou déposez directement une image pour l'afficher`}
                        >
                            {this.state.columnsImages[i] === `` || this.state.columnsImages[i] === undefined ?      
                                null:
                                <button 
                                    className={`InputImageRemover`} 
                                    name={`columnsImages`}
                                    id={i}
                                    title={`Cliquez pour supprimer l'image`}
                                    onClick={(event) => this.onChange(event)}
                                >
                                    {`x`}
                                </button>
                            }
                            {this.state.columnsImages[i] === `` || this.state.columnsImages[i] === undefined ?
                                <img 
                                    className={`InputImagePlaceholder`} 
                                    src={ImagePlaceholder}
                                    role={`presentation`}
                                />:
                                <img 
                                    className={`InputImageDisplayer`} 
                                    src={this.state.columnsImages[i]}
                                    role={`presentation`}
                                />
                            }
                        </Dropzone>
                    </div>
                );
            }
            return(
                <div className={`QuestionChoiceRoot`}>
                    <div className={`InputCheckboxDiv`}>
                        <input
                            name={`gridLayout`}
                            type={`checkbox`}
                            checked={false}
                            onChange={(event) => this.onChange(event)}
                        />
                        {`Afficher la question sous forme de grille`}
                    </div>
                    {`Nombre de choix :`}
                    <input
                        className={`InputNumber`}
                        name={`columnsNumber`}
                        type={`number`}
                        value={this.state.columnsNumber}
                        onChange={(event) => this.onChange(event)}
                        onBlur={(event) => this.onBlur(event)}
                    />
                    {`Nombre de réponses maximum :`}
                    <input 
                        className={`InputNumber`}
                        name={`numberOfAnswers`}
                        type={`number`}
                        value={this.state.numberOfAnswers}
                        onChange={(event) => this.onChange(event)}
                        onBlur={(event) => this.onBlur(event)}
                    />
                    <div className={`LabelsRoot`}>
                        <div className={`LabelsInColumns`}>
                            {columnsLabels}
                        </div>
                    </div>
                </div>
            );
        }
    };
} export default QuestionChoice;