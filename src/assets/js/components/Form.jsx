import React, { Component } from 'react';
import Select from './Select';

export default class Form extends Component {
  constructor() {
    super();

    this.state = {
      publication: [],
      titlevalidation: 'Campo obligatorio (*)',
      datevalidation: 'Campo obligatorio (*)',
      budgetvalidation: 'Campo obligatorio (*)',
      daysvalidation: 'Campo obligatorio (*)',
      hostvalidation: 'Campo obligatorio (*)',
      transportvalidation: 'Campo obligatorio (*)',
      descriptionvalidation: 'Campo obligatorio (*)',
      date: null,
      title: null,
      budget: null,
      duration: null,
      host: null,
      transport: null,
      description: null,
      loading: true,
      buton: '',
      dis: true,
      disselect: true,
    };
    this.handleToWords = this.handleToWords.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.handleEmpty = this.handleEmpty.bind(this);
    this.handleEnableSelect = this.handleEnableSelect.bind(this)
    this.handleToNumbers = this.handleToNumbers.bind(this);
    this.handleDescription = this.handleDescription.bind(this);

  }

  async componentDidMount() {
    if (this.props.new === '1') {
      const publication = await fetch('newpublication', {
        headers: {
          Accept: 'application/json',
        },
      })
        .then(response => response.json());
      this.setState({ publication, title: publication.title, date: publication.date, budget: publication.budget, duration: publication.duration, host: publication.host, transport: publication.transport, description: publication.description, loading: false, buton: 'Crear' });
    } else {
      const publication = await fetch('edit', {
        headers: {
          Accept: 'application/json',
        },
      })
        .then(response => response.json());
      this.setState({ titlevalidation: '', datevalidation: '', budgetvalidation: '', daysvalidation: '', hostvalidation: '', transportvalidation: '', descriptionvalidation: '' });
      this.setState({ publication, title: publication.title, date: publication.date, budget: publication.budget, duration: publication.duration, host: publication.host, transport: publication.transport, description: publication.description, loading: false, buton: 'Editar', dis: false, disselect: false });

    }
  }

  // eslint-disable-next-line class-methods-use-this
  handleLargo(token) {
    if (token.length < 3) {
      return false;
    }
    return true;
  }

  // eslint-disable-next-line class-methods-use-this
  handleEmpty(token) {
    if (token.length > 0) {
      return true;
    }
    return false;
  }

  handleEnable() {
    const { titlevalidation, datevalidation, budgetvalidation, daysvalidation, descriptionvalidation, hostvalidation, transportvalidation, disselect } = this.state;
    if (titlevalidation.length === 0 &&  datevalidation.length === 0 && budgetvalidation.length === 0 && daysvalidation.length === 0 && descriptionvalidation.length === 0 && hostvalidation.length === 0 && transportvalidation.length == 0  && !disselect) {
      this.setState({ dis: false });
    } else {
      this.setState({ dis: true });
    }
  }

  handleEnableSelect(v1, v2, v3, v4) {
    if (v1.length === 0 && v2.length === 0 && v3.length === 0 && v4.length === 0) {
      this.setState({ disselect: false }, () => { this.handleEnable(); });
    } else {
      this.setState({ disselect: true }, () => { this.handleEnable(); });
    }
  }

