import styled from "styled-components";

export const VideoTileStyled = styled.div`
    max-width: 200px;
    max-height: 150px;
    border: 1px solid black;

    & > video {
        max-width: 100%;
        max-height: 100%;
    }
`;
