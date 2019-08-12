/* eslint-disable no-console */
const KoaRouter = require('koa-router');
const cloudinary = require('cloudinary').v2;
const pkg = require('../../package.json');

cloudinary.config({
  cloud_name: 'importteam',
  api_key: '139514321496881',
  api_secret: 'Dm7BWhrcnUEBzNz4ikaEKlz3MhU',
});
// const fs = require('fs');
// const fileStorage = require('../services/file-storage');

const router = new KoaRouter();

router.get('home', '/', async (ctx) => {
  const users = await ctx.orm.user.findAll();
  users.sort((a, b) => b.ranking - a.ranking);
  const userList = users.slice(0, 3);
  console.log(userList);
  await ctx.render('index', {
    userList,
    appVersion: pkg.version,
    pubPath: cont => ctx.router.url('publications.continent', { continent: cont }),
    uploadImagePath: ctx.router.url('index.upload'),
    userPublicationPath: user => ctx.router.url('users.publications', { id: user.id }),
    showUserPath: user => ctx.router.url('users.show', { id: user.id }),
  });
});

module.exports = router;
