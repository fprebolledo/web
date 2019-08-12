const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadPublication(ctx, next) {
  ctx.state.publication = await ctx.orm.publication.findById(ctx.params.id);
  return next();
}
async function loadComment(ctx, next) {
  ctx.state.comment = await ctx.orm.comment.findById(ctx.params.commentid);
  return next();
}
async function loadLikeComment(ctx, next) {
  ctx.state.likecomment = await ctx.orm.likecomment.findById(ctx.params.likecommentid);
  return next();
}
async function loadLikePublication(ctx, next) {
  ctx.state.likepublication = await ctx.orm.likepublication.findById(ctx.params.likepublicationid);
  return next();
}

/* async function loadUser(ctx, next) {
  ctx.state.user = await ctx.orm.user.findById(ctx.params.id);
  return next();
} */

router.get('star.publication', '/:id/stars/:cantidad', loadPublication, async (ctx) => {
  const { publication } = ctx.state;
  const star = parseFloat(publication.stars) + parseFloat(ctx.params.cantidad);
  const votos = parseFloat(publication.votes) + 1;
  try {
    await publication.update({ stars: star, votes: votos });
    ctx.redirect(ctx.router.url('publications.show', { id: publication.id }));
  } catch (validationError) {
    // Validacion del error
  }
});
router.get('publication.like', '/:id/actualizando/:valor/', loadPublication, async (ctx) => {
  const { publication } = ctx.state;
  const { currentUser } = ctx.state;
  const valor = parseInt(ctx.params.valor, 10);
  const likepublication = ctx.orm.likepublication.build({ value: valor });
  const userList = await ctx.orm.user.findAll();
  // eslint-disable-next-line eqeqeq
  const userAutor = userList.find(user => publication.userId == user.id);

  try {
    await likepublication.save({ fields: ['value'] });
    await publication.addLikepublications(likepublication);
    await currentUser.addLikepublications(likepublication);
    let xd = await currentUser.getLikepublications();
    publication.stars += valor;
    publication.votes += 1;
    userAutor.ranking += valor * 0.25;
    if (userAutor.ranking >= 4) {
      userAutor.influencer = true;
    } else {
      userAutor.influencer = false;
    }
    await publication.save({ fields: ['stars', 'votes'] });
    await userAutor.save({ fields: ['ranking'] });
    await userAutor.save({ fields: ['influencer'] });
    switch (ctx.accepts(['json', 'html'])) {
      case 'json':
        ctx.body = { publication, likepublication };
        break;
      case 'html':
        ctx.redirect(ctx.router.url('publications.show', { id: publication.id }));
        break;
      default:
        break;
    }
  } catch (validationError) {
    console.log(validationError);
  }
});

router.get('publication.like.update', '/:id/:likepublicationid/actualizar/:valor/', loadPublication, loadLikePublication, async (ctx) => {
  const { likepublication } = ctx.state;
  const { publication } = ctx.state;
  console.log('estoy en el routeeeeeeeeeeeeeeeeeeeeeeeeeer');
  const valor = parseInt(ctx.params.valor, 10);
  const userList = await ctx.orm.user.findAll();
  // eslint-disable-next-line eqeqeq
  const userAutor = userList.find(user => publication.userId == user.id);

  try {
    publication.stars -= likepublication.value; // resto el antiguo
    userAutor.ranking -= likepublication.value * 0.25;
    likepublication.value = valor;
    publication.stars += valor; // sumo el nuevo
    userAutor.ranking += valor * 0.25;
    if (userAutor.ranking >= 4) {
      userAutor.influencer = true;
    } else {
      userAutor.influencer = false;
    }
    await likepublication.save({ fields: ['value'] });
    await publication.save({ fields: ['stars'] });
    await userAutor.save({ fields: ['ranking'] });
    await userAutor.save({ fields: ['influencer'] });
    switch (ctx.accepts(['json', 'html'])) {
      case 'json':
        ctx.body = { publication, likepublication };
        break;
      case 'html':
        ctx.redirect(ctx.router.url('publications.show', { id: publication.id }));
        break;
      default:
        break;
    }
  } catch (validationError) {
    console.log(validationError);
  }
});

