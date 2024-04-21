//for reset password post request

import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs';



export async function POST(req: NextRequest) {
    try {
        const reqBody = await req.json();
        const {email, password} = reqBody;
        // console.log("🚀 ~ POST ~ reqBody:", reqBody)

        //check if user exists
        const user = await User.findOne({email})
        if(!user) {
            return NextResponse.json({error: "User does not exist"}, {status: 400});
        }

        //check if password is correct
        const validPassword = await bcryptjs.compare(password, user.password)
        if(!validPassword) {
            return NextResponse.json({error: "Invalid Current password"}, {status: 400});
        }

        //hash new password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(reqBody.newPassword, salt);

        //check previous password and new password are same

        if(await bcryptjs.compare(reqBody.newPassword, user.password)) {
            return NextResponse.json({error: "New password cannot be same as previous password"}, {status: 400});
        }

        //update password
        await User.findByIdAndUpdate(user._id, {password: hashedPassword});

        return NextResponse.json({
            message: "Password updated successfully",
            success: true
        })

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}