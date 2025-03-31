# Hotel Booking - Synamedia

## Overview

This is the API for managing hotel bookings, including creating, modifying, canceling, and retrieving bookings. It also provides room initialization functionality.

## Base URL

```
{{BASE_URL}} = http://localhost:3000/api
```

## Setup

### 1. Clone the Repository

```sh
git clone https://github.com/devrakeshvsv/hotel-booking
cd hotel-booking
```

### 2. Install Dependencies

```sh
yarn
```

### 3. Start the Server

```sh
yarn start
```

Ensure that the server is running at `BASE_URL` before making requests.

## Endpoints

### 1. Bookings

#### Create Booking

- **Endpoint:** `POST /bookings`
- **Request Body:**

```json
{
  "name": "Rakesh Vishwakarma",
  "email": "rakesh8305666@gmail.com",
  "checkIn": "2025-04-01",
  "checkOut": "2025-04-02"
}
```

#### Get Bookings

- **Endpoint:** `GET /bookings?email=<email>`
- **Query Parameters:**
  - `email`: Email of the user

#### Get Ongoing Bookings

- **Endpoint:** `GET /bookings/ongoing-bookings`

#### Cancel Booking

- **Endpoint:** `PATCH /bookings/cancel`
- **Request Body:**

```json
{
  "email": "rakesh830566@gmail.com",
  "roomNumber": 101
}
```

#### Modify Booking

- **Endpoint:** `PATCH /bookings/modify`
- **Request Body:**

```json
{
  "email": "rakesh83056666@gmail.com",
  "roomNumber": 104,
  "checkIn": "2025-04-01",
  "checkOut": "2025-04-04"
}
```

### 2. Rooms

#### Initialize Dummy Rooms

- **Endpoint:** `POST /rooms/init-rooms`

## Environment Variables

To use this API, set up the environment variable:

- `BASE_URL`: The base URL of the API.

## Usage

You can import the Postman collection and test the API using Postman.

## Author

Rakesh Vishwakarma
