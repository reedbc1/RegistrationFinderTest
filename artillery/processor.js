module.exports = {
    setFormData,
    validateResults
};

/**
 * Set form data before request
 */
function setFormData(requestParams, context, ee, next) {
    // Set the test address data
    context.vars.streetAddress = '4444 Weber Rd.';
    context.vars.zipCode = '63123';

    return next();
}

/**
 * Validate the response contains expected results
 */
function validateResults(requestParams, response, context, ee, next) {
    const body = response.body;

    // Expected values
    const expectedReturnedAddress = '4444 WEBER RD, SAINT LOUIS, MO, 63123';
    const expectedGeographicCode = 'St Louis County';
    const expectedPatronType = 'Resident';

    // Check if response contains expected values
    if (body.includes(expectedReturnedAddress)) {
        ee.emit('counter', 'validation.returned_address.success', 1);
    } else {
        ee.emit('counter', 'validation.returned_address.failure', 1);
        console.error('Expected returned address not found in response');
    }

    if (body.includes(expectedGeographicCode)) {
        ee.emit('counter', 'validation.geographic_code.success', 1);
    } else {
        ee.emit('counter', 'validation.geographic_code.failure', 1);
        console.error('Expected geographic code not found in response');
    }

    if (body.includes(expectedPatronType)) {
        ee.emit('counter', 'validation.patron_type.success', 1);
    } else {
        ee.emit('counter', 'validation.patron_type.failure', 1);
        console.error('Expected patron type not found in response');
    }

    return next();
}
