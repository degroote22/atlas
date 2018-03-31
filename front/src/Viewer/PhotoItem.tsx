import * as React from "react";
import {
  IMenuItemContent,
  IPolygonToCreate,
  IPolygon
} from "../Interfaces";
import Editor from "./Editor";
import Renderer from "./Renderer";
import {
  EDITBAR_SIZE,
  HERO_SIZE,
  NUMS_FIX,
  CARD_MARGIN
} from "./Constants";
import List from "./List";

interface IProps {
  item: IMenuItemContent;
  canEdit: boolean;
  onCreatePolygon: (polygon: IPolygonToCreate) => void;
  onDeletePolygon: (id: string) => void;
  onDeleteItem: (groupid: string, itemid: string) => void;
  onEditPolygon: (Polygon: IPolygon) => void;
  onUrlError: (item: IMenuItemContent) => void;
}

interface IState {
  width: number;
  height: number;
  focus: string;
}

class PhotoItem extends React.Component<IProps, IState> {
  state = {
    width: 0,
    height: 0,
    focus: ""
  };

  private renderer: Renderer | Editor | null = null;

  private onDeleteItem = () => {
    this.props.onDeleteItem(
      this.props.item.groupid,
      this.props.item.id
    );
  };

  private onChangeFocusFromList = (id: string) => {
    if (this.renderer) {
      this.renderer.changeFocus(id);
    }
    this.setState({ focus: id });
  };

  private onChangeFocus = (id: string) => {
    this.setState({ focus: id });
  };

