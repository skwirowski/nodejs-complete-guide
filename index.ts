import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";

import { logger } from "./middleware/logger.js";
import { router as courses } from "./routes/courses.js";

const app = express();

app.use(express.json());

console.log("NODE_ENV: ", process.env.NODE_ENV);
console.log("app env: ", app.get("env"));

if (app.get("env") === "development") {
    app.use(morgan("dev"));
    app.use(logger);
}

app.use("/api/courses", courses);

mongoose
    .connect("mongodb://localhost/my_database")
    .then(() => console.log("Connected to MongoDB..."))
    .catch((error) => console.log("Could not connect to MongoDB. ", error));

const courseSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [String],
    date: { type: Date, default: Date.now },
    isPublished: Boolean,
});

const Course = mongoose.model("Course", courseSchema);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function createCourse() {
    const course = new Course({
        name: "Node.js course",
        author: "Paul",
        tags: ["node", "backend"],
        isPublished: true,
    });

    const result = await course.save();

    console.log(result);
}

// createCourse();

/**
 * Retrieve the entity, update it and then send it back updated to the DB
 */
async function queryFirstUpdateCourse(id: string) {
    const course = await Course.findById(id);

    if (!course) {
        return;
    }

    course.set({
        isPublished: true,
        author: "Someone else",
    });

    const result = await course.save();

    console.log("updateCourse: ", result);
}

queryFirstUpdateCourse("65095fcda5c72ec5644f9a73");

/**
 * Do not retrieve the entity, just update it directly in the DB
 */
async function updateFirstUpdateCourse(id: string) {
    const result = await Course.updateOne(
        { _id: id },
        {
            $set: {
                author: "Update First Author",
                isPublished: false,
            },
        }
    );

    const course = await Course.findByIdAndUpdate(id, {
        $set: {
            tags: ["react", "front-end", "update first"],
        },
    });

    console.log(result);
    console.log(course);
}

updateFirstUpdateCourse("6501b285e945e558573c1acc");

async function removeCourse(id: string) {
    // const result = await Course.deleteOne({_id: id})
    const course = await Course.findByIdAndRemove(id);

    console.log(course);
}

removeCourse("650abec698f97f316240478c");

async function getCourses() {
    /**
     * We can use comparison operators
     * We can use logical query operators
     * We can use regular expressions
     * */

    const PAGE_NUMBER = 2;
    const PAGE_SIZE = 10;

    const courses = await Course.find({ isPublished: true })
        .skip((PAGE_NUMBER - 1) * PAGE_SIZE)
        .limit(10)
        .sort({ name: 1 })
        .select({ name: 1, tags: 1 });

    console.log("getCourses: ", courses);
}

getCourses();

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
