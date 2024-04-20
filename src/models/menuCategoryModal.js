import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "User is required"],
    },
    categoryName: {
        type: String,
        required: [true, "Category name is required"],
    },
    description: {
        type: String,
    },
    createdOn: {
        type: Date,
        default: Date.now,
    },
    });

const Category = mongoose.models.category || mongoose.model("category", categorySchema);

export default Category;