import React from 'react';
import ReactDOM from 'react-dom';
import { useSpring, animated, useTransition } from 'react-spring';

type Props = {
    open: boolean;
    setOpen: Function;
    children?: any;
    title?: string;
};

export default function Drawer(props: Props) {
    const { open, setOpen, children, title } = props;
    const el = document.querySelector('#root');
    const overlayStyles = useSpring({ opacity: open ? 1 : 0 });
    const transitions = useTransition(open, {
        from: { transform: 'translate(100%)', opacity: 0 },
        enter: { transform: 'translate(0%)', opacity: 1 },
        leave: { transform: 'translate(100%)', opacity: 0 },
        delay: 100,
        config: {
            duration: 150,
        },
    });
    return open && el
        ? ReactDOM.createPortal(
              <div className="drawer-wrapper">
                  {/* OVERLAY */}
                  <animated.div
                      style={overlayStyles}
                      className="drawer-overlay"
                      onClick={() => setOpen(false)}
                  ></animated.div>
                  {transitions(
                      (styles, item) =>
                          item && (
                              <animated.div style={styles} className="drawer-panel">
                                  {/* TITULO */}
                                  {title ? (
                                      <>
                                          <h4 className="mb-0">{title}</h4>
                                          <hr className="mt-0" />
                                      </>
                                  ) : null}
                                  {/* CONTEUDO */}
                                  <>{children}</>
                              </animated.div>
                          )
                  )}
              </div>,
              el
          )
        : null;
}
