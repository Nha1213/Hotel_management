import { useEffect, useState, useRef } from "react";
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

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const res = await Request("/api/room", "get");
        if (res) {
          setData(res.data || []);
        }
      } catch (error) {
        alertError({
          title: "Error",
          text: error?.response?.data?.message || "Failed to load rooms.",
        });
      }
    };

    loadRooms();
  }, []);

  useEffect(() => {
    const loadRoomsByStatus = async () => {
      try {
        const res = await Request("/api/room/status/" + selectedRoom.id, "put", {status_room: buttonActive});
        if (res) {
          setData(res.data || []);
        }
      } catch (error) {
        alertError({
          title: "Error",
          text: error?.response?.data?.message || "Failed to load rooms.",
        });
      }
    };

    loadRoomsByStatus();
  }, [buttonActive]);

  const filteredRooms =
    filter === "All"
      ? data
      : data.filter(
          (room) => room.status.toLowerCase() === filter.toLowerCase(),
        );

  const floorRanges = {
    101: [101, 110],
    201: [201, 210],
    301: [301, 310],
    401: [401, 410],
  };
  const selectedFloorRange = floorRanges[filterFloor];
  const filteredRoomsByFloor = !selectedFloorRange
    ? filteredRooms
    : filteredRooms.filter((room) => {
        const roomNumber = Number(room.room_number);
        return (
          roomNumber >= selectedFloorRange[0] &&
          roomNumber <= selectedFloorRange[1]
        );
      });
  return (
    <div className="dashboard-container">
      <LightMode title="Room" />

      {/* Header Controls */}
      <div className="header-card">
        <div className="header-top">
          <h1 className="dashboard-title">
            <span className="title-icon">⣿</span>
            Room Status Board <span className="room-count">(40 rooms)</span>
          </h1>

          <div className="status-filters">
            <button
              className="filter-badge badge-all"
              onClick={() => setFilter("All")}
            >
              All (40)
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
              className="filter-badge badge-maint"
              onClick={() => setFilter("Maint")}
            >
              ● Maint
            </button>
            <button
              className="filter-badge badge-blocked"
              onClick={() => setFilter("Blocked")}
            >
              ● Blocked
            </button>
          </div>
        </div>

        <div className="floor-bar">
          <div className="floor-options">
            <span>Floors:</span>
            <button
              className={`floor-btn ${filterFloor === "All" ? "active" : ""}`}
              onClick={() => setFilterFloor("All")}
            >
              All Floors
            </button>
            <button
              className={`floor-btn ${filterFloor === "101" ? "active" : ""}`}
              onClick={() => setFilterFloor("101")}
            >
              Floor 1 (101-110)
            </button>
            <button
              className={`floor-btn ${filterFloor === "201" ? "active" : ""}`}
              onClick={() => setFilterFloor("201")}
            >
              Floor 2 (201-210)
            </button>
            <button
              className={`floor-btn ${filterFloor === "301" ? "active" : ""}`}
              onClick={() => setFilterFloor("301")}
            >
              Floor 3 (301-310)
            </button>
            <button
              className={`floor-btn ${filterFloor === "401" ? "active" : ""}`}
              onClick={() => setFilterFloor("401")}
            >
              Floor 4 Suites (401-410)
            </button>
          </div>
          <span>Showing 40 of 40</span>
        </div>
      </div>

      {/* Grid List */}
      <div className="room-grid">
        {filteredRoomsByFloor.map((room) => {
          const statusClass = room.status.toLowerCase();

          return (
            <div
              key={room.id}
              className={`room-card card-${statusClass}`}
              onClick={() => setSelectedRoom(room)}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                  marginBottom: "10px",
                }}
              >
                <img
                  src={BaseUrl + room.room_type.image}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "10px",
                  }}
                />
              </div>
              <div className="card-header">
                <div>
                  <h3 className="room-number">{room.room_number}</h3>
                  <div className="room-type">{room.room_type.name}</div>
                </div>
                <span className={`status-tag badge-${statusClass}`}>
                  {room.status}
                </span>
              </div>

              <div className="card-body">
                {room.room_type.price_per_night && (
                  <div className="price-tag">
                    ${Number(room.room_type.price_per_night).toFixed(2)}/nt
                  </div>
                )}
                {room.note && <div className="note-text">🚫 {room.note}</div>}
              </div>

              <div className="card-footer">
                <span className="room-code">🔑 {room.code}</span>
                <button
                  className="manage-btn"
                  onClick={() => setSelectedRoom(room)}
                >
                  MANAGE
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Popup */}
      {selectedRoom && (
        <div className="modal-overlay" onClick={() => setSelectedRoom(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="modal-header">
              <div className="modal-header-left">
                <div className="modal-room-badge">
                  {selectedRoom.room_number}
                </div>
                <div>
                  <div className="modal-title-row">
                    <h2>{selectedRoom.room_type?.name}</h2>
                    <span
                      className={`status-pill badge-${selectedRoom.status.toLowerCase()}`}
                    >
                      {selectedRoom.status}
                    </span>
                  </div>
                  <p className="modal-subtitle">
                    Floor {selectedRoom.floor || 1} • Base Rate $
                    {Number(
                      selectedRoom.room_type?.price_per_night || 0,
                    ).toFixed(2)}
                    /night
                  </p>
                </div>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setSelectedRoom(null)}
              >
                ✕
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="modal-tabs">
              <button
                className={`tab-btn ${activeTab === "Room & Guest" ? "active" : ""}`}
                onClick={() => setActiveTab("Room & Guest")}
              >
                Room & Guest
              </button>
              <button
                className={`tab-btn ${activeTab === "+ Quick Check-In" ? "active" : ""}`}
                onClick={() => setActiveTab("+ Quick Check-In")}
              >
                + Quick Check-In
              </button>
              <button
                className={`tab-btn ${activeTab === "Smart Lock" ? "active" : ""}`}
                onClick={() => setActiveTab("Smart Lock")}
              >
                Smart Lock
              </button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              {activeTab === "Room & Guest" && (
                <>
                  <label className="section-label">Change Room Status:</label>
                  <div className="status-grid">
                    <button
                      className={`status-btn  ${buttonActive == "Available" ? "btn-available" : "btn-available-active"}`}
                      onClick={() => {
                        setButtonActive("Available");
                      }}
                    >
                      Available
                    </button>
                    <button
                      className={`status-btn ${buttonActive == "Cleaning" ? "btn-cleaning" : "btn-cleaning-active"}`}
                      onClick={() => {
                        setButtonActive("Cleaning");
                      }}
                    >
                      Cleaning
                    </button>
                    <button
                      className={`status-btn  ${buttonActive == "Maintenance" ? "btn-maintenance" : "btn-maintenance-active"}`}
                      onClick={() => {
                        setButtonActive("Maintenance");
                      }}
                    >
                      Maintenance
                    </button>
                    <button
                      className={`status-btn  ${buttonActive == "Block" ? "btn-block" : "btn-block-active"}`}
                      onClick={() => {
                        setButtonActive("Block");
                      }}
                    >
                      Block Room
                    </button>
                    <button
                      className={`status-btn  ${buttonActive == "Reserved" ? "btn-reserved" : "btn-reserved-active"}`}
                      onClick={() => {
                        setButtonActive("Reserved");
                      }}
                    >
                      Reserved
                    </button>
                  </div>

                  <label
                    className="section-label"
                    style={{ marginTop: "20px" }}
                  >
                    Amenities & Features
                  </label>
                  <div className="amenities-list">
                    <span className="amenity-chip">✓ Queen Bed</span>
                    <span className="amenity-chip">✓ Work Desk</span>
                    <span className="amenity-chip">✓ Smart TV</span>
                  </div>
                </>
              )}

              {activeTab === "+ Quick Check-In" && (
                <div className="tab-content-placeholder">
                  <p>Quick Check-In details and forms go here.</p>
                </div>
              )}

              {activeTab === "Smart Lock" && (
                <div className="tab-content-placeholder">
                  <p>Smart Lock controls and access codes go here.</p>
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
