import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider, createNetworkInterface, ApolloClient } from 'react-apollo';
import 'semantic-ui-css/semantic.min.css';

import './site.css';
import registerServiceWorker from './registerServiceWorker';
import App from './App';

const networkInterface = createNetworkInterface({
    uri: '__SIMPLE_API_ENDPOINT__',
});

const client = new ApolloClient({
    networkInterface,
});

ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById('root'),
);

registerServiceWorker();
