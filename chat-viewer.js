class Viewer {
  constructor(data, rowNumber, viewerName = null, create = false) {
    this.rowNumber = rowNumber;
    this.name = create ? viewerName : data[0];
    this.points = create ? 0 : data[1];
  }

  addPoints(pointsToAdd) {
    this.points += pointsToAdd;
  }
  
  toRow() {
    let excelRow = [ this.name ];
    
    // This will have more columns once implemented
    excelRow.push(this.name);
    excelRow.push(this.points);
    
    return excelRow;
  }

  toString() {
    return `${this.name} has ${this.points}.`
  }
}

module.exports = {
  Viewer
}