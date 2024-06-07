export interface IEmpresa{
    codigo: number; 
    rut:number; 
    dv:string; 
    nombre:string; 
    direccion:string; 
    ciudad:string; 
    comuna:string; 
    giro:string; 
    replegal:string; 
    rutreplegal:number; 
    dvrutreplegal:string; 
    controlila:number; 
    email:string; 
    password:string; 
    passwordcorp:string; 
    smtp:string;
    smtpcorp:string; 
    imap:string;
    imapcorp:string; 
    emailcorp:string; 
    puerto:number;
    puertocorp:number; 
    telefono:number; 
    rutusuariosii:number; 
    dvusuariosii:string; 
    codacteco:number; 
    codsucsii:number; 
    vbegresos:number; 
    nomsucsii:string; 
    fechares:string | undefined; 
    numerores:number; 
    baseCmaf:string; 
    ppm:number; 
    foliomensual:number; 
    centralizaManual:number,
    firmador:string,
    claveCert:string,
    smtpAuthenticate:number,
    smtpAuthenticatecorp:number,
    smtpUseSSL:number,
    smtpUseSSLcorp:number,
    bd:string,
    membrete:number,
    pop:string,
    popcorp:string,
    bdPassword:string,
    bdUser:string,
    bdPort:string,
    bdIp:string,
    usarItemsEmpresa:number,
}