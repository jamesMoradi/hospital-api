# 🏥 Hospital Management System API

A full-featured backend REST API for a hospital management system built using **NestJS**, **MongoDB**, and **JWT authentication** with **Role-Based Access Control (RBAC)** for Admins, Doctors, and Patients.

---

## 🚀 Features

- 🛡️ JWT Authentication (Login)
- 🧑‍⚕️ Role-based access (Admin, Doctor, Patient)
- 📋 Appointment Booking (Patients)
- 🩺 Appointment Management (Doctors, Admin)
- 👤 Profile Management for Doctors and Patients
- 📝 Doctors can add special notes to patients
- 🔐 Admin can register users and manage all data
- 📄 Swagger documentation with request/response examples

---

## 🧑‍💻 Tech Stack

- **Backend**: [NestJS](https://nestjs.com/)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/)
- **Authentication**: JWT (Passport.js)
- **Documentation**: Swagger (OpenAPI)
- **Deployment**: [Render](https://render.com/)

---

## 🏗️ Modules Overview

| Module           | Description                              |
| ---------------- | ---------------------------------------- |
| **Auth**         | Handles login and JWT strategy           |
| **Users**        | Admin registers doctors and patients     |
| **Doctors**      | View & update profile, see appointments  |
| **Patients**     | View & update profile, book appointments |
| **Appointments** | Booking, viewing, and updating status    |

---

## 🔐 Roles and Permissions

| Role    | Capabilities                                                     |
| ------- | ---------------------------------------------------------------- |
| Admin   | Register users, view all doctors/patients/appointments           |
| Doctor  | View/update own profile, add notes to patients, see appointments |
| Patient | Book appointments, view/update own profile & history             |

---

## 📦 API Endpoints (Examples)

> Visit full docs at `/api/docs`

### 🔑 Auth

- `POST /auth/login` (User Login)

### 👤 Users

- `POST /users/register` (Admin only) (Register a new user)
- `DELETE /users/:id` (Admin only) (Delete a patient or doctor by Id)

### 👨‍⚕️ Doctors

- `GET /doctors/me` (Doctor) (Get profile of logged in doctor)
- `PATCH /doctors/me` (Doctor) (Update profile of logged in doctor)
- `GET /doctors/all` (Admin) (Get all registered doctors)
- `GET /doctors/:id` (Admin) (Get details of specific doctor by Id)

### 👨‍🦽 Patients

- `GET /patients/me` (Patient)
- `GET /patients/all`(Admin/Doctor) (Get all patients)
- `PATCH /patients/me` (Patient) (Update Patient Profile)
- `PATCH /patients/:id` (Doctor adds special note)

### 📅 Appointments

- `POST /api/appointments` (Patient books)
- `GET /api/appointments/me` (Doctor/Patient)
- `PATCH /api/appointments/:id` (Doctor updates status)
- `GET /api/appointments/all` (Admin)

---

## 📘 Swagger Access

You can interact with the API using Swagger:

> 🧪 [Swagger Docs](https://hospital-management-api-50kg.onrender.com/api/docs)

✅ Test login, create, update and fetch data  
✅ JWT Bearer Auth enabled  
✅ Role-based access testing

---

Hospital Management API
🛠️ Running Locally

1. Clone the repo
   bashgit clone https://github.com/your-username/hospital-management-api.git
   cd hospital-management-api
   npm install
2. Set up .env
   envMONGO_URI=your_mongo_connection_string
   JWT_SECRET=your_secret_key
3. Run the app
   bashnpm run start:dev
   👨‍💻 Author
   Zephan Philip

📧 Email: james.js.dev@outlook.com
