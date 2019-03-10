import 'jest';
import { Actions } from 'retro-board-common';
import GameEngine from '../GameEngine';
import { State } from '../../../state/types';

type CallbackDictionary = {
  [key: string]: Function;
};

class FakeSocket {
  public callbacks: CallbackDictionary = {};
  public on(event: string, fn: Function): SocketIOClient.Emitter {
    this.callbacks[event] = fn;
    return (null as unknown) as SocketIOClient.Emitter;
  }
  public disconnect(): SocketIOClient.Socket {
    return (this as unknown) as SocketIOClient.Socket;
  }
  public emit(event: string, ...args: any[]): SocketIOClient.Socket {
    return (this as unknown) as SocketIOClient.Socket;
  }

  public simulateOn(event: string, payload: any) {
    if (this.callbacks[event]) {
      this.callbacks[event](payload);
    }
  }
}

describe('Game Engine', () => {
  let gameEngine: GameEngine;
  let socket: FakeSocket;
  let state: State = {
    panelOpen: false,
    players: ['Alice', 'Bob', 'Charlie'],
    summaryMode: false,
    username: 'test_user',
    session: {
      id: '1',
      name: 'Test Session',
      posts: [],
    },
  };
  let setSession = jest.fn();
  let setPlayers = jest.fn();
  let getState = jest.fn(() => state);
  let socketDisconnect = jest.spyOn(FakeSocket.prototype, 'disconnect');
  beforeEach(() => {
    socketDisconnect.mockClear();
    socket = new FakeSocket();
    gameEngine = new GameEngine(
      socket,
      setSession,
      setPlayers,
      getState,
      '1',
      'Alice'
    );
  });
  it('Should listen to all the necessary SocketIO events', () => {
    expect(Object.keys(socket.callbacks)).toHaveLength(9);
    expect(socket.callbacks['connect']).not.toBeUndefined();
    expect(socket.callbacks['disconnect']).not.toBeUndefined();
    expect(socket.callbacks[Actions.RECEIVE_BOARD]).not.toBeUndefined();
    expect(socket.callbacks[Actions.RECEIVE_CLIENT_LIST]).not.toBeUndefined();
    expect(socket.callbacks[Actions.RECEIVE_DELETE_POST]).not.toBeUndefined();
    expect(socket.callbacks[Actions.RECEIVE_EDIT_POST]).not.toBeUndefined();
    expect(socket.callbacks[Actions.RECEIVE_LIKE]).not.toBeUndefined();
    expect(socket.callbacks[Actions.RECEIVE_POST]).not.toBeUndefined();
    expect(socket.callbacks[Actions.RECEIVE_SESSION_NAME]).not.toBeUndefined();
  });

  it('When disconnecting, it should disconnect the socket and reset the state', () => {
    gameEngine.disconnect();
    expect(socketDisconnect).toHaveBeenCalled();
    expect(setSession).toHaveBeenCalledWith({
      posts: [],
      name: '',
      id: '',
    });
  });
});
