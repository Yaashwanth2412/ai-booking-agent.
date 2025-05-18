import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { format } from 'date-fns';
import axios from 'axios';

export default function BookingAgent() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [bookingConfirmed, setBookingConfirmed] = useState(false);
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        // Fetch existing bookings from the backend
        axios.get('/api/bookings').then((response) => {
            setBookings(response.data);
        }).catch((error) => console.error(error));
    }, []);

    const handleBooking = () => {
        if (name && email && date && time) {
            const bookingDetails = { name, email, date, time };
            axios.post('/api/bookings', bookingDetails).then(() => {
                setBookingConfirmed(true);
                alert(`Booking confirmed for ${name} on ${format(new Date(date), 'PPP')} at ${time}`);
                setBookings([...bookings, bookingDetails]);
                setName('');
                setEmail('');
                setDate('');
                setTime('');
            }).catch((error) => console.error(error));
        } else {
            alert('Please fill in all the details.');
        }
    };

    return (
        <div className="flex flex-col items-center p-10 space-y-4">
            <Card className="w-full max-w-md p-6 rounded-2xl shadow-lg">
                <CardContent>
                    <h2 className="text-2xl font-bold mb-4">AI Booking Agent</h2>
                    <Input placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} className="mb-4" />
                    <Input type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} className="mb-4" />
                    <Input type="date" placeholder="Booking Date" value={date} onChange={(e) => setDate(e.target.value)} className="mb-4" />
                    <Input type="time" placeholder="Booking Time" value={time} onChange={(e) => setTime(e.target.value)} className="mb-4" />
                    <Button onClick={handleBooking} className="w-full">Confirm Booking</Button>
                </CardContent>
            </Card>

            {bookingConfirmed && (
                <Dialog open={bookingConfirmed} onOpenChange={setBookingConfirmed}>
                    <DialogContent>
                        <DialogTitle>Booking Confirmed</DialogTitle>
                        <DialogDescription>
                            Thank you, {name}! Your booking is confirmed for {format(new Date(date), 'PPP')} at {time}.
                        </DialogDescription>
                        <DialogFooter>
                            <Button onClick={() => setBookingConfirmed(false)}>Close</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            {/* List of existing bookings */}
            <Card className="w-full max-w-md p-6 rounded-2xl shadow-lg mt-4">
                <CardContent>
                    <h2 className="text-xl font-semibold mb-2">Existing Bookings</h2>
                    {bookings.length > 0 ? (
                        bookings.map((booking, index) => (
                            <div key={index} className="mb-2">
                                <strong>{booking.name}</strong> - {format(new Date(booking.date), 'PPP')} at {booking.time}
                            </div>
                        ))
                    ) : (
                        <p>No bookings yet. Be the first to book!</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
