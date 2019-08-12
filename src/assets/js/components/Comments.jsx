/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import Comment from './Comment';
import { types } from 'util';

export default class Comments extends Component {
  constructor() {
    super();
    this.state = {
      tope: 5,
      userid: -1,
      likecommentlist: [],
      commentlist: [],
      commentlistshow: [],
      userList: [],
      enabled: true,
      loading: true,
      dis: true,
      publication: Object,
    };
    this.input = React.createRef();
    this.handleDelete = this.handleDelete.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.mostrarComentarios = this.mostrarComentarios.bind(this);
    this.changeTope = this.changeTope.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.changeTopeMenos = this.changeTopeMenos.bind(this);
    this.mostrarBotones = this.mostrarBotones.bind(this);

  }

  async componentDidMount() {
    await fetch('show', {
      headers: {
        Accept: 'application/json',
      },
    }).then(response => response.json())
      .then((json) => {
        const {tope} = this.state;
        let comentarios = json.commentsList;
        comentarios.sort((a,b) => a.id - b.id);
        let comentarios2 = comentarios.slice(Math.max(comentarios.length - tope, 0));
        this.setState({
          commentlistshow: comentarios2, userList: json.userList, 
          likecommentlist: json.likecommentlist, commentlist: comentarios,
          userid: json.currentUserid, publication: json.publication, loading: false,
        });
      });
  }

  async handleDelete(event) {
    console.log(event.target.id);
    const { publication } = this.state;
    const json = await fetch(`/publications/${publication.id}/comments/${event.target.id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
      },
    }).then(response => response.json());
    this.setState({ commentlist: json.commentsList });
  }

  mostrarComentarios() {
    let comentariost = this.state.commentlist;
    const { tope } = this.state;
    comentariost.sort((a, b) => a.id - b.id);
    comentariost = comentariost.slice(Math.max(comentariost.length - tope, 0));
    const { likecommentlist, userid, userList } = this.state;
    return (
      <div className="fracaso">
        {comentariost.map(comentario => (
          <Comment key={comentario.id} comentario={comentario} likecommentlist={likecommentlist} userid={userid} userList={userList} handle={this.handleDelete} />
        ))}
      </div>
    );
  }

  changeTope() {
    let comentarios = this.state.commentlist;
    let { tope } = this.state;
    tope = tope + 5;
    this.setState({ tope: tope });
    if (tope >= comentarios.length) {
      if (tope > 5) {
        this.setState({ enabled: false, dis: false });
      } else {
        this.setState({ enabled: false, dis: true });
      }
    } else {
      if (tope > 5) {
        this.setState({ enabled: true, dis: false });
      } else {
        this.setState({ enabled: true, dis: true });
      }
    }
  }

  changeTopeMenos() {
    let comentarios = this.state.commentlist;
    let { tope } = this.state;
    tope = Math.max(5, tope - 5);
    this.setState({ tope: tope });
    if (tope >= comentarios.length) {
      if (tope > 5) {
        this.setState({ enabled: false, dis: false });
      } else {
        this.setState({ enabled: false, dis: true });
      }
    } else {
        if (tope > 5) {
          this.setState({ enabled: true, dis: false });
        } else {
          this.setState({ enabled: true, dis: true });
      }
    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const { publication } = this.state;
    const json = await fetch(`/publications/${publication.id}/comments`, {
      method: 'POST',
      body: data,
      headers: {
        Accept: 'application/json',
      },
    }).then((response) => {
      return response.json();
    });
    this.setState({ commentlist: json.commentsList }, () => {
      this.mostrarComentarios();
    });
  }
  
  mostrarBotones() {
    const { enabled, userid, dis, loading, commentlist } = this.state;
    console.log(commentlist.length);
    if (commentlist.length > 5) {
      return (
        <div>
          <button id="button-mas" disabled={!enabled} onClick={this.changeTope}>Mostrar más</button>
          <button id="button-mas" disabled={dis} onClick={this.changeTopeMenos}>Mostrar menos</button>
        </div>
      );
    }
  }

  render() {
    const { enabled, userid, dis, loading } = this.state;
    if (loading) {
      return (
        <p>Cargando .... </p>
      );
    }
    return (
      <div>
        <h2 className="title-comment"> Ultimos Comentarios</h2>
        {this.mostrarBotones()}
        <div className="comentarios">
          {this.mostrarComentarios()}
        </div>
        <div className="new-comment-publication">
          <div className="comment">
            <form onSubmit={this.handleSubmit}>
              <div className="field-comment">
                <textarea className="comentario-input" type="text" name="content" placeholder="Ingrese su opinión de la publicación aquí..." ref={this.input} defaultValue="" />
                <input type="hidden" name="userId" value={userid} />
              </div>
              <div className="field-chico">
                <button>Comentar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
