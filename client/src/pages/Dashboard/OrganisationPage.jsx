// import { useEffect, useState } from "react";
// import Layout from "./../../components/shared/Layout/Layout";
// import moment from "moment";
// import { useSelector } from "react-redux";
// import API from "../../services/API";

// const OrganisationPage = () => {
//   // get current user
//   const { user } = useSelector((state) => state.auth);
//   const [data, setData] = useState([]);
//   //find org records
//   const getOrg = async () => {
//     try {
//       if (user?.role === "donar") {
//         const { data } = await API.get("/inventory/get-organisation");
//         //   console.log(data);
//         if (data?.success) {
//           setData(data?.organisations);
//         }
//       }
//       if (user?.role === "hospital") {
//         const { data } = await API.get(
//           "/inventory/get-organisation-for-hospital",
//         );
//         //   console.log(data);
//         if (data?.success) {
//           setData(data?.organisations);
//         }
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // useEffect(() => {
//   //   getOrg();
//   // }, [user]);

//   useEffect(() => {
//     const loadOrganisations = async () => {
//       await getOrg();
//     };

//     loadOrganisations();
//   }, [user]);

//   return (
//     <Layout>
//       <table className="table ">
//         <thead>
//           <tr>
//             <th scope="col">Name</th>
//             <th scope="col">Email</th>
//             <th scope="col">Phone</th>
//             <th scope="col">Address</th>
//             <th scope="col">Date</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data?.map((record) => (
//             <tr key={record._id}>
//               <td>{record.organisationName}</td>
//               <td>{record.email}</td>
//               <td>{record.phone}</td>
//               <td>{record.address}</td>
//               <td>{moment(record.createdAt).format("DD/MM/YYYY hh:mm A")}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </Layout>
//   );
// };

// export default OrganisationPage;

import { useEffect, useState } from "react";
import Layout from "./../../components/shared/Layout/Layout";
import moment from "moment";
import { useSelector } from "react-redux";
import API from "../../services/API";

const OrganisationPage = () => {
  // Get current user
  const { user } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);

  // Find organisation records
  const getOrg = async () => {
    try {
      // For Donor
      if (user?.role === "donar") {
        const { data } = await API.get("/inventory/get-organisation");

        if (data?.success) {
          setData(data?.organisations || []);
        }
      }

      // For Hospital
      if (user?.role === "hospital") {
        const { data } = await API.get(
          "/inventory/get-organisation-for-hospital",
        );

        if (data?.success) {
          setData(data?.organisations || []);
        }
      }

      // For Organisation
      if (user?.role === "organisation") {
        const { data } = await API.get("/inventory/get-inventory");

        if (data?.success) {
          setData(data?.inventory || []);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const loadOrganisations = async () => {
      await getOrg();
    };

    loadOrganisations();
  }, [user]);

  return (
    <Layout>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Blood Group</th>
            <th scope="col">Inventory Type</th>
            <th scope="col">Quantity</th>
            <th scope="col">Donar Email</th>
            <th scope="col">Time & Date</th>
          </tr>
        </thead>

        <tbody>
          {data?.map((record) => (
            <tr key={record._id}>
              <td>{record.bloodGroup}</td>
              <td>{record.inventoryType}</td>
              <td>{record.quantity} (ML)</td>
              <td>{record.email || "-"}</td>
              <td>{moment(record.createdAt).format("DD/MM/YYYY hh:mm A")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default OrganisationPage;
