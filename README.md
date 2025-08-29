# Expo Chat App 📱💬

A modern, real-time chat application built with Expo (React Native) featuring a secure authentication, and subscription-based premium features.

## 🚀 Technologies Used

### Frontend
- **Expo** - React Native framework for cross-platform development
- **React Navigation** - Routing and navigation for React Native apps
- **TypeScript** - Type-safe JavaScript development
- **Zustand** - Lightweight state management
- **React Hook Form** - Form handling with validation
- **Zod** - Schema declaration and validation library

### Backend & Database
- **Supabase** - Open-source Firebase alternative with:
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication
  - Row Level Security (RLS)
- **PostgreSQL** - Powerful relational database

### Styling & UI
- **Neo-Brutalism Design** - Bold, modern UI with distinctive borders and clean aesthetics
- **React Native StyleSheet** - Component styling
- **Lucide React Native** - Beautiful & consistent icons

### Notifications
- **Expo Notifications** - Push notification system
- **Expo Device** - Device information for notifications

## ✨ Features

### Core Functionality
- 🔐 **Authentication System**
  - Email/password sign up and login
  - Secure session management
  - Automatic profile creation

- 💬 **Real-time Messaging**
  - Instant message delivery
  - Message history
  - Typing indicators

- 👥 **User Management**
  - User search functionality
  - One-on-one conversations
  - User profiles

### Premium Features
- 🚀 **Subscription System**
  - Freemium model with daily message limits
  - Premium tier with unlimited messaging
  - Simulated payment integration
  - Subscription management

- 🎨 **Enhanced UX**
  - Message reactions (emoji responses)... (coming soon)
  - Typing indicators
  - Push notifications

### Technical Excellence
- 🔒 **Security**
  - Row Level Security (RLS) policies
  - Secure authentication flows
  - Protected routes
  - Data validation with Zod

- ⚡ **Performance**
  - Optimized re-renders
  - Efficient real-time updates
  - Local state synchronization

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v20 or higher)
- Expo CLI (`npm install -g expo-cli`)
- Supabase account
- iOS Simulator (for iOS development) or Android Studio (for Android)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Peliah/chat-app.git
   cd chat-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create a .env file in the root directory
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database setup**
   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Run the SQL queries from `/lib/database/schema.sql` in the Supabase SQL editor
   - Enable real-time for the `messages`, `conversations`, and `typing_indicators` tables

5. **Start the development server**
   ```bash
   npx expo start
   ```

6. **Run on your preferred platform**
   ```bash
   # Press 'a' for Android or 'i' for iOS in the Expo CLI
   # Or use specific commands:
   npx expo run:android
   npx expo run:ios
   ```

## 🔧 Configuration

### Supabase Setup
1. Create a new project in Supabase
2. Get your project URL and anon key from Settings → API
3. Update your `.env` file with these values
4. Enable email authentication in Authentication → Settings
5. Set up redirect URLs for your app

### Push Notifications
For push notifications to work:
1. Configure push notification credentials for Expo
2. Set up notification channels for Android
3. Request notification permissions in your app

## 📱 Usage

### For Users
1. **Sign up** with your email address
2. **Search for users** using the search functionality
3. **Start conversations** by selecting a user
4. **Send messages** in real-time
5. **React to messages** with emojis by long-pressing
6. **Upgrade to Premium** if you need unlimited messaging

### For Developers
- The app follows a component-based architecture
- State is managed using Zustand stores
- All database operations go through Supabase client
- Real-time functionality uses Supabase subscriptions

## 🎯 Extra Feature: Typing Indicators

One of the standout features of this chat app is the **real-time typing indicators**. Here's how it works:

### Implementation Details
- Uses Supabase's real-time functionality to broadcast typing events
- Debounced input detection to avoid excessive updates
- Visual indicators showing when other users are typing
- Optimized to minimize database operations

### Technical Implementation
- **Database Table**: `typing_indicators` table tracks active typing sessions
- **Real-time Subscriptions**: Clients subscribe to typing events for each conversation
- **Optimization**: Automatic cleanup of typing indicators after inactivity
- **UI Components**: Custom `TypingIndicator` component shows animated dots

## 📁 Project Structure

```
app/
  (tabs)/          # Bottom tab navigation
  auth/            # Authentication screens
  chat-room/       # Individual chat screens
  subscription/    # Subscription management
components/
  ui/              # Reusable UI components
  auth/            # Authentication components
  chat/            # Chat-specific components
  subscription/    # Subscription components
hooks/             # Custom React hooks
lib/
  supabase/        # Supabase client configuration
  database/        # Database operations
  validation/      # Zod validation schemas
  constants/       # App constants and themes
stores/            # Zustand state stores
types/             # TypeScript type definitions
assets/            # Images, icons, and other assets
```

## 🔮 Future Enhancements

- [ ] File attachments and media sharing
- [ ] Group conversations
- [ ] Message encryption
- [ ] Voice messages
- [ ] Video calling integration
- [ ] Advanced notification preferences
- [ ] Message search functionality
- [ ] Dark/light theme toggle

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

We welcome contributions! Please feel free to submit issues, feature requests, or pull requests.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🆘 Support

If you encounter any problems or have questions:

1. Check the [Expo documentation](https://docs.expo.dev/)
2. Review the [Supabase documentation](https://supabase.com/docs)
3. Search existing GitHub issues
4. Create a new issue with detailed information about your problem

---

Built with ❤️ using Expo and Supabase