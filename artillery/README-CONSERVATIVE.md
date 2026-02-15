# Conservative Load Test Configuration

This Artillery configuration is designed for safe, controlled testing with API limits in mind.

## Configuration

**Current Settings:**
- **Concurrent Requests:** 10
- **Total Iterations:** 5
- **Total Requests:** 50 (10 × 5)

## How to Modify

Edit `artillery/load-test-conservative.yml` and change these variables:

```yaml
variables:
  concurrentRequests: 10    # Change this number
  totalIterations: 5        # Change this number
```

**Important:** After changing the variables, you must also update the `arrivalCount` in the phases section:
```yaml
phases:
  - duration: 1
    arrivalCount: [concurrentRequests × totalIterations]
    maxVusers: [concurrentRequests]
```

### Examples

**25 total requests (5 concurrent, 5 iterations):**
```yaml
variables:
  concurrentRequests: 5
  totalIterations: 5

phases:
  - arrivalCount: 25
    maxVusers: 5
```

**100 total requests (20 concurrent, 5 iterations):**
```yaml
variables:
  concurrentRequests: 20
  totalIterations: 5

phases:
  - arrivalCount: 100
    maxVusers: 20
```

## Running the Test

```bash
npm run test:load-conservative
```

## What It Tests

Each request:
1. Submits the form with test address (4444 Weber Rd., 63123)
2. Validates the response contains expected results
3. Measures response time

## Expected Output

Artillery will show:
- Total requests sent
- Response time metrics (min, max, median, p95, p99)
- Success/error rates
- Validation results (address, geographic code, patron type)
