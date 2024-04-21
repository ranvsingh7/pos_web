import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: [true, "Item name is required"],
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
    },
    category: {
        type: String,
        required: [true, "Category is required"],
    },
    mealCategory: {
        type: String,
        required: [true, "Meal category is required"],
    },
    createdOn: {
        type: Date,
        default: Date.now,
    },
    });

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
    items: [itemSchema],
    createdOn: {
        type: Date,
        default: Date.now,
    },
    });
    categorySchema.path('items').default([]);


const Category = mongoose.models.category || mongoose.model("category", categorySchema);

export default Category;