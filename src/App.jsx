import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import "./App.css";
import "./pages/LandingPage.css";
import Terms from "./pages/Terms";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import DeleteAccount from "./pages/DeleteAccount";
import Contact from "./pages/Contact";
import Faqs from "./pages/Faqs";
import SeoMetadata from "./components/SeoMetadata";

export default function App() {
  return (
    <BrowserRouter>
      <SeoMetadata />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/delete-account" element={<DeleteAccount />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faqs" element={<Faqs />} />
        {/* <Route path="/admin" elemtent={<AdminPage />} /> */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}
