import mongoose from 'mongoose';
import config from './config';
import { Store } from '../types';
import { Session } from 'retro-board-common';

const sessionShema = new mongoose.Schema({
  name: String,
  id: {
    type: String,
    index: {
      unique: true,
    },
  },
  posts: [
    {
      id: {
        type: String,
        index: {
          unique: true,
        },
      },
      postType: String,
      content: String,
      user: String,
      likes: [String],
      dislikes: [String],
    },
  ],
});

const DbSession = mongoose.model('Session', sessionShema);

const get = () => (sessionId: string) =>
  new Promise((resolve, reject) => {
    DbSession.findOne({
      id: sessionId,
    })
      .lean()
      .exec((err, session) => {
        if (err) {
          console.error(err);
          reject(err);
        } else if (session) {
          resolve(session);
        } else {
          resolve({
            id: sessionId,
            name: null,
            posts: [],
          });
        }
      });
  });

const set = () => (session: Session) =>
  new Promise((resolve, reject) => {
    DbSession.findOneAndUpdate(
      {
        id: session.id,
      },
      session,
      {
        upsert: true,
      },
      err => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(session);
        }
      }
    );
  });

export default function db() {
  mongoose.connect(
    config.DB_Mongo_URL,
    {
      useNewUrlParser: true,
    }
  );
  mongoose.set('useCreateIndex', true);
  const store = mongoose.connection;
  return new Promise<Store>(resolve => {
    store.once('open', () => {
      resolve({
        get: get(),
        set: set(),
      });
    });
  });
}
