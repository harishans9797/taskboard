export interface Board {
  uuid: string;
  name: string;
}

export interface ListItem {
  uuid: string;
  text: string;
  done: boolean;
}

export interface List {
  uuid: string;
  name: string;
  items: ListItem[];
}

export interface BoardDetails extends Board {
  lists: List[];
}