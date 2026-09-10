import {
  UsersRound,
  UserRoundPlus,
  Phone,
  Mail,
  Crown,
  Car,
  Wifi,
  BedDouble,
  CigaretteOff,
  Plane,
  CalendarDays,
} from "lucide-react";

import LightMode from "../DartMode/LightMode";
import "./walk_in.css";

const Walk_inAndReg = () => {
  const guests = [
    {
      id: 1,
      name: "Rajesh Sharma",
      initials: "RS",
      passport: "P8923412",
      phone: "+91 98765 43210",
      email: "rajesh.sharma@example.com",
      tier: "Platinum",
      stays: 14,
      spend: "₹1,84,500.00",
      preferences: ["High Floor", "Extra Pillows", "Non-Smoking", "Late Check-out"],
      color: "purple",
    },
    {
      id: 2,
      name: "Sarah Jenkins",
      initials: "SJ",
      passport: "US4409123",
      phone: "+1 (415) 890-2341",
      email: "sarah.j@travelworld.com",
      tier: "Gold",
      stays: 6,
      spend: "₹92,000.00",
      preferences: ["Sea/Garden View", "Airport Pickup", "King Bed"],
      color: "orange",
    },
    {
      id: 3,
      name: "Amit Patel",
      initials: "AP",
      license: "DL-04201889",
      phone: "+91 98220 11984",
      email: "amit.patel@techcorp.in",
      tier: "Silver",
      stays: 3,
      spend: "₹34,500.00",
      preferences: ["Quiet Room", "Fast Wi-Fi"],
      color: "gray",
    },
  ];

  const getPreferenceIcon = (preference) => {
    if (preference === "Airport Pickup") {
      return <Car size={13} />;
    }

    if (preference === "Fast Wi-Fi") {
      return <Wifi size={13} />;
    }

    if (preference === "King Bed") {
      return <BedDouble size={13} />;
    }

    if (preference === "Non-Smoking") {
      return <CigaretteOff size={13} />;
    }

    return null;
  };

  return (
    <div className="dashboard">
      <LightMode title="Walk In Registration" />

      <div className="walkin-page">

        {/* Header */}
        <div className="walkin-header">
          <div className="walkin-title">
            <div className="title-icon">
              <UsersRound size={23} />
            </div>  

            <div>
              <h2>Guest CRM & Profiles</h2>
              <p>
                Track loyalty tiers, stay histories, preferences, and verified IDs
              </p>
            </div>
          </div>

          <button className="register-btn">
            <UserRoundPlus size={17} />
            Register Walk-In Guest
          </button>
        </div>

        {/* VIP Filter */}
        <div className="vip-filter">
          <div className="vip-label">
            VIP Tier:
          </div>

          <button className="vip-btn active">
            All Guests
          </button>

          <button className="vip-btn platinum">
            Platinum
          </button>

          <button className="vip-btn gold">
            Gold
          </button>

          <button className="vip-btn silver">
            Silver
          </button>

          <button className="vip-btn regular">
            Regular
          </button>

          <span className="guest-count">
            10 Guests found
          </span>
        </div>

        {/* Guest Cards */}
        <div className="guest-grid">
          {guests.map((guest) => (
            <div className="guest-card" key={guest.id}>

              {/* Guest Top */}
              <div className="guest-top">

                <div className={`guest-avatar ${guest.color}`}>
                  {guest.initials}
                </div>

                <div className="guest-main-info">
                  <div className="guest-name-row">
                    <h3>{guest.name}</h3>

                    {guest.tier === "Platinum" && (
                      <Crown
                        size={16}
                        className="crown-icon"
                      />
                    )}
                  </div>

                  <div className="guest-document">
                    {guest.passport
                      ? `Passport: ${guest.passport}`
                      : `Driving License: ${guest.license}`}
                  </div>
                </div>

                <span className={`tier-badge ${guest.tier.toLowerCase()}`}>
                  {guest.tier}
                </span> 
              </div>

              {/* Contact */}
              <div className="guest-contact">

                <div className="contact-item">
                  <Phone size={15} />
                  <span style={{color: "black"}}>{guest.phone}</span>
                </div>

                <div className="contact-item">
                  <Mail size={15} />
                  <span style={{color: "black"}}>{guest.email}</span>
                </div>

              </div>

              {/* Divider */}
              <div className="guest-divider"></div>

              {/* Preferences */}
              <div className="preferences-section">

                <div className="preferences-title">
                  PREFERENCES:
                </div>

                <div className="preference-list">
                  {guest.preferences.map((preference, index) => (
                    <span
                      className="preference-tag"
                      key={index}
                    >
                      {getPreferenceIcon(preference)}
                      {preference}
                    </span>
                  ))}
                </div>

              </div>

              {/* Bottom */}
              <div className="guest-divider"></div>

              <div className="guest-bottom">

                <div className="stay-info">
                  <span className="stay-label">
                    Stays / Total Spend
                  </span>

                  <strong>
                    {guest.stays} Stays · {guest.spend}
                  </strong>
                </div>

                <button className="book-stay-btn">
                  Book Stay
                </button>

              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Walk_inAndReg;