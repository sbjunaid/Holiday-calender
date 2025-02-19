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
      const newHoliday = { date, title: name };
      setHolidays([...holidays, newHoliday]);
      await addHoliday(newHoliday);
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
          style={{ width: "50px", height: "50px", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", border: "1px solid #ccc", position: "relative" }}
        >
          <span>{date.getDate()}</span>
          {holiday && <div className="holiday-label" style={{ fontSize: "10px", color: "red" }}>{holiday.title}</div>}
          {hoveredDate === dateStr && (
            <button className="add-btn" onClick={() => handleAddHoliday(dateStr)} style={{ position: "absolute", bottom: "5px", fontSize: "10px", padding: "3px" }}>Add</button>
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
      <div className="calendar-grid" style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "5px" }}>{generateDays()}</div>
    </div>
  );
};

export default Calendar;
