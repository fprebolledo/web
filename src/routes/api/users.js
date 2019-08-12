const KoaRouter = require('koa-router');

const router = new KoaRouter();
router.post('api.user.create', '/createUser', async (ctx) => {
  const user = ctx.orm.user.build(ctx.request.body);
  console.log(user);
  try {
    user.influencer = false;
    user.ranking = 0;
    await user.save({ fields: ['name', 'username', 'ranking', 'influencer', 'email', 'password', 'sex', 'age', 'description'] });
    // no se deja imageUrl debido a que para las vistas y como esta implementado en la app se ocupa con NULL.
    ctx.body = ctx.jsonSerializer('user', {
      attributes: ['name', 'username', 'email', 'sex', 'age', 'ranking', 'influencer', 'description', 'imageUrl'],
    }).serialize(user);
  } catch (validationError) {
    console.log(validationError);
    ctx.status = 403;
  }
});
module.exports = router;