// iyzico sandbox kimlik + istek doğrulaması (paymentPageUrl dönüyor mu?)
// node --env-file=.env.local scripts/test-iyzico.mjs
import Iyzipay from "iyzipay";

const iyzipay = new Iyzipay({
  apiKey: process.env.IYZICO_API_KEY,
  secretKey: process.env.IYZICO_SECRET_KEY,
  uri: process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com",
});

const req = {
  locale: "tr",
  conversationId: "test-" + Date.now(),
  price: "2999.00",
  paidPrice: "2999.00",
  currency: "TRY",
  basketId: "TEST-ORDER",
  paymentGroup: "PRODUCT",
  callbackUrl: "https://yigityetisken.example/api/odeme/callback",
  enabledInstallments: [1, 2, 3, 6],
  buyer: {
    id: "test-user",
    name: "Test",
    surname: "Üye",
    email: "test@yigityetisken.com",
    gsmNumber: "+905350000000",
    identityNumber: "11111111111",
    registrationAddress: "Online üyelik",
    city: "Istanbul",
    country: "Turkey",
    ip: "85.34.78.112",
  },
  shippingAddress: { contactName: "Test Üye", city: "Istanbul", country: "Turkey", address: "Online üyelik" },
  billingAddress: { contactName: "Test Üye", city: "Istanbul", country: "Turkey", address: "Online üyelik" },
  basketItems: [
    { id: "PKG1", name: "Online Koçluk · 3 Ay", category1: "Koçluk", itemType: "VIRTUAL", price: "2999.00" },
  ],
};

iyzipay.checkoutFormInitialize.create(req, (err, result) => {
  if (err) {
    console.error("HATA:", err);
    process.exit(1);
  }
  console.log("status        :", result.status);
  console.log("paymentPageUrl:", result.paymentPageUrl ? "VAR ✓" : "YOK ✗");
  console.log("token         :", result.token ? "VAR ✓" : "YOK ✗");
  if (result.errorMessage) console.log("errorMessage  :", result.errorMessage);
  process.exit(result.status === "success" ? 0 : 1);
});
