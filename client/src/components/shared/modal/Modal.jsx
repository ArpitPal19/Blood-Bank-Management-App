import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import InputType from "./../Form/InputType";
import API from "./../../../services/API";

const Modal = () => {
  const [inventoryType, setInventoryType] = useState("in");
  const [bloodGroup, setBloodGroup] = useState("");
  const [quantity, setQuantity] = useState("");
  const [email, setEmail] = useState("");
  const [organisations, setOrganisations] = useState([]);
  const [organisation, setOrganisation] = useState("");

  const { user } = useSelector((state) => state.auth);

  // Get organisations
  useEffect(() => {
    const getOrganisations = async () => {
      try {
        if (user?.role === "donar" || user?.role === "hospital") {
          const { data } = await API.get("/inventory/get-organisation");

          if (data?.success) {
            setOrganisations(data.organisations);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    getOrganisations();
  }, [user]);

  // Handle submit
  const handleModalSubmit = async () => {
    try {
      if (!bloodGroup || !quantity) {
        return alert("Please Provide All Fields");
      }

      // Donor must select organisation
      if (user?.role === "donar" && !organisation) {
        return alert("Please Select Organisation");
      }

      // Hospital must select organisation for OUT transaction
      if (
        user?.role === "hospital" &&
        inventoryType === "out" &&
        !organisation
      ) {
        return alert("Please Select Organisation");
      }

      const payload = {
        email,
        inventoryType,
        bloodGroup,
        quantity,
      };

      // For donor, selected organisation
      if (user?.role === "donar") {
        payload.organisation = organisation;
      }

      // For hospital OUT, selected organisation
      if (user?.role === "hospital" && inventoryType === "out") {
        payload.organisation = organisation;
      }

      const { data } = await API.post("/inventory/create-inventory", payload);

      if (data?.success) {
        alert("New Record Created");
        window.location.reload();
      }
    } catch (error) {
      console.log(error);

      alert(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                Manage Blood Record
              </h1>

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>

            <div className="modal-body">
              {/* Inventory Type */}
              <div className="d-flex mb-3">
                Blood Type: &nbsp;
                <div className="form-check ms-3">
                  <input
                    type="radio"
                    name="inventoryType"
                    value="in"
                    checked={inventoryType === "in"}
                    onChange={(e) => setInventoryType(e.target.value)}
                    className="form-check-input"
                  />

                  <label className="form-check-label">IN</label>
                </div>
                <div className="form-check ms-3">
                  <input
                    type="radio"
                    name="inventoryType"
                    value="out"
                    checked={inventoryType === "out"}
                    onChange={(e) => setInventoryType(e.target.value)}
                    className="form-check-input"
                  />

                  <label className="form-check-label">OUT</label>
                </div>
              </div>

              {/* Organisation Dropdown */}

              {(user?.role === "donar" ||
                (user?.role === "hospital" && inventoryType === "out")) && (
                <select
                  className="form-select mb-3"
                  value={organisation}
                  onChange={(e) => setOrganisation(e.target.value)}
                >
                  <option value="">Select Organisation</option>

                  {organisations?.map((org) => (
                    <option key={org._id} value={org._id}>
                      {org.organisationName}
                    </option>
                  ))}
                </select>
              )}

              {/* Blood Group */}

              <select
                className="form-select mb-3"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
              >
                <option value="">Select Blood Group</option>

                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>

              {/* Donor Email */}

              {user?.role === "donar" && (
                <InputType
                  labelText={"Donar Email"}
                  labelFor={"donarEmail"}
                  inputType={"email"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              )}

              {/* Quantity */}

              <InputType
                labelText={"Quantity (ML)"}
                labelFor={"quantity"}
                inputType={"number"}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={handleModalSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
