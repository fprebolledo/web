const KoaRouter = require('koa-router');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'importteam',
  api_key: '139514321496881',
  api_secret: 'Dm7BWhrcnUEBzNz4ikaEKlz3MhU',
});

const router = new KoaRouter();

async function loadJourney(ctx, next) {
  ctx.state.journey = await ctx.orm.journey.findById(ctx.params.id);
  return next();
}

async function loadJourneyUserForPub(ctx, next) {
  ctx.state.journey = await ctx.orm.journey.findById(ctx.params.id);
  ctx.state.user = await ctx.orm.user.findById(ctx.state.journey.userId);
  return next();
}

async function loadPublication(ctx, next) {
  ctx.state.publication = await ctx.orm.publication.findById(ctx.params.publicationid);
  return next();
}

router.get('journeys.list', '/', async (ctx) => {
  const journeysList = await ctx.orm.journey.findAll();
  const userList = await ctx.orm.user.findAll();
  const fromusernew = true;
  const fromsearch = false;
  await ctx.render('journeys/index', {
    journeysList,
    userList,
    fromsearch,
    fromusernew,
    deleteJourneyPath: (user, journey) => ctx.router.url('user.journeys.delete', { id: user.id, journeyid: journey.id }),
    newJourneyPath: userr => ctx.router.url('user.journeys.new', { userid: userr.id }),
    editJourneyPath: (user, journey) => ctx.router.url('user.journeys.edit', { id: user.id, journeyid: journey.id }),
    showJourneyPath: journey => ctx.router.url('journeys.show', { id: journey.id }),
  });
});

// eslint-disable-next-line consistent-return
router.get('journeys.show', '/:id/show', loadJourney, async (ctx) => {
  const { journey, currentUser } = ctx.state;
  if (!currentUser) {
    return ctx.redirect(ctx.router.url('session.new'));
  }
  const publicationsList = await journey.getPublications();
  const pub = ctx.orm.publication.build();
  const userList = await ctx.orm.user.findAll();
  const fromusernew = true;
  // eslint-disable-next-line eqeqeq
  const userAutor = userList.find(user => journey.userId == user.id);

  await ctx.render('journeys/show', {
    journey,
    publicationsList,
    userList,
    userAutor,
    pub,
    fromusernew,
    createSessionPath: ctx.router.url('session.create'),
    deletePublicationPath: publication => ctx.router.url('journey.publications.delete', { id: journey.id, publicationid: publication.id }),
    editPublicationPath: publication => ctx.router.url('journey.publications.edit', { id: journey.id, publicationid: publication.id }),
    showPublicationPath: publication => ctx.router.url('publications.show', { id: publication.id }),
    newJourneyPublicationPath: jour => ctx.router.url('journey.publications.new', { id: jour.id }),
    submitPublicationPath: jour => ctx.router.url('journey.publications.create', { id: jour.id }),
    showUserPath: usr => ctx.router.url('users.show', { id: usr.id }),
  });
});

router.get('journeys.publications.list', '/:id/publications', loadJourney, async (ctx) => {
  const { journey } = ctx.state;
  const publicationsList = await journey.getPublications();
  const userList = await ctx.orm.user.findAll();
  const fromusernew = true;
  await ctx.render('journeys/publications', {
    publicationsList,
    userList,
    fromusernew,
  });
});

router.get('journey.publications.new', '/:id/newpublication', loadJourney, async (ctx) => {
  const { journey } = ctx.state;
  const fromusernew = true;
  const publication = ctx.orm.publication.build();
  const user = await ctx.orm.user.findById(journey.userId);

  switch (ctx.accepts(['json', 'html'])) {
    case 'json': ctx.body = publication; break;
    case 'html':
      await ctx.render('journeys/newpublication', {
        fromusernew,
        user,
        publication,
        submitPublicationPath: jour => ctx.router.url('journey.publications.create', { id: jour.id }),
        showJourneyPath: jour => ctx.router.url('journeys.show', { id: jour.id }),
      });
      break;
    default:
      break;
  }
});

