import { Dispatch } from './types';
import { Session } from 'retro-board-common';

export const TOGGLE_PANEL = 'retrospected/panel/toggle';
export const LOGIN = 'retrospected/user/login';
export const LOGOUT = 'retrospected/user/logout';
export const SET_PLAYERS = 'retrospected/game/players/set';
export const SET_SESSION = 'retrospected/game/session/set';
export const TOGGLE_SUMMARY_MODE =
  'retrospected/game/session/summary-mode/toggle';

const createAction = (type: string, payload?: any) => ({
  type,
  payload,
});

export const togglePanel = (dispatch: Dispatch) => () => {
  dispatch(createAction(TOGGLE_PANEL));
};

export const login = (dispatch: Dispatch) => (username: string) => {
  dispatch(createAction(LOGIN, username));
};

export const logout = (dispatch: Dispatch) => () => {
  dispatch(createAction(LOGOUT));
};

export const setPlayers = (dispatch: Dispatch) => (players: string[]) => {
  dispatch(createAction(SET_PLAYERS, players));
};

export const setSession = (dispatch: Dispatch) => (session: Session) => {
  dispatch(createAction(SET_SESSION, session));
};

export const toggleSummaryMode = (dispatch: Dispatch) => () => {
  dispatch(createAction(TOGGLE_SUMMARY_MODE));
};
