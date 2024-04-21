// Import necessary modules and models
import { NextRequest, NextResponse } from "next/server";
import Category from "@/models/menuCategoryModel"; // Assuming this is your Category model
import { decodeJWT } from "@/helpers/getDecodedTokenData";
import { connect } from "@/dbConfig/dbConfig";

connect();

interface Item {
    _id: string;
    itemName: string;
    description: string;
    price: number;
    category: string;
    mealCategory: string;
}

export async function PUT(req: NextRequest) {
    try {
        // Get token from request cookie
        const token = req.cookies.get("token")?.value || '';
        const decoded = decodeJWT(token);
        const userId = decoded?.payload?.id;

        if(!userId){
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        // Extract data from request body
        const { categoryId, itemId, itemName, description, price, category, mealCategory } = await req.json();

        // Find the category that contains the item
        const categoryExists = await Category.findOne({ _id: categoryId, userId });

        if (!categoryExists) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        // Find the index of the item in the category's items array
        const itemIndex = categoryExists.items.findIndex((item:Item) => item._id.toString() === itemId);

        if (itemIndex === -1) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }

        // Update the item
        categoryExists.items[itemIndex].itemName = itemName;
        categoryExists.items[itemIndex].description = description;
        categoryExists.items[itemIndex].price = price;
        categoryExists.items[itemIndex].category = category;
        categoryExists.items[itemIndex].mealCategory = mealCategory;

        // Save the updated category
        await categoryExists.save();

        return NextResponse.json({
            message: "Item updated successfully",
            success: true,
            updatedItem: category.items[itemIndex]
        });
    } catch (error) {
        console.error("Error updating item:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
