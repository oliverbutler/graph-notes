import {
  addNewBlankPage,
  updateBlockParent,
  deleteBlock,
  getAllPages,
} from 'db';
import { Dispatch } from 'redux';
import { IAppState } from 'redux/reducers';
import {
  IChangePageAction,
  IChangeUpdatePageAction,
  ICreatePageAction,
  IDeletePageAction,
  IFetchAllPagesAction,
} from 'redux/reducers/pages';
import { Block, BlockObjectType } from 'types/block';

// * ALL changes to the state + DB must go through these actions to ensure consistency
// React Thunk logic inspired from
// https://www.carlrippon.com/strongly-typed-react-redux-code-with-typescript/

/**
 * Change current page, NOT async, performs immediately
 *
 * @param pageId
 * @returns
 */
const changeCurrentPage = (pageId: string | null) => {
  return (dispatch: Dispatch) => {
    const changePageAction: IChangePageAction = {
      type: 'ChangePageAction',
      pageId,
    };

    return dispatch(changePageAction);
  };
};

/**
 * Thunk action to fetch all root blocks and then save to the store
 *
 * @returns
 */
function fetchAllPagesActionCreator() {
  return async (dispatch: Dispatch) => {
    const pages = await getAllPages();

    const fetchAllPagesAction: IFetchAllPagesAction = {
      type: 'FetchAllPages',
      pages,
    };

    return dispatch(fetchAllPagesAction);
  };
}

/**
 * Create a new page with a given parent (or root) and update the page state
 *
 * @param parentId
 * @returns
 */
function createPageActionCreator(parentId: string | null) {
  return async (dispatch: Dispatch) => {
    const page = await addNewBlankPage(parentId);

    const createPageAction: ICreatePageAction = {
      type: 'CreatePageAction',
      page,
    };

    changeCurrentPage(page.id);

    return dispatch(createPageAction);
  };
}

/**
 * Delete a page from the DB and state
 *
 * @param pageId
 * @returns
 */
function deletePageActionCreator(pageId: string) {
  return async (dispatch: Dispatch, getState: () => IAppState) => {
    const { currentPage } = getState().pageState;

    // if we are currently on this page, change pages! 🐇
    if (pageId === currentPage) {
      const firstPageInState = getState().pageState.pages.find((p) => {
        return p.id !== currentPage && p.object === BlockObjectType.Page;
      });

      if (firstPageInState) changeCurrentPage(firstPageInState.id);
      else changeCurrentPage(null);
    }

    await deleteBlock(pageId);

    const deletePageAction: IDeletePageAction = {
      type: 'DeletePageAction',
      pageId,
    };

    return dispatch(deletePageAction);
  };
}

/**
 * Change the parent of a page in the DB then update that page within the Redux state,
 * luckily as we have no backlinks (Currently) we can just find and replace the
 *
 * @param pageId
 * @param newParent
 * @returns
 */
function changeBlockParent(pageId: string, newParentId: string | null) {
  return async (dispatch: Dispatch) => {
    const block = await updateBlockParent(pageId, newParentId);

    const updatePageAction: IChangeUpdatePageAction = {
      type: 'ChangeUpdatePageAction',
      page: block,
    };

    return dispatch(updatePageAction);
  };
}

export default {
  fetchAllPagesActionCreator,
  createPageActionCreator,
  deletePageActionCreator,
  changeCurrentPage,
  changeBlockParent,
};
