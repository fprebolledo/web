import React from 'react';
import ReactDOM from 'react-dom';
// import App from './components/Select';
import Comments from './components/Comments';
import Form from './components/Form';
import FormJourney from './components/FormJourney';
import Stars from './components/Stars';
import Seguir from './components/Seguir';
import FormUser from './components/FormUser';

// const reactAppContainer = document.getElementById('react-app');
const reactAppContainerJourney = document.getElementById('react-app-journey');
const reactAppContainer = document.getElementById('react-app');
const form = document.getElementById('react-form');
const formjourney = document.getElementById('react-journey');
const com = document.getElementById('react-comments');
const star = document.getElementById('react-stars');
const seguidor = document.getElementById('seguidores');
const user = document.getElementById('react-user');


// if (reactAppContainer) {
//   ReactDOM.render(<App {...(reactAppContainer.dataset)} />, reactAppContainer);
// }
// if (reactAppContainerJourney) {
//   ReactDOM.render(<AppJourney {...(reactAppContainerJourney.dataset)} />, reactAppContainerJourney);
// }

if (reactAppContainer) {
  ReactDOM.render(<App {...(reactAppContainer.dataset)} />, reactAppContainer);
}
if (seguidor) {
  ReactDOM.render(<Seguir />, seguidor);
}
if (com) {
  ReactDOM.render(<Comments />, com);
}
if (form) {
  ReactDOM.render(<Form {...(form.dataset)} />, form);
}
if (formjourney) {
  ReactDOM.render(<FormJourney {...(formjourney.dataset)} />, formjourney);
}
if (star) {
  ReactDOM.render(<Stars />, star);
}
if (user) {
  ReactDOM.render(<FormUser {...(user.dataset)} />, user);
}
