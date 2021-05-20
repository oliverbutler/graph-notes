import { Action } from 'redux';
import _ from 'lodash';

export interface IFolderState {
  readonly folders: Record<string,
}

const initialFolderState: IFolderState = {
  pages: {},
  currentPage: null,
};

function pagesReducer(
  state = initialPageState,
  action: PageActions
): IPageState {
  console.info(`✅ ${action.type}`, action);
  switch (action.type) {
    case 'FetchAllPages':
      return {
        ...state,
        pages: action.pages,
      };
    case 'CreatePageAction':
      return {
        ...state,
        pages: {},
      };
    case 'DeletePageAction':
      return {
        ...state,
        pages: state.currentPage
          ? _.omit(state.pages, [state.currentPage])
          : state.pages,
      };
    case 'ChangePageAction':
      return {
        ...state,
        currentPage: action.pageId,
      };
    case 'ChangeUpdatePageAction':
      return {
        ...state,
        pages: {
          ...state.pages,
          [action.page.id]: action.page,
        },
      };
    default:
      return state;
  }
}

export default pagesReducer;
