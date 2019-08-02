import React, { Component } from 'react';
import { compose } from 'react-apollo';
import { withRouter, Redirect } from 'react-router-dom';

import ServicesTable from './components/ServicesTable';
import UsersTable from './components/UsersTable';
import ConfirmationPopUp from '../../imports/components/ConfirmationPopUp';
import Snackbar from '../../imports/components/Snackbar';

import { getRoles } from '../../imports/helpers/Tokens';
import { FindServices, AddService, UpdateService, RemoveService, AddUser, RemoveUser } from '../../imports/helpers/GraphQLStatements';
import Spinner from '../../imports/images/spinner.gif';

import './styles/AdminHome.css';

class AdminHome extends Component {
    constructor(props){
        super(props);
        this.state = {
            confirmationPopUp: {
                display: false,
                message: '',
                confirmText: null,
                cancelText: null,
                handleConfirm: null,
                handleCancel: null,
            },
            snackbar: {
                display: false,
                message: ``,
            },
            navigateTo: -1,
            toggleRename: -1,
        };
    }

    static propTypes = {
        FindServices: React.PropTypes.shape({
            loading: React.PropTypes.bool,
            error: React.PropTypes.object,
            users: React.PropTypes.array,
        }).isRequired,
    };

    componentWillUnmount = () => {
		clearInterval(this.snackbarInterval);
	};

    handleNavigation = (id) => {
        this.setState({navigateTo: id});
    };

    handleAdd = (isService) => {
        let indice = 1;
        function findIndice(service){return service.name === `Nouveau service ${indice}`;}

        if(isService){
            while(this.props.FindServices.services.find(findIndice)){
                indice++;
            }
            let input = {
                name: `Nouveau service ${indice}`,
            };
            this.props.AddService({variables: {input}}).then(() => {
                this.props.FindServices.refetch().then(() => {
                    for(let i = 0; i < this.props.FindServices.services.length; i++){
                        if(this.props.FindServices.services[i].name === input.name){
                            this.setState({
                                toggleRename: this.props.FindServices.services[i].id,
                            });
                        }
                    }
                });
            });
        }
        else {
            let isOkay = false;
            while(!isOkay){
                isOkay = true;
                for(let i = 0; i < this.props.FindServices.services.length; i++){
                    for(let j = 0; j < this.props.FindServices.services[i].users.length; j++){
                        if(this.props.FindServices.services[i].users[j].username === `Nouvel utilisateur ${indice}`){
                            isOkay = false;
                            indice++;
                            break;
                        }
                    }
                }
            }
            let input = {
                username: `Nouvel utilisateur ${indice}`,
                password: `decathlon`,
                email: ``,
                serviceId: Number(this.state.navigateTo),
            };
            this.props.AddUser({variables: {input}}).then(() => {
                this.props.FindServices.refetch();
            });
        }
    };

    handleRename = (id, name) => {
        if(!name.replace(/\s/g, '').length || name === null || name === undefined){
            this.displaySnackbar(`Le nom du service ne doit pas être vide`);
            return;
        }
        for(let i = 0; i < this.props.FindServices.services.length; i++){
            if(this.props.FindServices.services[i].name === name && this.props.FindServices.services[i].id !== id){
                this.displaySnackbar(`Le service ${name} existe déjà`);
                return;
            }
        }

        let input = {
            name: name,
        };
        this.props.UpdateService({variables: {id, input}}).then(() => {this.props.FindServices.refetch();});
        this.setState({
            toggleRename: -1,
        });
    };

    handleToggleRename = (id) => {
        this.setState({
            toggleRename: id,
        });
    };

    handleRemove = (isService, id, name) => {
        if(this.checkIfLastAdmin(isService, id)){
            this.displaySnackbar(`Impossible de supprimer le dernier administrateur`);
            return;
        }
        else {
            this.setState({
                confirmationPopUp: {
                    display: true,
                    message: `Voulez vous vraiment supprimer le ${isService ? `service ${name} et tous les comptes associés`: `compte ${name}`} de manière définitive ?`,
                    confirmText: `Oui`,
                    cancelText: `Non`,
                    handleConfirm: () => {
                        let input = {id: id};
                        (isService ? this.props.RemoveService({variables: input}): this.props.RemoveUser({variables: input})).then(() => {
                            this.props.FindServices.refetch();
                            this.setState({
                                confirmationPopUp: {
                                    display: false,
                                    message: ``,
                                    confirmText: null,
                                    cancelText: null,
                                    handleConfirm: null,
                                    handleCancel: null,
                                },
                            });
                        });
                    },
                    handleCancel: () => {
                        this.setState({
                            confirmationPopUp: {
                                display: false,
                                message: '',
                                confirmText: null,
                                cancelText: null,
                                handleConfirm: null,
                                handleCancel: null,
                            },
                        });
                    },
                },
            });            
        }
    };

