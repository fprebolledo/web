/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';

export default class FormUser extends Component {
  constructor() {
    super();

    this.state = {
      user: [],
      namevalidation: 'Campo obligatorio (*)',
      usernamevalidation: 'Campo obligatorio (*)',
      emailvalidation: 'Campo obligatorio (*)',
      passvalidation: 'Campo obligatorio (*)',
      descriptionvalidation: 'Campo obligatorio (*)',
      sexvalidation: 'Campo obligatorio (*)',
      agevalidation: 'Campo obligatorio (*)',
      age: null,
      sex: null,
      name: null,
      username: null,
      pass: null,
      passedit : '',
      email: null,
      description: null,
      loading: true,
      dis: true,
      buton: '',
      condpass: false,
      new2: '',
      editing: false,
      emails : [],
    };

    this.handleToWords = this.handleToWords.bind(this);
    this.handleToNumbers = this.handleToNumbers.bind(this);
    this.handleDescription = this.handleDescription.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleEnable = this.handleEnable.bind(this);
    this.func = this.func.bind(this);
    this.handleisUniq = this.handleisUniq.bind(this);
    this.handleEmail = this.handleEmail.bind(this);
  }

  async componentDidMount() {
    this.setState({new2: this.props.new});
    if (this.props.new === '1') {
      const user = await fetch('new', {
        headers: {
          Accept: 'application/json',
        },
      })
        .then(response => response.json());

      console.log('AQUI');
      this.setState({ emails: user[1], user:user[0], sex: user[0].sex, age: user[0].age, name: user[0].name, username: user[0].username, email: user[0].email, description: user[0].description, pass: user[0].password, loading: false, buton: 'Crear usuario' });
    } else {
      const user = await fetch('edit', {
        headers: {
          Accept: 'application/json',
        },
      }).then(response => response.json());
      this.setState({ namevalidation: '', agevalidation: '', sexvalidation: '', datevalidation: '', usernamevalidation: '', emailvalidation: '', descriptionvalidation: '', passvalidation: '', editing: true });
      this.setState({ user,condpass:true, sex: user.sex, age: user.age, name: user.name, username: user.username, email: user.email, description: user.description, pass: user.password, loading:false, buton:'Editar', dis: false });

    }
  }

  handleEnable() {
    const { namevalidation, usernamevalidation, emailvalidation, passvalidation, descriptionvalidation, sexvalidation, agevalidation, condpass } = this.state;
    if (namevalidation.length === 0 && usernamevalidation.length === 0 && emailvalidation.length === 0 && (passvalidation.length === 0 || condpass) && descriptionvalidation.length === 0 && sexvalidation.length === 0 && agevalidation.length == 0) {
      this.setState({ dis: false });
    } else {
      this.setState({ dis: true });
    }
  }  
  
