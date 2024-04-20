import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "User is required"],
    },
    name: {
        type: String,
        required: [true, "Item name is required"],
    },
    description: {
        type: String,
        default: "",
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: [true, "Category is required"],
    },
    itemType:{
        type: String,
        enum: ["Veg", "Non-Veg", "Egg"],
        required: [true, "Category is required"],
    },
    inStock: {
        type: Boolean,
        default: true,
    },
    createdOn: {
        type: Date,
        default: Date.now,
    },
    });

const Item = mongoose.models.item || mongoose.model("item", itemSchema);

export default Item;