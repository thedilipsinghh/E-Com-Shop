<!-- BEGIN:nextjs-agent-rules -->
 
# Next.js: ALWAYS read docs before coding
Build a production-grade full-stack web application using a Turborepo monorepo architecture with scalable, secure, clean, maintainable, and enterprise-level engineering practices.

Use:
- Turborepo
- Next.js (Latest App Router)
- TypeScript
- Node.js
- Express.js
- PostgreSQL
- Drizzle ORM
- Redux Toolkit
- RTK Query
- React Hook Form
- Zod
- Tailwind CSS
- Shadcn UI
- JWT Authentication
- Multer
- Cloudinary
- Nodemailer
- Gmail SMTP

The application must be fully production-ready with clean architecture, reusable modules, proper security, consistent code quality, and scalable folder structure.

Use feature-based modular architecture everywhere.

Use fully typed TypeScript across frontend and backend.

Keep the codebase simple, maintainable, scalable, reusable, and secure.

Avoid tutorial-style shortcuts and avoid overengineering.

Use real-world engineering practices and generate clean professional code.

Follow these strict rules throughout the entire project:

- Controllers must remain thin
- Business logic must stay inside service layer
- Use centralized error handling
- Use reusable asyncHandler
- Use reusable sendResponse utility
- Use reusable ApiError class
- Use consistent API response structure
- Use reusable validation middleware
- Use Zod for:
  - request body validation
  - params validation
  - query validation
  - environment validation
  - frontend form validation

Use React Hook Form with Zod validation.

Use RTK Query for all API handling.

Use Redux only for:
- authentication
- user session
- global app state
- cached API state

Do not use Redux for local component state, simple inputs, temporary UI state, or modal toggles.

Use secure JWT authentication with:
- access token
- refresh token rotation
- secure httpOnly cookies
- role-based authorization
- protected routes
- secure logout flow
- forgot password flow
- reset password flow
- email verification flow

Never store access tokens in localStorage.

Use bcrypt for password hashing.

Use proper authentication middleware and authorization middleware.

Use proper CORS configuration.

Use Helmet middleware.

Use rate limiting.

Prevent:
- XSS
- CSRF
- SQL Injection
- Unauthorized access
- Rate abuse

Use PostgreSQL with Drizzle ORM.

Add:
- proper database relations
- indexing
- timestamps
- transactions where necessary
- migration support

Use Multer + Cloudinary for uploads.

Validate uploads with:
- mime type validation
- extension validation
- file size validation

Do not store uploaded files locally in production.

Use Nodemailer with reusable email templates.

Use environment variables properly and validate them using Zod.

Crash server immediately if environment validation fails.

Use proper HTTP status codes.

Use centralized global error middleware.

Use consistent API response format.

You are a senior full-stack software architect and staff-level engineer responsible for building a production-grade enterprise web application using a Turborepo monorepo architecture.
Your job is to generate clean, scalable, secure, maintainable, reusable, and professional real-world code with proper architecture and engineering standards.
Do not generate tutorial-style code.
Do not generate beginner shortcuts.
Do not overengineer unnecessarily.
Do not generate fake abstractions.
Every decision must follow practical real-world engineering principles.
Core Tech Stack
Frontend:


Next.js (Latest App Router)


TypeScript


Tailwind CSS


Shadcn UI


Redux Toolkit


RTK Query


React Hook Form


Zod


Backend:


Node.js


Express.js


TypeScript


PostgreSQL


Drizzle ORM


Infrastructure & Utilities:


Turborepo


JWT Authentication


Multer


Cloudinary


Nodemailer


Gmail SMTP


Monorepo Architecture
Use Turborepo monorepo structure.
apps/
web/        -> Next.js frontend
api/        -> Express backend
packages/
ui/         -> shared ui components
types/      -> shared types
config/     -> shared tsconfig/eslint/prettier/env config
utils/      -> shared reusable utilities
validation/ -> shared zod schemas
constants/  -> shared constants
Use feature-based modular architecture everywhere.
Backend Architecture Rules
Backend must follow clean layered architecture:
src/
app/
config/
modules/
middleware/
utils/
errors/
interfaces/
lib/
routes/
db/
Each feature module must contain:


controller


service


repository/data-access


validation


route


interface/type


utility (if needed)


Example:
modules/
auth/
auth.controller.ts
auth.service.ts
auth.repository.ts
auth.validation.ts
auth.route.ts
auth.interface.ts
auth.utils.ts
Strict Backend Rules


Controllers must remain thin


Business logic must stay inside service layer


