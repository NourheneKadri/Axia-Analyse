import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import Footer from "../components/footer";
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
//import Button from "react-bootstrap/esm/Button";
import { Alert, AlertTitle } from "@mui/material";
import toast from 'react-hot-toast';




EmployerReview.propTypes = {};

function EmployerReview(props) {

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [EndTime, setEndime] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const user = Authentification.getStoredUser()
  const [reservedSlots, setReservedSlots] = useState([]);
  const [Loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [SDate, setSDate] = useState(null);
  const [duration, setDuration] = useState("");
  const [formData, setFormData] = useState({
    duration: 30,
    startDate: "",
    endDate: "",
    startTime: "",
    endTime: "",
    recruiterId: user.userAccountId
  });

  const [timeSlots, setTimeSlots] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const request = {
      startDate: formData.startDate,
      endDate: formData.endDate,
      startTime: formData.startTime,
      endTime: formData.endTime,
      interviewDurationMinutes: parseInt(formData.duration),
      recruiterId: user.userAccountId, // Modify if you have a dynamic recruiter ID
    };


    try {
      // Appel à l'API pour générer les créneaux horaires
      const response = await fetch("http://localhost:5259/api/Slot/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });
  
      // Vérification si la réponse est correcte
      if (!response.ok) {
        // Si la réponse est une erreur, on tente d'extraire le message du corps de la réponse
        const errorData = await response.json();
        toast.error(errorData.message || "Une erreur est survenue lors de la génération des créneaux.");
        return;
      }
  
      // Si la réponse est OK, on récupère les données de la réponse
      const data = await response.json();
      toast.success("Les créneaux ont été générés avec succès !");
  
      // Mettre à jour l'état avec les créneaux générés
      setTimeSlots(data); // Stocker les créneaux générés dans l'état
    } catch (error) {
      // En cas d'erreur lors de l'appel API ou autre
      console.error("Erreur:", error);
      toast.error("Une erreur s'est produite. Veuillez réessayer.");
    }
  };



  const timeSlotsRef = useRef(null);


  /*const timeSlots = [
    { start: '09:00:00', end: '09:30:00' },
    { start: '10:00', end: '10:30' },
    { start: '11:00', end: '11:30' },
    { start: '14:00', end: '14:30' },
    { start: '15:00', end: '15:30' },
    { start: '16:00', end: '16:30' },
    { start: '17:00', end: '17:30' },
    { start: '18:00', end: '18:30' }
  ];*/

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

  /* useEffect(() => {
     const fetchReservedSlots = async () => {
       try {
        
           // Mise à jour des créneaux réservés
         setLoading(false);
       } catch (err) {
         setError(err.message);  // Gestion des erreurs
         setLoading(false);
       }
     };
 
     fetchReservedSlots();
   }, [user.userAccountId, selectedDate]); */ // Remarquez qu'ici on observe selectedDate au lieu de 'date'

  const isSlotReserved = (slot) => {
    return reservedSlots.some(res => {

      const reservedStart = res.startTime
      const reservedEnd = res.endTime
      const reservedDate = new Date(res.slotDate).toLocaleDateString('fr-TN');



      const slotStart = new Date(slot.startDate).toTimeString().split(' ')[0];
      const slotEnd = new Date(slot.endDate).toTimeString().split(' ')[0];
      const slotDate = new Date(slot.startDate).toLocaleDateString('fr-TN');

      return (
        reservedStart === slotStart &&
        reservedEnd === slotEnd &&
        reservedDate === slotDate
      );
    });
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

  const handleDateClick = async (day) => {
    if (day === null) return;


    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    //console.log("ffffff",clickedDate)
    setSelectedDate(clickedDate);
    //console.log("aaaaa",selectedDate)
    //setTimeSlots([]);


    const formattedDate = clickedDate.toLocaleDateString('fr-CA'); // Donne '2025-04-29' par exemple
    console.log("eeeeeeee", formattedDate)
    const recruiterId = user.userAccountId;
    const response = await fetch(`http://localhost:5259/api/Slot/GetByDateAndRecruiter?date=${formattedDate}&recruiterId=${recruiterId}`);
    const data = await response.json();
    setTimeSlots(data); // adapte selon ton besoin
    const reponse = await axios.get(`http://localhost:5259/api/Slot/reserved?recruiterId=${user.userAccountId}&date=${formattedDate}`)
    setReservedSlots(reponse.data);



  };



  // Sélection de créneau
  const handleTimeClick = (Start, end) => {
    setSelectedTime(Start);
    setEndime(end);
    setShowConfirmation(true);
  };




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
          recruiterId: user.userAccountId, // Replace with actual user ID dynamically
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

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime) {
      alert("Veuillez sélectionner une date et une heure.");
      return;
    }

    const slotDate = selectedDate.toLocaleDateString('fr-CA');
    const startTime = selectedTime;
    const endTime = EndTime;
    const slot = {
      slotDate,
      startTime,
      endTime,
      recruiterId: user.userAccountId // à remplacer dynamiquement selon ton utilisateur
    };

    try {
      const response = await fetch("http://localhost:5259/api/Slot/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(slot)
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Le Créneaux a été confirmé avec succès !");
      } else {
        console.error("Erreur lors de l'enregistrement");
        toast.error("Une erreur est survenue.")
      }
    } catch (err) {
      console.error("Erreur réseau :", err);
      toast.error("Impossible de contacter le serveur.")
    }
  };
  const calculateEndTimeISO = (startTimeISO, durationMinutes = 30) => {
    const startDate = new Date(startTimeISO);
    startDate.setMinutes(startDate.getMinutes() + durationMinutes);
    return startDate.toISOString().slice(0, 19); // Retourne "YYYY-MM-DDTHH:mm:ss"
  };



  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const options = { hour: '2-digit', minute: '2-digit', hour12: false };
    return date.toLocaleTimeString('fr-FR', options); // '14:00'
  };
  const labelStyle = {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "500",
    color: "#2d3748"
  };

  const inputStyle = {
    width: "100%",
    padding: "0.75rem",
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    backgroundColor: "#f8fafc",
    transition: "all 0.2s",
    outline: "none"
  };
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
              <div className="meeting-card" style={{
                width: "700px",
                margin: '1rem auto',
                padding: '1.5rem',
                borderRadius: '16px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#ffffff'
              }}>
                <h1 style={{ paddingRight: "25px", paddingLeft: "25px", fontsize: "50px", fontWeight: "bold", marginBottom: "-10px" }}>Entretien</h1>
                <div className="meeting-details" style={{ padding: "2rem" }}>
                  <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1.5rem", marginTop: "1px" }}>
                    {/* Durée */}
                    <div className="form-group">
                      <label style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        fontWeight: "500",
                        color: "#2d3748"
                      }}>
                        Durée
                      </label>
                      <select
                        name="duration"
                        onChange={handleChange}
                        value={formData.duration}
                        style={{
                          width: "100%",
                          padding: "0.75rem",
                          border: "1px solid #e2e8f0",
                          borderRadius: "6px",
                          backgroundColor: "#f8fafc",
                          transition: "all 0.2s",
                          outline: "none"
                        }}
                      >
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="60">1 heure</option>
                      </select>
                    </div>

                    {/* Dates et heures */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
                      <div className="form-group">
                        <label style={labelStyle}>Date de début</label>
                        <input
                          type="date"
                          name="startDate"
                          onChange={handleChange}
                          value={formData.startDate}
                          style={inputStyle}
                        />
                      </div>

                      <div className="form-group">
                        <label style={labelStyle}>Date de fin</label>
                        <input
                          type="date"
                          name="endDate"
                          onChange={handleChange}
                          value={formData.endDate}
                          style={inputStyle}
                        />
                      </div>

                      <div className="form-group">
                        <label style={labelStyle}>Heure de début</label>
                        <input
                          type="time"
                          name="startTime"
                          onChange={handleChange}
                          value={formData.startTime}
                          style={inputStyle}
                        />
                      </div>

                      <div className="form-group">
                        <label style={labelStyle}>Heure de fin</label>
                        <input
                          type="time"
                          name="endTime"
                          onChange={handleChange}
                          value={formData.endTime}
                          style={inputStyle}
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      style={{
                        width: "100%",
                        padding: "0.875rem",
                        backgroundColor: "#0060e6",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        marginTop: "1rem",
                        ":hover": {
                          backgroundColor: "#004cba",
                          transform: "translateY(-1px)"
                        }
                      }}
                    >
                      Générer les créneaux
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Colonne centrale - Calendrier */}
            <div className="center-column">
              <div className="meeting-card" style={{
                width: "500px",
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
              <div className="right-column">
                <div className="meeting-card" style={{
                  width: "250px",
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
                          {timeSlots.map((slot, index) => {
                            const reserved = isSlotReserved(slot);
                            console.log(`Slot ${slot.startDate} - reserved: ${reserved}`);
                            return (
                              <React.Fragment key={index}>
                                <button
                                  className={`time-slot-btn ${selectedTime === slot.startDate ? 'selected' : ''} ${reserved ? 'reserved' : ''}`}
                                  disabled={reserved}
                                  onClick={() => !reserved && handleTimeClick(slot.startDate, slot.endDate)}  // Passer startDate et endDate
                                >
                                  {formatTime(slot.startDate)} {/* Afficher seulement l'heure de début */}
                                </button>


                              </React.Fragment>
                            );
                          })}


                        </div>
                      </div>

                      {showConfirmation && (
                        <div className="confirmation-section">
                          <button
                            className="confirm-button"
                            onClick={handleConfirm}
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
    </>
  );
}

export default EmployerReview;
