import React, { Component } from 'react';
import moment from 'moment';
import Dropzone from 'react-dropzone';
import DateTime from 'react-datetime';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import { HOST_ADDRESS } from '../../../imports/helpers/Constants';
import ImagePlaceholder from '../../../imports/images/image.png';

import '../../../../node_modules/react-datetime/css/react-datetime.css';
import '../styles/SurveyHeader.css';

require('moment/locale/fr');

class SurveyHeader extends Component {
    constructor(props){
        super(props);
        this.state = {
            name: this.props.name,
            reference: this.props.reference,
            image: this.props.image,
            description: this.props.description,
            hangout: this.props.hangout,
            activationDate: this.props.activationDate,
            deactivationDate: this.props.deactivationDate,
            activationKey: this.props.activationKey,
        };
    }

    componentWillReceiveProps = (newProps) => {
        this.setState({
            name: newProps.name,
            reference: newProps.reference,
            image: newProps.image,
            description: newProps.description,
            hangout: newProps.hangout,
            activationDate: newProps.activationDate,
            deactivationDate: newProps.deactivationDate,
            activationKey: newProps.activationKey,
        });
    };

    onChange = (event) => {
        switch(event.target.name){
            case `name`:
                this.setState({
                    name: event.target.value,
                });
                break;
            case `reference`:
                this.setState({
                    reference: event.target.value,
                });
                break;
            case `description`:
                this.setState({
                    description: event.target.value,
                });
                break;
            case `hangout`:
                this.setState((previousState) => {
                    return({
                        hangout: !previousState.hangout,
                    });
                }, () => this.props.updateHeader(`hangout`, this.state.hangout));
                break;
            case `image`:
                event.stopPropagation();
                this.setState({
                    image: ``,
                }, () => this.props.updateHeader(`image`, this.state.image));
                break;
            case `activationDate`:
                this.setState({
                    activationDate: `Activé`,
                }, () => this.props.updateHeader(`activationDate`, this.state.activationDate));
                break;
            case `deactivationDate`:
                this.setState({
                    deactivationDate: `Aucune`,
                }, () => this.props.updateHeader(`deactivationDate`, this.state.deactivationDate));
                break;
            case `activationKey`:
                this.setState({
                    activationKey: event.target.value,
                });
                break;
            case `language`:
                this.props.updateHeader(`language`, event.target.value);
                break;
            default:
                break;
        }
    };

    onChangeActivationDate = (date) => {
        let deactivationDate = moment.utc(this.state.deactivationDate, `DD-MM-YYYY HH:mm`);
        let activationDate = date.format(`DD-MM-YYYY HH:mm`);
        if(date.isAfter(deactivationDate)) return;
        else {
            this.setState({
                activationDate: activationDate,
            }, () => this.props.updateHeader(`activationDate`, this.state.activationDate));
        }
    };

    onChangeDeactivationDate = (date) => {
        let activationDate = moment.utc(this.state.activationDate, `DD-MM-YYYY HH:mm`);
        let deactivationDate = date.format(`DD-MM-YYYY HH:mm`);
        if(date.isBefore(activationDate)) return;
        else {
            this.setState({
                deactivationDate: deactivationDate,
            }, () => this.props.updateHeader(`deactivationDate`, this.state.deactivationDate));
        }
    };

    onDrop = (acceptedFiles, rejectedFiles) => {
        if(acceptedFiles.length < 1) return;
        let self = this;
        let reader = new FileReader();
        let image = this.state.image;
        reader.readAsDataURL(acceptedFiles[0]);
        reader.onloadend = function() {
            image = reader.result;
            self.setState({
                image: image,
            }, () => self.props.updateHeader(`image`, self.state.image));
        };
    };

