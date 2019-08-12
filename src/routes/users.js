const KoaRouter = require('koa-router');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'importteam',
  api_key: '139514321496881',
  api_secret: 'Dm7BWhrcnUEBzNz4ikaEKlz3MhU',
});

const router = new KoaRouter();

async function loadUser(ctx, next) {
  ctx.state.user = await ctx.orm.user.findById(ctx.params.id);
  return next();
}

async function loadUserForJourney(ctx, next) {
  ctx.state.user = await ctx.orm.user.findById(ctx.params.userid);
  return next();
}

async function loadJourney(ctx, next) {
  ctx.state.journey = await ctx.orm.journey.findById(ctx.params.journeyid);
  return next();
}

async function loadUserForPub(ctx, next) {
  ctx.state.user = await ctx.orm.user.findById(ctx.params.userid);
  return next();
}

async function loadPublication(ctx, next) {
  ctx.state.publication = await ctx.orm.publication.findById(ctx.params.publicationid);
  return next();
}

router.get('users.list', '/', async (ctx) => {
  ctx.status = 404;
  // const usersList = await ctx.orm.user.findAll();
  // const fromsearch = false;
  // await ctx.render('users/index', {
  //   usersList,
  //   fromsearch,
  //   newUserPath: ctx.router.url('users.new'),
  //   editUserPath: user => ctx.router.url('users.edit', { id: user.id }),
  //   showUserPath: user => ctx.router.url('users.show', { id: user.id }),
  //   deleteUserPath: user => ctx.router.url('users.delete', { id: user.id }),
  //   userPublicationPath: user => ctx.router.url('users.publications', { id: user.id }),
  //   userJourneyPath: user => ctx.router.url('users.journeys', { id: user.id }),
  // });
});

router.get('users.new', '/new', async (ctx) => {
  const user = ctx.orm.user.build();
  const em = await ctx.orm.user.findAll({ attributes: ['email'], raw: true });
  const emails = [];
  em.forEach(element => {
    emails.push(element.email);
  });
  console.log(emails);
  switch (ctx.accepts(['json', 'html'])) {
    case 'json':
      ctx.body = [user, emails];
      break;
    case 'html':
      await ctx.render('users/new', {
        user,
        submitUserPath: ctx.router.url('users.create'),
      });
      break;
    default:
      break;
  }
});

router.post('users.create', '/', async (ctx) => {
  const user = ctx.orm.user.build(ctx.request.body);
  const image = ctx.request.files.imageUrl;
  let url;
  console.log(user);
  try {
    if (image.name === '') {
      await user.save({ fields: ['name', 'username', 'email', 'password', 'sex', 'age', 'ranking', 'influencer', 'description'] });
    } else {
      await cloudinary.uploader.upload(image.path, (error, result) => {
        // console.log(result, error);
        // eslint-disable-next-line prefer-destructuring
        url = result.url;
        user.imageUrl = url;
      });
      await user.save({ fields: ['name', 'username', 'email', 'password', 'sex', 'age', 'ranking', 'influencer', 'description', 'imageUrl'] });
    }
    ctx.session.userId = user.id;
    return ctx.redirect('/');
  } catch (validationError) {
    await ctx.render('users/new', {
      user,
      errors: validationError.errors,
      submitUserPath: ctx.router.url('users.create'),
    });
  }
});

router.get('users.edit', '/:id/edit', loadUser, async (ctx) => {
  const { user } = ctx.state;
  switch (ctx.accepts(['json', 'html'])) {
    case 'json':
      ctx.body = user;
      break;
    case 'html':
      await ctx.render('users/edit', {
        user,
        submitUserPath: ctx.router.url('users.update', { id: user.id }),
      });
      break;
    default:
      break;
  }
});

router.get('users.show', '/:id/show', loadUser, async (ctx) => {
  const { user, currentUser } = ctx.state;
  let seguido = false;
  let current = false;
  if (!currentUser) {
    return ctx.redirect(ctx.router.url('session.new'));
  }
  if (currentUser) {
    const followins = await currentUser.getFollowin();
    const usuario = followins.find(us => us.id === user.id);
    current = true;
    if (usuario) {
      seguido = true;
    }
  }
  switch (ctx.accepts(['json', 'html'])) {
    case 'json':
      ctx.body = [seguido, user, current];
      break;
    case 'html':
      await ctx.render('users/show', {
        user,
        addFollower: ctx.router.url('add.follower', { id: user.id }),
        deleteFollower: ctx.router.url('delete.follower', { id: user.id }),
        submitUserPath: ctx.router.url('users.update', { id: user.id }),
        editUserPath: usr => ctx.router.url('users.edit', { id: usr.id }),
        showUserPath: usr => ctx.router.url('users.show', { id: usr.id }),
        deleteUserPath: usr => ctx.router.url('users.delete', { id: usr.id }),
        userPublicationPath: usr => ctx.router.url('users.publications', { id: usr.id }),
        userJourneyPath: usr => ctx.router.url('users.journeys', { id: usr.id }),
      });
      break;
    default:
      break;
  }
});

