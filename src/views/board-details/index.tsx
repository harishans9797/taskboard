import React from "react";
import AddListTile from "./components/add-list-tile";
import { BoardDetails as BoardDetailsType } from '../../types';
import ListTile from "./components/list-tile";
import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { BoardDetailsParams } from "../../utils/routes";
import { AppState, AppDispatch } from "../../store";
import { BoardDetailsActionCreators } from "../../store/board-details";

export interface BoardDetailsProps extends RouteComponentProps<BoardDetailsParams> {
  details: BoardDetailsType | undefined;
  loadDetails: (uuid: string) => void;
}

class BoardDetails extends React.PureComponent<BoardDetailsProps> {

  componentDidMount() {
    const uuid = this.props.match.params.uuid;
    this.props.loadDetails(uuid);
  }

  render() {
    const { details } = this.props;

    return (
      <div style={{display: 'flex'}}>
        <AddListTile />
        {details && details.lists.map(list => (
          <ListTile
            key={list.uuid}
            list={list}
          />
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
    loadDetails: (uuid: string) => dispatch(BoardDetailsActionCreators.loadBoardDetails(uuid))
  })
)(withRouter(BoardDetails));