# Activity Traces Dashboard

A full-stack web application for monitoring, filtering, and analyzing activity traces with a clean component-based architecture and lightweight Express.js API.

## 📋 Assignment Requirements

✅ **Component-based architecture** - Clean React component structure  
✅ **Lightweight API using Express.js** - RESTful API with Express  
✅ **Hard-coded JSON responses** - Using traces.json for data  
✅ **Clean component-based design** - Modular, reusable components  
✅ **Quality of APIs** - Well-structured REST endpoints  
✅ **Overall testability** - Testable architecture with separation of concerns

---

## 🏗️ Project Structure

```
task/
├── Backend/                    # Express.js API Server
│   ├── controllers/            # Business logic
│   │   └── traces.controller.js
│   ├── routes/                 # API routes
│   │   └── traces.routes.js
│   ├── data/                   # JSON data storage
│   │   └── traces.json
│   ├── app.js                  # Express app configuration
│   ├── server.js               # Server entry point
│   └── package.json
│
└── Frontend/                    # React Application
    ├── src/
    │   ├── components/         # Reusable components
    │   │   ├── MetricsCards/   # Summary metric cards
    │   │   ├── FiltersBar/     # Search and filters
    │   │   ├── TracesTable/    # Data table
    │   │   ├── Pagination/     # Page navigation
    │   │   ├── TraceDrawer/    # Detail view
    │   │   └── EmptyState/     # Empty state component
    │   ├── hooks/              # Custom React hooks
    │   │   └── useTraces.js
    │   ├── services/           # API service layer
    │   │   └── tracesApi.js
    │   ├── pages/              # Page components
    │   │   └── ObservePage.jsx
    │   └── main.jsx            # App entry point
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

### Installation & Running

#### 1. Backend Setup

```bash
# Navigate to backend directory
cd Backend

# Install dependencies
npm install

# Start the server
npm start

# Or for development with auto-reload
npm run dev
```

**Backend runs on:** `http://localhost:3000`

#### 2. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd Frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend runs on:** `http://localhost:5173`

#### 3. Access the Application

---

## 🎯 Features

### 1. Interactive Metric Cards

- **Failed Runs**: Count of failed executions
- **Anomalous Runs**: Detected unusual behaviors
- **Data Exposure Runs**: Runs that interacted with any data marked as `"hasSensitiveData": true` in the dataset&mdash;for example: credentials, financial information, or internal documents.
- **Runs Touching PII**: Runs that specifically accessed or processed Personally Identifiable Information `"isAnomalous": true,`(PII), such as names, email addresses, Social Security Numbers, and other unique identifiers.
- Click cards to toggle filters

### 2. Advanced Filtering

- **Search by Trace ID**: Search traces by ID (001-025)
- **Time Range Filter**: All Time, 1h, 24h, 7d, 30d
- **Active Filter Chips**: Visual representation with remove option
- **Column Visibility**: Toggle table columns

### 3. Responsive Data Table

- **Desktop**: Full-featured table with all columns
- **Mobile**: Card-based layout
- **Severity Indicators**: Color-coded borders (Red/Yellow/Green)
- **Clickable Trace IDs**: Open detailed view
- **Data Columns**:

  - **Steps**: Number of execution steps (from `trace.runSteps` in `traces.json`)
  - **LLM**: Number of LLM calls (from `trace.llmCalls` in `traces.json`)
  - **Tools**: Number of tool calls (from `trace.toolCalls` in `traces.json`)
  - **In Tokens**: Input token count (from `trace.inputTokens` in `traces.json`)
  - **Out Tokens**: Output token count (from `trace.outputTokens` in `traces.json`)

  **Note**: If these fields are not present in the trace data, the UI generates random values as fallback for demonstration purposes.

### 4. Trace Details Drawer

- Comprehensive trace information
- Execution stats and token usage
- Raw JSON viewer
- Copy to clipboard

### 5. Pagination

