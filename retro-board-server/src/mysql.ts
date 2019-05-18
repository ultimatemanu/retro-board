console.log('MySQL Test');
import 'reflect-metadata';
import { find } from 'lodash';
import { createConnection } from 'typeorm';
import { Session } from './entity/Session';
import { User } from './entity/User';
import { Post } from './entity/Post';
import { PostType } from '../../retro-board-common/dist';
import { Session as ISession } from 'retro-board-common';
import db from './db';
import Datastore from 'nedb';
import path from 'path';
import { v4 } from 'uuid';

const dbFile = path.resolve(__dirname, '.', 'persist', 'db');

createConnection({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'antoine',
  password: '',
  database: 'retrospected',
  entities: [Session, Post, User],
  synchronize: true,
  logging: false,
})
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
      // persistSession(sessions[0]);
      // persistSession(sessions[1]);
      // persistSession(sessions[2]);
    });

    // here you can start to work with your entities

    async function persistSession(session: ISession) {
      // // const antoine = new User();
      // // antoine.id = v4();
      // // antoine.name = session.
      // await userRepository.save(antoine);
      console.log('Persisting Session ', session.id);
      const dbSession = new Session();
      dbSession.id = session.id;
      dbSession.name = session.name || '';
      await sessionRepository.save(dbSession);
      // console.log(' ==> session saved');
      for (let i = 0; i < session.posts.length; i++) {
        const post = session.posts[i];
        const users: User[] = [];

        const author = new User();
        author.id = v4();
        author.name = post.user || '';
        await userRepository.save(author);
        // console.log(' ==> author saved');
        users.push(author);

        const dbPost = new Post(author, dbSession);
        dbPost.content = post.content;
        dbPost.id = post.id;
        dbPost.postType = post.postType;
        dbPost.likes = [];
        dbPost.dislikes = [];

        for (let j = 0; j < post.likes.length; j++) {
          const like = post.likes[j] || 'unknown';
          // console.log(' ==> likes ', j, post.likes.length);
          let user = find(users, u => u.name === like);
          if (!user) {
            user = new User();
            user.id = v4();
            user.name = like;
            await userRepository.save(user);
            // console.log(' ==> new user saved');
            users.push(user);
          }
          if (!find(dbPost.likes, u => u.name === like)) {
            dbPost.likes.push(user);
          }
        }
        for (let j = 0; j < post.dislikes.length; j++) {
          const dislike = post.dislikes[j] || 'unknown';
          // console.log(' ==> dislikes ', j, post.likes.length);
          let user = find(users, u => u.name === dislike);
          if (!user) {
            user = new User();
            user.id = v4();
            user.name = dislike;
            await userRepository.save(user);
            // console.log(' ==> new user saved');
            users.push(user);
          }
          if (!find(dbPost.dislikes, u => u.name === dislike)) {
            dbPost.dislikes.push(user);
          }
        }
        // console.log(' ==> saving post');
        await postRepository.save(dbPost);
        console.log(' ==> done');
        // post.content = 'Great';
        // post.id = 'foo';
        // post.postType = PostType.Ideas;
        // await postRepository.save(post);
        // post.likes = [antoine];
        // await postRepository.save(post);
      }
      // const post = new Post(antoine, dbSession);
      // post.content = 'Great';
      // post.id = 'foo';
      // post.postType = PostType.Ideas;
      // await postRepository.save(post);
      // post.likes = [antoine];
      // await postRepository.save(post);
      // console.log('created');
    }
  })
  .catch(error => console.log(error));
