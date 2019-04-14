import React, { SFC } from 'react';
import { includes } from 'lodash';
import styled from 'styled-components';
import { Button, Typography } from '@material-ui/core';
import {
  ThumbUpOutlined,
  ThumbDownOutlined,
  DeleteForeverOutlined,
} from '@material-ui/icons';
import useTranslations from '../../translations';
import useGlobalState from '../../state';
import EditableLabel from '../../components/EditableLabel';
import { Palette } from '../../Theme';
import { Post } from 'retro-board-common';

interface PostItemProps {
  post: Post;
  color: string;
  onLike: () => void;
  onDislike: () => void;
  onEdit: (content: string) => void;
  onDelete: () => void;
}

const PostItem: SFC<PostItemProps> = ({
  post,
  color,
  onLike,
  onDislike,
  onEdit,
  onDelete,
}) => {
  const { state } = useGlobalState();
  const user = state.username;
  const hasVotedOrAuthor =
    includes(post.likes, user) ||
    includes(post.dislikes, user) ||
    user === post.user;
  const isAuthor = user === post.user;
  console.log('Post: ', post);
  return (
    <PostWrapper color={color}>
      <LabelWrapper>
        <Typography variant="body1">
          <EditableLabel
            readOnly={!isAuthor}
            value={post.content}
            onChange={onEdit}
            label="Post content"
          />
        </Typography>
      </LabelWrapper>
      <Controls>
        <Button onClick={onLike} disabled={hasVotedOrAuthor} aria-label="Like">
          <ThumbUpOutlined style={{ color: Palette.positive }} />
          &nbsp;{post.likes.length}
        </Button>
        <Button
          onClick={onDislike}
          disabled={hasVotedOrAuthor}
          aria-label="Dislike"
        >
          <ThumbDownOutlined style={{ color: Palette.negative }} />
          &nbsp;{post.dislikes.length}
        </Button>
        {isAuthor && (
          <Button onClick={onDelete} aria-label="Delete">
            <DeleteForeverOutlined style={{ color: Palette.negative }} />
          </Button>
        )}
      </Controls>
    </PostWrapper>
  );
};

const PostWrapper = styled.div<{ color: string }>`
  background-color: ${props => props.color};
  margin: 5px;
  padding: 5px;
  border-radius: 1px;
  box-shadow: 2px 2px 5px 0px rgba(173, 173, 173, 1);
`;

const LabelWrapper = styled.div`
  margin: 10px;
`;

const Controls = styled.div``;

export default PostItem;
