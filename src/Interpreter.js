// src/Interpreter.js
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import InputArea from "./InputArea";
import OutputArea from "./OutputArea";
import { gsap } from "gsap";
import { evaluate } from "mathjs";

const StyledContainer = styled.div`
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
`;

function Interpreter() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState(null);
  const resultRef = useRef(null);

  const evaluateExpression = (expr) => {
    try {
      const sanitizedExpr = expr.replace(/[^\d+\-*/().\s]/g, "");
      const evaluatedResult = evaluate(sanitizedExpr);
      setResult(evaluatedResult);
      if (resultRef.current) {
        gsap.fromTo(
          resultRef.current,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "power2.out" }
        );
      }
    } catch (error) {
      setResult("Error");
    }
  };

  const handleChange = (e) => {
    const newExpression = e.target.value;
    setExpression(newExpression);
  };

  useEffect(() => {
    if (expression.trim() !== "") {
      evaluateExpression(expression);
    } else {
      setResult(null);
    }
  }, [expression]);

  return (
    <StyledContainer>
      <InputArea value={expression} onChange={handleChange} />
      <OutputArea result={result} ref={resultRef} />
    </StyledContainer>
  );
}

export default Interpreter;
