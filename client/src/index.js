import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider, createNetworkInterface, ApolloClient } from 'react-apollo';
import { Router } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import 'semantic-ui-css/semantic.min.css';

import './site.css';
import registerServiceWorker from './registerServiceWorker';
import App from './components/App';

const history = createHistory();


const networkInterface = createNetworkInterface({
    uri: '/graphql',
});

networkInterface.use([
    {
        applyMiddleware({ options }, next) {
            const token = localStorage.getItem('token');
            if (token) {
                if (!options.headers) {
                    options.headers = {};
                }
                options.headers.authorization = `Bearer ${token}`;
            }
            next();
        },
    },
]);

networkInterface.useAfter([
    {
        applyAfterware({ response }, next) {
            if (response.status === 401) {
                history.push(`/login?next=${history.location.pathname}`);
            }
            next();
        },
    },
]);


const client = new ApolloClient({
    networkInterface,
});

ReactDOM.render(
    <ApolloProvider client={client}>
        <Router history={history}>
            <App />
        </Router>
    </ApolloProvider>,
    document.getElementById('root'),
);

registerServiceWorker();
