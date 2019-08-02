import React, { Component } from 'react';

import ColumnHeaderSF from '../../../imports/components/ColumnHeaderSF';
import ColumnHeader2S from '../../../imports/components/ColumnHeader2S';
import ColumnHeaderS from '../../../imports/components/ColumnHeaderS';
import ColumnHeader from '../../../imports/components/ColumnHeader';

import FolderDropRow from '../components/FolderDropRow';
import SurveyDragRow from '../components/SurveyDragRow';
import PathDropElement from '../components/PathDropElement';

import { HOST_ADDRESS } from '../../../imports/helpers/Constants';

import BackIcon from '../../../imports/images/back.png';
import BackIconDisabled from '../../../imports/images/back_disabled.png';
import AddIcon from '../../../imports/images/add.png';
import '../styles/HomeTable.css';

class HomeTable extends Component {
    constructor(props){
        super(props);

        let folders = [];
        let rootId = -1;
        let path = [];

        for(let i = 0; i < this.props.folders.length; i++){
            if(this.props.folders[i].isRoot === true){
                rootId = this.props.folders[i].id;
                path.push({name: this.props.folders[i].name, id: this.props.folders[i].id});
            }
            folders.push(this.props.folders[i]);
        }

        this.state = {
            path: path,
            rootId: rootId,
            navigationId: rootId,
            folders: folders,

            sort: {
				column: 'Dernière modification',
				direction: 'Asc',
			},
			search: {
				column: 'Nom',
				section: '',
			},
			filter: {
				column: 'Type',
				condition: 0,
            },
            
            plusHovered: false,
            computatedSpace: false,
            remainingSpace: `Calcul de l'espace disque restant...`,
        };
    }

    componentWillReceiveProps = (newProps) => {
        let folders = [];

        for(let i = 0; i < newProps.folders.length; i++){
            folders.push(newProps.folders[i]);
        }
        
        this.setState({
            folders: folders,
        })
    };

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
    
    handleNavigation = (folderId, folderName, goForward) => {
        let path = this.state.path.slice();
        if(goForward){
            path.push({name: folderName, id: folderId});
        }
        else {
            let i = path.length - 1;
            while(path[i].id !== folderId){
                path.pop();
                i--;
            }
        }

        this.setState({
            navigationId: folderId,
            path: path,
            plusHovered: false,
        });
    };

    toggleHovering = (isHovered) => {
        this.setState({
            plusHovered: isHovered,
        });
    };

