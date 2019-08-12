/* eslint-disable no-await-in-loop */
const KoaRouter = require('koa-router');

const router = new KoaRouter();

async function loadUser(ctx, next) {
  ctx.state.user = await ctx.orm.user.findById(ctx.params.id);
  return next();
}

router.get('followers.list', '/', async (ctx) => {
  const { currentUser } = ctx.state;
  const usersList1 = await currentUser.getFollowin();
  const userList = await ctx.orm.user.findAll();
  console.log(usersList1);
  let user2;
  const fromfollowins = true;
  let publicationsList = [];
  let userp = [];
  for (let i = 0; i < (usersList1.length); i++) {
    console.log(i);
    user2 = usersList1[i];
    console.log(user2.name);
    userp = await user2.getPublications();
    console.log(userp);
    userp.sort((a, b) => a.id - b.id);
    userp = userp.slice(0, 3);
    publicationsList = publicationsList.concat(userp);
  }
  console.log(publicationsList);
  const fromsearch = false;
  await ctx.render('publications/index', {
    publicationsList,
    fromfollowins,
    userList,
    fromsearch,
    deletePublicationPath: (user, publication) => ctx.router.url('user.publications.delete', { id: user.id, publicationid: publication.id }),
    newPublicationPath: userr => ctx.router.url('user.publications.new', { userid: userr.id }),
    editPublicationPath: (user, publication) => ctx.router.url('user.publications.edit', { id: user.id, publicationid: publication.id }),
    showPublicationPath: publication => ctx.router.url('publications.show', { id: publication.id }),
  });
});

router.get('add.follower', '/addfollower/:id', loadUser, async (ctx) => {
  const { currentUser, user } = ctx.state;
  await currentUser.addFollowin(user);
  switch (ctx.accepts(['json', 'html'])) {
    case 'json':
      ctx.body = true;
      break;
    case 'html':
      ctx.redirect(ctx.router.url('users.show', { id: user.id }));
      break;
    default:
      break;
  }
});

router.del('delete.follower', '/deletefollower/:id', loadUser, async (ctx) => {
  const { currentUser, user } = ctx.state;
  // eslint-disable-next-line max-len
  await currentUser.removeFollowin(user);
  switch (ctx.accepts(['json', 'html'])) {
    case 'json':
      ctx.body = false;
      break;
    case 'html':
      ctx.redirect(ctx.router.url('users.show', { id: user.id }));
      break;
    default:
      break;
  }
});
module.exports = router;
