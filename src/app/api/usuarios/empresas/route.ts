import { API_MAESTRANZA } from "@/variablesglobales";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    const usuario = req.nextUrl.searchParams.get('usuario')!.replace(/"/g, '')
    try {
        const response = await axios.get(
            API_MAESTRANZA + `/Usuarios/empresas/${usuario}`, {
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

export async function DELETE(req: NextRequest) {
    const referencia = req.nextUrl.searchParams.get('referencia')!.replace(/"/g, '')
    try {
        const response = await axios.delete(
            API_MAESTRANZA + `/Usuarios/empresas/${referencia}`, {
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

export async function POST(req: NextRequest) {
    const { usuario } = await req.json();
    try {
        const response = await axios.post(
            API_MAESTRANZA + `/Usuarios/empresas`, usuario, {
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