import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import InputArea from "./InputArea";
import OutputArea from "./OutputArea";
import { gsap } from "gsap";
import { evaluate } from "mathjs";

const StyledContainer = styled.div`
  max-width: 600px;i
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

const HistoryContainer = styled.div`
  margin-top: 20px;
  padding: 10px;
  border-top: 1px solid #ccc;
`;

const StyledExpression = styled.div`
  font-size: 18px;
  margin-bottom: 10px;
  white-space: pre-wrap;
  word-wrap: break-word;
  span {
    font-weight: bold;
  }
  .number {
    color: blue;
  }
  .operator {
    color: red;
  }
`;

function Interpreter() {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [history, setHistory] = useState([]);
  const resultRef = useRef(null);

  const evaluateExpression = (expr) => {
    try {
      const sanitizedExpr = expr.replace(/[^\d+\-*/().\s]/g, "");
      const evaluatedResult = evaluate(sanitizedExpr);
      setResult(evaluatedResult);
      setHistory((prev) => [...prev, { expr, evaluatedResult }]);

      if (resultRef.current) {
        gsap.fromTo(
          resultRef.current,
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: "power2.out" }
        );
      }
    } catch (error) {
      setResult("Error: Invalid Expression");
    }
  };

  const lexer = (input) => {
    const regex = /\d*\.?\d+|[+\-*/()]|\s+/g;
    const tokenList = [];
    let match;
    while ((match = regex.exec(input)) !== null) {
      const value = match[0];
      let type = "identifier";

      if (/^\d*\.?\d+$/.test(value)) {
        type = "number";
      } else if (/[+\-*/()]/.test(value)) {
        type = "operator";
      } else if (/\s+/.test(value)) {
        type = "whitespace";
      }

      tokenList.push({ value, type, index: match.index });
    }
    return tokenList.filter((token) => token.type !== "whitespace");
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

  const getHighlightedExpression = () => {
    return tokens.map((token, index) => {
      let className = "";
      if (token.type === "number") className = "number";
      if (token.type === "operator") className = "operator";
      return (
        <span key={index} className={className}>
          {token.value}
        </span>
      );
    });
  };

  return (
    <StyledContainer>
      <div className="title">NumberNoodle</div>
      <InputArea value={expression} onChange={handleChange} />
      <StyledExpression>{getHighlightedExpression()}</StyledExpression>
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
              <StyledTableCell>{token.index}</StyledTableCell>
            </tr>
          ))}
        </tbody>
      </StyledTable>
      <HistoryContainer>
        <h3>History</h3>
        <ul>
          {history.map((entry, index) => (
            <li key={index}>
              {entry.expr} = {entry.evaluatedResult}
            </li>
          ))}
        </ul>
      </HistoryContainer>
    </StyledContainer>
  );
}

export default Interpreter;