- Configurable items per page (10, 25, 50)
- First/Previous/Next/Last navigation
- Responsive design

### 6. Data Export

- CSV export functionality
- Export filtered data

---

## 🔌 API Endpoints

### Base URL

```
http://localhost:3000/api/traces
```

### Endpoints

#### 1. Get Traces

```
GET /api/traces
```

**Query Parameters:**

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search by Trace ID (e.g., "001", "025")
- `timeRange` (string): Time filter ("1h", "24h", "7d", "30d", "all")
- `activeCards` (string): JSON array of active card filters
- `status` (string): Filter by status ("success", "failed")
- `anomalous` (boolean): Filter anomalous traces
- `sensitive` (boolean): Filter sensitive data traces

**Example:**

```
GET /api/traces?page=1&limit=10&search=001&timeRange=all
```

**Response:**

```json
{
  "data": [...],
  "total": 25,
  "page": 1,
  "limit": 10
}
```

#### 2. Get Metrics

```
GET /api/traces/metrics
```

**Response:**

```json
{
  "failedRuns": 10,
  "anomalousRuns": 10,
  "dataExposureRuns": 10,
  "piiRuns": 10
}
```

---

## 🧩 Component Architecture

### Component Hierarchy

```
ObservePage (Main Container)
├── MetricsCards (Summary Cards)
├── FiltersBar (Search & Filters)
├── TracesTable (Data Display)
│   ├── MobileTraceCard (Mobile View)
│   └── TableRow (Desktop View)
├── Pagination (Navigation)
└── TraceDrawer (Detail View - Lazy Loaded)
```

### Component Responsibilities

**ObservePage.jsx**

- Main container component
- Manages global state (selectedTrace, visibleColumns)
- Coordinates child components

**MetricsCards.jsx**

- Displays 4 metric cards
- Fetches metrics from API
- Handles filter toggling

**FiltersBar.jsx**

- Search input with debounce
- Time range dropdown
- Column visibility toggle
- Filter chips display
- Download functionality

**TracesTable.jsx**

- Renders table (desktop) or cards (mobile)
- Handles column visibility
- Severity indicators
- Click handlers

**Pagination.jsx**

- Page navigation controls
- Items per page selector

**TraceDrawer.jsx**

- Side drawer for trace details
- Token usage visualization
- JSON viewer

**useTraces.js** (Custom Hook)

- Centralizes trace-related state
- Handles API calls
- Implements debounced search
- Provides clean API for components

---

## 🧪 Testability

### Architecture for Testing

The application is designed with testability in mind:

1. **Separation of Concerns**

   - Business logic in hooks
   - UI in components
   - API calls in services

2. **Pure Functions**

   - Filtering logic is testable
   - Utility functions are pure

3. **Component Isolation**

   - Components are self-contained
   - Props-based communication
   - Easy to mock dependencies

4. **API Abstraction**
   - Service layer for API calls
   - Easy to mock for testing

### Suggested Test Structure

```
Frontend/
├── src/
│   ├── components/
│   │   └── __tests__/          # Component tests
│   ├── hooks/
│   │   └── __tests__/          # Hook tests
│   └── services/
│       └── __tests__/          # API service tests

Backend/
├── controllers/
│   └── __tests__/              # Controller tests
└── routes/
    └── __tests__/              # Route tests
```

### Example Test Setup

**Install testing dependencies:**

```bash
# Frontend
cd Frontend
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest

# Backend
cd Backend
npm install --save-dev jest supertest
```

---

## 🛠️ Technology Stack

### Frontend

- **React 19.2.0** - UI library
- **Vite 7.2.4** - Build tool
- **Tailwind CSS** - Styling
- **Custom Hooks** - State management

### Backend

- **Node.js** - Runtime
- **Express.js 5.2.1** - Web framework
- **CORS** - Cross-origin resource sharing
- **JSON** - Data storage

---

## 📦 Dependencies

### Backend Dependencies

