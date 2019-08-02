import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { graphql, compose } from 'react-apollo';

import Commandbar from '../../imports/components/Commandbar';
import Snackbar from '../../imports/components/Snackbar';

import { getRoles } from '../../imports/helpers/Tokens';
import { FindServices, FindUser, UpdateUser } from '../../imports/helpers/GraphQLStatements';
import Spinner from '../../imports/images/spinner.gif';

import './styles/UserUpdater.css';

class UserUpdater extends Component {
    constructor(props){
        super(props);

        let services = [];
        if(this.props.FindServices.services !== undefined){
            for(let i = 0; i < this.props.FindServices.services.length; i++){
                services.push({
                    id: this.props.FindServices.services[i].id,
                    name: this.props.FindServices.services[i].name,
                });
            }
        }

        this.state = {
            username: this.props.FindUser.user === undefined ? null : this.props.FindUser.user.username,
            password: '',
            email: this.props.FindUser.user === undefined ? null : this.props.FindUser.user.email,
            serviceId: this.props.FindUser.user === undefined ? null : this.props.FindUser.user.service.id,
            roles: this.props.FindUser.user === undefined ? [] : this.props.FindUser.user.roles,

            services: services,

            displayPassword: false,
            confirmPassword: '',

            snackbar: {
                display: false,
                message: '',
            },
        };
    }

	componentWillReceiveProps = (newProps) => {
        if(newProps.FindUser.user !== undefined && newProps.FindServices.services !== undefined){
            let services = [];
            for(let i = 0; i < newProps.FindServices.services.length; i++){
                services.push({
                    id: newProps.FindServices.services[i].id,
                    name: newProps.FindServices.services[i].name,
                });
            }
            this.setState({
                username: newProps.FindUser.user.username,
                email: newProps.FindUser.user.email,
                serviceId: newProps.FindUser.user.service.id,
                roles: newProps.FindUser.user.roles,
                services: services,
            });
        }
    };

    componentWillUnmount = () => {
        clearInterval(this.snackbarInterval);
    }
    
    toggleDisplayPassword = () => {
        this.setState({
            displayPassword: !this.state.displayPassword,
        });
    };

    onChange = (event) => {
        switch(event.target.name){
            case 'username':
                this.setState({username: event.target.value,});
                break;
            case 'password':
                this.setState({password: event.target.value});
                break;
            case 'confirmPassword':
                this.setState({confirmPassword: event.target.value});
                break;
            case 'email':
                this.setState({email: event.target.value});
                break;
            case 'roles':
                this.setState({roles: [event.target.value]});
                break;
            case 'service':
                this.setState({serviceId: event.target.value});
                break;
            default:
                break;
        }
    };

