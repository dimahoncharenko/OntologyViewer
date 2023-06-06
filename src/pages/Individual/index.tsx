// Imports libraries
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import { useQuery } from "react-query";
import axios from "axios";
import * as yup from "yup";

// Imports styles
import {
  Form,
  FormControl,
  FormSelect,
  FormLabel,
  FormInput,
  Container,
} from "../../shared/styled";

// Imports utils
import { ONTOLOGY_IRI } from "../../utils/constants";

const validationSchema = yup.object({
  dataPropertyName: yup.string().required(),
  dataPropertyValue: yup.string().required(),
});

export const Individual = () => {
  const { name } = useParams();

  const returnBack = () => {
    window.history.back();
  };

  const { values, handleSubmit, handleChange, errors } = useFormik({
    initialValues: {
      dataPropertyName: "",
      dataPropertyValue: "",
    },
    validationSchema,
    onSubmit: async (values, helpers) => {
      await axios.post(
        "http://localhost:3040/api/v1/records/attach/dataProperty",
        {
          individualName: name,
          property: values.dataPropertyName,
          propertyValue: values.dataPropertyValue,
        }
      );

      helpers.resetForm();
    },
  });

  const { data, isLoading } = useQuery<IndividualDetails[]>({
    queryKey: ["Fetching details of the individual"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await axios.get<IndividualDetails[]>(
        `http://localhost:3040/api/v1/records/individuals/${name}`
      );

      return response.data;
    },
  });

  if (isLoading) return <p>Loading...</p>;

  const renderIndividualProps = (data: IndividualDetails[]) => {
    return data.map((item, index) => {
      switch (item.propertyType) {
        case "Class":
          return <p key={index}>Суперклас: {item.propertyValue}</p>;
        case "NamedIndividual":
          return <p key={index}>Тип: {item.propertyType}</p>;
        case "DataProperty":
          return (
            <p key={index}>
              Властивість даних: {item.propertyName} - {item.propertyValue}
            </p>
          );
      }
    });
  };

  return (
    <Container itemScope itemType={`${ONTOLOGY_IRI}${name}`}>
      <button onClick={returnBack}>Повернутись</button>
      <h1>{name}</h1>
      {data?.length && <div>{renderIndividualProps(data)}</div>}
      <Form onSubmit={handleSubmit}>
        <FormControl>
          <FormLabel htmlFor="dataPropertyName">Властивість даних: </FormLabel>
          <FormSelect
            id="dataPropertyName"
            value={values.dataPropertyName}
            onChange={(e) => handleChange(e)}
            defaultValue={"Виберіть властивість"}
            name="dataPropertyName"
          >
            <option value="Виберіть властивість">Виберіть властивість</option>
            {data?.length &&
              data.map((prop, index) =>
                prop.propertyName ? (
                  <option
                    style={{ padding: "1em" }}
                    itemProp={prop.propertyName}
                    key={index}
                    value={prop.propertyName}
                  >
                    {prop.propertyName}
                  </option>
                ) : null
              )}
          </FormSelect>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="dataPropertyValue">
            Значення властивості:{" "}
          </FormLabel>
          <FormInput
            type="text"
            id="dataPropertyValue"
            value={values.dataPropertyValue}
            onChange={handleChange}
            name="dataPropertyValue"
          />
        </FormControl>
        {errors.dataPropertyName}
        <button type="submit">Відправити</button>
      </Form>
    </Container>
  );
};
