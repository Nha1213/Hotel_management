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
import { alertError, alertSuccess } from "../../../swertalert/AlertSuccess";

const Reservation = () => {
  const [status, setStatus] = useState("All Statuses");
  const [channel, setChannel] = useState("All Channels");
  const [dataReservation, setDataReservation] = useState([]);

  // Loading state
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);
  const [loadingAction, setLoadingAction] = useState(null);

  // =========================================================
  // Format API date
  // =========================================================
  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================================
  // Get first reservation detail
  // =========================================================
  const getDetail = (reservation) => {
    return reservation?.reservation_details?.[0] || null;
  };

  // =========================================================
  // Get room
  // =========================================================
  const getRoom = (reservation) => {
    return getDetail(reservation)?.room || null;
  };

  // =========================================================
  // Get room type
  // =========================================================
  const getRoomType = (reservation) => {
    return getRoom(reservation)?.room_type || null;
  };

  // =========================================================
  // Get stay text
  // =========================================================
  const getStay = (reservation) => {
    const checkIn = formatDate(reservation?.check_in_date);
    const checkOut = formatDate(reservation?.check_out_date);

    return `${checkIn} → ${checkOut}`;
  };

  // =========================================================
  // Get nights and guests
  // =========================================================
  const getStayInfo = (reservation) => {
    const detail = getDetail(reservation);

    const nights = Number(detail?.nights || 0);
    const guests = Number(reservation?.total_guest || 0);

    return `${nights} ${nights === 1 ? "night" : "nights"}, ${guests} ${
      guests === 1 ? "guest" : "guests"
    }`;
  };

  // =========================================================
  // Get amount
  // =========================================================
  const getAmountValue = (reservation) => {
    const detail = getDetail(reservation);

    if (detail?.subtotal !== undefined && detail?.subtotal !== null) {
      return Number(detail.subtotal || 0);
    }

    const price = Number(detail?.price || 0);
    const nights = Number(detail?.nights || 0);

    return price * nights;
  };

  // =========================================================
  // Format amount
  // =========================================================
  const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // =========================================================
  // Filter reservations
  // =========================================================
  const filteredReservations = dataReservation.filter((item) => {
    const statusMatch = status === "All Statuses" || item.status === status;

    const channelMatch =
      channel === "All Channels" || (item.source || "Direct") === channel;

    return statusMatch && channelMatch;
  });

  // =========================================================
  // Status class
  // =========================================================
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

  // =========================================================
  // Fetch reservations
  // =========================================================
  useEffect(() => {
    let isMounted = true;

    Request("/api/reservation", "get")
      .then((res) => {
        if (!isMounted) return;

        setDataReservation(Array.isArray(res.data) ? res.data : []);
        console.log("Fetched Reservations:", res.data);
      })
      .catch((error) => {
        if (!isMounted) return;

        console.error("Fetch reservations error:", error);
        setDataReservation([]);
        alertError({
          title: "Error",
          text:
            error?.response?.data?.message || "Failed to load reservations.",
        });
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // =========================================================
  // Check In
  // =========================================================
  const handleCheckIn = async (item) => {
    if (!item?.id || loadingId !== null) {
      return;
    }

    const roomId = getDetail(item)?.room?.id;

    if (!roomId) {
      alertError({
        title: "Check In Failed",
        text: "This reservation does not have a room.",
      });

      return;
    }

    try {
      setLoadingId(item.id);
      setLoadingAction("checkin");

      // Update reservation status
      await Request(`/api/reservation/status/${item.id}`, "put", {
        status: "Checked In",
      });

      // Update room status
      await Request(`/api/room/status/${roomId}`, "put", {
        status: "Occupied",
      });

      // Create check-in
      await Request("/api/checkIn", "post", {
        reservation_id: item.id,
        checkin_time: new Date().toISOString(),
        deposit: 0,
      });

      // Update local state
      setDataReservation((prevData) =>
        prevData.map((reservation) =>
          reservation.id === item.id
            ? {
                ...reservation,
                status: "Checked In",
              }
            : reservation,
        ),
      );

      // =====================================================
      // SUCCESS FEEDBACK
      // =====================================================
      alertSuccess({
        title: "Check In Successful",
        text: `${item.guest_name || "Guest"} has been checked in successfully.`,
      });
    } catch (error) {
      console.error("Check in error:", error);

      alertError({
        title: "Check In Failed",
        text: error?.response?.data?.message || "Failed to check in guest.",
      });
    } finally {
      setLoadingId(null);
      setLoadingAction(null);
    }
  };

  // =========================================================
  // Check Out
  // =========================================================
  const handleCheckOut = async (item) => {
    if (!item?.id || loadingId !== null) {
      return;
    }

    const roomId = getDetail(item)?.room?.id;

    if (!roomId) {
      alertError({
        title: "Check Out Failed",
        text: "This reservation does not have a room.",
      });

      return;
    }

    try {
      setLoadingId(item.id);
      setLoadingAction("checkout");

      const totalAmount = getAmountValue(item);

      // Create checkout record
      await Request("/api/checkOut", "post", {
        reservation_id: item.id,
        checkout_time: new Date().toISOString(),
        total_amount: totalAmount,
        damage_fee: 0,
        discount: 0,
      });

      // Update reservation status
      await Request(`/api/reservation/status/${item.id}`, "put", {
        status: "Checked Out",
      });

      // Update room status
      await Request(`/api/room/status/${roomId}`, "put", {
        status: "Available",
      });
      // Remove room relationship
      await Request(`/api/reservationDetail/${getRoom(item).id}`, "put");

      // Update local state
      setDataReservation((prevData) =>
        prevData.map((reservation) =>
          reservation.id === item.id
            ? {
                ...reservation,
                status: "Checked Out",
              }
            : reservation,
        ),
      );

      // =====================================================
      // SUCCESS FEEDBACK
      // =====================================================
      alertSuccess({
        title: "Check Out Successful",
        text: `${item.guest_name || "Guest"} has been checked out successfully.`,
      });
    } catch (error) {
      console.error("Check out error:", error);

      alertError({
        title: "Check Out Failed",
        text: error?.response?.data?.message || "Failed to check out guest.",
      });
    } finally {
      setLoadingId(null);
      setLoadingAction(null);
    }
  };

  // =========================================================
  // Cancel Reservation
  // =========================================================
  const handleCancel = async (item) => {
    if (!item?.id || loadingId !== null) {
      return;
    }

    const roomId = getRoom(item)?.id;

    if (!roomId) {
      alertError({
        title: "Cancel Failed",
        text: "This reservation does not have a room.",
      });

      return;
    }

    try {
      setLoadingId(item.id);
      setLoadingAction("cancel");

      await Request(`/api/reservation/status/${item.id}`, "put", {
        status: "Cancelled",
      });

      await Request(`/api/reservationDetail/${roomId}`, "put");

      await Request(`/api/room/status/${roomId}`, "put", {
        status: "Available",
      });

      // Update local state
      setDataReservation((prevData) =>
        prevData.map((reservation) =>
          reservation.id === item.id
            ? {
                ...reservation,
                status: "Cancelled",
              }
            : reservation,
        ),
      );

      // =====================================================
      // SUCCESS FEEDBACK
      // =====================================================
      alertSuccess({
        title: "Reservation Cancelled",
        text: `Reservation BK-${String(item.id).padStart(
          4,
          "0",
        )} has been cancelled successfully.`,
      });
    } catch (error) {
      console.error("Cancel reservation error:", error);

      alertError({
        title: "Cancel Failed",
        text: error?.response?.data?.message || "Failed to cancel reservation.",
      });
    } finally {
      setLoadingId(null);
      setLoadingAction(null);
    }
  };

  // =========================================================
  // Render
  // =========================================================
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

          <button
            type="button"
            className="create-booking-btn"
            onClick={() => {
              console.log("Create New Booking");
            }}
          >
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
                  type="button"
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
              {/* Loading */}
              {loading ? (
                <tr>
                  <td colSpan="8">
                    <div className="empty-reservation">
                      Loading reservations...
                    </div>
                  </td>
                </tr>
              ) : filteredReservations.length > 0 ? (
                filteredReservations.map((item) => {
                  const room = getRoom(item);
                  const roomType = getRoomType(item);
                  const isLoading = loadingId === item.id;

                  return (
                    <tr key={item.id}>
                      {/* Booking ID */}
                      <td>
                        <span className="booking-id">
                          BK-
                          {String(item.id).padStart(4, "0")}
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
                          <strong>#{item.reservation_details[0]?.room_number || "-"}</strong>

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
                          {item.status || "Unknown"}
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
                          <strong>${formatAmount(getAmountValue(item))}</strong>

                          <span>Paid: ${formatAmount(item.paid)}</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="action-buttons">
                          {/* Check In */}
                          {(item.status === "Confirmed" ||
                            item.status === "Reserved") && (
                            <button
                              type="button"
                              className="action-btn check-in"
                              onClick={() => handleCheckIn(item)}
                              disabled={loadingId !== null}
                            >
                              {isLoading && loadingAction === "checkin"
                                ? "Checking In..."
                                : "Check In"}
                            </button>
                          )}

                          {/* Check Out */}
                          {item.status === "Checked In" && (
                            <button
                              type="button"
                              className="action-btn check-out"
                              onClick={() => handleCheckOut(item)}
                              disabled={loadingId !== null}
                            >
                              {isLoading && loadingAction === "checkout"
                                ? "Checking Out..."
                                : "Check Out"}
                            </button>
                          )}

                          {/* Payment */}
                          <button
                            type="button"
                            className="icon-action"
                            title="Payment"
                            disabled={loadingId !== null}
                            onClick={() => {
                              console.log("Payment for reservation:", item.id);
                            }}
                          >
                            <Receipt size={17} />
                          </button>

                          {/* Cancel */}
                          {(item.status === "Confirmed" ||
                            item.status === "Reserved") && (
                            <button
                              type="button"
                              className="icon-action cancel"
                              title="Cancel"
                              disabled={loadingId !== null}
                              onClick={() => handleCancel(item)}
                            >
                              {isLoading && loadingAction === "cancel" ? (
                                "..."
                              ) : (
                                <X size={16} />
                              )}
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
