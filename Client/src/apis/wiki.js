import axios from "axios";

export const fetchMultipleWikiSummaries = async (query, limit = 5) => {
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
        const summaryRes = await axios.get(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
            item.title
          )}`
        );
        return {
          title: item.title,
          extract: summaryRes.data.extract,
        };
      })
    );

    return summaries;
  } catch (err) {
    console.error("❌ Lỗi lấy tóm tắt Wikipedia:", err);
    return [];
  }
};
