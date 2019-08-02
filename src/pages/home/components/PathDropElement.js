import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';

import { DraggableTypes } from '../../../imports/helpers/Constants';
import '../styles/HomeTable.css';

const PathDropElementTarget = {
    drop(props, monitor){
        if(monitor.getItem().isSurvey){
            if(monitor.getItem().parentId !== props.path.id){
                props.changeSurveyFolder(monitor.getItem().id, props.path.id);
            }
        }
        else {
            if(monitor.getItem().id !== props.path.id){
                props.updateFolder(monitor.getItem().id, props.path.id, monitor.getItem().name);
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

class PathDropElement extends Component {
    static propTypes = {
        connectDropTarget: React.PropTypes.func.isRequired,
        isOver: React.PropTypes.bool.isRequired,
    };

    render = () => {
        const {connectDropTarget, isOver} = this.props;

        let isOverStyle = {
            backgroundColor: isOver ? '#cccccc': '',
        };

        return connectDropTarget(
            <div className={`HomeTablePathElement`} style={isOverStyle} onClick={() => this.props.handleNavigation(this.props.path.id, this.props.path.name, false)}>
                {this.props.path.name}
            </div>
        );
    };

} export default DropTarget(DraggableTypes.DRAGGABLE_ROW, PathDropElementTarget, collect)(PathDropElement);