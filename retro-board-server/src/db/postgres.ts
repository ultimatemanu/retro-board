import { Store } from '../types';
import { Session as ISession } from 'retro-board-common';
import 'reflect-metadata';
import { createConnection, Connection, Repository } from 'typeorm';
import { Session } from '../entity/Session';
import { User } from '../entity/User';
import { Post } from '../entity/Post';

const get = (connection: Connection, repository: Repository<Session>) => async (
  sessionId: string
): Promise<ISession | null> => {
  const dbSession = await repository.findOne(sessionId);
  if (dbSession) {
    return {
      id: dbSession.id,
      name: dbSession.name,
      posts: (dbSession.posts || []).map(dbPost => {
        return {
          id: dbPost.id,
          content: dbPost.content,
          postType: dbPost.postType,
          likes: dbPost.likes || [],
          dislikes: dbPost.dislikes || [],
          user: dbPost.user,
        };
      }),
    };
  }

  return null;
};

const set = (connection: Connection, repository: Repository<Session>) => async (
  session: Session
) => {
  return Promise.resolve({});
};

export default async function db() {
  const connection = await createConnection({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'antoine',
    password: '',
    database: 'retrospected',
    entities: [Session, Post, User],
    synchronize: true,
    logging: ['query'],
  });
  const sessionRepository = connection.getRepository(Session);
  const store: Store = {
    get: get(connection, sessionRepository),
    set: set(connection, sessionRepository),
  };
  return store;
  // return new Promise<Store>(resolve => {
  //   store.once('open', () => {
  //     resolve({
  //       get: get(),
  //       set: set(),
  //     });
  //   });
  // });
}
