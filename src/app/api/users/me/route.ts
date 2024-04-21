import { getDataFromToken } from "@/helpers/getDataFromToken";

import  { NextRequest, NextResponse } from 'next/server'
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";


connect();

export async function GET(req: NextRequest) {
    try {
        const userId = await getDataFromToken(req);
        const user = await User.findOne({_id: userId}).select("-password");
        if(!user) {
            return NextResponse.json({error: "User not found"}, {status: 404});
        }
        return NextResponse.json({user});
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500});
    }

}