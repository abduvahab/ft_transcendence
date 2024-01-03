import * as QRCode  from "qrcode";

export const generateQRCode =(text:string):Promise<string>=>{
    return new Promise((resolve, reject)=>{
        QRCode.toString(text,{
            errorCorrectionLevel: 'H',
            type: 'svg'
          }, (err,data)=>{
            if (err) 
                reject(err);
            else
                resolve(data)
          })

    })
}
export const generateNumber =()=>{
    const min = Math.ceil(1);
    const max = Math.floor(100001);
    return Math.floor(Math.random() * (max - min) + min);
}


