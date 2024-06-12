import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Title from "../shared/Title";

const AppLayout = () => (WrappedComponent: React.FC) => {
  return (props) => {
    return (
      <>
        <Title title="chat" description="a chat app" />
        <Header />
        <WrappedComponent {...props} />
        <Footer />
      </>
    );
  };
};

export default AppLayout;
