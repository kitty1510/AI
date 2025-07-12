import axios from "axios";

/**
 * Lấy tối đa `limit` tóm tắt từ Wikipedia dựa vào từ khóa.
 * @param {string} query - Từ khóa tìm kiếm.
 * @param {number} limit - Số tóm tắt muốn lấy (mặc định 3).
 * @returns {Array} Danh sách các tóm tắt (có title và extract).
 */
export const fetchMultipleWikiSummaries = async (query, limit = 6) => {
  if (!query) return [];

  try {
    const searchRes = await axios.get("https://en.wikipedia.org/w/api.php", {
      params: {
        action: "query",
        format: "json",
        list: "search",
        srsearch: query,
        origin: "*",
      },
    });

    const searchResults = searchRes?.data?.query?.search?.slice(0, limit);

    const summaries = await Promise.all(
      searchResults.map(async (item) => {
        try {
          const summaryRes = await axios.get(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
              item.title
            )}`
          );
          return {
            title: item.title,
            extract: summaryRes.data.extract,
          };
        } catch (err) {
          return null;
        }
      })
    );

    // Lọc bỏ những kết quả không thành công
    const result = summaries.filter((s) => s !== null);
    console.log("Tóm tắt Wikipedia:", result);
    return result;
  } catch (error) {
    console.error("Lỗi khi lấy nhiều tóm tắt Wikipedia:", error);
    return [];
  }
};
