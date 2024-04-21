// Import necessary modules and models
import { NextRequest, NextResponse } from "next/server";
import Category from "@/models/menuCategoryModel"; // Assuming this is your Category model
// import Item from "@/models/menuItemModel"; // Assuming this is your Item model
import { decodeJWT } from "@/helpers/getDecodedTokenData";
import { connect } from "@/dbConfig/dbConfig";

connect();

export async function POST(req: NextRequest) {
    try {
        // Get token from request cookie
        const token = req.cookies.get("token")?.value || '';
        const decoded = decodeJWT(token);
        const userId = decoded?.payload?.id;

        if(!userId){
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        // Extract data from request body
        const { categoryId, itemName, description, price, category, mealCategory } = await req.json();

        // Check if the category belongs to the user
        const categoryExists = await Category.findOne({ _id: categoryId, userId });

        if (!categoryExists) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        // Create a new item
        const newItem = {
            itemName,
            description,
            price,
            category,
            mealCategory,
            categoryId
        };
        console.log("🚀 ~ POST ~ newItem:", newItem);

        // Save the new item
        // const savedItem = await newItem.save();
        // console.log("🚀 ~ POST ~ savedItem:", savedItem);

        // Push the new item's ID to the category's items array
        categoryExists.items.push(newItem);
        console.log("🚀 ~ POST ~ categoryExists:", categoryExists);

        // Save the updated category
        await categoryExists.save();

        return NextResponse.json({
            message: "Item added successfully",
            success: true,
            newItem: newItem
        });
    } catch (error) {
        // console.error("Error adding item:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
