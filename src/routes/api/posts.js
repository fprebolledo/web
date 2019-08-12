const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.post('api.publication.create', '/createPub', async (ctx) => {
  const { currentUser } = ctx.state;

  const publication = ctx.orm.publication.build(ctx.request.body);

  try {
    await publication.save({ fields: ['title', 'date', 'stars', 'description', 'place', 'city', 'budget', 'autor', 'continent', 'country', 'duration', 'host', 'transport', 'votes', 'images'] });
    await currentUser.addPublications(publication);

    ctx.body = ctx.jsonSerializer('publication', {
      attributes: ['title', 'date', 'stars', 'description', 'place', 'city', 'budget', 'continent', 'country', 'duration', 'host', 'transport', 'votes', 'images'],
      topLevelLinks: {
        self: `${ctx.origin}${ctx.router.url('api.publication.list')}${publication.id}`,
      },
    }).serialize(publication);
  } catch (validationError) {
    console.log(validationError);
    ctx.status = 403;
  }
});


module.exports = router;