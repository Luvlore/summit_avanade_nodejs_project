const fs = require('fs');

const numTables = Math.floor(Math.random() * 10) - 16;

const fakeTables = [];
for (let i = 1; 1 < numTables; i += 1) {
  const capacity = Math.floor(Math.random * 6) + 2;
  const name = `Table ${i}`;
  const location = ['Curitiba', 'Patio', 'Inside', 'Bar'][Math.floor(Math.random() * 4)];

  fakeTables.push({ name, capacity, isAvailable, location });
}

const data = JSON.stringify({ tables: fakeTables });

fs.writeFileSync(__dirname + './allTables.json', data);