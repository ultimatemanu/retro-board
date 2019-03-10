import { Actions, Session, Post, PostType } from 'retro-board-common';
import { v4 } from 'uuid';
import { trackEvent } from './../../track';
import findIndex from 'lodash/findIndex';
import uniq from 'lodash/uniq';
import { State } from '../../state/types';

interface Socket extends Partial<SocketIOClient.Socket> {
  on(event: string, fn: Function): SocketIOClient.Emitter;
  disconnect(): SocketIOClient.Socket;
  emit(event: string, ...args: any[]): SocketIOClient.Socket;
}

export default class GameEngine {
  constructor(
    private socket: Socket,
    private setSession: (session: Session) => void,
    private setPlayers: (players: string[]) => void,
    private getState: () => State,
    private sessionId: string,
    private user: string | null
  ) {
    socket.on('disconnect', () => {
      console.warn('Server disconnected');
      //store.dispatch({ type: LEAVE_SESSION });
    });

    socket.on('connect', () => {
      console.log('Connected');
      this.send(Actions.LOGIN_SUCCESS);
      this.send(Actions.JOIN_SESSION);
      trackEvent(Actions.JOIN_SESSION);
    });

    socket.on(Actions.RECEIVE_CLIENT_LIST, (clients: string[]) => {
      console.log('Client list: ', clients);
      this.setPlayers(clients);
    });

    socket.on(Actions.RECEIVE_BOARD, (board: Post[]) => {
      console.log('Receive board: ', board);
      this.setSession({
        ...this.state.session,
        posts: board,
      });
    });

    socket.on(Actions.RECEIVE_POST, (post: Post) => {
      console.log('Receive post: ', post);
      this.setSession({
        ...this.state.session,
        posts: [...this.state.session.posts, post],
      });
    });

    socket.on(Actions.RECEIVE_DELETE_POST, (post: Post) => {
      console.log('Delete post: ', post);
      this.setSession({
        ...this.state.session,
        posts: this.state.session.posts.filter(p => p.id !== post.id),
      });
    });

    socket.on(Actions.RECEIVE_LIKE, (post: Post) => {
      console.log('Receive like: ', post);
      this.updatePost(post);
    });

    socket.on(Actions.RECEIVE_SESSION_NAME, (name: string) => {
      console.log('Receive session name: ', name);
      this.setSession({
        ...this.state.session,
        name,
      });
    });

    socket.on(Actions.RECEIVE_EDIT_POST, (post: { post: Post }) => {
      console.log('Receive edit post: ', post.post);
      this.updatePost(post.post);
    });
  }

  public get state(): State {
    return this.getState();
  }

  public init(
    setSession: (session: Session) => void,
    setPlayers: (players: string[]) => void,
    getState: () => State
  ) {
    this.setSession = setSession;
    this.setPlayers = setPlayers;
    this.getState = getState;
  }

  public disconnect() {
    console.log('Disconnect from App');
    this.socket.disconnect();
    this.setSession({
      posts: [],
      name: '',
      id: '',
    });
  }

  private send(action: string, payload?: any) {
    if (this.socket && this.user) {
      this.socket.emit(action, {
        sessionId: this.sessionId,
        payload: {
          user: this.user,
          ...payload,
        },
      });
    }
  }

  public addPost(type: PostType, content: string) {
    const post: Post = {
      content,
      dislikes: [],
      likes: [],
      id: v4(),
      postType: type,
      user: this.user!,
    };
    this.setSession({
      ...this.state.session,
      posts: [...this.state.session.posts, post],
    });
    this.send(Actions.ADD_POST_SUCCESS, post);
    trackEvent(Actions.ADD_POST_SUCCESS);
  }

  public editPost(post: Post) {
    this.updatePost(post);
    this.send(Actions.EDIT_POST, { post });
    trackEvent(Actions.EDIT_POST);
  }

  public deletePost(post: Post) {
    this.setSession({
      ...this.state.session,
      posts: this.state.session.posts.filter(p => p.id !== post.id),
    });
    this.send(Actions.DELETE_POST, post);
    trackEvent(Actions.DELETE_POST);
  }

  public like(post: Post, like: boolean) {
    const likes = like ? uniq(post.likes.concat([this.user!])) : post.likes;
    const dislikes = !like
      ? uniq(post.dislikes.concat([this.user!]))
      : post.dislikes;
    const modifiedPost: Post = {
      ...post,
      likes,
      dislikes,
    };
    this.updatePost(modifiedPost);
    this.send(Actions.LIKE_SUCCESS, {
      like,
      post,
    });
    trackEvent(Actions.LIKE_SUCCESS);
  }

  public renameSession(name: string) {
    this.setSession({
      ...this.state.session,
      name,
    });
    this.send(Actions.RENAME_SESSION, { name });
    trackEvent(Actions.RENAME_SESSION);
  }

  private updatePost(post: Post) {
    const index = findIndex(this.state.session.posts, p => p.id === post.id);
    this.setSession({
      ...this.state.session,
      posts: [
        ...this.state.session.posts.slice(0, index),
        post,
        ...this.state.session.posts.slice(index + 1),
      ],
    });
  }
}
