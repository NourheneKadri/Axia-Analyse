import React, { useState , useRef, useEffect} from "react";
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


EmployerReview.propTypes = {};

function EmployerReview(props) {

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [timezone] = useState('UK, Ireland, Lisbon Time (IB:12)');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [date, setDate] = useState(new Date());
  const user = Authentification.getStoredUser()
  const [reservedSlots, setReservedSlots] = useState([]);
  const [Loading, setLoading] = useState("");
  const [error, setError] = useState("");

  const [SDate, setSDate] = useState(null);



  
  const timeSlotsRef = useRef(null);

  const timeSlots = [
    { start: '09:00:00', end: '09:30:00' },
    { start: '10:00', end: '10:30' },
    { start: '11:00', end: '11:30' },
    { start: '14:00', end: '14:30' },
    { start: '15:00', end: '15:30' },
    { start: '16:00', end: '16:30' },
    { start: '17:00', end: '17:30' },
    { start: '18:00', end: '18:30' }
  ];

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
            recruiterId: user.userAccountId,
            date: SDate 
          }
        });
        setReservedSlots(response.data);  // Mise à jour des créneaux réservés
        setLoading(false);
      } catch (err) {
        setError(err.message);  // Gestion des erreurs
        setLoading(false);
      }
    };
  
    fetchReservedSlots();
  }, [user.userAccountId, selectedDate]);  // Remarquez qu'ici on observe selectedDate au lieu de 'date'
  
  const isSlotReserved = (slot) => {
    const selectedDateTime = new Date(`${selectedDate.toISOString().split('T')[0]}T${slot.start}`);
    
    return reservedSlots.some(res => {
      const reservedDateTime = new Date(`${new Date(res.slotDate).toISOString().split('T')[0]}T${res.startTime}`);
      return reservedDateTime.getTime() === selectedDateTime.getTime();
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
  const handleTimeClick = (time) => {
    setSelectedTime(time);
    setShowConfirmation(true);
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
  const slotDate = selectedDate.toLocaleDateString('fr-CA'); // format yyyy-mm-dd en heure locale
  const startTime = selectedTime;
    const endTime = calculateEndTime(startTime); // Ex: "10:30"
  
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
        console.log("Slot enregistré avec succès :", data);
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
  const calculateEndTime = (startTime) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes + 30); // Durée fixe de 30 min
    return date.toTimeString().slice(0, 5); // "HH:MM"
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
          <div className="meeting-card">
          <h1 style={{ paddingRight: "25px", paddingLeft: "25px" , fontsize: "50px",fontWeight: "bold"  }}>Entretien RH</h1>
          <div className="meeting-details">
  <div className="duration" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
    <svg 
      style={{ width: '20px', height: '20px', paddingRight: '10px' }} 
      data-id="details-item-icon" 
      viewBox="0 0 10 10" 
      xmlns="http://www.w3.org/2000/svg" 
      role="img">
      <path d="M.5 5a4.5 4.5 0 1 0 9 0 4.5 4.5 0 1 0-9 0Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
      <path d="M5 3.269V5l1.759 2.052" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
    <label style={{ unicodeBidi: 'isolate' }} htmlFor="duration">30 min</label>
  </div>

  <div className="duration" style={{ display: 'flex', alignItems: 'center' }}>
    <svg 
      style={{ width: '20px', height: '20px', paddingRight: '10px'  ,paddingBottom:"20px"}} 
      data-testid="web-conference-icon" 
      data-id="details-item-icon" 
      viewBox="0 0 10 10" 
      xmlns="http://www.w3.org/2000/svg" 
      role="img">
      <path d="M7.192 3.731V2.5a1 1 0 0 0-1-1H1.5a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h4.692a1 1 0 0 0 1-1V6.269l1.573.839a.5.5 0 0 0 .735-.441V3.333a.5.5 0 0 0-.735-.441Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
    <p>Les détails de la visioconférence seront envoyés par email.</p>
  </div>
</div>
          </div>
        </div>

        {/* Colonne centrale - Calendrier */}
        <div className="center-column">
          <div className="meeting-card">
            <div className="date-selection">
            <h2 style={{
  marginTop: 0,
  marginBottom: '10px',
  fontWeight: 'bold',
  fontSize: '20px',
  textAlign: 'center'
}}>
  Select a Day
</h2>



              
<div className="calendar-header" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", paddingBottom: "20px" }}>
  <button onClick={() => changeMonth(-1)} className="nav-button">
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      width="24"
      height="24"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.4806 15.9941C13.8398 15.6529 13.8398 15.0998 13.4806 14.7586L8.47062 10L13.4806 5.24142C13.8398 4.90024 13.8398 4.34707 13.4806 4.00589C13.1214 3.66471 12.539 3.66471 12.1798 4.00589L6.51941 9.38223C6.1602 9.72342 6.1602 10.2766 6.51941 10.6178L12.1798 15.9941C12.539 16.3353 13.1214 16.3353 13.4806 15.9941Z"
        fill="currentColor"
      />
    </svg>
  </button>

  <div className="calendar-month">
    {formatMonthYear()}
  </div>

  <button onClick={() => changeMonth(1)} className="nav-button">
    <svg
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      width="24"
      height="24"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.51941 4.00589C6.1602 4.34707 6.1602 4.90024 6.51941 5.24142L11.5294 10L6.51941 14.7586C6.1602 15.0998 6.1602 15.6529 6.51941 15.9941C6.87863 16.3353 7.46104 16.3353 7.82026 15.9941L13.4806 10.6178C13.8398 10.2766 13.8398 9.72342 13.4806 9.38223L7.82026 4.00589C7.46104 3.66471 6.87863 3.66471 6.51941 4.00589Z"
        fill="currentColor"
      />
    </svg>
  </button>
</div>

              <div className="calendar-grid">
                {daysOfWeek.map(day => (
                  <div key={day} className="day-header">{day}</div>
                ))}
                
                {calendarWeeks.map((week, weekIndex) => (
                  <React.Fragment key={weekIndex}>
                    {week.map((day, dayIndex) => (
                      <div 
                      key={dayIndex} 
                      className={`day-cell ${day ? '' : 'empty'} 
                        ${selectedDate?.getDate() === day &&
                        selectedDate?.getMonth() === currentDate.getMonth() &&
                        selectedDate?.getFullYear() === currentDate.getFullYear() ? 'selected' : ''}
                        ${day !== null && [0, 6].includes(new Date(currentDate.getFullYear(), currentDate.getMonth(), day).getDay()) ? 'weekend' : ''}
                        ${day !== null && isFutureOrToday(day) ? 'future-day' : 'past-day'}
                      `}
                      onClick={() => handleDateClick(day)}
                    >
                      {day}
                    </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>

             
            </div>
          </div>
        </div>

        <div className="right-column">
          <div className="meeting-card">
            {selectedDate ? (
              <div className="time-slots-section">
                <div className="selected-date-display">
                  <div className="calendar-month">{formatSelectedDate()}</div>
                </div>
                
                <div className="time-slots-container">
                  <div className="time-slots-grid">
                  {timeSlots.map((slot, index) => {
  const reserved = isSlotReserved(slot);
  console.log(`Slot ${slot.start} - reserved: ${reserved}`);
  return (
    <React.Fragment key={index}>
      <button
        className={`time-slot-btn ${selectedTime === slot.start ? 'selected' : ''} ${reserved ? 'reserved' : ''}`}
        disabled={reserved}
        onClick={() => !reserved && handleTimeClick(slot.start)}
      >
        {slot.start}
      </button>
      <button
        className={`time-slot-btn ${selectedTime === slot.end ? 'selected' : ''} ${reserved ? 'reserved' : ''}`}
        disabled={reserved}
        onClick={() => !reserved && handleTimeClick(slot.end)}
      >
        {slot.end}
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

      </div>
    </div>
      </section>

      <Footer />
      <Gotop />
    </>
  );
}

export default EmployerReview;
