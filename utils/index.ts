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

export function transformArray(
  inputArray: { individual: string; predicate: string; object: string }[]
): Individual[] {
  const outputArray: Individual[] = [];

  const individuals: {
    [individual: string]: {
      types: string[];
      data: IndividualData[];
      equivalentTo: string[];
      subClassOf: string[];
    };
  } = {};
  for (let item of inputArray) {
    const individual = item.individual.split("#")[1];
    const predicate = item.predicate.split("#")[1];

    if (!individuals[individual]) {
      individuals[individual] = {
        types: [],
        data: [],
        equivalentTo: [],
        subClassOf: [],
      };
    }

    if (predicate === "type") {
      individuals[individual].types.push(item.object.split("#")[1]);
    } else if (predicate === "equivalentClass") {
      individuals[individual].equivalentTo.push(item.object);
    } else if (predicate === "subClassOf") {
      individuals[individual].subClassOf.push(item.object.split("#")[1]);
    } else if (
      predicate !== "type" &&
      predicate !== "equivalentClass" &&
      predicate !== "subClassOf"
    ) {
      individuals[individual].data.push({
        name: predicate,
        value: item.object,
      });
    }
  }

  for (let individual in individuals) {
    outputArray.push({
      individual: individual,
      types: individuals[individual].types,
      data: individuals[individual].data,
      equivalentTo: individuals[individual].equivalentTo,
      subClassOf: individuals[individual].subClassOf,
    });
  }

  return outputArray;
}

export class CustomError extends Error {
  status = 500;
}

export class CredentialError extends CustomError {
  status = 400;
}

type ParsedIndDetails = {
  propertyType: "NamedIndividual" | "DataProperty" | "Class";
  propertyName?: string;
  propertyValue?: string | number;
}[];
type InitialIndDetails = {
  property: string;
  value: string | number;
}[];
export const transformIndividualDetails = (arr: InitialIndDetails) => {
  const transformedData: ParsedIndDetails = [];

  arr.forEach((item) => {
    if (item.property === "http://www.w3.org/1999/02/22-rdf-syntax-ns#type") {
      if (
        typeof item.value === "string" &&
        item.value.includes("NamedIndividual")
      ) {
        transformedData.push({ propertyType: "NamedIndividual" });
      } else if (
        typeof item.value === "string" &&
        item.value.includes("http://www.semanticweb.org/")
      ) {
        transformedData.push({
          propertyType: "Class",
          propertyValue: item.value,
        });
      }
    } else if (item.property.includes("http://www.semanticweb.org/")) {
      transformedData.push({
        propertyType: "DataProperty",
        propertyName: item.property,
        propertyValue: item.value,
      });
    }
  });

  return transformedData;
};

type ParsedClasses = {
  class: string;
  label: string;
  superclass?: string;
}[];
type InitialClasses = {
  class: string;
  superclass?: string;
}[];
export const transformClasses = (array: InitialClasses) => {
  const parsedResult: ParsedClasses = [];
  const regex = /#(.*)$/;

  array.forEach((item) => {
    if (item.class.startsWith("b")) return;
    const label = item.class.match(regex);
    const superclass = item.superclass ? item.superclass.match(regex) : null;

    let parsedItem: ParsedClasses[number] = {
      class: item.class,
      label: label ? label[1] : item.class,
      superclass: superclass ? superclass[1] : undefined,
    };

    parsedResult.push(parsedItem);
  });

  return parsedResult;
};

export const parseProps = <T>(array: T[]) => {
  const regex = /#(.*)$/;
  let parsedResult: Record<string, any>[] = [];
  parsedResult = array.map((obj: T) => {
    let map: Record<string, any> = {};

    for (let prop in obj) {
      const candidate = String(obj[prop]).match(regex);
      map[prop] = candidate ? candidate[1] : obj[prop];
    }

    return map;
  });

  return parsedResult;
};
