import styles from "./404.module.scss";

console.log(styles);

const NotFound = () => {
  return (
    <div className={styles.root}>
      <h1>Ничего не найдено :( </h1>
      <p>К сожалению, данная страница отсутствует или введен не правильный адрес.</p>
    </div>
  );
};

export default NotFound;
