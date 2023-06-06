type Records = {
  label: string;
  class: string;
  superclass?: string;
}[];

type Meta = {
  object: string;
  predicate: string;
};
type DetailedResponse = Meta[];

interface IndividualData {
  name: string;
  value: string;
}

interface Individual {
  individual: string;
  types: string[];
  data: IndividualData[];
  equivalentTo: string[];
  subClassOf: string[];
}

interface ObjectProperty {
  property: string;
  range: string;
}

interface DataProperty {
  property: string;
  value: string;
}

interface IndividualDetails {
  propertyType: "NamedIndividual" | "DataProperty" | "Class";
  propertyName?: string;
  propertyValue?: string | number;
}
