import { decodeJWT } from "@/helpers/getDecodedTokenData";
import { NextRequest, NextResponse } from "next/server";
import Category from "@/models/menuCategoryModel";

export async function DELETE(req: NextRequest) {
    const token = req.cookies.get("token")?.value || '';

    try {
        const { categoryName, itemId } = await req.json();
        const decoded = decodeJWT(token);
        const userId = decoded?.payload?.id;

        if(!userId){
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        // console.log("🚀 ~ DELETE ~ categoryName", categoryName, itemId)

        const categoryToUpdate = await Category.findOne({ categoryName: categoryName, userId: userId });

        // console.log("🚀 ~ DELETE ~ categoryToUpdate", categoryToUpdate)

        const itemToDelete = categoryToUpdate?.items.find((item: any) => item._id == itemId);

        if (!itemToDelete) {
            return NextResponse.json({ error: "Item not found or unauthorized" }, { status: 404 });
        }

        const itemIndex = categoryToUpdate.items.findIndex((item: any) => item._id == itemId);

        categoryToUpdate.items.splice(itemIndex, 1);

        await categoryToUpdate.save();


        return NextResponse.json({
            message: "Table deleted successfully",
            success: true
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}