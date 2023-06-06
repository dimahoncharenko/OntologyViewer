import styled from "styled-components";

type TitleProps = {
  hidden?: boolean;
};
export const Title = styled.a<TitleProps>`
  opacity: 0;
  font-weight: bolder;
  font-weight: 0.1rem;
  cursor: pointer;

  opacity: ${(props) => (!props.hidden ? 1 : 0)};
`;

export const OntologyBar = styled.div`
  position: absolute;
  top: -50vh;
  left: 50%;
  transform: translateX(-50%);

  display: flex;
  align-items: center;

  gap: 0.5em;
`;

export const OntologyLabel = styled.p`
  min-width: 10em;
  padding: 1em;
  background-color: hsla(0deg, 0%, 100%, 0.3);
  border-radius: 1.3em;
  text-align: center;
`;

type SwitchButtonProps = {
  isShowed: boolean;
};
export const SwitchButton = styled.div<SwitchButtonProps>`
  display: flex;
  flex-direction: column;
  margin: 0.3em;
  align-items: center;
  border: 0.1em dashed lightgray;
  border-radius: 1em;
  white-space: nowrap;
  padding: 0.2em 0.5em;

  & > input[type="checkbox"] {
    display: flex;
    align-items: center;
    justify-content: center;
    appearance: none;
    width: 1.3em;
    height: 1.3em;
    border-radius: 50%;
    background-color: white;
    cursor: pointer;

    &::before {
      content: " ";
      display: ${(props) => (props.isShowed ? "flex" : "none")};
      width: 85%;
      height: 85%;
      border-radius: 50%;
      background-color: black;
    }
  }
`;
