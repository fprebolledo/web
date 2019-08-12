/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';

export default class Stars extends Component {
  constructor() {
    super();
    this.state = {
      pintadas: 0,
      userid: null,
      publication: Object,
      likepublicationlist: Object,
      yaVote: false,
      likepublication: Object,
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.condiciones = this.condiciones.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handle = this.handle.bind(this);
    this.printearVote = this.printearVote.bind(this);
  }

  async componentDidMount() {
    await fetch('show', {
      headers: {
        Accept: 'application/json',
      },
    }).then(response => response.json())
      .then((json) => {
        this.setState({
          publication: json.publication,
          userid: json.currentUserid,
          likepublicationlist: json.likepublicationlist,
        }, () => {
          this.condiciones();
        });
      });
  }

  condiciones() {
    const { publication, likepublicationlist } = this.state;
    const likepublication = likepublicationlist.find(like => publication.id == like.publicationId);
    let stars = Math.round((publication.stars / publication.votes));
    if (!stars) {
      stars = 0;
    }
    let bool;
    if (!likepublication) {
      bool = false;
    } else {
      bool = true;
    }
    this.setState({ pintadas: stars, yaVote: bool, likepublication });
  }

  async handleUpdate(event) {
    const json = await fetch(`/publications/${event.target.dataset.pubid}/${event.target.dataset.id}/actualizar/${event.target.dataset.valor}`, {
      headers: {
        Accept: 'application/json',
      },
    }).then((response) => {
      return response.json();
    });
    this.setState({ publication: json.publication, likepublication: json.likepublication });
    this.printearVote();
  }

  async handle(event) {

    const json = await fetch(`/publications/${event.target.dataset.pubid}/actualizando/${event.target.dataset.valor}`, {
      headers: {
        Accept: 'application/json',
      },
    }).then(response => response.json());
    this.setState({ publication: json.publication, likepublication: json.likepublication, yaVote: true });
    this.printearVote();
  }

  printearVote() {
    const { yaVote, likepublication, publication } = this.state;
    let puntuacion = 0;
    if (publication.votes === 0) {
      puntuacion = 0;
    } else {
      puntuacion = parseFloat(publication.stars / publication.votes).toFixed(2);
    }
    let stars = Math.round((publication.stars / publication.votes));
    if (!stars) {
      stars = 0;
    }
    const retorno = (number, stars1) => {
      if (number <= stars1) {
        return <a key={number} role="button" tabIndex="0" className="starp" onClick={this.handle} data-valor={number} data-pubid={publication.id}>&#9733;</a>
      }
      else {
        return <a key={number} role="button" tabIndex="0" className="star" onClick={this.handle} data-valor={number} data-pubid={publication.id}>&#9733;</a>
      }
    }
    const retorno2 = (number, stars1) => {

      if (number <= stars1) {
        return (
        <a key={number} role="button" tabIndex="0" className="starp" onClick={this.handleUpdate} data-valor={number} data-id={likepublication.id} data-pubid={publication.id}>&#9733;</a>
      )}
      else {
        return <a key={number} role="button" tabIndex="0" className="star" onClick={this.handleUpdate} data-valor={number} data-id={likepublication.id} data-pubid={publication.id}>&#9733;</a>
      }
    }
    if (!yaVote) {
      return (
        <div>
          {[1, 2, 3, 4, 5].map(number => (
            retorno(number, stars)
          ))}
          <label> Puntuación:</label>
          <p>{`${puntuacion} de 5, Total: ${publication.votes}`}</p>
        </div>
      );
    }
    return (
      <div>
        {[1, 2, 3, 4, 5].map(number => (
          retorno2(number, likepublication.value)
        ))}
        <label > Puntuación:</label>
        <p>{`${puntuacion} de 5, Cantidad de votos: ${publication.votes}`}</p>
      </div>
    );
  }

  render() {
    const { yaVote } = this.state;
    let parrafo;
    if (yaVote){
      parrafo = <p id = "mivoto"> Mi voto:</p>
    }
    return (
      <div className="star-rating">
        {parrafo}
        {this.printearVote()}
      </div>
    );
  }
}
