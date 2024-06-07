import { API_MAESTRANZA } from "@/variablesglobales";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const response = await axios.get(
            API_MAESTRANZA + `/Cuentas/resumen`, {
            params: {},
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