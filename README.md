# Club Management System

A comprehensive platform for managing college clubs, events, and memberships.

## Features

### Authentication & User Management
- Secure authentication using NextAuth.js
- Role-based access control (Student, Coordinator, Admin)
- User profiles with registration numbers and departments
- Password-based and OAuth login options

### Club Management
- Club creation and approval workflow
- Club details including name, description, and status
- Club coordinator assignment
- Club status tracking (Pending, Approved, Rejected, Deactivated)
- Maximum limit of 5 clubs per student

### Membership Management
- Join request system for students
- Membership status tracking (Pending, Approved, Rejected)
- Coordinator approval/rejection of join requests
- Member count tracking
- Automatic membership status updates

### Event Management
- Event creation and management
- Event details (name, description, date, time, location)
- Maximum participant limits
- Event status tracking (Pending, Approved, Rejected)
- Event registration system
- Attendance tracking
- Event feedback collection
- Certificate generation for participants

### User Roles & Permissions

#### Student
- View approved clubs
- Request to join clubs (up to 5 clubs)
- View club events
- Register for events
- Submit event feedback
- View and download certificates
- View personal profile and club memberships

#### Coordinator
- Manage assigned clubs
- View club members and their status
- Approve/reject join requests
- Create and manage club events
- View event registrations and attendance
- Manage event feedback
- Generate certificates for participants
- View club statistics

#### Admin
- Create and manage coordinators
- View all clubs and their status
- Approve/reject clubs
- Assign/remove coordinators from clubs
- View all users and their roles
- Access system-wide statistics
- Manage all events and memberships
- View all feedback and certificates

## Technical Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, Shadcn UI
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite
- **Authentication**: NextAuth.js
- **State Management**: React Server Components
- **Styling**: Tailwind CSS, Shadcn UI Components

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
4. Initialize the database:
   ```bash
   bunx prisma migrate dev
   ```
5. Run the development server:
   ```bash
   bun dev
   ```

## Environment Variables

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## Database Schema

The system uses the following main models:
- User (Students, Coordinators, Admins)
- Club
- ClubMember
- Event
- EventRegistration
- Feedback
- Certificate

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