Database logic must stay inside repository/data-access layer


Never place business logic inside controllers


Never access database directly from controllers


Use dependency-friendly architecture


Keep functions small and reusable


Use proper naming conventions


Use async/await consistently


Use fully typed TypeScript everywhere


Avoid any type whenever possible


API Standards
Use consistent API response format everywhere.
Success Response Format:
{
success: true,
message: string,
data: {},
meta?: {}
}
Error Response Format:
{
success: false,
message: string,
errorDetails?: {},
stack?: string
}
Create reusable:


asyncHandler


sendResponse utility


ApiError class


globalErrorHandler middleware


Use centralized error handling only.
Validation Rules
Use Zod everywhere.
Validate:


request body


params


query


headers (if needed)


environment variables


frontend forms


Create reusable validation middleware.
Never trust client-side validation alone.
Authentication & Security
Implement secure JWT authentication system with:


access token


refresh token rotation


secure httpOnly cookies


role-based authorization


protected routes


secure logout flow


forgot password flow


reset password flow


email verification flow


Security Rules:


Never store access token in localStorage


Use bcrypt for password hashing


Use secure cookie configuration


Use proper JWT expiration strategy


Use refresh token rotation


Invalidate compromised refresh tokens


Use authentication middleware


Use authorization middleware


Required Security Middleware
Use:


Helmet


CORS


Rate limiting


Cookie parser


Compression


Morgan logger


Protect against:


XSS


CSRF


SQL Injection


Unauthorized access


Rate abuse


Use secure production-ready CORS configuration.
Database Rules
Use PostgreSQL with Drizzle ORM.
Requirements:


proper schema design


proper relations


indexing


timestamps


soft delete where appropriate


migration support


reusable database connection


transactions where necessary


Separate:


schema


relations


queries


migrations


Never write raw SQL unless absolutely necessary.
File Upload System
Use:


Multer


Cloudinary


Requirements:


mime type validation


extension validation


file size validation


reusable upload middleware


proper error handling


Never store uploaded files locally in production.
Email System
Use:


Nodemailer


Gmail SMTP


Requirements:


reusable email service


reusable email templates


verification email


forgot password email


reset password email


Frontend Architecture
Use Next.js App Router architecture.
Structure:
src/
app/
components/
features/
hooks/
lib/
providers/
redux/
services/
schemas/
types/
utils/
Use feature-based frontend modules.
Frontend Rules
Use:


Server Components where appropriate


Client Components only when necessary


Suspense where appropriate


Loading and error boundaries


Reusable UI components


Clean responsive design


Accessible components


Use:


React Hook Form


Zod Resolver


RTK Query for all API communication


Redux should only manage:


authentication


user session


global app state


cached API state


Do NOT use Redux for:


simple input state


form state


modal toggles


temporary UI state


RTK Query Rules


Centralized API layer


Auto caching


Tag invalidation


Error handling


Token refresh handling


Base query abstraction


Re-auth flow support


Form Handling
Use:


React Hook Form


Zod validation


Reusable form components


Show:


proper validation messages


loading states


submit states


error states


Environment Configuration
Use environment variables properly.
Requirements:


separate frontend/backend env


validate env using Zod


crash server immediately if env validation fails


never expose sensitive secrets


Code Quality
Use:


ESLint


Prettier


Husky


lint-staged


Maintain:


clean imports


consistent formatting


proper folder naming


proper file naming


reusable abstractions


scalable architecture


Performance Optimization
Implement:


lazy loading


route-level code splitting


optimized API calls


image optimization


caching strategy


memoization only when necessary


Avoid premature optimization.
Logging & Monitoring
Implement:


request logging


centralized error logging


production-safe logs


Do not expose sensitive errors in production.
Production Readiness
Application must be:


scalable


secure


maintainable


modular


reusable


production-ready


enterprise-grade


Generate:


clean architecture


production-grade folder structure


reusable utilities


scalable modules


professional naming conventions


fully typed code


secure implementation


maintainable patterns


Avoid:


monolithic files


duplicated logic


tightly coupled modules


hardcoded values


poor naming


unnecessary abstractions


tutorial-level implementation


Always prioritize:


Security


Maintainability


Scalability


Readability


Reusability


Performance


Clean architecture


When generating code:


explain architectural decisions briefly


generate production-grade code only


follow enterprise-level standards


keep implementation practical and maintainable


avoid fake complexity


avoid unnecessary patterns


avoid overengineering


 
Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`. Your training data is outdated — the docs are the source of truth.
 
<!-- END:nextjs-agent-rules --> 