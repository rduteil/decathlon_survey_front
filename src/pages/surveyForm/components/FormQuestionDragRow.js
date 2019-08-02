import React, { Component } from 'react';
import { DragSource } from 'react-dnd';

import { DraggableTypes } from '../../../imports/helpers/Constants';

class FormQuestionDragRow extends Component {
    static propTypes = {
        connectDragSource: React.PropTypes.func.isRequired,
        isDragging: React.PropTypes.bool.isRequired,
    };

    render(){
        const {connectDragSource, isDragging} = this.props;

        let isDraggingStyle = {
            opacity: isDragging ? 0.5 : 1,
        };

        return connectDragSource(
            <div 
                className='FormQuestionDragRowRoot'
                style={isDraggingStyle}
            >
                {
                    this.props.element.image === null || this.props.element.image === undefined || this.props.element.image === '' ? null: 
                    <div className='FormQuestionDragRowImageDiv'>
                        <img className='FormQuestionDragRowImage' src={this.props.element.image} alt=''/>
                    </div>
                }
                <div className='FormQuestionDragRowLabel'>
                    {this.props.hideLabel ? null: this.props.element.label}
                </div>
            </div>
        );
    }

}

const FormQuestionDragRowSource = {
    beginDrag(props) {
        return{
            element: props.element,
            leftSide: props.leftSide,
        };
    }
};
  
function collect(connect, monitor){
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    }
}

export default DragSource(DraggableTypes.FORM_QUESTION_DRAG_ROW, FormQuestionDragRowSource, collect)(FormQuestionDragRow);