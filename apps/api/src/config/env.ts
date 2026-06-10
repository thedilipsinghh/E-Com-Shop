import path from "path"
import dotenv from "dotenv"

dotenv.config({ path: path.resolve(process.cwd(), ".env") })

export const PRODUCTION = "production"

export const env = {
    JWT_KEY: process.env.JWT_KEY as string,
    PG_URL: process.env.PG_URL as string,
    PORT: process.env.PORT as string,
    NODE_ENV: process.env.NODE_ENV as string,
    LIVE_URL: process.env.LIVE_URL as string,
    LOCAL_URL: process.env.LOCAL_URL as string,
    OTP_EXPIRY: process.env.OTP_EXPIRY as string,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
    EMAIL: process.env.EMAIL as string,
    EMAIL_PASS: process.env.EMAIL_PASS as string,
    PRODUCTION: "production",
    COOKIE_NAME: "USER",
    FRONTEND_URL:
        process.env.NODE_ENV === "production"
            ? (process.env.LIVE_URL as string)
            : (process.env.LOCAL_URL as string)
}