router.post('search', '/search', async (ctx) => {
  let { search } = ctx.request.body;
  search = search.toLowerCase();
  console.log(search);
  const userList = await ctx.orm.user.findAll();
  const publications = await ctx.orm.publication.findAll();
  const journeys = await ctx.orm.journey.findAll();
  const usersList = [];
  const publicationsList = [];
  const journeysList = [];
  const journeysids = [];
  const fromsearch = true;
  publications.forEach((publication) => {
    if (publication.continent.toLowerCase().includes(search)
      || publication.description.toLowerCase().includes(search)
      || publication.transport.toLowerCase().includes(search)
      || publication.title.toLowerCase().includes(search)
      || publication.country.toLowerCase().includes(search)
      || publication.city.toLowerCase().includes(search)
      || publication.place.toLowerCase().includes(search)) {
      if (!publication.journeyId) {
        publicationsList.push(publication);
      } else {
        journeysids.push(publication.journeyId);
      }
    }
  });
  journeys.forEach((viaje) => {
    if (journeysids.includes(viaje.id) || viaje.title.toLowerCase().includes(search) || viaje.description.toLowerCase().includes(search)) {
      journeysList.push(viaje);
    }
  });
  userList.forEach((user) => {
    if (user.name.toLowerCase().includes(search)
      || user.username.toLowerCase().includes(search)
      || user.email.toLowerCase().includes(search)) {
      usersList.push(user);
    }
  });
  const fromfollowins = false;
  await ctx.render('search/search', {
    publicationsList,
    fromsearch,
    fromfollowins,
    userList,
    usersList,
    journeysList,
    newUserPath: ctx.router.url('users.new'),
    editUserPath: user => ctx.router.url('users.edit', { id: user.id }),
    showUserPath: user => ctx.router.url('users.show', { id: user.id }),
    deleteUserPath: user => ctx.router.url('users.delete', { id: user.id }),
    userPublicationPath: user => ctx.router.url('users.publications', { id: user.id }),
    userJourneyPath: user => ctx.router.url('users.journeys', { id: user.id }),
    deletePublicationPath: (user, publication) => ctx.router.url('user.publications.delete', { id: user.id, publicationid: publication.id }),
    newPublicationPath: userr => ctx.router.url('user.publications.new', { userid: userr.id }),
    editPublicationPath: (user, publication) => ctx.router.url('user.publications.edit', { id: user.id, publicationid: publication.id }),
    showPublicationPath: publication => ctx.router.url('publications.show', { id: publication.id }),
    deleteJourneyPath: (user, journey) => ctx.router.url('user.journeys.delete', { id: user.id, journeyid: journey.id }),
    newJourneyPath: userr => ctx.router.url('user.journeys.new', { userid: userr.id }),
    editJourneyPath: (user, journey) => ctx.router.url('user.journeys.edit', { id: user.id, journeyid: journey.id }),
    showJourneyPath: journey => ctx.router.url('journeys.show', { id: journey.id }),
  });
});

router.get('publications.list', '/', async (ctx) => {
  const publicationsList = await ctx.orm.publication.findAll();
  const userList = await ctx.orm.user.findAll();
  const fromsearch = false;
  const fromfollowins = false;

  await ctx.render('publications/index', {
    publicationsList,
    userList,
    fromfollowins,
    fromsearch,
    deletePublicationPath: (user, publication) => ctx.router.url('user.publications.delete', { id: user.id, publicationid: publication.id }),
    newPublicationPath: userr => ctx.router.url('user.publications.new', { userid: userr.id }),
    editPublicationPath: (user, publication) => ctx.router.url('user.publications.edit', { id: user.id, publicationid: publication.id }),
    showPublicationPath: publication => ctx.router.url('publications.show', { id: publication.id }),
  });
});

router.get('publications.continent', '/:continent', async (ctx) => {
  const cont = ctx.params.continent;
  const publicationsList = await ctx.orm.publication.findAll({ where: { continent: cont } });
  const userList = await ctx.orm.user.findAll();
  const fromfollowins = false;
  const fromsearch = false;
  await ctx.render('publications/index', {
    publicationsList,
    userList,
    fromfollowins,
    fromsearch,
    deletePublicationPath: (user, publication) => ctx.router.url('user.publications.delete', { id: user.id, publicationid: publication.id }),
    newPublicationPath: userr => ctx.router.url('user.publications.new', { userid: userr.id }),
    editPublicationPath: (user, publication) => ctx.router.url('user.publications.edit', { id: user.id, publicationid: publication.id }),
    showPublicationPath: publication => ctx.router.url('publications.show', { id: publication.id }),
  });
});


