/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';
import { timingSafeEqual } from 'crypto';

export default class Select extends Component {
  constructor() {
    super();
    this.state = {
      selectedOption: null,
      selectedOption2: null,
      selectedOption3: null,
      selectedOption4: null,
      validation1: 'Debes completar este campo (*)',
      validation2: 'Debes completar este campo (*)',
      validation3: 'Debes completar este campo (*)',
      validation4: 'Debes completar este campo (*)',
      countries: [],
      cities: [],
      places: [],
      changingContinent: true,
      changingCountry: true,
      changingCities: true,
      publication: [],
      options: [
        { value: 'AF', label: 'África' },
        { value: 'AS', label: 'Asia' },
        { value: 'EU', label: 'Europa' },
        { value: 'NA', label: 'Norte américa' },
        { value: 'OC', label: 'Oceanía' },
        { value: 'SA', label: 'Sur américa' },
      ],
    };

    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.handleChange3 = this.handleChange3.bind(this);
    this.handleChange4 = this.handleChange4.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  async componentDidMount() {
    if (this.props.new === '1') {
      const publication = await fetch('newpublication', {
        headers: {
          Accept: 'application/json',
        },
      })
        .then(response => response.json());
      this.setState({ publication });
    } else {
      const { options } = this.state;
      const publication1 = await fetch('edit', {
        headers: {
          Accept: 'application/json',
        },
      })
        .then(response => response.json());

      this.setState({ publication: publication1 });
      this.setState({ validation1: '', validation2: '', validation3: '', validation4: '' }, () => { this.props.handle(this.state.validation1, this.state.validation2, this.state.validation3, this.state.validation4); });
      const { publication } = this.state;
      const option = options.filter(op => op.label === publication.continent);
      this.setState({ selectedOption: option[0].label });

      const url = `http://api.geonames.org/searchJSON?username=jvlara&continentCode=${option[0].value}&featureClass=A&lang=es&featureCode=PCLI`;
      const countries1 = await fetch(url, {
        headers: {
          Accept: 'application/json',
          origin: 'https://importteam.herokuapp.com',

        },
      })
        .then(response => response.json());
      this.setState({ countries: countries1.geonames, changingContinent: false });

      const texto = publication.country;
      const largo = texto.length;
      const code = texto.substring(largo - 3, largo - 1);
      this.setState({ selectedOption2: texto });
      const url2 = `http://api.geonames.org/searchJSON?username=jvlara&continentCode=${option[0].value}&country=${code}&featureClass=P&lang=es`;
      const cities1 = await fetch(url2, {
        headers: {
          Accept: 'application/json',
          origin: 'https://importteam.herokuapp.com',
        },
      })
        .then(response => response.json());

      this.setState({ cities: cities1.geonames, changingCountry: false });

      const url3 = `http://api.geonames.org/searchJSON?username=jvlara&continentCode=${option[0].value}&lang=es&country=${code}&featureClass=H&featureClass=L&featureClass=R&featureClass=S&featureClass=T&featureClass=U&featureClass=V`;
      const places1 = await fetch(url3, {
        headers: {
          Accept: 'application/json',
          origin: 'https://importteam.herokuapp.com',

        },
      })
        .then(response => response.json());
      const placesfilter = (places1.geonames).filter(place => (place.fcode !== 'CONT') && (place.adminName1 === publication.city));
      this.setState({
        places: placesfilter, changingCities: false, selectedOption4: publication.place, selectedOption3: publication.city,
      });
    }
  }

  async handleChange1(event) {
    const texto = event.nativeEvent.target[event.nativeEvent.target.selectedIndex].text;
    const largo = texto.length;
    const code = texto.substring(largo - 3, largo - 1);
    this.setState({
      selectedOption: texto.substring(0, largo - 5),
      changingContinent: true,
      changingCities: true,
      changingCountry: true,
      validation2: 'Debes completar este campo (*)',
      validation3: 'Debes completar este campo (*)',
      validation4: 'Debes completar este campo (*)',
      validation1: '',
      selectedOption2: null,
      selectedOption3: null,
      selectedOption4: null,
    });
    const url = `http://api.geonames.org/searchJSON?username=jvlara&continentCode=${code}&featureClass=A&lang=es&featureCode=PCLI`;
    const countries1 = await fetch(url, {
      headers: {
        Accept: 'application/json',
        origin: 'https://importteam.herokuapp.com',
      },
    })
      .then(response => response.json());

    this.setState({ countries: countries1.geonames, changingContinent: false }, () => { this.props.handle(this.state.validation1, this.state.validation2, this.state.validation3, this.state.validation4); });
  }

  async handleChange2(event) {
    const { selectedOption, options } = this.state;
    const option = options.filter(op => op.label === selectedOption);
    const texto = event.nativeEvent.target[event.nativeEvent.target.selectedIndex].text;
    const largo = texto.length;
    const code = texto.substring(largo - 3, largo - 1);
    this.setState({
      selectedOption2: texto,
      changingCountry: true,
      changingCities: true,
      validation2: '',
      validation3: 'Debes completar este campo (*)',
      validation4: 'Debes completar este campo (*)',
      selectedOption3: null,
      selectedOption4: null,
    });
    const url = `http://api.geonames.org/searchJSON?username=jvlara&continentCode=${option[0].value}&country=${code}&featureClass=P&lang=es`;
    const cities1 = await fetch(url, {
      headers: {
        Accept: 'application/json',
        origin: 'https://importteam.herokuapp.com',

      },
    })
      .then(response => response.json());

    this.setState({ cities: cities1.geonames, changingCountry: false }, () => { this.props.handle(this.state.validation1, this.state.validation2, this.state.validation3, this.state.validation4); });
  }

  async handleChange3(event) {
    const { selectedOption, selectedOption2, options } = this.state;
    const texto = selectedOption2;
    const largo = texto.length;
    const code = texto.substring(largo - 3, largo - 1);
    const option = options.filter(op => op.label === selectedOption);
    this.setState({
      selectedOption3: event.target.value,
      changingCities: true,
      validation3: '',
      validation4: 'Debes completar este campo (*)',
      selectedOption4: null,
    });
    const url = `http://api.geonames.org/searchJSON?username=jvlara&continentCode=${option[0].value}&lang=es&country=${code}&featureClass=H&featureClass=L&featureClass=R&featureClass=S&featureClass=T&featureClass=U&featureClass=V`;
    const places1 = await fetch(url, {
      headers: {
        Accept: 'application/json',
        origin: 'https://importteam.herokuapp.com',

      },
    })
      .then(response => response.json());
    const { selectedOption3 } = this.state;
    const placesfilter = (places1.geonames).filter(place => (place.fcode !== 'CONT') && (place.adminName1 === selectedOption3));
    this.setState({ places: placesfilter, changingCities: false }, () => { this.props.handle(this.state.validation1, this.state.validation2, this.state.validation3, this.state.validation4); });
  }

  handleChange4(event) {
    if (event.target.value.length > 3) {
      this.setState({ validation4: '' });
    } else {
      this.setState({ validation4: 'este campo debe tener más de 3 letras' });
    }
    this.setState({ selectedOption4: event.target.value }, () => { this.props.handle(this.state.validation1, this.state.validation2, this.state.validation3, this.state.validation4); });
  }

  render() {
    const options1 = [
      { value: 'AF', label: 'África' },
      { value: 'AS', label: 'Asia' },
      { value: 'EU', label: 'Europa' },
      { value: 'NA', label: 'Norte américa' },
      { value: 'OC', label: 'Oceanía' },
      { value: 'SA', label: 'Sur américa' },
    ];

    const {
      selectedOption, changingContinent, changingCountry, countries, selectedOption2, cities, selectedOption3, changingCities, places, publication, selectedOption4,
    } = this.state;
    const { validation1, validation2, validation3, validation4 } = this.state;

    if (!changingContinent && !changingCountry && !changingCities && places.length) {
      return (
        <div>
          <div className="field">
            <label htmlFor="continent">Continente</label>
            <select name="continent" onChange={this.handleChange1} value={selectedOption}>
              <option disabled selected value> -- select an option -- </option>
              {options1.map(option => <option value={option.label}>{`${option.label} (${option.value})`}</option>)}
            </select>
          <p className="error">{validation1}</p>
          </div>

          <div className="field">
            <label htmlFor="country">País</label>
            <select name="country" onChange={this.handleChange2} value={selectedOption2}>
              <option disabled selected value> -- select an option -- </option>
              {countries.map(option => <option value={`${option.name} (${option.countryCode})`}>{`${option.name} (${option.countryCode})`}</option>)}
            </select>
          <p className="error">{validation2}</p>
          </div>

          <div className="field">
            <label htmlFor="city">Ciudad</label>
            <select name="city" onChange={this.handleChange3} value={selectedOption3}>
              <option disabled selected value> -- select an option -- </option>
              {cities.map(option => <option value={option.name}>{option.name}</option>)}
            </select>
          <p className="error">{validation3}</p>
          </div>

          <div className="field">
            <label htmlFor="place">Lugar</label>
            <select name="place" onChange={this.handleChange4} value={this.state.selectedOption4}>
              <option disabled selected value> -- select an option -- </option>
              {places.map(option => <option value={option.name}>{option.name}</option>)}
            </select>
          <p className="error">{validation4}</p>
          </div>

        </div>);
    }

    if (!changingContinent && !changingCountry && !changingCities && !places.length) {
      return (
        <div>
          <div className="field">
            <label htmlFor="continent">Continente</label>
            <select name="continent" onChange={this.handleChange1} value={selectedOption}>
              <option disabled selected value> -- select an option -- </option>
              {options1.map(option => <option value={option.label}>{`${option.label} (${option.value})`}</option>)}
            </select>
          <p className="error">{validation1}</p>
          </div>

          <div className="field">
            <label htmlFor="country">País</label>
            <select name="country" onChange={this.handleChange2} value={selectedOption2}>
              <option disabled selected value> -- select an option -- </option>
              {countries.map(option => <option value={`${option.name} (${option.countryCode})`}>{`${option.name} (${option.countryCode})`}</option>)}
            </select>
          <p className="error">{validation2}</p>
          </div>

          <div className="field">
            <label htmlFor="city">Ciudad</label>
            <select name="city" onChange={this.handleChange3} value={selectedOption3}>
              <option disabled selected value> -- select an option -- </option>
              {cities.map(option => <option value={option.name}>{option.name}</option>)}
            </select>
          <p className="error">{validation3}</p>
          </div>

          <div className="field">
            <label htmlFor="place">Lugar</label>
            <input type="text" name="place" onChange={this.handleChange4} value={this.state.selectedOption4} />
          <p className="error">{validation4}</p>
          </div>

        </div>);
    }

    if (!changingContinent && !changingCountry) {
      return (
        <div>
          <p>Seleciona el campo faltante para cargar los demás</p>
          <div className="field">
            <label htmlFor="continent">Continente</label>
            <select name="continent" onChange={this.handleChange1} value={selectedOption}>
              <option disabled selected value> -- select an option -- </option>
              {options1.map(option => <option value={option.label}>{`${option.label} (${option.value})`}</option>)}
            </select>
          <p className="error">{validation1}</p>
          </div>

          <div className="field">
            <label htmlFor="country">País</label>
            <select name="country" onChange={this.handleChange2} value={selectedOption2}>
              <option disabled selected value> -- select an option -- </option>
              {countries.map(option => <option value={`${option.name} (${option.countryCode})`}>{`${option.name} (${option.countryCode})`}</option>)}
            </select>
          <p className="error">{validation2}</p>
          </div>

          <div className="field">
            <label htmlFor="city">Ciudad</label>
            <select name="city" onChange={this.handleChange3} value={selectedOption3}>
              <option disabled selected value> -- select an option -- </option>
              {cities.map(option => <option value={option.name}>{option.name}</option>)}
            </select>
          <p className="error">{validation3}</p>
          </div>

          <p> Espere cargando lugares ... </p>
        </div>);
    }

    if (!changingContinent) {
      return (
        <div>
          <p>Seleciona el campo faltante para cargar los demás</p>
          <div className="field">
            <label htmlFor="continent">Continente</label>
            <select name="continent" onChange={this.handleChange1} value={selectedOption}>
              <option disabled selected value> -- select an option -- </option>
              {options1.map(option => <option value={option.label}>{`${option.label} (${option.value})`}</option>)}
            </select>
          <p className="error">{validation1}</p>
          </div>

          <div className="field">
            <label htmlFor="country">País</label>
            <select name="country" onChange={this.handleChange2} value={selectedOption2}>
              <option disabled selected value> -- select an option -- </option>
              {countries.map(option => <option value={`${option.name} (${option.countryCode})`}>{`${option.name} (${option.countryCode})`}</option>)}
            </select>
          <p className="error">{validation2}</p>
          </div>

          <p> Espere cargando ciudades ... </p>
        </div>);
    }
    return (
      <div>
        <p>Seleciona el campo faltante para cargar los demás</p>
        <div className="field">
          <label htmlFor="continent">Continente</label>
          <select name="continent" onChange={this.handleChange1} value={selectedOption}>
            <option disabled selected value> -- select an option -- </option>
            {options1.map(option => <option value={option.label}>{`${option.label} (${option.value})`}</option>)}
          </select>
        <p className="error">{validation1}</p>
        </div>
        <p> Espere cargando paises ... </p>
      </div>
    );
  }
}
