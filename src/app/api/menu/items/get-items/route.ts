import {connect} from "@/dbConfig/dbConfig";
import { decodeJWT } from "@/helpers/getDecodedTokenData";
import Categories from "@/models/menuCategoryModel";
import { NextRequest, NextResponse } from "next/server";

connect()

interface Item {
    itemName: string;
    description: string;
    price: number;
    category: string;
    mealCategory: string;
    categoryId: string;
}

export async function GET(req: NextRequest) {
    const token = req.cookies.get("token")?.value || '';
    const decoded = decodeJWT(token);
    const userId = decoded?.payload?.id;

    if(!userId){
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    try {
        const categories = await Categories.find({userId: userId});
        const items = categories.map(category => category.items).flat();

        return NextResponse.json(items);
    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}
