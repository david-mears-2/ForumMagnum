import React from 'react';
import { registerComponent, useSingle, getSetting } from 'meteor/vulcan:core';
import { Link } from '../../lib/reactRouterWrapper';
import { useLocation } from '../../lib/routeUtil';
import Posts from '../../lib/collections/posts/collection.js';
import { Helmet } from 'react-helmet';
import { withStyles } from '@material-ui/core/styles';
import { styles } from '../common/HeaderSubtitle';

const metaName = getSetting('forumType') === 'EAForum' ? 'Community' : 'Meta'

const PostsPageHeaderTitle = ({isSubtitle, siteName, classes}) => {
  const { params: {_id, postId} } = useLocation();
  const { document: post, loading } = useSingle({
    documentId: _id || postId,
    collection: Posts,
    fragmentName: "PostsBase",
    fetchPolicy: 'cache-only',
    ssr: true,
  });
  
  if (!post || loading) return null;
  const titleString = `${post.title} - ${siteName}`
  
  if (!isSubtitle)
    return <Helmet>
      <title>{titleString}</title>
      <meta property='og:title' content={titleString}/>
    </Helmet>
  
  if (getSetting('forumType') !== 'AlignmentForum' && post.af) {
    // TODO: A (broken) bit of an earlier iteration of the header subtitle
    // tried to made AF posts have a subtitle which said "AGI Alignment" and
    // linked to /alignment. But that bit of code was broken, and also that URL
    // is invalid. Maybe make a sensible place for it to link to, then put it
    // back? (alignment-forum.org isn't necessarily good to link to, because
    // it's invite-only.)
    return null;
  } else if (post.frontpageDate) {
    return null;
  } else if (post.meta) {
    return (<span className={classes.subtitle}>
      <Link to="/meta">{metaName}</Link>
    </span>);
  } else if (post.userId) {
    // TODO: For personal blogposts, put the user in the sutitle. There was an
    // attempt to do this in a previous implementation, which didn't work.
    return null;
  }
}
registerComponent("PostsPageHeaderTitle", PostsPageHeaderTitle,
  withStyles(styles, {name: "PostsPageHeaderTitle"})
);