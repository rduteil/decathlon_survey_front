import React, { Component } from 'react';

import '../styles/ColumnHeader.css'

class ColumnHeader extends Component {

    render(){
        return(
            <div className='ColumnHeaderRoot' style={{width: `${this.props.width}%`, borderRight: `${this.props.borderRight}`}}>
                <div className='ColumnHeaderName'>
                    {this.props.column}
                </div>
            </div>
        );
    }
}

export default ColumnHeader;