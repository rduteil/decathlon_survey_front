import React, { Component } from 'react';

import '../styles/Snackbar.css';

class Snackbar extends Component {
    render(){
        return(
            <div className={`SnackbarRoot`}>
                <div id={`snackbar`} className={this.props.display ? `Show` : ``}>
                    {this.props.message}
                </div>
            </div>
        );
    }
} export default Snackbar;