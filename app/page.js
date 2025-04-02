"use client";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Dashboard from "./Components/Dashboard/page";
import Data_Table from "./Components/Data_Table/page";
import KYT from "./Components/KYT/page";
import Image from "next/image";

function page() {
  const [swiftPage, setSwiftPage] = useState(0);
  const [headerPage, setHeaderPage] = useState(0);

  const SwitchPage = (value) => {
    if (value === 1) {
      setHeaderPage("");
    }
    setSwiftPage(value);
  };

  return (
    <div>
      <div className="tab-horizonbar">
        <div className="row w-100">
          <div className="col-1 text-center p-2"><Image src={`/Logo/Logo.png`} width={120} height={35} alt="Logo" /></div>
          {swiftPage === 0 && (
            <>
              <div
                className={`col-1 text-center cursorheader p-3 ${
                  headerPage == 0 ? "header-active" : ""
                }`}
                onClick={() => setHeaderPage(0)}
              >
                Index
              </div>
              {/* <div
                className={`col-1 text-center cursorheader p-3 ${
                  headerPage == 1 ? "header-active" : ""
                }`}
                onClick={() => setHeaderPage(1)}
              >
                KYT
              </div> */}
            </>
          )}
        </div>
      </div>
      <div className="row w-100">
        <div className="col-1 tab-verizon">
          <hr />
          <div
            className={`text-center cursorpoint ${
              swiftPage === 0 ? "active" : ""
            }`}
            onClick={() => SwitchPage(0)}
          >
            Dashboard
          </div>
          <hr />
          <div
            className={`text-center cursorpoint ${
              swiftPage === 1 ? "active" : ""
            }`}
            onClick={() => SwitchPage(1)}
          >
            To-Do-List
          </div>
          <hr />
        </div>
        {swiftPage == 0 && headerPage == 0 ? (
          <div className="page-display col-11">
            <Dashboard />
          </div>
        ) : (
          swiftPage == 0 &&
          headerPage == 1 && (
            <div className="page-display col-11">
              {/* <KYT /> */}
            </div>
          )
        )}
        {swiftPage == 1 && (
          <div className="page-display col-11">
            <Data_Table />
          </div>
        )}
      </div>
    </div>
  );
}

export default page;
