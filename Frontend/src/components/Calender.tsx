import { useEffect, useState } from "react";
import { fetchHolidays, addHoliday } from "../api/api";

interface Holiday {
  date: string;
  title: string;
}

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  useEffect(() => {
    loadHolidays();
  }, []);

  const loadHolidays = async () => {
    const data = await fetchHolidays();
    setHolidays(data);
  };

  const handleAddHoliday = async (date: string) => {
    const name = prompt("Enter holiday name:");
    if (name) {
      await addHoliday({ date, title: name });
      await loadHolidays();
    }
  };

  const handleMonthChange = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  const formatDateString = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  const generateDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const daysArray = Array.from({ length: firstDay + daysInMonth }, (_, i) => {
      if (i < firstDay) return null;
      return new Date(year, month, i - firstDay + 1);
    });

    return daysArray.map((date, index) => {
      if (!date) return <div key={index} className="empty-day"></div>;
      const dateStr = formatDateString(date);
      const holiday = holidays.find(h => h.date === dateStr);

      return (
        <div
          key={dateStr}
          className={`day ${holiday ? "holiday-day" : ""}`}
          onMouseEnter={() => setHoveredDate(dateStr)}
          onMouseLeave={() => setHoveredDate(null)}
        >
          <span>{date.getDate()}</span>
          {holiday && <div className="holiday-label">{holiday.title}</div>}
          {hoveredDate === dateStr && (
            <button className="add-btn" onClick={() => handleAddHoliday(dateStr)}>+</button>
          )}
        </div>
      );
    });
  };

  return (
    <div className="calendar-container">
      <div className="header">
        <button onClick={() => handleMonthChange(-1)}>Prev</button>
        <h2>{currentDate.toLocaleString("default", { month: "long", year: "numeric" })}</h2>
        <button onClick={() => handleMonthChange(1)}>Next</button>
      </div>
      <div className="calendar-grid">{generateDays()}</div>
    </div>
  );
};

export default Calendar;
