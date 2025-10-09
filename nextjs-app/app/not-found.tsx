import React, { FC } from "react";
import NotFoundPage from "./components/NotFoundPage";
import { Navbar } from "./components/organisms/Navbar";
import { Footer } from "./components/organisms/Footer";

const NotFound: FC = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <NotFoundPage />
      <Footer />
    </div>
  );
};

export default NotFound;
