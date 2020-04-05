import React from 'react';
import { connect } from 'react-redux';
import { AppState, AppDispatch } from '../../store';
import { Board } from '../../types';
import CreateBoardTile from './components/create-board-tile';
import BoardTile from './components/board-tile';
import css from './boards.module.css';
import { BoardsActionCreators } from '../../store/boards';
import { RouteProps, withRouter, RouteComponentProps } from 'react-router-dom';
import Routes from '../../utils/routes';

export interface HomeProps extends RouteComponentProps {
  boards: Board[];
  addBoard: (name: string) => void;
  loadBoards: () => void;
}

class Home extends React.PureComponent<HomeProps & RouteProps> {

  componentDidMount() {
    this.props.loadBoards();
  }

  public render() {
    return (
      <div className={css.boardsContainer}>
        <CreateBoardTile createBoard={this.props.addBoard} />
        {this.props.boards.map(board => (
          <BoardTile
            key={board.uuid}
            name={board.name}
            onClick={() => this.navigateToDetails(board)}
          />
        ))}
      </div>
    );
  }

  private navigateToDetails = (board: Board) => {
    const path = Routes.details.getPath({ uuid: board.uuid });
    this.props.history.push(path);
  };
}

export default connect(
  (state: AppState) => ({
    boards: state.boards.boards
  }),
  (dispatch: AppDispatch) => ({
    addBoard: (name: string) => {
      dispatch(BoardsActionCreators.addBoard(name));
      dispatch(BoardsActionCreators.saveBoards());
    },
    loadBoards: () => dispatch(BoardsActionCreators.loadBoards())
  })
)(withRouter(Home));