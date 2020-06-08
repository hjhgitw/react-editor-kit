import React, {
  useState,
  useRef,
  Fragment,
  useCallback,
  CSSProperties,
  useEffect,
} from "react";
import { Overlay } from "../../ui/Popup";
import { Show } from "../../ui/Show";
import ReactDOM from "react-dom";
import { RenderElementProps } from "slate-react";

export interface ResizableProps extends Partial<RenderElementProps> {
  children: React.ReactNode;
  style?: CSSProperties;
  initialWidth: string | number;
  onChange?(width: number): void;
}

export const Resizable = (props: ResizableProps) => {
  const {
    initialWidth,
    children,
    onChange,
    style,
    attributes,
    ...rest
  } = props;
  const [state, setState] = useState({ width: initialWidth, down: -1 });
  const [element, setElement] = useState<HTMLElement | null>(null);
  const multiplier = useRef(1);

  const handleRef = useCallback(
    (node: HTMLElement | null) => {
      if (node && !element) {
        setElement(node);
      }
    },
    [element]
  );

  useEffect(() => {
    const handleUp = () => {
      if (state.down > -1) {
        setState((current) => ({ ...current, down: -1 }));
      }
    };
    window.addEventListener("mouseup", handleUp);
    return () => window.removeEventListener("mouseup", handleUp);
  }, [state.down]);

  const handleMove = useCallback(
    (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
      if (state.down > -1) {
        const delta = event.clientX - state.down;
        if (delta !== 0 && element) {
          const current = element?.getBoundingClientRect().width as number;
          console.log(current, delta, multiplier.current);
          const width = current + delta * multiplier.current;
          onChange && onChange(width);
          setState({ width, down: event.clientX });
        }
      }
    },
    [state, element]
  );

  const handleDown = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const element = event.target as HTMLElement;
    if (element.parentElement?.classList.contains("rek-resize-track-start")) {
      multiplier.current = -1;
    } else {
      multiplier.current = 1;
    }
    const down = event.clientX;
    setState((current) => ({ ...current, down }));
  };

  const allStyle = { ...(style || {}), ...{ width: state.width } };

  return (
    <Fragment>
      <div
        className="rek-resizable"
        style={allStyle}
        {...attributes}
        ref={handleRef}
      >
        <div
          className="rek-resize-handle rek-resize-handle-start"
          onMouseDown={handleDown}
          contentEditable={false}
        >
          <div className="rek-resize-track rek-resize-track-start">
            <div className="rek-resize-handle-grip" />
          </div>
        </div>
        <div
          className="rek-resize-handle rek-resize-handle-end"
          onMouseDown={handleDown}
          contentEditable={false}
        >
          <div className="rek-resize-track rek-resize-track-end">
            <div className="rek-resize-handle-grip" />
          </div>
        </div>
        <div className="rek-resizable-content">{children}</div>
      </div>
      <Show when={state.down > -1}>
        {ReactDOM.createPortal(
          <Overlay onMouseMove={handleMove}> </Overlay>,
          document.body
        )}
      </Show>
    </Fragment>
  );
};
