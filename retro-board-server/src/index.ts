import express from 'express';
import path from 'path';
import socketIo from 'socket.io';
import http from 'http';
import { find } from 'lodash';
import chalk from 'chalk';
import moment from 'moment';
import db from './db';
import { Actions, Session, Post } from 'retro-board-common';

const {
  RECEIVE_POST,
  RECEIVE_BOARD,
  RECEIVE_DELETE_POST,
  RECEIVE_LIKE,
  RECEIVE_EDIT_POST,
  ADD_POST_SUCCESS,
  DELETE_POST,
  LIKE_SUCCESS,
  EDIT_POST,
  RECEIVE_CLIENT_LIST,
  RECEIVE_SESSION_NAME,
  JOIN_SESSION,
  RENAME_SESSION,
  LEAVE_SESSION,
  LOGIN_SUCCESS,
} = Actions;

const app = express();
const httpServer = new http.Server(app);
const io = socketIo(httpServer);
const port = process.env.PORT || 8081;
const htmlFile =
  process.env.NODE_ENV === 'production'
    ? path.resolve(__dirname, '..', 'assets', 'index.html')
    : path.resolve(__dirname, '..', 'content', 'index.html');
const assetsFolder = path.resolve(__dirname, '..', 'assets');
const staticFolder = path.resolve(__dirname, '..', 'static');

const g = chalk.green.bind(chalk);
const b = chalk.blue.bind(chalk);
const gr = chalk.grey.bind(chalk);
const r = chalk.red.bind(chalk);
const y = chalk.yellow.bind(chalk);
const s = (str: string) => b`${str.replace('retrospected/', '')}`;

interface ExtendedSocket extends socketIo.Socket {
  sessionId: string;
}

interface Users {
  [socketId: string]: string | null;
}

interface UserData {
  user: string;
}

interface NameData extends UserData {
  name: string;
}

interface PostUpdate extends UserData {
  post: Post;
}

interface LikeUpdate extends PostUpdate {
  like: boolean;
}

