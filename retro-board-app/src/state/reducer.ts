import { State, Action } from './types';
import {
  TOGGLE_PANEL,
  LOGIN,
  LOGOUT,
  SET_PLAYERS,
  SET_SESSION,
  TOGGLE_SUMMARY_MODE,
} from './actions';

export default (state: State, action: Action): State => {
  switch (action.type) {
    case TOGGLE_PANEL:
      return { ...state, panelOpen: !state.panelOpen };
    case LOGIN:
      return { ...state, username: action.payload };
    case LOGOUT:
      return { ...state, username: null };
    case SET_PLAYERS:
      return { ...state, players: action.payload };
    case SET_SESSION:
      return { ...state, session: action.payload };
    case TOGGLE_SUMMARY_MODE:
      return { ...state, summaryMode: !state.summaryMode };
    default:
      return state;
  }
};
