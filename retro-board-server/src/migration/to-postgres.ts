console.log('Migrating NeDB to Postgres');
import 'reflect-metadata';
import { find } from 'lodash';
import { Session, User, Post } from '../db/entities';
import { getDb } from '../db/postgres';
import { LegacySession as ISession } from 'retro-board-common';
import Datastore from 'nedb';
import path from 'path';
import { v4 } from 'uuid';

const dbFile = path.resolve(__dirname, '..', 'persist', 'db');

getDb(true)
  .then(async connection => {
    const sessionRepository = connection.getRepository(Session);
    const userRepository = connection.getRepository(User);
    const postRepository = connection.getRepository(Post);
    await connection.dropDatabase();
    await connection.synchronize();

    const store = new Datastore({ filename: dbFile, autoload: true });
    store.find({}, async (err: any, sessions: ISession[]) => {
      console.log('Sessions; ', sessions.length);
      const l = sessions.length;
      for (let k = 0; k < l; k++) {
        console.log(k, 'out of', l);
        await persistSession(sessions[k]);
      }
    });

    async function getOrCreateUser(name: string, users: User[]) {
      let user = find(users, u => u.name === name);
      if (!user) {
        user = new User(v4(), name);
        await userRepository.save(user);
        users.push(user);
      }
      return user;
    }

    async function persistSession(session: ISession) {
      console.log('Persisting Session ', session.id);
      const dbSession = new Session(session.id, session.name || '');
      const users: User[] = [];
      await sessionRepository.save(dbSession);
      for (let i = 0; i < session.posts.length; i++) {
        const post = session.posts[i];

        const author = await getOrCreateUser(post.user || '', users);
        const dbPost = new Post(
          post.id,
          dbSession,
          post.postType,
          post.content,
          author
        );
        dbPost.likes = [];
        dbPost.dislikes = [];

        for (let j = 0; j < post.likes.length; j++) {
          const like = post.likes[j] || 'unknown';
          let user = await getOrCreateUser(like, users);
          if (!find(dbPost.likes, u => u.name === like)) {
            dbPost.likes.push(user);
          }
        }
        for (let j = 0; j < post.dislikes.length; j++) {
          const dislike = post.dislikes[j] || 'unknown';
          let user = await getOrCreateUser(dislike, users);
          if (!find(dbPost.dislikes, u => u.name === dislike)) {
            dbPost.dislikes.push(user);
          }
        }
        await postRepository.save(dbPost);
        console.log(' ==> done');
      }
    }
  })
  .catch(error => console.log(error));
