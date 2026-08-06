import gateway from "../config/braintree.js";
import { validateDeliveryAddress } from "../middleware/validateDeliveryAddress.js";

export const generateClientToken = async (req, res) => {
  try {
    const response = await gateway.clientToken.generate({});

    res.status(200).json({
      success: true,
      clientToken: response.clientToken,
    });
  } catch (error) {
    console.error("Generate Client Token Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate client token",
      error: error.message,
    });
  }
};

export const processPayment = async (req, res) => {
  try {
     console.log("Request Body:", req.body);
    const { nonce, amount, address } = req.body;
      console.log("Nonce:", nonce);
  console.log("Amount:", amount);

    const validation = validateDeliveryAddress(address);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid delivery address",
        errors: validation.errors,
      });
    }

    if (!nonce || !amount) {
      return res.status(400).json({
        success: false,
        message: "Nonce and amount are required",
      });
    }

    const result = await gateway.transaction.sale({
      amount: amount.toString(),
      paymentMethodNonce: nonce,
      options: {
        submitForSettlement: true,
      },
    });

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: "Payment successful",
        transactionId: result.transaction.id,
        transaction: result.transaction,
      });
    }

    return res.status(400).json({
      success: false,
      message: result.message,
    });
  } catch (error) {
    console.error("Payment Error:", error);

    res.status(500).json({
      success: false,
      message: "Payment failed",
      error: error.message,
    });
  }
};