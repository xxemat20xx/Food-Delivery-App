import React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Section,
  Link,
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

export const ResetPasswordEmail = ({ resetUrl }) =>
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
        React.createElement(Heading, null, "Password Reset"),
        React.createElement(
          Text,
          null,
          "Click the button below to reset your password:",
        ),
        React.createElement(
          Section,
          { style: { margin: "20px 0" } },
          React.createElement(
            Link,
            {
              href: resetUrl,
              style: {
                display: "inline-block",
                padding: "12px 20px",
                backgroundColor: "#007bff",
                color: "#ffffff",
                borderRadius: "6px",
                textDecoration: "none",
                fontWeight: "bold",
              },
            },
            "Reset Password",
          ),
        ),
        React.createElement(
          Text,
          { style: { fontSize: "14px", color: "#555" } },
          "If the button doesn't work, copy and paste this link into your browser:",
        ),
        React.createElement(
          Text,
          {
            style: {
              wordBreak: "break-all",
              fontSize: "12px",
              color: "#888",
            },
          },
          resetUrl,
        ),
        React.createElement(
          Text,
          { style: { marginTop: "20px" } },
          "This link expires in 10 minutes.",
        ),
      ),
    ),
  );
