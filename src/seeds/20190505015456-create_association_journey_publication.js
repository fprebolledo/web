const orm = require('../models');

module.exports = {
  async up() {
    const journeysData = await orm.journey.findAll();
    const publicationsData = await orm.publication.findAll();

    const dbOps = [];
    let actual = 0;
    for (let idxJour = 0; idxJour < 15; idxJour += 1) {
      actual = idxJour * 4;
      for (let idxPub = actual; idxPub < actual + 3; idxPub += 1) {
        dbOps.push(journeysData[idxJour].addPublications(publicationsData[idxPub]));
      }
    }
    return Promise.all(dbOps);
  },
  down() {
    return Promise.resolve();
  },
};
