import { BoardsState, boardsReducer, BoardsActions } from "./boards";
import { combineReducers } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { boardDetailsReducer, BoardDetailsActions, BoardDetailsState } from "./board-details";

export const appReducer = combineReducers({
  boards: boardsReducer,
  details: boardDetailsReducer
});

export const appInitialState = {
  boards: boardsReducer(),
  details: boardDetailsReducer()
}

export type AppActions = BoardsActions | BoardDetailsActions;

export interface AppState {
  boards: BoardsState,
  details: BoardDetailsState
}

export type AppDispatch = ThunkDispatch<AppState, any, AppActions>;
