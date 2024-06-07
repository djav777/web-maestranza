import { API_MAESTRANZA } from "@/variablesglobales";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const usuario = req.nextUrl.searchParams.get('codigo')
    const contraseña = req.nextUrl.searchParams.get('clave')

    try {
        debugger;
        console.log(req.headers.get('Authorization'))
        const response = await axios.post(
            API_MAESTRANZA + `/Usuarios/Login`, {
            codigo: usuario,
            clave: contraseña
        }, {
            headers: {
                "Content-Type": req.headers.get('Content-Type') as string,
                "Authorization": req.headers.get('Authorization') as string
            }
        });
        return NextResponse.json(response.data);
    } catch (error) {
        return NextResponse.json("Error Login");
    }
}