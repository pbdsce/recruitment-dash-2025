# Recruitment Dashboard

A comprehensive, modern dashboard for managing and analyzing recruitment applications. Built with Next.js 15, React 19, TypeScript, Tailwind CSS, and MongoDB.

## Features

### 📊 **Analytics & Insights**

- Real-time statistics cards showing total applications, monthly trends, and top branches
- Interactive charts for data visualization (bar charts, doughnut charts)
- Applications breakdown by year of study and branch
- Recent applications tracking

### 🔍 **Advanced Search & Filtering**

- Global search across name, email, college ID, and phone number
- Filter by year of study and branch
- Sort by various criteria (date, name, year, branch)
- Collapsible advanced filters interface
- Real-time search with debouncing

### 📋 **Data Management**

- Comprehensive data table with pagination
- Expandable rows for detailed applicant information
- Responsive design for all screen sizes
- Dark mode support
- Export capabilities (ready for implementation)

### 🎨 **Modern UI/UX**

- Clean, intuitive interface
- Responsive design for mobile, tablet, and desktop
- Dark/light mode support
- Loading states and empty states
- Smooth animations and transitions

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Mongoose
- **Charts**: Custom Canvas-based charts
- **Icons**: Heroicons (SVG)

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd recruitment-dash
```

2.Install dependencies:

```bash
npm install
```

3.Set up environment variables:
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_MONGODB_URI=mongodb://localhost:27017/recruitment-dash
```

For MongoDB Atlas:

```env
NEXT_PUBLIC_MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/recruitment-dash?retryWrites=true&w=majority
```

4.Run the development server:

```bash
npm run dev
```

1. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Data Model

The recruitment data includes:

- **Personal Info**: Name, email, WhatsApp number
- **Academic Info**: College ID, year of study, branch
- **Additional**: About section, timestamps
- **Validation**: Email format, phone number format, college ID format based on year

## API Endpoints

### GET `/api/recruitment`

Fetch recruitment data with pagination, search, and filtering.

**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search term
- `year`: Filter by year of study
- `branch`: Filter by branch
- `sortBy`: Sort field (createdAt, name, year_of_study, branch)
- `sortOrder`: Sort direction (asc, desc)

### GET `/api/recruitment/analytics`

Get analytics data for charts and statistics.

### POST `/api/recruitment`

Create a new recruitment entry.

## Project Structure

```bash
src/
├── app/
│   ├── api/recruitment/     # API routes
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Dashboard page
├── components/             # React components
│   ├── AnalyticsChart.tsx  # Chart component
│   ├── DataTable.tsx       # Data table component
│   ├── SearchAndFilters.tsx # Search and filter component
│   └── StatsCard.tsx       # Statistics card component
├── lib/
│   └── dbConnect.ts        # Database connection
└── models/
    └── Recruitment.ts      # Mongoose model
```

## Features in Detail

### Search & Filtering

- **Global Search**: Searches across name, email, college ID, and phone number
- **Year Filter**: Filter by 1st, 2nd, 3rd, or 4th year students
- **Branch Filter**: Filter by specific engineering branches
- **Sorting**: Sort by application date, name, year, or branch
- **Real-time**: All filters update results in real-time

### Data Visualization

- **Stats Cards**: Key metrics at a glance
- **Bar Charts**: Applications by year of study
- **Doughnut Charts**: Applications by branch distribution
- **Responsive Charts**: Automatically adapt to screen size

### Data Table

- **Pagination**: Navigate through large datasets
- **Expandable Rows**: View full applicant details
- **Responsive**: Works on all screen sizes
- **Sorting**: Click column headers to sort
- **Loading States**: Smooth loading indicators

## Customization

### Adding New Fields

1. Update the `RecruitmentData` interface in `src/models/Recruitment.ts`
2. Update the Mongoose schema
3. Add the field to the data table component
4. Update search functionality if needed

### Styling

The dashboard uses Tailwind CSS with a custom design system. Key design tokens:

- Primary colors: Blue palette
- Dark mode: Gray palette
- Spacing: Consistent 4px grid
- Typography: Geist font family

### Adding New Chart Types

Extend the `AnalyticsChart` component to support new chart types by adding new drawing functions.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [Apache 2.0 License](LICENSE).
