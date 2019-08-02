import React from 'react';
import ReactDOM from 'react-dom';

import { Route, BrowserRouter } from 'react-router-dom';

import { ApolloProvider } from 'react-apollo';
import { ApolloLink } from 'apollo-client-preset';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import Header from './imports/components/Header';
import BackendHelper from './imports/components/BackendHelper';
import Login from './pages/login/Login';
import Home from './pages/home/Home';
import SurveyUpdater from './pages/surveyUpdater/SurveyUpdater';
import AdminHome from './pages/adminHome/AdminHome';
import UserUpdater from './pages/userUpdater/UserUpdater';
import SurveyForm from './pages/surveyForm/SurveyForm';
import AnswerDownloader from './pages/answerDownloader/AnswerDownloader';
import SurveyCongratulation from './pages/surveyCongratulation/SurveyCongratulation';

import { HOST_ADDRESS } from './imports/helpers/Constants';
import { getJWT } from './imports/helpers/Tokens';

import './index.css';

const httpLink = new HttpLink({uri: `http://${HOST_ADDRESS.IP}/graphql`});
const graphQLWithoutAuth = ['FindSurveyFromLink', 'AddSurveyAnswer'];
const defaultOptions = {
    watchQuery: {
        fetchPolicy: 'network-only',
        errorPolicy: 'ignore',
    },
    query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
    },
}

const middlewareAuthLink = new ApolloLink((operation, forward) => {
    if(graphQLWithoutAuth.indexOf(operation.operationName) === -1){
        operation.setContext({
            headers: {
                authorization: `Bearer ${getJWT()}`
            }
        });
    }
    return forward(operation);
});

const httpLinkWithAuthToken = middlewareAuthLink.concat(httpLink);

const cache = new InMemoryCache();

const client = new ApolloClient({
    link: httpLinkWithAuthToken,
    defaultOptions: defaultOptions,
    cache: cache,
});

ReactDOM.render((
    <BrowserRouter>
        <ApolloProvider client={client}>
            <BackendHelper>
                <Header />
                <Route exact path={`/`} component={Login}/>
                <Route exact path={`/login`} component={Login}/>
                <Route exact path={`/surveys`} component={Home}/>
                <Route exact path={`/surveys/:id`} component={SurveyUpdater}/>
                <Route exact path={`/services`} component={AdminHome}/>
                <Route exact path={`/users/:id`} component={UserUpdater}/>
                <Route exact path={`/forms/:link`} component={SurveyForm}/>
                <Route exact path={`/answers/:id`} component={AnswerDownloader}/>
                <Route exact path={`/congrats/:link`} component={SurveyCongratulation}/>
            </BackendHelper>
        </ApolloProvider>
    </BrowserRouter>
    ),
    document.getElementById('root')
);
