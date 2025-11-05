# Snapsi Frontend

A mobile social media application inspired by Instagram. This repository contains the frontend client, built with React Native and Expo.

## Features

- Infinite scroll media feed
- User authentication and profiles
- Image uploading and post creation
- Like and comment on posts
- Follow/Unfollow user system

## Built With

- **Core:** React Native, Expo, TypeScript
- **Data Fetching:** React Query for server state management, caching, and **infinite queries** for the feed.
- **UI & Animations:** React Native Reanimated & React Native Gesture Handler for high-performance animations and native gestures.

## Getting Started

### 1. Prerequisites

Ensure you have Node.js (LTS).

### 2. Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/manuel-avilam/snapsi-frontend.git
    cd snapsi-frontend
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**

    Create a `.env` file in the root directory and add your backend API endpoint:

    ```.env
    EXPO_PUBLIC_API_BASE_URL=https://your-backend-api.com/api
    ```

4.  **Run the project:**
    ```bash
    npm run start
    ```
