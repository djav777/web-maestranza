import { API_MAESTRANZA } from "@/variablesglobales";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { NuevosCierres, Periodo, Empresa } = await req.json();
    try {
        const response = await axios.post(
            API_MAESTRANZA + `/Cierres/EditCierre`, {
            empresa: Empresa,
            periodo: Periodo,
            nuevosCierres: NuevosCierres
        },
            {
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