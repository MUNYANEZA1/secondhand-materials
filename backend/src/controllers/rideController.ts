import { Request, Response } from 'express';
import Ride from '../models/RideModel';
import { IUser } from '../models/UserModel'; // For req.user type

// @desc    Fetch all rides (offers and requests) with filtering
// @route   GET /api/rides
// @access  Public
export const getRides = async (req: Request, res: Response) => {
  const { type, origin, destination, date, minSeats, maxPrice, status = 'active', page = 1, limit = 10 } = req.query;
  const filters: any = { status };

  if (type && type !== 'All') filters.type = type as string;
  if (origin) filters.origin = { $regex: origin as string, $options: 'i' };
  if (destination) filters.destination = { $regex: destination as string, $options: 'i' };
  if (date) filters.date = new Date(date as string);
  if (minSeats) {
    if (filters.type === 'offer') filters.availableSeats = { $gte: Number(minSeats) };
    else if (filters.type === 'request') filters.seatsNeeded = { $gte: Number(minSeats) };
    // else: if type is 'All', this filter might be ambiguous or apply to both with an OR
  }
  if (maxPrice) filters.price = { $lte: Number(maxPrice) };

  try {
    const count = await Ride.countDocuments(filters);
    const rides = await Ride.find(filters)
      .populate('user', 'name avatar rating verified')
      .populate('passengers.userId', 'name avatar')
      .sort({ date: 1, time: 1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    res.json({
        rides,
        page: Number(page),
        pages: Math.ceil(count / Number(limit)),
        total: count
    });
  } catch (error: any) {
    console.error('Error fetching rides:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Fetch a single ride by ID
// @route   GET /api/rides/:id
// @access  Public
export const getRideById = async (req: Request, res: Response) => {
  try {
    const ride = await Ride.findById(req.params.id)
      .populate('user', 'name email avatar rating verified')
      .populate('passengers.userId', 'name email avatar');
    if (ride) {
      res.json(ride);
    } else {
      res.status(404).json({ message: 'Ride not found' });
    }
  } catch (error: any) {
    console.error('Error fetching ride by ID:', error);
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Ride not found (invalid ID format)' });
    }
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Create a new ride (offer or request)
// @route   POST /api/rides
// @access  Private
export const createRide = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  const { type, origin, destination, date, time, availableSeats, seatsNeeded, price, description, preferences, carMake, carModel, carColor, carLicensePlate } = req.body;

  if (!type || !origin || !destination || !date || !time || price === undefined) {
    return res.status(400).json({ message: 'Missing required fields for ride creation.' });
  }

  const rideData: Partial<IRide> = {
    user: user._id,
    type,
    origin,
    destination,
    date: new Date(date),
    time,
    price: Number(price),
    description,
    preferences: Array.isArray(preferences) ? preferences : (preferences ? preferences.split(',').map((p:string)=>p.trim()) : []),
    status: 'active',
  };

  if (type === 'offer') {
    if (availableSeats === undefined) return res.status(400).json({ message: 'Available seats required for ride offer.'});
    rideData.availableSeats = Number(availableSeats);
    rideData.car = { make: carMake, model: carModel, color: carColor, licensePlate: carLicensePlate };
    rideData.passengers = [];
  } else if (type === 'request') {
    if (seatsNeeded === undefined) return res.status(400).json({ message: 'Seats needed required for ride request.'});
    rideData.seatsNeeded = Number(seatsNeeded);
  } else {
    return res.status(400).json({ message: 'Invalid ride type.' });
  }

  try {
    const ride = new Ride(rideData);
    const createdRide = await ride.save();
    res.status(201).json(createdRide);
  } catch (error: any) {
    console.error('Error creating ride:', error);
    res.status(500).json({ message: 'Server Error creating ride', error: error.message });
  }
};

// @desc    Update an existing ride
// @route   PUT /api/rides/:id
// @access  Private (user must be owner)
export const updateRide = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  const { origin, destination, date, time, availableSeats, seatsNeeded, price, description, preferences, carMake, carModel, carColor, carLicensePlate, status } = req.body;

  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });

    if (ride.user.toString() !== user._id.toString() && user.role !== 'admin') {
      return res.status(403).json({ message: 'User not authorized to update this ride' });
    }

    if(origin) ride.origin = origin;
    if(destination) ride.destination = destination;
    if(date) ride.date = new Date(date);
    if(time) ride.time = time;
    if(price !== undefined) ride.price = Number(price);
    if(description) ride.description = description;
    if(preferences) ride.preferences = Array.isArray(preferences) ? preferences : preferences.split(',').map((p:string)=>p.trim());
    if(status) ride.status = status;

    if (ride.type === 'offer') {
      if(availableSeats !== undefined) ride.availableSeats = Number(availableSeats);
      if(carMake || carModel || carColor || carLicensePlate ) {
          ride.car = {
              make: carMake || ride.car?.make,
              model: carModel || ride.car?.model,
              color: carColor || ride.car?.color,
              licensePlate: carLicensePlate || ride.car?.licensePlate,
          };
      }
    } else if (ride.type === 'request') {
      if(seatsNeeded !== undefined) ride.seatsNeeded = Number(seatsNeeded);
    }

    ride.updatedAt = new Date();
    const updatedRide = await ride.save();
    res.json(updatedRide);
  } catch (error: any) {
    console.error('Error updating ride:', error);
    res.status(500).json({ message: 'Server Error updating ride', error: error.message });
  }
};

// @desc    Delete a ride
// @route   DELETE /api/rides/:id
// @access  Private (user must be owner or admin)
export const deleteRide = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  try {
    const ride = await Ride.findById(req.params.id);
    if (!ride) return res.status(404).json({ message: 'Ride not found' });

    if (ride.user.toString() !== user._id.toString() && user.role !== 'admin') {
      return res.status(403).json({ message: 'User not authorized to delete this ride' });
    }

    // Potentially, if ride has confirmed passengers, it should be 'cancelled' instead of deleted,
    // or passengers should be notified. For now, direct deletion.
    await ride.deleteOne();
    res.json({ message: 'Ride removed' });
  } catch (error: any) {
    console.error('Error deleting ride:', error);
    res.status(500).json({ message: 'Server Error deleting ride', error: error.message });
  }
};

