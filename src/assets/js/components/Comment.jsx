import React, { Component } from 'react';

export default class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comentario: '',
      userid: 0,
      likecommentlist: [],
      userList: [],
      username: '',
      propio: '',
      likecomment: '',
      editing: false,

    };
    this.input = React.createRef();
    this.handleEdit = this.handleEdit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleMg = this.handleMg.bind(this);
    this.printearPropio = this.printearPropio.bind(this);
    this.handleUpdateMg = this.handleUpdateMg.bind(this);
  }

  componentDidMount() {
    this.setState({
      userList: this.props.userList, userid: this.props.userid, comentario: this.props.comentario, likecommentlist: this.props.likecommentlist,
    }, () => this.condiciones());
  }

  condiciones() {
    const { comentario, userList, userid, likecommentlist } = this.state;
    const { username } = userList.find(user => comentario.userId === user.id);
    let bool;
    let ranking;
    if (userid === comentario.userId) {
      bool = true;
    } else {
      bool = false;
    }
    const likecomment = likecommentlist.find(like => comentario.id === like.commentId);
    // if (likecomment) {
    //   ranking = likecomment.value;
    // }
    this.setState({ username, propio: bool, likecomment });
  }

  printearPropio() {
    const { propio, comentario } = this.state;
    if (propio) {
      return (
        <div className="header" id="submenu">
          <i className="fas fa-chevron-down" />
          <div className="dropdown-content comment">
            <button className="button-without delete" onClick={this.handleEdit}> Editar </button>
            <button className="button-without delete" id={comentario.id} onClick= {this.props.handle}> Borrar </button>

          </div>
        </div>
      );
    }
  }

  async handleUpdateMg(event) {
    const data = event.target.dataset;
    const comment = await fetch(`/publications/${data.comment}/${data.like}/actualizar/${data.action}`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).then(response => response.json());
    this.setState({ comentario: comment[0], likecommentlist: comment[1] });
    this.condiciones();
  }

  async handleMg(event) {
    const comment = await fetch(`/publications/${event.target.dataset.comment}/${event.target.dataset.action}/${event.target.dataset.publication}`, {
      headers: {
        Accept: 'application/json',
      },
    }).then(response => response.json());
    this.setState({ comentario: comment[0], likecommentlist: comment[1] });
    this.condiciones();
  }

  printearBotones() {
    const { likecomment, comentario } = this.state;
    if (likecomment) {
      if (likecomment.value == -1) {
        return (
          <div>
            <div>
              <button className="button-without" onClick={this.handleUpdateMg} className="button-without"> <i data-comment={comentario.id} data-action='megusta' data-like={likecomment.id} className="far fa-thumbs-up"></i> </button>
            </div>
            <div>
              <button className="button-without no"><i className="far fa-thumbs-down" /></button>
            </div>
          </div>
        );
      } if (likecomment.value == 0) {
        return (
          <div>
            <div>
              <button onClick={this.handleUpdateMg} className="button-without"> <i data-comment={comentario.id} data-action='megusta' data-like={likecomment.id} className="far fa-thumbs-up"></i> </button>
            </div>
            <div>
              <button onClick={this.handleUpdateMg} className="button-without"><i data-comment={comentario.id} data-action='nomegusta' data-like={likecomment.id} className="far fa-thumbs-down"></i></button>
            </div>
          </div>
        );
      } if (likecomment.value == 1) {
        return (
          <div>
            <div>
              <button className="button-without no"><i className="far fa-thumbs-up"></i></button>
            </div>
            <div >
              <button onClick={this.handleUpdateMg} className="button-without"><i data-comment={comentario.id} data-action='nomegusta' data-like={likecomment.id} className="far fa-thumbs-down"></i></button>
            </div>
          </div>
        );
      }
    } else {
      return (
        <div>
          <button onClick={this.handleMg} className="button-without"><i data-comment={comentario.id} data-action='nomegusta' data-publication={comentario.publicationId} className="far fa-thumbs-down"></i></button>
          <button onClick={this.handleMg} className="button-without"><i data-comment={comentario.id} data-action='megusta' data-publication={comentario.publicationId} className="far fa-thumbs-up"></i></button>
        </div>
      );
    }
  }

  handleEdit() {
    this.setState({ editing: true });
  }

  handleCancel() {
    this.setState({ editing: false });
  }

  async handleSubmit(event) {
    event.preventDefault();
    const { comentario } = this.state;
    const data = new FormData(event.target);
    const json = await fetch(`/publications/${comentario.publicationId}/comments/${comentario.id}`, {
      method: 'PATCH',
      body: data,
      headers: {
        Accept: 'application/json',
      },
    }).then((response) => {
      return response.json();
    });
    this.setState({ comentario: json, editing: false });
  }

  render() {
    let body = null;
    const {
      comentario, username, editing, userid,
    } = this.state;

    if (editing) {
      return (
        <div id="p">
          <div className="header" id="user-comment">{username}</div>
          <div className="header" id="date-comment">{comentario.date}</div>
          {this.printearPropio()}
          <br />
          <form onSubmit={this.handleSubmit}>
            <div className="field-comment">
              <textarea className="comentario-input" type="text" name="content" placeholder="Ingrese su opinión de la publicación aquí..." ref={this.input} defaultValue={comentario.content} />
              <input type="hidden" name="userId" value={userid} />
            </div>
            <div className="field-chico">
              <button>Editar</button>
              <button onClick={this.handleCancel}>cancelar</button>
            </div>
          </form>
          <br />
          <div className="opciones">
            <div id="likes-count">{`Votos: ${comentario.ranking}`}</div>
            {this.printearBotones()}
          </div>
        </div>
      );
    }
    return (
      <div id="p">
        <div className="header" id="user-comment">{username}</div>
        <div className="header" id="date-comment">{comentario.date}</div>
        {this.printearPropio()}
        <br />
        <div id="commentj">{comentario.content}</div>
        <br />
        <div className="opciones">
          <div id="likes-count">{`Votos positivos: ${comentario.ranking}; Votos negativos: ${comentario.rankingN}`}</div>
          {this.printearBotones()}
        </div>
      </div>
    );
  }
}
