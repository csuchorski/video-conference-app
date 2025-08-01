import styled from "styled-components";

export const Button = styled.button<{ $color?: string }>`
  padding: 0.7em 1em;
  display: flex;
  align-items: center;
  border: none;
  border-radius: 16px;

  color: white;
  background: ${(props) => props.color || "royalblue"};

  cursor: pointer;
`;
