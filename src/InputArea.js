// src/InputArea.js
import React from "react";
import styled from "styled-components";

const StyledInput = styled.textarea`
  width: 90%;
  padding: 15px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  resize: vertical;
  min-height: 100px;
  margin: 20px auto;
  display: block;
  font-family: monospace;
  background-color: #f8f8f8;
  color: #333;
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  }
`;

function InputArea({ value, onChange }) {
  return (
    <StyledInput
      value={value}
      onChange={onChange}
      placeholder="Enter your expression (e.g., (10 + 2) * 3)"
    />
  );
}

export default InputArea;
