import { cn } from "@/lib/utils";

type IconName =
  | "menu"
  | "close"
  | "cart"
  | "heart"
  | "shield"
  | "lock"
  | "spark"
  | "visa"
  | "mastercard"
  | "paypal"
  | "tng"
  | "ssl"
  | "mail"
  | "phone"
  | "wallet"
  | "globe"
  | "arrowUpRight"
  | "instagram"
  | "whatsapp";

type SiteIconProps = {
  name: IconName;
  className?: string;
};

export function SiteIcon({ name, className }: SiteIconProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={cn("h-5 w-5 shrink-0", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {name === "menu" ? (
        <>
          <path d="M4 7H20" />
          <path d="M4 12H20" />
          <path d="M4 17H20" />
        </>
      ) : null}
      {name === "close" ? (
        <>
          <path d="M6 6L18 18" />
          <path d="M18 6L6 18" />
        </>
      ) : null}
      {name === "cart" ? (
        <>
          <path d="M5.2 6.4H7.1L8.7 15.1H17.2L19 8.8H8" />
          <path d="M9.4 18.5H9.5" />
          <path d="M16.4 18.5H16.5" />
        </>
      ) : null}
      {name === "heart" ? (
        <path d="M12 20.4C12 20.4 4.8 15.7 4.8 10C4.8 7.62 6.72 5.7 9.1 5.7C10.53 5.7 11.87 6.4 12.7 7.58C13.53 6.4 14.87 5.7 16.3 5.7C18.68 5.7 20.6 7.62 20.6 10C20.6 15.7 13.4 20.4 13.4 20.4H12Z" />
      ) : null}
      {name === "shield" ? (
        <>
          <path d="M12 3L18.5 5.8V11.3C18.5 15.5 15.8 19.4 12 21C8.2 19.4 5.5 15.5 5.5 11.3V5.8L12 3Z" />
          <path d="M9.4 12.1L11.2 13.9L14.8 10.3" />
        </>
      ) : null}
      {name === "lock" ? (
        <>
          <rect x="5.5" y="11" width="13" height="9" rx="2.5" />
          <path d="M8.5 11V8.4C8.5 6.2 10.3 4.4 12.5 4.4C14.7 4.4 16.5 6.2 16.5 8.4V11" />
        </>
      ) : null}
      {name === "spark" ? (
        <>
          <path d="M12 3.8L13.6 9.4L19.2 11L13.6 12.6L12 18.2L10.4 12.6L4.8 11L10.4 9.4L12 3.8Z" />
          <path d="M18.6 4.8L19.2 6.6L21 7.2L19.2 7.8L18.6 9.6L18 7.8L16.2 7.2L18 6.6L18.6 4.8Z" />
        </>
      ) : null}
      {name === "visa" ? (
        <>
          <rect x="3.6" y="6.1" width="16.8" height="11.8" rx="2.2" />
          <path d="M8 9.2L6.8 14.8" />
          <path d="M10.4 9.2L12 14.8L13.6 9.2" />
          <path d="M16.2 9.2H18.4" />
          <path d="M16.8 12H18.1" />
        </>
      ) : null}
      {name === "mastercard" ? (
        <>
          <rect x="3.6" y="6.1" width="16.8" height="11.8" rx="2.2" />
          <circle cx="10.2" cy="12" r="2.6" />
          <circle cx="13.8" cy="12" r="2.6" />
        </>
      ) : null}
      {name === "paypal" ? (
        <>
          <rect x="3.6" y="6.1" width="16.8" height="11.8" rx="2.2" />
          <path d="M9 15V9.1H12.2C13.7 9.1 14.7 9.9 14.7 11.2C14.7 12.6 13.6 13.4 12.1 13.4H9" />
          <path d="M11 15V11.7H13.2" />
        </>
      ) : null}
      {name === "tng" ? (
        <>
          <rect x="3.6" y="6.1" width="16.8" height="11.8" rx="2.2" />
          <path d="M8 9.4H15.8" />
          <path d="M10.2 9.4V14.6" />
          <path d="M14.2 14.6V9.4L17 12.2V14.6" />
        </>
      ) : null}
      {name === "ssl" ? (
        <>
          <path d="M12 3.8L17.8 6.2V11.1C17.8 14.8 15.4 18.1 12 19.6C8.6 18.1 6.2 14.8 6.2 11.1V6.2L12 3.8Z" />
          <path d="M12 8.7V13.5" />
          <path d="M12 16.1H12.1" />
        </>
      ) : null}
      {name === "mail" ? (
        <>
          <rect x="4" y="6.2" width="16" height="11.6" rx="2.4" />
          <path d="M5.2 7.7L12 12.9L18.8 7.7" />
        </>
      ) : null}
      {name === "phone" ? (
        <>
          <path d="M8 4.8H11.2L12.4 7.8L10.9 9.3C11.7 10.9 13 12.2 14.7 13.1L16.2 11.6L19.2 12.8V16C19.2 16.9 18.5 17.6 17.6 17.6C11 17.2 5.6 11.8 5.2 5.2C5.2 5.2 5.2 5.2 5.2 5.2C5.2 4.3 5.9 3.6 6.8 3.6H8V4.8Z" />
        </>
      ) : null}
      {name === "wallet" ? (
        <>
          <rect x="3.6" y="6.1" width="16.8" height="11.8" rx="2.2" />
          <path d="M15.2 11.1H20.4V14.1H15.2C14.4 14.1 13.8 13.4 13.8 12.6C13.8 11.8 14.4 11.1 15.2 11.1Z" />
        </>
      ) : null}
      {name === "globe" ? (
        <>
          <circle cx="12" cy="12" r="8.2" />
          <path d="M4.2 12H19.8" />
          <path d="M12 3.8C14.2 6 15.4 8.7 15.4 12C15.4 15.3 14.2 18 12 20.2" />
          <path d="M12 3.8C9.8 6 8.6 8.7 8.6 12C8.6 15.3 9.8 18 12 20.2" />
        </>
      ) : null}
      {name === "arrowUpRight" ? (
        <>
          <path d="M7 17L17 7" />
          <path d="M9 7H17V15" />
        </>
      ) : null}
      {name === "instagram" ? (
        <>
          <rect x="4.2" y="4.2" width="15.6" height="15.6" rx="4.2" />
          <circle cx="12" cy="12" r="3.6" />
          <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
        </>
      ) : null}
      {name === "whatsapp" ? (
        <>
          <path d="M12 4.3C8.07 4.3 4.9 7.39 4.9 11.2C4.9 12.63 5.36 14.02 6.21 15.17L5.2 19.5L9.67 18.34C10.73 18.99 11.94 19.3 13.16 19.2C16.78 18.91 19.7 15.91 19.92 12.29C20.17 7.91 16.68 4.3 12 4.3Z" />
          <path d="M9.72 8.86H11.02L11.74 10.58L10.89 11.47C11.42 12.55 12.31 13.42 13.43 13.98L14.28 13.12L16 13.84V15.15C16 15.61 15.63 15.98 15.17 15.98C12.22 15.81 9.82 13.41 9.55 10.45C9.5 9.98 9.86 9.57 10.33 9.52L9.72 8.86Z" />
        </>
      ) : null}
    </svg>
  );
}
