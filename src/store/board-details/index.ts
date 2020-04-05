import { Action } from "redux";
import { BoardDetails } from "../../types";
import { Dispatch } from "react";
import { AppState } from "..";
import { uuid } from "../../utils/uuid";

export interface BoardDetailsState {
  details: BoardDetails | undefined;
}

const boardDetailsInitialState: BoardDetailsState = {
  details: undefined
}

interface UpdateBoardDetailsAction extends Action<'details/update-details'> {
  details: BoardDetails;
}

interface AddListAction extends Action<'details/add-list'> {
  name: string;
}

interface MoveItemToListAction extends Action<'details/move-item-to-list'> {
  sourceListUuid: string;
  sourceItemUuid: string;
  targetListUuid: string;
  targetItemUuid: string | undefined;
}

interface AddTaskAction extends Action<'details/add-task'> {
  listUuid: string;
  taskText: string;
}

interface SetItemDoneAction extends Action<'details/set-done'> {
  listUuid: string;
  itemUuid: string;
  done: boolean;
}

export type BoardDetailsActions = UpdateBoardDetailsAction | AddListAction | AddTaskAction | MoveItemToListAction | SetItemDoneAction;

export const BoardDetailsActionCreators = {
  updateBoardDetails: (details: BoardDetails): UpdateBoardDetailsAction => ({
    type: 'details/update-details',
    details
  }),
  addList: (name: string): AddListAction => ({
    type: 'details/add-list',
    name
  }),
  addTask: (listUuid: string, taskText: string): AddTaskAction => ({
    type: 'details/add-task',
    listUuid,
    taskText
  }),
  moveItemToList: (
    sourceListUuid: string,
    sourceItemUuid: string,
    targetListUuid: string,
    targetItemUuid: string | undefined
  ): MoveItemToListAction => ({
    type: 'details/move-item-to-list',
    sourceListUuid,
    sourceItemUuid,
    targetListUuid,
    targetItemUuid
  }),
  setItemDone: (listUuid: string, itemUuid: string, done: boolean): SetItemDoneAction => ({
    type: 'details/set-done',
    listUuid,
    itemUuid,
    done
  }),
  loadBoardDetails: (uuid: string) => (dispatch: Dispatch<UpdateBoardDetailsAction>) => {
    const detailsString = localStorage.getItem('boards/' + uuid);
    if (detailsString) {
      const board = JSON.parse(detailsString) as BoardDetails;
      if (!board.lists) {
        board.lists = [];
      }

      dispatch(BoardDetailsActionCreators.updateBoardDetails(board));
    }
  },
  saveBoardDetails: () => (dispatch: Dispatch<UpdateBoardDetailsAction>, getState: () => AppState) => {
    const boardDetails = getState().details.details;

    if (boardDetails) {
      localStorage.setItem('boards/' + boardDetails.uuid, JSON.stringify(boardDetails));
    }
  }
};

export function boardDetailsReducer(state: BoardDetailsState = boardDetailsInitialState, action?: BoardDetailsActions): BoardDetailsState {
  if (action) {
    if (action.type === 'details/update-details') {
      return {
        ...state,
        details: action.details
      };
    } else if (action.type === 'details/add-list') {
      return {
        ...state,
        details: {
          ...state.details!,
          lists: [
            ...state.details!.lists,
            {
              uuid: uuid(),
              name: action.name,
              items: []
            }
          ]
        }
      };
    } else if (action.type === 'details/add-task') {
      return {
        ...state,
        details: {
          ...state.details!,
          lists: state.details!.lists.map(list => {
            if (list.uuid === action.listUuid) {
              return {
                ...list,
                items: [
                  ...list.items,
                  {
                    uuid: uuid(),
                    text: action.taskText,
                    done: false
                  }
                ]
              };
            } else {
              return list;
            }
          })
        }
      };
    } else if (action.type === 'details/move-item-to-list') {
      if (action.targetItemUuid === action.sourceItemUuid) {
        return state;
      }

      const sourceList = state.details!.lists.find(list => list.uuid === action.sourceListUuid);
      const targetList = state.details!.lists.find(list => list.uuid === action.targetListUuid);

      if (!sourceList || !targetList) {
        return state;
      }

      const sourceIndex = sourceList.items.findIndex(item => item.uuid === action.sourceItemUuid);
      const targetIndex = targetList.items.findIndex(item => item.uuid === action.targetItemUuid);

      const newSourceListItems = [ ...sourceList.items ];
      const newTargetListItems = [ ...targetList.items ];

      if (sourceList === targetList) {
        const indexToDelete = sourceIndex > targetIndex ? sourceIndex + 1 : sourceIndex;

        newSourceListItems.splice(targetIndex, 0, newSourceListItems[sourceIndex]);
        newSourceListItems.splice(indexToDelete, 1);

        newTargetListItems.splice(targetIndex, 0, newTargetListItems[sourceIndex]);
        newTargetListItems.splice(indexToDelete, 1);
      } else {
        newTargetListItems.splice(targetIndex, 0, newSourceListItems[sourceIndex]);
        newSourceListItems.splice(sourceIndex, 1);
      }

      return {
        ...state,
        details: {
          ...state.details!,
          lists: state.details!.lists.map(list => {
            if (list.uuid === action.sourceListUuid) {
              return {
                ...list,
                items: newSourceListItems
              };
            } else if (list.uuid === action.targetListUuid) {
              return {
                ...list,
                items: newTargetListItems
              };
            } else {
              return list;
            }
          })
        }
      };
    } else if (action.type === 'details/set-done') {
      return {
        ...state,
        details: {
          ...state.details!,
          lists: state.details!.lists.map(list => {
            if (list.uuid === action.listUuid) {
              return {
                ...list,
                items: list.items.map(item => {
                  if (item.uuid === action.itemUuid) {
                    return {
                      ...item,
                      done: action.done
                    };
                  } else {
                    return item;
                  }
                })
              }
            } else {
              return list;
            }
          })
        }
      }
    }
  }

  return state;
}