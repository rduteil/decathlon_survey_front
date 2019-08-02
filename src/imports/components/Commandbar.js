import React, { Component } from 'react';

import '../styles/Commandbar.css';

class Commandbar extends Component {
    render(){
        return(
            <div className={`CommandbarRoot`}>
                <button className='CommandbarButton' onClick={() => this.props.handleSave(true, false, false)}>
                    {`ENREGISTRER`}
                </button>
                <button className={`CommandbarButton`} onClick={() => this.props.handleSave(true, true, false)}>
                    {`ENREGISTRER ET QUITTER`}
                </button>
                <button className={`CommandbarButton`} onClick={() => this.props.handleSave(false, true, false)}>
                    {`QUITTER`}
                </button>
            </div>
        );
    }
}

export default Commandbar