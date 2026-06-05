import { useState } from "react";
import Home from "./pages/Home";
import Reservation from "./pages/Reservation";
import Guide from "./pages/Guide";
import Apropos from "./pages/Apropos";
import Contact from "./pages/Contact";
import Spots from "./pages/Spots";
import Auth from "./pages/Auth";
import Galerie from "./pages/Galerie";
import Moncompte from "./pages/Moncompte";

export default function App() {
  const [page, setPage] = useState("home");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [user, setUser] = useState(null);

  const navigateTo = (p, anchor) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
    // Si anchor, on scrolle vers la section après le render
    if (anchor) {
      setTimeout(() => {
        const el = document.getElementById(anchor);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }, 100);
    }
  };

  const handleReservation = () => {
    if (!isAuthenticated) {
      navigateTo("auth");
      return;
    }

    navigateTo("reservation");
  };

  if (page === "spots") {
    return <Spots onBack={(p, anchor) => navigateTo(p || "home", anchor)} onReserver={() => navigateTo("reservation")} currentPage="spots" />;
  }
  if (page === "auth") {
    return <Auth onBack={() => navigateTo("home")} onAuthSuccess={(userData) => { setIsAuthenticated(true); setUser(userData); navigateTo("compte");}}/>
  
  }
  if (page === "reservation") {
    return <Reservation onBack={() => navigateTo("home")} onGoToCompte={() => navigateTo("compte")} onReservationSuccess={(reservation) => {
    console.log("Réservation reçue :", reservation);

        setReservations(prev => {
          const newReservations = [...prev, reservation];
          console.log("Toutes les réservations :", newReservations);
          return newReservations;});
  }} />;
  }
  if (page === "guide") {
    return <Guide onBack={(p, anchor) => navigateTo(p || "home", anchor)} onReserver={() => navigateTo("reservation")} currentPage="guide" />;
  }
  if (page === "apropos") {
    return <Apropos onBack={(p, anchor) => navigateTo(p || "home", anchor)} onReserver={() => navigateTo("reservation")} currentPage="apropos" />;
  }
  if (page === "contact") {
    return <Contact onBack={(p, anchor) => navigateTo(p || "home", anchor)} onReserver={() => navigateTo("reservation")} currentPage="contact" />;
  }
  if (page === "galerie") {
    return <Galerie onNavigate={(p, anchor) => navigateTo(p || "home", anchor)} onReserver={() => navigateTo('reservation')} currentPage="galerie" />;
  }

  if (page === "compte") {
  return (
    <Moncompte
      user={user}
      reservations={reservations}
      onBack={() => navigateTo("home")}
      onNewReservation={() => navigateTo("reservation")}
      onDeleteReservation={(ref) =>
        setReservations(prev =>
          prev.filter(r => r.ref !== ref)
        )
      }
    />
  );
}

  return <Home onReserver={handleReservation} onNavigate={navigateTo} />
}