// @ts-ignore
import enapso from "@innotrade/enapso-graphdb-client";
// @ts-ignore
import enapsoAdmin from "@innotrade/enapso-graphdb-admin";

export const graphDBEndpoint = new enapso.EnapsoGraphDBClient.Endpoint({
  baseURL: "http://localhost:3030",
  triplestore: "fuseki",
  repository: "Lab2",
  prefixes: [
    {
      prefix: "my",
      iri:
        "http://www.semanticweb.org/dima/ontologies/2023/4/untitled-ontology-8#",
    },
    {
      prefix: "rdfs",
      iri: "http://www.w3.org/2000/01/rdf-schema#",
    },
    {
      prefix: "rdf",
      iri: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    },
    {
      prefix: "owl",
      iri: "http://www.w3.org/2002/07/owl#",
    },
  ],
  transform: "toJSON",
});

export const uploadFromData: Function =
  enapsoAdmin.EnapsoGraphDBAdmin.uploadFromFile;

// export const graphdb = new enapsoAdmin.EnapsoGraphDBAdmin.Endpoint({
//   baseURL: "http://localhost:3030",
//   triplestore: "fuseki",
//   repository: "Lab2",
//   prefixes: [
//     {
//       prefix: "my",
//       iri:
//         "http://www.semanticweb.org/dima/ontologies/2023/4/untitled-ontology-8#",
//     },
//     {
//       prefix: "rdfs",
//       iri: "http://www.w3.org/2000/01/rdf-schema#",
//     },
//     {
//       prefix: "rdf",
//       iri: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
//     },
//     {
//       prefix: "owl",
//       iri: "http://www.w3.org/2002/07/owl#",
//     },
//   ],
//   transform: "toJSON",
// });