db().then(store => {
  const users: Users = {};
  const d = () => y`[${moment().format('HH:mm:ss')}]`;

  const getRoom = (sessionId: string) => `board-${sessionId}`;

  const sendToAll = (
    socket: ExtendedSocket,
    sessionId: string,
    action: string,
    data: any
  ) => {
    console.log(
      `${d()}${g` ==> `} ${s(action)} ${gr`${JSON.stringify(data)}`}`
    );
    socket.broadcast.to(getRoom(sessionId)).emit(action, data);
  };

  const sendToSelf = (socket: ExtendedSocket, action: string, data: any) => {
    console.log(
      `${d()}${g` ==> `} ${s(action)} ${gr`${JSON.stringify(data)}`}`
    );
    socket.emit(action, data);
  };

  const persist = (session: Session) =>
    store.set(session).catch((err: string) => console.error(err));

  const sendClientList = (sessionId: string, socket: ExtendedSocket) => {
    const room = io.nsps['/'].adapter.rooms[getRoom(sessionId)];
    if (room) {
      const clients = Object.keys(room.sockets);
      const names = clients.map((id, i) => users[id] || `(Anonymous #${i})`);

      sendToSelf(socket, RECEIVE_CLIENT_LIST, names);
      sendToAll(socket, sessionId, RECEIVE_CLIENT_LIST, names);
    }
  };

  const recordUser = (
    sessionId: string,
    name: string,
    socket: ExtendedSocket
  ) => {
    const socketId = socket.id;
    if (!users[socketId] || users[socketId] !== name) {
      users[socketId] = name || null;
    }

    sendClientList(sessionId, socket);
  };

  const receivePost = (
    session: Session,
    data: Post,
    socket: ExtendedSocket
  ) => {
    session.posts.push(data);
    persist(session);
    sendToAll(socket, session.id, RECEIVE_POST, data);
  };

  const joinSession = (
    session: Session,
    data: UserData,
    socket: ExtendedSocket
  ) => {
    socket.join(getRoom(session.id), () => {
      socket.sessionId = session.id;
      if (session.posts.length) {
        sendToSelf(socket, RECEIVE_BOARD, session.posts);
      }
      if (session.name) {
        sendToSelf(socket, RECEIVE_SESSION_NAME, session.name);
      }

      recordUser(session.id, data.user, socket);
    });
  };

  const renameSession = (
    session: Session,
    data: NameData,
    socket: ExtendedSocket
  ) => {
    session.name = data.name;
    persist(session);
    sendToAll(socket, session.id, RECEIVE_SESSION_NAME, data.name);
  };

  const leave = (session: Session, _: void, socket: ExtendedSocket) => {
    socket.leave(getRoom(session.id), () => {
      sendClientList(session.id, socket);
    });
  };

  const login = (session: Session, data: UserData, socket: ExtendedSocket) => {
    console.log('login: ', data);
    recordUser(session.id, data.user, socket);
  };

  const deletePost = (session: Session, data: Post, socket: ExtendedSocket) => {
    session.posts = session.posts.filter(p => p.id !== data.id);
    persist(session);
    sendToAll(socket, session.id, RECEIVE_DELETE_POST, data);
  };

  const like = (session: Session, data: LikeUpdate, socket: ExtendedSocket) => {
    const post = find(session.posts, p => p.id === data.post.id);
    if (post) {
      console.log('Like: ', data);
      const array = data.like ? post.likes : post.dislikes;

      if (array.indexOf(data.user) === -1) {
        array.push(data.user);
        persist(session);
        sendToAll(socket, session.id, RECEIVE_LIKE, post);
      }
    }
  };

  const edit = (session: Session, data: PostUpdate, socket: ExtendedSocket) => {
    const post = find(session.posts, p => p.id === data.post.id);
    if (post) {
      post.content = data.post.content;
      persist(session);
      sendToAll(socket, session.id, RECEIVE_EDIT_POST, data);
    }
  };

  app.use('/assets', express.static(assetsFolder));
  app.use('/static', express.static(staticFolder));
  app.use(
    '/favicon.ico',
    express.static(path.resolve(staticFolder, 'favicon.ico'))
  );
  app.get('/*', (_, res) => res.sendFile(htmlFile));

  io.on('connection', (socket: ExtendedSocket) => {
    const ip =
      socket.handshake.headers['x-forwarded-for'] || socket.handshake.address;
    console.log(
      d() + b` Connection: ` + r`New user connected`,
      gr`${socket.id}`,
      gr(ip)
    );

    interface Action {
      type: string;
      handler: (session: Session, data: any, socket: ExtendedSocket) => void;
    }

    const actions: Action[] = [
      { type: ADD_POST_SUCCESS, handler: receivePost },
      { type: JOIN_SESSION, handler: joinSession },
      { type: RENAME_SESSION, handler: renameSession },
      { type: DELETE_POST, handler: deletePost },
      { type: LIKE_SUCCESS, handler: like },
      { type: EDIT_POST, handler: edit },
      { type: LOGIN_SUCCESS, handler: login },
      { type: LEAVE_SESSION, handler: leave },
    ];

    actions.forEach(action => {
      socket.on(action.type, data => {
        console.log(
          d() + r` <--  ` + s(action.type),
          gr`${JSON.stringify(data)}`
        );
        const sid =
          action.type === LEAVE_SESSION ? socket.sessionId : data.sessionId;
        if (sid) {
          store.get(sid).then((session: Session) => {
            action.handler(session, data.payload, socket);
          });
        }
      });
    });

    socket.on('disconnect', () => {
      if (socket.sessionId) {
        console.log(
          d() + b` Disconnection: ` + r`User left`,
          gr`${socket.id}`,
          gr(ip)
        );
        sendClientList(socket.sessionId, socket);
      }
    });
  });

  httpServer.listen(port);
  const env = process.env.NODE_ENV || 'dev';
  console.log(
    `Server started on port ${r`${port.toString()}`}, environement: ${b`${env}`}`
  );
});
