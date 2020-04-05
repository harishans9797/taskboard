import React, { ChangeEvent, DragEvent } from "react";
import { List, ListItem } from "../../../types";
import css from './list.module.css';
import { BoardDetailsActionCreators } from "../../../store/board-details";
import { AppDispatch, AppState } from "../../../store";
import { connect } from "react-redux";

export interface ListTileProps {
  list: List;
  addTask: (listUuid: string, text: string) => void;
  moveTask: (
    sourceListUuid: string,
    sourceItemUuid: string,
    targetListUuuid: string,
    targetItemUuid: string | undefined
  ) => void;
  setTaskDone: (listUuid: string, taskUuid: string, done: boolean) => void;
}

interface State {
  text: string;
}

class ListTile extends React.PureComponent<ListTileProps, State> {
  constructor(props: ListTileProps) {
    super(props);
    this.state = {
      text: ''
    };
  }

  private readonly setText = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ text: event.target!.value });
  };

  private readonly onKeyPress = (event: React.KeyboardEvent) => {
    const { list, addTask } = this.props;
    const { text } = this.state;

    if (event.keyCode === 13 && text.trim() !== '') { // enter
      addTask(list.uuid, this.state.text);
      this.setState({ text: '' });
    }
  };

  private readonly onChange = (item: ListItem, event: ChangeEvent<HTMLInputElement>) => {
    const { list, setTaskDone } = this.props;
    setTaskDone(list.uuid, item.uuid, event.target.checked);
  };

  private readonly onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';
  };

  private readonly onDropOnList = (event: DragEvent<HTMLDivElement>) => {
    event.stopPropagation();

    const jsonDataString = event.dataTransfer.getData('application/json');
    const data = JSON.parse(jsonDataString);

    this.props.moveTask(
      data.sourceListUuid,
      data.sourceItemUuid,
      this.props.list.uuid,
      undefined
    );
  };

  private readonly onDropOnItem = (itemUuid: string, event: DragEvent<HTMLDivElement>) => {
    event.stopPropagation();

    const jsonDataString = event.dataTransfer.getData('application/json');
    const data = JSON.parse(jsonDataString);

    this.props.moveTask(
      data.sourceListUuid,
      data.sourceItemUuid,
      this.props.list.uuid,
      itemUuid
    );
  };

  private readonly onDragStart = (itemUuid: string, event: DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData('application/json', JSON.stringify({
      sourceItemUuid: itemUuid,
      sourceListUuid: this.props.list.uuid
    }));
  };

  render() {
    const { list } = this.props;

    return (
      <div
        className={css.listTile}
        onDragOver={this.onDragOver}
        onDrop={this.onDropOnList}
      >
        {list.name}
        <input
          value={this.state.text}
          onChange={this.setText}
          onKeyUp={this.onKeyPress}
        />
        {list.items.map(listItem => (
          <div
            key={listItem.uuid}
            draggable={true}
            onDragStart={(event) => this.onDragStart(listItem.uuid, event)}
            onDrop={(event) => this.onDropOnItem(listItem.uuid, event)}
          >
            {listItem.text}
            <input
              type={'checkbox'}
              checked={listItem.done}
              onChange={(event) => this.onChange(listItem, event)}
            />
          </div>
        ))}
      </div>
    );
  }
}


export default connect(
  (state: AppState) => ({
    details: state.details.details
  }),
  (dispatch: AppDispatch) => ({
    addTask: (listUuid: string, taskText: string) => {
      dispatch(BoardDetailsActionCreators.addTask(listUuid, taskText));
      dispatch(BoardDetailsActionCreators.saveBoardDetails());
    },
    moveTask: (
      sourceListUuid: string,
      sourceItemUuid: string,
      targetListUuuid: string,
      targetItemUuid: string | undefined
    ) => {
      dispatch(BoardDetailsActionCreators.moveItemToList(
        sourceListUuid,
        sourceItemUuid,
        targetListUuuid,
        targetItemUuid)
      );
      dispatch(BoardDetailsActionCreators.saveBoardDetails());
    },
    setTaskDone: (listUuid: string, taskUuid: string, done: boolean) => {
      dispatch(BoardDetailsActionCreators.setItemDone(listUuid, taskUuid, done));
      dispatch(BoardDetailsActionCreators.saveBoardDetails());
    }
  })
)(ListTile);