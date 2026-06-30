import "server-only";
import Iyzipay from "iyzipay";

export function isIyzicoConfigured(): boolean {
  return Boolean(process.env.IYZICO_API_KEY && process.env.IYZICO_SECRET_KEY);
}

function client() {
  return new Iyzipay({
    apiKey: process.env.IYZICO_API_KEY!,
    secretKey: process.env.IYZICO_SECRET_KEY!,
    uri: process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com",
  });
}

export function initCheckoutForm(req: Record<string, unknown>): Promise<any> {
  const iyzipay = client();
  return new Promise((resolve, reject) => {
    iyzipay.checkoutFormInitialize.create(req, (err: unknown, result: any) =>
      err ? reject(err) : resolve(result)
    );
  });
}

export function retrieveCheckoutForm(token: string): Promise<any> {
  const iyzipay = client();
  return new Promise((resolve, reject) => {
    iyzipay.checkoutForm.retrieve({ locale: "tr", token }, (err: unknown, result: any) =>
      err ? reject(err) : resolve(result)
    );
  });
}
