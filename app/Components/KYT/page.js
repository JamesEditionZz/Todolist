"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./kyt.css";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Home() {
  const [data, setData] = useState([]);
  const [files, setFiles] = useState([]);
  const [changeImage, setChangeImage] = useState(0);

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

  const datetoday = new Date();
  const day = String(datetoday.getDate()).padStart(2, "0"); // Ensure two-digit day
  const month = String(datetoday.getMonth() + 1).padStart(2, "0"); // Ensure two-digit month
  const year = datetoday.getFullYear();

  const ChangeImage = () => {
    setChangeImage(1);
  };

  return (
    <div className="mx-5 mt-3">
      <div className="border-radius box-shadow p-2 bg-image opacity-active">
        <div className="text-center h4">
          <label className="mt-3">
            KYT IT - {day}/{month}/{year}
          </label>
        </div>
        <hr />
        <div className="row">
          <div className="col-3" onClick={() => ChangeImage()}>
            <div className="row">
              <div className="col-12 mx-2">
                <Image
                  className="image-resolution"
                  src={`/image/Picture_KYT/S__3203079.jpg`}
                  width={1000}
                  height={1000}
                  alt={`picture`}
                />
              </div>
              {changeImage === 1 && (
                <div className="S-menu">
                  <Image
                    src={`/icon/picture.png`}
                    width={20}
                    height={20}
                    alt="image"
                  />
                </div>
              )}
              <div className="col-12 border-1 mt-2 mx-2">
                <div className="text-center h4">IT Routine</div>
                <div>- Support User Follow Up IT Request</div>
                <div>- Support User On Call</div>
                <div>- Backup Checklist</div>
                <div>- Support Project</div>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="border-1">
              <label className="h4 mx-3">Infrastructure</label>
              {data.map((item, index) => (
                <div key={index}>
                  {item.field_3599645.split("T")[0] ==
                    `${year}-${month}-${day}` &&
                    item.field_3497865?.value === "INFRA&Support" && (
                      <div className="mx-3 mt-2">- {item.field_3497864}</div>
                    )}
                </div>
              ))}
            </div>
            <div className="mt-3 mb-3 border-1">
              <label className="h4 mx-3">ERP & NON ERP</label>
              {data.map((item, index) => (
                <div key={index}>
                  {item.field_3599645.split("T")[0] ==
                    `${year}-${month}-${day}` &&
                    item.field_3497865?.value === "Development" && (
                      <div className="mx-3 mt-2">- {item.field_3497864}</div>
                    )}
                </div>
              ))}
            </div>
          </div>
          <div className="col-3">
            <div className="row">
              <div className="col-12">
                <Image
                  className="image-brand-resolution"
                  src={`/image/Banner/pic1.jpg`}
                  width={1000}
                  height={1000}
                  alt={`picture`}
                />
              </div>
            </div>
          </div>
          <div className="col-3">
            <Image
              className="image-botton-brand-resolution"
              src={`/image/pic2.jpg`}
              width={1000}
              height={1000}
              alt={`picture`}
            />
          </div>
          <div className="col-3">
            <Image
              className="image-botton-brand-resolution"
              src={`/image/Banner/pic6.jpg`}
              width={1000}
              height={1000}
              alt={`picture`}
            />
          </div>
          <div className="col-6">
            <div className="row">
              <div className="col-3">
                <Image
                  className="image-brand-warning"
                  src={`/image/Banner/pic2.jpg`}
                  width={1000}
                  height={1000}
                  alt={`picture`}
                />
              </div>
              <div className="col-3">
                <Image
                  className="image-brand-warning"
                  src={`/image/Banner/pic3.jpg`}
                  width={1000}
                  height={1000}
                  alt={`picture`}
                />
              </div>
              <div className="col-3">
                <Image
                  className="image-brand-warning"
                  src={`/image/Banner/pic4.jpg`}
                  width={1000}
                  height={1000}
                  alt={`picture`}
                />
              </div>
              <div className="col-3">
                <Image
                  className="image-brand-warning"
                  src={`/image/Banner/pic5.jpg`}
                  width={1000}
                  height={1000}
                  alt={`picture`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
