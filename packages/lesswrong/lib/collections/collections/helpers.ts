import { Utils } from '../../vulcan-lib';
import Books from '../books/collection';
import { sequenceGetAllPostIDs } from '../sequences/helpers';
import toDictionary from '../../utils/toDictionary';
import * as _ from 'underscore';

export const collectionGetAllPostIDs = async (collectionID: string): Promise<Array<string>> => {
  const books = await Books.find({collectionId: collectionID}).fetch();
  const sequenceIDs = _.flatten(books.map(book=>book.sequenceIds));
  
  const sequencePostsPairs = await Promise.all(
    sequenceIDs.map(async seqID => [seqID, await sequenceGetAllPostIDs(seqID)])
  );
  const postsBySequence = toDictionary(sequencePostsPairs, pair=>pair[0], pair=>pair[1]);
  
  const posts = _.flatten(books.map(book => {
    const postsInSequencesInBook = _.flatten(
      _.map(book.sequenceIds, sequenceId => postsBySequence[sequenceId])
    );
    if (book.postIds)
      return _.union(book.postIds, postsInSequencesInBook);
    else
      return postsInSequencesInBook;
  }));
  return posts;
};

export const collectionGetPageUrl = (collection: CollectionsPageFragment|DbCollection, isAbsolute?: boolean): string => {
  const prefix = isAbsolute ? Utils.getSiteUrl().slice(0,-1) : '';
  return `${prefix}/${collection.slug}`;
}
