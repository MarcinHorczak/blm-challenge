import { applyMiddleware, createStore, Store } from 'redux';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { reducer } from './rootReducer';

const sagaMiddleware: SagaMiddleware<{}> = createSagaMiddleware();

export const store: Store = createStore(
    reducer,
    applyMiddleware(
        sagaMiddleware,
    ),
);
