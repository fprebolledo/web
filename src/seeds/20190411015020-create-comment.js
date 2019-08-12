const faker = require('faker');

module.exports = {
  up(queryInterface) {
    const commentsData = [];
    for (let i = 0; i < 260; i += 1) {
      commentsData.push({
        ranking: faker.random.number({ min: 0, max: 5 }),
        rankingN: faker.random.number({ min: 0, max: 5 }),
        content: faker.lorem.text(),
        date: faker.date.between('2015-01-01', '2019-06-14'),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return queryInterface.bulkInsert('comments', commentsData);
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('comments', null, {});
  },
};
