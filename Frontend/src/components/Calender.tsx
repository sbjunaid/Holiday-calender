import { useEffect, useState } from "react";
import { fetchHolidays, addHoliday } from "../api/api";

interface Holiday {
  date: string;
  title: string;
}

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const minYear = 2024;
  const maxYear = 2029;

  useEffect(() => {
    loadHolidays();
  }, [currentDate]);

  const loadHolidays = async () => {
    const data: Holiday[] = await fetchHolidays();
    setHolidays(data);
  };

  const handleAddHoliday = async (date: string) => {
    const name = prompt("Enter holiday name:");
    if (name) {
      await addHoliday({ date, title: name });
      await loadHolidays(); // Refresh the holiday list after adding
    }
  };

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    if (newDate.getFullYear() >= minYear) {
      setCurrentDate(newDate);
    }
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    if (newDate.getFullYear() <= maxYear) {
      setCurrentDate(newDate);
    }
  };

  const formatDateString = (year: number, month: number, day: number): string => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendarDays = [];
    let day = 1;

    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDay) {
          week.push(<td key={`empty-${j}`}></td>);
        } else if (day > daysInMonth) {
          week.push(<td key={`empty-end-${j}`}></td>);
        } else {
          const dateStr = formatDateString(year, month, day);
          const isHoliday = holidays.some((holiday) => holiday.date === dateStr);
          const isHovered = hoveredDate === dateStr;

          week.push(
            <td
              key={dateStr}
              style={{
                position: "relative",
                padding: "8px",
                border: "1px solid #ddd",
              }}
              onMouseEnter={() => setHoveredDate(dateStr)}
              onMouseLeave={() => setHoveredDate(null)}
            >
              {day}
              {isHoliday && <div style={{ color: "blue", fontSize: "12px" }}>Holiday</div>}
              {isHovered && (
                <button
                  onClick={() => handleAddHoliday(dateStr)}
                  style={{
                    position: "absolute",
                    bottom: "2px",
                    right: "2px",
                    padding: "2px 6px",
                    fontSize: "12px",
                    backgroundColor: "#000000",
                    border: "1px solid #ddd",
                    cursor: "pointer",
                  }}
                >
                  Add
                </button>
              )}
            </td>
          );
          day++;
        }
      }
      calendarDays.push(<tr key={i}>{week}</tr>);
    }
    return calendarDays;
  };

  return (
    <div>
      <div style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button onClick={handlePrevMonth} disabled={currentDate.getFullYear() <= minYear && currentDate.getMonth() === 0}>
          Previous
        </button>
        <div>{currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}</div>
        <button onClick={handleNextMonth} disabled={currentDate.getFullYear() >= maxYear && currentDate.getMonth() === 11}>
          Next
        </button>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <th key={day} style={{ padding: "8px", border: "1px solid #ddd" }}>
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{renderCalendar()}</tbody>
      </table>
    </div>
  );
};

export default Calendar;
