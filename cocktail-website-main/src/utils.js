function sortList(list) {
  //maybe later remove duplicates here
  if (list && list.length > 0) {
    var sortedList = list.slice(0);
    sortedList.sort((a, b) => {
      return a.strDrink.localeCompare(b.strDrink);
    });
    return sortedList;
  }
}

function alphabeticalList(search, list) {
  if(!list){
    return null
  }
  if (!search) {
    return list;
  } else {
    var filteredResults;
    const searchChar = search.toUpperCase().charAt(0);
    var startsWithChar = (element) =>
      element.strDrink.toUpperCase().charAt(0) === searchChar;
    var startsWithChar2 = startsWithChar;
    if (searchChar !== "Z") {
      startsWithChar2 = (element) =>
        element.strDrink.toUpperCase().charAt(0) ===
        String.fromCharCode(search.toUpperCase().charCodeAt(0) + 1);
      const firstIndex = list.findIndex(startsWithChar);
      const secondIndex = list.findIndex(startsWithChar2);
      let firstPart = list.slice(firstIndex, secondIndex);
      let secondPart = list.slice(0, firstIndex);
      let thirdPart = list.slice(secondIndex);
      filteredResults = firstPart.concat(secondPart).concat(thirdPart);
      return filteredResults;
    } else {
      const firstIndex = list.findIndex(startsWithChar);
      let firstPart = list.slice(firstIndex);
      let secondPart = list.slice(0, firstIndex);
      filteredResults = firstPart.concat(secondPart);
      return filteredResults;
    }
  }
}

module.exports = { sortList, alphabeticalList };