  handleDescription(event) {
    const isOkEmpty = this.handleEmpty(event.target.value);
    const isOkLargo = event.target.value.length > 16;
    if (!isOkEmpty) {
      this.setState({ descriptionvalidation: 'Debes ingresar una descripcion ', description: event.target.value }, () => { this.handleEnable(); });
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
      } else if (event.target.name === 'host') {
        this.setState({ hostvalidation: 'Debes ingresar un hospedaje', host: event.target.value }, () => { this.handleEnable(); });
        return;
      } else if (event.target.name === 'transport') {
        this.setState({ transportvalidation: 'Debes ingresar un transporte', transport: event.target.value }, () => { this.handleEnable(); });
        return;
      }
    }
    if (!isOkLargo) {
      if (event.target.name === 'title') {
        this.setState({ titlevalidation: 'Largo debe ser mayor a 3 letras', title: event.target.value }, () => { this.handleEnable(); });
        return;
      } else if (event.target.name === 'host') {
        this.setState({ hostvalidation: 'Largo debe ser mayor a 3 letras', host: event.target.value }, () => { this.handleEnable(); });
        return;
      } else if (event.target.name === 'transport') {
        this.setState({ transportvalidation: 'Largo debe ser mayor a 3 letras', transport: event.target.value }, () => { this.handleEnable(); });
        return;
      }
    }
    if (isOkEmpty && isOkLargo) {
      if (event.target.name === 'title') {
        this.setState({ titlevalidation: '', title: event.target.value  }, () => { this.handleEnable(); });
        return;
      } else if (event.target.name === 'host') {
        this.setState({ hostvalidation: '', host: event.target.value }, () => { this.handleEnable(); });
        return;
      } else if (event.target.name === 'transport') {
        this.setState({ transportvalidation: '' , transport: event.target.value}, () => { this.handleEnable(); });
        return;
      }
    }
  }

  handleChange2(event) {
    const { publication } = this.state;
    publication.date = event.target.value;
    this.setState({ publication });
    const isOkEmpty = this.handleEmpty(event.target.value);
    if (isOkEmpty) {
      this.setState({ datevalidation: '', date: event.target.value}, () => { this.handleEnable(); });
    } else {
      this.setState({ datevalidation: 'Debes ingresar una fecha', date: event.target.value }, () => { this.handleEnable(); });
    }
  }

  handleToNumbers(event) {
    const isOkEmpty = this.handleEmpty(event.target.value);
    if (!isOkEmpty) {
      if (event.target.name === 'budget') {
        this.setState({ budgetvalidation: 'Debes ingresar un presupuesto', budget: event.target.value }, () => { this.handleEnable(); });
      } else if (event.target.name === 'duration') {
        this.setState({ daysvalidation: 'Debes ingresar la duración del viaje', duration: event.target.value }, () => { this.handleEnable(); });
      }
    }
    else {
      if (event.target.name === 'budget') {
        this.setState({ budgetvalidation: '' , budget: event.target.value}, () => { this.handleEnable(); });
      } else if (event.target.name === 'duration') {
        this.setState({ daysvalidation: '', duration: event.target.value }, () => { this.handleEnable(); });
      }
    }
  }
    
  render() {
    const { titlevalidation, datevalidation, budgetvalidation, daysvalidation, hostvalidation, transportvalidation, descriptionvalidation } = this.state;
    const { title, date, budget, duration, host, transport, description, loading, buton, dis } = this.state;
    if (loading) {
      return (
        <p>Cargando ..... </p>
      );
    }
    return (
      <div>
        <form action={this.props.url} enctype="multipart/form-data" method="post">
          {this.props.new != '1' && <input type="hidden" name="_method" value="patch" />}
          <div className="field">
              <label htmlFor="title">Título</label>
              <input type="text" name="title" value={title} onChange={this.handleToWords} />
          <p className="error">{titlevalidation}</p>
          </div>
          <div className="field">
              <label htmlFor="date">Fecha</label>
              <input type="date" name="date" value={date} onChange={this.handleChange2} />
          <p className="error">{datevalidation}</p>
          </div>
          <div className="field">
              <label htmlFor="budget">Costo(CLP)</label>
              <input type="number" name="budget" value={budget} onChange={this.handleToNumbers} />
          <p className="error">{budgetvalidation}</p>
          </div>
          <div className="field">
              <label htmlFor="duration">Cantidad de días</label>
              <input type="number" name="duration" value={duration} onChange={this.handleToNumbers} />
          <p className="error">{daysvalidation}</p>
          </div>
          <div className="field">
              <label htmlFor="host">Hospedaje</label>
              <input type="text" name="host" value={host} onChange={this.handleToWords} />
          <p className="error">{hostvalidation}</p>
          </div>
          <div className="field">
              <label htmlFor="transport">Transporte</label>
              <input type="text" name="transport" value={transport} onChange={this.handleToWords} />
          <p className="error">{transportvalidation}</p>
          </div>
          <div className="field">
              <label htmlFor="description">Descripción</label>
              <textarea type="text" name="description" value={description} onChange={this.handleDescription}></textarea>
          <p className="error">{descriptionvalidation}</p>
          </div>
          <div className="field">
              <label htmlFor="image">Selecione foto:</label>
              <input type="file" name="my_file[]" multiple="true" />
              <p>Puedes agregar más de una imagen si haces una selección multiple</p>
          </div>
          <Select handle={this.handleEnableSelect} data-userid={this.props.userid} data-publicationid={this.props.publicationid} new={this.props.new}> </Select>
          {dis && <p className="error">Debes arreglar los errores marcados para enviar </p>}
          <input type="submit" value={buton} disabled={dis} />
        </form>
      </div>
    );
  }
}