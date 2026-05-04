# RealEstateCRM

## Features
- Agent self-registration
- Admin creates admin/manager
- Admin approves or rejects agents
- Admin assigns manager to approved agent
- OTP login only
- JWT secured APIs
- Manager creates and assigns leads
- Agent views assigned leads

## IntelliJ Run Steps
1. Open this folder in IntelliJ as a Maven project.
2. Create MySQL database:
   ```sql
   CREATE DATABASE realestatecrm;
   ```
3. Update `src/main/resources/application.properties`:
   - MySQL username/password
   - Gmail SMTP username/app password
4. Reload Maven project.
5. Run `RealEstateCrmApplication`.

## First API calls
1. Create admin  
   `POST /api/admin/create-admin`
2. Send OTP for admin  
   `POST /api/auth/send-otp`
3. Verify OTP  
   `POST /api/auth/verify-otp`
4. Use returned JWT token for admin endpoints.

## Notes
- OTP is stored in the `users` table only.
- Only approved users can receive OTP and log in.
- `/api/admin/create-admin` is public for first-time setup.
- After first admin is created, you may want to protect that endpoint.