router.get('publications.show', '/:id/show', loadPublication, async (ctx) => {
  const { publication } = ctx.state;
  const { currentUser } = ctx.state;
  if (!currentUser) {
    return ctx.redirect(ctx.router.url('session.new'));
  }
  const commentsList = await publication.getComments();
  commentsList.sort((a, b) => a.createdAt - b.createdAt);
  let destacados = commentsList;
  destacados.sort((a, b) => b.ranking - a.ranking);
  destacados = destacados.slice(0, 3);
  const likecommentlist = await currentUser.getLikecomments();
  const likepublicationlist = await currentUser.getLikepublications();
  const com = ctx.orm.comment.build();
  const userList = await ctx.orm.user.findAll();
  switch (ctx.accepts(['json', 'html'])) {
    case 'json':
      ctx.body = { likepublicationlist, publication, commentsList, currentUserid: currentUser.id, likecommentlist, userList };
      break;
    case 'html':
      await ctx.render('publications/show', {
        publication,
        commentsList,
        createSessionPath: ctx.router.url('session.create'),
        notice: ctx.flashMessage.notice,
        userList,
        com,
        destacados,
        likecommentlist,
        likepublicationlist,
        updatePublicationLikePath: (pub, likepub, value) => ctx.router.url('publication.like.update', { id: pub.id, likepublicationid: likepub.id, valor: value }),
        publicationLikePath: (pub, value) => ctx.router.url('publication.like', { id: pub.id, valor: value }),
        commentLikePath: (comment, action, pub) => ctx.router.url('comment.like', { commentid: comment.id, accion: action, publicationid: pub.id }),
        updateCommentLikePath: (com2, likecom, action) => ctx.router.url('comment.like.update', { commentid: com2.id, accion: action, likecommentid: likecom.id }),
        deleteImage: (user, pub, urll) => ctx.router.url('user.publications.delete.foto', { id: user.id, publicationid: pub.id, url: urll }),
        publicationStarsPath: (pub, number) => ctx.router.url('star.publication', { id: pub.id, cantidad: number }),
        editPublicationPath: (user, pub) => ctx.router.url('user.publications.edit', { id: user.id, publicationid: pub.id }),
        deleteCommentPath: comment => ctx.router.url('publication.comments.delete', { id: publication.id, commentid: comment.id }),
        editCommentPath: comment => ctx.router.url('publication.comments.edit', { id: publication.id, commentid: comment.id }),
        newCommentPath: pub => ctx.router.url('publication.comments.new', { id: pub.id }),
        submitCommentPath: pub => ctx.router.url('publication.comments.create', { id: pub.id }),
      });
      break;
    default:
      break;
  }
});

router.get('comment.like', '/:commentid/:accion/:publicationid', loadComment, async (ctx) => {
  const { comment } = ctx.state;
  const { currentUser } = ctx.state;
  let rank;
  const userList = await ctx.orm.user.findAll();
  // eslint-disable-next-line eqeqeq
  const userAutor = userList.find(user => comment.userId == user.id);
  console.log(ctx.params.accion);
  if (ctx.params.accion == 'megusta') {
    rank = 1;
  } else {
    rank = -1;
  }
  const likecomment = ctx.orm.likecomment.build({ value: rank });
  try {
    await likecomment.save({ fields: ['value'] });
    await comment.addLikecomments(likecomment);
    await currentUser.addLikecomments(likecomment);
    const likecommentlist = await currentUser.getLikecomments();
    if (ctx.params.accion == 'megusta') {
      comment.ranking += 1;
      userAutor.ranking += 0.1;
    } else {
      comment.rankingN += 1;
      userAutor.ranking -= 0.1;
    }
    
    if (userAutor.ranking >= 4) {
      userAutor.influencer = true;
    } else {
      userAutor.influencer = false;
    }
    await comment.save({ fields: ['ranking', 'rankingN'] });
    await userAutor.save({ fields: ['ranking'] });
    await userAutor.save({ fields: ['influencer'] });

    switch (ctx.accepts(['json', 'html'])) {
      case 'json':
        ctx.body = [comment, likecommentlist];
        break;
      case 'html':
        ctx.redirect(ctx.router.url('publications.show', { id: comment.publicationId }));
        break;
      default:
        break;
    }
  } catch (validationError) {
    console.log(validationError);
  }
});

