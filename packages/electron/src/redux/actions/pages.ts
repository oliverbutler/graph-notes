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
  IPage,
  IPageState,
} from 'redux/reducers/pages';

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
    const blocks = await getAllPages();

    let pages: Record<string, IPage> = {};

    for (const block of blocks) {
      const findChildren = blocks
        .filter((b) => b.parentId === block.id)
        .map((b) => b.id);

      pages[block.id] = {
        id: block.id,
        parentId: block.parentId,

        // Populate this from local storage
        isExpanded: true,
        isChildrenLoading: false,

        hasChildren: findChildren.length > 0,
        children: findChildren,

        title: block.title,
        emoji: block.emoji,
      };
    }

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
  return async (dispatch: Dispatch, getState: () => IAppState) => {
    // To update a blocks parent we must
    // - Update it's current parent children[] <- Redux
    // - Update new parent children[] <- Redux
    // - Update the page itself <- Redux
    // - Update the page  <- DB

    const currentPageState = getState().pageState;

    // returns string array of all children
    const getChildrenForPage = (pageId: string): string[] => {
      return Object.keys(currentPageState.pages).filter(
        (id) => currentPageState.pages[id].parentId === pageId
      );
    };

    // Update the block in the DB
    const block = await updateBlockParent(pageId, newParentId);

    // New Block Children
    const newBlockChildren = getChildrenForPage(block.id);

    // Updated page entry
    const newPage: IPage = {
      id: block.id,
      parentId: block.parentId,

      // Populate this from local storage
      isExpanded: true,
      isChildrenLoading: false,

      hasChildren: newBlockChildren.length > 0,
      children: newBlockChildren,

      title: block.title,
      emoji: block.emoji,
    };

    //! make logic reusable
    // todo: update hasChildren (or remove)

    const oldParent = currentPageState.pages[pageId];
    const updatedOldParentChildren = oldParent.children.filter(
      (p) => p !== pageId
    );
    const updatedOldParent = oldParent
      ? {
          ...oldParent,
          children: updatedOldParentChildren,
          hasChildren: updatedOldParentChildren,
        }
      : null;

    const newParent = newParentId ? currentPageState.pages[newParentId] : null;
    const updatedNewParentChildren = newParent?.children
      ? [...newParent?.children, pageId]
      : [pageId];
    const updatedNewParent = newParent
      ? {
          ...newParent,
          children: updatedNewParentChildren,
          hasChildren: updatedNewParentChildren.length > 0,
        }
      : null;

    const updatePageAction: IChangeUpdatePageAction = {
      type: 'ChangeUpdatePageAction',
      page: newPage,
    };

    return (dispatch: Dispatch) => {
      dispatch(updatePageAction);
      newParent &&
        dispatch({
          type: 'ChangeUpdatePageAction',
          page: updatedOldParent,
        });
      oldParent &&
        dispatch({
          type: 'ChangeUpdatePageAction',
          page: updatedNewParent,
        });
    };
  };
}

export default {
  fetchAllPagesActionCreator,
  createPageActionCreator,
  deletePageActionCreator,
  changeCurrentPage,
  changeBlockParent,
};
