import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "User is required"],
    },
    tableNo: {
        type: Number,
        required: [true, "Table no. is required"],
    },
    tableName: {
        type: String,
        required: true,
    },
    isVacant: {
        type: Boolean,
        default: true,
    },
    orderValue:{
        type: Number,
        default: 0,
    },
    createdOn: {
        type: Date,
        default: Date.now,
    },
    });

const Table = mongoose.models.table || mongoose.model("table", tableSchema);

export default Table;