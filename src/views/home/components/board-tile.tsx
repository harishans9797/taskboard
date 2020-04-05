import React from 'react';
import css from './board.module.css';

export interface BoardTileProps {
  onClick: () => void;
  name: string;
}

const BoardTile: React.FC<BoardTileProps> = (props) => (
  <div className={css.boardTile}>
    <div className={css.boardTileContent} onClick={props.onClick}>
      {props.name}
    </div>
  </div>
);

export default BoardTile;