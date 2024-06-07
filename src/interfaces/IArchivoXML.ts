export interface IArchivoXML {
    rutemisor: string;
    razonsocial: string;
    tipodoc: number;
    numerodoc: number;
    fechadoc: string;
    afecto: number;
    exento: number;
    iva: number;
    total: number;
    email: string;
    fecharespuesta: string;
    estado: number;
    periodo: number;
    mes: number;
    noint: number;
    xmldte: string;

}


export interface EnvioDTE {
    SetDTE: SetDTE;
}
export interface SetDTE {
    Caratula: Caratula;
    DTE: [DTE];
    ID: string;
}
interface Caratula {
    RutEmisor: string;
    RutEnvia: string;
    RutReceptor: string;
    FchResol: string;
    NroResol: number;
    TmstFirmaEnv: string;
    SubTotDTE: {
        TpoDTE: number;
        NroDTE: number;
    };
    version: number;
}

export interface DTE {
    Documento: {
        Encabezado: Encabezado;
        Detalle: [Detalle];
        Referencia: Referencia;
        TED: {
            DD: {
                RE: string;
                TD: number;
                F: number;
                FE: string;
                RR: string;
                RSR: string;
                MNT: number;
                IT1: string;
                CAF: {
                    DA: {
                        RE: string;
                        RS: string;
                        TD: number;
                        RNG: {
                            D: number;
                            H: number;
                        };
                        FA: string;
                        RSAPK: {
                            M: string;
                            E: string;
                        };
                        IDK: number;
                    };
                    FRMA: {
                        "#text": string;
                        algoritmo: string;
                    };
                    version: number;
                };
                TSTED: string;
            };
            FRMT: {
                "#text": string;
                algoritmo: string;
            };
            version: number;
        };
        TmstFirma: string;
        ID: string;
    }
}


export interface Detalle {
    NroLinDet: number;
    CdgItem: {
        TpoCodigo: string;
        VlrCodigo: number;
    };
    NmbItem: string;
    DscItem: string | "";
    QtyItem: number | "";
    PrcItem: number | "";
    DescuentoMonto: number | "";
    DescuentoPct: number | "";
    MontoItem: number;
    UnmdItem: string;
}
export interface Encabezado {
    IdDoc: {
        TipoDTE: number;
        Folio: number;
        FchEmis: string;
    };
    Emisor: {
        RUTEmisor: string;
        RznSoc: string;
        GiroEmis: string;
        Acteco: number;
        DirOrigen: string;
        CmnaOrigen: string;
        CiudadOrigen: string;
    };
    Receptor: {
        RUTRecep: string;
        RznSocRecep: string;
        GiroRecep: string;
        DirRecep: string;
        CmnaRecep: string;
        CiudadRecep: string;
    };
    Totales: {
        MntNeto: number;
        TasaIVA: number;
        IVA: number;
        MntTotal: number;
        MntExe: number;
    };
};

export interface Referencia {
    NroLinRef: number;
    TpoDocRef: number;
    FolioRef: number;
    FchRef: string;
    RazonRef: string;
};

/*export interface IArchivoXML {

}

interface EnvioDTE {
    SetDTE: SetDTE;
}

interface SetDTE {
    caratula: any;
    dte: any;
}
interface DTE {

}
interface Documento {
    Encabezado: Encabezado;
    Detalle: Detalle;
}


//

interface Detalle {
    CdgItem: CdgItem;
    DscItem: string;
    MontoItem: number;
    NmbItem: string;
    NroLinDet: number;
    PrcItem: number;
    QtyItem: number;

}
interface CdgItem {
    TpoCodigo: string;
    VlrCodigo: string;
}
*/
//* Encabezado del XML
/*7
interface Encabezado {
    Emisor: Emisor;
    Receptor: Receptor;
    IdDoc: idDoc;
    Totales: Totales;
}
interface Emisor {
    Acteco: number;
    CiudadOrigen: string;
    CmnaOrigen: string;
    DirOrigen: string;
    GiroEmis: string;
    RUTEmisor: string;
    RznSoc: string;
}
interface Receptor {
    CiudadRecep: string;
    CmnaRecep: string;
    DirRecep: string;
    GiroRecep: string;
    RUTRecep: string;
    RznSocRecep: string;
}
interface idDoc {
    Folio: number;
    FchEmis: string;
    TipoDTE: number;
}

interface Totales {
    MntNeto: number;
    TasaIVA: number;
    IVA: number;
    MntTotal: number;
}
/*

IdDoc: {
    TipoDTE: number;
    Folio: number;
    FchEmis: string;
};
Emisor: {
    RUTEmisor: string;
    RznSoc: string;
    GiroEmis: string;
    Acteco: number;
    DirOrigen: string;
    CmnaOrigen: string;
    CiudadOrigen: string;
};
Receptor: {
    RUTRecep: string;
    RznSocRecep: string;
    GiroRecep: string;
    DirRecep: string;
    CmnaRecep: string;
    CiudadRecep: string;
};
*/