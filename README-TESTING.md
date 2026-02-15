# Load Testing for Registration Finder

This project contains load testing infrastructure for the Registration Finder website using Playwright and Artillery.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Install Playwright browsers:**
   ```bash
   npx playwright install
   ```

## Test Configuration

Test data is configured in the `.env` file:
- **Street Address:** 4444 Weber Rd.
- **ZIP Code:** 63123

Expected results:
- **Returned Address:** 4444 WEBER RD, ST LOUIS, MO 63123
- **Geographic Code:** St Louis County
- **Patron Type:** Resident

## Running Tests

### Playwright Functional Tests

Run functional tests with result validation:
```bash
npm run test:playwright
```

This will:
- Submit the form with test data
- Validate the returned results match expected values
- Measure response times
- Run performance metrics (5 iterations)

### Artillery Load Tests

#### Small Scale Test (10 concurrent users)
```bash
npm run test:load-small
```

This runs a smaller load test:
- Warm up: 1 user/second for 30 seconds
- Light load: 2 users/second for 60 seconds

#### Full Scale Test (100 concurrent users)
```bash
npm run test:load-full
```

This runs the full load test:
- Warm up: 1 user/second for 60 seconds
- Ramp up: 5 users/second for 120 seconds
- Sustained load: 10 users/second for 180 seconds
- Peak load: 20 users/second for 120 seconds

#### Generate HTML Report
```bash
npm run test:load-report
```

This runs the full load test and generates an HTML report.

## Understanding Results

### Playwright Results

Playwright tests will show:
- Test pass/fail status
- Response times for each submission
- Performance metrics (average, min, max response times)
- Console output with detailed timing information

### Artillery Results

Artillery provides comprehensive metrics:

**Response Time Metrics:**
- `p50` (median): 50% of requests completed in this time or less
- `p95`: 95% of requests completed in this time or less
- `p99`: 99% of requests completed in this time or less
- `min/max`: Fastest and slowest response times

**Throughput Metrics:**
- `scenarios.completed`: Total number of successful form submissions
- `http.requests`: Total HTTP requests made
- `http.responses`: Total HTTP responses received

**Validation Metrics:**
- `validation.returned_address.success/failure`: Address validation results
- `validation.geographic_code.success/failure`: Geographic code validation results
- `validation.patron_type.success/failure`: Patron type validation results

**Performance Thresholds:**
- Max error rate: 5%
- p95 response time: < 5 seconds
- p99 response time: < 10 seconds

## Project Structure

```
RegistrationFinderTest/
├── artillery/
│   ├── load-test.yml          # Full scale load test configuration
│   ├── load-test-small.yml    # Small scale load test configuration
│   └── processor.js           # Custom Artillery processor for validation
├── tests/
│   └── form-submission.spec.ts # Playwright functional tests
├── .env                        # Test data configuration
├── .env.example               # Template for test data
├── package.json               # Project dependencies and scripts
├── playwright.config.ts       # Playwright configuration
└── README-TESTING.md          # This file
```

## Troubleshooting

**Playwright tests fail:**
- Ensure you've run `npx playwright install` to install browsers
- Check that the website is accessible
- Verify test data in `.env` file

**Artillery tests fail:**
- Check network connectivity to the target website
- Verify the website can handle the load
- Review error messages in the console output

**High response times:**
- The website may be experiencing high load
- Network latency may be affecting results
- Consider running tests during off-peak hours
