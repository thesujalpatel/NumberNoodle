import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import InputArea from "./InputArea";
import OutputArea from "./OutputArea";
import { gsap } from "gsap";

// ... (Styled components remain the same)

function Interpreter() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState(null);
  const resultRef = useRef(null);
  const [tokens, setTokens] = useState([]);

  const evaluateExpression = (expr) => {
    try {
      const sanitizedExpr = expr.replace(/[^\d+\-*/().\s]/g, "");
      const result = parseAndEvaluate(sanitizedExpr);
      setResult(result);

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

  const parseAndEvaluate = (expr) => {
    const tokens = tokenize(expr);
    const ast = buildAST(tokens);
    return evaluateAST(ast);
  };

  const tokenize = (expr) => {
    const tokens = [];
    let number = "";
    for (let char of expr) {
      if (/\d|\./.test(char)) {
        number += char;
      } else {
        if (number) {
          tokens.push(parseFloat(number));
          number = "";
        }
        if (/[+\-*/()]/.test(char)) {
          tokens.push(char);
        }
      }
    }
    if (number) {
      tokens.push(parseFloat(number));
    }
    return tokens;
  };

  const buildAST = (tokens) => {
    // Basic precedence handling (no full shunting-yard)
    const values = [];
    const operators = [];

    const applyOp = () => {
      const op = operators.pop();
      const b = values.pop();
      const a = values.pop();
      switch (op) {
        case "+":
          values.push(a + b);
          break;
        case "-":
          values.push(a - b);
          break;
        case "*":
          values.push(a * b);
          break;
        case "/":
          values.push(a / b);
          break;
        default:
          throw new Error("Invalid operator");
      }
    };

    for (let token of tokens) {
      if (typeof token === "number") {
        values.push(token);
      } else if (token === "(") {
        operators.push(token);
      } else if (token === ")") {
        while (operators[operators.length - 1] !== "(") {
          applyOp();
        }
        operators.pop(); // Remove "("
      } else if (/[+\-*/]/.test(token)) {
        while (
          operators.length &&
          /[*/]/.test(token) &&
          /[+\-*/]/.test(operators[operators.length - 1])
        ) {
          applyOp();
        }
        operators.push(token);
      }
    }
    while (operators.length) {
      applyOp();
    }
    return values[0];
  };

  const evaluateAST = (ast) => {
    return ast; // In this simplified case, the AST is the result
  };

  // ... (lexer and handleChange remain the same)

  useEffect(() => {
    evaluateExpression(expression);
  }, [expression, evaluateExpression]); // Add evaluateExpression to dependencies

  return (
    <StyledContainer>
      {/* ... (rest of the component) */}
    </StyledContainer>
  );
}

export default Interpreter;
