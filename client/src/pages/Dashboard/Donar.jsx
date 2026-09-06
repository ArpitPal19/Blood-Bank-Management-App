import { useEffect, useState } from "react";
import Layout from "../../components/shared/Layout/Layout";
import API from "../../services/API";
import moment from "moment";

const Donar = () => {
  const [data, setData] = useState([]);

  // Find donor records
  const getDonars = async () => {
    try {
      const { data } = await API.get("/inventory/get-donars");

      console.log("Donar API Response:", data);

      if (data?.success) {
        setData(data?.donars || []);
      }
    } catch (error) {
      console.log("Donar API Error:", error);
    }
  };

  useEffect(() => {
    const loadDonars = async () => {
      await getDonars();
    };

    loadDonars();
  }, []);

  return (
    <Layout>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Phone</th>
            <th scope="col">Date</th>
          </tr>
        </thead>

        <tbody>
          {data?.map((record) => (
            <tr key={record._id}>
              <td>{record.name || `${record.organisationName} (ORG)`}</td>
              <td>{record.email}</td>
              <td>{record.phone}</td>
              <td>{moment(record.createdAt).format("DD/MM/YYYY hh:mm A")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default Donar;
