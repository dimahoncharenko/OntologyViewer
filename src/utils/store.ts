import { proxy } from "valtio";

type Node = {
  position: number[];
  label: string;
  superclass?: string;
};

type State = {
  nodes: Node[];
  showedText: boolean;
  showedRelations: boolean;
};
export const state = proxy<State>({
  nodes: [],
  showedText: false,
  showedRelations: false,
});
