import React, { Component } from 'react';
import { DropTarget } from 'react-dnd';

import FormQuestionDragRow from '../components/FormQuestionDragRow';
import { DraggableTypes } from '../../../imports/helpers/Constants';

class FormQuestionDropRow extends Component {
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
            <div className='FormQuestionDropRowRoot' style={isOverStyle}>
                <FormQuestionDragRow
                    element={this.props.element}
                    hideLabel={this.props.hideLabel}
                    leftSide={this.props.leftSide}
                />
            </div>
        );
    } 
}

const FormQuestionDropRowTarget = {
    drop(props, monitor){
        if(props.leftSide) return;
        else props.handleDropOnRow(monitor.getItem().element, props.element, monitor.getItem().leftSide);
    }
};

function collect(connect, monitor){
    return{
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver()
    };
}

export default DropTarget(DraggableTypes.FORM_QUESTION_DRAG_ROW, FormQuestionDropRowTarget, collect)(FormQuestionDropRow);