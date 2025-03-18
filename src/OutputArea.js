// src/OutputArea.js
import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

const StyledOutput = styled(motion.div)`
  width: 90%;
  padding: 15px;
  font-size: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin: 20px auto;
  text-align: center;
  font-family: monospace;
  background-color: #e0f7fa;
  color: #006064;
`;

function OutputArea({ result }) {
  return (
    <StyledOutput initial="hidden" animate={result ? "visible" : "hidden"}>
      {result !== null
        ? `Result: ${result}`
        : "Enter an expression to see the result"}
    </StyledOutput>
  );
}

export default OutputArea;
