import React from "react";
import styled from "styled-components";
import Todo from "./Todo";

const List = styled.div`
  margin-top: 16px;
  display: grid;
  gap: 8px;
`;

export default function TodoList({ todoList, onCheckBtnClick, onDelete, onRename }) {
  return (
    <List>
      {todoList.map((todo) => (
        <Todo
          key={todo._id || todo.id}
          todo={todo}
          onCheckBtnClick={onCheckBtnClick}
          onDelete={onDelete}
          onRename={onRename}
        />
      ))}
    </List>
  );
}