  componentDidMount() {
    if (this.props.item.url === "") {
      this.props.onUrlError(this.props.item);
    }

    this.setSizes();

    window.addEventListener("resize", this.setSizes);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.setSizes);
  }

  private onEditClick = (polygon: IPolygon) => {
    if (this.renderer) {
      this.renderer.setEditing(polygon);
    }
  };

  private setSizes = () => {
    const width = window.innerWidth;
    let height = window.innerHeight - HERO_SIZE;

    if (this.props.canEdit) {
      height = height - EDITBAR_SIZE;
    }

    this.setState(() => ({
      width,
      height
    }));
  };

  render() {
    const itemWidth = this.props.item.width;
    const itemHeight = this.props.item.height;

    // Vertical split

    const verticalSplitAvailableWidth =
      this.state.width / 2;
    const verticalSplitAvailableHeight = this.state.height;

    // se ela for maior em altura do que largura, ela deve crescer pra cima até alcançar a altura máxima
    // e manter a proporção para a dimensão menor
    const isVertical =
      itemHeight / itemWidth >
      verticalSplitAvailableHeight /
        verticalSplitAvailableWidth;

    let [verticalSplitWidth, verticalSplitHeight] = [0, 0];

    if (isVertical) {
      const newHeight = verticalSplitAvailableHeight;
      const grewBy = newHeight / itemHeight;
      const newWidth = itemWidth * grewBy;
      [verticalSplitWidth, verticalSplitHeight] = [
        newWidth,
        newHeight
      ];
    } else {
      const newWidth = verticalSplitAvailableWidth;
      const grewBy = newWidth / itemWidth;
      const newHeight = itemHeight * grewBy;
      [verticalSplitWidth, verticalSplitHeight] = [
        newWidth,
        newHeight
      ];
    }

    const verticalSplitArea =
      verticalSplitWidth * verticalSplitHeight;

    // Horizontal split

    const horizontalSplitAvailableWidth = this.state.width;
    const horizontalSplitAvailableHeight =
      this.state.height / 2;

    const isHorizontal =
      itemHeight / itemWidth <
      horizontalSplitAvailableHeight /
        horizontalSplitAvailableWidth;

    const getDimensionsHorizontalSplit = () => {
      if (isHorizontal) {
        const newWidth = horizontalSplitAvailableWidth;
        const grewBy = newWidth / itemWidth;
        const newHeight = itemHeight * grewBy;
        return [newWidth, newHeight];
      } else {
        const newHeight = horizontalSplitAvailableHeight;
        const grewBy = newHeight / itemHeight;
        const newWidth = itemWidth * grewBy;
        return [newWidth, newHeight];
      }
    };

    const [
      horizontalSplitWidth,
      horizontalSplitHeight
    ] = getDimensionsHorizontalSplit();

    const horizontalSplitArea =
      horizontalSplitWidth * horizontalSplitHeight;

    // let width = 0;
    // let height = 0;

    const isVerticalSplit =
      verticalSplitArea > horizontalSplitArea;

    const url = this.props.item.url;

    // if (!url) {
    //   return null;
    // }

    const styles = isVerticalSplit
      ? {
          wrapper: {
            display: "flex",
            flexDirection: "row",
            marginTop: this.props.canEdit ? EDITBAR_SIZE : 0
          },
          splitter: {
            height: verticalSplitAvailableHeight,
            width: verticalSplitAvailableWidth,
            display: "flex"
          },
          img: {
            width: Math.max(
              0,
              verticalSplitWidth - NUMS_FIX
            ),
            height: Math.max(
              0,
              verticalSplitHeight - NUMS_FIX
            )
          }
        }
      : {
          wrapper: {
            display: "flex",
            flexDirection: "column",
            marginTop: this.props.canEdit ? EDITBAR_SIZE : 0
          },
          splitter: {
            height: horizontalSplitAvailableHeight,
            width: horizontalSplitAvailableWidth,
            display: "flex"
          },
          img: {
            width: Math.max(
              0,
              horizontalSplitWidth - NUMS_FIX
            ),
            height: Math.max(
              0,
              horizontalSplitHeight - NUMS_FIX
            )
          }
        };

    const { vbh, vbw } = this.getRedimension();
    return (
      <>
        <div style={styles.wrapper as any}>
          <div
            style={{
              ...styles.splitter,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            {this.props.canEdit ? (
              <Editor
                ref={ref => (this.renderer = ref)}
                onCreatePolygon={this.props.onCreatePolygon}
                onEditPolygon={this.props.onEditPolygon}
                polygons={this.props.item.polygons}
                width={styles.img.width}
                height={styles.img.height}
                outerHeight={styles.splitter.height}
                outerWidth={styles.splitter.width}
                vbh={vbh}
                vbw={vbw}
                src={url}
                onChangeFocus={this.onChangeFocus}
                onDeleteItem={this.onDeleteItem}
              />
            ) : (
              <Renderer
                ref={ref => (this.renderer = ref)}
                vbh={vbh}
                vbw={vbw}
                polygons={this.props.item.polygons}
                width={styles.img.width}
                height={styles.img.height}
                outerHeight={styles.splitter.height}
                outerWidth={styles.splitter.width}
                editing={false}
                src={url}
                onChangeFocus={this.onChangeFocus}
              />
            )}
          </div>
          <div
            style={{
              width:
                styles.splitter.width - CARD_MARGIN * 2,
              height: styles.splitter.height,
              paddingLeft: CARD_MARGIN,
              paddingRight: CARD_MARGIN,
              overflow: "auto",
              display: "block"
            }}
          >
            <List
              focus={this.state.focus}
              item={this.props.item}
              onChangeFocus={this.onChangeFocusFromList}
              canEdit={this.props.canEdit}
              onDelete={this.props.onDeletePolygon}
              onEdit={this.onEditClick}
              height={styles.splitter.height}
              width={styles.splitter.width}
            />
          </div>
        </div>
      </>
    );
  }

  private getRedimension = () => {
    const MAX = 1200;
    const w = this.props.item.width;
    const h = this.props.item.height;
    if (w > h) {
      // largura maior, largura fica com o máximo
      const vbw = MAX;
      const ratio = vbw / w;
      const vbh = ratio * h;
      return { vbw, vbh };
    } else {
      // altura maior, altura fica com o máximo
      const vbh = MAX;
      const ratio = vbh / h;
      const vbw = ratio * w;
      return { vbh, vbw };
    }
  };
}

export default PhotoItem;
