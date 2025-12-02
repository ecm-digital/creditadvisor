import React, { useState } from 'react';
import { Button } from '../ui/Button';
import './Calendar.css';

interface Event {
    id: string;
    title: string;
    date: string;
    time: string;
    type: 'consultation' | 'signing' | 'followup';
}

const initialEvents: Event[] = [
    { id: '1', title: 'Spotkanie z Anną Nowak', date: '2023-11-15', time: '10:00', type: 'consultation' },
    { id: '2', title: 'Podpisanie umowy - Piotr Kowalski', date: '2023-11-16', time: '14:00', type: 'signing' },
    { id: '3', title: 'Telefon do Marii Wiśniewskiej', date: '2023-11-17', time: '11:30', type: 'followup' },
];

export const Calendar: React.FC = () => {
    const [currentDate] = useState(new Date(2023, 10, 1)); // Nov 2023 for demo
    const [events] = useState<Event[]>(initialEvents);

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    // Adjust for Monday start (0 = Sunday in JS, but we want 0 = Monday)
    const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyDays = Array.from({ length: startOffset }, (_, i) => i);

    const getEventsForDay = (day: number) => {
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return events.filter(e => e.date === dateStr);
    };

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <h2 className="calendar-title">
                    {currentDate.toLocaleString('pl-PL', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="calendar-actions">
                    <Button variant="outline" size="sm">Poprzedni</Button>
                    <Button variant="outline" size="sm">Następny</Button>
                    <Button size="sm">Dodaj spotkanie</Button>
                </div>
            </div>

            <div className="calendar-grid">
                <div className="weekday-header">Pon</div>
                <div className="weekday-header">Wt</div>
                <div className="weekday-header">Śr</div>
                <div className="weekday-header">Czw</div>
                <div className="weekday-header">Pt</div>
                <div className="weekday-header">Sob</div>
                <div className="weekday-header">Ndz</div>

                {emptyDays.map((_, i) => (
                    <div key={`empty-${i}`} className="calendar-day empty"></div>
                ))}

                {days.map((day) => {
                    const dayEvents = getEventsForDay(day);
                    return (
                        <div key={day} className="calendar-day">
                            <span className="day-number">{day}</span>
                            <div className="day-events">
                                {dayEvents.map(event => (
                                    <div key={event.id} className={`event-item event-${event.type}`}>
                                        <span className="event-time">{event.time}</span>
                                        <span className="event-title">{event.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
