import React from "react";
import styles from "./SideBlock.module.scss";
import { Paper, Typography } from "@mui/material";

//Блок записи тэгов по пяти последним статьям
export const SideBlock = ({ title, children }) => {
  return (
    <Paper classes={{ root: styles.root }}>
      <Typography variant="h6" classes={{ root: styles.title }}>
        {title}
      </Typography>
      {children}
    </Paper>
  );
};