  validateEmail(token) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test((token).toLowerCase());
  }

  handleLargo(token) {
    if (token.length < 3) {
      return false;
    } else {
      return true;
    }
  }

  handleEmpty(token) {
    if (token.length > 0) {
      return true;
    } else {
      return false;
    }
  }
    
  handleSelect(event) {
    this.setState({ sex: event.target.value, sexvalidation:'' }, () => { this.handleEnable(); });
  }
    
  handleDescription(event) {
    const isOkEmpty = this.handleEmpty(event.target.value);
    const isOkLargo = event.target.value.length > 16;
    if (!isOkEmpty) {
      this.setState({ descriptionvalidation: 'Debes ingresar una descripcion ', description: event.target.value }, () => { this.handleEnable(); });
      this.setState({ description: null });
      return;
    }
    if (!isOkLargo) {
      this.setState({ descriptionvalidation: 'La descripción debe tener más de 16 caracteres ', description: event.target.value }, () => { this.handleEnable(); });
      return;
    }
    this.setState({ descriptionvalidation: '', description: event.target.value }, () => { this.handleEnable(); });
  }

  handleToWords(event) {
    const isOkLargo = this.handleLargo(event.target.value);
    const isOkEmpty = this.handleEmpty(event.target.value);
    const {new2 } = this.state;
    if (!isOkEmpty) {
      if (event.target.name === 'name') {
        this.setState({ namevalidation: 'Debes agregar un nombre', name: event.target.value }, () => { this.handleEnable(); });
        this.setState({ name: null });
        return;
      }
      if (event.target.name === 'username') {
        this.setState({ usernamevalidation: 'Debes agregar un nombre de usuario', username: event.target.value }, () => { this.handleEnable(); });
        this.setState({ username: null });
        return;
      } 
      if (event.target.name === 'email') {
        this.setState({ emailvalidation: 'Debes agregar un email', email: event.target.value }, () => { this.handleEnable(); });
        this.setState({ email: null });
        return;
      } 
      if (event.target.name === 'password' ) {
        if (new2 != '1') {
          console.log('wtf');
          this.setState({ passvalidation: '(Deja en blanco si no quieres editar tu contraseña)', passedit: event.target.value, condpass: true }, () => { this.handleEnable(); });
        } else {
          this.setState({ passvalidation: 'Debes agregar una contraseña', passedit: event.target.value }, () => { this.handleEnable(); });
        }
        return;
      } 
            
    }
    if (!isOkLargo) {
      if (event.target.name === 'name') {
        this.setState({ namevalidation: 'Largo debe ser mayor a 3 letras', name: event.target.value }, () => { this.handleEnable(); });
        return;
      }
      if (event.target.name === 'username') {
        this.setState({ usernamevalidation: 'Largo debe ser mayor a 3 letras', username: event.target.value }, () => { this.handleEnable(); });
        return;
      } 
      if (event.target.name === 'email') {
        this.setState({ emailvalidation: 'Largo debe ser mayor a 3 letras', email: event.target.value }, () => { this.handleEnable(); });
        return;
      } 
      if (event.target.name === 'password') {
          this.setState({ passvalidation: 'Largo debe ser mayor a 3 letras', passedit: event.target.value, condpass: false }, () => { this.handleEnable(); });
        return;
      } 
    }
    if (isOkEmpty && isOkLargo) {
      if (event.target.name === 'name') {
        this.setState({ namevalidation: '', name: event.target.value  }, () => { this.handleEnable(); });
        return;
      } 
      if (event.target.name === 'username') {
        this.setState({ usernamevalidation: '', username: event.target.value }, () => { this.handleEnable(); });
        return;
      }
      if (event.target.name === 'email') {
        this.setState({ emailvalidation: '', email: event.target.value }, () => { this.handleEnable(); });
        const isOkEmail = this.validateEmail(event.target.value);
        if (!isOkEmail) {
          this.setState({ emailvalidation: 'Debes ingresar un email valido', email: event.target.value }, () => { this.handleEnable(); });
          return;
        }
        return;
      } 
      if (event.target.name === 'password') {
        this.setState({ passvalidation: '', passedit: event.target.value }, () => { this.handleEnable(); });
        return;
      } 
    }
        
  }


  handleToNumbers(event) {
    const isOkEmpty = this.handleEmpty(event.target.value);
    if (!isOkEmpty) {
      this.setState({ agevalidation: 'Debes ingresar una edad', age: event.target.value }, () => { this.handleEnable(); });
      this.setState({ age: null });
            
    }
    else {
      this.setState({ agevalidation: '', age: event.target.value }, () => { this.handleEnable(); });

    }
  }

  handleisUniq(event) {
    const { emails } = this.state;
    if (emails.includes(event.target.value)) {
      return false;
    }
    return true;
  }

  handleEmail(event) {
    if (!this.handleisUniq(event)) {
      this.setState({ emailvalidation: 'este email ya existe', email: event.target.value }, () => { this.handleEnable(); });
      return;
    }
    if (!this.validateEmail(event.target.value)) {
      this.setState({ emailvalidation: 'ingrese un email valido', email: event.target.value }, () => { this.handleEnable(); });
      return;
    }
    this.handleToWords(event);
  }

  func () {
    const { condpass, passvalidation } = this.state;
    if (condpass) {
      return (<p className='advertencia'>(Deja en blanco si no quieres editar tu contraseña)</p>)
    } else {
      return (<p className="error">{passvalidation}</p>)
    }
  }
  
  render() {
    const { namevalidation, usernamevalidation, emailvalidation, descriptionvalidation, agevalidation, passvalidation, sexvalidation } = this.state;
    const { name, username, email, description, passedit, age, sex, loading, buton, dis, condpass, editing } = this.state;
    if (loading) {
      return (
              <p>Cargando ..... </p>
      );
    }

    return (
            <div>
                <form action={this.props.url} enctype="multipart/form-data" method="post">
                    {this.props.new != '1' && <input type="hidden" name="_method" value="patch" />}
                <div class="field">
                    <label for="name">Nombre</label>
                    <input type="text" name="name" value={name} onChange={this.handleToWords} />
                    <p className="error">{namevalidation}</p>
                </div>
                

                <div class="field">
                    <label for="username">Usuario</label>
                    <input type="text" name="username" value={username} onChange={this.handleToWords} />
                    <p className="error">{usernamevalidation}</p>
                </div>
                

                <div class="field">
                    <label for="email">Email</label>
                    <input placeholder="Your email" type="text" name="email" value={email} onChange={this.handleEmail} />
                    <p className="error">{emailvalidation}</p>
                </div>

                <div class="field">
                    <label for="password">Contraseña</label>
                    <input type="password" name="password" value={passedit} onChange={this.handleToWords} />
                    {this.func()}
                </div>
                

                <div class="field">
                    <label for="sex">Sex</label>
                    <select name="sex" value={sex} onChange={this.handleSelect}>
                    <option disabled selected value> -- select an option -- </option>
                    <option value="Femenino">Femenino</option>
                    <option value="Masculino">Masculino</option>
                    </select>
                    <p className="error">{sexvalidation}</p>
                </div>
                

                <div class="field">
                    <label for="age">Edad</label>
                    <input type="number" name="age" value={age} onChange={this.handleToNumbers} />
                    <p className="error">{agevalidation}</p>
                </div>
                

                <div class="field">
                    <label for="description">Descripción</label>
                    <textarea type="text" name="description" value={description} onChange={this.handleDescription}></textarea>
                    <p className="error">{descriptionvalidation}</p>
                </div>
                

                <div class="field">
                  {!editing ? (<label>Selecione foto de perfil:</label>) : (<label>Puedes cambiar tu foto de perfil seleccionando una nueva</label>)}
                  <input type="file" name="imageUrl" />
                  {editing ? (<p> Si no quieres cambiar la foto anterior deja en blanco</p>) : null}

                </div>
                {dis && <p className="error">Debes arreglar los errores marcados para enviar </p>}
                <input type="submit" value={buton} disabled={dis} />
                </form>
            </div>
    );
  }
}