import React, { Component } from 'react';
import { withApollo } from 'react-apollo';

import ColumnHeaderSF from '../../../imports/components/ColumnHeaderSF';
import ColumnHeader2S from '../../../imports/components/ColumnHeader2S';
import ColumnHeaderS from '../../../imports/components/ColumnHeaderS';
import ColumnHeader from '../../../imports/components/ColumnHeader';

import { QuestionLibraries } from '../../../imports/helpers/GraphQLStatements';
import { makeQuestionLibraryWritable } from '../../../imports/helpers/Format';
import Spinner from '../../../imports/images/black_spinner.gif';

import LibraryPopUpTableRow from '../components/LibraryPopUpTableRow';

import '../../../imports/styles/PopUp.css';
import '../styles/LibraryPopUp.css';

class LibraryPopUp extends Component {
    constructor(props){
        super(props);
        this.state = {
            loading: true,
            questionLibraries: [],
            addList: [],
            removeList: [],

            sort: {
                column: `Date d'ajout`,
                direction: `Desc`,
            },
            search: {
                column: `Question`,
                section: ``,
            },
            filter: {
                column: `Type`,
                condition: 0,
            },
        };
        this.runLibraryQuery();
    }

    handleSort = (column, direction) => {
		this.setState({
			sort: {
				column: column,
				direction: direction,
			}
		});
    };
    
    handleSearch = (column, section) => {
		this.setState({
			search: {
				column: column,
				section: section,
			},
		});
	};

	handleFilter = (column, condition) => {
		this.setState({
			filter: {
				column: column,
				condition: condition,
			},
		});
    };

    handleAddList = (questionLibrary) => {
        let addList = this.state.addList.slice();
        let toAdd = true;
        for(let i = 0; i < addList.length; i++){
            if(addList[i].id === questionLibrary.id){
                addList.splice(i, 1);
                toAdd = false;
                break;
            }
        }
        if(toAdd){
            addList.push(questionLibrary);
        }
        this.setState({
            addList: addList,
        });
    };

    handleRemoveList = (id) => {
        let removeList = this.state.removeList.slice();
        if(removeList.includes(id)){
            for(let i = 0; i < removeList.length; i++){
                if(removeList[i] === id){
                    removeList.splice(i, 1);
                    break;
                }
            }
        }
        else {
            removeList.push(id);
        }
        this.setState({
            removeList: removeList,
        });
    };    

    sortQuestionLibraries = (questionLibraryA, questionLibraryB) => {
		let isDesc = this.state.sort.direction === `Desc` ? 1 : -1;
		let [a, b] = [questionLibraryA.name.toLowerCase(), questionLibraryB.name.toLowerCase()];
		switch(this.state.sort.column){
			case `Type`:
				[a, b] = [questionLibraryA.type, questionLibraryB.type];
				break;
			case `Question`:
				break;
			case `Auteur`:
				[a, b] = [questionLibraryA.username, questionLibraryB.reference];
				break;
			case `Date d'ajout'`:
				let format = /(\d{2})\-(\d{2})\-(\d{4})/;
				[a, b] = [new Date(questionLibraryA.postDate.replace(format,'$3-$2-$1')), new Date(questionLibraryB.postDate.replace(format,'$3-$2-$1'))];
				break;
			default:
				break;
		}
        
		if (a > b) {
			return 1 * isDesc;
		}
		if (a < b) {
			return -1 * isDesc;
		}
		return 0;  
    };

    runLibraryQuery = () => {
        this.props.client.query({
            query: QuestionLibraries,
        }).then(
            (response) => {
                let questionLibraries = [];
                for(let i = 0; i < response.data.questionLibraries.length; i++){
                    let questionLibrary = makeQuestionLibraryWritable(response.data.questionLibraries[i]);
                    questionLibraries.push(questionLibrary);
                }
                this.setState({
                    loading: false,
                    questionLibraries: questionLibraries,
                });
            },
            (error) => {
                this.props.errorOnLibrary();
            },
        );
    };

