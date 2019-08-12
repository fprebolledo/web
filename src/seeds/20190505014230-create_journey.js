const faker = require('faker');

module.exports = {
  up(queryInterface) {
    const continents = ['América', 'Oceanía', 'África', 'Asia', 'Europa'];
    const journeyData = [];
    const images = [
      'https://res.cloudinary.com/importteam/image/upload/v1559521568/paisajes/2_e1y0as.png',
      'https://res.cloudinary.com/importteam/image/upload/v1559521566/paisajes/3_uszvdr.png',
      'https://res.cloudinary.com/importteam/image/upload/v1559521565/paisajes/seebensee-2384369-810x540_wfurbv.jpg',
      'https://res.cloudinary.com/importteam/image/upload/v1559521565/paisajes/DeepinScreenshot_Seleccionar_%C3%A1rea_20190602202018_rhh4m8.png',
      'https://res.cloudinary.com/importteam/image/upload/v1559521564/paisajes/DeepinScreenshot_Seleccionar_%C3%A1rea_20190602202027_e8yb2k.png',
      'https://res.cloudinary.com/importteam/image/upload/v1559521564/paisajes/DeepinScreenshot_Seleccionar_%C3%A1rea_20190602201952_lfckir.png',
      'https://res.cloudinary.com/importteam/image/upload/v1559521562/paisajes/DeepinScreenshot_Seleccionar_%C3%A1rea_20190602202006_j1cwf8.png',
    ];
    const random = () => {
      const inte = Math.floor(Math.random() * 7);
      return images[inte];
    };
    for (let i = 0; i < 15; i += 1) {
      const index = faker.random.number({ min: 0, max: 4 });
      journeyData.push({
        title: faker.lorem.sentence(),
        year: faker.random.number(),
        ranking: 0.0,
        description: faker.lorem.text(),
        continent: continents[index],
        imageUrl: random(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return queryInterface.bulkInsert('journeys', journeyData);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('journeys', null, {});
  },
};
