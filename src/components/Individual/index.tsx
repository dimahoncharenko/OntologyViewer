// Imports libraries
import { Link } from "react-router-dom";

// Imports styles
import { IndividualContainer, List } from "./styled";

// Imports utils
import { ONTOLOGY_IRI } from "../../utils/constants";

type Props = {
  individual: Individual;
};

export const Individual = ({ individual }: Props) => {
  return (
    <IndividualContainer
      itemScope
      itemType={`${ONTOLOGY_IRI}${individual.individual}`}
    >
      <div>
        Назва:
        <p>{individual.individual}</p>
      </div>
      <div>
        Типи:
        <List itemProp={individual.types[0]}>
          {individual.types.map((type, index) => (
            <li key={index}>{type}</li>
          ))}
        </List>
      </div>
      <div>
        Властивості даних:
        <List>
          {individual.data.map((dataProp, index) => (
            <li key={index}>
              <span itemProp={dataProp.name}>{dataProp.name}</span> -{" "}
              <span itemType={dataProp.value}>{dataProp.value}</span>
            </li>
          ))}
        </List>
      </div>
      <Link
        style={{ alignSelf: "center" }}
        to={`/individual/${individual.individual}`}
      >
        Перейти
      </Link>
    </IndividualContainer>
  );
};
