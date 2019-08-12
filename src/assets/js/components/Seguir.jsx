/* eslint-disable react/self-closing-comp */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';


export default class Seguir extends Component {
  constructor() {
    super();
    this.state = {
      seguido: false,
      user: [],
      currentUser: false,
    };

    this.handle = this.handle.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  async componentDidMount() {
    const informacion = await fetch('show', {
      headers: {
        Accept: 'application/json',
      },
    })
      .then(response => response.json());
    this.setState({ seguido: informacion[0], user: informacion[1], currentUser: informacion[2] });
  }

  async handle(event) {
    const { user } = this.state;
    if (event.target.dataset.ac === '0') {
      const informacion = await fetch(`/followins/${event.target.dataset.action}/${user.id}`, {
        headers: {
          Accept: 'application/json',
        },
      })
        .then(response => response.json());
      this.setState({ seguido: informacion });
    } else {
      const informacion = await fetch(`/followins/${event.target.dataset.action}/${user.id}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
        },
      })
        .then(response => response.json());
      this.setState({ seguido: informacion });
    }
  }

  render() {
    const { seguido, currentUser } = this.state;
    if (currentUser) {
      if (seguido) {
        return (
          <div>
            <button className="user-button-seguir" data-ac="1" data-action="deletefollower" onClick={this.handle}> Dejar de seguir</button>
          </div>
        );
      }
      return (
        <div>
          <button className="user-button-seguir" data-ac="0" data-action="addfollower" onClick={this.handle}> Seguir</button>
        </div>
      );
    }
    return (
      <div></div>
    );
  }
}