    renderHeader = () => {
        return(
            <div className={`LibraryPopUpTableHeader`}>
                <ColumnHeaderSF
                    column={`Type`}
                    currentSort={this.state.sort}
                    currentFilter={this.state.filter}
                    options={[`Tout`, `Saisie`, `Choix multiple`, `Classement`, `Média`, `Echelle`, `Date`]}
                    onSort={this.handleSort}
                    onFilter={this.handleFilter}
                    width={15}
                />
                <ColumnHeader2S
                    column={`Question`}
                    currentSort={this.state.sort}
                    currentSearch={this.state.search}
                    onSort={this.handleSort}
                    onSearch={this.handleSearch}
                    width={30}
                />
                <ColumnHeader2S
                    column={`Auteur`}
                    currentSort={this.state.sort}
                    currentSearch={this.state.search}
                    onSort={this.handleSort}
                    onSearch={this.handleSearch}
                    width={15}
                />
                <ColumnHeaderS
                    column={`Date d'ajout`}
                    currentSort={this.state.sort}
                    onSort={this.handleSort}
                    width={20}
                />
                <ColumnHeader
                    column={`Ajouter`}
                    width={10}
                    borderRight={`none`}
                />
                <ColumnHeader
                    column={`Supprimer`}
                    width={10}
                    borderRight={`none`}
                />
            </div>
        );
    };

    renderRows = () => {
        let questionLibraries = [];
        let questionLibrariesRows = [];
        for(let i = 0; i < this.state.questionLibraries.length; i++){
            /** Check if question passes filter test */
            if(this.state.filter.condition !== 0){
                switch(this.state.filter.condition){
                    case 1:
                        if(this.state.questionLibraries.type === `QUESTION_VALUE`) break;
                        else continue;
                    case 2:
                        if(this.state.questionLibraries.type === `QUESTION_CHOICE`) break;
                        else continue;
                    case 3:
                        if(this.state.questionLibraries.type === `QUESTION_RANK`) break;
                        else continue;
                    case 4:
                        if(this.state.questionLibraries.type === `QUESTION_FILE`) break;
                        else continue;
                    case 5:
                        if(this.state.questionLibraries.type === `QUESTION_SCALE`) break;
                        else continue;
                    case 6:
                        if(this.state.questionLibraries.type === `QUESTION_DATE`) break;
                        else continue;
                    default:
                        break;
                }
            }

            /** Check if question passes search test */
            if(this.state.search.column === `Question`){
                if(this.state.questionLibraries[i].name.indexOf(this.state.search.section) === -1) continue;
            }
            else if(this.state.search.column === `Auteur`){
                if(this.state.questionLibraries[i].username.indexOf(this.state.search.section) === -1) continue;
            }
            questionLibraries.push(this.state.questionLibraries[i]);
        }
        questionLibraries.sort(this.sortQuestionLibraries);
        for(let i = 0; i < questionLibraries.length; i++){
            questionLibrariesRows.push(
                <LibraryPopUpTableRow
                    key={i}
                    questionLibrary={questionLibraries[i]}
                    handleAddList={this.handleAddList}
                    handleRemoveList={this.handleRemoveList}
                />
            );
        }
        return questionLibrariesRows;
    };

    renderFooter = () => {
        if(this.state.questionLibraries.length === 0){
            return(
                <div className={`LibraryPopUpTableFooter`}>
                    <div className={`TableFooterText`}>
                        {`Créez une question et cliquez sur le bouton 'Ajouter à la bibliothèque' pour la retrouver ici`}
                    </div>
                </div>
            );
        }
        else {
            return(
                <div className={`LibraryPopUpTableFooter`}>
                    <div className={`TableFooterText`}>
                        {`${this.state.questionLibraries.length} question(s) dans la bibliothèque`}
                    </div>
                </div>
            );
        }
    };

    render = () => {
        if(this.state.loading){
            return(
                <div className={`PopUpBackground`}>
                    <div className={`PopUpRoot`}>
                        <div className={`PopUpBody`}>
                            <div className={`PopUpMessageDiv`}>
                                <img
                                    src={Spinner}
                                    role={`presentation`}
                                    alt={`Chargement des données, veuillez patienter...`}
                                />
                            </div>
                            <div className={`PopUpButtonsDiv`}>
                                <button className={`PopUpButton`} onClick={() => this.props.handleCancel()}>
                                    {this.props.cancelText}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>                
            );
        }
        return(
            <div className={`PopUpBackground`}>
                <div className={`PopUpRoot`}>
                    <div className={`PopUpBody`}>
                        <div className={`PopUpMessageDiv`}>
                            {`Bibliothèque de questions`}
                        </div>
                        <div className={`LibraryPopUpTable`}>
                            {this.renderHeader()}
                            <div className={`LibraryPopUpTableBody`}>
                                {this.renderRows()}
                            </div>
                            {this.renderFooter()}
                        </div>
                        <div className={`PopUpButtonsDiv`}>
                            <button className={`PopUpButton`} onClick={() => this.props.handleConfirm(this.props.sectionIndex, this.state.addList, this.state.removeList)}>
                                {this.props.confirmText}
                            </button>
                            <button className={`PopUpButton`} onClick={() => this.props.handleCancel()}>
                                {this.props.cancelText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
} export default withApollo(LibraryPopUp);