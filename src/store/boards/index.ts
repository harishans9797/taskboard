import { uuid } from "../../utils/uuid";
import { Action } from "redux";
import { Board } from "../../types";
import { Dispatch } from "react";
import { AppState } from "..";

export interface BoardsState {
  boards: Board[];
}

const boardsInitialState: BoardsState = {
  boards: []
}

interface UpdateBoardsAction extends Action<'boards/update-boards'> {
  boards: Board[];
}

interface AddBoardAction extends Action<'boards/add-board'> {
  name: string;
}

export type BoardsActions = UpdateBoardsAction | AddBoardAction;

export const BoardsActionCreators = {
  updateBoards: (boards: Board[]): UpdateBoardsAction => ({
    type: 'boards/update-boards',
    boards
  }),
  addBoard: (name: string): AddBoardAction => ({
    type: 'boards/add-board',
    name
  }),
  saveBoards: () => (dispatch: Dispatch<BoardsActions>, getState: () => AppState) => {
    const boardsState = getState().boards;

    localStorage.setItem('boards', JSON.stringify(boardsState.boards));
    
    boardsState.boards.forEach(board => {
      if (!localStorage.getItem('boards/' + board.uuid)) {
        localStorage.setItem('boards/' + board.uuid, JSON.stringify(board));
      }
    })
  },
  loadBoards: () => (dispatch: Dispatch<BoardsActions>) => {
    const boardsString = localStorage.getItem('boards');
    if (boardsString) {
      const boards = JSON.parse(boardsString);
      dispatch(BoardsActionCreators.updateBoards(boards));
    }
  }
};

export function boardsReducer(state: BoardsState = boardsInitialState, action?: BoardsActions): BoardsState {
  if (action) {
    if (action.type === 'boards/update-boards') {
      return {
        ...state,
        boards: action.boards
      };
    } else if (action.type === 'boards/add-board') {
      return {
        ...state,
        boards: [
          ...state.boards,
          {
            uuid: uuid(),
            name: action.name
          }
        ]
      };
    }
  }

  return state;
}