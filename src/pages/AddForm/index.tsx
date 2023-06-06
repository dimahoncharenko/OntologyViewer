// Imports libraries
import { useQuery } from "react-query";
import { useFormik } from "formik";
import axios from "axios";
import * as yup from "yup";

// Imports styles
import {
  Form,
  FormInput,
  FormLabel,
  FormSelect,
  FormControl,
} from "../../shared/styled";
import { Container } from "../../shared/styled";

const validationSchema = yup.object({
  propertyName: yup.string().required(),
  propertyRange: yup.string().required(),
  propertyDomain: yup.string().required(),
});

export const AddForm = () => {
  const { values, handleChange, handleSubmit } = useFormik({
    initialValues: {
      propertyName: "",
      propertyRange: "",
      propertyDomain: "",
    },
    validationSchema,
    onSubmit: async (state, helpers) => {
      await axios.post(
        "http://localhost:3040/api/v1/records/add/objectProperty",
        {
          propertyName: state.propertyName,
          propertyRange: state.propertyRange,
          propertyDomain: state.propertyDomain,
        }
      );

      helpers.resetForm();
    },
  });

  const { data, isLoading } = useQuery<Records>({
    queryKey: ["Fetching all records"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await axios.get<Records>(
        "http://localhost:3040/api/v1/records"
      );

      return res.data;
    },
  });

  const returnBack = () => {
    window.history.back();
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <Container>
      <button style={{ marginBottom: "1em" }} onClick={returnBack}>
        Повернутись
      </button>
      <Form onSubmit={handleSubmit}>
        <FormControl>
          <FormLabel htmlFor="propertyName">Ім'я властивості: </FormLabel>
          <FormInput
            type="text"
            id="propertyName"
            value={values.propertyName}
            onChange={handleChange}
            name="propertyName"
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="propertyDomain">
            Область визначення властивості:{" "}
          </FormLabel>
          <FormSelect
            id="propertyDomain"
            value={values.propertyDomain}
            onChange={(e) => handleChange(e)}
            name="propertyDomain"
          >
            {data?.length &&
              data.map((record, index) => (
                <option key={index} value={record.label}>
                  {record.label}
                </option>
              ))}
          </FormSelect>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="propertyRange">
            Область значень властивості:{" "}
          </FormLabel>
          <FormSelect
            id="propertyRange"
            value={values.propertyRange}
            onChange={(e) => handleChange(e)}
            name="propertyRange"
          >
            {data?.length &&
              data.map((record, index) => (
                <option key={index} value={record.label}>
                  {record.label}
                </option>
              ))}
          </FormSelect>
        </FormControl>
        <button type="submit">Додати</button>
      </Form>
    </Container>
  );
};
