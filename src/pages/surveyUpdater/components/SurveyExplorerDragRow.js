import React, { Component } from 'react';
import { DragSource } from 'react-dnd';

import { DraggableTypes } from '../../../imports/helpers/Constants';

import '../styles/SurveyExplorerDragRow.css';

const SurveyExplorerDragRowSource = {
    beginDrag(props){
        return{
            index: props.row.index,
            isSection: props.row.isSection,
            sectionIndex: props.sectionIndex,
        };
    }
};
  
function collect(connect, monitor){
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    }
}

class SurveyExplorerDragRow extends Component {
    constructor(props){
        super(props);
        this.state = {
            placeholder: `placeholder`,
        };
    }

    static propTypes = {
        connectDragSource: React.PropTypes.func.isRequired,
        isDragging: React.PropTypes.bool.isRequired,
    };

    onChange = (event) => {
        switch(event.target.value){
            case `placeholder`:
                break;
            case `addLibraryQuestion`:
                this.props.addLibraryQuestion(this.props.row.index);
                break;
            case `addFreshQuestion`:
                this.props.addFreshQuestion(this.props.row.index);
                break;
            case `removeSection`:
                this.props.removeSection(this.props.row.index, this.props.row.name);
                break;
            case `removeQuestion`:
                this.props.removeQuestion(this.props.row.index, this.props.sectionIndex, this.props.row.name);
                break;
            case `addQuestionToLibrary`:
                this.props.addQuestionToLibrary(this.props.row);
                break;
            default:
                break;
        }
    };

    formatIndex = () => {
        if(this.props.row.isSection || this.props.sectionIndex === 0){
            return this.props.row.index;
        }
        else {
            return `${this.props.sectionIndex}.${this.props.row.index}`;
        }
    };

    formatType = () => {
        if(this.props.row.isSection) return `Section`;
        else switch(this.props.row.type){
            case `QUESTION_VALUE`:
                return `Saisie`;
            case `QUESTION_CHOICE`:
                return `Choix multiple`;
            case `QUESTION_RANK`:
                return `Classement`;
            case `QUESTION_FILE`:
                return `Média`;
            case `QUESTION_SCALE`:
                return `Echelle`;
            case `QUESTION_DATE`:
                return `Date`;
            default:
                return `Indéfini`;
        }
    };

    formatSelect = () => {
        if(this.props.row.isSection) return(
            <select
                className={`SurveyExplorerDragRowAction`}
                onClick={(event) => event.stopPropagation()}
                onChange={(event) => this.onChange(event)}
                value={this.state.placeholder}
            >
                <option value={`placeholder`} hidden>
                    {`≡`}
                </option>
                <option value={`addFreshQuestion`}>
                    {`Nouvelle question`}
                </option>
                <option value={`addLibraryQuestion`}>
                    {`Bibliothèque`}
                </option>
                <option value={`removeSection`}>
                    {`Supprimer la section`}
                </option>
            </select>
        );
        else return(
            <select
                className={`SurveyExplorerDragRowAction`}
                onClick={(event) => event.stopPropagation()}
                onChange={(event) => this.onChange(event)}
                value={this.state.placeholder}
            >
                <option value={`placeholder`} disabled hidden>
                    {`≡`}
                </option>
                <option value={`removeQuestion`}>
                    {`Supprimer la question`}
                </option>
                <option value={`addQuestionToLibrary`}>
                    {`Ajouter à la bibliothèque`}
                </option>
            </select>
        );
    };

    render = () => {
        const {connectDragSource, isDragging} = this.props;

        let style = {
            opacity: isDragging ? 0.5 : 1,
        };

        return connectDragSource(
            <div 
                className={this.props.row.isSection ? `SurveyExplorerDragRowRoot Orange`: `SurveyExplorerDragRowRoot Blue`}
                onClick={() => this.props.scrollToRow(this.props.row)}
                title={`Cliquez pour voir l'élément, maintenez pour déplacer l'élément`}
                style={style}
            >
                <div className={`SurveyExplorerDragRowItem`} style={{width: `15%`}}>
                    {this.formatIndex()}
                </div>
                <div className={`SurveyExplorerDragRowItem`} style={{width: `25%`}}>
                    {this.formatType()}
                </div>
                <div className={`SurveyExplorerDragRowItem`} style={{width: `40%`}}>
                    {this.props.row.name}
                </div>
                <div className={`SurveyExplorerDragRowItem`} style={{width: `20%`}}>
                    {this.formatSelect()}
                </div>
            </div>
        );
    };
} export default DragSource(DraggableTypes.SURVEY_EXPLORER_DRAGGABLE_ROW, SurveyExplorerDragRowSource, collect)(SurveyExplorerDragRow);