    checkIfLastAdmin = (isService, id) => {
        if(isService){
            for(let i = 0; i < this.props.FindServices.services.length; i++){
                if(this.props.FindServices.services[i].id !== id){
                    for(let j = 0; j < this.props.FindServices.services[i].users.length; j++){
                        if(this.props.FindServices.services[i].users[j].roles.indexOf(`ROLE_ADMIN`) !== -1){
                            return false;
                        }                        
                    }
                }
            }
        }
        else {
            for(let i = 0; i < this.props.FindServices.services.length; i++){
                for(let j = 0; j < this.props.FindServices.services[i].users.length; j++){
                    if(this.props.FindServices.services[i].users[j].id === id){
                        if(this.props.FindServices.services[i].users[j].roles.indexOf(`ROLE_ADMIN`) === -1){
                            return false;
                        }
                    }
                    else {
                        if(this.props.FindServices.services[i].users[j].roles.indexOf(`ROLE_ADMIN`) !== -1){
                            return false;
                        } 
                    }
                }
            }
        }
        return true;
    };

    displaySnackbar = (message) => {
        if(this.state.snackbar.display === false){
            this.setState({ 
                snackbar: {
                    display: true,
                    message: message,
                }
            }, () => this.snackbarInterval = setInterval(() => this.removeSnackbar(), 5.5 * 1000));
        }
    };

    removeSnackbar = () => {
        this.setState({
            snackbar: {
                display: false,
                message: ``,
            },
        }, () => clearInterval(this.snackbarInterval));
    };

    render = () => {
        if(getRoles() === null){
            return(<Redirect to={`/login`}/>);
        }
        else if(getRoles()[0] === `ROLE_USER`){
            return(<Redirect to={`/home`}/>);
        }

        if(this.props.FindServices.loading){
            return (
                <div className={`AdminHomeRoot`}>
                    <div className={`AdminHomeLoading`}>
                        <img
                            src={Spinner}
                            role={`presentation`}
                            alt={`Chargement des données, veuillez patienter...`}
                        />
                    </div>
                </div>
            );
        }
  
        if(this.props.FindServices.error){
            return (
                <div className={`AdminHomeRoot`}>
                    <div className={`AdminHomeError`}>
                        {`Une erreur est survenue de manière totalement improbable. Si le problème persiste, contactez votre administrateur réseau.`}
                    </div>
                </div>
            );
        }

        let table = null;
        if(this.state.navigateTo !== -1){
            for(let i = 0; i < this.props.FindServices.services.length; i++){
                if(this.props.FindServices.services[i].id === this.state.navigateTo){
                    table = <UsersTable
                        service={this.props.FindServices.services[i]}
                        handleNavigation={this.handleNavigation}
                        handleAdd={this.handleAdd}
                        handleRemove={this.handleRemove}
                        handleSave={this.handleSave}
                    />
                    break;
                }
            }
        }
        else {
            table = <ServicesTable
                services={this.props.FindServices.services}
                toggleRename={this.state.toggleRename}
                handleToggleRename={this.handleToggleRename}
                handleNavigation={this.handleNavigation}
                handleAdd={this.handleAdd}
                handleRemove={this.handleRemove}
                handleRename={this.handleRename}
            />
        }

        return(
            <div className={`AdminHomeRoot`}>
                {table}
                {this.state.confirmationPopUp.display ? 
                    <ConfirmationPopUp
                        message={this.state.confirmationPopUp.message}
                        confirmText={this.state.confirmationPopUp.confirmText}
                        cancelText={this.state.confirmationPopUp.cancelText}
                        handleConfirm={this.state.confirmationPopUp.handleConfirm}
                        handleCancel={this.state.confirmationPopUp.handleCancel}
                    /> : 
                    null
                }
                <Snackbar
                    display={this.state.snackbar.display}
                    message={this.state.snackbar.message}
                />
            </div>
        );
    };
} export default compose(FindServices, AddService, UpdateService, RemoveService, AddUser, RemoveUser)(withRouter(AdminHome));