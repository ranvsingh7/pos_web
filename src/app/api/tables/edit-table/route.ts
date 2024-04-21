import { decodeJWT } from "@/helpers/getDecodedTokenData";
import { NextRequest, NextResponse } from "next/server";
import Table from "@/models/tableModel";


export async function PUT(req: NextRequest) {
    const token = req.cookies.get("token")?.value || '';
    
    try {
        const { id, isVacant, orderValue } = await req.json();
        const decoded = decodeJWT(token);
        const userId = decoded?.payload?.id;

        // Find the table by ID and user ID
        const tableToUpdate = await Table.findOne({ _id: id, userId: userId });

        if (!tableToUpdate) {
            return NextResponse.json({ error: "Table not found or unauthorized" }, { status: 404 });
        }

        // Update the fields
        tableToUpdate.isVacant = isVacant;
        tableToUpdate.orderValue = orderValue;

        // Save the updated table
        const updatedTable = await tableToUpdate.save();

        return NextResponse.json({
            message: "Table updated successfully",
            success: true,
            updatedTable
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}