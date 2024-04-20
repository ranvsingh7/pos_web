import {connect} from "@/dbConfig/dbConfig";
import Item from "@/models/menuItemModal";
import { NextRequest, NextResponse } from "next/server";
import { decodeJWT } from "@/helpers/getDecodedTokenData";

connect()

export async function POST(req: NextRequest) {

    const token = req.cookies.get("token")?.value || '';
    
    try {
        const reqBody = await req.json();
        const {name, description, price, categoryId, itemType } = reqBody;
        const decoded = decodeJWT(token);
        const userId = decoded?.payload?.id;

        // check if name already with the userId
        const itemNameAlready = await Item.findOne({name: name, userId: userId});

        if(itemNameAlready) {
            return NextResponse.json({error: "Item name already exists"}, {status: 400});
        }

        const newItem = new Item({
            userId: userId,
            name: name,
            description: description,
            price: price,
            categoryId: categoryId,
            itemType: itemType,
            createdOn: new Date()
        })

        const savedItem = await newItem.save();
        console.log("🚀 ~ POST ~ newItem:", savedItem)

        return NextResponse.json({
            message: "Item created successfully",
            success: true,
            savedItem

      }, );

    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}