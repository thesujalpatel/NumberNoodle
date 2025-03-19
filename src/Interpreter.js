 import React, { useState, useEffect, useRef } from "react";
 import styled from "styled-components";
 import InputArea from "./InputArea";
 import OutputArea from "./OutputArea";
 import { gsap } from "gsap";
 import { evaluate, parse } from "mathjs";

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
  const [tokens, setTokens] = useState();

  const evaluateExpression = (expr) => {
   try {
    const tree = parse(expr);
    // Basic semantic check: Ensure operators have valid operands (more can be added)
    tree.traverse(node => {
     if (node.isOperatorNode && node.args.length < node.fn.signature.split(',').length) {
      throw new Error(`Insufficient operands for operator ${node.op}`);
     }
    });

    const evaluatedResult = tree.evaluate();
    setResult(evaluatedResult);
    if (resultRef.current) {
     gsap.fromTo(
      resultRef.current,
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: "power2.out" }
     );
    }
   } catch (error) {
    setResult(`Error: ${error.message}`);
   }
  };

  const lexer = (input) => {
   const tokenList =;
   let i = 0;
   while (i < input.length) {
    const char = input[i];
    if (/\d/.test(char)) {
     let num = "";
     while (/\d|\./.test(input[i])) {
      num += input[i];
      i++;
     }
     tokenList.push({ value: num, type: "number", position: i - num.length });
     continue;
    } else if (/[+\-*/()]/.test(char)) {
     tokenList.push({ value: char, type: "operator", position: i });
    } else if (/\s/.test(char)) {
     tokenList.push({ value: char, type: "whitespace", position: i });
    } else {
     tokenList.push({ value: char, type: "identifier", position: i }); // Or 'invalid'
    }
    i++;
   }
   return tokenList;
  };

  const parser = (tokens) => {
   let parenCount = 0;
   for (const token of tokens) {
    if (token.type === "operator") {
     if (token.value === "(") {
      parenCount++;
     } else if (token.value === ")") {
      parenCount--;
      if (parenCount < 0) {
       throw new Error("Unbalanced parentheses");
      }
     }
    }
   }
   if (parenCount !== 0) {
    throw new Error("Unbalanced parentheses");
   }
  };

  const handleChange = (e) => {
   const newExpression = e.target.value;
   setExpression(newExpression);
   const newTokens = lexer(newExpression);
   setTokens(newTokens);
   try {
    parser(newTokens); // Perform syntax analysis
   } catch (error) {
    setResult(`Syntax Error: ${error.message}`);
    return;
   }
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
        <StyledTableCell>{token.position}</StyledTableCell>
       </tr>
      ))}
     </tbody>
    </StyledTable>
   </StyledContainer>
  );
 }

 export default Interpreter;
