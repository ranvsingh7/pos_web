import {connect} from "@/dbConfig/dbConfig";
import { decodeJWT } from "@/helpers/getDecodedTokenData";
import Categories from "@/models/menuCategoryModel";
import { NextRequest, NextResponse } from "next/server";

connect()

export async function GET(req: NextRequest) {
    const token = req.cookies.get("token")?.value || '';
    const decoded = decodeJWT(token);
    const userId = decoded?.payload?.id;

    if(!userId){
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    try {
        const categories = await Categories.find({userId: userId});
        // console.log("🚀 ~ GET ~ tables:", tables)
        return NextResponse.json(categories);
    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}