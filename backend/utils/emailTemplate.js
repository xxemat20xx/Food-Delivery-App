import React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Section,
} from "@react-email/components";

export const VerifyEmail = ({ otp }) =>
  React.createElement(
    Html,
    null,
    React.createElement(Head),
    React.createElement(
      Body,
      {
        style: { backgroundColor: "#f4f4f4", fontFamily: "Arial, sans-serif" },
      },
      React.createElement(
        Container,
        {
          style: {
            backgroundColor: "#ffffff",
            padding: "20px",
            borderRadius: "8px",
            margin: "40px auto",
            maxWidth: "500px",
            textAlign: "center",
          },
        },
        React.createElement(Heading, null, "Email Verification"),
        React.createElement(Text, null, "Your verification code:"),
        React.createElement(
          Section,
          {
            style: {
              fontSize: "32px",
              fontWeight: "bold",
              letterSpacing: "4px",
              margin: "20px 0",
            },
          },
          otp,
        ),
        React.createElement(Text, null, "This code expires in 10 minutes."),
      ),
    ),
  );
