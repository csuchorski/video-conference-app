import styled from "styled-components";

interface VideoContainerProps {
  columns: number;
  rows: number;
}

export const VideoContainer = styled.div<VideoContainerProps>`
  display: grid;
  align-items: center;
  width: 100%;
  height: 100%;
  grid-template-columns: repeat(${(props) => props.columns}, 1fr);
  grid-auto-rows: repeat(${(props) => props.rows}, 1fr);
  overflow: hidden;
  gap: 10px;
`;
