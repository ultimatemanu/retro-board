import React, { useContext } from 'react';
import useGlobalState from '../state';

// {
//   "Hello": [
//     {
//       "id": "3wi6W9hp8",
//       "lastJoin": 1551390530271
//     },
//     {
//       "id": "scRJu6qz5",
//       "lastJoin": 1551600101140,
//       "name": null
//     }
//   ]
// }

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
  console.log('ATPS: ', id, name);
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
