import React from 'react';
import ReactDOM from 'react-dom/client';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import './index.css';
import App from './App.js';

// export const apolloClient = new ApolloClient({
//   uri: 'http://localhost:4000',
// });

export const apolloClient = new ApolloClient({
  uri: 'http://zoozl.net:1603',
});

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  // <React.StrictMode>
  <ApolloProvider client={apolloClient}>
    <App />
  </ApolloProvider>
  // </React.StrictMode>
);
