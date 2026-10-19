import React, { useEffect } from 'react';

function ConsoleExplorer() {
  useEffect(() => {
    console.log('--- 1. BASIC LOGGING & FORMATTING ---');

    // standard log
    console.log('Standard log: Hello, React Developer!');

    // multiple arguments
    const count = 42;
    console.log('The count is:', count, { status: 'active' });

    // CSS styling in console (great for highlighting logs)
    console.log(
      '%c Styled Console Log: Success! ',
      'background: #222; color: #bada55; padding: 2px 5px; border-radius: 4px; font-weight: bold;'
    );


    console.log('--- 2. MESSAGING TYPES & SEVERITY ---');

    // Warning (yellow background/icon)
    console.warn('Warning: This prop is deprecated and will be removed in v2.');

    // Error (red background/icon, captures stack trace)
    console.error('Error: Failed to fetch user data from API.');

    // Info (often styled similarly to log, but with an info icon in some browsers)
    console.info('Info: React 19 concurrent features are enabled.');


    console.log('--- 3. OBJECTS & DOM INSPECTION ---');

    const sampleUser = { id: 1, name: 'Alice', role: 'Admin', preferences: { theme: 'dark' } };

    // standard log (expands object normally)
    console.log('console.log object:', sampleUser);

    // console.dir (forces the object to be displayed as an interactive JSON-style tree structure)
    console.dir(sampleUser);

    // console.dirxml (displays an XML/HTML-like tree representation of DOM elements)
    console.dirxml(document.body);


    console.log('--- 4. GROUPING & ORGANIZATION ---');

    // Grouping related logs together
    console.group('User Authentication Flow');
    console.log('1. User submitted credentials');
    console.log('2. API response received');
    console.warn('3. Token expiring soon');
    console.groupEnd(); // Closes the group

    // Collapsed group (starts closed by default)
    console.groupCollapsed('Detailed Performance Metrics (Click to Expand)');
    console.log('Render time: 4.2ms');
    console.log('Commit time: 1.1ms');
    console.groupEnd();


    console.log('--- 5. TABLES ---');

    const users = [
      { id: 1, name: 'Alice', role: 'Admin' },
      { id: 2, name: 'Bob', role: 'Editor' },
      { id: 3, name: 'Charlie', role: 'Subscriber' },
    ];

    // Perfect for arrays of objects or lists of state data
    console.table(users);


    console.log('--- 6. TIMERS & PERFORMANCE ---');

    // Start a timer with a label
    console.time('Data Fetch Simulation');

    // Simulate some work/delay
    for (let i = 0; i < 1000000; i++) {
      // heavy loop
    }

    // Stop the timer and print elapsed time
    console.timeEnd('Data Fetch Simulation');


    console.log('--- 7. COUNTERS ---');

    // Counts how many times this specific label has been hit
    console.count('Render Count');
    console.count('Render Count');
    console.count('Render Count');

    // Reset the counter if needed
    console.countReset('Render Count');


    console.log('--- 8. ASSERTIONS & TRACE ---');

    const isAuthorized = false;
    // Only logs if the expression evaluates to false
    console.assert(isAuthorized, 'Assertion Failed: User must be authorized to view this section.');

    // Prints the full stack trace leading up to this call (great for finding where a function was called from)
    const trackCaller = () => {
      console.trace('Tracing function execution path:');
    };
    trackCaller();

  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Console Explorer Component</h2>
      <p>Open your browser's Developer Tools (F12 or Right Click &gt; Inspect &gt; Console) to see all the custom console outputs!</p>
    </div>
  );
}

export default ConsoleExplorer;