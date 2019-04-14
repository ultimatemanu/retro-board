import React from 'react';
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import useTranslations from '../../translations';
import useGlobalState from '../../state';
import GameEngine from './GameEngine';
import Column from './Column';
import EditableLabel from '../../components/EditableLabel';
import { ColumnContent } from './types';

interface GameModeProps {
  service: GameEngine;
  columns: ColumnContent[];
}

function GameMode({ service, columns }: GameModeProps) {
  const translations = useTranslations();
  const { state } = useGlobalState();

  return (
    <div>
      {service && (
        <>
          <Typography variant="headline" align="center" gutterBottom paragraph>
            <EditableLabel
              placeholder={translations.SessionName.defaultSessionName}
              value={state.session.name}
              centered
              onChange={value => service.renameSession(value)}
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
                onAdd={post => service.addPost(column.type, post)}
                onDelete={service.deletePost.bind(service)}
                onLike={post => service.like(post, true)}
                onDislike={post => service.like(post, false)}
                onEdit={service.editPost.bind(service)}
              />
            ))}
          </Columns>
        </>
      )}
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
