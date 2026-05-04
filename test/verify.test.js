const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const assert = require('assert');

const runScript = (db, script) => {
  const sql = fs.readFileSync(script, 'utf8');
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

const getAllFromGrocery = (db) => {
  const sql = `SELECT * FROM GROCERY`;
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

describe('the SQL in the `exercise.sql` file', () => {
  let db;
  let scriptPath;
  let sqlContent;
  let update;

  beforeAll( async () => {
    let filePath = path.join(__dirname, '/../exercise.sql');
    sqlContent = fs.readFileSync(filePath, {encoding: 'utf-8'}, function(data){
      return data;
    });

    const dbPath = path.resolve(__dirname, '..', 'lesson33.db');
    db = new sqlite3.Database(dbPath);

    scriptPath = path.resolve(__dirname, '..', 'exercise.sql');
    update = path.resolve(__dirname, './update.sql')
    await runScript(db, update);
  });

  afterAll(() => {
    db.close();
  });

  it('should contain the getdate() function', async () => {
    expect(sqlContent).toMatch(/date\(\)/gi);
  });

  it('should return products where the next expire date is on or before todays date', async () => {
    const results = await runScript(db, scriptPath);
    let groceries = await getAllFromGrocery(db);
    groceries = groceries.filter((product) => {
      if (Date.parse(product.NEXT_EXPIRE_DATE) <= Date.now())
        return true; 
    })

    expect(results.sort()).toStrictEqual(groceries.sort())
  });
});
