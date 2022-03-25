import { useState, useEffect } from "react";
import Head from "next/head";
import { useLocalStorage } from "../components/useLocalStorage";

const getDayDiffFrom = (d) => {
  // "14/03/2022 22:30"
  if (!d || d.length == 0) return -1;

  const [day, month, year] = d.split(" ")[0].split("/");
  const dateFrom = new Date(`${year}-${month}-${day}`);
  const today = new Date();

  const diff = today.getTime() - dateFrom.getTime();
  const diffInDay = diff / (1000 * 60 * 60 * 24);
  return Math.floor(diffInDay);
};

export default function Home() {
  const SWAB_DAYS = [0, 2, 5, 8];
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const [indexForBed, setIndexForBed] = useLocalStorage("indexForBed", 1);
  const [indexForName, setIndexForName] = useLocalStorage("indexForName", 3);
  const [indexForAdmission, setIndexForAdmission] = useLocalStorage("indexForAdmission", 8);
  const [errorMessage, setErrorMessage] = useState("");
  const [clipboardData, setClipboardData] = useState([]);
  const [patientList, setPatientList] = useState([]);
  const [hideNotDue, setHideNotDue] = useState(true);

  const title = `Covid swabs due for ${new Date().toLocaleDateString()}, ${daysOfWeek[new Date().getDay()]} 
   ${
     patientList && patientList?.length > 0
       ? `(${patientList.filter((p) => p.isDue).length}/${patientList.length})`
       : ""
   }
  `;

  function isClipboardDataValid(list) {
    const isListEmpty = list.length === 0;
    const isColumnsTooShort = list[0].length < 4;
    const isIncludingColon = list[0].some((item) => item.includes(":")); // admission
    const isIncludingComma = list[0].some((item) => item.includes(",")); // name
    const isAdmissionIndexCorrect = list[0][indexForAdmission].includes(":");
    if (
      isListEmpty ||
      isColumnsTooShort ||
      !isIncludingColon ||
      !isIncludingComma ||
      !isAdmissionIndexCorrect
    ) {
      return false;
    }
    return true;
  }

  const getDataFromClipboard = async () => {
    if (
      !indexForBed ||
      !indexForName ||
      !indexForAdmission ||
      indexForBed < 1 ||
      indexForName < 1 ||
      indexForAdmission < 1
    )
      return;
    setErrorMessage("");

    const tempClipboardData = [];
    try {
      const clipboard = await navigator.clipboard.readText();
      clipboard
        .split("\n")
        .filter((row) => row?.length > 0)
        .map((row) => {
          tempClipboardData.push(row.split("\t"));
        });

      if (!isClipboardDataValid(tempClipboardData)) {
        throw new Error("Invalid clipboard data or incorrect index for columns");
      }

      setClipboardData(tempClipboardData);
      // console.log(tempClipboardData[0]);
    } catch (error) {
      setClipboardData([]);
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    const tempList = [];
    clipboardData.forEach((row) => {
      tempList.push({
        bed: row[indexForBed],
        name: row[indexForName],
        admission: row[indexForAdmission],
        day: getDayDiffFrom(row[indexForAdmission]),
        isDue: SWAB_DAYS.includes(getDayDiffFrom(row[indexForAdmission])),
      });
    });
    setPatientList(tempList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clipboardData]);

  return (
    <div className="space-y-3">
      <Head>
        <title>Covid swab list</title>
        <meta name="description" content="Covid swab list" />
      </Head>
      <div className="flex items-center space-x-2">
        Column index for:
        <label>
          bed
          <input
            onChange={(e) => setIndexForBed(e.target.value)}
            className="rounded-md border-2 border-gray-300 py-0.5 ml-1 w-14 text-center"
            type="number"
            value={indexForBed}
          ></input>
        </label>
        <label>
          name
          <input
            onChange={(e) => setIndexForName(e.target.value)}
            className="rounded-md border-2 border-gray-300 py-0.5 ml-1 w-14 text-center"
            type="number"
            value={indexForName}
          ></input>
        </label>
        <label>
          admission
          <input
            onChange={(e) => setIndexForAdmission(e.target.value)}
            className="rounded-md border-2 border-gray-300 py-0.5 ml-1 w-14 text-center"
            type="number"
            value={indexForAdmission}
          ></input>
        </label>
        {patientList && patientList.length > 0 && (
          <label className="flex items-center pl-3">
            Show all
            <input
              onChange={() => setHideNotDue(!hideNotDue)}
              className="ml-1 w-7 h-7"
              type="checkbox"
              defaultChecked={!hideNotDue}
            ></input>
          </label>
        )}
      </div>

      <div className="text-center">
        <button
          onClick={getDataFromClipboard}
          className="bg-pink-600 hover:bg-pink-500 text-white rounded-full text-2xl px-4 py-1 font-semibold "
        >
          Make
        </button>

        {errorMessage ? (
          <div className="my-1 text-center bg-pink-100 text-pink-600 font-semibold rounded py-1">
            ⚠️ {errorMessage}
          </div>
        ) : (
          ""
        )}
      </div>

      <div className="text-2xl font-semibold">{title}</div>

      {patientList && patientList.length > 0 && (
        <div className="flex items-center gap-2 text-2xl font-semibold">
          Bed:{" "}
          {patientList
            .filter((p) => p.isDue)
            .map((p, index) => {
              return (
                <div key={index} className="">
                  {p.bed},
                </div>
              );
            })}
        </div>
      )}

      <div>
        <table className="w-full table-auto border border-gray-400 text-center">
          <thead>
            <tr>
              <th className="border border-gray-400 px-2 py-0.5">Bed</th>
              <th className="border border-gray-400 px-2 py-0.5">Name</th>
              <th className="border border-gray-400 px-2 py-0.5">Admission</th>
              <th className="border border-gray-400 px-2 py-0.5">Day</th>
              <th className="border border-gray-400 px-2 py-0.5">Due</th>
            </tr>
          </thead>
          <tbody>
            {patientList &&
              patientList.length > 0 &&
              patientList.map((patient, index) => {
                return (
                  <tr
                    key={index}
                    className={`${patient.isDue ? "" : "text-gray-400"} ${
                      hideNotDue && !patient.isDue ? "hidden" : ""
                    }`}
                  >
                    <td className="border border-gray-400 px-2">{patient.bed}</td>
                    <td className="border border-gray-400 px-2 text-left">{patient.name}</td>
                    <td className="border border-gray-400 px-2">{patient.admission}</td>
                    <td className="border border-gray-400 px-2">{patient.day}</td>
                    <td className="border border-gray-400 px-2">{patient.isDue ? "Due" : ""}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <ul className="list-disc list-inside">
        <li>Double check the result</li>
        <li>Use this as a guide</li>
      </ul>
    </div>
  );
}
