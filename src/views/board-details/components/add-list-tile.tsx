import React, { ChangeEvent } from "react";
import css from './list.module.css';
import { AppDispatch } from "../../../store";
import { BoardDetailsActionCreators } from "../../../store/board-details";
import { connect } from "react-redux";

interface AddListTileProps {
  addList: (name: string) => void;
}

interface State {
  inEdit: boolean;
  name: string;
}

class AddListTile extends React.PureComponent<AddListTileProps, State> {
  constructor(props: AddListTileProps) {
    super(props);
    this.state = {
      inEdit: false,
      name: ''
    };
  }

  render() {
    if (!this.state.inEdit) {
      return (
        <div className={css.addListButton} onClick={this.startEdit}>
          Add list
        </div>
      );
    } else {
      return (
        <div className={css.formContainer}>
          <div className={css.buttonContainer}>
            <button onClick={this.stopEdit}>X</button>
          </div>
          <div><span>Enter list name</span></div>
          <input
            value={this.state.name}
            onChange={this.setName}
            onKeyUp={this.onKeyPress}
          />
        </div>
      )
    }

  }

  private readonly startEdit = () => this.setState({ inEdit: true });
  private readonly stopEdit = () => this.setState({ inEdit: false, name: '' });
  private readonly setName = (event: ChangeEvent<HTMLInputElement>) => this.setState({ name: event.target!.value });

  private readonly onKeyPress = (event: React.KeyboardEvent) => {
    if (event.keyCode === 13) { // enter
      if(this.state.name.length > 0){
      this.props.addList(this.state.name);
      this.stopEdit();
    }}
  }
}

export default connect(
  () => ({}),
  (dispatch: AppDispatch) => ({
    addList: (name: string) => {
      dispatch(BoardDetailsActionCreators.addList(name));
      dispatch(BoardDetailsActionCreators.saveBoardDetails());
    }
  })
)(AddListTile);
