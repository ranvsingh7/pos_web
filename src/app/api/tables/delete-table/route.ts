// delete table by id

import { decodeJWT } from "@/helpers/getDecodedTokenData";
import { NextRequest, NextResponse } from "next/server";
import Table from "@/models/tableModal";

export async function DELETE(req: NextRequest) {
    const token = req.cookies.get("token")?.value || '';

    try {
        const { id } = await req.json();
        const decoded = decodeJWT(token);
        const userId = decoded?.payload?.id;

        // Find the table by ID and user ID
        const tableToDelete = await Table.findOne({ _id: id, userId: userId });

        //check if table has any orders or is not vacant

        if (tableToDelete.orderValue > 0 || !tableToDelete.isVacant) {
            return NextResponse.json({ error: "Table has orders or is not vacant" }, { status: 404 });
        }

        if (!tableToDelete) {
            return NextResponse.json({ error: "Table not found or unauthorized" }, { status: 404 });
        }

        // Delete the table
        await tableToDelete.deleteOne();

        return NextResponse.json({
            message: "Table deleted successfully",
            success: true
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}