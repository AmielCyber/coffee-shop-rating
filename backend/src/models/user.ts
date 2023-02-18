import { Schema, Model, model, InferSchemaType } from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

// Schema
const schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  avatar: String,
});

export type User = InferSchemaType<typeof schema>;
// InferSchemaType will determine the type as follows:
// type User = {
//   name: string;
//   email: string;
//   avatar?: string;
// }

// `UserModel` will have `name: string`, etc.
const UserModel = model("User", schema);

export default UserModel;