router.post('journey.publications.create', '/:id', loadJourneyUserForPub, async (ctx) => {
  const { journey } = ctx.state;
  const publication = ctx.orm.publication.build(ctx.request.body);
  const fromusernew = true;
  const listaArchivos = Object.values(ctx.request.files)[0]; // type files con atributos
  const url = [];
  const user = await ctx.orm.user.findById(journey.userId);
  console.log(listaArchivos);

  // ------------------------------------------------

  for (let i = 0; i < (listaArchivos.length); i += 1) {
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
    if (url.length !== 0) {
      url.forEach(link => publication.images.push(link));
    }
    await publication.save({ fields: ['title', 'date', 'stars', 'description', 'place', 'city', 'budget', 'autor', 'continent', 'country', 'duration', 'host', 'transport', 'votes', 'images'] });
    await user.addPublications(publication);
    await journey.addPublications(publication);
    ctx.redirect(ctx.router.url('journeys.show', { id: journey.id }));

    // ------------------------------------
  } catch (validationError) {
    console.log(validationError);
    await ctx.render('journeys/newpublication', {
      publication,
      errors: validationError.errors,
      fromusernew,
      submitPublicationPath: jour => ctx.router.url('journey.publications.create', { id: jour.id }),
    });
  }
});

router.get('journey.publications.edit', '/:id/publications/:publicationid/edit', loadJourney, loadPublication, async (ctx) => {
  const { publication } = ctx.state;
  const { journey } = ctx.state;
  const fromusernew = false;

  switch (ctx.accepts(['json', 'html'])) {
    case 'json':
      ctx.body = publication;
      break;
    case 'html':
      await ctx.render('journeys/editpublication', {
        fromusernew,
        publication,
        submitPublicationPath: pub => ctx.router.url('journey.publications.update', { id: journey.id, publicationid: pub.id }),
      });
      break;
    default:
      break;
  }
});

router.patch('journey.publications.delete.foto', '/:id/publications/:publicationid/:url', loadPublication, async (ctx) => {
  const { publication } = ctx.state;
  const { url } = ctx.params;
  try {
    await cloudinary.uploader.destroy(url, (err, result) => {
      console.log(err);
      console.log(result);
    });
    const indice = publication.images.indexOf(url);
    publication.images.splice(indice, 1);
    const list = publication.images;
    await publication.update({ images: list });

    ctx.redirect(`/publications/${publication.id}/show`);
  } catch (err) {
    console.log(err);
  }
});

router.patch('journey.publications.update', '/:id/publications/:publicationid', loadJourney, loadPublication, async (ctx) => {
  const { publication } = ctx.state;
  const { journey } = ctx.state;
  const fromusernew = false;
  const listaArchivos = Object.values(ctx.request.files)[0]; // type files con atributo
  const url = [];

  for (let i = 0; i < (listaArchivos.length); i += 1) {
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
        publication.images = [];
      }
      const images = publication.images.concat(url);
      await publication.update({
        // eslint-disable-next-line max-len
        title, date, stars, description, place, city, budget, autor, continent, country, duration, host, transport, images,
      });
    }
    ctx.redirect(ctx.router.url('journeys.show', { id: journey.id }));
  } catch (validationError) {
    console.log(validationError);
    await ctx.render('journeys/editpublication', {
      publication,
      errors: validationError.errors,
      fromusernew,
      submitPublicationPath: ctx.router.url('journey.publications.update'),
    });
  }
});

router.del('journey.publications.delete', '/:id/publications/:publicationid', loadJourney, loadPublication, async (ctx) => {
  const { publication } = ctx.state;
  const { journey } = ctx.state;
  await publication.destroy();
  ctx.redirect(ctx.router.url('journeys.show', { id: journey.id }));
});


module.exports = router;
