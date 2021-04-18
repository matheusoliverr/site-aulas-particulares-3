CREATE TABLE "teachers" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "birth" timestamp NOT NULL,
  "avatar_url" text NOT NULL,
  "acting_area" text[] NOT NULL,
  "class_type" int NOT NULL,
  "education_level" text NOT NULL,
  "created_at" timestamp DEFAULT (now())
);

CREATE TABLE "students" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "birth" timestamp NOT NULL,
  "avatar_url" text NOT NULL,
  "grade" text NOT NULL,
  "email" text NOT NULL,
  "study_load" int NOT NULL,
  "teacher_id" int
);

ALTER TABLE "students" ADD FOREIGN KEY ("teacher_id") REFERENCES "teachers" ("id");

--restarting to use seed.js--

DELETE FROM students

DELETE FROM teachers

ALTER SEQUENCE teachers_id_seq RESTART WITH 1
ALTER SEQUENCE students_id_seq RESTART WITH 1
