import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { CSVLink } from 'react-csv';

import Snackbar from '../../imports/components/Snackbar';

import { HOST_ADDRESS } from '../../imports/helpers/Constants';
import { makeSectionWritable, makeQuestionWritable } from '../../imports/helpers/Format';
import { SurveyAnswers } from '../../imports/helpers/GraphQLStatements';
import Spinner from '../../imports/images/spinner.gif';

import './styles/AnswerDownloader.css';

class AnswerDownloader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            survey: this.props.data.survey,
            snackbar: {
				display: false,
				message: '',
			}
        };
    }

    componentWillReceiveProps = (newProps) => {
        if (newProps.data.survey === undefined) return;

        this.setState({
            survey: newProps.data.survey,
        });
    };

    componentWillUnmount = () => {
		clearInterval(this.snackbarInterval);
	};

    sortByIndex = (rowA, rowB) => {
        return(rowA.index - rowB.index);
    };

    displaySnackbar = (message) => {
        if(this.state.snackbar.display === false){
            this.setState({
                snackbar: {
                    display: true,
                    message:  message,
                }
            }, () => this.snackbarInterval = setInterval(() => this.removeSnackbar(), 5.5 * 1000));
        }
    };

    removeSnackbar = () => {
		this.setState({
			snackbar: {
				display: false,
				message: '',			}
		}, () => clearInterval(this.snackbarInterval));
	};

    formatCSVV2 = (hangout) => {
        let data = [[this.state.survey.name]];
        if (hangout) data.push([`Réponses au questionnaire de sortie`]);
        else data.push([`Réponses au questionnaire encadré`]);

        let mainHeaders = [`Horodateur`];
        let subHeaders = [``];

        let temporaryRows = [];
        for (let i = 0; i < this.state.survey.sections.length; i++) {
            if (this.state.survey.sections[i].hangout === hangout) {
                temporaryRows.push(Object.assign(makeSectionWritable(this.state.survey.sections[i]), { isSection: true, questions: [], }));
                for (let j = 0; j < this.state.survey.sections[i].questions.length; j++) {
                    temporaryRows[temporaryRows.length - 1].questions.push(Object.assign(makeQuestionWritable(this.state.survey.sections[i].questions[j]), { isSection: false }));
                }
            }
        }
        for (let i = 0; i < this.state.survey.questions.length; i++) {
            if (this.state.survey.questions[i].hangout === hangout) {
                temporaryRows.push(Object.assign(makeQuestionWritable(this.state.survey.questions[i]), { isSection: false }));
            }
        }
        temporaryRows.sort(this.sortByIndex);

        let questions = [];
        let globalIndex = 0;
        for (let i = 0; i < temporaryRows.length; i++) {
            if (temporaryRows[i].isSection === true) {
                for (let j = 0; j < temporaryRows[i].questions.length; j++) {
                    questions.push(Object.assign(temporaryRows[i].questions[j], { globalIndex: ++globalIndex }));
                }
            }
            else {
                questions.push(Object.assign(temporaryRows[i], { globalIndex: ++globalIndex }));
            }
        }

        for (let i = 0; i < questions.length; i++) {
            if (questions[i].hangout === hangout) {
                mainHeaders.push(``);
                subHeaders.push(``);
                if (questions[i].mandatory === true) mainHeaders.push(`${questions[i].name} *`);
                else mainHeaders.push(questions[i].name);
                switch (questions[i].type) {
                    case 'QUESTION_VALUE':
                        subHeaders.push(``);
                        break;
                    case 'QUESTION_CHOICE':
                        if (questions[i].linesNumber > 1) {
                            for (let j = 0; j < questions[i].linesNumber; j++) {
                                for (let k = 0; k < questions[i].columnsNumber; k++) {
                                    if (j !== 0 || k !== 0) mainHeaders.push('');
                                    subHeaders.push(`${questions[i].linesLabels[j]} : ${questions[i].columnsLabels[k]}`);
                                }
                            }
                        }
                        else {
                            for (let k = 0; k < questions[i].columnsNumber; k++) {
                                if (k !== 0) mainHeaders.push(``);
                                subHeaders.push(questions[i].columnsLabels[k]);
                            }
                        }
                        break;
                    case 'QUESTION_RANK':
                        for (let j = 0; j < questions[i].numberOfValues; j++) {
                            if (j !== 0) mainHeaders.push(``);
                            subHeaders.push(questions[i].values[j]);
                        }
                        break;
                    case 'QUESTION_FILE':
                        subHeaders.push(`Nom du fichier`);
                        mainHeaders.push(``);
                        subHeaders.push(`Commentaire`);
                        break;
                    case 'QUESTION_SCALE':
                        subHeaders.push(``);
                        break;
                    case 'QUESTION_DATE':
                        if (!questions[i].dateInterval) {
                            subHeaders.push(``);
                        }
                        else {
                            subHeaders.push(`Date de début`);
                            mainHeaders.push(``);
                            subHeaders.push(`Date de fin`);
                        }
                        break;
                    default:
                        break;
                }
            }
        }

        data.push(mainHeaders);
        data.push(subHeaders);
        for (let i = 0; i < this.state.survey.surveyAnswers.length; i++){
            if (this.state.survey.surveyAnswers[i].hangout === hangout){
                let line = [this.state.survey.surveyAnswers[i].lastUpdate];
                for (let j = 0; j < questions.length; j++){
                    if (questions[j].hangout === hangout){
                        line.push(``);
                        let questionAnswer = null;
                        for (let k = 0; k < this.state.survey.surveyAnswers[i].questionAnswers.length; k++){
                            if (
                                questions[j].name === this.state.survey.surveyAnswers[i].questionAnswers[k].questionName &&
                                questions[j].type === this.state.survey.surveyAnswers[i].questionAnswers[k].questionType
                            ) {
                                questionAnswer = this.state.survey.surveyAnswers[i].questionAnswers[k];
                            }
                        }
                        if (questionAnswer === null) {
                            switch (questions[j].type) {
                                case 'QUESTION_VALUE':
                                    line.push(``);
                                    break;
                                case 'QUESTION_CHOICE':
                                    if (questions[j].linesNumber > 1) {
                                        for (let k = 0; k < questions[j].linesNumber; k++) {
                                            for (let l = 0; l < questions[j].columnsNumber; l++) line.push(``);
                                        }
                                    }
                                    else {
                                        for (let k = 0; k < questions[j].columnsNumber; k++) line.push(``);
                                    }
                                    break;
                                case 'QUESTION_RANK':
                                    for (let k = 0; k < questions[j].numberOfValues; k++) line.push(``);
                                    break;
                                case 'QUESTION_FILE':
                                    line.push(``);
                                    line.push(``);
                                    break;
                                case 'QUESTION_SCALE':
                                    line.push(``);
                                    break;
                                case 'QUESTION_DATE':
                                    if (!questions[j].dateInterval) {
                                        line.push(``);
                                    }
                                    else {
                                        line.push(``);
                                        line.push(``);
                                    }
                                    break;
                                default:
                                    break;
                            }
                        }
                        else {
                            switch (questions[j].type) {
                                case 'QUESTION_VALUE':
                                    line.push(questionAnswer.value);
                                    break;
                                case 'QUESTION_CHOICE':
                                    if (questions[j].linesNumber > 1) {
                                        for (let k = 0; k < questions[j].linesNumber; k++) {
                                            for (let l = 0; l < questions[j].columnsNumber; l++) {
                                                if (questionAnswer.choice === null || questionAnswer.choice[(+questions[j].columnsNumber * k) + l] === false) line.push(`0`);
                                                else line.push('1');
                                            }
                                        }
                                    }
                                    else {
                                        for (let k = 0; k < questions[j].columnsNumber; k++) {
                                            if (questionAnswer.choice === null || questionAnswer.choice[k] === false) line.push('0');
                                            else line.push('1');
                                        }
                                    }
                                    break;
                                case 'QUESTION_FILE':
                                    if (questionAnswer.file === null){
                                        line.push(``);
                                        line.push(``);
                                    }
                                    else {
                                        line.push(questionAnswer.file[0]);
                                        line.push(questionAnswer.file[1]);
                                    }
                                    break;
                                case 'QUESTION_RANK':
                                    for (let k = 0; k < questions[j].numberOfValues; k++) {
                                        if (questionAnswer.rank === null) line.push('');
                                        else {
                                            let position = -1;
                                            for (let l = 0; l < questionAnswer.rank.length; l++) {
                                                if (questions[j].values[k] === questionAnswer.rank[l]) {
                                                    position = l;
                                                    break;
                                                }
                                            }
                                            if (position === -1) line.push('');
                                            else line.push(position + 1);
                                        }
                                    }
                                    break;
                                case 'QUESTION_SCALE':
                                    if (questionAnswer.scale === null) line.push('');
                                    else line.push(questionAnswer.scale)
                                    break;
                                case 'QUESTION_DATE':
                                    if (questions[j].dateInterval) {
                                        if (questionAnswer.date === null || questionAnswer.date[0] === null) line.push('');
                                        else line.push(questionAnswer.date[0]);
                                        if (questionAnswer.date === null || questionAnswer.date[1] === null) line.push('');
                                        else line.push(questionAnswer.date[1]);
                                    }
                                    else {
                                        if (questionAnswer.date === null) line.push('');
                                        else line.push(questionAnswer.date);
                                    }
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                }
                data.push(line);
            }
        }
        return data;
    };

    downloadFiles = (hangout) => {
        let formData = new FormData();
        formData.append('surveyId', this.state.survey.id);
        formData.append('hangout', hangout);

        fetch(`http://${HOST_ADDRESS.IP}/zip`, {
            method: 'POST',
            body: formData
        }).then(
            (response) => {
                response.blob().then(
                    (responseBlob) => {
                        if(responseBlob.size === 3){
                            this.displaySnackbar(`Aucun fichier à télécharger`);
                        }
                        else {
                            window.location.replace(URL.createObjectURL(responseBlob));
                        }
                    }, (error) => {
                        this.displaySnackbar(`impossible de télécharger les fichiers reçus`);
                    });
            },
            (error) => {
                this.displaySnackbar(`Impossible de joindre le serveur`);
            }
        );
    };

    render = () => {
        if(this.props.data && this.props.data.loading){
            return (
                <div className={`AnswerDownloaderRoot`}>
                    <div className={`AnswerDownloaderLoading`}>
                        <img
                            src={Spinner}
                            role={`presentation`}
                            alt={`Chargement des données, veuillez patienter...`}
                        />
                    </div>
                </div>
            );
        }

        if(this.props.data && this.props.data.error){
            return (
                <div className={`AnswerDownloaderRoot`}>
                    <div className={`AnswerDownloaderError`}>
                        {`Une erreur est survenue de manière totalement improbable. Si le problème persiste, contactez votre administrateur réseau.`}
                    </div>
                </div>
            );
        }

        let buttonsDiv = null;
        if (this.state.survey.hangout) {
            let dataFalse = this.formatCSVV2(false);
            let dataTrue = this.formatCSVV2(true);
            buttonsDiv = (
                <div className={`AnswerDownloaderBody`}>
                    <div className={`AnswerDownloaderButtonsDiv`}>
                        <CSVLink data={dataFalse} separator={";"} filename={`${this.state.survey.name}_encadre.csv`} className={`AnswerDownloaderButton`}>
                                {`Télécharger les réponses au questionnaire encadré`}
                        </CSVLink>
                        <CSVLink data={dataTrue} separator={";"} filename={`${this.state.survey.name}_sorties.csv`} className={`AnswerDownloaderButton`}>
                            {`Télécharger les réponses au questionnaire de sortie`}
                        </CSVLink>
                    </div>
                    <div className={`AnswerDownloaderButtonsDiv`}>
                        <button className={`AnswerDownloaderButton`} onClick={() => this.downloadFiles(false)}>
                            {`Télécharger les fichiers liés au questionnaire encadré`}
                        </button>
                        <button className={`AnswerDownloaderButton`} onClick={() => this.downloadFiles(true)}>
                            {`Télécharger les fichiers liés au questionnaire de sortie`}
                        </button>
                    </div>
                </div>
            );
        }
        else {
            let dataFalse = this.formatCSVV2(false);
            buttonsDiv = (
                <div className={`AnswerDownloaderBody`}>
                    <div className={`AnswerDownloaderButtonsDiv`}>
                        <CSVLink data={dataFalse} separator={";"} filename={`${this.state.survey.name}_encadre.csv`} className={`AnswerDownloaderButton`}>
                            {`Télécharger les réponses au questionnaire`}
                        </CSVLink>
                    </div>
                    <div className={`AnswerDownloaderButtonsDiv`}>
                        <button className={`AnswerDownloaderButton`} onClick={() => this.downloadFiles(false)}>
                            {`Télécharger les fichiers liés au questionnaire`}
                        </button>
                    </div>
                </div>
            );
        }
        return (
            <div className={`AnswerDownloaderRoot`}>
                <div className={`AnswerDownloaderHeader`}>
                    <div className={`AnswerDownloaderName`}>
                        {this.state.survey.name}
                    </div>
                    {this.state.survey.description === `` ? 
                    null:
                    <div className='AnswerDownloaderDescription'>
                        {this.state.survey.description}
                    </div>
                }
                <div className='AnswerDownloaderImageDiv'>
                    <img className='AnswerDownloaderImage' src={this.state.survey.image} alt=''/>
                </div>
                </div>
                {buttonsDiv}
                <Snackbar
					display={this.state.snackbar.display}
					message={this.state.snackbar.message}
				/>
            </div>
        );
    };
} export default compose(graphql(SurveyAnswers, { options: (ownProps) => ({ variables: { id: ownProps.match.params.id } }) }))(withRouter(AnswerDownloader));