// @desc    Book a seat on a ride offer
// @route   POST /api/rides/:id/book
// @access  Private
export const bookSeatOnRide = async (req: Request, res: Response) => {
    const user = req.user as IUser;
    const rideId = req.params.id;
    const { seatsToBook = 1 } = req.body; // Default to booking 1 seat

    if (Number(seatsToBook) <= 0) {
        return res.status(400).json({ message: "Number of seats to book must be positive." });
    }

    try {
        const ride = await Ride.findById(rideId);
        if (!ride) return res.status(404).json({ message: "Ride not found." });
        if (ride.type !== 'offer') return res.status(400).json({ message: "Can only book seats on ride offers." });
        if (ride.status !== 'active') return res.status(400).json({ message: "This ride is no longer active or is full." });
        if (ride.user.toString() === user._id.toString()) {
            return res.status(400).json({ message: "You cannot book your own ride offer." });
        }

        const existingPassengerIndex = ride.passengers?.findIndex(p => p.userId.toString() === user._id.toString());
        if (existingPassengerIndex !== undefined && existingPassengerIndex !== -1) {
             return res.status(400).json({ message: "You have already booked or requested to book this ride." });
        }

        const confirmedSeats = ride.passengers?.filter(p => p.bookingStatus === 'confirmed').reduce((sum, p) => sum + p.seatsBooked, 0) || 0;

        if ((ride.availableSeats || 0) - confirmedSeats < Number(seatsToBook)) {
            return res.status(400).json({ message: "Not enough available seats." });
        }

        ride.passengers = ride.passengers || [];
        ride.passengers.push({
            userId: user._id,
            name: user.name, // Denormalized
            seatsBooked: Number(seatsToBook),
            bookingStatus: 'pending' // Or 'confirmed' if auto-confirm
        });

        // Recalculate status in pre-save hook or here
        // const newConfirmedSeats = ride.passengers.filter(p => p.bookingStatus === 'confirmed').reduce((sum, p) => sum + p.seatsBooked, 0);
        // if (newConfirmedSeats >= (ride.availableSeats || 0)) {
        //     ride.status = 'full';
        // }

        await ride.save();
        // TODO: Notify ride owner
        res.status(201).json({ message: "Booking request sent.", ride });

    } catch (error: any) {
        console.error("Error booking seat:", error);
        res.status(500).json({ message: "Server error booking seat.", error: error.message });
    }
};

