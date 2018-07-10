import { Components, registerComponent } from 'meteor/vulcan:core';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import classNames from 'classnames';

const styles = theme => ({
  upvote: {
    marginBottom: -22
  },
  downvote: {
    marginTop: -25
  },
  voteScore: {
    color: theme.palette.grey[500],
    paddingLeft: 1, // For some weird reason having this padding here makes it look more centered
    position: 'relative',
    zIndex: 1,
    fontSize: '55%',
    lineHeight: 1
  },
  secondaryVoteScore: {
    fontSize: '35%',
    marginBottom: 2,
  },
  voteBlock: {
    width: 50,
  },
  tooltip: {
    color: theme.palette.grey[500],
    fontSize: '1rem',
    backgroundColor: 'white',
    transition: 'opacity 150ms cubic-bezier(0.4, 0, 1, 1) 0ms',
    marginLeft: 0,
    '&$open': {
      opacity: 1,
      transition: 'opacity 150ms cubic-bezier(0.4, 0, 1, 1) 0ms'
    }
  },
  open: {}
})

class Vote extends PureComponent {
  render() {
    const { document, classes, currentUser, collection } = this.props
    const allVotes = document && document.allVotes;

    return (
        <div className={classes.voteBlock}>
          <Tooltip
            title="Click-and-hold for strong vote"
            placement="right"
            classes={{tooltip: classes.tooltip, open: classes.open}}
          >
            <div className={classes.upvote}>
              <Components.VoteButton
                orientation="up"
                color="secondary"
                voteType="Upvote"
                document={document}
                currentUser={currentUser}
                collection={collection}
              />
            </div>
          </Tooltip>
          <Tooltip
            title={allVotes &&`${allVotes.length} ${allVotes.length == 1 ? "Vote" : "Votes"}`}
            placement="right"
            classes={{tooltip: classes.tooltip, open: classes.open}}
          >
            <Typography variant="headline" className={classes.voteScore}>{document.baseScore || 0}</Typography>
          </Tooltip>

          {!!document.afBaseScore &&
            <Tooltip
              title="Alignment Forum karma"
              placement="right"
              classes={{tooltip: classes.tooltip, open: classes.open}}
            >
              <Typography
                variant="headline"
                className={classNames(classes.voteScore, classes.secondaryVoteScore)}>
                Ω	{document.afBaseScore}
              </Typography>
            </Tooltip>
          }
            <Tooltip
            title="Click-and-hold for strong vote"
            placement="right"
            classes={{tooltip: classes.tooltip, open: classes.open}}
          >
            <div className={classes.downvote}>
              <Components.VoteButton
                orientation="down"
                color="error"
                voteType="Downvote"
                document={document}
                currentUser={currentUser}
                collection={collection}
              />
            </div>
          </Tooltip>
        </div>)
    }
}

Vote.propTypes = {
  document: PropTypes.object.isRequired, // the document to upvote
  collection: PropTypes.object.isRequired, // the collection containing the document
  currentUser: PropTypes.object, // user might not be logged in, so don't make it required
  classes: PropTypes.object.isRequired
};

registerComponent('Vote', Vote, withStyles(styles));
