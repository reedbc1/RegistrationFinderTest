import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test.describe('Registration Finder Form Submission', () => {
    test('should submit form and validate results', async ({ page }) => {
        const streetAddress = process.env.STREET_ADDRESS || '4444 Weber Rd.';
        const zipCode = process.env.ZIP_CODE || '63123';
        const expectedReturnedAddress = process.env.EXPECTED_RETURNED_ADDRESS || '4444 WEBER RD, SAINT LOUIS, MO, 63123';
        const expectedGeographicCode = process.env.EXPECTED_GEOGRAPHIC_CODE || 'St Louis County';
        const expectedPatronType = process.env.EXPECTED_PATRON_TYPE || 'Resident';

        // Navigate to the website
        await page.goto('/');

        // Wait for the page to load
        await expect(page.locator('h1')).toBeVisible();

        // Fill in the form
        await page.fill('#streetAddress', streetAddress);
        await page.fill('#ZIPCode', zipCode);

        // Add small delay to ensure form is ready
        await page.waitForTimeout(500);

        // Measure response time
        const startTime = Date.now();

        // Submit the form and wait for navigation
        await Promise.all([
            page.waitForNavigation({ timeout: 60000 }),
            page.click('button[type="submit"]')
        ]);

        const endTime = Date.now();
        const responseTime = endTime - startTime;

        console.log(`Response time: ${responseTime}ms`);

        // Wait for results to appear
        await page.waitForSelector('text=Results:', { timeout: 10000 });

        // Validate the results by checking the page content
        const pageContent = await page.content();

        // Check for "Returned Address"
        expect(pageContent).toContain(expectedReturnedAddress);
        console.log(`✓ Returned Address validated: ${expectedReturnedAddress}`);

        // Check for "Geographic Code"
        expect(pageContent).toContain(expectedGeographicCode);
        console.log(`✓ Geographic Code validated: ${expectedGeographicCode}`);

        // Check for "Patron Type"
        expect(pageContent).toContain(expectedPatronType);
        console.log(`✓ Patron Type validated: ${expectedPatronType}`);

        // Assert response time is reasonable (less than 10 seconds)
        expect(responseTime).toBeLessThan(10000);
        console.log(`✓ Response time: ${responseTime}ms (under 10s threshold)`);
    });

    test('should measure performance metrics', async ({ page }) => {
        const streetAddress = process.env.STREET_ADDRESS || '4444 Weber Rd.';
        const zipCode = process.env.ZIP_CODE || '63123';

        await page.goto('/');

        const metrics: number[] = [];

        // Run 5 iterations to get average response time
        for (let i = 0; i < 5; i++) {
            await page.fill('#streetAddress', streetAddress);
            await page.fill('#ZIPCode', zipCode);

            // Add small delay to ensure form is ready
            await page.waitForTimeout(500);

            const startTime = Date.now();

            // Submit and wait for navigation
            await Promise.all([
                page.waitForNavigation({ timeout: 60000 }),
                page.click('button[type="submit"]')
            ]);

            const endTime = Date.now();

            metrics.push(endTime - startTime);

            // Wait a bit before going back to avoid rate limiting
            await page.waitForTimeout(1000);

            // Go back to form
            await page.goto('/');
        }

        const avgResponseTime = metrics.reduce((a, b) => a + b, 0) / metrics.length;
        const minResponseTime = Math.min(...metrics);
        const maxResponseTime = Math.max(...metrics);

        console.log('Performance Metrics:');
        console.log(`  Average Response Time: ${avgResponseTime.toFixed(2)}ms`);
        console.log(`  Min Response Time: ${minResponseTime}ms`);
        console.log(`  Max Response Time: ${maxResponseTime}ms`);
        console.log(`  All Response Times: ${metrics.join(', ')}ms`);

        // Assert average response time is reasonable
        expect(avgResponseTime).toBeLessThan(10000);
    });
});
