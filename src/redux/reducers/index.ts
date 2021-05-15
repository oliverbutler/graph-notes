import { applyMiddleware, combineReducers, createStore, Store } from 'redux';
import thunk from 'redux-thunk';
import pagesReducer, { IPageState } from './pages';

export interface IAppState {
  readonly pageState: IPageState;
}

const rootReducer = combineReducers<IAppState>({
  pageState: pagesReducer,
});

// Configure a store
export function configureStore(): Store<IAppState> {
  const store = createStore(rootReducer, undefined, applyMiddleware(thunk));
  return store;
}

export default rootReducer;
