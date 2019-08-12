const faker = require('faker');

module.exports = {
  up(queryInterface) {
    const continents = ['Norte américa', 'Sur américa', 'Oceanía', 'África', 'Asia', 'Europa'];
    const countries = ['Honduras (HN)', 'Bolivia (BO)', 'Nueva Zelanda (NZ)', 'Libia (LY)', 'India (IN)', 'Hungría (HU)'];
    const cities = ['Choloma', 'La Paz', 'Hamilton', 'Bengasi', 'Calcuta', 'Budapest'];
    const places = ['por ahí', 'Cerro Serke', 'parque bacan', 'bengasi', 'calcutina', 'Isla Margarita'];
    const publicationData = [];
    const images = [
      'https://res.cloudinary.com/importteam/image/upload/v1559521568/paisajes/2_e1y0as.png',
      'https://res.cloudinary.com/importteam/image/upload/v1559521566/paisajes/3_uszvdr.png',
      'https://res.cloudinary.com/importteam/image/upload/v1559521565/paisajes/seebensee-2384369-810x540_wfurbv.jpg',
      'https://res.cloudinary.com/importteam/image/upload/v1559521565/paisajes/DeepinScreenshot_Seleccionar_%C3%A1rea_20190602202018_rhh4m8.png',
      'https://res.cloudinary.com/importteam/image/upload/v1559521564/paisajes/DeepinScreenshot_Seleccionar_%C3%A1rea_20190602202027_e8yb2k.png',
      'https://res.cloudinary.com/importteam/image/upload/v1559521564/paisajes/DeepinScreenshot_Seleccionar_%C3%A1rea_20190602201952_lfckir.png',
      'https://res.cloudinary.com/importteam/image/upload/v1559521562/paisajes/DeepinScreenshot_Seleccionar_%C3%A1rea_20190602202006_j1cwf8.png',
    ];
    let index = 0;
    let v;
    const randomList = () => {
      let list = [];
      const inte = Math.floor(Math.random() * 7);
      list = images.slice(inte, inte + 3);
      return list;
    };
    for (let i = 0; i < 60; i += 1) {
      index = faker.random.number({ min: 0, max: 5 });
      v = faker.random.number({ min: 0, max: 5 });
      publicationData.push({
        title: faker.lorem.sentence(),
        date: faker.date.past(30),
        stars: v,
        description: faker.lorem.text(),
        place: places[index],
        city: cities[index],
        budget: faker.random.number({ min: 10000, max: 500000 }),
        autor: 0,
        votes: v,
        continent: continents[index],
        country: countries[index],
        duration: faker.random.number({ min: 3, max: 30 }),
        host: faker.name.findName(),
        transport: faker.lorem.sentence(2),
        images: randomList(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return queryInterface.bulkInsert('publications', publicationData);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('publications', null, {});
  },
};
