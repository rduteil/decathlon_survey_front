import React, { Component } from 'react';

import '../../../imports/styles/TableRow.css';

class ServicesTableRow extends Component {
    constructor(props){
        super(props);
        this.state = {
            placeholder: `placeholder`,
        };
    }

    onChange = (event) => {
        switch(event.target.value){
            case `remove`:
                this.props.handleRemove(true, this.props.service.id, this.props.service.name);
                break;
            case `rename`:
                this.props.handleToggleRename(this.props.service.id);
                break;
            case `open`:
                this.props.handleNavigation(this.props.service.id);
                break;
            default:
                break;
        }
        this.setState({
            placeholder: `placeholder`,
        });
    };

    onKeyPressed = (event) => {
        if(event.key === `Enter`){
            this.props.handleRename(this.props.service.id, event.target.value)
        }
    };

    render = () => {
        return(
            <div
                className={`TableRowRoot`}
                onClick={() => this.props.handleNavigation(this.props.service.id)}
                title={`Cliquez pour voir les utilisateurs`}
            >
                <div className={`TableRowCell`} style={{width: `40%`}}>
                    {this.props.toggleRename === this.props.service.id ? 
                        <input
                            className={`TableRowInputName`}
                            type={`text`} 
                            defaultValue={this.props.service.name}
                            onClick={(event) => {event.stopPropagation();}}
                            onBlur={(event) => this.props.handleRename(this.props.service.id, event.target.value)}
                            onFocus={(event) =>  {event.target.select();}}
                            onKeyPress={(event) => this.onKeyPressed(event)}
                            autoFocus
                        />: 
                        <span>
                            {this.props.service.name}
                        </span>
                    }
                </div>
                <div className={`TableRowCell`} style={{width: `20%`}}>
                    {this.props.service.users.length}
                </div>
                <div className={`TableRowCell`} style={{width: `30%`}}>
                    {this.props.service.lastUpdate}
                </div>
                <div
                    className={`TableRowActionCell`}
                    onClick={(event) => {event.stopPropagation();}}
                    style={{width: `10%`}}
                    title={`Cliquez pour voir les actions`}
                >
                    <select className={`TableRowActionSelect`} onChange={(event) => this.onChange(event)} value={this.state.placeholder}>
                        <option value={`placeholder`} disabled hidden>
                            {`≡`}
                        </option>
                        <option value={`open`}>
                            {`Ouvrir`}
                        </option>
                        <option value={`rename`}>
                            {`Renommer`}
                        </option>
                        <option value={`remove`}>
                            {`Supprimer`}
                        </option>
                    </select>
                </div>
            </div>
        );
    };
} export default ServicesTableRow;