import {connect} from "@/dbConfig/dbConfig";
import Category from "@/models/menuCategoryModel";
import { NextRequest, NextResponse } from "next/server";
import { decodeJWT } from "@/helpers/getDecodedTokenData";

connect()

export async function POST(req: NextRequest) {

    const token = req.cookies.get("token")?.value || '';
    
    try {
        const reqBody = await req.json();
        const {categoryName, description } = reqBody;
        const decoded = decodeJWT(token);
        const userId = decoded?.payload?.id;

        if(!userId){
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        // check if tableNo and tableName already with the userId
        const categoryNameAlready = await Category.findOne({categoryName: categoryName, userId: userId});

        if(categoryNameAlready) {
            return NextResponse.json({error: "Category name already exists"}, {status: 400});
        }

        const newCategory = new Category({
            userId: userId,
            categoryName: categoryName,
            description: description,
            createdOn: new Date()
        })

        const savedCategory = await newCategory.save();
        console.log("🚀 ~ POST ~ newCategory:", savedCategory)

        return NextResponse.json({
            message: "Category created successfully",
            success: true,
            savedCategory

      }, );

    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}