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
  border: 1px solid #4c4c4c;
  border-radius: 10px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const StyledTableHeader = styled.th`
  border: 1px solid #4c4c4c;
  padding: 8px;
  text-align: left;
`;

const StyledTableCell = styled.td`
  border: 1px solid #4c4c4c;
  padding: 8px;
  text-align: left;
`;

function Interpreter() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState(null);
  const resultRef = useRef(null);
  const [tokens, setTokens] = useState([]);

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

  const lexer = (input) => {
    const tokenList = [];
    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      if (/\d/.test(char)) {
        tokenList.push({ value: char, type: "number" });
      } else if (/[+\-*/()]/.test(char)) {
        tokenList.push({ value: char, type: "operator" });
      } else if (/\s/.test(char)) {
        tokenList.push({value: char, type: "whitespace"})
      }
      else {
        tokenList.push({ value: char, type: "identifier" });
      }
    }
    return tokenList;
  };

  const handleChange = (e) => {
    const newExpression = e.target.value;
    setExpression(newExpression);
    setTokens(lexer(newExpression));
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
      <div className="title">NumberNoodle</div>
      <InputArea value={expression} onChange={handleChange} />
      <OutputArea result={result} ref={resultRef} />
      <StyledTable>
        <thead>
          <tr>
            <StyledTableHeader>Token</StyledTableHeader>
            <StyledTableHeader>Type</StyledTableHeader>
            <StyledTableHeader>Index</StyledTableHeader>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token, index) => (
            <tr key={index}>
              <StyledTableCell>{token.value}</StyledTableCell>
              <StyledTableCell>{token.type}</StyledTableCell>
              <StyledTableCell>{index}</StyledTableCell>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </StyledContainer>
  );
}

export default Interpreter;