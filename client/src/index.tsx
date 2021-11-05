import ReactDOM from 'react-dom';
import * as React from 'react';
import { Component } from 'react-simplified';
import { HashRouter, Route } from 'react-router-dom';
import { Container, Button, Form, FormControl, Nav, Navbar, Row, Col } from 'react-bootstrap';
import { AllGames, MainCarousel, MainFooter, Navigation } from './app-components';
// Import components

class MainPage extends Component {
  render() {
    return (
      <>
        <h1>Velkommen til mainComp</h1>
      </>
    );
  }
}

class SearchPage extends Component {
  render() {
    return (
      <>
        <div>Search page goes here!</div>
      </>
    );
  }
}

ReactDOM.render(
  <HashRouter>
    <div id="main-container">
      <div id="content-wrapper">
        <MainCarousel />
        <Navigation />
        <Route exact path="/games" component={AllGames} />
        <Route exact path="/games/:offset" component={AllGames} /> {/* for pagination */}
        <Route exact path="/game/:slug" component={AllGames} />
        <MainFooter />
      </div>
    </div>
  </HashRouter>,
  document.getElementById('root')
);
