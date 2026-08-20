import React, { use, useEffect, useState } from "react";
import LightMode from "../DartMode/LightMode";
import "./Branches.css";
import { alertError, alertSuccess } from "../../../swertalert/AlertSuccess";
import Request from "../../util/Request";
const mockRooms = [
  {
    id: "101",
    type: "Deluxe Double",
    status: "Occupied",
    guest: "Rajesh Sharma",
    code: "",
  },
];

const Branches = () => {
  const [filter, setFilter] = useState("All");
  const [data, setData] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);

  useEffect(() => {
    fetchRoom();
  }, []);

  // Fetch rooms
  const fetchRoom = async () => {
    try {
      const res = await Request("/api/room", "get");
      if (res) {
        const list = res.data || [];
        console.log(res);
        setData(list);
        setFilteredRooms(list);
      }
    } catch (error) {
      alertError({
        title: "Error",
        text: error?.response?.data?.message || "Failed to load rooms.",
      });
    }
  };

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
            <button className="floor-btn active">All Floors</button>
            <button className="floor-btn">Floor 1 (101-110)</button>
            <button className="floor-btn">Floor 2 (201-210)</button>
            <button className="floor-btn">Floor 3 (301-310)</button>
            <button className="floor-btn">Floor 4 Suites (401-410)</button>
          </div>
          <span>Showing 40 of 40</span>
        </div>
      </div>

      {/* Grid List */}
      <div className="room-grid">
        {mockRooms.map((room) => {
          const statusClass = room.status.toLowerCase();

          return (
            <div key={room.id} className={`room-card card-${statusClass}`}>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  overflow: "hidden",
                  marginBottom: "10px",
                }}
              >
                <img
                  src="../../../../public/imageCover/backgoroundHotel.gif"
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
                  <h3 className="room-number">{room.id}</h3>
                  <div className="room-type">{room.type}</div>
                </div>
                <span className={`status-tag badge-${statusClass}`}>
                  {room.status}
                </span>
              </div>

              <div className="card-body">
                {room.guest && (
                  <div className="guest-name">👤 {room.guest}</div>
                )}
                {room.staff && (
                  <div className="staff-name">🧹 {room.staff}</div>
                )}
                {room.price && <div className="price-tag">{room.price}</div>}
                {room.note && <div className="note-text">🚫 {room.note}</div>}
              </div>

              <div className="card-footer">
                <span className="room-code">🔑 {room.code}</span>
                <button className="manage-btn">MANAGE</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Branches;
