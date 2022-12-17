/* eslint-disable no-console */
import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom'; // eslint-disable-line
import { createOauthFlow } from 'react-oauth-flow'; // eslint-disable-line
import logo from './logo.svg';
import './App.css';

const { Sender, Receiver } = createOauthFlow({
  authorizeUrl: 'https://marketplace.gohighlevel.com/oauth/chooselocation',
  tokenUrl: 'https://api.msgsndr.com/oauth/token',
  clientId: process.env.REACT_APP_CLIENT_ID,
  clientSecret: process.env.REACT_APP_CLIENT_SECRET,
  redirectUri: 'http://localhost:3000/auth/switchboard',
});

class App extends Component {
  handleSuccess = (accessToken, { response, state }) => {
    console.log('Success!');
    console.log('AccessToken: ', accessToken);
    console.log('Response: ', response);
    console.log('State: ', state);
  };

  handleError = async error => {
    console.error('Error: ', error.message);

    const text = await error.response.text();
    console.log(text);
  };

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to Switchboard</h1>
          </header>

          <Route
            exact
            path="/"
            render={() => (
              <div>
                <Sender
                  state={{ to: '/auth/success' }}
                  render={({ url }) => <a href={url}>Connect to Switchboard</a>}
                />
              </div>
            )}
          />

          <Route
            exact
            path="/auth/switchboard"
            render={({ location }) => (
              <Receiver
                location={location}
                onAuthSuccess={this.handleSuccess}
                onAuthError={this.handleError}
                render={({ processing, state, error }) => {
                  if (processing) {
                    return <p>Processing!</p>;
                  }

                  if (error) {
                    return <p style={{ color: 'red' }}>{error.message}</p>;
                  }

                  return <Redirect to={state.to} />;
                }}
              />
            )}
          />

          <Route
            exact
            path="/auth/success"
            render={() => <div>Successfully authorized Switchboard!</div>}
          />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
