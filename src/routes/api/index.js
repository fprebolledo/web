const KoaRouter = require('koa-router');
const jwt = require('koa-jwt');
const authApi = require('./auth');
const publicationApi = require('./publications');
const journeysApi = require('./journeys');
const postsApi = require('./posts');
const usersApi = require('./users');

const router = new KoaRouter();


router.use('/publications', publicationApi.routes());
router.use('/journeys', journeysApi.routes());
router.use('/users', usersApi.routes());

// de aqui hacia abajo van protegidos.
router.use('/auth', authApi.routes());

// AUTH Hace que al llegar el request se cree un secreto
// que se almacena en una env, solo pasa la linea de arriba si
// la contraseña y email era correcto, por lo tanto no se ejecuta
// de aqui hacia abajo si no era correcta.

router.use(jwt({ secret: process.env.JWT_SECRET, key: 'authData' }));
// decifra el secreto

router.use(async (ctx, next) => {
  if (ctx.state.authData.userId) {
    ctx.state.currentUser = await ctx.orm.user.findById(ctx.state.authData.userId);
  }
  return next();
});
// crea el current user.

router.use('/posts', postsApi.routes());

module.exports = router;
