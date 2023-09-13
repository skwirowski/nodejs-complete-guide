import express from "express";
import Joi from "joi";

export const router = express.Router();

export type Course = { id: number; name: string };

const courses: Course[] = [
    { id: 1, name: "course 1" },
    { id: 2, name: "course 2" },
    { id: 3, name: "course 3" },
];

router.get("/", (req, res) => {
    res.send(courses);
});

router.get("/api/courses/:year/:month", (req, res) => {
    res.send(req.params);
});

router.get("/api/posts", (req, res) => {
    res.send(req.query);
});

router.get("/:id", (req, res) => {
    const course = courses.find(
        (course) => course.id === parseInt(req.params.id)
    );

    if (!course) {
        return res
            .status(404)
            .send("The course with the given ID does not exist");
    }

    res.send(course);
});

router.post("/", (req, res) => {
    const { error } = validateCourse(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name,
    };

    courses.push(course);

    res.send(course);
});

router.put("/:id", (req, res) => {
    const course = courses.find(
        (course) => course.id === parseInt(req.params.id)
    );

    if (!course) {
        return res
            .status(404)
            .send("The course with the given ID does not exist");
    }

    const { error } = validateCourse(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    course.name = req.body.name;
    res.send(course);
});

router.delete("/:id", (req, res) => {
    const course = courses.find(
        (course) => course.id === parseInt(req.params.id)
    );

    if (!course) {
        return res
            .status(404)
            .send("The course with the given ID does not exist");
    }

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
});

function validateCourse(course: Course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
    });

    return schema.validate(course);
}
