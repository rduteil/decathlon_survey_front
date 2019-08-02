import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

import { HOST_ADDRESS } from '../../imports/helpers/Constants';
import { setJWT, getRoles } from '../../imports/helpers/Tokens';

import './styles/Login.css';

class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
            wrongCredentials: false,
        };
    }

    handleConnection = () => {
        var params = new URLSearchParams();
        params.append(`username`, this.state.username);
        params.append(`password`, this.state.password);
        axios({
            method: `post`,
            url: `http://${HOST_ADDRESS.IP}/api/login_check`,
            data: params
        }).then(
            (response) => {
                setJWT(response.data.token);
                if(response.request.status === 200){
                    if(!!~getRoles().indexOf(`ROLE_ADMIN`)){
                        this.props.history.push(`/services`);
                    }
                    else {
                        this.props.history.push(`/surveys`);
                    }
                }
            },
            (error) => {
                if(error.request !== undefined && error.request.status !== 200){
                    this.setState({password: ``, wrongCredentials: true});
                }
            }
        );
    };

    onChange = (event) => {
        switch(event.target.name){
            case 'username':
                this.setState({username: event.target.value, wrongCredentials: false,});
                break;
            case 'password':
                this.setState({password: event.target.value, wrongCredentials: false,});
                break;
            default:
                break;
        }
    };

    onKeyPressed = (event) => {
        if(event.key === 'Enter'){
            this.handleConnection();
        }
    };

    render = () => {
        if(getRoles() !== null && getRoles()[0] === 'ROLE_ADMIN'){
            return(<Redirect to={'/services'}/>);
        }
        else if(getRoles() !== null && getRoles()[0] === 'ROLE_USER'){
            return(<Redirect to={'/home'}/>);
        }

        return(
            <div className='LoginPageRoot'>
                <div className='LoginPageHint'>
                    {`Connectez vous pour accéder à la plateforme : `}
                </div>
                <input
                    className='LoginPageUsername'
                    name='username'
                    value={this.state.username}
                    onChange={this.onChange}
                    onKeyPress={this.onKeyPressed}
                    type='text'
                    placeholder="Nom d'utilisateur..."
                />
                <input
                    className='LoginPagePassword'
                    name='password'
                    value={this.state.password}
                    onChange={this.onChange}
                    onKeyPress={this.onKeyPressed}
                    type='password'
                    placeholder='Mot de passe...'
                />
                <button className='LoginPageSubmit' onClick={this.handleConnection}>
                    {`Se connecter`}
                </button>
                {this.state.wrongCredentials ? <div className='LoginPageError'>
                    {`Mauvais identifiant / Mot de passe`}
                </div>:''}
            </div>
        );
    };
}

export default Login;
