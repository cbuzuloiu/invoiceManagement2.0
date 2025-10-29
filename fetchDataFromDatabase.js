export async function fetchCompanies(url) {
  try {
    const response = await fetch(`${url}`);

    // Handle non-OK responses
    if (!response.ok) {
      let errorMsg = "Unknown error";

      try {
        const errorData = await response.json();
        errorMsg = errorData.error || JSON.stringify(errorData);
      } catch {
        errorMsg = response.statusText;
      }
      throw new Error(`HTTP ${response.status}: ${errorMsg}`);
    }

    const data = await response.json();
    const sorted = Array.isArray(data)
      ? data.slice().sort((a, b) => {
          const ai = Number(a?.id ?? Number.MAX_SAFE_INTEGER);
          const bi = Number(b?.id ?? Number.MAX_SAFE_INTEGER);
          return ai - bi;
        })
      : [];
    return sorted;
  } catch (error) {
    console.error("Fetch error:", error);
    return { error: error.message, data: [] };
  }
}
