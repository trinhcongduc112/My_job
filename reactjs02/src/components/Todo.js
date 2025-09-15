import React, { useState } from "react";
import styled, { css } from "styled-components";
import Button from "@atlaskit/button";
import Textfield from "@atlaskit/textfield";
import CheckIcon from "@atlaskit/icon/glyph/check";
import MoreIcon from "@atlaskit/icon/glyph/more";
import DropdownMenu, { DropdownItemGroup, DropdownItem } from "@atlaskit/dropdown-menu";
import { useNavigate } from "react-router-dom";

const Row = styled.div`
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(9,30,66,0.08);
  padding: 12px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const Name = styled.div`
  ${(p) =>
    p.$isCompleted &&
    css`
      text-decoration: line-through;
      opacity: 0.6;
    `}
`;

const Note = styled.div`
  font-size: 13px;
  color: gray;
  margin-top: 4px;
`;

export default function Todo({ todo, onCheckBtnClick, onDelete, onRename }) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(todo.name);

  const [isNoteEditing, setIsNoteEditing] = useState(false);
  const [noteDraft, setNoteDraft] = useState(todo.note || "");

  // ✅ thêm state cho thời gian
  const [isTimeEditing, setIsTimeEditing] = useState(false);
  const [startDraft, setStartDraft] = useState(todo.startTime || "");
  const [endDraft, setEndDraft] = useState(todo.endTime || "");

  function saveName() {
    onRename(todo.id, draft, todo.note, todo.startTime, todo.endTime);
    setIsEditing(false);
  }

  function saveNote() {
    onRename(todo.id, todo.name, noteDraft, todo.startTime, todo.endTime);
    setIsNoteEditing(false);
  }

  // ✅ lưu thời gian
  function saveTime() {
    onRename(todo.id, todo.name, todo.note, startDraft, endDraft);
    setIsTimeEditing(false);
  }

  return (
    <Row>
      <div>
        <Name $isCompleted={todo.isCompleted}>
          <Button
            appearance="subtle"
            spacing="compact"
            onClick={() => onCheckBtnClick(todo.id)}
          >
            <CheckIcon label="" size="small" />
          </Button>
          {isEditing ? (
            <Textfield
              value={draft}
              autoFocus
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveName();
                if (e.key === "Escape") setIsEditing(false);
              }}
              elemAfterInput={
                <Button appearance="primary" spacing="compact" onClick={saveName}>
                  Lưu
                </Button>
              }
            />
          ) : (
            <span>{todo.name}</span>
          )}
        </Name>

        {/* ghi chú */}
        {!isNoteEditing && todo.note && <Note>📝 {todo.note}</Note>}
        {isNoteEditing && (
          <div style={{ marginTop: 8 }}>
            <Textfield
              placeholder="Nhập ghi chú..."
              value={noteDraft}
              onChange={(e) => setNoteDraft(e.target.value)}
            />
            <Button appearance="primary" spacing="compact" onClick={saveNote}>
              Lưu
            </Button>
            <Button spacing="compact" onClick={() => setIsNoteEditing(false)}>
              Hủy
            </Button>
          </div>
        )}

        {/* ⏰ thời gian */}
        {!isTimeEditing && (todo.startTime || todo.endTime) && (
          <Note>⏰ {todo.startTime} - {todo.endTime}</Note>
        )}
        {isTimeEditing && (
          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            <Textfield
              placeholder="Bắt đầu (hh:mm)"
              value={startDraft}
              onChange={(e) => setStartDraft(e.target.value)}
            />
            <Textfield
              placeholder="Kết thúc (hh:mm)"
              value={endDraft}
              onChange={(e) => setEndDraft(e.target.value)}
            />
            <Button appearance="primary" spacing="compact" onClick={saveTime}>
              Lưu
            </Button>
            <Button spacing="compact" onClick={() => setIsTimeEditing(false)}>
              Hủy
            </Button>
          </div>
        )}
      </div>

      {/* menu */}
      <DropdownMenu
        trigger={({ triggerRef, ...props }) => (
          <Button {...props} ref={triggerRef} appearance="subtle" iconBefore={<MoreIcon />} />
        )}
      >
        <DropdownItemGroup>
          <DropdownItem onClick={() => setIsEditing(true)}>✏️ Sửa tên</DropdownItem>
          <DropdownItem onClick={() => onDelete(todo.id)}>🗑️ Xóa</DropdownItem>
          <DropdownItem onClick={() => setIsNoteEditing(true)}>📝 Ghi chú</DropdownItem>
          <DropdownItem onClick={() => setIsTimeEditing(true)}>⏰ Thời gian</DropdownItem>
          <DropdownItem onClick={() => navigate(`/detail/${todo.id}`)}>📄 Chi tiết</DropdownItem>
        </DropdownItemGroup>
      </DropdownMenu>
    </Row>
  );
}
