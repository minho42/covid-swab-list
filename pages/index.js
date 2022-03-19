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
  const [indexForBed, setIndexForBed] = useState(1);
  const [indexForName, setIndexForName] = useState(3);
  const [indexForAdmission, setIndexForAdmission] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [patientList, setPatientList] = useState([]);
  const [dueList, setDueList] = useState([]);
  const title = `Covid swabs due for ${new Date().toLocaleDateString()}, ${daysOfWeek[new Date().getDay()]} ${
    dueList && dueList?.length > 0 ? `(${dueList.length})` : ""
  }`;

  function isClipboardDataValid(list) {
    const isListEmpty = list.length === 0;
    const isColumnsTooShort = list[0].length < 4;
    const isIncludingColon = list[0].some((item) => item.includes(":")); // admission
    const isIncludingComma = list[0].some((item) => item.includes(",")); // name
    if (isListEmpty || isColumnsTooShort || !isIncludingColon || !isIncludingComma) {
      return false;
    }
    return true;
  }

  const getPatientListFromClipboard = async () => {
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

    const tempPatientList = [];
    try {
      const clipboard = await navigator.clipboard.readText();
      clipboard
        .split("\n")
        .filter((row) => row?.length > 0)
        .map((row) => {
          tempPatientList.push(row.split("\t"));
        });

      if (!isClipboardDataValid(tempPatientList)) {
        throw new Error("Clipboard data invalid");
      }

      setPatientList(tempPatientList);

      // console.log(tempPatientList[0]);
    } catch (error) {
      setPatientList([]);
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    const tempList = patientList.filter((patient) => {
      return SWAB_DAYS.includes(getDayDiffFrom(patient[indexForAdmission]));
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
        <button
          onClick={getPatientListFromClipboard}
          className="bg-pink-600 hover:bg-pink-500 text-white rounded-full px-4 py-1 font-semibold "
        >
          Make
        </button>
      </div>

      {errorMessage ? (
        <div className="my-1 text-center bg-pink-100 text-pink-600 font-semibold rounded py-1">
          {errorMessage}
        </div>
      ) : (
        ""
      )}

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
                    <td className="border border-gray-400 px-2 py-0.5">{patient[indexForBed]}</td>
                    <td className="border border-gray-400 px-2 py-0.5 text-left">{patient[indexForName]}</td>
                    <td className="border border-gray-400 px-2 py-0.5">
                      {getDayDiffFrom(patient[indexForAdmission])}
                    </td>
                    <td className="border border-gray-400 px-2 py-0.5"></td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <ul className="list-disc">
        <li>Double check if the list is correct</li>
        <li>May include people who does not need swab</li>
      </ul>
    </div>
  );
}