    onBlur = (event) => {
        switch(event.target.name){
            case `name`:
                if((!/\S/.test(this.state.name))) return;
                this.props.updateHeader(`name`, this.state.name);
                break;
            case `reference`:
                this.props.updateHeader(`reference`, this.state.reference);
                break;
            case `description`:
                this.props.updateHeader(`description`, this.state.description);
                break;
            case `activationKey`:
                this.props.updateHeader(`activationKey`, this.state.activationKey);
                break;
            default:
                break;
        }
    };

    render = () => {
        return(
            <div className={`SurveyHeaderRoot`}>
                <div className={`SurveyHeaderTitle`}>
                    {`EN-TÊTE DU QUESTIONNAIRE`}
                </div>
                <div className={`SurveyHeaderBody`}>
                    <div className={`SurveyHeaderNameDiv`}>
                        {`Titre du questionnaire :`} 
                        <input 
                            className={`SurveyHeaderName`} 
                            type='text' 
                            placeholder='Entrez le titre du questionnaire...'
                            name='name'
                            value={this.state.name} 
                            onChange={this.onChange}
                            onBlur={this.onBlur}
                        />
                    </div>
                    <div className={`SurveyHeaderDescriptionDiv`}>
                        {`Description du questionnaire :`}
                        <textarea
                            className={`SurveyHeaderDescription`}
                            rows={4} 
                            placeholder={`Entrez une description...`}
                            name={`description`} 
                            value={this.state.description}
                            onChange={(event) => this.onChange(event)}
                            onBlur={(event) => this.onBlur(event)}
                        />
                    </div>
                    <div className={`SurveyHeaderParameters`}>
                        <div className={`SurveyHeaderParameterDiv`}>
                            <div className={`SurveyHeaderParameterName`}>
                                {`Référence :`}
                            </div>
                            <div className={`SurveyHeaderParameterInput`}>
                                <input 
                                    className={`SurveyHeaderTextInput`}
                                    type={`text`}
                                    placeholder={`Référence...`}
                                    name={`reference`} 
                                    value={this.state.reference}
                                    onChange={(event) => this.onChange(event)}
                                    onBlur={(event) => this.onBlur(event)}
                                />
                            </div>
                        </div>
                        <div className={`SurveyHeaderParameterDiv`}>
                            <div className={`SurveyHeaderParameterName`}>
                                {`Date d'activation :`} 
                            </div>
                            <div className={`SurveyHeaderParameterInput`}>
                                <DateTime
                                    className={`SurveyHeaderDateWrapper`}
                                    inputProps={{className: `SurveyHeaderDate`, readOnly: true,}}
                                    dateFormat={`DD-MM-YYYY`}
                                    timeFormat={`HH:mm`}
                                    utc={true}
                                    value={this.state.activationDate}
                                    onChange={(date) => this.onChangeActivationDate(date)}
                                />
                                <button 
                                    className={`SurveyHeaderRemoveDateButton`} 
                                    name={`activationDate`}
                                    title={`Cliquez pour supprimer la date`}
                                    onClick={(event) => this.onChange(event)}
                                    style={this.state.activationDate === `Activé` ? {visibility: `hidden`} : {visibility: `visible`}}
                                >
                                    {`x`}
                                </button>
                            </div>
                        </div>
                        <div className={`SurveyHeaderParameterDiv`}>
                            <div className={`SurveyHeaderParameterName`}>
                                {`Date de désactivation :`}
                            </div>
                            <div className={`SurveyHeaderParameterInput`}>
                                <DateTime
                                    className={`SurveyHeaderDateWrapper`}
                                    inputProps={{className: `SurveyHeaderDate`, readOnly: true,}}
                                    dateFormat={`DD-MM-YYYY`}
                                    timeFormat={`HH:mm`}
                                    utc={true}
                                    value={this.state.deactivationDate}
                                    onChange={(date) => this.onChangeDeactivationDate(date)}
                                />
                                <button 
                                    className={`SurveyHeaderRemoveDateButton`} 
                                    name={`deactivationDate`}
                                    title={`Cliquez pour supprimer la date`}
                                    onClick={(event) => this.onChange(event)}
                                    style={this.state.deactivationDate === `Aucune` ? {visibility: `hidden`} : {visibility: `visible`}}
                                >
                                    {`x`}
                                </button>
                            </div>
                        </div>
                        <div className={`SurveyHeaderParameterDiv`}>
                            <div className={`SurveyHeaderParameterName`}>
                                {`Mot de passe (Accès hors période d'activation) :` }
                            </div>
                            <div className={`SurveyHeaderParameterInput`}>
                                <input 
                                    className={`SurveyHeaderTextInput`}
                                    type={`text`} 
                                    placeholder={`Mot de passe...`}
                                    name={`activationKey`} 
                                    value={this.state.activationKey}
                                    onChange={(event) => this.onChange(event)}
                                    onBlur={(event) => this.onBlur(event)}
                                />
                            </div>
                        </div>
                        <div className={`SurveyHeaderParameterDiv`}>
                            <div className={`SurveyHeaderParameterName`}>
                                {`Lien :`}  
                            </div>
                            <div className={`SurveyHeaderParameterInput`}>
                                <input 
                                    className={`SurveyHeaderLink`}
                                    type={`text`} 
                                    value={this.props.link} 
                                    readOnly={true}
                                />
                                <CopyToClipboard text={`http:${HOST_ADDRESS.IP}/forms/${this.props.link}`}>
                                    <button 
                                        className={`SurveyHeaderCopyLink`}
                                        onClick={() => this.props.displaySnackbar(`Lien copié`)}
                                    >
                                        {`Copier le lien`}
                                    </button>
                                </CopyToClipboard>
                            </div>
                        </div>
                        {/*
                        <div className={`SurveyHeaderParameterDiv`}>
                            <div className={`SurveyHeaderParameterName`}>
                                {`Langue :`}  
                            </div>
                            <div className={`SurveyHeaderParameterInput`}>
                                <select
                                    className={`SurveyHeaderSelectInput`}
                                    name={`language`}
                                    value={this.props.language}
                                    onChange={(event) => this.onChange(event)}
                                >
                                    <option value={`fr`}>
                                        {`Français`}
                                    </option>
                                    <option value={`en`}>
                                        {`Anglais`}
                                    </option>
                                </select>  
                            </div>                        
                        </div>
                        */}
                        <div className={`SurveyHeaderParameterDiv`}>
                            <div className={`SurveyHeaderParameterName`}/>
                            <div className={`SurveyHeaderParameterInput`}>
                                <input 
                                    className={`SurveyHeaderHangoutCheckbox`}
                                    name={`hangout`} 
                                    type={`checkbox`}
                                    checked={this.state.hangout}
                                    onChange={(event) => this.onChange(event)}
                                />
                                <div className={`SurveyHeaderParameterName`}>
                                    {`Questionnaire longue durée`}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`SurveyHeaderImageWrapper`}>
                        <Dropzone
                            className={`SurveyHeaderImage`}
                            accept={`image/*`}
                            name={`image`}
                            onDrop={(acceptedFiles, rejectedFiles) => this.onDrop(acceptedFiles, rejectedFiles)}
                            multiple={false}
                            title={`Cliquez pour importer ou déposez directement une image pour l'afficher`}
                        >
                            {this.state.image === `` ?
                                null:
                                <button 
                                    className={`SurveyHeaderImageRemover`} 
                                    name={`image`}
                                    title={`Cliquez pour supprimer l'image`}
                                    onClick={(event) => this.onChange(event)}
                                >
                                    {`x`}
                                </button>
                            }
                            {this.state.image === `` ?
                                <img
                                    className={`SurveyHeaderImagePlaceholder`} 
                                    src={ImagePlaceholder}
                                    role={`presentation`}
                                />:
                                <img
                                    className={`SurveyHeaderImageDisplayer`} 
                                    src={this.state.image}
                                    role={`presentation`}
                                />
                            }
                        </Dropzone>
                    </div>
                </div>
            </div>
        );
    };
}

export default SurveyHeader;