const formatDate = (date) => {
    const sqlDate = new Date(date);
    console.log(sqlDate);
    const year = sqlDate.getFullYear();
    const month = (sqlDate.getMonth() + 1).toString().padStart(2, '0');
    const day = sqlDate.getDate().toString().padStart(2, '0');
    const hours = sqlDate.getHours().toString().padStart(2, '0');
    const minutes = sqlDate.getMinutes().toString().padStart(2, '0');
    const formattedDate = `${day}-${month}-${year}`+'   '+`${hours}:${minutes}`;
    
    return formattedDate;
  };

  export default formatDate;