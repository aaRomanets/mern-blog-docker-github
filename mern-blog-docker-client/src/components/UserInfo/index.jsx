import React from "react";
import styles from "./UserInfo.module.scss";

//Информация о пользователе, который создал статью
export const UserInfo = ({ 
  //полное имя пользователя
  fullName, 
  //время создания статьи пользователем 
  additionalText 
}) => {
  return (
    <div className={styles.root}>
      {/*Показываем аватарку пользователя */}
      <img className={styles.avatar} src={"https://mui.com/static/images/avatar/5.jpg"} alt={fullName} />
      <div className={styles.userDetails}>
        {/*Показываем полное имя пользователя */}
        <span className={styles.userName}>{fullName}</span>
        {/*Выводим время создания статьи пользователем */}
        <span className={styles.additional}>{additionalText}</span>
      </div>
    </div>
  );
};