```json
{
  "express": "^5.2.1",
  "cors": "^2.8.5"
}
```

### Frontend Dependencies

```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0"
}
```

---

## 🎨 Design Principles

1. **Component Reusability**: Small, focused components
2. **Single Responsibility**: Each component has one job
3. **Separation of Concerns**: Logic separate from UI
4. **DRY Principle**: No code duplication
5. **Performance**: Memoization, debouncing, lazy loading
6. **Accessibility**: ARIA labels, keyboard navigation
7. **Responsive Design**: Mobile-first approach

---

## 🔍 Key Implementation Details

### Data Structure

The trace data is stored in `Backend/data/traces.json`. Each trace object can contain the following fields:

**Required Fields:**

- `id`: Unique trace identifier (e.g., "trace-001")
- `name`: Trace name/description
- `status`: Execution status ("success" or "failed")
- `isAnomalous`: Boolean indicating if trace is anomalous
- `hasSensitiveData`: Boolean indicating if trace contains sensitive data
- `agent`: Agent name
- `application`: Application name
- `duration`: Duration in milliseconds
- `timestamp`: ISO timestamp string

**Optional Fields (Displayed in UI):**

- `runSteps`: Number of execution steps (displayed in "Steps" column)
- `llmCalls`: Number of LLM calls (displayed in "LLM" column)
- `toolCalls`: Number of tool calls (displayed in "Tools" column)
- `inputTokens`: Input token count (displayed in "In Tokens" column)
- `outputTokens`: Output token count (displayed in "Out Tokens" column)

**Data Source:**

- The UI reads trace data from `Backend/data/traces.json` via the `/api/traces` endpoint
- If optional fields (`runSteps`, `llmCalls`, `toolCalls`, `inputTokens`, `outputTokens`) are missing from the JSON data, the frontend generates random fallback values for demonstration purposes
- These values are generated in:
  - `Frontend/src/components/TracesTable/TracesTable.jsx` (for table display)
  - `Frontend/src/components/TraceDrawer/TraceDrawer.jsx` (for drawer detail view)

### State Management

- Custom hook (`useTraces`) for centralized state
- No external state management library needed
- Clean API for components

### Performance Optimizations

- `React.memo()` for component memoization
- `useCallback()` for function memoization
- `useMemo()` for computed values
- Debounced search (300ms)
- Lazy loading for heavy components

### API Design

- RESTful endpoints
- Query parameter filtering
- Consistent response format
- Error handling

---

## 🐛 Troubleshooting

### Backend Issues

**Port already in use:**

```bash
# Change port in Backend/server.js
const PORT = 3001; // or any available port
```

**Module import errors:**

```bash
# Ensure package.json has "type": "module"
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Frontend Issues

**Port already in use:**

```bash
# Vite will automatically use next available port
# Or specify in vite.config.js
```

**Build errors:**

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 📝 Development Notes

### Adding New Features

1. **New Component**: Create in `src/components/`
2. **New API Endpoint**: Add route in `Backend/routes/`
3. **New Filter**: Update controller logic in `Backend/controllers/`

### Code Style

- Use functional components
- Prefer hooks over class components
- Use ES6+ features
- Follow React best practices
- Consistent naming conventions

---

## 🚀 Production Build

### Frontend Build

```bash
cd Frontend
npm run build
```

Output: `Frontend/dist/` (static files ready for deployment)

### Backend Production

```bash
cd Backend
npm start
```

---

## 📄 License

ISC

---

## 👤 Author

Activity Traces Dashboard - Assignment Project

---

## ✅ Assignment Checklist

- [x] Component-based architecture
- [x] Lightweight Express.js API
- [x] Hard-coded JSON responses
- [x] Clean component design
- [x] Quality API endpoints
- [x] Testable architecture
- [x] Comprehensive README
- [x] Working application
- [x] Responsive design
- [x] Error handling

---

**Status:** ✅ Complete and Ready for Submission
