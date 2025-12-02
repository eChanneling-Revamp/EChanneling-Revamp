"use client";

import { motion, Reorder } from "framer-motion";
import { ReactNode } from "react";

interface DraggableComponentProps {
  children: ReactNode;
  id: string;
}

export function DraggableComponent({ children, id }: DraggableComponentProps) {
  return (
    <Reorder.Item
      value={id}
      id={id}
      className="cursor-move"
      dragListener={false}
      dragControls={undefined}
    >
      {children}
    </Reorder.Item>
  );
}
