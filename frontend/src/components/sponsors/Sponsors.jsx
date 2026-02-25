import { useEffect, useState } from "react";
import { apiCall } from "../../utils/api.js";
import { Link } from "react-router";


export default function Sponsors() {
  const [sponsors, setSponsors] = useState([]);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const res = await apiCall("/api/sponsors");
        setSponsors(res.data.sponsors);
      } catch (error) {
        console.error("Erreur fetch sponsors :", error);
      }
    };
    fetchSponsors();
  }, []);

  if (!sponsors.length) return null;

  // Duplique les sponsors pour remplir visuellement la barre,
  // même quand il y en a très peu (ex : 2 sponsors seulement).
  const MIN_ITEMS = 8;
  let repeatedSponsors = sponsors;
  while (repeatedSponsors.length < MIN_ITEMS) {
    repeatedSponsors = repeatedSponsors.concat(sponsors);
  }

  return (
    <section className="sponsors-section">
      <div className="sponsors-inner">
        <div className="sponsors-header">
          <p className="sponsors-label">PARTENAIRES</p>
          <h2 className="sponsors-title">ILS SOUTIENNENT <Link
            to="/"
            className="navbar-logo cursor-pointer"
            aria-label="Retour à la page d'accueil"
          >
            MARS<span className="gradient-text">AI</span>
          </Link></h2>
          <p className="sponsors-subtitle">
            Un réseau de partenaires engagés qui rendent possible le festival.
          </p>
        </div>

        <div className="sponsors-marquees">
          <div className="marquee-row marquee-row-primary">
            <div className="marquee-container">
              {[1, 2].map((i) => (
                <div key={`row-${i}`} className="marquee-content-left">
                  {repeatedSponsors.map((sponsor, index) => (
                    <a
                      key={`${i}-${sponsor.id}-${index}`}
                      href={sponsor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="sponsor-logo-link"
                    >
                      <img
                        src={`http://localhost:3000${sponsor.cover}`}
                        alt={sponsor.name}
                        className="sponsor-logo"
                      />
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
