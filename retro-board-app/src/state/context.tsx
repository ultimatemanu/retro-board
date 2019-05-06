import React, {
  useContext,
  useReducer,
  createContext,
  useMemo,
  SFC,
} from 'react';
import { State, Action } from './types';
import reducer from './reducer';
import {
  togglePanel,
  login,
  logout,
  setPlayers,
  setSession,
  toggleSummaryMode,
} from './actions';

export const initialState: State = {
  panelOpen: false,
  username: null,
  players: [],
  summaryMode: false,
  session: {
    id: '',
    name: '',
    posts: [],
  },
};

const Context = createContext({
  state: initialState,
  dispatch: (action: Action) => {},
});

interface ProviderProps {
  initialState?: State;
}

export const Provider: SFC<ProviderProps> = props => {
  const [state, dispatch] = useReducer(
    reducer,
    props.initialState ? props.initialState : initialState
  );
  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);
  return <Context.Provider value={value}>{props.children}</Context.Provider>;
};

export function useGlobalState() {
  const { state, dispatch } = useContext(Context);
  const globalState = useMemo(() => {
    return {
      state,
      togglePanel: togglePanel(dispatch),
      login: login(dispatch),
      logout: logout(dispatch),
      setPlayers: setPlayers(dispatch),
      setSession: setSession(dispatch),
      toggleSummaryMode: toggleSummaryMode(dispatch),
    };
  }, [state, dispatch]);

  return globalState;
}
