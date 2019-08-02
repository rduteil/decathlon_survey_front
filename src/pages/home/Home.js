import React, { Component } from 'react';
import { graphql, compose, Query } from 'react-apollo';
import { withRouter, Redirect } from 'react-router-dom';

import HomeTable from './components/HomeTable';
import SharePopUp from './components/SharePopUp';

import ConfirmationPopUp from '../../imports/components/ConfirmationPopUp';
import Snackbar from '../../imports/components/Snackbar';

import { getRoles, getUsername } from '../../imports/helpers/Tokens';
import { FindServicesUnnamed, FindFoldersFromUsername, AddFolder, UpdateFolder, RemoveFolder, AddSurvey, RemoveSurvey, DuplicateSurvey, ShareSurvey, ChangeSurveyFolder } from '../../imports/helpers/GraphQLStatements';
import Spinner from '../../imports/images/spinner.gif';

import './styles/Home.css';

class Home extends Component {
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
                message: '',
            },
            sharePopUp: {
                display: false,
                surveyId: -1,
                handleConfirm: null,
                handleCancel: null,
            },
            toggleRenameId: -1,
        }
    }

    componentWillUnmount = () => {
        clearInterval(this.snackbarInterval);
    };

    addFolder = (folderId) => {
		let input = {
            'name': 'Nouveau dossier',
            'serviceId': 0,
            'folderId': Number(folderId),
        };
        this.props.AddFolder({variables: {username: getUsername(), input}}).then((response) => {
            this.setState({
                toggleRenameId: response.data.addFolder.id,
            });
            this.props.data.refetch();
        });        
    };

    toggleRenameFolder = (folderId) => {
        this.setState({
            toggleRenameId: folderId,
        });
    };

    updateFolder = (folderId, parentId, folderName) => {
        if(!folderName.replace(/\s/g, '').length || folderName === null || folderName === undefined){
            this.displaySnackbar(`Le nom du dossier ne doit pas être vide`);
            return;
        }

        this.props.UpdateFolder({variables: {id: Number(folderId), folderId: Number(parentId), name: folderName}}).then(() => {
            this.props.data.refetch();
        });
        this.setState({
            toggleRenameId: -1,
        });
    };

    removeFolder = (folderId, folderName) => {
        this.setState({
            confirmationPopUp: {
                display: true,
                message: `Voulez vous vraiment supprimer le dossier ${folderName} et tout son contenu de manière définitive ?`,
                confirmText: 'Oui',
                cancelText: 'Non',
                handleConfirm: () => {
                    this.props.RemoveFolder({variables: {id: folderId}}).then(() => {
                        this.props.data.refetch();
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
    };

    addSurvey = (folderId, isHangout) => {
		let input = {
            name: `Nouveau questionnaire`, 
            reference: ``,
            image: ``,
            description: ``,
            hangout: isHangout,
            activationDate: `Activé`,
            deactivationDate: `Aucune`,
            activationKey: ``,
            language: `fr`,
            questions: [],
            sections: [],
            folderId: Number(folderId),
        };
        this.props.AddSurvey({variables: {input}}).then(() => {
            this.props.data.refetch();
        });        
    };

    duplicateSurvey = (surveyId) => {
        this.props.DuplicateSurvey({variables: {id: surveyId}}).then(() => {
            this.props.data.refetch();
        });
    };

    shareSurvey = (surveyId) => {
        this.setState({
            sharePopUp: {
                display: true,
                surveyId: surveyId,
                handleConfirm: (shareTo) => {
                    for(let i = 0; i < shareTo.length; i++){
                        this.props.ShareSurvey({
                            variables: {surveyId: surveyId, serviceId: shareTo[i]}
                        });
                    }
                    this.setState({
                        sharePopUp: {
                            display: false,
                            surveyId: -1,
                            handleConfirm: null,
                            handleCancel: null,
                        }
                    });
                },
                handleCancel: () => {
                    this.setState({
                        sharePopUp: {
                            display: false,
                            surveyId: -1,
                            handleConfirm: null,
                            handleCancel: null,
                        }
                    });
                }
            }
        });
    };

    changeSurveyFolder = (surveyId, folderId) => {
        this.props.ChangeSurveyFolder({variables: {id: surveyId, folderId: folderId}}).then(() => {
            this.props.data.refetch();
        });
    };

    removeSurvey = (surveyId, surveyName) => {
        this.setState({
            confirmationPopUp: {
                display: true,
                message: `Voulez vous vraiment supprimer le questionnaire ${surveyName} et toutes les questions / réponses associées de manière définitive ?`,
                confirmText: 'Oui',
                cancelText: 'Non',
                handleConfirm: () => {
                    this.props.RemoveSurvey({variables: {id: surveyId}}).then(() => {
                        this.props.data.refetch();
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
                message: '',
            },
        }, () => clearInterval(this.snackbarInterval));
    };

    render = () => {
        if(getRoles() === null){
            return(<Redirect to={'/login'}/>);
        }

        else if(getRoles()[0] === 'ROLE_ADMIN'){
            return(<Redirect to={'/services'}/>);
        }

        if(this.props.data.loading) {
            return (
                <div className={`HomeRoot`}>
                    <div className={`HomeLoading`}>
                        <img
                            src={Spinner}
                            role={`presentation`}
                            alt={`Chargement des données, veuillez patienter...`}
                        />
                    </div>
                </div>
            );
        }
      
        if(this.props.data.error) {
            return (
                <div className={`HomeRoot`}>
                    <div className={`HomeError`}>
                        {`Une erreur est survenue de manière totalement improbable. Si le problème persiste, contactez votre administrateur réseau.`}
                    </div>
                </div>
            );
        }

        return(
            <div className={`HomeRoot`}>
                <HomeTable 
                    folders={this.props.data.foldersFromUsername}
                    toggleRenameId={this.state.toggleRenameId}
                    addFolder={this.addFolder}
                    toggleRenameFolder={this.toggleRenameFolder}
                    updateFolder={this.updateFolder}
                    removeFolder={this.removeFolder}
                    addSurvey={this.addSurvey}
                    duplicateSurvey={this.duplicateSurvey}
                    shareSurvey={this.shareSurvey}
                    changeSurveyFolder={this.changeSurveyFolder}
                    removeSurvey={this.removeSurvey}
                />
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
                {this.state.sharePopUp.display?
                    <Query query={FindServicesUnnamed}>
                        {({ loading, error, data }) => {
                            if(loading || error) return null;
                            let services = data.services.slice();
                            for(let i = 0; i < this.props.data.foldersFromUsername.length; i++){
                                if(this.props.data.foldersFromUsername[i].isRoot){
                                    for(let j = 0; j < services.length; j++){
                                        if(services[j].name === this.props.data.foldersFromUsername[i].name){
                                            services.splice(j, 1);
                                            break;
                                        }
                                    }
                                    break;
                                }
                            }
                            return (
                                <SharePopUp
                                    services={services}
                                    confirmText={`Valider`}
                                    cancelText={`Annuler`}
                                    handleConfirm={this.state.sharePopUp.handleConfirm}
                                    handleCancel={this.state.sharePopUp.handleCancel} 
                                />
                            );
                        }}                        
                    </Query>:
                    null
                }
            </div>
        );
    };
}

export default compose(
    graphql(FindFoldersFromUsername, {options: () => ({variables: {username: getUsername()}})}),
    AddFolder,
    UpdateFolder,
    RemoveFolder,
    AddSurvey,
    RemoveSurvey,
    DuplicateSurvey,
    ShareSurvey,
    ChangeSurveyFolder
)(withRouter(Home));
