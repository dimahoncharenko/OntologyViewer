import styled from "styled-components";
import { Link } from "react-router-dom";

export const TwoColumnedList = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: 2em;
  align-items: center;
`;

export const PropsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-self: start;
  padding-left: 1em;
`;

export const MainHeading = styled.h1`
  font-size: 1.5rem;
`;

export const AddLink = styled(Link)`
  padding: 0.5em;
  border-radius: 0.3em;
  background-color: hsla(0deg, 0%, 0%, 0.3);
  border: 0.1em dashed black;
  align-self: flex-end;
  color: white;
`;
