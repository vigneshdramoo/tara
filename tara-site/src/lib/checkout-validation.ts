export type CheckoutFieldName =
  | "name"
  | "email"
  | "phone"
  | "address_line_1"
  | "city"
  | "zipcode"
  | "country";

export type CheckoutFieldErrors = Partial<
  Record<CheckoutFieldName, string>
>;

const fieldOrder: CheckoutFieldName[] = [
  "name",
  "email",
  "phone",
  "address_line_1",
  "city",
  "zipcode",
  "country",
];

export function validateCheckoutDetails(formData: FormData) {
  const value = (name: CheckoutFieldName) =>
    String(formData.get(name) ?? "").trim();
  const errors: CheckoutFieldErrors = {};

  if (!value("name")) errors.name = "Enter your full name.";

  const email = value("email");
  if (!email) errors.email = "Enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Enter a valid email address.";

  const phone = value("phone");
  const phoneDigits = phone.replace(/\D/g, "");
  if (!phone) errors.phone = "Enter your WhatsApp or phone number.";
  else if (
    !/^\+?[0-9][0-9\s().-]*$/.test(phone) ||
    phoneDigits.length < 8 ||
    phoneDigits.length > 15
  )
    errors.phone = "Enter a valid phone number with 8 to 15 digits.";

  if (!value("address_line_1"))
    errors.address_line_1 = "Enter your delivery address.";
  if (!value("city")) errors.city = "Enter your city.";
  if (!value("zipcode")) errors.zipcode = "Enter your postcode.";
  if (!value("country")) errors.country = "Enter your country.";

  return errors;
}

export function firstCheckoutError(errors: CheckoutFieldErrors) {
  return fieldOrder.find((name) => errors[name]);
}
