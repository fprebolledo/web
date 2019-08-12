const KoaRouter = require('koa-router');
const index = require('./routes/index');
const users = require('./routes/users');
const journeys = require('./routes/journeys');
const publications = require('./routes/publications');
const comments = require('./routes/comments');
const session = require('./routes/session');
const followins = require('./routes/followins');
const api = require('./routes/api');


const router = new KoaRouter();
router.use(async (ctx, next) => {
  Object.assign(ctx.state, {
    searchPublicationPath: ctx.router.url('search'),
    currentUser: ctx.session.userId && await ctx.orm.user.findById(ctx.session.userId),
    editUser: user => ctx.router.url('users.edit', { id: user.id }),
    createUser: ctx.router.url('users.new'),
    myPublications: user => ctx.router.url('users.publications', { id: user.id }),
    myJourneys: user => ctx.router.url('users.journeys', { id: user.id }),
    myfollowins: ctx.router.url('followers.list'),
    newSessionPath: ctx.router.url('session.new'),
    destroySessionPath: ctx.router.url('session.destroy'),
    // publicationsPath: ctx.router.url('courses.list'),
  });
  return next();
});

router.use('/api', api.routes());
router.use('/', index.routes());
router.use('/users', users.routes());
router.use('/journeys', journeys.routes());
router.use('/publications', publications.routes());
router.use('/comments', comments.routes());
router.use('/session', session.routes());
router.use('/followins', followins.routes());


module.exports = router;