router.patch('users.update', '/:id', loadUser, async (ctx) => {
  const { user } = ctx.state;
  let imageUrl = '';
  try {
    let {
      name, username, email, password, sex, age, ranking, influencer, description,
    } = ctx.request.body;
    if (password == ''){
      password = user.password;
    }
    console.log(ctx.request.files);
    const image = ctx.request.files.imageUrl;
    if (image.name === '') {
      await user.update({
        name, username, email, password, sex, age, ranking, influencer, description,
      });
    } else {
      await cloudinary.uploader.upload(image.path, (error, result) => {
      // eslint-disable-next-line prefer-destructuring
        if (result) {
          imageUrl = result.url;
        }
      });
      await user.update({
        name, username, email, password, sex, age, ranking, influencer, description, imageUrl,
      });
    }
    ctx.redirect('/');
  } catch (validationError) {
    console.log(validationError);
    await ctx.render('users/edit', {
      user,
      errors: validationError.errors,
      submitUserPath: ctx.router.url('users.update', user.id),
    });
  }
});

router.del('users.delete', '/:id', loadUser, async (ctx) => {
  const { user } = ctx.state;
  const followins = await user.getFollowin();
  if (!followins) {
    await user.destroy();
  } else {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < followins.length; i++) {
      // eslint-disable-next-line no-await-in-loop
      await user.removeFollowin(followins[i]);
    }
    await user.destroy();
  }
  ctx.redirect(ctx.router.url('session.new'));
});

router.get('users.publications', '/:id/publications', loadUser, async (ctx) => {
  const { user } = ctx.state;
  if (user === null) {
    ctx.redirect(ctx.router.url('users.list'));
  } else {
    const pubsList = await user.getPublications();
    const publicationsList = [];
    pubsList.forEach((pub) => {
      if (!pub.journeyId) {
        publicationsList.push(pub);
      }
    });
    await ctx.render('users/publications', {
      user,
      userName: user.name,
      publicationsList,
      usersListPath: ctx.router.url('users.list'),
      deletePublicationPath: publication => ctx.router.url('user.publications.delete', { id: user.id, publicationid: publication.id }),
      newPublicationPath: userr => ctx.router.url('user.publications.new', { userid: userr.id }),
      editPublicationPath: (userr, publication) => ctx.router.url('user.publications.edit', { id: userr.id, publicationid: publication.id }),
      showPublicationPath: publication => ctx.router.url('publications.show', { id: publication.id }),
    });
  }
});

router.get('user.publications.new', '/:userid/newpublication', loadUserForPub, async (ctx) => {
  const { user } = ctx.state;
  const fromusernew = true;
  const publication = ctx.orm.publication.build();
  switch (ctx.accepts(['json', 'html'])) {
    case 'json':
      ctx.body = publication;
      break;
    case 'html':
      await ctx.render('publications/new', {
        fromusernew,
        user,
        publication,
        submitPublicationPath: userr => ctx.router.url('user.publications.create', { userid: userr.id }),
      });
      break;
    default:
      break;
  }
});

router.post('user.publications.create', '/:userid', loadUserForPub, async (ctx) => {
  const { user } = ctx.state;
  let listaArchivos = Object.values(ctx.request.files)[0]; // type files con atributos
  if (!listaArchivos.length) {
    listaArchivos = Array(listaArchivos);
  }
  const url = [];
  console.log(listaArchivos);
  for (let i = 0; i < (listaArchivos.length); i++) {
    // console.log(key.name);
    if (listaArchivos[i].name !== '') {
      // eslint-disable-next-line no-await-in-loop
      await cloudinary.uploader.upload(listaArchivos[i].path, (error, result) => {
        // eslint-disable-next-line prefer-destructuring
        if (result) {
          url.push(result.url);
        }
      });
    }
  }
  console.log(url);
  const publication = ctx.orm.publication.build(ctx.request.body);
  const fromusernew = true;

  try {
    if (url.length === 0) {
      await publication.save({ fields: ['title', 'date', 'stars', 'description', 'place', 'city', 'budget', 'autor', 'continent', 'country', 'duration', 'host', 'transport', 'votes', 'images'] });
    } else {
      url.forEach((link) => {
        publication.images.push(link); // Importante: images es una lista vacia debido al modelo (las creadas en la aplicacion).
      });
      await publication.save({ fields: ['title', 'date', 'stars', 'description', 'place', 'city', 'budget', 'autor', 'continent', 'country', 'duration', 'host', 'transport', 'votes', 'images'] });
    }
    await user.addPublications(publication);
    console.log('XDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD');
    console.log(publication.userId);
    ctx.redirect(ctx.router.url('users.publications', { id: user.id }));
  } catch (validationError) {
    console.log(validationError);
    await ctx.render('publications/new', {
      publication,
      errors: validationError.errors,
      fromusernew,
      user,
      submitPublicationPath: userr => ctx.router.url('user.publications.create', { userid: userr.id }),
    });
  }
});