    handleSave = (save, exit) => {
        if(save){
            if(!this.state.username.replace(/\s/g, '').length || this.state.username === null || this.state.username === undefined){
                this.displaySnackbar(`L'identifiant ne doit pas être vide`);
                return;
            }

            for(let i = 0; i < this.props.FindServices.services.length; i++){
                for(let j = 0; j < this.props.FindServices.services[i].users.length; j++){
                    if(this.props.FindServices.services[i].users[j].username === this.state.username && this.props.FindServices.services[i].users[j].id !== this.props.FindUser.user.id){
                        this.displaySnackbar(`Cet identifiant existe déjà`);
                        return;
                    }
                }
            }
            if(this.state.password !== this.state.confirmPassword){
                this.displaySnackbar(`Entrez un nouveau mot de passe identique dans les champs 'Nouveau mot de passe' et 'Confirmation'`);
                return;
            }
            
            let input = {
                username: this.state.username,
                password: this.state.password,
                email: this.state.email,
                roles: this.state.roles,
                serviceId: Number(this.state.serviceId)
            };
            let id = Number(this.props.FindUser.user.id);
            this.props.UpdateUser({variables: {id, input}}).then(() => {
                this.displaySnackbar(`Sauvegarde réussie${exit ? `, retour à l'explorateur`: ``}`);
                if(exit){
                    this.props.FindServices.refetch().then(
                        () => {
                            setTimeout(() => {
                                this.props.history.push(`/services`);
                            }, 2000);
                        },
                        () => {
                            setTimeout(() => {
                                this.props.history.push(`/services`);
                            }, 2000);
                        },
                    );
                }
            });
        }
        else if(exit){
            this.props.history.push('/services');
        }
    };

    displaySnackbar = (message) => {
        if(this.state.snackbar.display === false){
            this.setState({
                snackbar: {
                    display: true,
                    message:  message,
                }
            }, () => this.snackbarInterval = setInterval(() => this.removeSnackbar(), 5.5 * 1000));
        }
    };

    removeSnackbar = () => {
        this.setState({
            snackbar: {
                display: false,
                message: '',
            }
        }, () => clearInterval(this.snackbarInterval));
    };

    render = () => {
        if(getRoles() === null){
            return(<Redirect to={`/login`}/>);
        }
        
        if(getRoles()[0] === `ROLE_USER`){
            return(<Redirect to={`/home`}/>);
        }

		if(this.props.FindUser.loading){
			return(
                <div className={`UserUpdaterRoot`}>
                    <div className={`UserUpdaterLoading`}>
                        <img
                            src={Spinner}
                            role={`presentation`}
                            alt={`Chargement des données, veuillez patienter...`}
                        />
                    </div>
                </div>
            );
        }
        
        if(this.props.FindUser.error){
            return(
                <div className={`UserUpdaterRoot`}>
                    <div className={`UserUpdaterError`}>
                    	{`Une erreur est survenue de manière totalement improbable. Si le problème persiste, contactez votre administrateur réseau.`}
                    </div>
                </div>
            );
        }

        let options = [];
        for(let i = 0; i < this.state.services.length; i++){
            options.push(
                <option key={i} value={this.state.services[i].id}>
                    {this.state.services[i].name}
                </option>
            );
        }

        return(
            <div className={`UserUpdaterRoot`}>
                <Commandbar
                    handleSave={this.handleSave}
                />
                <div className={`UserUpdaterBody`}>
                    <div className={`UserUpdaterTitle`}>
                        {`UTILISATEUR ${this.props.FindUser.user.username.toUpperCase()}`}
                    </div>
                    <div className={`UserUpdaterLine`}>
                        <div className={`UserUpdaterHintDiv`}>
                            {`Identifiant :`}
                        </div>
                        <div className={`UserUpdaterInputDiv`}>
                            <input
                                name={`username`}
                                type={`text`}
                                value={this.state.username}
                                onChange={this.onChange}
                                placeholder={`Entrez le nom...`}
                            />
                        </div>
                    </div>
                    <div className={`UserUpdaterLine`}>
                        <div className={`UserUpdaterHintDiv`}>
                            {`Adresse E-mail :`}
                        </div>
                        <div className={`UserUpdaterInputDiv`}>
                            <input
                                name={`email`}
                                type={`email`}
                                value={this.state.email}
                                onChange={this.onChange}
                                placeholder={`Entrez l'adresse...`}
                            />
                        </div>
                    </div>
                    <div className={`UserUpdaterLine`}>
                        <div className={`UserUpdaterHintDiv`}>
                            {`Rôle :`}
                        </div>
                        <div className={`UserUpdaterInputDiv`}>
                            <select name={`roles`} value={this.state.roles[0]} onChange={this.onChange}>
                                <option value={`ROLE_USER`}>
                                    {`Utilisateur`}
                                </option>
                                <option value={`ROLE_ADMIN`}>
                                    {`Administrateur`}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div className={`UserUpdaterLine`}>
                        <div className={`UserUpdaterHintDiv`}>
                            {`Service :`}
                        </div>
                        <div className={`UserUpdaterInputDiv`}>
                            <select name={`service`} value={this.state.serviceId} onChange={this.onChange}>
                                {options}
                            </select>
                        </div>
                    </div>
                    {`Changer le mot de passe ?`}
                    <div className={`UserUpdaterLine`}>
                        <div className={`UserUpdaterHintDiv`}>
                            {`Nouveau mot de passe :`}
                        </div>
                        <div className={`UserUpdaterInputDiv`}>
                            <input
                                name={`password`}
                                type={this.state.displayPassword ? `text` : `password`}
                                value={this.state.password}
                                onChange={this.onChange}
                                onPaste={(event) => {event.preventDefault(); return false;}}
                                placeholder={`Entrez le mot de passe...`}
                            />
                            <button className={`UserUpdaterTogglePasswordButton`} onClick={this.toggleDisplayPassword}>
                                {this.state.displayPassword ? `Masquer` : `Afficher`}
                            </button>
                        </div>
                    </div>                    
                    <div className={`UserUpdaterLine`}>
                        <div className={`UserUpdaterHintDiv`}>
                            {`Confirmation :`}
                        </div>
                        <div className={`UserUpdaterInputDiv`}>
                            <input
                                name={`confirmPassword`}
                                type={`password`}
                                value={this.state.confirmPassword}
                                onChange={this.onChange}
                                onPaste={(event) => {event.preventDefault(); return false;}}
                                placeholder={`Entrez à nouveau le mot de passe...`}
                            />
                        </div>
                    </div>
                </div>
                <Snackbar
                    display={this.state.snackbar.display}
                    message={this.state.snackbar.message}
                />
            </div>
        );
    };
} export default compose(graphql(FindUser, {options: (ownProps) => ({variables: {id: ownProps.match.params.id}}), name: 'FindUser'}), UpdateUser, FindServices)(withRouter(UserUpdater));