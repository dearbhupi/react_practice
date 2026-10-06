import { useEffect, useRef, useState } from 'react';

const initialEvents = [
  { id: 1, time: 'Ready', name: 'coordinateBox', note: 'Waiting for pointer movement' },
];

function formatTime(date) {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function App() {
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [events, setEvents] = useState(initialEvents);
  const eventLogRef = useRef(null);
  const eventId = useRef(2);

  const addEvent = (name, note) => {
    const entry = {
      id: eventId.current++,
      time: formatTime(new Date()),
      name,
      note,
    };

    setEvents((currentEvents) => [...currentEvents, entry]);
  };

  useEffect(() => {
    const log = eventLogRef.current;
    if (log) {
      log.scrollTop = log.scrollHeight;
    }
  }, [events]);

  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.round(event.clientX - rect.left);
    const y = Math.round(event.clientY - rect.top);

    setCoordinates({ x, y });
    addEvent('coordinateBox pointermove', `X: ${x}, Y: ${y}`);
  };

  const handlePointerLeave = () => {
    setCoordinates({ x: 0, y: 0 });
    addEvent('coordinateBox pointerleave', 'Pointer left the coordinate box');
  };

  return (
    <>
      <header>
        <h1>Event Playground</h1>
      </header>

      <main className="playground-layout">
        <section className="tracker-section" aria-labelledby="tracker-heading">
          <div className="section-heading">
            <span className="section-number">01</span>
            <div>
              <h2 id="tracker-heading">Coordinate tracker</h2>
              <p>Move your pointer inside the box to capture X and Y coordinates.</p>
            </div>
          </div>

          <div
            className="coordinate-box"
            role="region"
            aria-label="Mouse coordinate tracker"
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerLeave}
          >
            <div className="coordinate-box-header">
              <span>Coordinate tracker</span>
              <small>Move inside the box</small>
            </div>
            <div className="coordinate-values" aria-live="polite">
              <span>X <strong>{coordinates.x}</strong></span>
              <span>Y <strong>{coordinates.y}</strong></span>
            </div>
            <div className="coordinate-grid" aria-hidden="true" />
          </div>
        </section>

        <section className="log-section" aria-labelledby="log-heading">
          <div className="section-heading">
            <span className="section-number">02</span>
            <div>
              <h2 id="log-heading">Event log</h2>
              <p>Live events appear at the bottom.</p>
            </div>
          </div>

          <div ref={eventLogRef} className="event-log" aria-live="polite">
            {events.map((event) => (
              <div key={event.id}>
                <span>{event.time} - </span>
                <strong>{event.name}</strong>
                <span>: {event.note}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

export default App;
