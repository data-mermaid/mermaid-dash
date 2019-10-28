import React, { useState } from 'react';
import styled from 'styled-components/macro';
import Draggable, { DraggableCore } from 'react-draggable';

console.log(window.innerHeight);
const Container = styled('div')`
  position: fixed;
  width: 100%;
  height: 1000px;
  border: 2px solid red;
  overflow-y: hidden;
  z-index: 1000;
  justify-content: center;
  display: flex;
  background: rgba(50, 50, 50, 0.5);
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

  const handleStop = (evt, val) => {
    console.log('handle stop');
    console.log('e ', evt);
    console.log('val from stop ', val);
    if (!open && val.y < -25) {
      setOpen(true);
    } else if (open && val.y > -684) {
      setOpen(false);
    }
  };

  const calBounds = windowHeight => {
    // console.log('calbounds ', (windowHeight * -800) / 980);
    return (windowHeight * -800) / 1180;
  };

  return (
    <Draggable
      axis="y"
      handle=".handle"
      onStop={handleStop}
      position={open ? { x: 0, y: calBounds(window.innerHeight) } : { x: 0, y: 0 }}
    >
      <Container open={open}>
        <div className="handle" />
      </Container>
    </Draggable>
  );
};

export default DraggablePanel;
