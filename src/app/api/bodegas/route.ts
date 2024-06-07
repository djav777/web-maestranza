import { API_MAESTRANZA } from "@/variablesglobales";
import axios from "axios";
import { debug } from "console";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const local = req.nextUrl.searchParams.get('local')
    console.log(local);
    try {
        const response = await axios.get(
            API_MAESTRANZA + `/Bodegas`, {
            params: {
                codigo: local
            },
            headers: {
                "Content-Type": req.headers.get('Content-Type') as string,
                "Authorization": req.headers.get('Authorization') as string
            }
        }
        );

        return NextResponse.json(response.data);
    } catch (error) {

        return NextResponse.json("Error");

    }
}