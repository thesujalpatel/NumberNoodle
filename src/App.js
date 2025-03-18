// src/App.js
import React from "react";
import Interpreter from "./Interpreter";
import "./App.css";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    font-family: sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f0f0f0;
  }
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <Interpreter />
    </>
  );
}

export default App;
