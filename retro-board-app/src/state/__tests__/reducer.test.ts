import 'jest';
import reducer from '../reducer';
import { State, Action } from '../types';
import {
  TOGGLE_PANEL,
  TOGGLE_SUMMARY_MODE,
  LOGIN,
  LOGOUT,
  SET_PLAYERS,
  SET_SESSION,
} from '../actions';

describe('Global state reducer', () => {
  let state: State;
  beforeEach(() => {
    state = {
      panelOpen: false,
      players: [],
      session: {
        id: '1',
        name: '',
        posts: [],
      },
      summaryMode: false,
      username: 'Alice',
    };
  });
  it('Should toggle the panel on TOGGLE_PANEL', () => {
    state = reducer(state, { type: TOGGLE_PANEL });
    expect(state.panelOpen).toBe(true);
    state = reducer(state, { type: TOGGLE_PANEL });
    expect(state.panelOpen).toBe(false);
    state = reducer(state, { type: TOGGLE_PANEL });
    expect(state.panelOpen).toBe(true);
  });

  it('Should toggle the summary mode on TOGGLE_SUMMARY_MODE', () => {
    state = reducer(state, { type: TOGGLE_SUMMARY_MODE });
    expect(state.summaryMode).toBe(true);
    state = reducer(state, { type: TOGGLE_SUMMARY_MODE });
    expect(state.summaryMode).toBe(false);
    state = reducer(state, { type: TOGGLE_SUMMARY_MODE });
    expect(state.summaryMode).toBe(true);
  });

  it('Should update the username on login', () => {
    state = reducer(state, { type: LOGIN, payload: 'Bob' });
    expect(state.username).toBe('Bob');
  });

  it('Should clear the username on logout', () => {
    state = reducer(state, { type: LOGIN, payload: 'Bob' });
    expect(state.username).toBe('Bob');
    state = reducer(state, { type: LOGOUT });
    expect(state.username).toBe(null);
  });

  it('Should set the players on SET_PLAYERS', () => {
    state = reducer(state, { type: SET_PLAYERS, payload: ['Alice', 'Bob'] });
    expect(state.players).toEqual(['Alice', 'Bob']);
  });

  it('Should set the session on SET_SESSION', () => {
    state = reducer(state, {
      type: SET_SESSION,
      payload: {
        id: '2',
        name: 'Session 2',
        posts: [],
      },
    });
    expect(state.session).toEqual({
      id: '2',
      name: 'Session 2',
      posts: [],
    });
  });
});
