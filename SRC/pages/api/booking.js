import fs from 'fs';
import path from 'path';

// Path to the bookings data file
const bookingsFilePath = path.join(process.cwd(), 'bookings.json');

// Helper function to read the bookings data
const readBookings = () => {
    if (!fs.existsSync(bookingsFilePath)) {
        fs.writeFileSync(bookingsFilePath, '[]');
    }
    const data = fs.readFileSync(bookingsFilePath, 'utf8');
    return JSON.parse(data);
};

// Helper function to write the bookings data
const writeBookings = (bookings) => {
    fs.writeFileSync(bookingsFilePath, JSON.stringify(bookings, null, 2));
};

export default function handler(req, res) {
    if (req.method === 'GET') {
        const bookings = readBookings();
        res.status(200).json(bookings);
    } else if (req.method === 'POST') {
        const newBooking = req.body;
        const bookings = readBookings();
        bookings.push(newBooking);
        writeBookings(bookings);
        res.status(201).json({ message: 'Booking added successfully' });
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
