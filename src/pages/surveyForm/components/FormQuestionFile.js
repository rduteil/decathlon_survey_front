import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

import '../styles/FormQuestionFile.css';

class FormQuestionFile extends Component {
    constructor(props){
        super(props);
        this.state = {
            file64: null,
            filename: null,
            filetype: null,
            fileformat: null,
            answer: [``, ``],
        }
    }

    onChange = (event) => {
        switch(event.target.name){
            case `remover`:
                event.stopPropagation();
                this.setState({
                    file64: null,
                    filename: null,
                    filetype: null,
                    fileformat: null,
                }, () => this.props.handleChangeFile(this.props.id, null, null, null, null));
                break;
            case `commentary`:
                let answer = this.state.answer.slice();
                answer[1] = event.target.value;
                this.props.handleChangeAnswer(this.props.id, answer);
                break;
            default:
                break;
        }
    };

    onDrop = (acceptedFiles, rejectedFiles) => {
        if(acceptedFiles.length < 1) return;

        const reader = new FileReader();
        let self = this;
        reader.readAsDataURL(acceptedFiles[0]);
        reader.onloadend = function(file){
            let answer = self.state.answer.slice();
            answer[0] = acceptedFiles[0].name;
            self.setState({
                file64: reader.result,
                filename: acceptedFiles[0].name,
                filetype: acceptedFiles[0].type.split("/")[0],
                fileformat: acceptedFiles[0].type,
                answer: answer,
            }, () => self.props.handleChangeFile(self.props.id, self.state.file64, self.state.filename, self.state.filetype, self.state.fileformat));
        };
    };

    render = () => {
        let acceptedFiles = ``;
        if(this.props.fileTypes[0] === true) acceptedFiles = `${acceptedFiles}image/*, `;
        if(this.props.fileTypes[1] === true) acceptedFiles = `${acceptedFiles}video/*, `;

        let displayer = null;
        switch(this.state.filetype){
            case null:
                displayer = (
                    <div className={`FormQuestionFiller`}>
                        {`+`}
                    </div>
                );
                break;
            case `image`:
                displayer = (
                    <img className={`FormQuestionDisplayer`} src={this.state.file64} role={`presentation`}/>
                );
                break;
            case `video`:
                displayer = (
                    <video className={`FormQuestionDisplayer`} title={`Utilisez les boutons de contrôle pour vérifier la vidéo`} controls>
                        <source type={this.state.fileformat} src={this.state.file64}/>
                    </video>
                )
                break;
            default:
                break;
        }

        let remover = null;
        if(this.state.filetype !== null){
            remover = (
                <button 
                    className={`FormQuestionRemover`} 
                    name={`remover`}
                    title={`Cliquez pour supprimer le fichier ${this.state.filename}`}
                    onClick={(event) => this.onChange(event)}
                >
                    {`x`}
                </button>
            );
        }

        let commentary = null;
        if(this.props.commentary){
            commentary = (
                <textarea
                    name={`commentary`}
                    className={`FormQuestionCommentary`}
                    rows={6}
                    onChange={(event) => this.onChange(event)}
                    placeholder={`Laissez votre commentaire concernant le fichier importé ici...`}
                />
            );
        }

        let hint = `Fichiers acceptés : ${acceptedFiles}`;
        hint = hint.substring(0, hint.length - 2);

        return(
            <div className={`FormQuestionFileRoot`}>
                <div className={`FormHint`}>
                    {hint}
                </div>
                <div className={`FormQuestionFileBody`}>
                    <div className={`FormQuestionWrapper`}>
                        <Dropzone
                            className={`FormQuestionUploader`}
                            accept={acceptedFiles}
                            name={`uploader`}
                            onDrop={(acceptedFiles, rejectedFiles) => this.onDrop(acceptedFiles, rejectedFiles)}
                            multiple={false}
                            title={`Cliquez pour choisir ou déposez directement un fichier`}
                        >
                            {remover}
                            {displayer}
                        </Dropzone>
                        {commentary}
                    </div>
                </div>
            </div>
        );
    };
} export default FormQuestionFile;