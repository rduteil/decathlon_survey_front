import React, { Component } from 'react';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { graphql, compose } from 'react-apollo';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Snackbar from '../../imports/components/Snackbar';
import ConfirmationPopUp from '../../imports/components/ConfirmationPopUp';
import SurveyFormHeader from './components/SurveyFormHeader';
import SurveyFormBody from './components/SurveyFormBody';

import { HOST_ADDRESS } from '../../imports/helpers/Constants';
import { FindSurveyFromLink, AddSurveyAnswer } from '../../imports/helpers/GraphQLStatements';
import { formatToQuestionAnswer, makeSectionWritable, makeQuestionWritable } from '../../imports/helpers/Format';
import Spinner from '../../imports/images/spinner.gif';

import './styles/SurveyForm.css';

class SurveyForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            answers: [],
            files: [],
            messages: [],
            showHangout: false,

            confirmationPopUp: {
				display: false,
				message: '',
				confirmText: null,
				cancelText: null,
				handleConfirm: null,
				handleCancel: null,
            },
            activationKey: '',
            checked: null,

            snackbar: {
				display: false,
				message: '',
            },

            sending: false,
        };
    }

    componentWillReceiveProps = (newProps) => {
        if(newProps.FindSurveyFromLink.surveyFromLink === undefined) return;
        
        let temporaryRows = [];
        for(let i = 0; i < newProps.FindSurveyFromLink.surveyFromLink.sections.length; i++){
            temporaryRows.push(Object.assign(makeSectionWritable(newProps.FindSurveyFromLink.surveyFromLink.sections[i]), {isSection: true, questions: [],}));
            for(let j = 0; j < newProps.FindSurveyFromLink.surveyFromLink.sections[i].questions.length; j++){
                temporaryRows[i].questions.push(Object.assign(makeQuestionWritable(newProps.FindSurveyFromLink.surveyFromLink.sections[i].questions[j]), {isSection: false, sectionIndex: newProps.FindSurveyFromLink.surveyFromLink.sections[i].index}));
            }
        }
        for(let i = 0; i < newProps.FindSurveyFromLink.surveyFromLink.questions.length; i++){
                temporaryRows.push(Object.assign(makeQuestionWritable(newProps.FindSurveyFromLink.surveyFromLink.questions[i]), {isSection: false, sectionIndex: 0}));
        }
        temporaryRows.sort(this.sortByIndex);

        let answers = [];
        let files = [];
        let globalIndexHangout = 0;
        let globalIndexNoHangout = 0;

        for(let i = 0; i < temporaryRows.length; i++){
            if(temporaryRows[i].isSection){
                for(let j = 0; j < temporaryRows[i].questions.length; j++){
                    answers.push({
                        id: temporaryRows[i].questions[j].id,
                        index: temporaryRows[i].questions[j].index,
                        sectionIndex: temporaryRows[i].index,
                        globalIndex: temporaryRows[i].hangout === false ? ++globalIndexNoHangout: ++globalIndexHangout,
                        hangout: temporaryRows[i].questions[j].hangout,
                        name: temporaryRows[i].questions[j].name,
                        type: temporaryRows[i].questions[j].type,
                        mandatory: temporaryRows[i].questions[j].mandatory,
                        answer: null,                    
                    });
                    if(temporaryRows[i].questions[j].type === `QUESTION_FILE`){
                        files.push({
                            id: temporaryRows[i].questions[j].id,
                            index: temporaryRows[i].questions[j].index,
                            sectionIndex: temporaryRows[i].index,
                            globalIndex: temporaryRows[i].hangout === false ? ++globalIndexNoHangout: ++globalIndexHangout,
                            hangout: temporaryRows[i].hangout,
                            name: temporaryRows[i].questions[j].name,
                            mandatory: temporaryRows[i].questions[j].mandatory,
                            file64: null,
                            filename: null,
                            filetype: null,
                            fileformat: null,
                        });
                    }
                }

            }
            else {
                answers.push({
                    id: temporaryRows[i].id,
                    index: temporaryRows[i].index,
                    sectionIndex: 0,
                    globalIndex: temporaryRows[i].hangout === false ? ++globalIndexNoHangout: ++globalIndexHangout,
                    hangout: temporaryRows[i].hangout,
                    name: temporaryRows[i].name,
                    type: temporaryRows[i].type,
                    mandatory: temporaryRows[i].mandatory,
                    answer: null,                    
                });
                if(temporaryRows[i].type === `QUESTION_FILE`){
                    files.push({
                        id: temporaryRows[i].id,
                        index: temporaryRows[i].index,
                        sectionIndex: 0,
                        globalIndex: temporaryRows[i].hangout === false ? ++globalIndexNoHangout: ++globalIndexHangout,
                        hangout: temporaryRows[i].hangout,
                        name: temporaryRows[i].name,
                        mandatory: temporaryRows[i].mandatory,
                        file64: null,
                        filename: null,
                        filetype: null,
                        fileformat: null,
                    });
                }                
            }
        }

        this.setState({
            answers: answers,
            files: files,
        });
    };

    componentWillUnmount = () => {
        clearInterval(this.snackbarInterval);
    };

    sortByIndex = (rowA, rowB) => {
        return(rowA.index - rowB.index);
    };

    toggleShowHangout = (showHangout) => {
        this.setState({
            showHangout: showHangout,
        });
    };

	removeSnackbar = () => {
		this.setState({
			snackbar: {
				display: false,
				message: '',			}
		}, () => clearInterval(this.snackbarInterval));
	};

    handleChangeAnswer = (id, answer) => {
        let answers = this.state.answers.slice();
        for(let i = 0; i < answers.length; i++){
            if(answers[i].id === id){
                answers[i].answer = answer;
                break;
            }
        }
        this.setState({
            answers: answers,
        });
    };

    handleChangeFile = (id, file64, filename, filetype, fileformat) => {
        let files = this.state.files.slice();
        for(let i = 0; i < files.length; i++){
            if(files[i].id === id){
                files[i].file64 = file64;
                files[i].filename = filename;
                files[i].filetype = filetype;
                files[i].fileformat = fileformat;
                break;
            }
        }
        let answers = this.state.answers.slice();
        for(let i = 0; i< answers.length; i++){
            if(answers[i].id === id){
                let answer = answers[i].answer === null ? [``, ``]: answers[i].answer.slice();
                answer[0] = filename;
                answers[i].answer = answer;
                break;
            }
        }

        this.setState({
            files: files,
            answers: answers,
        });
    };

    handleSubmit = () => {
        let messages = [];
        for(let i = 0; i < this.state.answers.length; i++){
            if(this.state.answers[i].mandatory === true && this.state.answers[i].hangout === this.state.showHangout){
                if(!this.checkIfAnswered(this.state.answers[i].answer, this.state.answers[i].id, this.state.answers[i].sectionIndex)){
                    let newMessage = `La question ${this.state.answers[i].globalIndex} : ${this.state.answers[i].name} est obligatoire`;
                    let existsAlready = false;
                    for(let j = 0; j < messages.length; j++){
                        if(this.getDifferences(messages[j], newMessage) === 0){
                            existsAlready = true;
                            break;
                        }
                    }
                    if(!existsAlready){
                        messages.push(newMessage);
                    }
                }
            }
        }
        if(messages.length > 0){
            this.setState({
                messages: messages,
            });
        }
        else {
            this.setState({
                confirmationPopUp: {
                    display: true,
                    message: `Voulez vous vraiment envoyer vos réponses au questionnaire ?`,
                    confirmText: `Oui`,
                    cancelText: `Non`,
                    handleConfirm: () => {
                        this.setState({
                            confirmationPopUp: {
                                display: false,
                                message: '',
                                confirmText: null,
                                cancelText: null,
                                handleConfirm: null,
                                handleCancel: null,
                            },
                        }, () => this.sendAnswer());
                    },
                    handleCancel: () => {
                        this.setState({
                            confirmationPopUp: {
                                display: false,
                                message: '',
                                confirmText: null,
                                cancelText: null,
                                handleConfirm: null,
                                handleCancel: null,
                            },            
                        });
                    },
                },
            })
        }
    };

    sendAnswer = async () => {
        this.setState({
            sending: true,
        });
        let answers = [];
        this.state.answers.forEach((answer) => {
            if(answer.hangout === this.state.showHangout) answers.push(formatToQuestionAnswer(answer))
        });
        for(let i = 0; i < this.state.files.length; i++){
            if(this.state.files[i].file64 !== null && this.state.files[i].hangout === this.state.showHangout){
                let file = this.state.files[i].file64.split(',')[1];
                await this.sendSingleFile(file, this.state.files[i].filename).then(
                    (data) => {
                        for(let j = 0; j < answers.length; j++){
                            if(answers[j].questionIndex === this.state.files[i].index){
                                let file = answers[j].file.splice();
                                file[0] = data;
                                answers[j].file = file;
                                break;
                            }
                        }
                    }
                ).catch(
                    () => {
                        this.setState({
                            snackbar: {
                                display: true,
                                message: `Problème de connexion, impossible d'envoyer les réponses`,
                            },
                            sending: false,
                        }, () => this.snackbarInterval = setInterval(() => this.removeSnackbar(), 5.25 * 1000));
                    }
                );
            }
        }
        let input = {
            'surveyId': this.props.FindSurveyFromLink.surveyFromLink.id,
            'hangout': this.state.showHangout,
            'questionAnswers': answers,
        };
        this.props.AddSurveyAnswer({variables: {input}}).then(
            () => {
                this.props.history.push(`/congrats/${this.props.FindSurveyFromLink.surveyFromLink.link}`);
            },
            () => {
            this.setState({
                snackbar: {
                    display: true,
                    message: `Problème de connexion, impossible d'envoyer les réponses`,
                },
                sending: false,
            }, () => this.snackbarInterval = setInterval(() => this.removeSnackbar(), 5.25 * 1000));
        });
    };

    sendSingleFile = (file, filename) => {
        return new Promise((resolve, reject) => {
            if(file.length < 1) resolve(filename);
            let splittedFile = [file.substring(0, 2097152), file.substring(2097152)];
            file = splittedFile[1];
            let formData = new FormData();
            formData.append('file', splittedFile[0]);
            formData.append('filename', filename);
            formData.append('surveyId', this.props.FindSurveyFromLink.surveyFromLink.id);
            formData.append('hangout', this.state.showHangout);
            fetch(`http://${HOST_ADDRESS.IP}/save`, {
                method: 'POST',
                body: formData
            }).then(
                (response) => {
                    response.text().then(
                        (data) => {
                            if(file.length < 1){
                                resolve(data);
                            }
                            else {
                                this.sendSingleFile(file, data).then(() => resolve(data));
                            }
                        },
                        (error) => {
                            reject(1);
                        }
                    );
                }, 
                (error) => {
                    reject(1);
                },
            );
        });
    };

    checkIfAnswered = (answer, id, sectionIndex) => {
        let question = null;
        if(sectionIndex === 0){
            for(let i = 0; i < this.props.FindSurveyFromLink.surveyFromLink.questions.length; i++){
                if(this.props.FindSurveyFromLink.surveyFromLink.questions[i].id === id){
                    question = this.props.FindSurveyFromLink.surveyFromLink.questions[i];
                    break;
                }
            }
        }
        else {
            for(let i = 0; i < this.props.FindSurveyFromLink.surveyFromLink.sections.length; i++){
                if(this.props.FindSurveyFromLink.surveyFromLink.sections[i].index === sectionIndex && this.props.FindSurveyFromLink.surveyFromLink.sections[i].hangout === this.state.showHangout){
                    for(let j = 0; j < this.props.FindSurveyFromLink.surveyFromLink.sections[i].questions.length; j++){
                        if(this.props.FindSurveyFromLink.surveyFromLink.sections[i].questions[j].id === id){
                            question = this.props.FindSurveyFromLink.surveyFromLink.sections[i].questions[j];
                            break;
                        }
                    }
                    break;
                }
            }
        }

        switch(question.type){
            case 'QUESTION_VALUE':
                if(answer === null) return false;
                if(question.askFor === 'number' && isNaN(+answer)) return false;
                if(question.askFor === 'number') return true;
                return !!answer.length;
            case 'QUESTION_CHOICE':
                if(answer === null) return false;
                let numberChecked = 0;
                for(let i = 0; i < answer.length; i++) if(answer[i] === true) numberChecked++;
                if (numberChecked !== (+question.linesNumber * +question.numberOfAnswers)) return false;
                return true;
            case 'QUESTION_RANK':
                if(answer === null) return false;
                if(answer.length < question.numberOfValues) return false;
                return true;
            case 'QUESTION_FILE':
                if(question.commentary && (answer === null || answer === '')) return false;
                for(let i = 0; i < this.state.files.length; i++){
                    if(this.state.files[i].id === id){
                        if(this.state.files[i].file64 === null) return false;
                    }
                }
                if(!question.commentary) return true;
                return !!answer.length;
            case 'QUESTION_SCALE':
                if(answer === null) return false;
                return true;
            case 'QUESTION_DATE':
                if(answer === null) return false;
                if(answer[0].length === 0) return false;
                if(question.dateInterval && answer[1].length === 0) return false;
                return true;
            default:
                return true;
        }
    };

    handleRemoveMessage = (i) => {
        let messages = this.state.messages.slice();
        messages.splice(i, 1);
        this.setState({
            messages: messages,
        })
    };

    getDifferences = (a, b) => {
        var i = 0;
        var j = 0;
        var result = "";
        while (j < b.length){
            if (a[i] !== b[j] || i === a.length)
                result += b[j];
            else
                i++;
            j++;
        }
        return result.length;
    };

    onChange = (event) => {
        this.setState({
            activationKey: event.target.value,
        });
    };

    onKeyPressed = (event) => {
        if(event.key === `Enter`){
            this.checkActivationKey();
        }
    };

    checkActivationKey = () => {
        this.setState({
            checked: this.state.activationKey === this.props.FindSurveyFromLink.surveyFromLink.activationKey,
        });
    };

    render = () => {
		if (this.props.FindSurveyFromLink.loading){
			return(
				<div className={`SurveyFormRoot`}>
					<div className={`SurveyFormLoading`}>
                        <img
                            src={Spinner}
                            role={`presentation`}
                            alt={`Chargement des données, veuillez patienter`}
                        />
					</div>
				</div>
			);
        }
        
        if(this.props.FindSurveyFromLink.error){
            return(
                <div className={`SurveyFormRoot`}>
					<div className={`SurveyFormError`}>
                    	{`Le questionnaire est introuvable, il a probablement été supprimé.`}
					</div>
                </div>
            );
        }

        if(this.state.sending){
			return(
				<div className={`SurveyFormRoot`}>
					<div className={`SurveyFormLoading`}>
                        <img
                            src={Spinner}
                            role={`presentation`}
                            alt={`Envoi de la réponse, veuillez patienter`}
                        />
					</div>
				</div>
			);            
        }

        let deactivationDate = moment.utc(this.props.FindSurveyFromLink.surveyFromLink.deactivationDate, `DD-MM-YYYY HH:mm`);
        let activationDate = moment.utc(this.props.FindSurveyFromLink.surveyFromLink.activationDate, `DD-MM-YYYY HH:mm`);

        if(
            (moment().isAfter(deactivationDate) || moment().isBefore(activationDate)) &&
            this.props.FindSurveyFromLink.surveyFromLink.activationKey.replace(/\s/g, ``).length &&
            (this.state.checked !== true)
        ){
            return(
                <div className={`SurveyFormRoot`}>
                    <div className={`SurveyFormError`}>
                        {`Ce questionnaire n'est pas actif à l'heure actuelle, veuillez entrer le mot de passe pour y répondre :`}
                        <div className={`SurveyFormInputDiv`}>
                            <input
                                className={`SurveyFormPassword`}
                                name={`activationKey`}
                                type={`text`}
                                value={this.state.activationKey}
                                onChange={this.onChange}
                                onKeyPress={(event) => this.onKeyPressed(event)}
                                placeholder={`Entrez le mot de passe...`}
                            />
                            <button className={`SurveyFormSubmitPassword`} onClick={() => this.checkActivationKey()}>
                                {`Accéder au questionnaire`}
                            </button>
                        </div>
                        {this.state.checked === false ?
                            <div className={`SurveyFormWrong`}>
                                {`Mot de passe incorrect, accès refusé`}
                            </div>:
                            null
                        }
                    </div>
                </div>
            );
        }

        let items = this.state.messages.map((message, i) => (
            <div key={message} className={`MessageBar`} onClick={() => this.handleRemoveMessage(i)}>
                {message}
            </div>
        ));
        
        return(
            <div className={`SurveyFormRoot`}>
                <ReactCSSTransitionGroup
                    className={`MessageBarDiv`}
                    transitionName={`MessageBar`}
                    transitionAppear={true}
                    transitionAppearTimeout={500}
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>
                    {items}
                </ReactCSSTransitionGroup>
                <SurveyFormHeader
                    name={this.props.FindSurveyFromLink.surveyFromLink.name}
                    description={this.props.FindSurveyFromLink.surveyFromLink.description}
                    image={this.props.FindSurveyFromLink.surveyFromLink.image}
                    showHangout={this.state.showHangout}
                />
                <SurveyFormBody
                    sections={this.props.FindSurveyFromLink.surveyFromLink.sections.slice()}
                    questions={this.props.FindSurveyFromLink.surveyFromLink.questions.slice()}
                    hangout={this.props.FindSurveyFromLink.surveyFromLink.hangout}
                    showHangout={this.state.showHangout}
                    toggleShowHangout={this.toggleShowHangout}
                    answers={this.state.answers}
                    handleChangeAnswer={this.handleChangeAnswer}
                    handleChangeFile={this.handleChangeFile}
                />
                <div className={`SurveyFormSubmitDiv`}>
                    <button className={`SurveyFormSubmitAnswer`} onClick={this.handleSubmit}>
                        {`Envoyer la réponse`}
                    </button>
                </div>
                {this.state.confirmationPopUp.display ? 
					<ConfirmationPopUp
						message={this.state.confirmationPopUp.message}
						confirmText={this.state.confirmationPopUp.confirmText}
						cancelText={this.state.confirmationPopUp.cancelText}
						handleConfirm={this.state.confirmationPopUp.handleConfirm}
						handleCancel={this.state.confirmationPopUp.handleCancel}
					/> : 
					null
                }
                <Snackbar
					display={this.state.snackbar.display}
					message={this.state.snackbar.message}
				/>
            </div>
        );
    };
} export default compose(graphql(FindSurveyFromLink, {options: (ownProps) => ({variables: {link: ownProps.match.params.link}}), name: `FindSurveyFromLink`}), AddSurveyAnswer)(withRouter(SurveyForm));