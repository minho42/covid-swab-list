export default function About() {
  return (
    <div className="space-y-3">
      <div>
        <div className="text-xl font-semibold">Swab days</div>
        <ul className="list-disc list-inside">
          <li>Calculated from admission date</li>
          <li>Swabs are due on: day [0, 2, 5, 8]</li>
        </ul>
      </div>

      <div>
        <div className="text-xl font-semibold">How to use</div>
        <ul className="list-decimal list-inside">
          <li>Open [PowerChart]</li>
          <li>Go to [Patient List]</li>
          <li>Select all (Ctrl + A)</li>
          <li>Copy (Ctrl + C)</li>
          <li>Open this website</li>
          <li>Go to [😷 Covid swab list]</li>
          <li>Select column numbers for each fields</li>
          <li>Click [Make] button</li>
          <li>[Allow] permission to access clipboard</li>
        </ul>
      </div>
    </div>
  );
}
