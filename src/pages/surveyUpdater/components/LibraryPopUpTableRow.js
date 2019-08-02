import React, { Component } from 'react';

import { getUsername } from '../../../imports/helpers/Tokens';

import '../../../imports/styles/TableRow.css';

class LibraryPopUpTableRow extends Component {
    formatType = () => {
        switch(this.props.questionLibrary.type){
            case `QUESTION_VALUE`:
                return `Saisie`;
            case `QUESTION_CHOICE`:
                return `Choix multiple`;
            case `QUESTION_RANK`:
                return `Classement`;
            case `QUESTION_FILE`:
                return `Média`;
            case `QUESTION_SCALE`:
                return `Echelle`;
            case `QUESTION_DATE`:
                return `Date`;
            default:
                return `Indéfini`;
        }
    };

    onChange = (event) => {
        switch(Number(event.target.id)){
            case 1:
                this.props.handleAddList(this.props.questionLibrary);
                break;
            case 0:
                this.props.handleRemoveList(this.props.questionLibrary.id);
                break;
            default:
                break;
        }
    };

    render(){
        return(
            <div className={`TableRowRoot`} style={{cursor: `default`}}>
                <div className={`TableRowCell`} style={{width: `15%`}}>
                    {this.formatType()}
                </div>
                <div className={`TableRowCell`} style={{width: `30%`}}>
                    {this.props.questionLibrary.name}
                </div>
                <div className={`TableRowCell`} style={{width: `15%`}}>
                    {this.props.questionLibrary.username}
                </div>
                <div className={`TableRowCell`} style={{width: `20%`}}>
                    {this.props.questionLibrary.postDate}
                </div>
                <div className={`TableRowCell`} style={{width: `10%`}}>
                    <input
                        id={1}
                        type={`checkbox`}
                        onChange={(event) => this.onChange(event)}
                        title={`Cliquez pour ajouter la question depuis la bibliothèque`}
                        style={{cursor: `pointer`}}
                    />
                </div>
                <div className={`TableRowCell`} style={{width: `10%`}}>
                    {this.props.questionLibrary.username === getUsername() ?
                        <input
                            id={0}
                            type={`checkbox`}
                            onChange={(event) => this.onChange(event)}
                            title={`Cliquez pour supprimer la question de la bibliothèque`}
                            style={{cursor: `pointer`}}
                        />:
                        null
                    }
                </div>
            </div>
        );
    }
}

export default LibraryPopUpTableRow;