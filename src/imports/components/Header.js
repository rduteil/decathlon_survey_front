import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

import { isLoggedIn, removeJWT, getUsername, getRoles } from '../helpers/Tokens';

import Logo from '../images/logo.png';
import '../styles/Header.css';

class Header extends Component {
    disconnect = () => {
        removeJWT();
    };

    render = () => {
        if(
            this.props.location.pathname.indexOf(`/forms`) !== -1 ||
            this.props.location.pathname.indexOf(`/congrats`) !== -1
        ){
            return(
                <div className={`HeaderRoot`}>
                    <img className={`HeaderLogo`} src={Logo} role={`presentation`}/>
                    <div className={`HeaderHint`}>
                        {`REPONSE A UN QUESTIONNAIRE EN LIGNE`}
                    </div>
                </div>
            );
        }

        return(
            <div className={`HeaderRoot`}>
                <img className={`HeaderLogo`} src={Logo} role={`presentation`}/>
                {getRoles() !== null && !!~getRoles().indexOf(`ROLE_ADMIN`) ?
                    <Link className={`HeaderLink`} to={isLoggedIn() ? `/services`: `/login`}>
                        {`ADMINISTRATEUR`}
                    </Link> :
                    <Link className={`HeaderLink`} to={isLoggedIn() ? `/surveys`: `/login`}>
                        {`EXPLORATEUR`}
                    </Link>
                }
                <Link className={`HeaderLink`} onClick={isLoggedIn() ? this.disconnect : null} to={`/login`}>
                     {isLoggedIn() ? `DECONNEXION` : `CONNEXION`}
                </Link>
                <div className={`HeaderGreetings`}>
                    {isLoggedIn() ? `Connecté sous le nom de : ${getUsername()}` : 'Veuillez vous connecter'}
                </div>
            </div>
        );
    };
} export default withRouter(Header);