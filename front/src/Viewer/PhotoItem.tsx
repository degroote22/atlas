import * as React from "react";
import { IMenuItemContent } from "../Interfaces";
import Editor from "./Editor";
import {
  EDITBAR_SIZE,
  HERO_SIZE,
  NUMS_FIX,
  CARD_MARGIN
} from "./Constants";
import List from "./List";
import ItemStore from "../Stores/ItemStore";
import { ComponentBase } from "resub";
import AuthStore from "../Stores/AuthStore";
import DataStore from "../Stores/DataStore";

interface IStateConnect {
  canEdit: boolean;
}

interface IPropsConnect extends React.Props<{}> {
  item: IMenuItemContent;
}

class PhotoItemConnect extends ComponentBase<
  IPropsConnect,
  IStateConnect
> {
  protected _buildState(
    p: IPropsConnect,
    i: boolean
  ): IStateConnect {
    return {
      canEdit: AuthStore.getAdminLogged()
    };
  }

  render() {
    return <PhotoItem {...this.props} {...this.state} />;
  }
}

interface IState {
  width: number;
  height: number;
}

interface IProps extends IPropsConnect, IStateConnect {}

class PhotoItem extends React.Component<IProps, IState> {
  state = {
    width: 0,
    height: 0
  };

  private onDeleteItem = () => {
    ItemStore.delete(
      this.props.item.groupid,
      this.props.item.id
    );
  };

  componentDidMount() {
    if (this.props.item.url === "") {
      DataStore.onUrlError(this.props.item);
    }
    this.setSizes();
    window.addEventListener("resize", this.setSizes);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.setSizes);
  }

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
    const { styles } = this.getStyles();
    const url = this.props.item.url;

    const { vbh, vbw } = this.getRedimension();
    return (
      <>
        <div
          style={{
            display: "flex",
            flexDirection: styles.wrapper.flexDirection as
              | "row"
              | "column",
            marginTop: this.props.canEdit ? EDITBAR_SIZE : 0
          }}
        >
          <div
            style={{
              width: styles.splitter.width,
              height: styles.splitter.height,
              justifyContent: "center",
              alignItems: "center",
              display: "flex"
            }}
          >
            <Editor
              polygons={this.props.item.polygons}
              width={styles.img.width}
              height={styles.img.height}
              outerHeight={styles.splitter.height}
              outerWidth={styles.splitter.width}
              vbh={vbh}
              vbw={vbw}
              src={url}
              onDeleteItem={this.onDeleteItem}
              canEdit={this.props.canEdit}
            />
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
            <List item={this.props.item} />
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

  private getStyles() {
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
    // if (!url) {
    //   return null;
    // }

    const styles = isVerticalSplit
      ? {
          wrapper: {
            flexDirection: "row"
          },
          splitter: {
            height: verticalSplitAvailableHeight,
            width: verticalSplitAvailableWidth
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
            flexDirection: "column"
          },
          splitter: {
            height: horizontalSplitAvailableHeight,
            width: horizontalSplitAvailableWidth
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
    return { styles };
  }
}

export default PhotoItemConnect;
