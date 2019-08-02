import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';

import { DraggableTypes } from '../../../imports/helpers/Constants';
import FolderDragRow from '../components/FolderDragRow';

const FolderDropRowTarget = {
    drop(props, monitor){
        if(monitor.getItem().isSurvey){
            if(monitor.getItem().parentId !== props.folder.id){
                props.changeSurveyFolder(monitor.getItem().id, props.folder.id);
            }
        }
        else {
            if(monitor.getItem().id !== props.folder.id){
                props.updateFolder(monitor.getItem().id, props.folder.id, monitor.getItem().name);
            }
        }
    }
};

function collect(connect, monitor){
    return{
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    };
}

class FolderDropRow extends Component {
    static propTypes = {
        connectDropTarget: React.PropTypes.func.isRequired,
        isOver: React.PropTypes.bool.isRequired,
    };

    render(){
        const {connectDropTarget, isOver} = this.props;

        let isOverStyle = {
            backgroundColor: isOver ? '#cccccc': '',
        };

        return connectDropTarget(
            <div className='FolderDropRowRoot' style={isOverStyle}>
                <FolderDragRow
                    folder={this.props.folder}
                    toggleRenameId={this.props.toggleRenameId}
                    handleNavigation={this.props.handleNavigation}
                    toggleRenameFolder={this.props.toggleRenameFolder}
                    updateFolder={this.props.updateFolder}
                    removeFolder={this.props.removeFolder}
                />
            </div>
        );
    }
} export default DropTarget(DraggableTypes.DRAGGABLE_ROW, FolderDropRowTarget, collect)(FolderDropRow);