    sortFolders = (folderA, folderB) => {
		let isDesc = this.state.sort.direction === 'Desc' ? 1 : -1;
		let [a, b] = [folderA.name.toLowerCase(), folderB.name.toLowerCase()];
		switch(this.state.sort.column){
            case 'Type':
                return 0;
			case 'Nom':
				break;
			case 'Référence':
                return 0;
			case 'Dernière modification':
				let format = /(\d{2})\-(\d{2})\-(\d{4})/;
				[a, b] = [new Date(folderA.lastUpdate.replace(format,'$3-$2-$1')), new Date(folderB.lastUpdate.replace(format,'$3-$2-$1'))];
				break;
			case 'Nombre de réponses':
                return 0;
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

    sortSurveys = (surveyA, surveyB) => {
		let isDesc = this.state.sort.direction === 'Desc' ? 1 : -1;
		let [a, b] = [surveyA.name.toLowerCase(), surveyB.name.toLowerCase()];
		switch(this.state.sort.column){
			case 'Type':
				[a, b] = [surveyA.hangout, surveyB.hangout];
				break;
			case 'Nom':
				break;
			case 'Référence':
				[a, b] = [surveyA.reference, surveyB.reference];
				break;
			case 'Dernière modification':
				let format = /(\d{2})\-(\d{2})\-(\d{4})/;
				[a, b] = [new Date(surveyA.lastUpdate.replace(format,'$3-$2-$1')), new Date(surveyB.lastUpdate.replace(format,'$3-$2-$1'))];
				break;
			case 'Nombre de réponses':
				[a, b] = [surveyA.surveyAnswers.length, surveyB.surveyAnswers.length]
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

    renderPath = () => {
        let pathBreadCrumb = [];
        for(let i = this.state.plusHovered ? this.state.path.length -1: 0; i < this.state.path.length; i++){
            pathBreadCrumb.push(
                <PathDropElement
                    key={i}
                    updateFolder={this.props.updateFolder}
                    changeSurveyFolder={this.props.changeSurveyFolder}
                    handleNavigation={this.handleNavigation}
                    path={this.state.path[i]}
                />
            );
            pathBreadCrumb.push(
                <div className={`HomeTablePathSeparator`} key={i + this.state.path.length}>
                    {`▶`}
                </div>
            );
        }
        pathBreadCrumb.pop();

        let pathPane = (
            <div
                className={`HomeTablePathPane`}
                onMouseOver={() => this.toggleHovering(true)}
                onMouseLeave={() => this.toggleHovering(false)}
            >
                <div className={`HomeTablePathPaneBugFixer`}>
                    <img
                        className={`HomeTablePathHoverableIcon`}
                        src={AddIcon}
                        role={`presentation`}
                    />
                </div>
                <div className={`HomeTablePathPaneButton`} onClick={() => this.props.addFolder(this.state.navigationId)}>
                    {`Ajouter un dossier`}
                </div>
                <div className={`HomeTablePathPaneButton`} onClick={() => this.props.addSurvey(this.state.navigationId, false)}>
                    {`Ajouter un questionnaire encadré`}
                </div>
                <div className={`HomeTablePathPaneButton`} onClick={() => this.props.addSurvey(this.state.navigationId, true)}>
                    {`Ajouter un questionnaire longue durée`}
                </div>
            </div>
        );

        return(
            <div className={`HomeTablePath`}>
                <div
                    className={this.state.path.length === 1 ? `HomeTablePathElementDisabled`: `HomeTablePathElement`}
                    onClick={() => {
                        if(this.state.path.length > 1)
                            this.handleNavigation(this.state.path[this.state.path.length - 2].id, '', false);
                        }
                    }
                >
                    <img
                        className={`HomeTablePathIcon`}
                        src={this.state.path.length > 1 ? BackIcon: BackIconDisabled}
                        role={`presentation`}
                    />
                </div>
                {pathPane}
                {pathBreadCrumb}
            </div>
        );
    };

    renderHeader = () => {
        return(
            <div className={`HomeTableHeader`}>
                <ColumnHeaderSF
                    column='Type'
                    currentSort={this.state.sort}
                    currentFilter={this.state.filter}
                    options={['Tout', 'Dossiers', 'Questionnaires encadrés', 'Questionnaires longue durée']}
                    onSort={this.handleSort}
                    onFilter={this.handleFilter}
                    width='15'
                />
                <ColumnHeader2S  
                    column='Nom'
                    currentSort={this.state.sort}
                    currentSearch={this.state.search}
                    onSort={this.handleSort}
                    onSearch={this.handleSearch}
                    width='30'
                />
                <ColumnHeader2S
                    column='Référence'
                    currentSort={this.state.sort}
                    currentSearch={this.state.search}
                    onSort={this.handleSort}
                    onSearch={this.handleSearch}
                    width='15'
                />
                <ColumnHeaderS
                    column='Dernière modification'
                    currentSort={this.state.sort}
                    onSort={this.handleSort}
                    width='15'
                />
                <ColumnHeaderS
                    column='Nombre de réponses'
                    currentSort={this.state.sort}
                    onSort={this.handleSort}
                    width='15'
                />
                <ColumnHeader
                    column='Actions'
                    width='10'
                    borderRight='none'
                />
            </div>
        );
    };

    renderRows = () => {
        let folders = [];
        let surveys = [];
        let foldersRows = [];
        let surveysRows = [];

        for(let i = 0; i < this.state.folders.length; i++){
            if(this.state.folders[i].folder !== null && this.state.folders[i].folder.id === this.state.navigationId){
                /** Check if folder passes filter's tests */
                let shouldBePushed = true;
                if(this.state.search.column === 'Nom' && this.state.folders[i].name.indexOf(this.state.search.section) === -1) shouldBePushed = false;
                else if(this.state.filter.condition > 1) shouldBePushed = false;
                /** Push folder to array */
                if(shouldBePushed) folders.push(this.state.folders[i]);
            }
            else if(this.state.folders[i].id === this.state.navigationId){
                for(let j = 0; j < this.state.folders[i].surveys.length; j++){
                    /** Check if survey passes filter's tests */
                    let shouldBePushed = true;
                    if(this.state.search.column === 'Nom' && this.state.folders[i].surveys[j].name.indexOf(this.state.search.section) === -1) shouldBePushed = false;
                    if(this.state.search.column === 'Référence' && this.state.folders[i].surveys[j].reference.indexOf(this.state.search.section) === -1) shouldBePushed = false;
                    else if(this.state.filter.condition === 1) shouldBePushed = false;
                    else if(this.state.filter.condition === 2 && this.state.folders[i].surveys[j].hangout) shouldBePushed = false;
                    else if(this.state.filter.condition === 3 && !this.state.folders[i].surveys[j].hangout) shouldBePushed = false;
                    /** Push survey to array */
                    if(shouldBePushed) surveys.push(this.state.folders[i].surveys[j]);
                }
            }
        }
        
        folders.sort(this.sortFolders);
        for(let i = 0; i < folders.length; i++){
            foldersRows.push(
                <FolderDropRow
                    key={i}
                    folder={folders[i]}
                    toggleRenameId={this.props.toggleRenameId}
                    handleNavigation={this.handleNavigation}
                    toggleRenameFolder={this.props.toggleRenameFolder}
                    updateFolder={this.props.updateFolder}
                    removeFolder={this.props.removeFolder}
                    changeSurveyFolder={this.props.changeSurveyFolder}
                />
            );
        }
        surveys.sort(this.sortSurveys);
        for(let i = 0; i < surveys.length; i++){
            surveysRows.push(
                <SurveyDragRow
                    key={i}
                    survey={surveys[i]}
                    duplicateSurvey={this.props.duplicateSurvey}
                    shareSurvey={this.props.shareSurvey}
                    removeSurvey={this.props.removeSurvey}
                />
            );
        }

        return(
            <div className={`HomeTableBody`}>
                {foldersRows}
                {surveysRows}
            </div>
        );
    };

    renderFooter = () => {
        let folders = 0;
        let surveys = 0;
        let surveysHangout = 0;
        for(let i = 0; i < this.state.folders.length; i++){
            if(this.state.folders[i].folder !== null && this.state.folders[i].folder.id === this.state.navigationId){
                /** Check if folder passes filter's tests */
                let shouldBePushed = true;
                if(this.state.search.column === 'Nom' && this.state.folders[i].name.indexOf(this.state.search.section) === -1) shouldBePushed = false;
                else if(this.state.filter.condition > 1) shouldBePushed = false;
                /** Push folder to array */
                if(shouldBePushed) folders++;
            }
            else if(this.state.folders[i].id === this.state.navigationId){
                for(let j = 0; j < this.state.folders[i].surveys.length; j++){
                    /** Check if survey passes filter's tests */
                    let shouldBePushed = true;
                    if(this.state.search.column === 'Nom' && this.state.folders[i].surveys[j].name.indexOf(this.state.search.section) === -1) shouldBePushed = false;
                    if(this.state.search.column === 'Référence' && this.state.folders[i].surveys[j].reference.indexOf(this.state.search.section) === -1) shouldBePushed = false;
                    else if(this.state.filter.condition === 1) shouldBePushed = false;
                    else if(this.state.filter.condition === 2 && this.state.folders[i].surveys[j].hangout) shouldBePushed = false;
                    else if(this.state.filter.condition === 3 && !this.state.folders[i].surveys[j].hangout) shouldBePushed = false;
                    /** Push survey to array */
                    if(shouldBePushed){
                        if(this.state.folders[i].surveys[j].hangout){
                            surveysHangout++;
                        }
                        else {
                            surveys++;
                        }
                    }
                }
            }
        }

        if(!this.state.computatedSpace){
            fetch(`http://${HOST_ADDRESS.IP}/space`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                }
            }).then((response) => {
                response.text().then((response) => {
                    this.setState({
                        computatedSpace: true,
                        remainingSpace: response,
                    });
                }, (error) => {
                    this.setState({
                        computatedSpace: true,
                        remainingSpace: `Calcul de l'espace disque restant impossible`,
                    });
                });
            }, (error) => {
                this.setState({
                    computatedSpace: true,
                    remainingSpace: `Calcul de l'espace disque restant impossible`,
                });                
            });
        }

        return(
            <div className={`HomeTableFooter`}>
                <div className={`TableFooterText`}>
                    {`${folders} dossier(s), ${surveys} questionnaire(s) encadré(s) et ${surveysHangout} questionnaire(s) longue durée`}
                </div>
                <div className={`TableFooterText`}>
                    {this.state.remainingSpace}
                </div>
            </div>
        );
    };

    render = () => {
        return(
            <div className={`HomeTableRoot`}>
                <div className={`HomeTableFixedTop`}>
                    {this.renderPath()}
                    {this.renderHeader()}
                </div>
                <div className={`HomeTable`}>
                    {this.renderRows()}
                </div>
                <div className={`HomeTableFixedBottom`}>
                    {this.renderFooter()}
                </div>
            </div>
        );
    };
} export default HomeTable;