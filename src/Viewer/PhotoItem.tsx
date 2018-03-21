import * as React from "react";
import { IMenuItemContent } from "../Interfaces";
import Editor from "./Editor";
import {
  EDITBAR_SIZE,
  HERO_SIZE,
  NUMS_FIX
} from "./Constants";

interface IProps {
  item: IMenuItemContent;
  canEdit: boolean;
}

interface IState {
  width: number;
  height: number;
}

class PhotoItem extends React.Component<IProps, IState> {
  state = {
    width: 0,
    height: 0
  };

  componentDidMount() {
    this.setSizes();

    window.addEventListener("resize", () => {
      this.setSizes();
    });
  }

  private setSizes = () => {
    const width = window.innerWidth;
    let height = window.innerHeight - HERO_SIZE;

    if (this.props.canEdit) {
      console.log("canEdit");
      height = height - EDITBAR_SIZE;
    }

    this.setState(() => ({
      width,
      height
    }));
  };

  render() {
    const url = this.props.item.url;

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

    if (!url) {
      return null;
    }

    // if (isVerticalSplit) {
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
              verticalSplitWidth - NUMS_FIX
            ),
            height: Math.max(
              0,
              verticalSplitHeight - NUMS_FIX
            )
          }
        };
    // }
    return (
      <>
        <Editor
          polygons={this.props.item.polygons}
          width={styles.img.width}
          height={styles.img.height}
          outerHeight={styles.splitter.height}
          outerWidth={styles.splitter.width}
        />
        <div style={styles.wrapper as any}>
          <div
            style={{
              ...styles.splitter,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <img style={styles.img} src={url} />
          </div>
          <div
            style={{
              ...styles.splitter
            }}
          >
            asdasdasdasd
          </div>
        </div>
      </>
    );
  }
}

export default PhotoItem;
