import styled from "styled-components";

export const VideoTileStyled = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  aspect-ratio: 16/9;
  border: 1px solid black;

  & > video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
