import { applyMiddleware, createStore, Store } from 'redux';
import thunk from 'redux-thunk';
import { reducer } from './rootReducer';

export const store: Store = createStore(
    reducer,
    applyMiddleware(
        thunk,
    ),
);
