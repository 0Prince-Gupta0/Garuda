import dotenv from 'dotenv';
import User from '../models/UserSchema.js';
import Doctor from '../models/DoctorSchema.js';
import Booking from '../models/BookingSchema.js';
import Stripe from 'stripe';

dotenv.config(); 
export const getCheckOutSession = async (req, res) => {
  try {
    if (!req.userId) {
      return res.status(400).json({ success: false, message: "User ID is missing from request" });
    }

    const doctor = await Doctor.findById(req.params.doctorId);
    const user = await User.findById(req.userId);

    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    console.log("User Email:", user.email);

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${process.env.CLIENT_SITE_URL}/checkout-success`,
      cancel_url: `${process.env.CLIENT_SITE_URL}/doctors/${doctor.id}`,
      customer_email: user.email,
      client_reference_id: req.params.doctorId,
      payment_intent_data: { 
        shipping: {
            name: user.name,
            address: {
                line1: user.address?.line1 || 'N/A',
                city: user.address?.city || 'N/A',
                state: user.address?.state || 'N/A',
                postal_code: user.address?.postal_code || '000000',
                country: user.address?.country || 'IN',  
            }
        }
    },
      line_items: [
        {
          price_data: {
            currency: 'inr',
            unit_amount: doctor.ticketPrice * 100, 
            product_data: {
              name: doctor.name,
              description: doctor.bio || 'Consultation with doctor',
              images: [doctor.photo || 'https://via.placeholder.com/150'],
            },
          },
          quantity: 1,
        },
      ],
    });

    const booking = new Booking({
      doctor: doctor._id,
      user: user._id,
      ticketPrice: doctor.ticketPrice,
      session: session.id,
    });

    await booking.save();

    res.status(200).json({ success: true, message: 'Successfully paid', session });
  } catch (err) {
   
    res.status(500).json({ success: false, message: "Error creating checkout session" });
  }
};
