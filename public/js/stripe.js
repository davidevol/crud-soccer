/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts";
const stripe = Stripe("pk_test_51MTwuEG7lwK5URD20Mmh0M4VzMuQLQWg0A6YVGIhC1KKfCrMAApGvcn2TEnEgsDXS4mKiWjUISW8ZKtnzjfWpGFc00ZeeQbpOf");

export const bookStadium = async (stadiumId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(
      `http://127.0.0.1:3000/api/v1/bookings/checkout-session/${stadiumId}`
    );
    console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert("error", err);
  }
};
