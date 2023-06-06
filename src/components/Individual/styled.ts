import styled from "styled-components";

export const IndividualContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr) 5em;
  align-items: baseline;
  padding: 1em;

  border: 0.1em dashed black;
`;

export const List = styled.ol`
  padding-left: 1em;
`;
