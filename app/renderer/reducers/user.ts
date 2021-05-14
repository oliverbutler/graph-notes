import { handleActions } from 'redux-actions';
import actions from '../actions/page';

export default handleActions(
  {
    [actions.create]: (state, action) => {
      return { ...state, ...action.payload };
    },
    [actions.delete]: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
  {},
);
