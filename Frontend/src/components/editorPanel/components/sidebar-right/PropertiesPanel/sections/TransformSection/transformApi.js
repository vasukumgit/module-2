import axios from "axios";
// import { API_URL } from "../../../../../../../config";

export const updateTransform = async (
  selectedElementId,
  transformData
) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.put(
      `${API_URL}/api/properties/${selectedElementId}`,
      {
        properties: {
          transform: transformData,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;

  } catch (err) {
    console.error(err);
  }
};