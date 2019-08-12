import React, { Component } from 'react';

export default class FormJourney extends Component {
  constructor() {
    super();

    this.state = {
      journey: [],
      titlevalidation: 'Campo obligatorio (*)',
      yearvalidation: 'Campo obligatorio (*)',
      continentvalidation: 'Campo obligatorio (*)',
      descriptionvalidation: 'Campo obligatorio (*)',
      title: null,
      year: null,
      continent: null,
      description: null,
      loading: true,
      buton: '', 
      dis: true,
      editing: false,
    };

    this.handleToWords = this.handleToWords.bind(this);
    this.handleToNumbers = this.handleToNumbers.bind(this);
    this.handleDescription = this.handleDescription.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleEnable = this.handleEnable.bind(this);
  }

  async componentDidMount() {
    if (this.props.new === '1') {
      const journey = await fetch('newjourney', {
        headers: {
          Accept: 'application/json',
        },
      })
        .then(response => response.json());
      this.setState({ journey, title: journey.title, year: journey.year, continent: journey.continent, description: journey.description, buton: 'Crear', loading: false });
    } else {
      const journey = await fetch('edit', {
        headers: {
          Accept: 'application/json',
        },
      })
        .then(response => response.json());
      this.setState({ titlevalidation: '', datevalidation: '', yearvalidation: '', continentvalidation: '', descriptionvalidation: '' });
      this.setState({ journey, title: journey.title, year: journey.year, continent: journey.continent, description: journey.description, loading: false, buton: 'Editar', dis: false, editing: true });

    }
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
    this.setState({ continent: event.target.value, continentvalidation: '' }, () => { this.handleEnable(); });
  }

  handleEnable() {
    const { titlevalidation, yearvalidation, continentvalidation, descriptionvalidation } = this.state;
    console.log(titlevalidation, yearvalidation, continentvalidation, descriptionvalidation);
    if (titlevalidation.length === 0 && yearvalidation.length === 0 && continentvalidation.length === 0 && descriptionvalidation.length === 0) {
      this.setState({ dis: false });
    } else {
      this.setState({ dis: true });
    }
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
    if (!isOkEmpty) {
      if (event.target.name === 'title') {
        this.setState({ titlevalidation: 'Debes agregar un titulo', title: event.target.value }, () => { this.handleEnable(); });
        return;
      } 
      this.setState({ title: null });
    }
    if (!isOkLargo) {
      if (event.target.name === 'title') {
        this.setState({ titlevalidation: 'Largo debe ser mayor a 3 letras', title: event.target.value }, () => { this.handleEnable(); });
        return;
      }
    }
    if (isOkEmpty && isOkLargo) {
      if (event.target.name === 'title') {
        this.setState({ titlevalidation: '', title: event.target.value }, () => { this.handleEnable(); });
        return;
      } 
    }
  }

  handleToNumbers(event) {
    const isOkEmpty = this.handleEmpty(event.target.value);
    if (!isOkEmpty) {
      this.setState({ yearvalidation: 'Debes ingresar un año', year: event.target.value });
      this.setState({ year: null }, () => { this.handleEnable(); });
    } else {
      this.setState({ yearvalidation: '', year: event.target.value }, () => { this.handleEnable(); });
    }
  }
  
  render() {
    const { titlevalidation, yearvalidation, continentvalidation, descriptionvalidation } = this.state;
    const { title, year, continent, description, loading, buton, dis, editing } = this.state;
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
						<label for="title">Titulo</label>
						<input type="text" name="title" value={title} onChange={this.handleToWords}/>
				    <p className="error">{titlevalidation}</p>
					</div>
					
				<div class="field">
						<label for="year">Año</label>
						<input type="number" name="year" value={year} onChange={this.handleToNumbers}/>
				<p className="error">{yearvalidation}</p>
					</div>

					
				<div class="field">				
						<label for="continent">Continente</label>
						<select name="continent" value={continent} onChange={this.handleSelect}>
								<option disabled selected value> -- select an option -- </option>
								<option value="Norte américa">Norte américa</option>
								<option value="Sur américa">Sur américa</option>
								<option value="África">África</option>
								<option value="Oceanía">Oceanía</option>
								<option value="Europa">Europa</option>
								<option value="Asia">Asia</option>
							</select>
			      	<p className="error" >{continentvalidation}</p>
					</div>

  				<div className="field">
						<label for="description">Descripción</label>
						<textarea type="text" name="description" value={description} onChange={this.handleDescription}></textarea>
				    <p className="error">{descriptionvalidation}</p>
					</div>

				<div class="field">
            {!editing ? (<label>Selecione foto de principal de su viaje:</label>) : (<label>Puedes cambiar la foto principal seleccionando una nueva</label>)}
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
