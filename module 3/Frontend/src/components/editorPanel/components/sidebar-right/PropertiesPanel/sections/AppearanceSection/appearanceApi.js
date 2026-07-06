import axios from "axios";

export const updateAppearance = async (
  selectedElementId,
  appearanceData
) => {

  try {

    const token =
      localStorage.getItem("token");

    const res = await axios.put(
      `${API_URL}/api/properties/${selectedElementId}`,
      {
        properties: {
          appearance: appearanceData,
        },
      },
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

    return res.data;

  } catch (err) {
    console.error(err);
  }
};