# Testing Guide

## Testability Features

This project is designed with testability in mind:

### 1. **Separation of Concerns**

- Business logic separated from UI
- API calls abstracted in service layer
- Pure functions for filtering logic

### 2. **Component Isolation**

- Components receive props, easy to mock
- No global state dependencies
- Self-contained components

### 3. **Hook Testing**

- Custom hooks can be tested independently
- State logic separated from UI

### 4. **API Testing**

- RESTful endpoints are testable
- Controller functions are pure
- Easy to mock data

---

## Test Setup

### Frontend Testing (Vitest + React Testing Library)

**Install:**

```bash
cd Frontend
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

**Example Test: `Frontend/src/components/MetricsCards/__tests__/MetricsCards.test.jsx`**

```javascript
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import MetricsCards from "../MetricsCards";

describe("MetricsCards", () => {
  it("renders all metric cards", () => {
    const mockToggle = vi.fn();
    render(<MetricsCards activeCards={[]} onToggleFilter={mockToggle} />);

    expect(screen.getByText("Failed Runs")).toBeInTheDocument();
    expect(screen.getByText("Anomalous Runs")).toBeInTheDocument();
  });

  it("calls onToggleFilter when card is clicked", () => {
    const mockToggle = vi.fn();
    render(<MetricsCards activeCards={[]} onToggleFilter={mockToggle} />);

    const card = screen.getByText("Failed Runs").closest("button");
    card.click();

    expect(mockToggle).toHaveBeenCalledWith("failed");
  });
});
```

**Example Hook Test: `Frontend/src/hooks/__tests__/useTraces.test.js`**

```javascript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import useTraces from "../useTraces";
import * as tracesApi from "../../services/tracesApi";

vi.mock("../../services/tracesApi");

describe("useTraces", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches traces on mount", async () => {
    const mockData = { data: [], total: 0 };
    tracesApi.fetchTraces.mockResolvedValue(mockData);

    const { result } = renderHook(() => useTraces());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(tracesApi.fetchTraces).toHaveBeenCalled();
  });
});
```

### Backend Testing (Jest + Supertest)

**Install:**

```bash
cd Backend
npm install --save-dev jest supertest
```

**Update `package.json`:**

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "jest": {
    "testEnvironment": "node"
  }
}
```

**Example Test: `Backend/controllers/__tests__/traces.controller.test.js`**

```javascript
import { describe, it, expect, beforeEach } from "jest";
import { getTraces, getMetrics } from "../traces.controller";

describe("Traces Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {},
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
  });

  it("returns paginated traces", () => {
    req.query = { page: 1, limit: 10 };
    getTraces(req, res);

    expect(res.json).toHaveBeenCalled();
    const response = res.json.mock.calls[0][0];
    expect(response).toHaveProperty("data");
    expect(response).toHaveProperty("total");
    expect(response.data.length).toBeLessThanOrEqual(10);
  });

  it("filters traces by search", () => {
    req.query = { search: "001" };
    getTraces(req, res);

    const response = res.json.mock.calls[0][0];
    expect(response.data.every((t) => t.id.includes("001"))).toBe(true);
  });

  it("returns metrics", () => {
    getMetrics(req, res);

    expect(res.json).toHaveBeenCalled();
    const response = res.json.mock.calls[0][0];
    expect(response).toHaveProperty("failedRuns");
    expect(response).toHaveProperty("anomalousRuns");
  });
});
```

**Example Route Test: `Backend/routes/__tests__/traces.routes.test.js`**

```javascript
import request from "supertest";
import app from "../../app";

describe("Traces Routes", () => {
  it("GET /api/traces returns traces", async () => {
    const response = await request(app).get("/api/traces").expect(200);

    expect(response.body).toHaveProperty("data");
    expect(response.body).toHaveProperty("total");
  });

  it("GET /api/traces/metrics returns metrics", async () => {
    const response = await request(app).get("/api/traces/metrics").expect(200);

    expect(response.body).toHaveProperty("failedRuns");
    expect(response.body).toHaveProperty("anomalousRuns");
  });

  it("GET /api/traces?search=001 filters by ID", async () => {
    const response = await request(app)
      .get("/api/traces?search=001")
      .expect(200);

    expect(response.body.data.every((t) => t.id.includes("001"))).toBe(true);
  });
});
```

---

## Running Tests

### Frontend

```bash
cd Frontend
npm test
```

### Backend

```bash
cd Backend
npm test
```

---

## Test Coverage Goals

- **Components**: 80%+ coverage
- **Hooks**: 90%+ coverage
- **Services**: 85%+ coverage
- **Controllers**: 90%+ coverage
- **Routes**: 85%+ coverage

---

## Mocking Strategy

### Frontend

- Mock API calls in service layer
- Mock hooks for component testing
- Use MSW (Mock Service Worker) for integration tests

### Backend

- Mock file system for JSON data
- Mock request/response objects
- Test controller logic in isolation

---

## Integration Testing

Test the full flow:

1. User interaction → API call → Response → UI update
2. Filter combinations
3. Search functionality
4. Pagination
5. Error handling

---

**Note:** Test files are examples. Install dependencies and run tests as shown above.
