import { decodeJWT } from "@/helpers/getDecodedTokenData";
import { NextRequest, NextResponse } from "next/server";
import Category from "@/models/menuCategoryModel";


export async function PUT(req: NextRequest) {
    const token = req.cookies.get("token")?.value || '';
    
    try {
        const { categoryName, description, id } = await req.json();
        const decoded = decodeJWT(token);
        const userId = decoded?.payload?.id;

        if(!userId){
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        const category = await Category.findOne({ _id: id, userId: userId });

        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        const categoryAlready = await Category.findOne({ categoryName: categoryName, userId: userId });

        if (categoryAlready) {
            return NextResponse.json({ error: "Category name already exists" }, { status: 400 });
        }

        category.categoryName = categoryName;
        category.description = description;

        const updatedCategory = await category.save();

        return NextResponse.json({
            message: "Category updated successfully",
            success: true,
            updatedCategory
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}