const KoaRouter = require('koa-router');

const router = new KoaRouter();

router.get('api.journey.list', '/', async (ctx) => {
    console.log('xd');
    const journeyList = await ctx.orm.journey.findAll();
    ctx.body = ctx.jsonSerializer('journey', {
      attributes: ['title', 'year', 'ranking', 'description', 'continent', 'imageUrl'],
      topLevelLinks: {
        self: `${ctx.origin}${ctx.router.url('api.journey.list')}`,
      },
      dataLinks: {
        self: (dataset, journey) => `${ctx.origin}/api/journeys/${journey.id}`,
      },
    }).serialize(journeyList);
});

router.get('api.journey.show', '/:id', async (ctx) => {
    const journey = await ctx.orm.journey.findById(ctx.params.id);
    const publications = await journey.getPublications();

    const links = publications.map(publication => `${ctx.origin}/api/publications/${publication.id}`);

    ctx.body = ctx.jsonSerializer('journey', {
      attributes: ['title', 'date', 'stars', 'description', 'place', 'city', 'budget', 'autor', 'continent', 'country', 'duration', 'host', 'transport', 'votes', 'images'],
      topLevelLinks: {
          self: `${ctx.origin}${ctx.router.url('api.journey.list')}${ctx.params.id}`,
        },
        dataLinks: {
          publicaciones: links,
      }
    }).serialize(journey);

});
module.exports = router;
