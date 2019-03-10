import React, { useContext, useEffect, useState, useMemo } from 'react';
import {
  SentimentSatisfied,
  SentimentVeryDissatisfied,
  WbSunny,
} from '@material-ui/icons';
import io from 'socket.io-client';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { PostType } from 'retro-board-common';
import useTranslations, { LanguageContext } from '../translations';
import useGlobalState from '../state';
import GameEngine from './game/GameEngine';
import GameMode from './game/GameMode';
import SummaryMode from './game/SummaryMode';
import { ColumnContent } from './game/types';
import usePreviousSessions from '../effects/usePreviousSessions';

interface Route {
  gameId: string;
}
interface GameProps extends RouteComponentProps<Route> {}

function GamePage({
  match: {
    params: { gameId },
  },
}: GameProps) {
  const translations = useTranslations();
  const { addToPreviousSessions } = usePreviousSessions();
  const languageContext = useContext(LanguageContext);
  const { state, setSession, setPlayers } = useGlobalState();
  const { summaryMode } = state;
  const [service, setService] = useState<GameEngine>(
    (null as unknown) as GameEngine
  );
  if (service) {
    service.init(setSession, setPlayers, () => state);
  }
  useEffect(() => {
    if (state.username) {
      setSession({
        id: gameId,
        name: '',
        posts: [],
      });

      const socket = io();
      const service = new GameEngine(
        socket,
        setSession,
        setPlayers,
        () => state,
        gameId,
        state.username
      );
      setService(service);
    }
  }, [gameId, state.username]);

  useEffect(() => {
    return () => {
      console.log('Trying to disconnect ', service);
      if (service) {
        service.disconnect();
      }
    };
  }, [service]);

  useEffect(() => {
    if (state.username) {
      addToPreviousSessions(gameId, state.session.name, state.username);
    }
  }, [state.username, gameId, state.session.name]);

  const columns: ColumnContent[] = useMemo(
    () => [
      {
        type: PostType.Well,
        posts: state.session.posts.filter(p => p.postType === PostType.Well),
        icon: SentimentSatisfied,
        label: translations.PostBoard.wellQuestion,
        color: '#E8F5E9',
      },
      {
        type: PostType.NotWell,
        posts: state.session.posts.filter(p => p.postType === PostType.NotWell),
        icon: SentimentVeryDissatisfied,
        label: translations.PostBoard.notWellQuestion,
        color: '#FFEBEE',
      },
      {
        type: PostType.Ideas,
        posts: state.session.posts.filter(p => p.postType === PostType.Ideas),
        icon: WbSunny,
        label: translations.PostBoard.ideasQuestion,
        color: '#FFFDE7',
      },
    ],
    [state.session.posts, languageContext.language, gameId]
  );

  return (
    <div>
      {service && !summaryMode && (
        <GameMode service={service} columns={columns} />
      )}
      {service && summaryMode && (
        <SummaryMode service={service} columns={columns} />
      )}
    </div>
  );
}

export default withRouter(GamePage);
