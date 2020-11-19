import { Components, registerComponent } from '../../lib/vulcan-lib';
import React from 'react';
import { postGetPageUrl } from '../../lib/collections/posts/helpers';
import { userGetProfileUrl } from '../../lib/collections/users/helpers';
import { Link } from '../../lib/reactRouterWrapper'
import Typography from '@material-ui/core/Typography';

const styles = (theme: ThemeType): JssStyles => ({
  comment: {
    fontSize: "1rem",
    lineHeight: "1.5em"
  }
})

const SunshineCommentsItemOverview = ({ comment, classes }: {
  comment: any,
  classes: ClassesType,
}) => {
  const { markdown = "" } = comment.contents || {}
  const commentExcerpt = markdown && markdown.substring(0,38);
  return (
    <div>
      <Typography variant="body2">
        <Link to={comment.post && postGetPageUrl(comment.post) + "#" + comment._id} className={classes.comment}>
          { comment.deleted ? <span>COMMENT DELETED</span>
            : <span>{ commentExcerpt }</span>
          }
        </Link>
      </Typography>
      <div>
        <Components.SidebarInfo>
          { comment.baseScore }
        </Components.SidebarInfo>
        <Components.SidebarInfo>
          <Link to={userGetProfileUrl(comment.user)}>
              {comment.user && comment.user.displayName}
          </Link>
        </Components.SidebarInfo>
        <Components.SidebarInfo>
          <Components.CommentsItemDate comment={comment} post={comment.post}/>
        </Components.SidebarInfo>
      </div>
    </div>
  )
}

const SunshineCommentsItemOverviewComponent = registerComponent('SunshineCommentsItemOverview', SunshineCommentsItemOverview, {styles});

declare global {
  interface ComponentTypes {
    SunshineCommentsItemOverview: typeof SunshineCommentsItemOverviewComponent
  }
}

