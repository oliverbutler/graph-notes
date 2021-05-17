import { Action } from 'redux';
import { Block } from 'types/block';

export interface IPageState {
  readonly pages: Block[];
  readonly currentPage: string | null;
}

const initialPageState: IPageState = {
  pages: [],
  currentPage: null,
};

export interface IFetchAllPagesAction extends Action<'FetchAllPages'> {
  pages: Block[];
}

export interface ICreatePageAction extends Action<'CreatePageAction'> {
  page: Block;
}
export interface IDeletePageAction extends Action<'DeletePageAction'> {
  pageId: string;
}

export interface IChangePageAction extends Action<'ChangePageAction'> {
  pageId: string | null;
}

export interface IChangeUpdatePageAction
  extends Action<'ChangeUpdatePageAction'> {
  page: Block;
}

export type PageActions =
  | IFetchAllPagesAction
  | ICreatePageAction
  | IDeletePageAction
  | IChangePageAction
  | IChangeUpdatePageAction;

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
        pages: [...state.pages, action.page],
      };
    case 'DeletePageAction':
      return {
        ...state,
        pages: state.pages.filter((p) => p.id !== action.pageId),
      };
    case 'ChangePageAction':
      return {
        ...state,
        currentPage: action.pageId,
      };
    case 'ChangeUpdatePageAction':
      return {
        ...state,
        pages: state.pages.map((p) => {
          if (p.id === action.page.id) return action.page;
          else return p;
        }),
      };
    default:
      return state;
  }
}

export default pagesReducer;
