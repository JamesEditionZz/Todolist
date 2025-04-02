"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./datatable.css";
import { useEffect, useState } from "react";

export default function ToDoList() {
  const [data, setData] = useState([]);
  const [selectedValue, SetSelectedValue] = useState("2.Complete");

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

    // ตั้ง interval ให้ fetchData ทำงานทุก 3 วินาที
    const interval = setInterval(fetchData, 3000);

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
    <div className="mx-5 mt-5">
      <div className="row">
        <div className="col-2">
          <div className="box-shadow border-radius">
            <select
              className="form-select"
              onChange={(e) => SetSelectedValue(e.target.value)}
            >
              <option value={"2.Complete"}>Complete</option>
              <option value={"0.NotStart"}>NotStart</option>
              <option value={"3.Waiting"}>Waiting</option>
              <option value={"1.Inprogress"}>Inprogress</option>
              <option value={"4.Cancel"}>Cancel</option>
            </select>
          </div>
        </div>
      </div>
      <div className="box-shadow-table border-radius mt-2">
        <div className="text-center h4 mt-2">
          {selectedValue != "2.Complete"
            ? ""
            : `Report ${day}-${month}-${year}`}
        </div>
        <div className="mt-2">
          <table className="table table-bordered">
            <thead>
              <tr className="text-center">
                <th>ลำดับที่</th>
                <th>Team</th>
                <th>ผู้รับผิดชอบ</th>
                <th>งานที่ดำเนินการ</th>
                <th>สถานะ</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data
                .filter(
                  (item) =>
                    item.field_3497869?.value === selectedValue &&
                    checkDate(item.field_3599645)
                )
                .sort((a, b) => {
                  const valueA = a.field_3497866[0]?.value || "";
                  const valueB = b.field_3497866[0]?.value || "";
                  a.field_3497865?.value.localeCompare(b.field_3497865.value);
                  return valueA.localeCompare(valueB);
                })
                .map((item) => (
                  <tr key={item.id}>
                    <td className="text-center">{counter++}</td>
                    <td className="text-center">{item.field_3497865?.value}</td>
                    <td className="text-center">
                      {item.field_3497866[0]?.value}{" "}
                      {item.field_3497866.length > 1 &&
                        `& ${item.field_3497866[1]?.value}`}
                    </td>
                    <td>{item.field_3497864}</td>
                    <td className="text-center">
                      {selectedValue != "2.Complete"
                        ? `${selectedValue.split(".")[1]}`
                        : "สำเร็จ"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
