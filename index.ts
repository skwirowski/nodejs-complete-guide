import express from "express";
import Joi from "joi";

const app = express();
app.use(express.json());

const courses = [
    { id: 1, name: "course 1" },
    { id: 2, name: "course 2" },
    { id: 3, name: "course 3" },
];

/* Examples */

app.get("/", (req, res) => {
    res.send("Hello World!!!");
});

app.get("/api/courses", (req, res) => {
    res.send([1, 2, 3]);
});

app.get("/api/courses/:year/:month", (req, res) => {
    res.send(req.params);
});

app.get("/api/posts", (req, res) => {
    res.send(req.query);
});

/* get, post methods */

app.get("/api/courses/:id", (req, res) => {
    const course = courses.find(
        (course) => course.id === parseInt(req.params.id)
    );

    if (!course) {
        res.status(404).send("The course with the given ID does not exist");
    }

    res.send(course);
});

app.post("/api/courses", (req, res) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
    });

    const result = schema.validate(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name,
    };

    courses.push(course);

    res.send(course);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
