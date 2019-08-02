import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';

import SurveyExplorerDragRow from '../components/SurveyExplorerDragRow';

import { DraggableTypes } from '../../../imports/helpers/Constants';

import '../styles/SurveyExplorerDropzone.css';

const SurveyExplorerDropzoneTarget = {
    drop(props, monitor){
        if(monitor.getItem().index === props.sectionIndex && monitor.getItem().sectionIndex !== props.sectionIndex){
            return;
        }
        else if(monitor.getItem().sectionIndex === props.row.index && monitor.getItem().sectionIndex !== props.sectionIndex){
            return;
        }
        else if(monitor.getItem().sectionIndex === props.sectionIndex && monitor.getItem().index === props.row.index){
            return;
        }
        props.dropSurveyExplorerRow(
            monitor.getItem().index,
            monitor.getItem().isSection,
            monitor.getItem().sectionIndex,
            props.row.index,
            props.isSection,
            props.sectionIndex
        );
    }
};

function collect(connect, monitor){
    return{
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    };
}

class SurveyExplorerDropzone extends Component {
    static propTypes = {
        connectDropTarget: React.PropTypes.func.isRequired,
        isOver: React.PropTypes.bool.isRequired,
    }

    render(){
        const {connectDropTarget, isOver} = this.props;

        let isOverStyle = {
            backgroundColor: isOver ? '#F0F0F0': '',
        };

        return connectDropTarget(
            <div className='SurveyExplorerDropzoneRoot' style={isOverStyle}>
                <SurveyExplorerDragRow
                    row={this.props.row}
                    sectionIndex={this.props.sectionIndex}
                    addSection={this.props.addSection}
                    removeSection={this.props.removeSection}
                    addLibraryQuestion={this.props.addLibraryQuestion}
                    addFreshQuestion={this.props.addFreshQuestion}
                    removeQuestion={this.props.removeQuestion}
                    addQuestionToLibrary={this.props.addQuestionToLibrary}
                    scrollToRow={this.props.scrollToRow}
                />
            </div>
        );
    } 
} export default DropTarget(DraggableTypes.SURVEY_EXPLORER_DRAGGABLE_ROW, SurveyExplorerDropzoneTarget, collect)(SurveyExplorerDropzone);