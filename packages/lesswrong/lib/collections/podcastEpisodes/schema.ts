import { foreignKeyField } from '../../utils/schemaUtils';

const schema: SchemaType<DbPodcastEpisode> = {
  podcastId: {
    ...foreignKeyField({
      idFieldName: 'podcastId',
      resolverName: 'podcast',
      collectionName: 'Podcasts',
      type: 'Podcast',
      nullable: false
    }),
    optional: true, // ???
    canRead: ['guests'],
    canCreate: ['podcasters', 'admins']
  },
  title: {
    type: String,
    optional: false,
    canRead: ['guests'],
    canCreate: ['podcasters', 'admins']
  },
  episodeLink: {
    type: String,
    optional: false,
    canRead: ['guests'],
    canCreate: ['podcasters', 'admins']
  },
  externalEpisodeId: {
    type: String,
    optional: false,
    canRead: ['guests'],
    canCreate: ['podcasters', 'admins']
  }
};

export default schema;
