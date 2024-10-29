declare module 'react-beautiful-dnd' {
  import * as React from 'react';

  export interface DragDropContextProps {
    onDragEnd: (result: DropResult) => void;
    onDragStart?: (initial: DragStart) => void;
    onDragUpdate?: (update: DragUpdate) => void;
    children?: React.ReactNode;
  }

  export class DragDropContext extends React.Component<DragDropContextProps> {}

  export interface DroppableProps {
    droppableId: string;
    children: (provided: DroppableProvided, snapshot: DroppableStateSnapshot) => React.ReactNode;
  }

  export class Droppable extends React.Component<DroppableProps> {}

  export interface DraggableProps {
    draggableId: string;
    index: number;
    children: (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => React.ReactNode;
  }

  export class Draggable extends React.Component<DraggableProps> {}

  export interface DroppableProvided {
    innerRef: (element: HTMLElement | null) => void;
    droppableProps: React.HTMLProps<HTMLDivElement>;
    placeholder?: React.ReactElement;
  }

  export interface DroppableStateSnapshot {
    isDraggingOver: boolean;
  }

  export interface DraggableProvided {
    innerRef: (element: HTMLElement | null) => void;
    draggableProps: React.HTMLProps<HTMLDivElement>;
    dragHandleProps?: React.HTMLProps<HTMLDivElement>;
  }

  export interface DraggableStateSnapshot {
    isDragging: boolean;
  }

  export interface DropResult {
    draggableId: string;
    type: string;
    source: DraggableLocation;
    destination?: DraggableLocation;
  }

  export interface DraggableLocation {
    droppableId: string;
    index: number;
  }

  export interface DragStart {
    draggableId: string;
    type: string;
    source: DraggableLocation;
  }

  export interface DragUpdate extends DropResult {}
}
