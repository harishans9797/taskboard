import React, { ChangeEvent } from 'react';
import css from './board.module.css';
import BoardTile from './board-tile';

export interface CreateBoardTileProps {
  createBoard: (name: string) => void;
}

interface State {
  name: string;
  showForm: boolean;
}

export default class CreateBoardTile extends React.PureComponent<CreateBoardTileProps, State> {
  constructor(props: CreateBoardTileProps) {
    super(props);
    this.state = {
      name: '',
      showForm: false
    }
  }

  public render() {
    const { showForm } = this.state;

    if (showForm) {
      return (
        <div className={css.boardTile}>
          <div className={[css.boardTileContent, css.boardTileContentLarge].join(' ')}>
            <div>What should we name the board?</div>
            <input onChange={this.setName}></input>
            <div>
              <button onClick={this.saveBoard}>
                Save
              </button>
              <button onClick={this.hideForm}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return <BoardTile onClick={this.showForm} name={'Create a new board...'} />
    }
  }

  private readonly showForm = () => this.setState({ showForm: true });
  private readonly hideForm = () => this.setState({ showForm: false, name: '' });
  private readonly setName = (event: ChangeEvent<HTMLInputElement>) => this.setState({ name: event.target!.value });

  private readonly saveBoard = () => {
    if(this.state.name.length > 0){
    this.props.createBoard(this.state.name);
    this.hideForm();
    }
  }
}