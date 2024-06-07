import { defaultThemes } from "react-data-table-component";

export const gridStyleBoldHeader = {
  header: {
    style: {
      minHeight: "25px",
      // Establece el comportamiento de envoltura del texto

    },
  },
  headRow: {
    style: {
      borderTopStyle: "solid",
      borderTopWidth: "1px",
      borderTopColor: defaultThemes.default.divider.default,
      fontSize: "12px",
      whiteSpace: 'pre-wrap',
      fontWeight: "bold",
      backgroundColor: "#ecf0f1",
      color: "#2c3e50",
    },
  },
  headCells: {
    style: {
      whiteSpace: 'pre-wrap',
      borderRightStyle: "solid",
      borderRightWidth: "1px",
      borderRightColor: defaultThemes.default.divider.default,
    },
  },
  cells: {
    style: {

      borderRightStyle: "solid",
      borderRightWidth: "1px",
      borderRightColor: defaultThemes.default.divider.default,
      fontSize: "10px",
      maxHeight: "50px",
    },
  },

};

export const gridStyle = {
  header: {
    style: {
      minHeight: "25px",
    },
  },
  headRow: {
    style: {
      borderTopStyle: "solid",
      borderTopWidth: "1px",
      borderTopColor: defaultThemes.default.divider.default,
      backgroundColor: "#ecf0f1",
      color: "#2c3e50",
      fontSize: "12px",
    },
  },
  headCells: {
    style: {
      borderRightStyle: "solid",
      borderRightWidth: "1px",
      borderRightColor: defaultThemes.default.divider.default,
    },
  },
  cells: {
    style: {
      borderRightStyle: "solid",
      borderRightWidth: "1px",
      borderRightColor: defaultThemes.default.divider.default,
      fontSize: "12px",
      overflowX: "auto",
    },
  },
};

export const gridStyleBold = {
  header: {
    style: {
      minHeight: "10px",
    },
  },
  headRow: {
    style: {
      borderTopStyle: "solid",
      borderTopWidth: "1px",
      borderTopColor: defaultThemes.default.divider.default,
      fontSize: "13px",
      backgroundColor: "#ecf0f1",
      color: "#2c3e50",
    },
  },
  headCells: {
    style: {
      borderRightStyle: "solid",
      borderRightWidth: "1px",
      borderRightColor: defaultThemes.default.divider.default,
    },
  },
  rows: {
    style: {
      fontWeight: "700",
    },
  },
  cells: {
    style: {
      borderRightStyle: "solid",
      borderRightWidth: "1px",
      borderRightColor: defaultThemes.default.divider.default,
      fontSize: "12px",
    },
  },
};

export const gridStyleFooter = {
  header: {
    style: {
      minHeight: "10px",
    },
  },
  headRow: {
    style: {
      borderTopStyle: "solid",
      borderTopWidth: "1px",
      borderTopColor: defaultThemes.default.divider.default,
      fontSize: "11px",
      backgroundColor: "#ecf0f1",
      color: "#2c3e50",
    },
  },
  headCells: {
    style: {
      borderRightStyle: "solid",
      borderRightWidth: "1px",
      borderRightColor: defaultThemes.default.divider.default,
    },
  },
  cells: {
    style: {
      borderRightStyle: "solid",
      borderRightWidth: "1px",
      borderRightColor: defaultThemes.default.divider.default,
      fontSize: "11px",
    },
  },
};

export default gridStyleBoldHeader;
