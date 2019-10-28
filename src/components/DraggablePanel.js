import React, { useState } from 'react';
import styled from 'styled-components/macro';
import Draggable, { DraggableCore } from 'react-draggable';

const Container = styled('div')`
  position: fixed;
  width: 100%;
  /* bottom: 0; */
  height: calc(100vh - 100px);
  border: 2px solid red;
  overflow-y: hidden;
  z-index: 1000;
  justify-content: center;
  display: flex;
  background: rgba(50, 50, 50, 0.5);
  /* top: ${props => (props.open ? '80vh' : 0)}; */
  top: 80vh;
  .handle {
    width: 30px;
    height: 7px;
    background: orange;
    border-radius: 25px;
    margin-top: 5px;
  }
`;

// const WidgetDiv = styled('div')``;

const DraggablePanel = () => {
  const [open, setOpen] = useState(false);
  const [triggered, setTriggered] = useState(false);

  const bounds = {
    open: { top: -600, left: 0, right: 0, bottom: 200 },
    closed: { top: 0, left: 0, right: 0, bottom: 600 }
  };

  const handleStop = (e, { y }) => {
    console.log('handle stop');
    console.log('y from stop ', y);
    if (!open && y < -25) {
      setOpen(true);
    } else if (open && y > -684) {
      setOpen(false);
    }
  };

  return (
    <Draggable
      axis="y"
      handle=".handle"
      onStop={handleStop}
      position={open ? { x: 0, y: -709 } : { x: 0, y: 0 }}
    >
      <Container open={open}>
        <div className="handle" />
      </Container>
    </Draggable>
  );
};

export default DraggablePanel;
