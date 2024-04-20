import {connect} from "@/dbConfig/dbConfig";
import Table from "@/models/tableModal";
import { NextRequest, NextResponse } from "next/server";
import { decodeJWT } from "@/helpers/getDecodedTokenData";

connect()

export async function POST(req: NextRequest) {

    const token = req.cookies.get("token")?.value || '';
    
    try {
        const reqBody = await req.json();
        const {tableNo, tableName, isVacant, orderValue } = reqBody;
        const decoded = decodeJWT(token);
        const userId = decoded?.payload?.id;

        // check if tableNo and tableName already with the userId
        const tableNoAlready = await Table.findOne({tableNo: tableNo, userId: userId});
        const tableNameAlready = await Table.findOne({tableName: tableName, userId: userId});

        if(tableNoAlready) {
            return NextResponse.json({error: "Table number already exists"}, {status: 400});
        }
        else if(tableNameAlready) {
            return NextResponse.json({error: "Table name already exists"}, {status: 400});
        }



        const newTable = new Table({
            userId: userId,
            tableNo: tableNo,
            tableName: tableName,
            isVacant: isVacant,
            orderValue: orderValue,
            createdOn: new Date()
        })

        const savedTable = await newTable.save();
        console.log("🚀 ~ POST ~ newTable:", newTable)

        return NextResponse.json({
            message: "Table created successfully",
            success: true,
            savedTable

      }, );

    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}