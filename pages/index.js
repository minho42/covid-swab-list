import { useState, useEffect } from "react";
import Head from "next/head";

const getDayDiffFrom = (d) => {
  // "14/03/2022 22:30"
  if (!d || d.length == 0) return -1;

  const [day, month, year] = d.split(" ")[0].split("/");
  const dateFrom = new Date(`${year}-${month}-${day}`);
  const today = new Date();

  const diff = today.getTime() - dateFrom.getTime();
  const diffInDay = diff / (1000 * 60 * 60 * 24);
  return Math.ceil(diffInDay);
};

export default function Home() {
  const SWAB_DAYS = [0, 2, 5, 8];
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const [columnBed, setColumnBed] = useState(1);
  const [columnName, setColumnName] = useState(3);
  const [columnAdmission, setColumnAdmission] = useState(4);
  const [isClipboardReady, setIsClipboardReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [patientList, setPatientList] = useState([]);
  const [dueList, setDueList] = useState([]);
  const title = `Covid swabs due for ${new Date().toLocaleDateString()}, ${daysOfWeek[new Date().getDay()]} ${
    dueList && dueList?.length > 0 ? `(${dueList.length})` : ""
  }`;

  const getPatientListFromClipboard = async () => {
    if (
      !columnBed ||
      !columnName ||
      !columnAdmission ||
      columnBed < 1 ||
      columnName < 1 ||
      columnAdmission < 1
    )
      return;

    const tempPatientList = [];
    try {
      const clipboard = await navigator.clipboard.readText();
      clipboard
        .split("\n")
        .filter((row) => row?.length > 0)
        .map((row) => {
          tempPatientList.push(row.split("\t"));
        });
      setPatientList(tempPatientList);
      console.log(tempPatientList);
    } catch (error) {}
  };

  useEffect(() => {
    const tempList = patientList.filter((patient) => {
      return SWAB_DAYS.includes(getDayDiffFrom(patient[columnAdmission]));
    });
    setDueList(tempList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientList]);

  return (
    <div className="space-y-3">
      <Head>
        <title>Covid swab list</title>
        <meta name="description" content="Covid swab list" />
      </Head>

      <div className="flex items-center space-x-2 text-gray-500">
        Columns for:
        <label>
          bed
          <input
            onChange={(e) => setColumnBed(e.target.value)}
            className="rounded-md border-2 border-gray-300  py-0.5 ml-1 w-12 text-center"
            type="number"
            value={columnBed}
          ></input>
        </label>
        <label>
          name
          <input
            onChange={(e) => setColumnName(e.target.value)}
            className="rounded-md border-2 border-gray-300  py-0.5 ml-1 w-12 text-center"
            type="number"
            value={columnName}
          ></input>
        </label>
        <label>
          admission
          <input
            onChange={(e) => setColumnAdmission(e.target.value)}
            className="rounded-md border-2 border-gray-300  py-0.5 ml-1 w-12 text-center"
            type="number"
            value={columnAdmission}
          ></input>
        </label>
        <button
          onClick={getPatientListFromClipboard}
          className="bg-pink-600 text-white rounded-full px-4 py-1 font-semibold "
        >
          Make
        </button>
        {!isClipboardReady && errorMessage ? (
          <div className="my-1 text-center bg-pink-100 text-pink-600 rounded py-0.5">{errorMessage}</div>
        ) : (
          ""
        )}
      </div>

      <div className="text-2xl font-semibold">{title}</div>

      <div>
        <table className="w-full table-auto border border-gray-400 text-center">
          <thead>
            <tr>
              <th className="w-2/12 border border-gray-400 px-2 py-0.5">Bed</th>
              <th className="w-6/12 border border-gray-400 px-2 py-0.5">Name</th>
              <th className="w-2/12 border border-gray-400 px-2 py-0.5">Day</th>
              <th className="w-2/12 border border-gray-400 px-2 py-0.5">Done</th>
            </tr>
          </thead>
          <tbody>
            {dueList &&
              dueList.map((patient, index) => {
                return (
                  <tr key={index}>
                    <td className="border border-gray-400 px-2 py-0.5">{patient[columnBed]}</td>
                    <td className="border border-gray-400 px-2 py-0.5 text-left">{patient[columnName]}</td>
                    <td className="border border-gray-400 px-2 py-0.5">
                      {getDayDiffFrom(patient[columnAdmission])}
                    </td>
                    <td className="border border-gray-400 px-2 py-0.5"></td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <ul className="list-disc text-gray-500">
        <li>Double check if the list is correct</li>
        <li>May include people who does not need swab</li>
      </ul>
    </div>
  );
}
