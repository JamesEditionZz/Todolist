'use client'
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./dashboard.css";
import Image from "next/image";

function Dashboard() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClicked, setIsClicked] = useState(false);
  const [data, setData] = useState([]);
  const [member, setMember] = useState([]);
  const [detailMember, setDetailMember] = useState("");

  const [getID, setGetID] = useState();
  const [getStatus, setGetStatus] = useState();

  const [silde_Left, setSilde_Left] = useState(0);
  const [loading, setLoading] = useState(false);

  let i = 1;
  const datavalue = new Date();
  const dateyear = datavalue.getFullYear();
  const find_arrmont = datavalue.getMonth();
  const datamonth = String(datavalue.getMonth() + 1).padStart(2, "0");

  const arrmonth = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  useEffect(() => {
    const fetchData = async () => {
      let nextUrl = `https://api.baserow.io/api/database/rows/table/450016/`; // Initial URL
      let allData = [];

      while (nextUrl) {
        try {
          const res = await fetch(nextUrl, {
            method: "GET",
            headers: {
              Authorization: `Token ${process.env.NEXT_PUBLIC_BASEROW_API_KEY}`,
            },
          });

          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }

          const response = await res.json();
          allData = [...allData, ...response.results]; // Merge arrays

          // Update nextUrl for pagination
          nextUrl = response.next;

          // Ensure the nextUrl starts with 'https://'
          if (nextUrl && nextUrl.startsWith("http://")) {
            nextUrl = nextUrl.replace("http://", "https://");
          }
        } catch (error) {
          console.error("Fetch error:", error);
          break; // Stop the loop if there's an error
        }
      }

      // Once all data is fetched, set it to state and sort
      const sortedData = allData.sort((a, b) => a.id - b.id);
      setData(sortedData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchmember = async () => {
      const res = await fetch(
        `https://api.baserow.io/api/database/fields/table/450016/`,
        {
          method: "GET",
          headers: {
            Authorization: `Token ${process.env.NEXT_PUBLIC_BASEROW_API_KEY}`,
          },
        }
      );
      const response = await res.json();

      setMember(response);
    };
    fetchmember();
  }, []);

  const DetailMember = (member) => {
    setSilde_Left(1);
    setTimeout(() => {
      setDetailMember(member);
      setSilde_Left(0);
    }, 1100);
  };

  const selectStatus = (id, status) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
    setIsClicked(true);

    setGetID(id);
    setGetStatus(status);
  };

  const ChangeStatus = async (status) => {
    setLoading(true);

    const res = await fetch(
      `https://api.baserow.io/api/database/rows/table/450016/${getID}/?user_field_names=true`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Token ${process.env.NEXT_PUBLIC_BASEROW_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Status: status }),
      }
    );

    if (res.ok) {
      let nextUrl = `https://api.baserow.io/api/database/rows/table/450016/`; // Initial URL
      let allData = [];

      while (nextUrl) {
        try {
          const res = await fetch(nextUrl, {
            method: "GET",
            headers: {
              Authorization: `Token ${process.env.NEXT_PUBLIC_BASEROW_API_KEY}`,
            },
          });

          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }

          const response = await res.json();
          allData = [...allData, ...response.results]; // Merge arrays

          // Update nextUrl for pagination
          nextUrl = response.next;

          // Ensure the nextUrl starts with 'https://'
          if (nextUrl && nextUrl.startsWith("http://")) {
            nextUrl = nextUrl.replace("http://", "https://");
          }
        } catch (error) {
          console.error("Fetch error:", error);
          break; // Stop the loop if there's an error
        }
      }

      // Once all data is fetched, set it to state and sort
      const sortedData = allData.sort((a, b) => a.id - b.id);
      setData(sortedData);
    }

    setIsClicked(false);

    setLoading(false);
  };

  console.log(loading);

  return (
    <div className="mx-5 mt-4">
      <div
        className={`row ${
          silde_Left == 0 && detailMember == "" ? "opacity-active" : ""
        }`}
      >
        {member[5]?.select_options.map((item, index) => (
          <div className="col-3 mt-3" key={index}>
            <div
              className="card p-2 bg-body-secondary box-shadow-hover"
              onClick={() => DetailMember(item.value)}
            >
              <div className="row">
                <div className="col-9 h5 align-content-center">
                  {item.value}
                </div>
                <div className="col-2">
                  <Image
                    src="/icon/web.png"
                    width={50}
                    height={50}
                    alt="search"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <hr />
      {detailMember == "" || detailMember == "All" ? (
        <div
          className={`row ${
            (silde_Left == 0 && detailMember == "") || detailMember == "All"
              ? "animation-silde-left"
              : "animation-backslide"
          }`}
        >
          <div className="col-12 card overflow-auto">
            <label className="h5 mt-2 text-center">
              Process เดือน{arrmonth[find_arrmont]}
            </label>
            {loading && (
              <div className="form-loading">
                <span className="loader"></span>
              </div>
            )}
            <table className="table table-striped sticky-header">
              <thead>
                <tr>
                  <th className="text-center">ลำดับ</th>
                  <th>Project Name</th>
                  <th className="text-center">งานที่ดำเนินการ</th>
                  <th className="text-center">Start_Date</th>
                  <th className="text-center">End_Date</th>
                  <th>ผู้รับผิดชอบ</th>
                  <th>Status</th>
                </tr>
              </thead>
              {data
                .sort((a, b) => {
                  const valueA = a.field_3497866[0]?.value || ""; // กรณีถ้าไม่มีค่า ให้เป็น 0
                  const valueB = b.field_3497866[0]?.value || ""; // กรณีถ้าไม่มีค่า ให้เป็น 0
                  return valueA.localeCompare(valueB);
                })
                .map(
                  (item, index) =>
                    item.field_3497868 &&
                    item.field_3497868.substring(0, 7) ==
                      dateyear.toString() + "-" + datamonth.toString() && (
                      <tbody key={index}>
                        <tr>
                          <td className="text-center">{i++}</td>
                          <td>{item.field_3497871.value}</td>
                          <td>{item.field_3497864}</td>
                          <td></td>
                          <td></td>
                          <td>
                            {item.field_3497866.map((item, index) => (
                              <label key={index}>{`${item.value}`}</label>
                            ))}
                          </td>
                          {item.field_3497869.value.slice(2) === "Not Start" ? (
                            <td
                              className="text-bg-danger cursorpoint"
                              onClick={() =>
                                selectStatus(
                                  item.id,
                                  item.field_3497869.value.slice(2)
                                )
                              }
                            >
                              {item.field_3497869.value.slice(2)}
                            </td>
                          ) : item.field_3497869.value.slice(2) ===
                            "Inprogress" ? (
                            <td
                              className="text-bg-warning cursorpoint"
                              onClick={() =>
                                selectStatus(
                                  item.id,
                                  item.field_3497869.value.slice(2)
                                )
                              }
                            >
                              {item.field_3497869.value.slice(2)}
                            </td>
                          ) : item.field_3497869.value.slice(2) ===
                            "Complete" ? (
                            <td
                              className="text-bg-success cursorpoint"
                              onClick={() =>
                                selectStatus(
                                  item.id,
                                  item.field_3497869.value.slice(2)
                                )
                              }
                            >
                              {item.field_3497869.value.slice(2)}
                            </td>
                          ) : (
                            <td
                              className="text-bg-secondary cursorpoint"
                              onClick={() =>
                                selectStatus(
                                  item.id,
                                  item.field_3497869.value.slice(2)
                                )
                              }
                            >
                              {item.field_3497869.value.slice(2)}
                            </td>
                          )}
                        </tr>
                      </tbody>
                    )
                )}
            </table>
          </div>
        </div>
      ) : (
        <div
          className={`row ${
            silde_Left == 0 && detailMember != ""
              ? "animation-silde-left"
              : "animation-backslide"
          }`}
        >
          <div className="col-6 card mt-4">
            <div className="overflow-auto">
              <div className="h5 mt-2 text-center">
                Process เดือน{arrmonth[find_arrmont]}
              </div>
              <table className="table table-striped sticky-header">
                <thead>
                  <tr>
                    <th>ลำดับ</th>
                    <th className="text-center">งานที่ดำเนินการ</th>
                    <th>ผู้รับผิดชอบ</th>
                    <th>Status</th>
                  </tr>
                </thead>
                {data
                  .sort((a, b) => {
                    const valueA = a?.field_3497869?.value.slice(2) || ""; // กรณีถ้าไม่มีค่า ให้เป็น 0
                    const valueB = b?.field_3497869?.value.slice(2) || ""; // กรณีถ้าไม่มีค่า ให้เป็น 0
                    return valueB.localeCompare(valueA);
                  })
                  .map(
                    (item, index) =>
                      item.field_3497868 &&
                      item.field_3497868.substring(0, 7) ==
                        dateyear.toString() + "-" + datamonth.toString() &&
                      item.field_3497866[0]?.value == detailMember && (
                        <tbody key={index}>
                          <tr>
                            <td>{i++}</td>
                            <td>{item.field_3497864}</td>
                            <td>{item.field_3497866[0]?.value}</td>
                            {item.field_3497869.value.slice(2) ===
                            "Not Start" ? (
                              <td
                                className="text-bg-danger cursorpoint"
                                onClick={() =>
                                  selectStatus(
                                    item.id,
                                    item.field_3497869.value.slice(2)
                                  )
                                }
                              >
                                {item.field_3497869.value.slice(2)}
                              </td>
                            ) : item.field_3497869.value.slice(2) ===
                              "Inprogress" ? (
                              <td
                                className="text-bg-warning cursorpoint"
                                onClick={() =>
                                  selectStatus(
                                    item.id,
                                    item.field_3497869.value.slice(2)
                                  )
                                }
                              >
                                {item.field_3497869.value.slice(2)}
                              </td>
                            ) : item.field_3497869.value.slice(2) ===
                              "Complete" ? (
                              <td
                                className="text-bg-success cursorpoint"
                                onClick={() =>
                                  selectStatus(
                                    item.id,
                                    item.field_3497869.value.slice(2)
                                  )
                                }
                              >
                                {item.field_3497869.value.slice(2)}
                              </td>
                            ) : (
                              <td
                                className="text-bg-secondary cursorpoint"
                                onClick={() =>
                                  selectStatus(
                                    item.id,
                                    item.field_3497869.value.slice(2)
                                  )
                                }
                              >
                                {item.field_3497869.value.slice(2)}
                              </td>
                            )}
                          </tr>
                        </tbody>
                      )
                  )}
              </table>
            </div>
          </div>
          <div className="col-6 mt-4">
            <div className="card">
              <h5 className="text-center mt-2">KPI</h5>
              <table className="table table-striped sticky-header">
                <thead>
                  <tr>
                    <th>เรื่อง</th>
                    <th>Start-Date</th>
                    <th>End-Date</th>
                  </tr>
                </thead>
              </table>
            </div>
          </div>
        </div>
      )}
      {isClicked && (
        <div
          className="click-effect"
          style={{
            top: mousePosition.y + "px",
            left: mousePosition.x + "px",
            position: "fixed",
          }}
        >
          {member[8]?.select_options?.map((item, index) => (
            <div key={index} className="select-Status">
              <div className="mx-2 p-1" onClick={() => ChangeStatus(item.id)}>
                {item.value.slice(2)}
                {console.log(item)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
