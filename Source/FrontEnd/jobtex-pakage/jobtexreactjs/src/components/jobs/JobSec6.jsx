import React, { useEffect, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
JobSec6.propTypes = {};

function JobSec6(props) {
  const { data } = props;
  const locales = {
  "en-US": enUS,
};

// Initialiser le localizer avec date-fns
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Événements de test
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await fetch("http://localhost:5259/api/Interview");
        const interviews = await res.json();

        // Filtrer les interviews valides
        const validInterviews = interviews.filter(
          (i) => i.interviewDate !== "0001-01-01T00:00:00"
        );

        // Pour chaque interview, récupérer le nom du candidat
        const interviewsWithNames = await Promise.all(
          validInterviews.map(async (interview) => {
            const userRes = await fetch(
              `http://localhost:5259/api/Authentication/GetUser/${interview.candidateId}`
            );
            const user = await userRes.json();

            const date = new Date(interview.interviewDate);
            const time = new Date(interview.interviewTime);
            const start = new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate(),
              time.getHours(),
              time.getMinutes()
            );
            const end = new Date(start.getTime() + 60 * 60 * 1000); // +1h

            return {
              id: interview.id,
              title: `Entretien Avec  ${user.firstName || "Nom inconnu"} ${user.lastName || "Nom inconnu"}`,
              start,
              end,
              location: interview.location || "Non spécifiée",
            };
          })
        );

        setEvents(interviewsWithNames);
      } catch (error) {
        console.error("Erreur lors du chargement des interviews :", error);
      }
    };

    fetchInterviews();
  }, []);


  return (
    <section>
      <div className="tf-container ctn-full wrap-sidebar-full pl1">
        <div className="row">
          <div style={{ height: "600px", padding: "20px" }}>
    <Calendar
  localizer={localizer}
  events={events}
  startAccessor="start"
  endAccessor="end"
  defaultView="week"
  views={["month", "week", "day"]}
  style={{ height: "100%" }}
  eventPropGetter={(event) => ({
    style: {
      backgroundColor: '#3092a8',
      color: 'white',
      borderRadius: '4px',
      border: 'none',
    }
  })}
/>

    </div>
          
        </div>
      </div>
    </section>
  );
}

export default JobSec6;
