export const formatBookDate = (dateString) => {
  if (!dateString) return null;

  const today = new Date().toISOString().split("T")[0];

  const [year, month] = dateString.split("-");

  if (dateString > today) {
    const seasons = ["Winter", "Spring", "Summer", "Fall"];
    const season = seasons[Math.floor((Number(month) - 1) / 3)];

    return {
      label: "Publish Date",
      date: `${season} ${year}`
    };
  }

  const months = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];

  return {
    label: "Published",
    date: `${months[Number(month) - 1]} ${year}`
  };
};

export const formatDate = (dateString) => {
  const [year, month, day] = dateString.split("-");
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
};