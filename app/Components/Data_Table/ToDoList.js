"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./datatable.css";
import { useEffect, useState } from "react";

export default function ToDoList() {
  const [data, setData] = useState([]);
  const seenProjects = [];
  const arrayProject = [];
  const arrayMember = [];

  //input
  const [teamWork, setTeamWork] = useState("");

  let counter = 1; // ใช้ let เพื่อให้เพิ่มค่าได้

  useEffect(() => {
    const fetchData = async () => {
      let nextUrl = `https://api.baserow.io/api/database/rows/table/450016/`; // Initial URL
      let allData = [];

      while (nextUrl) {
        try {
          const res = await fetch(nextUrl, {
            method: "GET",
            headers: {
              Authorization: `Token 3J24Dj60EDJhajOBwURk3XfKGlwqkI9f`,
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

    // ตั้ง interval ให้ fetchData ทำงานทุก 10 วินาที
    const interval = setInterval(fetchData, 10000);

    // Cleanup function เพื่อล้าง interval เมื่อ component ถูก unmount
    return () => clearInterval(interval);
  }, []);

  const checkDate = (dateString) => {
    const currentDate = new Date();
    const itemDate = new Date(dateString);
    // Check if the item date is equal to today's date (ignoring time)
    return (
      itemDate.getDate() === currentDate.getDate() &&
      itemDate.getMonth() === currentDate.getMonth() &&
      itemDate.getFullYear() === currentDate.getFullYear()
    );
  };

  const datetime = new Date();
  const day = String(datetime.getDate()).padStart(2, "0"); // Ensure two-digit day
  const month = String(datetime.getMonth() + 1).padStart(2, "0"); // Ensure two-digit month
  const year = datetime.getFullYear();

  return (
    <div className="mx-5 mt-3">
      <div className="box-shadow-table border-radius mt-2">
        <div className="text-center h4 mt-2">
          {`Report ${day}-${month}-${year}`}
        </div>
        <div className="mt-2">
          <table className="table table-bordered">
            <thead>
              <tr className="text-center">
                <th className="bg-light bg-gradient">Team</th>
                <th className="bg-light bg-gradient">ผู้รับผิดชอบ</th>
                <th className="bg-light bg-gradient">Project</th>
                <th className="bg-light bg-gradient">งานที่ดำเนินการ</th>
                <th className="bg-light bg-gradient">สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const teamCounters = {}; // ตัวนับแยกตามชื่อทีม
                let currentTeam = null;

                return [...data]
                  .filter(
                    (item) =>
                      item.field_3497869?.value &&
                      item.field_3599645?.split("T")[0] ===
                        `${year}-${month}-${day}` &&
                      (item.field_3497869.value === "2.Complete" ||
                        item.field_3497869.value === "1.Inprogress")
                  )
                  .sort((a, b) => {
                    const valueA = a.field_3497865?.value || "";
                    const valueB = b.field_3497865?.value || "";
                    const compare1 = valueA.localeCompare(valueB);
                    if (compare1 !== 0) return compare1;

                    const subValueA = a.field_3497866?.[0]?.value || "";
                    const subValueB = b.field_3497866?.[0]?.value || "";
                    return subValueA.localeCompare(subValueB);
                  })
                  .reduce(
                    (acc, item) => {
                      const team = item.field_3497865?.value || "";
                      const member = item.field_3497866?.[0]?.value || "";
                      const project = item.field_3497871?.value || "";

                      acc.teamCount[team] = (acc.teamCount[team] || 0) + 1;
                      acc.memberCount[member] =
                        (acc.memberCount[member] || 0) + 1;
                      acc.projectCount[project] =
                        (acc.projectCount[project] || 0) + 1;
                      acc.rows.push(item);
                      return acc;
                    },
                    {
                      teamCount: {},
                      memberCount: {},
                      projectCount: {},
                      rows: [],
                    }
                  )
                  .rows.map((item, index, array) => {
                    const team = item.field_3497865?.value || "";
                    const member = item.field_3497866?.[0]?.value || "";
                    const project = item.field_3497871?.value || "";

                    const showTeam = !array
                      .slice(0, index)
                      .some((i) => i.field_3497865?.value === team);
                    const showMember = !array
                      .slice(0, index)
                      .some((i) => i.field_3497866?.[0]?.value === member);
                    const showProject = !array
                      .slice(0, index)
                      .some((i) => i.field_3497871?.value === project);

                    // เริ่มนับใหม่เมื่อเปลี่ยนทีม
                    if (!teamCounters[team]) {
                      teamCounters[team] = 1;
                    } else {
                      teamCounters[team]++;
                    }

                    return (
                      <tr key={item.id}>
                        {showTeam ? (
                          <td
                            rowSpan={
                              array.filter(
                                (i) => i.field_3497865?.value === team
                              ).length
                            }
                            className="text-center"
                          >
                            {team}
                          </td>
                        ) : null}

                        {showMember ? (
                          <td
                            rowSpan={
                              array.filter(
                                (i) => i.field_3497866?.[0]?.value === member
                              ).length
                            }
                            className="text-center"
                          >
                            {member}
                            {item.field_3497866?.length > 1 &&
                              ` & ${item.field_3497866[1]?.value}`}
                          </td>
                        ) : null}

                        {showProject ? (
                          <td
                            rowSpan={
                              array.filter(
                                (i) => i.field_3497871?.value === project
                              ).length
                            }
                            className="text-center"
                          >
                            {project}
                          </td>
                        ) : null}

                        <td>
                          {teamCounters[team]}. {item.field_3497864}
                        </td>
                        <td
                          className={`text-center ${
                            item.field_3497869.value === "2.Complete"
                              ? "bg-success text-white"
                              : "bg-warning"
                          }`}
                        >
                          {item.field_3497869.value.slice(2)}
                        </td>
                      </tr>
                    );
                  });
              })()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
