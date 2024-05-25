export const TaskChartData = [
    {
      id: 1,
      percentage: 0,
      label: "Total Assigned",
      styles: {
        root: {},
        path: {
          stroke: `rgba(15, 156, 243, ${66 / 100})`,
          strokeLinecap: "butt",
          transition: "stroke-dashoffset 0.5s ease 0s",
          transform: "rotate(0.25turn)",
          transformOrigin: "center center",
          strokeWidth: 6,
        },
        text: {
          fill: "#000000",
          fontSize: "16px",
          fontWeight: "bold",
        },
        trail: {
          stroke: "#E5E0DF",
          strokeWidth: 6,
        },
      },
    },
    {
      id: 2,
      percentage: 0,
      label: "Initiated",
      styles: {
        root: {},
        path: {
          stroke: `rgba(255, 52, 0, ${66 / 100})`,
          strokeLinecap: "butt",
          transition: "stroke-dashoffset 0.5s ease 0s",
          transform: "rotate(0.25turn)",
          transformOrigin: "center center",
          strokeWidth: 6,
        },
        text: {
          fill: "#000000",
          fontSize: "16px",
          fontWeight: "bold",
        },
        trail: {
          stroke: "#E5E0DF",
          strokeWidth: 6,
        },
      },
    },
    {
      id: 3,
      percentage: 0,
      label: "In Progress",
      styles: {
        root: {},
        path: {
          stroke: `rgba(255, 195, 0, ${66 / 100})`,
          strokeLinecap: "butt",
          transition: "stroke-dashoffset 0.5s ease 0s",
          transform: "rotate(0.25turn)",
          transformOrigin: "center center",
          strokeWidth: 6,
        },
        text: {
          fill: "#000000",
          fontSize: "16px",
          fontWeight: "bold",
        },
        trail: {
          stroke: "#E5E0DF",
          strokeWidth: 6,
        },
      },
    },
    {
      id: 4,
      percentage: 0,
      label: "Completed",
      styles: {
        root: {},
        path: {
          stroke: `rgba(0, 255, 29, ${66 / 100})`,
          strokeLinecap: "butt",
          transition: "stroke-dashoffset 0.5s ease 0s",
          transform: "rotate(0.25turn)",
          transformOrigin: "center center",
          strokeWidth: 6,
        },
        text: {
          fill: "#000000",
          fontSize: "16px",
          fontWeight: "bold",
        },
        trail: {
          stroke: "#E5E0DF",
          strokeWidth: 6,
        },
      },
    },
  ];