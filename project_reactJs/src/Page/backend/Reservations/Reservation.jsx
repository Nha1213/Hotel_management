import { useEffect, useState } from "react";
import {
  CalendarDays,
  Filter,
  Plus,
  ChevronDown,
  Receipt,
  X,
} from "lucide-react";

import "./reservation.css";
import LightMode from "../DartMode/LightMode";
import Request from "../../util/Request";
import { alertError } from "../../../swertalert/AlertSuccess";

const Reservation = () => {
  const [status, setStatus] = useState("All Statuses");
  const [channel, setChannel] = useState("All Channels");
  const [dataReservation, setDataReservation] = useState([]);

  // Format API date
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Get first reservation detail
  const getDetail = (reservation) => {
    return reservation?.reservation_details?.[0] || null;
  };

  // Get room from reservation detail
  const getRoom = (reservation) => {
    return getDetail(reservation)?.room || null;
  };

  // Get room type
  const getRoomType = (reservation) => {
    return getRoom(reservation)?.room_type || null;
  };

  // Get stay text
  const getStay = (reservation) => {
    const checkIn = formatDate(reservation?.check_in_date);
    const checkOut = formatDate(reservation?.check_out_date);

    return `${checkIn} → ${checkOut}`;
  };

  // Get nights and guests
  const getStayInfo = (reservation) => {
    const detail = getDetail(reservation);

    const nights = detail?.nights || 0;
    const guests = reservation?.total_guest || 0;

    return `${nights} ${nights === 1 ? "night" : "nights"}, ${guests} ${
      guests === 1 ? "guest" : "guests"
    }`;
  };

  // Get amount
  const getAmount = (reservation) => {
    const detail = getDetail(reservation);

    return Number(detail?.subtotal || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const filteredReservations = dataReservation.filter((item) => {
    const statusMatch = status === "All Statuses" || item.status === status;

    /*
      Your current API JSON does not contain "source" or "channel".

      So "All Channels" will show everything.
      Once your backend returns source, this can be enabled.
    */
    const channelMatch = channel === "All Channels" || item.source === channel;

    return statusMatch && channelMatch;
  });

  const getStatusClass = (value) => {
    switch (value) {
      case "Checked In":
        return "status checked-in";

      case "Checked Out":
        return "status checked-out";

      case "Confirmed":
        return "status confirmed";

      case "Cancelled":
        return "status cancelled";

      case "Reserved":
        return "status confirmed";

      default:
        return "status";
    }
  };

  
  useEffect(() => {
      const fetchReservations = async () => {
        try {
          const res = await Request("/api/reservation", "get");
    
          console.log("Reservations:", res.data);
    
          setDataReservation(res.data || []);
        } catch (error) {
          console.error(error);
    
          alertError({
            title: "Error",
            text: error?.response?.data?.message || "Failed to load reservations.",
          });
        }
      };
    fetchReservations();
  }, []);

  return (
    <div className="dashboard reservation-page">
      <LightMode title="Reservations" />

      <main className="reservation-container">
        {/* Header */}
        <section className="reservation-header">
          <div className="reservation-title">
            <div className="title-icon">
              <CalendarDays size={22} />
            </div>

            <div>
              <h1>Reservations & Bookings</h1>
              <p>Manage all guest arrivals, departures, and OTA sync</p>
            </div>
          </div>

          <button className="create-booking-btn">
            <Plus size={18} />
            Create New Booking
          </button>
        </section>

        {/* Filters */}
        <section className="reservation-filter">
          <div className="filter-left">
            <div className="filter-label">
              <Filter size={16} />
              <span>Filter:</span>
            </div>

            <div className="status-buttons">
              {[
                "All Statuses",
                "Reserved",
                "Confirmed",
                "Checked In",
                "Checked Out",
                "Cancelled",
              ].map((item) => (
                <button
                  key={item}
                  className={
                    status === item ? "filter-btn active" : "filter-btn"
                  }
                  onClick={() => setStatus(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Channel */}
          <div className="channel-filter">
            <span>Channel:</span>

            <div className="select-wrapper">
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
              >
                <option>All Channels</option>
                <option>Direct</option>
                <option>Corporate</option>
                <option>Booking.com</option>
                <option>Expedia</option>
              </select>

              <ChevronDown size={15} />
            </div>
          </div>
        </section>

        {/* Table */}
        <section className="reservation-table-wrapper">
          <table className="reservation-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Guest Name</th>
                <th>Room</th>
                <th>Stay Dates</th>
                <th>Status</th>
                <th>Source</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredReservations.length > 0 ? (
                filteredReservations.map((item) => {
                  const detail = getDetail(item);
                  const room = getRoom(item);
                  const roomType = getRoomType(item);

                  return (
                    <tr key={item.id}>
                      {/* Booking ID */}
                      <td>
                        <span className="booking-id">
                          BK-{String(item.id).padStart(4, "0")}
                        </span>
                      </td>

                      {/* Guest */}
                      <td>
                        <div className="guest-info">
                          <strong>{item.guest_name || "Unknown Guest"}</strong>

                          {item.email && <span>{item.email}</span>}
                        </div>
                      </td>

                      {/* Room */}
                      <td>
                        <div className="room-info">
                          <strong>#{room?.room_number || "-"}</strong>

                          <span>{roomType?.name || "Unknown Room Type"}</span>
                        </div>
                      </td>

                      {/* Stay */}
                      <td>
                        <div className="stay-info">
                          <strong>{getStay(item)}</strong>

                          <span>({getStayInfo(item)})</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td>
                        <span className={getStatusClass(item.status)}>
                          {item.status}
                        </span>
                      </td>

                      {/* Source */}
                      <td>
                        <span className="source-badge">
                          {item.source || "Direct"}
                        </span>
                      </td>

                      {/* Amount */}
                      <td>
                        <div className="amount-info">
                          <strong>${getAmount(item)}</strong>

                          <span>
                            Paid: $
                            {Number(item.paid || 0).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="action-buttons">
                          {/* Check In */}
                          {(item.status === "Confirmed" ||
                            item.status === "Reserved") && (
                            <button className="action-btn check-in">
                              Check In
                            </button>
                          )}

                          {/* Check Out */}
                          {item.status === "Checked In" && (
                            <button className="action-btn check-out">
                              Check Out
                            </button>
                          )}

                          {/* Payment */}
                          <button className="icon-action" title="Payment">
                            <Receipt size={17} />
                          </button>

                          {/* Cancel */}
                          {(item.status === "Confirmed" ||
                            item.status === "Reserved") && (
                            <button
                              className="icon-action cancel"
                              title="Cancel"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8">
                    <div className="empty-reservation">
                      No reservations found
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default Reservation;
