import { useEffect, useState } from "react";
import LightMode from "../DartMode/LightMode";
import "./Branches.css";
import { alertError } from "../../../swertalert/AlertSuccess";
import Request from "../../util/Request";
import { BaseUrl } from "../../util/BaseUrl";

const Branches = () => {
  const [filter, setFilter] = useState("All");
  const [data, setData] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [activeTab, setActiveTab] = useState("Room & Guest");
  const [filterFloor, setFilterFloor] = useState("All");
  const [buttonActive, setButtonActive] = useState("Available");

  // =========================================================
  // LOAD ALL ROOMS
  // =========================================================
  const loadRooms = async () => {
    try {
      const res = await Request("/api/room", "get");

      console.log("Room API Response:", res);

      if (res) {
        /*
          Depending on your backend response, this handles:

          res.data = [...]
          OR
          res.rooms = [...]
        */

        const rooms = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.rooms)
            ? res.rooms
            : [];

        setData(rooms);
      }
    } catch (error) {
      console.error("Load rooms error:", error);

      alertError({
        title: "Error",
        text:
          error?.response?.data?.message ||
          "Failed to load rooms.",
      });

      setData([]);
    }
  };

  // =========================================================
  // LOAD ROOMS WHEN PAGE LOADS
  // =========================================================
  useEffect(() => {
    loadRooms();
  }, []);

  // =========================================================
  // UPDATE ROOM STATUS
  // =========================================================
  const loadRoomsByStatus = async (status) => {
    if (!selectedRoom?.id) {
      console.log("No room selected");
      return;
    }

    try {
      const res = await Request(
        `/api/room/status/${selectedRoom.id}`,
        "put",
        {
          status: status,
        }
      );

      console.log("Update Status Response:", res);

      // -----------------------------------------------------
      // Update room in the main list
      // -----------------------------------------------------
      setData((prev) => {
        if (!Array.isArray(prev)) {
          return [];
        }

        return prev.map((room) =>
          room.id === selectedRoom.id
            ? {
              ...room,
              status: status,
            }
            : room
        );
      });

      // -----------------------------------------------------
      // Update selected room in modal
      // -----------------------------------------------------
      setSelectedRoom((prev) => {
        if (!prev) {
          return null;
        }

        return {
          ...prev,
          status: status,
        };
      });

      // -----------------------------------------------------
      // Update active button
      // -----------------------------------------------------
      setButtonActive(status);
    } catch (error) {
      console.error("Update room status error:", error);

      alertError({
        title: "Error",
        text:
          error?.response?.data?.message ||
          "Failed to update room status.",
      });
    }
  };

  // =========================================================
  // FILTER BY STATUS
  // =========================================================
  const rooms = Array.isArray(data) ? data : [];

  const filteredRooms =
    filter === "All"
      ? rooms
      : rooms.filter(
        (room) =>
          room.status?.toLowerCase() ===
          filter.toLowerCase()
      );

  // =========================================================
  // FLOOR RANGE
  // =========================================================
  const floorRanges = {
    101: [101, 110],
    201: [201, 210],
    301: [301, 310],
    401: [401, 410],
  };

  const selectedFloorRange = floorRanges[filterFloor];

  // =========================================================
  // FILTER BY FLOOR
  // =========================================================
  const filteredRoomsByFloor = !selectedFloorRange
    ? filteredRooms
    : filteredRooms.filter((room) => {
      const roomNumber = Number(room.room_number);

      return (
        roomNumber >= selectedFloorRange[0] &&
        roomNumber <= selectedFloorRange[1]
      );
    });

  // =========================================================
  // ROOM COUNT
  // =========================================================
  const totalRooms = rooms.length;
  const showingRooms = filteredRoomsByFloor.length;

  // =========================================================
  // OPEN ROOM MODAL
  // =========================================================
  const openRoom = (room) => {
    setSelectedRoom(room);
    setButtonActive(room.status || "Available");
    setActiveTab("Room & Guest");
  };

  return (
    <div className="dashboard-container">
      <LightMode title="Room" />

      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="header-card">
        <div className="header-top">
          <h1 className="dashboard-title">
            <span className="title-icon">⣿</span>

            Room Status Board{" "}

            <span className="room-count">
              ({totalRooms} rooms)
            </span>
          </h1>

          {/* =================================================
              STATUS FILTERS
          ================================================= */}
          <div className="status-filters">
            <button
              className="filter-badge badge-all"
              onClick={() => setFilter("All")}
            >
              All ({totalRooms})
            </button>

            <button
              className="filter-badge badge-available"
              onClick={() => setFilter("Available")}
            >
              ● Available
            </button>

            <button
              className="filter-badge badge-occupied"
              onClick={() => setFilter("Occupied")}
            >
              ● Occupied
            </button>

            <button
              className="filter-badge badge-reserved"
              onClick={() => setFilter("Reserved")}
            >
              ● Reserved
            </button>

            <button
              className="filter-badge badge-cleaning"
              onClick={() => setFilter("Cleaning")}
            >
              ● Cleaning
            </button>

            <button
              className="filter-badge badge-maintenance"
              onClick={() => setFilter("Maintenance")}
            >
              ● Maint
            </button>

            <button
              className="filter-badge badge-block"
              onClick={() => setFilter("block")}
            >
              ● block
            </button>
          </div>
        </div>

        {/* ===================================================
            FLOOR FILTER
        =================================================== */}
        <div className="floor-bar">
          <div className="floor-options">
            <span>Floors:</span>

            <button
              className={`floor-btn ${filterFloor === "All" ? "active" : ""
                }`}
              onClick={() => setFilterFloor("All")}
            >
              All Floors
            </button>

            <button
              className={`floor-btn ${filterFloor === "101" ? "active" : ""
                }`}
              onClick={() => setFilterFloor("101")}
            >
              Floor 1 (101-110)
            </button>

            <button
              className={`floor-btn ${filterFloor === "201" ? "active" : ""
                }`}
              onClick={() => setFilterFloor("201")}
            >
              Floor 2 (201-210)
            </button>

            <button
              className={`floor-btn ${filterFloor === "301" ? "active" : ""
                }`}
              onClick={() => setFilterFloor("301")}
            >
              Floor 3 (301-310)
            </button>

            <button
              className={`floor-btn ${filterFloor === "401" ? "active" : ""
                }`}
              onClick={() => setFilterFloor("401")}
            >
              Floor 4 Suites (401-410)
            </button>
          </div>

          <span>
            Showing {showingRooms} of {totalRooms}
          </span>
        </div>
      </div>

      {/* =====================================================
          ROOM GRID
      ===================================================== */}
      <div className="room-grid">
        {filteredRoomsByFloor.length > 0 ? (
          filteredRoomsByFloor.map((room) => {
            const statusClass =
              room.status?.toLowerCase() || "available";

            return (
              <div
                key={room.id}
                className={`room-card card-${statusClass}`}
                onClick={() => openRoom(room)}
              >
                {/* =================================================
                    ROOM IMAGE
                ================================================= */}
                <div
                  style={{
                    width: "100%",
                    height: "180px",
                    overflow: "hidden",
                    marginBottom: "10px",
                  }}
                >
                  {room.room_type?.image ? (
                    <img
                      src={
                        BaseUrl +
                        room.room_type.image
                      }
                      alt={
                        room.room_type?.name ||
                        "Room"
                      }
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "10px",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "#eee",
                        borderRadius: "10px",
                      }}
                    >
                      No Image
                    </div>
                  )}
                </div>

                {/* =================================================
                    CARD HEADER
                ================================================= */}
                <div className="card-header">
                  <div>
                    <h3 className="room-number">
                      {room.room_number}
                    </h3>

                    <div className="room-type">
                      {room.room_type?.name ||
                        "Unknown Room"}
                    </div>
                  </div>

                  <span
                    className={`status-tag badge-${statusClass}`}
                  >
                    {room.status}
                  </span>
                </div>

                {/* =================================================
                    CARD BODY
                ================================================= */}
                <div className="card-body">
                  {room.room_type?.price_per_night && (
                    <div className="price-tag">
                      $
                      {Number(
                        room.room_type
                          .price_per_night
                      ).toFixed(2)}
                      /nt
                    </div>
                  )}

                  {room.note && (
                    <div className="note-text">
                      🚫 {room.note}
                    </div>
                  )}
                </div>

                {/* =================================================
                    CARD FOOTER
                ================================================= */}
                <div className="card-footer">
                  <span className="room-code">
                    🔑 {room.code}
                  </span>

                  <button
                    className="manage-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      openRoom(room);
                    }}
                  >
                    MANAGE
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div
            style={{
              width: "100%",
              padding: "40px",
              textAlign: "center",
            }}
          >
            <h3>No rooms found</h3>

            <p>
              There are no rooms matching your
              current filters.
            </p>
          </div>
        )}
      </div>

      {/* =====================================================
          MODAL
      ===================================================== */}
      {selectedRoom && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedRoom(null)}
        >
          <div
            className="modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            {/* =================================================
                MODAL HEADER
            ================================================= */}
            <div className="modal-header">
              <div className="modal-header-left">
                <div className="modal-room-badge">
                  {selectedRoom.room_number}
                </div>

                <div>
                  <div className="modal-title-row">
                    <h2>
                      {selectedRoom.room_type?.name}
                    </h2>

                    <span
                      className={`status-pill badge-${selectedRoom.status?.toLowerCase() ||
                        "available"
                        }`}
                    >
                      {selectedRoom.status}
                    </span>
                  </div>

                  <p className="modal-subtitle">
                    Floor{" "}
                    {selectedRoom.floor || 1} • Base
                    Rate $

                    {Number(
                      selectedRoom.room_type
                        ?.price_per_night || 0
                    ).toFixed(2)}
                    /night
                  </p>
                </div>
              </div>

              <button
                className="modal-close-btn"
                onClick={() =>
                  setSelectedRoom(null)
                }
              >
                ✕
              </button>
            </div>

            {/* =================================================
                MODAL TABS
            ================================================= */}
            <div className="modal-tabs">
              <button
                className={`tab-btn ${activeTab === "Room & Guest"
                  ? "active"
                  : ""
                  }`}
                onClick={() =>
                  setActiveTab("Room & Guest")
                }
              >
                Room & Guest
              </button>

              <button
                className={`tab-btn ${activeTab === "+ Quick Check-In"
                  ? "active"
                  : ""
                  }`}
                onClick={() =>
                  setActiveTab("+ Quick Check-In")
                }
              >
                + Quick Check-In
              </button>

              <button
                className={`tab-btn ${activeTab === "Smart Lock"
                  ? "active"
                  : ""
                  }`}
                onClick={() =>
                  setActiveTab("Smart Lock")
                }
              >
                Smart Lock
              </button>
            </div>

            {/* =================================================
                MODAL BODY
            ================================================= */}
            <div className="modal-body">
              {/* =================================================
                  ROOM & GUEST
              ================================================= */}
              {activeTab === "Room & Guest" && (
                <>
                  <label className="section-label">
                    Change Room Status:
                  </label>

                  <div className="status-grid">
                    {/* AVAILABLE */}
                    <button
                      className={`status-btn ${buttonActive === "Available"
                        ? "btn-available"
                        : "btn-available-active"
                        }`}
                      onClick={() =>
                        loadRoomsByStatus(
                          "Available"
                        )
                      }
                    >
                      Available
                    </button>

                    {/* CLEANING */}
                    <button
                      className={`status-btn ${buttonActive === "Cleaning"
                        ? "btn-cleaning"
                        : "btn-cleaning-active"
                        }`}
                      onClick={() =>
                        loadRoomsByStatus(
                          "Cleaning"
                        )
                      }
                    >
                      Cleaning
                    </button>

                    {/* MAINTENANCE */}
                    <button
                      className={`status-btn ${buttonActive === "Maintenance"
                        ? "btn-maintenance"
                        : "btn-maintenance-active"
                        }`}
                      onClick={() =>
                        loadRoomsByStatus(
                          "Maintenance"
                        )
                      }
                    >
                      Maintenance
                    </button>

                    {/* BLOCK */}
                    <button
                      className={`status-btn ${buttonActive === "Blocked"
                        ? "btn-block"
                        : "btn-block-active"
                        }`}
                      onClick={() =>
                        loadRoomsByStatus(
                          "Blocked"
                        )
                      }
                    >
                      Block Room
                    </button>

                    {/* RESERVED */}
                    <button
                      className={`status-btn ${buttonActive === "Reserved"
                        ? "btn-reserved"
                        : "btn-reserved-active"
                        }`}
                      onClick={() =>
                        loadRoomsByStatus(
                          "Reserved"
                        )
                      }
                    >
                      Reserved
                    </button>
                    {/* OCCUPIED */}
                    <button
                      className={`status-btn ${buttonActive === "Occupied"
                        ? "btn-occupied"
                        : "btn-occupied-active"
                        }`}
                      onClick={() =>
                        loadRoomsByStatus(
                          "Occupied"
                        )
                      }
                    >
                      Occupied
                    </button>
                  </div>

                  {/* =================================================
                      AMENITIES
                  ================================================= */}
                  <label
                    className="section-label"
                    style={{
                      marginTop: "20px",
                    }}
                  >
                    Amenities & Features
                  </label>

                  <div className="amenities-list">
                    <span className="amenity-chip">
                      ✓ Queen Bed
                    </span>

                    <span className="amenity-chip">
                      ✓ Work Desk
                    </span>

                    <span className="amenity-chip">
                      ✓ Smart TV
                    </span>
                  </div>
                </>
              )}

              {/* =================================================
                  QUICK CHECK-IN
              ================================================= */}
              {activeTab ===
                "+ Quick Check-In" && (
                  <div className="tab-content-placeholder">

                    <div className="guest-info">
                      <div>
                        <label htmlFor="">Guest Full name</label>
                        <input type="text" placeholder="e.g. Vikram Malhotra" />
                      </div>
                      <div>
                        <label htmlFor="">Employees Name</label>
                        <select name="" id="">
                          <option value="">Select Employee</option>
                          <option value="">Vikram Malhotra</option>
                        </select>
                      </div>
                    </div>

                    <div className="guest-info">
                      <div>
                        <label htmlFor="">Phone Number*</label>
                        <input type="tel" placeholder="+855 123 456 789" />
                      </div>
                      <div>
                        <label htmlFor="">Email</label><br />
                        <input type="email" placeholder="e.g. 7eVYX@example.com" />
                      </div>
                    </div>

                    <div className="guest-info">
                      <div>
                        <label htmlFor="">Check-Out Date</label><br />
                        <input placeholder="+855 123 456 789" type="date" />
                      </div>
                      <div>
                        <label htmlFor="">Number of Guests</label>
                        <select name="" id="">
                          <option value="">1 Adult</option>
                          <option value="">Vikram Malhotra</option>
                        </select>
                      </div>
                    </div>

                    <div className="placement">
                      <div className="room-rate">
                        <span>Room Rate (1 Night):</span>
                        <span>120.00 USD</span>
                      </div>
                      <div className="tax">
                        <span>Estimated Tax (5% GST):</span>
                        <span>150.00 USD</span>
                      </div>
                      <div className="ruler">

                      </div>
                      <div className="total-payable mb-1">
                        <span>Total Payable:</span>
                        <span>270.00 USD</span>
                      </div>
                    </div>

                    <div className="btn-walk-in">
                      <button className="walk-btn">
                        Complete Walk-In Check-In
                      </button>
                    </div>

                  </div>
                )}

              {/* =================================================
                  SMART LOCK
              ================================================= */}
              {activeTab === "Smart Lock" && (
                <div className="tab-content-placeholder">
                  <div className="smart-lock">
                    <div className="smart-lock-title">
                      <span>RFID / LoT Smart Lock #LK-103</span>
                    </div>
                    <div className="smart-lock-info">
                      <div className="pin-code">
                        <span>Current PIN Access Code:</span>
                        <h5>1234</h5>
                      </div>
                      <div>
                        <button>
                          Regenerate PIN
                        </button>
                      </div>
                    </div>
                    <div className="smart-lock-ruler">

                    </div>
                    <div className="smart-lock-footer">
                      <span>
                        last Opened: Never
                      </span>
                      <span>
                        <button>
                          Lock (Click to Unlock)
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Branches;