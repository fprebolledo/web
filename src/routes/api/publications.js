const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('api.publication.list', '/', async (ctx) => {
  const publicationList = await ctx.orm.publication.findAll();
  ctx.body = ctx.jsonSerializer('publication', {
    attributes: ['title', 'date', 'stars', 'description', 'place', 'city', 'budget', 'autor', 'continent', 'country', 'duration', 'host', 'transport', 'votes', 'images'],
    topLevelLinks: {
      self: `${ctx.origin}${ctx.router.url('api.publication.list')}`,
    },
    dataLinks: {
      self: (dataset, publication) => `${ctx.origin}/api/publications/${publication.id}`,
    },
  }).serialize(publicationList);
});

router.get('api.publication.show', '/:id', async (ctx) => {
  const publication = await ctx.orm.publication.findById(ctx.params.id);
  ctx.body = ctx.jsonSerializer('publication', {
    attributes: ['title', 'date', 'stars', 'description', 'place', 'city', 'budget', 'continent', 'country', 'duration', 'host', 'transport', 'votes', 'images'],
    topLevelLinks: {
      self: `${ctx.origin}${ctx.router.url('api.publication.list')}${ctx.params.id}`,
    },
  }).serialize(publication);
});
module.exports = router;
