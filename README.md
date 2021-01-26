JS validators benchmark

    "ajv": "^6.10.2",
    "joi": "^14.3.1",
    "yup": "^0.27.0",
    "superstruct": "^0.13.3"

Results:

1.1. invalid object:

    multi:
        ajv           21,269,626 ops/sec ±2.04% (83 runs sampled)
        superstruct   96,263     ops/sec ±0.49% (92 runs sampled)
        joi           66,070     ops/sec ±0.40% (95 runs sampled)
        yup           6,521      ops/sec ±1.54% (88 runs sampled)

    single:
        ajv:          0.638ms
        superstruct:  0.739ms
        joi:          1.538ms
        yup:          7.162ms

2.1. valid object:

    multi:
        ajv           6,789,583 ops/sec ±0.70% (90 runs sampled)
        superstruct   171,267   ops/sec ±0.27% (96 runs sampled)
        joi           124,382   ops/sec ±0.26% (94 runs sampled)
        yup           13,999    ops/sec ±1.27% (92 runs sampled)

    single:
        ajv:          0.680ms
        superstruct:  0.864ms
        joi:          3.482ms
        yup:          6.356ms

valid test object:

    const object = {
        name: "Name name",
        firstName: "Name",
        email: "email@email.com",
        phone: "12345678",
        age: 20,
    };

validation schema (all validation schemas are equal, this is just Joi example):

    const constraints1 = Joi.object({
        name: Joi.string().min(4).max(25).required(),
        email: Joi.string().email().required(),
        firstName: Joi.string(),
        phone: Joi.string(),
        age: Joi.number().integer().min(18).required(),
    });
