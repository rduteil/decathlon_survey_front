import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';

import FormQuestionDropRow from '../components/FormQuestionDropRow';

import { DraggableTypes } from '../../../imports/helpers/Constants';

class FormQuestionDropzone extends Component {
    static propTypes = {
        connectDropTarget: React.PropTypes.func.isRequired,
        isOver: React.PropTypes.bool.isRequired,
        isOverCurrent: React.PropTypes.bool.isRequired,
    }

    render(){
        const {connectDropTarget, isOver, isOverCurrent} = this.props;

        let isOverStyle = {backgroundColor: ((isOver && this.props.leftSide) ||isOverCurrent) ? '#F0F0F0': '',};
        let rows = [];
        for(let i = 0; i < this.props.rows.length; i++){
            rows.push(<FormQuestionDropRow
                key={i}
                element={this.props.rows[i]}
                handleDropOnRow={this.props.handleDropOnRow}
                hideLabel={this.props.hideLabel}
                leftSide={this.props.leftSide}
            />);
        }

        return connectDropTarget(
            <div className='FormQuestionDropzoneRoot' style={isOverStyle}>
                {rows}
            </div>
        );
    }
    
}

const FormQuestionDropzoneTarget = {
    drop(props, monitor){
        if(monitor.didDrop() && !props.leftSide) return;
        else props.handleDropInZone(monitor.getItem().element, monitor.getItem().leftSide, !props.leftSide);
    }
};

function collect(connect, monitor){
    return{
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        isOverCurrent: monitor.isOver({ shallow: true }),
    };
}

export default DropTarget(DraggableTypes.FORM_QUESTION_DRAG_ROW, FormQuestionDropzoneTarget, collect)(FormQuestionDropzone);