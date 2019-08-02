/** Importation des librairies externes */
import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { graphql, compose } from 'react-apollo';

import Snackbar from '../../imports/components/Snackbar';
import Commandbar from '../../imports/components/Commandbar';
import ConfirmationPopUp from '../../imports/components/ConfirmationPopUp';
import SurveyExplorer from './components/SurveyExplorer';
import SurveyHeader from './components/SurveyHeader';
import SurveyBody from './components/SurveyBody';
import LibraryPopUp from './components/LibraryPopUp';

import { getRoles, getUsername } from '../../imports/helpers/Tokens';
import { formatToQuestion, formatToSection, makeQuestionWritable, makeSectionWritable } from '../../imports/helpers/Format';
import { FindSurvey, UpdateSurvey, AddQuestionLibrary, RemoveQuestionLibrary } from '../../imports/helpers/GraphQLStatements';
import Spinner from '../../imports/images/spinner.gif';

import './styles/SurveyUpdater.css';

class SurveyUpdaterStatementsLess extends Component {
	constructor(props){
		super(props);

		this.state = {
			dx: 0,

			id: null,
			name: null,
			reference: null,
			link: null,
			image: null,
			description: null,
			hangout: null,
			activationDate: null,
			deactivationDate: null,
			activationKey: null,
			language: null,
			sections: null,
			questions: null,

			showHangout: false,

			confirmationPopUp: {
				display: false,
				message: ``,
				confirmText: null,
				cancelText: null,
				handleConfirm: null,
				handleCancel: null,
				object: null,
			},

			libraryPopUp: {
				display: false,
				confirmText: null,
				cancelText: null,
				handleConfirm: null,
				handleCancel: null,
				sectionIndex: null,
			},

			snackbar: {
				display: false,
				message: ``,
			},
		};
	}

	componentWillReceiveProps = (newProps) => {
		if(newProps.data.survey === undefined) return;

		let sections = [];
		for(let i = 0; i < newProps.data.survey.sections.length; i++){
			sections.push(Object.assign(makeSectionWritable(newProps.data.survey.sections[i]), {questions: []}));
			for(let j = 0; j < newProps.data.survey.sections[i].questions.length; j++){
				sections[i].questions.push(makeQuestionWritable(newProps.data.survey.sections[i].questions[j]));
			}
		}

		let questions = [];
		for(let i = 0; i < newProps.data.survey.questions.length; i++){
			questions.push(makeQuestionWritable(newProps.data.survey.questions[i]));
		}

		this.setState({
			id: newProps.data.survey.id,
			name: newProps.data.survey.name,
			reference: newProps.data.survey.reference,
			link: newProps.data.survey.link,
			image: newProps.data.survey.image,
			description: newProps.data.survey.description,
			hangout: newProps.data.survey.hangout,
			activationDate: newProps.data.survey.activationDate,
			deactivationDate: newProps.data.survey.deactivationDate,
			activationKey: newProps.data.survey.activationKey,
			language: newProps.data.survey.language,
			sections: sections,
			questions: questions,
		});
	};

    componentDidMount = () => {
		this.autosaveInterval = setInterval(() => this.handleSave(true, false, true), 5 * 60 * 1000);
		window.addEventListener('keydown', this.handleKeyPressed);
	};

    componentWillUnmount = () => {
		clearInterval(this.autosaveInterval);
		clearInterval(this.snackbarInterval);
		window.removeEventListener('keydown', this.handleKeyPressed);
	};

	sortByIndex = (rowA, rowB) => {
		return(rowA.index - rowB.index);
	};

	getLastIndex = (sectionIndex) => {
		let lastIndex = 0;
		if(sectionIndex === 0){
			for(let i = 0; i < this.state.sections.length; i++){
				if(this.state.sections[i].hangout === this.state.showHangout){
					lastIndex++;
				}
			}
			for(let i = 0; i < this.state.questions.length; i++){
				if(this.state.questions[i].hangout === this.state.showHangout){
					lastIndex++;
				}
			}
		}
		else {
			for(let i = 0; i < this.state.sections.length; i++){
				if(this.state.sections[i].hangout === this.state.showHangout && this.state.sections[i].index === sectionIndex){
					for(let j = 0; j < this.state.sections[i].questions.length; j++){
						if(this.state.sections[i].questions[j].hangout === this.state.showHangout) lastIndex++;
					}
					break;
				}
			}
		}
		return lastIndex;
	};

