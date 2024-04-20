import {connect} from "@/dbConfig/dbConfig";
import { decodeJWT } from "@/helpers/getDecodedTokenData";
import Table from "@/models/tableModal";
import { NextRequest, NextResponse } from "next/server";

connect()

export async function GET(req: NextRequest) {
    const token = req.cookies.get("token")?.value || '';
    const decoded = decodeJWT(token);
    const userId = decoded?.payload?.id;

    try {
        const tables = await Table.find({userId: userId});
        // console.log("🚀 ~ GET ~ tables:", tables)
        return NextResponse.json(tables);
    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}