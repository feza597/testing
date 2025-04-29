import { React, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import apiClient from "../util/api-client";
import { PostContact, SendEmail } from "../services/sendCommsServices";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader, ScaleLoader } from "react-spinners";
import { useGlobalSettingContext } from "../contexts/GlobalSettingProvider";
const schema = z.object({
  pName: z
    .string()
    .min(3, "Please enter your name")
    .max(200, "Max character length reached"),
  pEmail: z
    .string()
    .email("Please enter valid email")
    .min(3)
    .max(200, "Max character length reached"),
  pMessage: z
    .string()
    .min(3, "Please enter your message")
    .max(2000, "Max character length reached"),
});

const F001FormContact = () => {
  const [loading, setLoading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const { color } = useGlobalSettingContext();
  useEffect(() => {
    const loadRecaptcha = async () => {
      const { reCAPTCHA } = await import("react-google-recaptcha");
      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute("6Leo_9gqAAAAAEvSVFNwTodhIGImjpgYcLegwXDf", {
            action: "submit",
          })
          .then((token) => {
            setRecaptchaToken(token);
            console.log(recaptchaToken);
          });
      });
    };
    loadRecaptcha();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmitContact = async (formData) => {
    setLoading(true);
    if (!recaptchaToken) {
      toast.error(
        "Verification failed, please refresh the page and try again!"
      );
      return;
    }
    console.log(JSON.stringify({ recaptchaResponse: recaptchaToken }));

    // Send the reCAPTCHA token to your server for verification
    try {
      const response = await fetch("/google/verify-recaptcha", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recaptchaResponse: recaptchaToken }),
      });

      const data = await response.json();

      if (data.success) {
        const payload = JSON.parse(JSON.stringify(formData));
        await SendEmail(payload, {
          headers: {
            "Content-Type": "application/json", // Make sure the server knows this is JSON
          },
        })
          .then((res) => {
            console.log(res.data.message);
            console.log(JSON.stringify(res.data));
          })
          .catch((err) => {
            console.log(err.message);
          });

        await PostContact(payload, {
          headers: {
            "Content-Type": "application/json", // Make sure the server knows this is JSON
          },
        })
          .then((res) => {
            console.log(res.data);
            console.log(JSON.stringify(res.data));
          })
          .catch((err) => {
            console.log(err.message);
          });
        document.getElementById("pName").value = "";
        document.getElementById("pEmail").value = "";
        document.getElementById("pMessage").value = "";
        toast.success(
          "Thank you for your interest, Our team will be in touch with you!"
        );
      } else {
        // alert("reCAPTCHA verification failed.");
        toast.error(
          "Verification failed, please refresh the page and try again!"
        );
      }
    } catch (error) {
      //alert("An error occurred during form submission.");
      toast.error(
        "Something went wrong, please refresh the page and try again!"
      );
    } finally {
      setLoading(false);
      // Push data layer event to GTM
      // alert("in finally");
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "formSubmission",
        formName: "Contact Form",
        formData: formData.email, // Optional: Include form data
        // Add other relevant information
      });
    }
  };

  return (
    <>
      <h2>Color form: {color}</h2>
      <form
        id="ContactForm"
        className="flex flex-col gap-y-2 *:px-4 *:py-2 *:rounded *:outline-none h-full"
        onSubmit={handleSubmit(onSubmitContact)}
      >
        <input
          className="inputstyle"
          id="pName"
          type="text"
          placeholder="Name"
          {...register("pName")}
        />
        {errors.pName && <em>{errors.pName.message}</em>}
        <input
          className="inputstyle"
          id="pEmail"
          type="email"
          placeholder="Email"
          {...register("pEmail")}
        />
        {errors.pEmail && <em>{errors.pEmail.message}</em>}
        <textarea
          className="textareastyle"
          id="pMessage"
          placeholder="Message"
          {...register("pMessage")}
        ></textarea>
        {errors.pMessage && <em>{errors.pMessage.message}</em>}

        {loading ? (
          <div className="h-15">
            <ScaleLoader className="bg-accent" size={10} />
          </div>
        ) : (
          ""
        )}
        <input className="btnsubmit" type="submit" value="Submit" />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </form>
    </>
  );
};

export default F001FormContact;