router.get('user.publications.edit', '/:id/publications/:publicationid/edit', loadUser, loadPublication, async (ctx) => {
  const { user, publication } = ctx.state;
  const fromusernew = false;
  switch (ctx.accepts(['json', 'html'])) {
    case 'json':
      ctx.body = publication;
      break;
    case 'html':
      await ctx.render('publications/edit', {
        fromusernew,
        publication,
        user,
        submitPublicationPath: pub => ctx.router.url('user.publications.update', { id: user.id, publicationid: pub.id }),
      });
      break;
    default:
      break;
  }

  
});

router.patch('user.publications.delete.foto', '/:id/publications/:publicationid/:url', loadPublication, async (ctx) => {
  const { publication } = ctx.state;
  const { url } = ctx.params;
  try {
    await cloudinary.uploader.destroy(url, (err, result) => {
      console.log(err);
      console.log(result);
    });
    console.log(publication.images);
    const indice = publication.images.indexOf(url);
    publication.images.splice(indice, 1);
    const list = publication.images;
    console.log(publication.images);

    await publication.update({ images: list });

    ctx.redirect(`/publications/${  publication.id  }/show`);
  } catch (err) {
    console.log(err);
  }
});

router.patch('user.publications.update', '/:id/publications/:publicationid', loadUser, loadPublication, async (ctx) => {
  const { publication, user } = ctx.state;
  let listaArchivos = Object.values(ctx.request.files)[0]; // type files con atributo
  if (!listaArchivos.length) {
    listaArchivos = Array(listaArchivos);
  }
  console.log(listaArchivos);
  const fromusernew = false;
  const url = [];
  for (let i = 0; i < (listaArchivos.length); i++) {
    // console.log(key.name);
    if (listaArchivos[i].name !== '') {
      // eslint-disable-next-line no-await-in-loop
      await cloudinary.uploader.upload(listaArchivos[i].path, (error, result) => {
        // eslint-disable-next-line prefer-destructuring
        if (result) {
          url.push(result.url);
        }
      });
    }
  }
  try {
    const {
      // eslint-disable-next-line max-len
      title, date, stars, description, place, city, budget, autor, continent, country, duration, host, transport,
    } = ctx.request.body;
    if (url.length === 0) {
      await publication.update({
        // eslint-disable-next-line max-len
        title, date, stars, description, place, city, budget, autor, continent, country, duration, host, transport,
      });
    } else {
      if (publication.images === null) { // para las seeds que se updatearan y no tenian fotos,
        publication.images = []; // images puede ser null al actualizar una seed que no venga con nada.
      }
      const images = publication.images.concat(url);
      await publication.update({
        // eslint-disable-next-line max-len
        title, date, stars, description, place, city, budget, autor, continent, country, duration, host, transport, images,
      });
    }
    ctx.redirect(ctx.router.url('users.publications', user.id));
  } catch (validationError) {
    console.log(validationError);
    await ctx.render('publications/edit', {
      publication,
      errors: validationError.errors,
      fromusernew,
      submitPublicationPath: pub => ctx.router.url('user.publications.update', { id: user.id, publicationid: pub.id }),
    });
  }
});

router.del('user.publications.delete', '/:id/publications/:publicationid', loadUser, loadPublication, async (ctx) => {
  const { publication } = ctx.state;
  const { user } = ctx.state;
  await publication.destroy();
  ctx.redirect(ctx.router.url('users.publications', { id: user.id }));
});

router.get('users.journeys', '/:id/journeys', loadUser, async (ctx) => {
  const { user } = ctx.state;
  const journeysList = await user.getJourneys();
  const userList = await ctx.orm.user.findAll();
  await ctx.render('users/journeys', {
    user,
    userName: user.name,
    journeysList,
    userList,
    usersListPath: ctx.router.url('users.list'),
    deleteJourneyPath: journey => ctx.router.url('user.journeys.delete', { id: user.id, journeyid: journey.id }),
    newJourneyPath: userr => ctx.router.url('user.journeys.new', { userid: userr.id }),
    editJourneyPath: (userr, journey) => ctx.router.url('user.journeys.edit', { id: userr.id, journeyid: journey.id }),
    showJourneyPath: journey => ctx.router.url('journeys.show', { id: journey.id }),
  });
});

