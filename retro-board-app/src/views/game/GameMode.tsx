import React from 'react';
import styled from 'styled-components';
import { PostType, Post } from 'retro-board-common';
import { Typography } from '@material-ui/core';
import useTranslations from '../../translations';
import useGlobalState from '../../state';
import Column from './Column';
import EditableLabel from '../../components/EditableLabel';
import { ColumnContent } from './types';

interface GameModeProps {
  columns: ColumnContent[];
  onRenameSession: (name: string) => void;
  onAddPost: (type: PostType, content: string) => void;
  onDeletePost: (post: Post) => void;
  onLike: (post: Post, like: boolean) => void;
  onEdit: (post: Post) => void;
}

function GameMode({
  onRenameSession,
  onAddPost,
  onDeletePost,
  onLike,
  onEdit,
  columns,
}: GameModeProps) {
  const translations = useTranslations();
  const { state } = useGlobalState();

  return (
    <div>
      <Typography variant="h5" align="center" gutterBottom paragraph>
        <EditableLabel
          placeholder={translations.SessionName.defaultSessionName}
          value={state.session.name}
          centered
          onChange={onRenameSession}
        />
      </Typography>
      <Columns>
        {columns.map(column => (
          <Column
            key={column.type}
            posts={column.posts}
            question={column.label}
            icon={column.icon}
            color={column.color}
            onAdd={content => onAddPost(column.type, content)} // UseCallback
            onDelete={onDeletePost}
            onLike={post => onLike(post, true)} // UseCallback
            onDislike={post => onLike(post, false)} // UseCallback
            onEdit={onEdit}
          />
        ))}
      </Columns>
    </div>
  );
}

const Columns = styled.div`
  display: flex;
  margin-top: 30px;

  @media screen and (max-width: 900px) {
    margin-top: 10px;
    flex-direction: column;
  }
`;

export default GameMode;
