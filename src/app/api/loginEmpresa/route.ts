import { API_MAESTRANZA } from "@/variablesglobales";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const email = req.nextUrl.searchParams.get('email')
    const password = req.nextUrl.searchParams.get('password')

    try {
        const response = await axios.post(
            API_MAESTRANZA + `/auth/login`,
            { email: email, password: password },
        );
        return NextResponse.json(response.data);
    } catch (error) {
        return NextResponse.json('Error login Empresa');
    }
}