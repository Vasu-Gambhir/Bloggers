// export const base_url = "http://localhost:8787/api/v1";
export const base_url = "https://server.vasugambhir555.workers.dev/api/v1";

export const formatDate = ({ isoDate }: { isoDate: Date | string }) => {
  const formattedDate = new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "Asia/Kolkata", // or your preferred timezone
  }).format(new Date(isoDate));

  return formattedDate;
};
