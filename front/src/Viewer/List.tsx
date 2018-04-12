import * as React from "react";
import { IMenuItemContent } from "../Interfaces";
import * as ReactList from "react-list";
import ViewerStore from "../Stores/ViewerStore";
import PolygonCard from "./PolygonCard";

interface IProps extends React.Props<{}> {
  item: IMenuItemContent;
}

class List extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props);
    ViewerStore.registerListScrollTo(this.scrollTo);
  }

  private scrollTo = (focus: string) => {
    const index = this.props.item.polygons.findIndex(
      x => x.id === focus
    );
    if (this.list && index !== -1) {
      this.list.scrollTo(index);
    }
  };

  private list: ReactList | null = null;

  private renderItem = (index: number, key: string) => {
    const polygon = this.props.item.polygons[index];
    return <PolygonCard key={key} polygon={polygon} />;
  };

  render() {
    const polygons = this.props.item.polygons;
    return (
      <ReactList
        ref={ref => (this.list = ref)}
        itemRenderer={this.renderItem}
        length={polygons.length}
        type="simple"
      />
    );
  }
}

export default List;