router.patch('comment.like.update', '/:commentid/:likecommentid/actualizar/:accion/', loadComment, loadLikeComment, async (ctx) => {
  const { likecomment, currentUser } = ctx.state;
  const { comment } = ctx.state;
  const userList = await ctx.orm.user.findAll();
  // eslint-disable-next-line eqeqeq
  const userAutor = userList.find(user => comment.userId == user.id);

  let rank;
  if (ctx.params.accion === 'megusta') {
    rank = 1;
  } else {
    rank = -1;
  }
  try {
    if (ctx.params.accion === 'megusta') {
      if (likecomment.value == 0){
        comment.ranking += 1;
      } else if (likecomment.value == -1){
        comment.rankingN += -1;
        // comment.ranking += 1;
      }
      userAutor.ranking += 0.1;
    } else {
      if (likecomment.value == 0) {
        comment.rankingN += 1;
      } else if (likecomment.value == 1) {
        comment.ranking -= 1;
        // comment.rankingN += 1;
      }
      userAutor.ranking += 0.1;
    }
    likecomment.value += rank;
    await likecomment.save({ fields: ['value'] });
    
    if (userAutor.ranking >= 4) {
      userAutor.influencer = true;
    } else {
      userAutor.influencer = false;
    }
    await comment.save({ fields: ['ranking', 'rankingN'] });
    await userAutor.save({ fields: ['ranking'] });
    await userAutor.save({ fields: ['influencer'] });

    const likecommentlist = await currentUser.getLikecomments();
    switch (ctx.accepts(['json', 'html'])) {
      case 'json':
        ctx.body = [comment, likecommentlist];
        break;
      case 'html':
        ctx.redirect(ctx.router.url('publications.show', { id: comment.publicationId }));
        break;
      default:
        break;
    }
  } catch (validationError) {
    console.log(validationError);
  }
});

router.get('publications.comments.list', '/:id/comments', loadPublication, async (ctx) => {
  const { publication } = ctx.state;
  const commentsList = await publication.getComments();
  const userList = await ctx.orm.user.findAll();
  await ctx.render('publications/comments', {
    commentsList,
    userList,
  });
});

router.get('publication.comments.new', '/:id/newcomment', loadPublication, async (ctx) => {
  const comment = ctx.orm.comment.build();
  const { publication } = ctx.state;
  const fromnew = true;
  await ctx.render('comments/new', {
    publication,
    comment,
    fromnew,
    submitCommentPath: pub => ctx.router.url('publication.comments.create', { id: pub.id }),
  });
});

router.post('publication.comments.create', '/:id/comments', loadPublication, async (ctx) => {
  const { publication } = ctx.state;
  const comment = ctx.orm.comment.build(ctx.request.body);
  console.log(ctx.request.body);
  const fromnew = true;
  try {
    await comment.save({ fields: ['date', 'content', 'ranking', 'userId', 'rankingN'] });
    await publication.addComments(comment);
    const commentsList = await publication.getComments();
    switch (ctx.accepts(['json', 'html'])) {
      case 'json':
        ctx.body = { commentsList };
        break;
      case 'html':
        ctx.redirect(ctx.router.url('publications.show', { id: publication.id }));
        break;
      default:
        break;
    }
  } catch (validationError) {
    console.log(validationError);
    ctx.redirect(ctx.router.url('publications.show', { id: publication.id }));
  }
});

router.get('publication.comments.edit', '/:id/comments/:commentid/edit', loadPublication, loadComment, async (ctx) => {
  const { comment } = ctx.state;
  const { publication } = ctx.state;
  const fromnew = false;
  await ctx.render('comments/edit', {
    comment,
    publication,
    fromnew,
    submitCommentPath: com => ctx.router.url('publication.comments.update', { id: publication.id, commentid: com.id }),
  });
});

router.patch('publication.comments.update', '/:id/comments/:commentid', loadPublication, loadComment, async (ctx) => {
  const { comment } = ctx.state;
  const { publication } = ctx.state;
  const fromnew = false;

  try {
    const { date, content, ranking } = ctx.request.body;
    await comment.update({ date, content, ranking });
    const com = await await ctx.orm.comment.findById(ctx.params.commentid);
    switch (ctx.accepts(['json', 'html'])) {
      case 'json':
        ctx.body = com;
        break;
      case 'html':
        ctx.redirect(ctx.router.url('publications.show', { id: publication.id }));
        break;
      default:
        break;
    }
  } catch (validationError) {
    await ctx.render('comments/edit', {
      comment,
      fromnew,
      errors: validationError.errors,
      submitCommentPath: () => ctx.router.url('publication.comments.update', { id: publication.id, commentid: comment.id }),
    });
  }
});

router.del('publication.comments.delete', '/:id/comments/:commentid', loadPublication, loadComment, async (ctx) => {
  const { comment } = ctx.state;
  const { publication } = ctx.state;
  await comment.destroy();
  const commentsList = await publication.getComments();
  console.log('hola');
  switch (ctx.accepts(['json', 'html'])) {
    case 'json':
      console.log("entro al caso json");
      ctx.body = { commentsList };
      break;
    case 'html':
      ctx.redirect(ctx.router.url('publications.show', { id: publication.id }));
      break;
    default:
      break;
  }
});

module.exports = router;
