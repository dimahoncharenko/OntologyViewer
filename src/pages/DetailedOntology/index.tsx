// Imports libraries
import { useParams, Link } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";

// Imports components
import { Individual } from "../../components/Individual";

// Imports styles
import { Wrapper, PropsContainer, MainHeading, AddLink } from "./styled";

// Imports utils
import { ONTOLOGY_IRI } from "../../utils/constants";

export const DetailedOntology = () => {
  const { label } = useParams();

  const { data, isLoading } = useQuery<{
    meta: DetailedResponse;
    props: ObjectProperty[];
  }>({
    queryKey: ["Fetching an ontology"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await axios.all([
        axios.get(`http://localhost:3040/api/v1/records/${label}`),
        axios.get(`http://localhost:3040/api/v1/records/objects/${label}`),
      ]);

      return { meta: response[0].data, props: response[1].data };
    },
  });

  const { data: individuals } = useQuery<Individual[]>({
    queryKey: ["Fetching its individuals", label],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await axios.get<Individual[]>(
        `http://localhost:3040/api/v1/records/instances/${label}`
      );

      return response.data;
    },
  });

  if (isLoading || !data) return <p>Loading...</p>;

  console.log(individuals);

  return (
    <Wrapper itemScope itemType={`${ONTOLOGY_IRI}${label}`}>
      <AddLink to="/add">Додати властивість до класу</AddLink>
      <MainHeading>{label}</MainHeading>
      <PropsContainer>
        {data.meta?.length > 0 &&
          data.meta.map((ent, index) => (
            <p key={index}>
              <span
                style={{ textTransform: "capitalize" }}
                itemProp={ent.predicate}
              >
                {ent.predicate}
              </span>{" "}
              - <span>{ent.object}</span>
            </p>
          ))}
        {data.props?.length > 0 && (
          <>
            <p>Об'єктні властивості:</p>
            <ul>
              {data.props.map((prop, index) => (
                <li key={index} itemProp={prop.property}>
                  <span style={{ textTransform: "capitalize" }}></span>{" "}
                  <span>
                    <span>{prop.property}</span> -{" "}
                    <span itemType={`${ONTOLOGY_IRI}${prop.range}`}>
                      {prop.range}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </PropsContainer>
      <div style={{ width: "100%" }}>
        {individuals?.length > 0 &&
          individuals.map((ind, index) => (
            <Individual key={index} individual={ind} />
          ))}
      </div>

      <button>
        <Link to="/">Повернутись</Link>
      </button>
    </Wrapper>
  );
};
