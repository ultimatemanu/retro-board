import { createAction } from 'redux-actions';

export const CREATE_SESSION = 'CREATE_SESSION';
export const CREATE_SESSION_SUCCESS = 'CREATE_SESSION_SUCCESS';
export const AUTO_JOIN = 'AUTO_JOIN';
export const JOIN_SESSION = 'JOIN_SESSION';
export const LEAVE_SESSION = 'LEAVE_SESSION';
export const RECEIVE_CLIENT_LIST = 'RECEIVE_CLIENT_LIST';
export const CHECK_EXISTENCE = 'CHECK_EXISTENCE';
export const CHECK_EXISTENCE_PENDING = 'CHECK_EXISTENCE_PENDING';
export const CHECK_EXISTENCE_SUCCESS = 'CHECK_EXISTENCE_SUCCESS';

export default function reducer(state = {
    id: null,
    newSessionName: '',
    newSessionExists: null,
    newSessionExistsPending: false,
    clients: []
} , action) {
    switch (action.type) {
        case CREATE_SESSION_SUCCESS:
        case JOIN_SESSION:
            return {
                ...state,
                id: action.payload.sessionId,
            };
        case RECEIVE_CLIENT_LIST:
            return {
                ...state,
                clients: action.payload
            }
        case LEAVE_SESSION:
            return {
                ...state,
                id: null,
                clients: []
            };
        case CHECK_EXISTENCE_PENDING:
            return {
                ...state,
                newSessionExistsPending: true,
                newSessionExists: null,
                newSessionName: action.payload.name
            };
        case CHECK_EXISTENCE_SUCCESS:
            return {
                ...state,
                newSessionExistsPending: false,
                newSessionExists: action.payload.exists,
                newSessionName: action.payload.name
            };
        default:
            return state;
    }
}

export const checkExistence = createAction(CHECK_EXISTENCE);
export const createSession = createAction(CREATE_SESSION);
export const leave = createAction(LEAVE_SESSION);
export const autoJoin = createAction(AUTO_JOIN);
