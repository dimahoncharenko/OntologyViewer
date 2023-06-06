import { Router } from "express";

import { graphDBEndpoint } from "../utils/connections";
import { checkParams } from "../utils/middlewares";
import {
  transformArray,
  CredentialError,
  transformIndividualDetails,
  parseProps,
  transformClasses,
} from "../utils";

const router = Router();

router.get("/", async (_, res) => {
  try {
    const allRecords = await graphDBEndpoint.query(
      `
      SELECT DISTINCT ?class ?superclass
      WHERE {
        ?class a owl:Class.
        OPTIONAL {
          ?class rdfs:subClassOf ?superclass .
        }
      }
      ORDER BY DESC(?superclass)
      `,
      {
        transform: "toJSON",
      }
    );

    if (allRecords.records instanceof Array) {
      const transformedResult = transformClasses(allRecords.records);
      console.log(transformedResult);
      res.json(transformedResult);
    } else {
      res.json([]);
    }
  } catch (err) {
    console.error(err);
    res.json(err);
  }
});

router.post(
  "/add",
  checkParams(["className", "subClass"]),
  async (req, res) => {
    try {
      const { className, subClass } = req.body;

      const result = await graphDBEndpoint.update(`
      INSERT DATA {
        my:${subClass} rdf:type owl:Class ;
          rdfs:subClassOf my:${className} .
      }
      `);

      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }
);

router.get("/:label", async (req, res) => {
  const { label } = req.params;

  const param = label.replaceAll(" ", "_");

  try {
    const meta = await graphDBEndpoint.query(
      `
      SELECT DISTINCT ?predicate ?object
      WHERE {
          ?entity a owl:Class .
          ?entity ?predicate ?object .
          FILTER (regex(str(?entity), "${param}", "i"))
      }
      `
    );

    if (meta.records instanceof Array) {
      const parsedResult = parseProps(meta.records);
      res.json(parsedResult);
    } else {
      res.json(null);
    }
  } catch (err) {
    console.error(err);
    res.json(err);
  }
});

router.get("/instances/:className", async (req, res) => {
  try {
    const { className } = req.params;

    const parsedClassName = className.replaceAll(" ", "_");

    const instances = await graphDBEndpoint.query(`
      SELECT ?individual ?predicate ?object
      WHERE {
        ?individual rdf:type/rdfs:subClassOf* my:${parsedClassName} .
        ?individual ?predicate ?object .
      }
      `);

    type Entity = {
      individual: string;
      predicate: string;
      object: string;
    };

    const rawResponse: Entity[] = instances.records;
    const parsedResponse = transformArray(rawResponse);

    res.json(parsedResponse);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get("/individuals/:name", async (req, res) => {
  try {
    const { name } = req.params;

    let parsedName = name;

    if (parsedName.includes("'")) {
      parsedName = name.replaceAll("'", "\\'");
    }

    const details = await graphDBEndpoint.query(`
      SELECT * WHERE {
        my:${parsedName} rdf:type owl:NamedIndividual .
        my:${parsedName} ?property ?value .
      }
    `);

    const formatedResult = transformIndividualDetails(details.records);
    const parsedResult = parseProps(formatedResult);

    res.json(parsedResult);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post(
  "/add/dataProperty",
  checkParams(["className", "dataPropertyName", "dataPropertyRange"]),
  async (req, res) => {
    try {
      const { className, dataPropertyName, dataPropertyRange } = req.body;

      const result = await graphDBEndpoint.update(`
        INSERT DATA {
          my:${dataPropertyName} rdf:type owl:DatatypeProperty ;
            rdfs:domain my:${className} ;
            rdfs:range ${dataPropertyRange}
        }
    `);

      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }
);

router.post(
  "/add/objectProperty",
  checkParams(["propertyName", "propertyRange", "propertyDomain"]),
  async (req, res) => {
    try {
      const { propertyName, propertyRange, propertyDomain } = req.body;

      const result = await graphDBEndpoint.update(`
        INSERT DATA {
          my:${propertyName} rdf:type owl:ObjectProperty ;
                         rdfs:domain my:${propertyDomain} ;
                         rdfs:range my:${propertyRange} .
        }
    `);

      res.json(result.success);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }
);

router.post(
  "/attach/objectProperty",
  checkParams(["className", "property", "targetClass"]),
  async (req, res) => {
    try {
      const { className, property, targetClass } = req.body;

      const classNameCandidate = await graphDBEndpoint.query(`
        SELECT ?class ?property ?targetClass WHERE {
            {?property rdf:type owl:ObjectProperty .
            FILTER (?property = my:${property})}
            UNION
            {?class rdf:type owl:Class .
            FILTER (?class = my:${className})}
            UNION
            {?targetClass rdf:type owl:Class .
            FILTER (?targetClass = my:${targetClass})}
          }
      `);

      if (classNameCandidate.total < 3)
        throw new CredentialError("Невірні параметри!");

      const insertion = await graphDBEndpoint.update(`
        INSERT DATA {
          my:${className} my:${property} my:${targetClass} .
        }
      `);

      res.json(insertion.success);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }
);

router.post(
  "/attach/dataProperty",
  checkParams(["individualName", "property", "propertyValue"]),
  async (req, res) => {
    try {
      const { individualName, property, propertyValue } = req.body;

      const insertion = await graphDBEndpoint.update(`
            DELETE {
                my:${individualName} my:${property} $old_value .
            }
            INSERT {
                my:${individualName} my:${property} "${propertyValue}" .
            }
            WHERE {
                my:${individualName} my:${property} $old_value .
            }
          `);

      res.json(insertion.success);
    } catch (err) {
      res.status(500).json({ error: err });
    }
  }
);

router.get("/objects/:className", async (req, res) => {
  try {
    const { className } = req.params;
    const parsedClassName = className.replaceAll(" ", "_");

    const result = await graphDBEndpoint.query(`
      SELECT DISTINCT ?property ?range
      WHERE {
        ?property a owl:ObjectProperty ;
                  rdfs:domain my:${parsedClassName} ;
                  rdfs:range ?range .
      }
    `);

    if (result.records instanceof Array) {
      const parsed = parseProps(result.records);
      res.json(parsed);
    } else {
      res.json(null);
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get("/dataProperties/:individual", async (req, res) => {
  try {
    const { individual } = req.params;

    const result = await graphDBEndpoint.query(`
        SELECT ?property ?value
        WHERE {
          my:${individual} ?property ?value .
          ?property rdf:type owl:DatatypeProperty .
        }
      `);

    if (result.records instanceof Array) {
      const parsed = parseProps(result.records);
      console.log(Object(parsed));
      res.json(parsed);
    } else {
      res.json(null);
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

export default router;