const bcrypt = require('bcrypt');
const faker = require('faker');

const PASSWORD_SALT = 10;

module.exports = {
  up(queryInterface) {
    const usersData = [
      {
        name: 'juan',
        username: 'juan_blf',
        email: 'juan@uc.cl',
        password: bcrypt.hashSync('123456789', PASSWORD_SALT),
        sex: 'Male',
        age: faker.random.number({ min: 18, max: 90 }),
        ranking: 4.4,
        influencer: true,
        description: faker.lorem.text(),
        imageUrl: 'https://res.cloudinary.com/importteam/image/upload/v1557784303/hombre_x9fobi.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Francisco',
        username: 'pancho',
        email: 'pancho_saavedra@uc.cl',
        password: bcrypt.hashSync('123456789', PASSWORD_SALT),
        sex: 'Male',
        age: faker.random.number({ min: 18, max: 90 }),
        ranking: 4.3,
        influencer: true,
        description: 'Conductor de Tv en @canal13 #LugaresQueHablan #ContraVientoYMarea #LeccionesDeVida Amo a mi familia el cine y el deporte',
        imageUrl: 'https://www.pudahuel.cl/wp-content/uploads/2019/05/este-viernes-07-de-septiembre-gran-interes-de-comunidad-por-compartir-jornada-de-amabilidad-con-pancho-saavedra-eb9fc349601c69352c859c1faa287874.png',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: faker.name.findName(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: bcrypt.hashSync('123456789', PASSWORD_SALT),
        sex: 'Male',
        age: faker.random.number({ min: 18, max: 90 }),
        ranking: 4.8,
        influencer: true,
        description: faker.lorem.text(),
        imageUrl: 'https://res.cloudinary.com/importteam/image/upload/v1559522867/personas/people-2202474_960_720_ksj4za.jpg',

        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: faker.name.findName(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        password: bcrypt.hashSync('123456789', PASSWORD_SALT),
        sex: 'Female',
        age: faker.random.number({ min: 18, max: 90 }),
        ranking: 4.1,
        influencer: true,
        description: faker.lorem.text(),
        imageUrl: 'https://res.cloudinary.com/importteam/image/upload/v1559522867/personas/hombre_jskvga.jpg',

        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    for (let i = 0; i < 11; i += 1) {
      usersData.push({
        name: faker.name.findName().substring(0, 20),
        username: faker.internet.userName().substring(0, 20),
        email: faker.internet.email().substring(0, 20),
        password: bcrypt.hashSync('123456789', PASSWORD_SALT),
        sex: 'Female',
        age: faker.random.number({ min: 18, max: 90 }),
        ranking: 1,
        influencer: false,
        description: faker.lorem.text(),
        imageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return queryInterface.bulkInsert('users', usersData);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('users', null, {});
  },
};
