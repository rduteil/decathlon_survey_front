import React, { Component } from 'react';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { default as TouchBackend} from 'react-dnd-touch-backend';

class BackendHelper extends Component {
    render = () => {
      return (
            <div>
                {React.Children.map(this.props.children, (child) => {return child;})}
            </div>
        );
    }
} export default (DragDropContext(typeof window.orientation === 'undefined' ? HTML5Backend: TouchBackend)(BackendHelper));