router.get('user.journeys.show', '/:id/journeys/:journeyid/show', loadUser, loadJourney, async (ctx) => {
  const { journey, currentUser } = ctx.state;
  if (!currentUser) {
    return ctx.redirect(ctx.router.url('session.new'));
  }
  const publicationsList = await journey.getPublications();
  await ctx.render('journey/show', {
    journey,
    publicationsList,
    deletePublicationPath: publication => ctx.router.url('journey.publications.delete', { id: journey.id, publicationid: publication.id }),
    editPublicationPath: publication => ctx.router.url('journey.publications.edit', { id: journey.id, publicationid: publication.id }),
    newPublicationPath: pub => ctx.router.url('journey.publications.new', { id: pub.id }),
  });
});

router.get('user.journeys.new', '/journey/:userid/newjourney', loadUserForJourney, async (ctx) => {
  const { user } = ctx.state;
  const journey = ctx.orm.journey.build();
  const fromusernew = true;
  switch (ctx.accepts(['json', 'html'])) {
    case 'json':
      ctx.body = journey;
      break;
    case 'html':
      await ctx.render('journeys/new', {
        user,
        journey,
        fromusernew,
        submitJourneyPath: userr => ctx.router.url('user.journeys.create', { userid: userr.id }),
        showJourneyPath: jour => ctx.router.url('journeys.show', { id: jour.id }),
      });
      break;
    default:
      break;
  }

});

router.post('user.journeys.create', '/journey/:userid', loadUserForJourney, async (ctx) => {
  const { user } = ctx.state;
  const journey = ctx.orm.journey.build(ctx.request.body);
  const fromusernew = true;
  const image = ctx.request.files.imageUrl;
  let url;
  try {
    if (image.name === '') {
      await journey.save({ fields: ['title', 'year', 'ranking', 'description', 'continent'] });
    } else {
      await cloudinary.uploader.upload(image.path, (error, result) => {
        // console.log(result, error);
        // eslint-disable-next-line prefer-destructuring
        url = result.url;
        journey.imageUrl = url;
      });
      await journey.save({ fields: ['title', 'year', 'ranking', 'description', 'continent', 'imageUrl'] });
    }
    console.log(journey);
    await user.addJourneys(journey);
    ctx.redirect('/journeys');
  } catch (validationError) {
    console.log(validationError);
    await ctx.render('journeys/new', {
      journey,
      errors: validationError.errors,
      fromusernew,
      user,
      submitJourneyPath: userr => ctx.router.url('user.journeys.create', { userid: userr.id }),
    });
  }
});

router.get('user.journeys.edit', '/:id/journeys/:journeyid/edit', loadUser, loadJourney, async (ctx) => {
  const { journey } = ctx.state;
  const { user } = ctx.state;
  const fromusernew = false;

  switch (ctx.accepts(['json', 'html'])) {
    case 'json':
      ctx.body = journey;
      break;
    case 'html':
      await ctx.render('journeys/edit', {
        journey,
        fromusernew,
        user,
        submitJourneyPath: pub => ctx.router.url('user.journeys.update', { id: user.id, journeyid: pub.id }),
        showJourneyPath: jour => ctx.router.url('journeys.show', { id: jour.id }),
      });
      break;
    default:
      break;
  }
});

router.patch('user.journeys.update', '/:id/journeys/:journeyid', loadUser, loadJourney, async (ctx) => {
  const { journey } = ctx.state;
  const { user } = ctx.state;
  const fromusernew = false;
  let imageUrl = '';

  try {
    const {
      title, year, ranking, description, continent,
    } = ctx.request.body;
    const image = ctx.request.files.imageUrl;
    if (image.name === '') {
      await journey.update({
        title, year, ranking, description, continent,
      });
    } else {
      await cloudinary.uploader.upload(image.path, (error, result) => {
        // eslint-disable-next-line prefer-destructuring
        if (result) {
          imageUrl = result.url;
        }
      });
      await journey.update({
        title, year, ranking, description, continent, imageUrl,
      });
    }
    ctx.redirect(ctx.router.url('users.journeys', { id: user.id }));
  } catch (validationError) {
    await ctx.render('journeys/edit', {
      journey,
      errors: validationError.errors,
      fromusernew,
      submitJourneyPath: ctx.router.url('user.journeys.update', { id: user.id, journeyid: journey.id }),
    });
  }
});

router.del('user.journeys.delete', '/:id/journeys/:journeyid', loadUser, loadJourney, async (ctx) => {
  const { journey } = ctx.state;
  const { user } = ctx.state;
  await journey.destroy();
  ctx.redirect(ctx.router.url('users.journeys', { id: user.id }));
});


module.exports = router;
