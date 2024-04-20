import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModal";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from 'bcryptjs';

connect()

export async function POST(req: NextRequest) {
    try {
        const reqBody = await req.json();
        const {username, email, password, mobile} = reqBody;

        const passwordSchema = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
        const mobileSchema = new RegExp("^[0-9]{10}$");

        console.log("🚀 ~ POST ~ reqBody:", reqBody)

        // Check if user already exists
        const emailAlready = await User.findOne({email: email});
        const usernameAlready = await User.findOne({username: username});
        const mobileAlready = await User.findOne({mobile: mobile});

        if(usernameAlready) {
            return NextResponse.json({error: "Username already exists"}, {status: 400});
        }
        else if(emailAlready) {
            return NextResponse.json({error: "Email already exists"}, {status: 400});
        } 
        else if(mobileAlready) {
            return NextResponse.json({error: "Mobile number already exists"}, {status: 400});
        }

        if(!mobileSchema.test(mobile)) {
            return NextResponse.json({error: "Mobile number must be 10 digits long"}, {status: 400});
        }

        if(!passwordSchema.test(password)) {
            return NextResponse.json({error: "Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one numeric digit, and one special character."}, {status: 400});
        }


        // Hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const newUser = new User({
            username: username,
            email: email,
            mobile: mobile,
            password: hashedPassword,
        })

        const savedUser = await newUser.save();
        console.log("🚀 ~ POST ~ savedUser:", savedUser)

        return NextResponse.json({
            message: "User created successfully",
            success: true,
            savedUser

      }, );

    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}