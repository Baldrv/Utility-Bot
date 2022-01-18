exports.chunkArray = function (list, elementsPerSubArray) {
  const chunkedArray = [];
  let i, k;
  for (i = 0, k = -1; i < list.length; i++) {
    if (i % elementsPerSubArray === 0) {
      k++;
      chunkedArray[k] = [];
    }
    chunkedArray[k].push(list[i]);
  }
  return chunkedArray;
};

exports.formatTime = function (duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  days = Math.floor((duration / (1000 * 60 * 60 * 24)) % 1);

  days = days < 10 ? "0" + days : days;
  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  let string = "";

  if (days != 00) {
    string += `${days} days `;
    console.log(days);
  }
  if (hours != 00) {
    string += `${hours} hrs `;
    console.log(hours);
  }
  if (minutes != 00) {
    string += `${minutes} mins `;
    console.log(minutes);
  }
  if (seconds != 00) {
    string += `${seconds} secs `;
    console.log(seconds);
  }
  return string;
};