// @desc    Manage a passenger's booking status (for ride owner)
// @route   PUT /api/rides/:id/manage-booking/:passengerId
// @access  Private (ride owner only)
export const manageRideBooking = async (req: Request, res: Response) => {
    const rideOwner = req.user as IUser;
    const { id: rideId, passengerId } = req.params;
    const { status: newBookingStatus } = req.body; // 'confirmed' or 'cancelled'

    if (!['confirmed', 'cancelled'].includes(newBookingStatus)) {
        return res.status(400).json({ message: "Invalid booking status."});
    }

    try {
        const ride = await Ride.findById(rideId);
        if (!ride) return res.status(404).json({ message: "Ride not found." });
        if (ride.type !== 'offer') return res.status(400).json({ message: "Can only manage bookings for ride offers." });
        if (ride.user.toString() !== rideOwner._id.toString()) {
            return res.status(403).json({ message: "Only the ride owner can manage bookings." });
        }

        const passengerIndex = ride.passengers?.findIndex(p => p.userId.toString() === passengerId);
        if (passengerIndex === undefined || passengerIndex === -1) {
            return res.status(404).json({ message: "Passenger not found for this ride." });
        }

        // Ensure ride has enough seats if confirming
        if (newBookingStatus === 'confirmed' && ride.passengers) {
            const currentPassengerBooking = ride.passengers[passengerIndex];
            // If already confirmed, no change in seat count. If changing from pending/cancelled to confirmed:
            if (currentPassengerBooking.bookingStatus !== 'confirmed') {
                const confirmedSeats = ride.passengers
                    .filter((p, idx) => idx !== passengerIndex && p.bookingStatus === 'confirmed')
                    .reduce((sum, p) => sum + p.seatsBooked, 0);
                if ((ride.availableSeats || 0) - confirmedSeats < currentPassengerBooking.seatsBooked) {
                    return res.status(400).json({ message: "Confirming this booking would exceed available seats." });
                }
            }
        }


        ride.passengers![passengerIndex].bookingStatus = newBookingStatus as 'confirmed' | 'cancelled';

        // Recalculate ride status (e.g., to 'full' or 'active') - pre-save hook will handle this
        await ride.save();
        // TODO: Notify passenger of status change
        res.json({ message: "Booking status updated.", ride });

    } catch (error: any) {
        console.error("Error managing ride booking:", error);
        res.status(500).json({ message: "Server error managing booking.", error: error.message });
    }
};

// @desc    Cancel a booking (for passenger)
// @route   DELETE /api/rides/:id/book
// @access  Private (passenger only)
export const cancelRideBooking = async (req: Request, res: Response) => {
    const passengerUser = req.user as IUser;
    const rideId = req.params.id;

    try {
        const ride = await Ride.findById(rideId);
        if (!ride) return res.status(404).json({ message: "Ride not found." });
        if (ride.type !== 'offer') return res.status(400).json({ message: "Ride is not an offer type." });

        const passengerIndex = ride.passengers?.findIndex(p => p.userId.toString() === passengerUser._id.toString());
        if (passengerIndex === undefined || passengerIndex === -1) {
            return res.status(404).json({ message: "You have not booked this ride." });
        }

        const bookingStatus = ride.passengers![passengerIndex].bookingStatus;
        // Allow cancellation if pending or confirmed
        if (bookingStatus === 'pending' || bookingStatus === 'confirmed') {
            ride.passengers!.splice(passengerIndex, 1); // Or set status to 'cancelled by user'
            // ride.passengers![passengerIndex].bookingStatus = 'cancelled';
            // Recalculate ride status if it was full
            await ride.save();
             // TODO: Notify ride owner
            res.json({ message: "Your booking has been cancelled.", ride });
        } else {
            return res.status(400).json({ message: `Cannot cancel booking with status: ${bookingStatus}` });
        }

    } catch (error: any) {
        console.error("Error cancelling ride booking:", error);
        res.status(500).json({ message: "Server error cancelling booking.", error: error.message });
    }
};
