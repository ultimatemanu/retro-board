import useGlobalState from '../state';

interface SessionStore {
  [username: string]: Session[];
}

interface Session {
  id: string;
  lastJoin: number;
  name?: string;
}

function getPreviousSessions(username: string | null): Session[] {
  if (!username) {
    return [];
  }

  const store = getStore();
  return store[username] || [];
}

function getStore(): SessionStore {
  const item = localStorage.getItem('sessions');
  if (item) {
    const store = JSON.parse(item) as SessionStore;
    return store || {};
  }

  return {};
}

function addToPreviousSessions(id: string, name: string, username: string) {
  const store = getStore();
  const sessions = store[username] || [];
  const currentIndex = sessions.findIndex(session => session.id === id);
  const newSession: Session = {
    id,
    name,
    lastJoin: new Date().valueOf(),
  };
  if (currentIndex === -1) {
    sessions.push(newSession);
  } else {
    sessions.splice(currentIndex, 1);
    sessions.push(newSession);
  }
  const newStore = {
    ...store,
    [username]: sessions,
  };
  localStorage.setItem('sessions', JSON.stringify(newStore));
}

export default () => {
  const { state } = useGlobalState();

  const previousSessions = getPreviousSessions(state.username);
  return { previousSessions, addToPreviousSessions };
};
