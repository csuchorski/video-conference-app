import styled from "styled-components";

export const ChatBoxStyled = styled.div`
  display: flex;
  height: 92vh;
  flex-direction: column;
  background-color: white;
  border-radius: 15px;
  padding: 0.7em;
`;

export const MessageInputStyled = styled.div`
  justify-self: flex-end;

  display: flex;
  align-items: center;
  padding-right: 5px;
  gap: 0.5rem;
  margin-top: auto;
  width: 100%;
  border: 2px solid ${(props) => props.theme.colors.main};
  background-color: transparent;
  border-radius: 20px;
  & > textarea {
    flex: 1;

    resize: none;
    padding: 0.8em;
    min-height: 3rem;
    max-height: 8rem;
    outline: none;
    border: none;
    border-radius: 20px;
    overflow-y: auto;
  }

  & > button {
    /* background-color: ${(props) => props.theme.colors.main}; */
    color: ${(props) => props.theme.colors.main};
    border: 1px solid ${(props) => props.theme.colors.main};
    border-radius: 15px;
    padding: 0.6rem 1rem;
    font-size: 0.95rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
`;

export const MessageListStyled = styled.div`
  flex: 1;
  flex-direction: column;
  line-height: 1;
  overflow-y: auto;
  padding-right: 0.5em;

  & > ul {
    list-style: none;
    width: 100%;
  }

  .message {
    margin-bottom: 0.4em;
  }

  .message-sender {
    font-size: 0.85rem;
    font-weight: 600;
  }

  .message-content {
    font-size: 0.95rem;
    word-break: break-word;
    overflow-wrap: break-word;
  }
`;
