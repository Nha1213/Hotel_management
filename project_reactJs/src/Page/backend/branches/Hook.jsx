
import { alertError, alertSuccess } from '../../../swertalert/AlertSuccess'
import Request from '../../util/Request';
import { useEffect } from 'react';
import { useState } from 'react';
const Hook = () => {
    const [dataStaff, setStaff] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [pricePerNight, setPricePerNight] = useState(0);
    const [loadingReservation, setLoadingReservation] = useState(true);
    const [CheckOutloading, setCheckOutloading] = useState(true);
    const [state, setState] = useState({
        customer_id: "",
        reservation_date: "",
        check_in_date: "",
        check_out_date: "",
        total_guest: "",
        status: "",
        reservation_details: [],
        email: "",
        guest_name: "",
        phone: "",
        employee_id: "",
    });

    // fetch staff
    const fetchStaff = async () => {
        try {
            const res = await Request('/api/staffs', "get");
            if (res) {
                setStaff(res.data);
                // console.log("Fetched Staff Data:", res.data);
            }
        } catch (error) {
            alertError({
                text: error?.message || "Failed to fetch staff data",
            });
        }
    }
    useEffect(() => {
        fetchStaff();
    }, []);

    // fetch reservation
    const reservation_quick = async () => {
        try {
            const res = await Request('/api/reservation', "get");
            if (res) {
                setReservations(res.data || []);
                console.log("Fetched Reservations:", res.data);
            }
        } catch (error) {
            alertError({
                text: error?.message || "Failed to fetch staff data",
            });
        }
    }

    useEffect(() => {
        reservation_quick();
    }, []);

    // make reservation create with quick
    const make_reservation_quick = async (room) => {
        const today = new Date().toISOString().slice(0, 10);
        const checkInDate = state.check_in_date || today;
        const checkOutDate = state.check_out_date;
        const roomPrice = Number(room?.room_type?.price_per_night || 0);
        setPricePerNight(roomPrice);
        const nights = checkOutDate
            ? Math.ceil(
                (new Date(`${checkOutDate}T00:00:00`) -
                    new Date(`${checkInDate}T00:00:00`)) /
                (1000 * 60 * 60 * 24),
            )
            : 0;

        const data = {
            customer_id: state.customer_id || null,
            reservation_date: state.reservation_date || today,
            check_in_date: checkInDate,
            check_out_date: checkOutDate,
            total_guest: Number(state.total_guest) || 1,
            status: state.status || "Reserved",
            reservation_details: [
                {
                    room_id: room?.id,
                    price: roomPrice,
                    nights,
                    subtotal: roomPrice * nights,
                    room_number: room?.room_number,
                },
            ],
            email: state.email,
            guest_name: state.guest_name,
            phone: state.phone,
            employee_id: state.employee_id
        }

        if (!data.check_out_date || !data.reservation_details[0].room_id) {
            alertError({
                title: "Error",
                text: "Please select a checkout date and room.",
            });
            return;
        }

        if (nights <= 0) {
            alertError({
                title: "Error",
                text: "Checkout date must be after check-in date.",
            });
            return;
        }

        try {
            const res = await Request('/api/reservation', "post", data);
            if (res) {
                const reservation = {
                    ...(res.data?.reservation || res.data),
                    reservation_details: res.data?.reservationDetails || [],
                };

                setReservations((previous) => [
                    ...previous,
                    reservation,
                ]);
                alertSuccess({
                    title: "Success",
                    text: res.message || "Reservation created successfully.",
                });

                await Request(`/api/room/status/${room?.id}`, "put", {
                    status: "Reserved",
                });

                setLoadingReservation(false);

                setState({
                    customer_id: "",
                    reservation_date: "",
                    check_in_date: "",
                    check_out_date: "",
                    total_guest: "",
                    status: "",
                    reservation_details: [],
                    email: "",
                    guest_name: "",
                    phone: "",
                    employee_id: "",
                });
            }

        } catch (error) {
            alertError({
                title: "Error",
                text: error?.response?.data?.message || error?.message || "Failed to create reservation.",
            });
        }

    }


    /// handle check out
    const handleCheckOut = async (item) => {
        try {
            // =====================================================
            // GET RESERVATION DETAIL
            // =====================================================
            const reservation = reservations.find((reservationItem) =>
                reservationItem.reservation_details?.some(
                    (reservationDetail) => reservationDetail.room_id === item?.id,
                ),
            );
            const detail = reservation?.reservation_details?.find(
                (reservationDetail) => reservationDetail.room_id === item?.id,
            );

            if (!reservation || !detail) {
                alertError({
                    title: "Check Out Failed",
                    text: "Reservation detail not found.",
                });
                return;
            }

            // =====================================================
            // GET ROOM
            // =====================================================
            const roomId = detail?.room_id || detail?.room?.id;

            if (!roomId) {
                alertError({
                    title: "Check Out Failed",
                    text: "This reservation does not have a room.",
                });
                return;
            }

            // =====================================================
            // 1. CREATE CHECKOUT RECORD
            // =====================================================
            await Request("/api/checkOut", "post", {
                reservation_id: reservation.id,
                checkout_time: new Date().toISOString(),
                total_amount: Number(detail.subtotal) || 0,
                damage_fee: 0,
                discount: 0,
            });

            // =====================================================
            // 2. UPDATE RESERVATION STATUS
            // =====================================================
            await Request(
                `/api/reservation/status/${reservation.id}`,
                "put",
                {
                    status: "Checked Out",
                }
            );

            // =====================================================
            // 3. UPDATE ROOM STATUS
            // =====================================================
            await Request(
                `/api/room/status/${roomId}`,
                "put",
                {
                    status: "Available",
                }
            );

            // =====================================================
            // 4. REMOVE ROOM RELATIONSHIP
            // IMPORTANT:
            // This endpoint finds the detail by room ID
            // =====================================================
            await Request(
                `/api/reservationDetail/${roomId}`,
                "put"
            );

            // =====================================================
            // 5. UPDATE LOCAL STATE
            // =====================================================
            setReservations((previous) =>
                previous.map((reservationItem) => {
                    if (reservationItem.id !== reservation.id) {
                        return reservationItem;
                    }

                    return {
                        ...reservationItem,
                        status: "Checked Out",
                        reservation_details:
                            reservationItem.reservation_details?.map(
                                (reservationDetail) => ({
                                    ...reservationDetail,
                                    room_id: null,
                                    room: null,
                                })
                            ),
                    };
                })
            );

            // =====================================================
            // 6. SUCCESS FEEDBACK
            // =====================================================
            alertSuccess({
                title: "Check Out Successful",
                text: `${reservation.guest_name || "Guest"
                    } has been checked out successfully.`,
            });

            setCheckOutloading((previous) => !previous);

        } catch (error) {
            console.error("Check out error:", error);

            alertError({
                title: "Check Out Failed",
                text:
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to check out guest.",
            });
        }
    };
    return (
        {
            dataStaff,
            reservations,
            state,
            setState,
            reservation_quick,
            make_reservation_quick,
            pricePerNight,
            loadingReservation,
            handleCheckOut,
            CheckOutloading
        }
    )
}

export default Hook