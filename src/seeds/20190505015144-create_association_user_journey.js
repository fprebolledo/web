const orm = require('../models');

module.exports = {
  async up() {
    const usersData = await orm.user.findAll();
    const journeyData = await orm.journey.findAll();
    const dbOps = [];

    for (let idxJour = 0; idxJour < 15; idxJour += 1) {
      dbOps.push(usersData[idxJour].addJourneys(journeyData[idxJour]));
    }
    return Promise.all(dbOps);
  },
  down() {
    return Promise.resolve();
  },
};
