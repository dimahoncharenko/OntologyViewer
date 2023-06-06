import styled from "styled-components";

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  min-width: 60vw;
  gap: 1em;
`;

export const FormControl = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5em;
`;

export const FormLabel = styled.label`
  font-size: 1.1rem;
  font-weight: bold;
`;

export const FormInput = styled.input`
  padding: 0.5em;
  border-radius: 0.3em;
`;

export const FormSelect = styled.select`
  padding: 0.5em 1em;
`;

export const Container = styled.div`
  max-width: 90vw;
  margin: 2em auto;
`;
