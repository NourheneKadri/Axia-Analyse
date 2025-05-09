import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import Footer from "../components/footer";
import { useSearchParams } from "react-router-dom";
import Gotop from "../components/gotop";
import { Rating } from "react-simple-star-rating";
import { Link } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Collapse } from "react-collapse";
import logo from "../assets/images/logo.png";
import Header2 from "../components/header/Header2";
import './CalendarComponent.css';
import Authentification from "../Services/AuthentificationService";
import axios from "axios";


InterviewCandidate.propTypes = {};

function InterviewCandidate(props) {

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [timezone] = useState('UK, Ireland, Lisbon Time (IB:12)');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState("");
  const user = Authentification.getStoredUser()
  const [reservedSlots, setReservedSlots] = useState([]);
  const [Loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const [startTime, setStartTime] = useState(null);
  const [Duration, setDuration] = useState("");




  const [SDate, setSDate] = useState(null);




  const timeSlotsRef = useRef(null);
  const [timeSlots, setimeSlots] = useState([]);

  const offerId = searchParams.get("jobId");
  const candidateId = searchParams.get("candidateId");
  const recruiterId = searchParams.get("recruiterId");

  // Génération du calendrier
  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();

    const weeks = [];
    let week = [];

    for (let i = 0; i < startDay; i++) {
      week.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      week.push(day);

      if (week.length === 7 || day === daysInMonth) {
        weeks.push(week);
        week = [];
      }
    }

    return weeks;
  };

  useEffect(() => {
    const fetchReservedSlots = async () => {


      try {

        const response = await axios.get('http://localhost:5259/api/Slot/reserved', {
          params: {
            recruiterId: recruiterId,
            date: SDate
          }
        });
        setReservedSlots(response.data);  // Mise à jour des créneaux réservés
        setLoading(false);
        setimeSlots(response.data)
      } catch (err) {
        setError(err.message);  // Gestion des erreurs
        setLoading(false);
      }
    };

    fetchReservedSlots();
  }, [recruiterId, selectedDate]);  // Remarquez qu'ici on observe selectedDate au lieu de 'date'





  const isSlotReserved = (slot) => {

  };
  const handleSlotAvailability = (slot) => {
    const availability = slot.isAvailable === 1 ? 'Disponible' : 'Indisponible';
    console.log(`Slot ${slot.startTime} - ${availability}`); // Debug
    return slot.isAvailable === 1; // Retourne true si disponible
  };




  // Navigation entre les mois
  const changeMonth = (increment) => {
    setCurrentDate(new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + increment,
      1
    ));
    setSelectedDate(null);
    setSelectedTime(null);
    setShowConfirmation(false);
  };

  const handleDateClick = (day) => {
    if (day) {
      // Crée une nouvelle date à partir du jour sélectionné
      const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

      // Ajuster l'heure à 00:00:00 pour éviter tout effet de fuseau horaire
      clickedDate.setHours(0, 0, 0, 0);

      // Empêche la sélection si samedi (6) ou dimanche (0)
      const dayOfWeek = clickedDate.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) return;

      // Afficher la date sélectionnée en format ISO sans l'heure
      const formattedDate = clickedDate.toLocaleDateString('fr-CA');  // format yyyy-mm-dd (local)

      console.log("📅 Date sélectionnée :", formattedDate);

      // Mettre à jour l'état de la date sélectionnée
      setSelectedDate(clickedDate);
      setSDate(formattedDate)
      setSelectedTime(null);
      setShowConfirmation(false);
    }
  };



  // Sélection de créneau
  const handleTimeClick = (time,duration) => {
    setSelectedTime(time);
    setShowConfirmation(true);
    setDuration(duration);


    console.log("aaa", duration);

  };

  // Confirmation


  // Formatage des dates
  const formatSelectedDate = () => {
    if (!selectedDate) return '';
    return selectedDate.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  };

  const formatMonthYear = () => {
    return currentDate.toLocaleDateString('fr-FR', {
      month: 'long',
      year: 'numeric'
    });
  };

  // Gestion du glisseur
  const handleWheel = (e) => {
    if (timeSlotsRef.current) {
      e.preventDefault();
      timeSlotsRef.current.scrollLeft += e.deltaY;
    }
  };

  const startDrag = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - timeSlotsRef.current.offsetLeft);
    setScrollLeft(timeSlotsRef.current.scrollLeft);
  };

  const duringDrag = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - timeSlotsRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    timeSlotsRef.current.scrollLeft = scrollLeft - walk;
  };

  const stopDrag = () => {
    setIsDragging(false);
  };

  const today = new Date();

  const isFutureOrToday = (day) => {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    d.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return d >= today;
  };
  const calendarWeeks = generateCalendar();
  const daysOfWeek = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

  const [toggle, setToggle] = useState({
    key: "",
    status: false,
  });
  const [isShowMobile, setShowMobile] = useState(false);
  const [rating, setRating] = useState(0);

  const handleRating = (rate) => {
    setRating(rate);
  };

  const handleToggle = (key) => {
    if (toggle.key === key) {
      setToggle({
        status: false,
      });
    } else {
      setToggle({
        status: true,
        key,
      });
    }
  };
  const handleUnreserveSlot = async (slot) => {
    try {
      const slotDate = selectedDate.toLocaleDateString('fr-CA'); // format yyyy-mm-dd
      const startTime = slot;

      const response = await axios.delete('http://localhost:5259/api/Slot/delete', {
        data: {
          slotDate,
          startTime,
          recruiterId: user?.userAccountId, // Replace with actual user ID dynamically
        },
      });

      if (response.status === 200) {
        // Remove the unreserved slot from reservedSlots
        setReservedSlots(prevReservedSlots =>
          prevReservedSlots.filter(res => res.startTime !== startTime)
        );
        alert("Créneau désinscrit avec succès.");
      } else {
        alert("Erreur lors de l'annulation.");
      }
    } catch (err) {
      console.error("Erreur réseau :", err);
      alert("Impossible de contacter le serveur.");
    }
  };


  const handleMobile = () => {
    const getMobile = document.querySelector(".menu-mobile-popup");
    setShowMobile(!isShowMobile);
    !isShowMobile
      ? getMobile.classList.add("modal-menu--open")
      : getMobile.classList.remove("modal-menu--open");
  };

  const handleConfirm = async (slotId) => {
    if (!selectedDate || !selectedTime) {
      alert("Veuillez sélectionner une date et une heure.");
      return;
    }
    console.log("selectedDate:", slotId);
    console.log("selectedTime:", selectedTime);



    // Si selectedTime est une chaîne (par exemple "15:30"), il faut la convertir




    // Si la date et l'heure sont valides, continuer le traitement
    const slotDate = selectedDate.toISOString().split("T")[0]; // Format YYYY-MM-DD

   // const endTime = calculateEndTime(startTime); // Ex: "10:30"

    const interview = {
      candidateId: candidateId,
      slotId: slotId,
      recruiterId: recruiterId,
      jobId: offerId,
      interviewDate: slotDate,
      interviewTime: selectedTime,
      location: "Salle virtuelle",
      // à remplacer dynamiquement selon ton utilisateur
    };

    try {
      const response = await fetch("http://localhost:5259/api/Interview/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(interview)
      });

      if (response.ok) {
        const data = await response.json();
        console.log("interview enregistré avec succès :", data);
        alert("Rendez-vous enregistré !");
      } else {
        console.error("Erreur lors de l'enregistrement");
        alert("Une erreur est survenue.");
      }
    } catch (err) {
      console.error("Erreur réseau :", err);
      alert("Impossible de contacter le serveur.");
    }
  };
  /*
  const calculateEndTime = (startTime) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes + 30); // Durée fixe de 30 min
    return date.toTimeString().slice(0, 5); // "HH:MM"
  };*/

  const navButtonStyle = {
    padding: '8px',
    borderRadius: '8px',
    border: 'none',
    background: 'transparent',
    color: '#4a5568',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#edf2f7'
    }
  };

  const dayHeaderStyle = {
    padding: '12px',
    textAlign: 'center',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#718096',
    textTransform: 'uppercase'
  };

  const dayCellStyle = {
    position: 'relative',
    padding: '12px',
    border: 'none',
    borderRadius: '8px',
    background: '#f8fafc',
    color: '#2d3748',
    fontSize: '0.95rem',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      backgroundColor: '#e2e8f0'
    }
  };

  const selectedDayStyle = {
    background: '#0060e6',
    color: 'white',
    fontWeight: '600',
    transform: 'scale(1.05)'
  };

  const weekendStyle = {
    color: '#e53e3e'
  };

  const todayIndicatorStyle = {
    position: 'absolute',
    top: '4px',
    right: '4px',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: '#48bb78'
  };
  const detailItemStyle = {
    display: "flex",
    alignItems: "flex-start",
    padding: "1rem",
    borderRadius: "8px",
    backgroundColor: "white",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    transition: "all 0.2s",
    ":hover": {
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
    }
  };
  
  const iconContainerStyle = {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "#e6f0ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    marginRight: "1rem"
  };
  
  const labelStyle = {
    fontSize: "0.9rem",
    color: "#718096",
    marginBottom: "4px"
  };
  
  const valueStyle = {
    fontSize: "1.1rem",
    fontWeight: "500",
    color: "#1a365d"
  };
  
  const subTextStyle = {
    fontSize: "0.9rem",
    color: "#718096",
    fontWeight: "400",
    marginTop: "4px"
  };

  return (
    <>
      <div className="menu-mobile-popup">
        <div className="modal-menu__backdrop" onClick={handleMobile}></div>

      </div>
      <Header2 clname="actEm4" handleMobile={handleMobile} />

      <section>
        <div className="scheduler-container">
          <div className="layout-grid">
            {/* Colonne gauche - Détails meeting */}
            <div className="left-column">
              <div className="meeting-card"  style={{
                width: "400px",
                height: "520px",
                margin: '1rem auto',
                padding: '1.5rem',
                borderRadius: '16px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#ffffff'}}>
                 <h1 style={{ 
        margin: 0,
        fontSize: '1.5rem',
        fontWeight: '600',
        color: '#1a365d'
      }}>
        Planification d'entretien
      </h1>
      <p style={{ 
        margin: '4px 0 0 0',
        color: '#718096',
        fontSize: '0.9rem'
      }}>
        Sélectionnez un créneau disponible
      </p>

  <div className="meeting-details" style={{ display: "grid", gap: "1rem" }}>
 
</div>

              </div>
            </div>

            {/* Colonne centrale - Calendrier */}
            <div className="center-column">
              <div className="meeting-card" style={{
                width: "600px",
                height: "520px",
                margin: '1rem auto',
                padding: '1.5rem',
                borderRadius: '16px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#ffffff'
              }}>
                <div className="date-selection">
                  <h2 style={{
                    margin: '0 0 1.5rem 0',
                    fontWeight: '600',
                    fontSize: '1.25rem',
                    color: '#2d3748',
                    textAlign: 'center',
                    letterSpacing: '-0.5px'
                  }}>
                    Select a Day
                  </h2>

                  <div className="calendar-header" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1rem',
                    padding: '0.5rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px'
                  }}>
                    <button
                      onClick={() => changeMonth(-1)}
                      style={navButtonStyle}
                      aria-label="Previous month"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>

                    <div style={{
                      fontWeight: '600',
                      color: '#1a365d',
                      fontSize: '1.1rem'
                    }}>
                      {formatMonthYear()}
                    </div>

                    <button
                      onClick={() => changeMonth(1)}
                      style={navButtonStyle}
                      aria-label="Next month"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '4px',
                    marginBottom: '4px'
                  }}>
                    {daysOfWeek.map(day => (
                      <div key={day} style={dayHeaderStyle}>
                        {day.substring(0, 3)}
                      </div>
                    ))}
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '4px'
                  }}>
                    {calendarWeeks.map((week, weekIndex) => (
                      <React.Fragment key={weekIndex}>
                        {week.map((day, dayIndex) => (
                          <button
                            key={dayIndex}
                            disabled={!day || !isFutureOrToday(day)}
                            onClick={() => handleDateClick(day)}
                            style={{
                              ...dayCellStyle,
                              ...(day && isFutureOrToday(day) ? {} : { opacity: 0.4 }),
                              ...(selectedDate?.getDate() === day &&
                                selectedDate?.getMonth() === currentDate.getMonth() &&
                                selectedDate?.getFullYear() === currentDate.getFullYear() ? selectedDayStyle : {}),
                              ...(day !== null && [0, 6].includes(
                                new Date(currentDate.getFullYear(), currentDate.getMonth(), day).getDay()
                              ) ? weekendStyle : {})
                            }}
                            aria-label={`Select ${day} ${formatMonthYear()}`}
                          >
                            {day}
                            {day === new Date().getDate() &&
                              currentDate.getMonth() === new Date().getMonth() &&
                              currentDate.getFullYear() === new Date().getFullYear() && (
                                <div style={todayIndicatorStyle} />
                              )}
                          </button>
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {selectedDate && (

            <div className="right-column"  >
              <div className="meeting-card" style={{
                width: "400px",
                height: "520px",
                margin: '1rem auto',
                padding: '1.5rem',
                borderRadius: '16px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#ffffff'
              }}>
                {selectedDate ? (
                  <div className="time-slots-section">
                    <div className="selected-date-display">
                      <div className="calendar-month">{formatSelectedDate()}</div>
                    </div>

                    <div className="time-slots-container">
                      <div className="time-slots-grid">
                      {timeSlots.map((slot, index) => (
            <button
              key={index}
              style={{
                position: 'relative',
                padding: '12px',
                border: selectedTime === slot.startTime 
                  ? '2px solid #0060e6' 
                  : '1px solid #e2e8f0',
                borderRadius: '8px',
                backgroundColor: slot.isAvailable 
                  ? (selectedTime === slot.startTime ? '#f0f6ff' : '#ffffff')
                  : '#fff5f5',
                color: slot.isAvailable ? '#2d3748' : '#e53e3e',
                cursor: slot.isAvailable ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
                ':hover': {
                  borderColor: slot.isAvailable ? '#0060e6' : '#e53e3e'
                }
              }}
              onClick={() => {
                const start = new Date(`1970-01-01T${slot.startTime}`);
                const end = new Date(`1970-01-01T${slot.endTime}`);
                const durationMs = end - start;
                const durationMinutes = durationMs / (1000 * 60);
                setSelectedSlot(slot);
              
                const duration = `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`;
              
                handleTimeClick(slot.startTime, duration); // tu peux passer duration ici si nécessaire
              }}
              >
              <div style={{
                fontSize: '0.9rem',
                fontWeight: '500',
                marginBottom: '4px'
              }}>
                {slot.startTime.slice(0, 5)}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: slot.isAvailable ? '#718096' : '#e53e3e'
              }}>
                {slot.isAvailable ? 'Disponible' : 'Indisponible'}
              </div>
              
              {!slot.isAvailable && (
                <div style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  backgroundColor: '#fed7d7',
                  color: '#e53e3e',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '0.6rem',
                  fontWeight: 'bold'
                }}>
                  COMPLET
                </div>
              )}
            </button>
          ))}


                      </div>
                    </div>

                    {showConfirmation && (
                      <div className="confirmation-section">
                        <button
                          className="confirm-button"
                          onClick={() => handleConfirm(selectedSlot.id)} // Fonction fléchée pour retarder l'exécution
                        >
                          Confirmer le rendez-vous
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="no-date-selected">
                  </div>
                )}
              </div>
            </div>
 )}
          </div>
        </div>
      </section>

      <Footer />
      <Gotop />
    </>
  );
}

export default InterviewCandidate;
