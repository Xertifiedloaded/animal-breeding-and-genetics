import { useState, useEffect } from "react";
import axios from "axios";
import ResponseModal from "@/components/Modal";
import Loader from "../../../components/loader";

export default function DataTable() {
  const [row, setRow] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/alumni/info");
      setRow(response.data.data);
      setFilteredData(response.data.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRowClick = (item) => {
    setSelectedRow(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);
    if (searchValue) {
      const lowerCaseSearchValue = searchValue.toLowerCase();
      const filtered = row.filter(
        (item) =>
          item.firstName.toLowerCase().includes(lowerCaseSearchValue) ||
          item.lastName.toLowerCase().includes(lowerCaseSearchValue)
      );
      setFilteredData(filtered);
      setSuggestions(filtered);
    } else {
      setFilteredData(row);
      setSuggestions([]);
    }
  };

  const exportToCSV = () => {
    const csvContent = `data:text/csv;charset=utf-8,${[
      [
        "First Name",
        "Last Name",
        "Middle Name",
        "Email Address",
        "Graduated Year",
        "Location/Country",
        "Phone Number",
        "Supervisor",
        "Previous Job",
        "Current Job",
      ],
      ...filteredData.map((item) => [
        item.firstName,
        item.lastName,
        item.middleName,
        item.emailAddress,
        item.graduatedYear,
        item.locationOrCountry,
        item.phoneNumber,
        item.supervisor,
        item.previousJob,
        item.currentJob,
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n")}`;

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "exported_data.csv";
    link.click();
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 py-6 ">
        <div className=" mx-auto bg-white rounded-lg shadow-lg p-4">
          <div className="flex flex-col md:flex-row justify-between mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by First or Last Name..."
              className="mb-4 md:mb-0 md:w-1/2 px-4 py-2 placeholder:text-sm border rounded-md focus:outline-none focus:ring focus:ring-blue-400"
            />
            <button
              onClick={exportToCSV}
              className="lg:px-4 lg:py-2 px-3 py-1 text-white bg-gray-600 transition-all duration-500 text-sm rounded-md hover:bg-blue-600"
            >
              Export to CSV
            </button>
          </div>

          {searchTerm && suggestions.length > 0 && (
            <ul className="mb-4 border h-[200px] overflow-auto border-gray-300 rounded-md">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="p-2 cursor-pointer text-sm hover:bg-gray-100"
                  onClick={() => {
                    setSearchTerm(`${suggestion.firstName} ${suggestion.lastName}`);
                    setFilteredData([suggestion]);
                    setSuggestions([]);
                  }}
                >
                  {suggestion.firstName} {suggestion.lastName}
                </li>
              ))}
            </ul>
          )}

          {loading ? (
            <Loader />
          ) : (
            <div className="overflow-x-auto rounded-lg shadow-md">
              <table className="min-w-full text-xs md:text-sm divide-y divide-gray-200">
                <thead className="bg-gray-50 whitespace-nowrap">
                  <tr>
                    {["First Name", "Last Name", "Middle Name", "Email Address", "Graduated Year", "Location/Country", "Phone Number", "Supervisor", "Previous Job", "Current Job"].map((header) => (
                      <th
                        key={header}
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleRowClick(item)}
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{item.firstName}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{item.lastName}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{item.middleName}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{item.emailAddress}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{item.graduatedYear}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{item.locationOrCountry}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">+{item.phoneNumber}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{item.supervisor}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{item.previousJob}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700 truncate">{item.currentJob}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && selectedRow && (
        <ResponseModal closeModal={closeModal} selectedRow={selectedRow} />
      )}
    </>
  );
}
