import { Action } from 'redux';
import { Block, BlockObjectType } from 'types/block';
import _ from 'lodash';

export interface IPage {
  id: string;
  parentId: string | null;

  // Sidebar properties
  isExpanded: boolean;
  isChildrenLoading: boolean;

  // Child Pages
  // hasChildPages: boolean;
  // childPages: string[];

  // Children
  hasChildren: boolean;
  children: string[];

  // Properties
  title?: string;
  emoji?: string;
}

export interface IPageState {
  readonly pages: Record<string, IPage>;
  readonly currentPage: string | null;
}

const initialPageState: IPageState = {
  pages: {},
  currentPage: null,
};

export interface IFetchAllPagesAction extends Action<'FetchAllPages'> {
  pages: Record<string, IPage>;
}

export interface ICreatePageAction extends Action<'CreatePageAction'> {
  page: IPage;
}
export interface IDeletePageAction extends Action<'DeletePageAction'> {
  pageId: string;
}

export interface IChangePageAction extends Action<'ChangePageAction'> {
  pageId: string | null;
}

export interface IChangeUpdatePageAction
  extends Action<'ChangeUpdatePageAction'> {
  page: IPage;
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