	handleKeyPressed = (event) => {
		if ((event.ctrlKey || event.metaKey) && String.fromCharCode(event.which).toLowerCase() === 's') {
			event.preventDefault();
			document.activeElement.blur();
			this.handleSave(true, false, false);
		}
	};

	handleSave = (save, exit, auto) => {
		if(save){
			clearInterval(this.autosaveInterval);
			this.autosaveInterval = setInterval(() => this.handleSave(true, false, true), 5 * 60 * 1000);
	
			let id = this.state.id;
			let sections = [];
			this.state.sections.forEach((section) => {
				let formattedSection = formatToSection(section);
				formattedSection.questions = [];
				section.questions.forEach((question) => {
					formattedSection.questions.push(formatToQuestion(question));
				});
				sections.push(formattedSection);
			});
			let questions = [];
			this.state.questions.forEach((question) => {
				questions.push(formatToQuestion(question));
			});
			
			let input = {
				name: this.state.name, 
				reference: this.state.reference,
				image: this.state.image,
				description: this.state.description,
				hangout: this.state.hangout,
				activationDate: this.state.activationDate,
				deactivationDate: this.state.deactivationDate,
				activationKey: this.state.activationKey,
				language: this.state.language,
				folderId: 0,
				sections: sections,
				questions: questions,
			};
			this.props.UpdateSurvey({variables: {id, input}}).then(
				() => {
					this.displaySnackbar(`Sauvegarde ${auto ? `automatique `: ``}réussie${exit ? `, retour à l'explorateur`: ``}`);
					if(exit){
						this.props.data.refetch().then(
							() => {
								setTimeout(() => {
									this.props.history.push(`/surveys`);
								}, 2000);
							},
							() => {
								setTimeout(() => {
									this.props.history.push(`/surveys`);
								}, 2000);
							},
						);
					}
				},
				() => {
					this.displaySnackbar(`Impossible d'enregistrer, serveur inaccessible`)
				},
			);
		}
		else if(exit){
			this.props.history.push(`/surveys`);
		}	
	};

	handleToggleHangout = (event) => {
		let isTrue = (event.target.value === 'true');

		this.setState({
			showHangout: isTrue,
			scrollingMethods: [],
		});
	};

	displaySnackbar = (message) => {
		if(!this.state.snackbar.display){
			this.setState({
				snackbar: {
					display: true,
					message: message,
				}				
			}, () => this.snackbarInterval = setInterval(() => this.removeSnackbar(), 5.25 * 1000));
		}
	};

	removeSnackbar = () => {
		this.setState({
			snackbar: {
				display: false,
				message: '',			}
		}, () => clearInterval(this.snackbarInterval));
	};

	scrollToRow = (row) => {
		row.scrollingMethod();
	};

	storeScrollingMethod = (isSection, index, sectionIndex, hangout, method) => {
		this.setState((previousState) => {
			if(isSection){
				let sections = previousState.sections.slice();
				for(let i = 0; i < sections.length; i++){
					if(sections[i].index === index && sections[i].hangout === hangout){
						sections[i].scrollingMethod = method;
						break;
					}
				}
				return {
					sections: sections,
				};
			}
			else {
				if(sectionIndex === 0){
					let questions = previousState.questions.slice();
					for(let i = 0; i < questions.length; i++){
						if(questions[i].hangout === hangout && questions[i].index === index){
							questions[i].scrollingMethod = method;
							break;
						}
					}
					return {
						questions: questions,
					};
				}
				else {
					let sections = previousState.sections.slice();
					for(let i = 0; i < sections.length; i++){
						if(sections[i].index === sectionIndex && sections[i].hangout === hangout){
							let questions = sections[i].questions.slice();
							for(let j = 0; j < questions.length; j++){
								if(questions[j].index === index && questions[j].hangout === hangout){
									questions[j].scrollingMethod = method;
									break;
								}
							}
							sections[i].questions = questions;
							break;
						}
					}
					return {
						sections: sections,
					};
				}
			}
		});
	};

	resize = (dx) => {
		this.setState({
			dx: dx,
		});
	};

	updateHeader = (fieldToChange, newValue) => {
		switch(fieldToChange){
			case `name`:
				this.setState({name: newValue,});
				break;
			case `reference`:
				this.setState({reference: newValue,});
				break;
			case `image`:
				this.setState({image: newValue,});
				break;
			case `description`:
				this.setState({description: newValue,});
				break;
			case `hangout`:
				if(newValue === false){
					this.setState({hangout: newValue, showHangout: false,});
				}
				else {
					this.setState({hangout: newValue,});
				}
				break;
			case `activationDate`:
				this.setState({activationDate: newValue});
				break;
			case `deactivationDate`:
				this.setState({deactivationDate: newValue});
				break;
			case `activationKey`:
				this.setState({activationKey: newValue});
				break;
			case `language`:
				this.setState({language: newValue});
				break;
			default:
				break;
		}
	};

	addSection = () => {
		let sections = this.state.sections.slice();
		sections.push({
			name: `Nouvelle section ${this.getLastIndex(0) + 1}`,
			index: this.getLastIndex(0) + 1,
			image: ``,
			description: ``,
			hangout: this.state.showHangout,
			questions: [],
		});

		this.setState({
			sections: sections,
		});
	};

	updateSection = (index, fieldToChange, newValue) => {
		let sections = this.state.sections.slice();
		let questions = this.state.questions.slice();

		if(fieldToChange === `index`){
			/** Check if given value is not stupid as fuck */
			newValue = Math.min(newValue, this.getLastIndex(0));
			newValue = Math.max(newValue, 1);
			if(newValue === index){
				this.forceUpdate();
				return;
			}

			let sourceIndex = 0;
			for(let i = 0; i < sections.length; i++){
				if(sections[i].hangout === this.state.showHangout && sections[i].index === index){
					sourceIndex = i;
					break;
				}
			}

			if(newValue > index){
				for(let i = 0; i < sections.length; i++){
					if(sections[i].hangout === this.state.showHangout && sections[i].index > index && sections[i].index <= newValue){
						sections[i].index--;
					}
				}
				for(let i = 0; i < questions.length; i++){
					if(questions[i].hangout === this.state.showHangout && questions[i].index > index && questions[i].index <= newValue){
						questions[i].index--;
					}					
				}
			}
			else {
				for(let i = 0; i < sections.length; i++){
					if(sections[i].hangout === this.state.showHangout && sections[i].index >= newValue && sections[i].index < index){
						sections[i].index++;
					}
				}
				for(let i = 0; i < questions.length; i++){
					if(questions[i].hangout === this.state.showHangout && questions[i].index >= newValue && questions[i].index < index){
						questions[i].index++;
					}
				}
			}
			sections[sourceIndex].index = newValue;
			sections.sort(this.sortByIndex);
			questions.sort(this.sortByIndex);
		}
		else {
			for(let i = 0; i < sections.length; i++){
				if(sections[i].hangout === this.state.showHangout && sections[i].index === index){
					sections[i] = Object.assign(sections[i], {[fieldToChange]: newValue});
					break;
				}
			}
		}

		this.setState({
			sections: sections,
			questions: questions,
		});	
	};

	removeSection = (index, name) => {
		this.setState({
            confirmationPopUp: {
                display: true,
                message: `Voulez vous vraiment supprimer la section ${name} et son contenu de manière définitive ?`,
                confirmText: `Oui`,
                cancelText: `Non`,
                handleConfirm: () => {
					let sections = this.state.sections.slice();
					let questions = this.state.questions.slice();

					for(let i = 0; i < sections.length; i++){
						if(sections[i].hangout === this.state.showHangout && sections[i].index === index)
						sections.splice(i, 1);
					}

					for(let i = 0; i < sections.length; i++){
						if(sections[i].hangout === this.state.showHangout && sections[i].index > index){
							sections[i].index--;
						}
					}
					for(let i = 0; i < questions.length; i++){
						if(questions[i].hangout === this.state.showHangout && questions[i].index > index){
							questions[i].index--;
						}
					}

					this.setState({
						sections: sections,
						questions: questions,
			
						confirmationPopUp: {
							display: false,
							message: ``,
							confirmText: null,
							cancelText: null,
							handleConfirm: null,
							handleCancel: null,
						},
					});
				},
                handleCancel: () => {
					this.setState({
						confirmationPopUp: {
							display: false,
							message: ``,
							confirmText: null,
							cancelText: null,
							handleConfirm: null,
							handleCancel: null,
						},
					});
				},
            },
		});
	};

	addLibraryQuestion = (sectionIndex) => {
		this.setState({
			libraryPopUp: {
				display: true,
				confirmText: `Valider`,
				cancelText: `Annuler`,
				handleConfirm: (sectionIndex, addList, removeList) => {
					if(removeList.length > 0){
						for(let i = 0; i < removeList.length; i++){
							this.props.RemoveQuestionLibrary({variables: {id: removeList[i]}});
						}
						if(addList.length === 0){
							this.setState({
								libraryPopUp: {
									display: false,
									confirmText: null,
									cancelText: null,
									handleConfirm: null,
									handleCancel: null,
									sectionIndex: null,
								},
							});
						}
					}
					if(addList.length > 0){
						let sections = this.state.sections.slice();
						let questions = null;
						if(sectionIndex === 0){
							questions = this.state.questions.slice();
						}
						else {
							for(let i = 0; i < sections.length; i++){
								if(sections[i].hangout === this.state.showHangout && sections[i].index === sectionIndex){
									questions = sections[i].questions.slice();
									break;
								}
							}
						}
	
						let lastIndex = this.getLastIndex(sectionIndex);
						for(let i = 0; i < addList.length; i++){
							questions.push({
								name: addList[i].name,
								index: ++lastIndex,
								description: addList[i].description,
								hangout: this.state.showHangout,
								isSection: false,
								mandatory: false,
								type: addList[i].type,

								askFor: addList[i].askFor,
								linesNumber: addList[i].linesNumber,
								columnsNumber: addList[i].columnsNumber,
								linesLabels: addList[i].linesLabels,
								columnsLabels: addList[i].columnsLabels,
								linesImages: addList[i].linesImages,
								columnsImages: addList[i].columnsImages,
								numberOfAnswers: addList[i].numberOfAnswers,
								valuesAsImages: addList[i].valuesAsImages,
								numberOfValues: addList[i].numberOfValues,
								values: addList[i].values,
								topLabel: addList[i].topLabel,
								bottomLabel: addList[i].bottomLabel,
								fileTypes: addList[i].fileTypes,
								commentary: addList[i].commentary,
								scaleMin: addList[i].scaleMin,
								scaleMax: addList[i].scaleMax,
								step: addList[i].step,
								labelsValues: addList[i].labelsValues,
								selectedValue: addList[i].selectedValue,
								graduation: addList[i].graduation,
								gradient: addList[i].gradient,
								gradientType: addList[i].gradientType,
								dateInterval: addList[i].dateInterval,
								dateMin: addList[i].dateMin,
								dateMax: addList[i].dateMax,
							});
						}

						if(sectionIndex === 0){
							this.setState({
								questions: questions,
								libraryPopUp: {
									display: false,
									confirmText: null,
									cancelText: null,
									handleConfirm: null,
									handleCancel: null,
									sectionIndex: null,
								},
							});
						}
						
						else {
							for(let i = 0; i < sections.length; i++){
								if(sections[i].hangout === this.state.showHangout && sections[i].index === sectionIndex){
									sections[i].questions = questions;
									break;
								}
							}
							this.setState({
								sections: sections,
								libraryPopUp: {
									display: false,
									confirmText: null,
									cancelText: null,
									handleConfirm: null,
									handleCancel: null,
									sectionIndex: null,
								},
							});
						}
					}
				},
				handleCancel: () => {
					this.setState({
						libraryPopUp: {
							display: false,
							confirmText: null,
							cancelText: null,
							handleConfirm: null,
							handleCancel: null,
							sectionIndex: null,
						},
					});
				},
				sectionIndex: sectionIndex,
			},			
		});
	};

	addFreshQuestion = (sectionIndex) => {
		let sections = this.state.sections.slice();
		let questions = null;
		if(sectionIndex === 0){
			questions = this.state.questions.slice();
		}
		else {
			for(let i = 0; i < sections.length; i++){
				if(sections[i].hangout === this.state.showHangout && sections[i].index === sectionIndex){
					questions = sections[i].questions.slice();
					break;
				}
			}
		}

		questions.push({
			name: `Nouvelle question ${this.getLastIndex(sectionIndex) + 1}`,
			index: this.getLastIndex(sectionIndex) + 1,
			description: ``,
			hangout: this.state.showHangout,
			isSection: false,
			mandatory: false,
			type: `QUESTION_VALUE`,

			askFor: `singleline`,
			linesNumber: 1,
			columnsNumber: 2,
			linesLabels: [``],
			columnsLabels: [``],
			linesImages: [``],
			columnsImages: [``],
			numberOfAnswers: 1,
			valuesAsImages: false,
			numberOfValues: 2,
			values: [``],
			topLabel: ``,
			bottomLabel: ``,
			fileTypes: [true, false],
			commentary: false,
			scaleMin: 0,
			scaleMax: 10,
			step: 1,
			labelsValues: [``],
			selectedValue: false,
			graduation: false,
			gradient: false,
			gradientType: 0,
			dateInterval: false,
			dateMin: `Aucune`,
			dateMax: `Aucune`,				
		});

		if(sectionIndex === 0){
			this.setState({
				questions: questions,
			});
		}
		
		else {
			for(let i = 0; i < sections.length; i++){
				if(sections[i].hangout === this.state.showHangout && sections[i].index === sectionIndex){
					sections[i].questions = questions;
					break;
				}
			}
			this.setState({
				sections: sections,
			});
		}
	};

	updateQuestion = (index, sectionIndex, fieldToChange, newValue) => {
		let sections = this.state.sections.slice();
		let questions = null;
		if(sectionIndex === 0){
			questions = this.state.questions.slice();
		}
		else {
			for(let i = 0; i < sections.length; i++){
				if(sections[i].hangout === this.state.showHangout && sections[i].index === sectionIndex){
					questions = sections[i].questions.slice();
					break;
				}
			}
		}

		if(fieldToChange === `index`){
			/** Check if given value is not stupid as fuck */
			newValue = Math.min(newValue, this.getLastIndex(sectionIndex));
			newValue = Math.max(newValue, 1);
			if(newValue === index){
				this.forceUpdate();
				return;
			}

			let sourceIndex = 0;
			for(let i = 0; i < questions.length; i++){
				if(questions[i].hangout === this.state.showHangout && questions[i].index === index){
					sourceIndex = i;
					break;
				}
			}

			if(newValue > index){
				for(let i = 0; i < questions.length; i++){
					if(questions[i].hangout === this.state.showHangout && questions[i].index > index && questions[i].index <= newValue){
						questions[i].index--;
					}
				}
				if(sectionIndex === 0){
					for(let i = 0; i < sections.length; i++){
						if(sections[i].hangout === this.state.showHangout && sections[i].index > index && sections[i].index <= newValue){
							sections[i].index--;
						}
					}
				}
			}
			else {
				for(let i = 0; i < questions.length; i++){
					if(questions[i].hangout === this.state.showHangout && questions[i].index >= newValue && questions[i].index < index){
						questions[i].index++;
					}
				}
				if(sectionIndex === 0){
					for(let i = 0; i < sections.length; i++){
						if(sections[i].hangout === this.state.showHangout && sections[i].index >= newValue && sections[i].index < index){
							sections[i].index++;
						}
					}					
				}
			}

			questions[sourceIndex].index = newValue;
			sections.sort(this.sortByIndex);
			questions.sort(this.sortByIndex);
		}
		else {
			for(let i = 0; i < questions.length; i++){
				if(questions[i].hangout === this.state.showHangout && questions[i].index === index){
					questions[i] = Object.assign(questions[i], {[fieldToChange]: newValue});
				}
			}
		}

		if(sectionIndex === 0){
			this.setState({
				sections: sections,
				questions: questions,
			});
		}
		else {
			for(let i = 0; i < sections.length; i++){
				if(sections[i].hangout === this.state.showHangout && sections[i].index === sectionIndex){
					sections[i].questions = questions;
					break;
				}
			}
			this.setState({
				sections: sections,
			});
		}
	};

	removeQuestion = (index, sectionIndex, name) => {
		this.setState({
            confirmationPopUp: {
                display: true,
                message: `Voulez vous vraiment supprimer la question ${name} de manière définitive ?`,
                confirmText: `Oui`,
                cancelText: `Non`,
				handleConfirm: () => {
					let sections = this.state.sections.slice();
					let questions = null;
					if(sectionIndex === 0){
						questions = this.state.questions.slice();
					}
					else {
						for(let i = 0; i < sections.length; i++){
							if(sections[i].hangout === this.state.showHangout && sections[i].index === sectionIndex){
								questions = sections[i].questions.slice();
								break;
							}
						}
					}
					for(let i = 0; i < questions.length; i++){
						if(questions[i].hangout === this.state.showHangout && questions[i].index === index)
						questions.splice(i, 1);
					}

					for(let i = 0; i < questions.length; i++){
						if(questions[i].hangout === this.state.showHangout && questions[i].index > index){
							questions[i].index--;
						}
					}
					if(sectionIndex === 0){
						for(let i = 0; i < sections.length; i++){
							if(sections[i].hangout === this.state.showHangout && sections[i].index > index){
								sections[i].index--;
							}
						}
					}


					if(sectionIndex === 0){
						this.setState({
							sections: sections,
							questions: questions,

							confirmationPopUp: {
								display: false,
								message: '',
								confirmText: null,
								cancelText: null,
								handleConfirm: null,
								handleCancel: null,
							},
						});
					}
					else {
						for(let i = 0; i < sections.length; i++){
							if(sections[i].hangout === this.state.showHangout && sections[i].index === sectionIndex){
								sections[i].questions = questions;
								break;
							}
						}
						this.setState({
							sections: sections,

							confirmationPopUp: {
								display: false,
								message: '',
								confirmText: null,
								cancelText: null,
								handleConfirm: null,
								handleCancel: null,
							},
						});
					}
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
		});
	};

	addQuestionToLibrary = (question) => {
		let input = {
			name: question.name, 
			description: question.description,
			type: question.type,
			username: getUsername(),
			askFor: question.askFor,
			linesNumber: question.linesNumber,
			columnsNumber: question.columnsNumber,
			linesLabels: question.linesLabels,
			columnsLabels: question.columnsLabels,
			linesImages: question.linesImages,
			columnsImages: question.columnsImages,
			numberOfAnswers: question.numberOfAnswers,
			valuesAsImages: question.valuesAsImages,
			numberOfValues: question.numberOfValues,
			values: question.values,
			topLabel: question.topLabel,
			bottomLabel: question.bottomLabel,
			fileTypes: question.fileTypes,
			commentary: question.commentary,
			scaleMin: question.scaleMin,
			scaleMax: question.scaleMax,
			step: question.step,
			labelsValues: question.labelsValues,
			selectedValue: question.selectedValue,
			graduation: question.graduation,
			gradient: question.gradient,
			gradientType: question.gradientType,
			dateInterval: question.dateInterval,
			dateMin: question.dateMin,
			dateMax: question.dateMax,
		};
		this.props.AddQuestionLibrary({variables: {input}}).then(
			() => {
				this.displaySnackbar(`Question ajoutée à la bibliothèque`);
			},
			() => {
				this.displaySnackbar(`Impossible d'ajouter la question à la bibliothèque`);
			}
		);
	};

	dropSurveyExplorerRow = (sourceIndex, sourceIsSection, sourceSectionIndex, targetIndex, targetIsSection,  targetSectionIndex) => {
		if(sourceSectionIndex === targetSectionIndex){
			if(sourceIsSection){
				this.updateSection(sourceIndex, `index`, targetIndex);
			}
			else {
				this.updateQuestion(sourceIndex, sourceSectionIndex, `index`, targetIndex);
			}
		}
	};

	errorOnLibrary = () => {
		this.setState({
			libraryPopUp: {
				display: false,
				confirmText: null,
				cancelText: null,
				handleConfirm: null,
				handleCancel: null,
				sectionIndex: null,
			},
		}, () => this.displaySnackbar(`Impossible d'acceder à la bibliothèque de questions`));
	};
	
    render = () => {
		if(getRoles() === null){
            return(<Redirect to={`/login`}/>);
        }
        
		else if(getRoles()[0] === `ROLE_ADMIN`){
            return(<Redirect to={`/services`}/>);
		}
		
		if(this.props.data && this.props.data.loading){
			return(
				<div className={`SurveyUpdaterRoot`}>
					<div className={`SurveyUpdaterLoading`}>
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
			if(this.props.data.error.graphQLErrors[0] !== undefined){
				if(this.props.data.error.graphQLErrors[0].code === 404){
					return(
						<div className={`SurveyUpdaterRoot`}>
							<div className={`SurveyUpdaterError`}>
								{`Ce questionnaire n'existe pas, ou a été supprimé.`}
							</div>
						</div>
					);
				}
			}
			else if(Object.keys(this.props.data.error.networkError).length !== 0){
				if(this.props.data.error.networkError.statusCode === 401){
					return(
						<div className={`SurveyUpdaterRoot`}>
							<div className={`SurveyUpdaterError`}>
								{`Session expirée, veuillez vous reconnecter.`}
							</div>
						</div>
					);					
				}
			}
            return(
                <div className={`SurveyUpdaterRoot`}>
					<div className={`SurveyUpdaterError`}>
						{`Une erreur est survenue de manière totalement improbable. Si le problème persiste, contactez votre administrateur réseau.`}
                    </div>
                </div>
            );
		}
		
        return(
			<div className={`SurveyUpdaterRoot`}>
				<Commandbar
					handleSave={this.handleSave}
				/>
				<div className={`SurveyUpdaterLeftColumn`} style={{width: `calc(25% + ${this.state.dx}px)`}}>
					<SurveyExplorer
						hangout={this.state.hangout}
						showHangout={this.state.showHangout}
						handleToggleHangout={this.handleToggleHangout}
						sections={this.state.sections}
						questions={this.state.questions}
						addSection={this.addSection}
						removeSection={this.removeSection}
						addLibraryQuestion={this.addLibraryQuestion}
						addFreshQuestion={this.addFreshQuestion}
						removeQuestion={this.removeQuestion}
						addQuestionToLibrary={this.addQuestionToLibrary}
						dropSurveyExplorerRow={this.dropSurveyExplorerRow}
						resize={this.resize}
						scrollToRow={this.scrollToRow}
					/>
				</div>
				<div className={`SurveyUpdaterRightColumn`} style={{width: `calc(75% - ${this.state.dx}px)`}}>
					<SurveyHeader
						name={this.state.name}
						reference={this.state.reference}
						link={this.state.link}
						image={this.state.image}
						description={this.state.description}
						hangout={this.state.hangout}
						activationDate={this.state.activationDate}
						deactivationDate={this.state.deactivationDate}
						activationKey={this.state.activationKey}
						language={this.state.language}
						updateHeader={this.updateHeader}
						displaySnackbar={this.displaySnackbar}
					/>
					<SurveyBody
						hangout={this.state.hangout}
						showHangout={this.state.showHangout}
						handleToggleHangout={this.handleToggleHangout}
						sections={this.state.sections}
						questions={this.state.questions}
						addSection={this.addSection}
						updateSection={this.updateSection}
						removeSection={this.removeSection}
						addLibraryQuestion={this.addLibraryQuestion}
						addFreshQuestion={this.addFreshQuestion}
						updateQuestion={this.updateQuestion}
						removeQuestion={this.removeQuestion}
						addQuestionToLibrary={this.addQuestionToLibrary}
						storeScrollingMethod={this.storeScrollingMethod}
					/>
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
				{this.state.libraryPopUp.display ?
					<LibraryPopUp
						confirmText={this.state.libraryPopUp.confirmText}
						cancelText={this.state.libraryPopUp.cancelText}
						handleConfirm={this.state.libraryPopUp.handleConfirm}
						handleCancel={this.state.libraryPopUp.handleCancel}
						sectionIndex={this.state.libraryPopUp.sectionIndex}
						errorOnLibrary={this.errorOnLibrary}
					/>:
					null
				}
				<Snackbar
					display={this.state.snackbar.display}
					message={this.state.snackbar.message}
				/>
			</div>
        );
	};
}

const SurveyUpdater = compose(
	graphql(FindSurvey, {
		options: (ownProps) => ({variables: {id: ownProps.match.params.id}})
	}),
	UpdateSurvey,
	AddQuestionLibrary,
	RemoveQuestionLibrary
)(withRouter(SurveyUpdaterStatementsLess));
  
export default SurveyUpdater;