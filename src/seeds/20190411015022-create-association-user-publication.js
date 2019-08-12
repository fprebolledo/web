const orm = require('../models');

module.exports = {
  async up() {
    const usersData = await orm.user.findAll();
    const publicationData = await orm.publication.findAll();
    const dbOps = [];

    let actual = 0;
    for (let idxUsr = 0; idxUsr < 15; idxUsr += 1) {
      actual = idxUsr * 4;
      for (let idxPub = actual; idxPub < actual + 4; idxPub += 1) {
        dbOps.push(usersData[idxUsr].addPublications(publicationData[idxPub]));
      }
    }

    return Promise.all(dbOps);
  },
  down() {
    return Promise.resolve();
  },
};
