const faker = require('faker');
const orm = require('../models');

module.exports = {
  async up() {
    const publicationsData = await orm.publication.findAll();
    const commentsData = await orm.comment.findAll();
    const usersData = await orm.user.findAll();
    const dbOps = [];

    let actual = 0;
    let idxUsr = 0;
    for (let idxPub = 0; idxPub < 60; idxPub += 1) {
      actual = idxPub * 4;
      for (let idxCom = actual; idxCom < actual + 4; idxCom += 1) {
        dbOps.push(publicationsData[idxPub].addComments(commentsData[idxCom]));
        idxUsr = faker.random.number({ min: 0, max: 14 });
        dbOps.push(usersData[idxUsr].addComments(commentsData[idxCom]));
      }
    }

    /* for (let idxPub = 60; idxPub < 70; idxPub += 1) {
      actual = idxPub * 4;
      for (let idxCom = actual; idxCom < actual + 4; idxCom += 1) {
        if (idxPub < 62) {
          dbOps.push(publicationsData[idxPub].addComments(commentsData[idxCom]));
        } else if (idxPub < 67) {
          dbOps.push(publicationsData[idxPub].addComments(commentsData[idxCom]));
        } else {
          dbOps.push(publicationsData[idxPub].addComments(commentsData[idxCom]));
        }
        idxUsr = faker.random.number({ min: 0, max: 2 });
        dbOps.push(usersData[idxUsr].addComments(commentsData[idxCom]));
      }
    } */
    return Promise.all(dbOps);
  },
  down() {
    return Promise.resolve();
  },
};
