const isValidTest = !true;

const validObj = {
  name: "Name name",
  firstName: "Name",

  email: "email@email.com",
  phone: "12345678",

  age: 20,
};

const invalidObj = {
  name: "qqq",
  firstName: 11111111,

  email: "email@email.com",
  phone: "12345678",

  age: 1,
};

console.log(isValidTest ? "valid" : "invalid");

const obj = isValidTest ? validObj : invalidObj;

const VALIDATIONS = {
  JOI: undefined,
  AGV: undefined,
  YUP: undefined,
  SUPER: undefined,
};
// ---- joi ----
const Joi = require("joi");

const constraintsJoi = Joi.object({
  name: Joi.string().min(4).max(25).required(),
  email: Joi.string().email().required(),
  firstName: Joi.string(),
  phone: Joi.string(),
  age: Joi.number().integer().min(18).required(),
});

VALIDATIONS.JOI = () => constraintsJoi.validate(obj);

// ---- ajv ----
const Ajv = require("ajv");
const ajv = new Ajv();

const constraintsAjv = {
  properties: {
    name: { type: "string", minLength: 4, maxLength: 25 },
    email: { type: "string", format: "email" },
    firstName: { type: "string" },
    phone: { type: "string" },
    age: { type: "integer", minimum: 18 },
  },
  required: ["name", "email", "age"],
};
const ajvValidation = ajv.compile(constraintsAjv);

VALIDATIONS.AGV = () => ajvValidation(obj);

// ---- yup ----
const yup = require("yup");

const constraintsYup = yup.object().shape({
  name: yup.string().min(4).max(25).required(),
  email: yup.string().email().required(),
  firstName: yup.string(),
  phone: yup.string(),
  age: yup.number().integer().min(18).required(),
});

VALIDATIONS.YUP = () => constraintsYup.isValidSync(obj);

// ----superstruct----
const S = require("superstruct");

function isEmail(value) {
  return /\S+@\S+\.\S+/.test(value);
}

const Email = S.define("Email", isEmail);

const constraintsSuper = S.object({
  name: S.size(S.string(), 4, 25),
  email: Email,
  firstName: S.optional(S.string()),
  phone: S.optional(S.string()),
  age: S.min(S.integer(), 18),
});

VALIDATIONS.SUPER = () => S.is(obj, constraintsSuper);

// --------

function suitTest() {
  const Benchmark = require("benchmark");
  const suite = new Benchmark.Suite();

  suite
    .add("ajv", function () {
      return VALIDATIONS.AGV();
    })
    .add("joi", function () {
      return VALIDATIONS.JOI();
    })
    .add("yup", function () {
      return VALIDATIONS.YUP();
    })
    .add("superstruct", function () {
      return VALIDATIONS.SUPER();
    })
    .on("cycle", function (event) {
      console.log(String(event.target));
    })
    .on("complete", function () {
      console.log("Fastest is " + this.filter("fastest").map("name"));
    })
    .run({ async: true });
}

function singleTest() {
  console.time("ajv");
  console.log(VALIDATIONS.AGV());
  console.timeLog("ajv");

  console.time("joi");
  console.log(!VALIDATIONS.JOI().error);
  console.timeLog("joi");

  console.time("yup");
  console.log(VALIDATIONS.YUP());
  console.timeLog("yup");

  console.time("superstruct");
  console.log(VALIDATIONS.SUPER());
  console.timeLog("superstruct");
}

singleTest();
suitTest();
