import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import AdminIcon from '../../../imports/images/admin.png';
import UserIcon from '../../../imports/images/user.png';
import '../../../imports/styles/TableRow.css';

class UsersTableRow extends Component {
    constructor(props){
        super(props);
        this.state = {
            placeholder: `placeholder`,
        };
    }

    onChange = (event) => {
        switch(event.target.value){
            case `remove`:
                this.props.handleRemove(false, this.props.user.id, this.props.user.username);
                break;
            case `update`:
                this.props.history.push(`/users/${this.props.user.id}`);
                break;
            default:
                break;
        }
        this.setState({
            placeholder: `placeholder`,
        });
    }

    render(){
        return(
            <div
                className={`TableRowRoot`}
                onClick={() => this.props.history.push(`/users/${this.props.user.id}`)}
                title={`Cliquez pour modifier l'utilisateur`}
            >
                {this.props.user.roles[0] === `ROLE_ADMIN`?
                    <div className={`TableRowCell`} style={{width: `15%`}}>
                        <img className={`TableRowIcon`} src={AdminIcon} role={`presentation`}/>
                        {`Administrateur`}
                    </div>:
                    <div className={`TableRowCell`} style={{width: `15%`}}>
                        <img className={`TableRowIcon`} src={UserIcon} role={`presentation`}/>
                        {`Utilisateur`}
                    </div>
                }
                <div className={`TableRowCell`} style={{width: `25%`}}>
                    {this.props.user.username}
                </div>
                <div className={`TableRowCell`} style={{width: `30%`}}>
                    {this.props.user.email}
                </div>
                <div className={`TableRowCell`} style={{width: `20%`}}>
                    {this.props.user.lastUpdate}
                </div>
                <div
                    className={`TableRowActionCell`}
                    onClick={(event) => event.stopPropagation()}
                    style={{width: `10%`}}
                    title={`Cliquez pour voir les actions`}
                >
                    <select
                        className={`TableRowActionSelect`}
                        onChange={(event) => this.onChange(event)}
                        value={this.state.placeholder}
                    >
                        <option value={`placeholder`} disabled hidden>
                            {`≡`}
                        </option>
                        <option value={`update`}>
                            {`Modifier`}
                        </option>
                        <option value={`remove`}>
                            {`Supprimer`}
                        </option>
                    </select>
                </div>
            </div>
        );
    }
}

export default withRouter(UsersTableRow);