import React, { useState, useEffect, CSSProperties } from "react";
import ResizeSensor from "react-resize-detector";
import { useRef } from "react";
import { Show } from "../../ui/Show";
import { usePlugin } from "../../plugins/usePlugin";
import { IconProvider } from "../icons/IconProviderPlugin";
import { Icon } from "../icons/Icon";
import { HtmlElementModalPopup } from "../popup/HtmlElementModalPopup";
import { blockEvent } from "../../ui/Utils";
import { useEditorKit } from "../../editor/EditorKit";

export interface EditorToolbarProps {
  children: JSX.Element[];
  className?: string;
  overflowStrategy?: OverflowStrategy;
  style?: CSSProperties;
}

export enum OverflowStrategy {
  Wrap,
  Menu,
}

export const EditorToolbar: React.FC<EditorToolbarProps> = (
  props: EditorToolbarProps
) => {
  const { overflowStrategy, className } = props;
  const { id } = useEditorKit();
  const array = React.Children.toArray(props.children);
  const total = array.length;
  const [index, setIndex] = useState(1);
  const toolbar = useRef<HTMLElement | null>(null);
  const done = useRef(false);

  const children = array.slice(0, index).map((child) => {
    return React.cloneElement(child, child.props);
  });

  const overflow = array.slice(index).map((child) => {
    return React.cloneElement(child, child.props);
  });

  const handleRef = (ref: HTMLElement | null) => {
    toolbar.current = ref;
    setIndex((index) => index);
    measure();
  };

  const handleResize = () => {
    done.current = false;
    setIndex(1);
    measure();
  };

  const measure = () => {
    if (done.current) {
      return;
    }
    if (toolbar.current) {
      if (toolbar.current.scrollWidth > toolbar.current.clientWidth) {
        done.current = true;
        setIndex((index) => index - 2);
      }
      if (total > index) {
        setIndex((index) => index + 1);
      }
    }
  };
  useEffect(handleResize, [props.children.length]);

  const isOverflowing = overflow.length > 0;
  const isWrapMode = overflowStrategy === OverflowStrategy.Wrap;
  const maxWidth = toolbar.current ? toolbar.current.clientWidth : 0;
  const overflowingClass =
    !isOverflowing || isWrapMode ? "rek-no-overflow" : "";

  return (
    <ResizeSensor handleWidth onResize={handleResize}>
      <div
        ref={handleRef}
        id={`rek-${id}-toolbar`}
        className={`rek-editor-toolbar-wrapper ${overflowingClass} `}
      >
        <div className={`rek-editor-toolbar ${className}`}>{children}</div>

        <Show when={!isWrapMode}>
          <Overflow maxWidth={maxWidth}>
            <EditorToolbar overflowStrategy={OverflowStrategy.Wrap}>
              {overflow}
            </EditorToolbar>
          </Overflow>
        </Show>
      </div>

      <Show when={isOverflowing && isWrapMode && done.current}>
        <div style={{ width: maxWidth, maxWidth }}>
          <EditorToolbar overflowStrategy={OverflowStrategy.Wrap}>
            {overflow}
          </EditorToolbar>
        </div>
      </Show>
    </ResizeSensor>
  );
};

EditorToolbar.defaultProps = { className: "" };

interface OverflowProps {
  children: React.ReactNode;
  maxWidth: number;
}

const Overflow = (props: OverflowProps) => {
  const { children, maxWidth } = props;
  const [show, setShow] = useState(false);
  const element = useRef<HTMLElement | null>(null);
  const { icons } = usePlugin<IconProvider>("icon-provider");
  const toggleShow = () => {
    setShow((show) => !show);
  };

  return (
    <div
      className="rek-editor-toolbar-overflow"
      ref={(ref) => (element.current = ref)}
      onMouseDown={blockEvent}
    >
      <div className="rek-icon-button">
        <Icon
          data-id="toolbar-overflow-button"
          className="rek-more-icon"
          icon={icons.more}
          onClick={toggleShow}
        />
      </div>
      <HtmlElementModalPopup
        element={element.current}
        show={show}
        location="bottom"
        onClickOutside={toggleShow}
        offsets={{ v: 7 }}
      >
        <div className="rek-panel" style={{ maxWidth }}>
          {children}
        </div>
      </HtmlElementModalPopup>
    </div>
  );
};
