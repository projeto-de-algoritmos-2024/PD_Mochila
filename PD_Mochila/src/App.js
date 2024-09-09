import React, { useState } from 'react';

function Knapsack({ maxWeight, items }) {
  const [memo, setMemo] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [totalValue, setTotalValue] = useState(0);

  const solveKnapsack = () => {
    const n = items.length;
    const W = maxWeight;
    const memoTable = Array(n + 1).fill(null).map(() => Array(W + 1).fill(0));
    const pathTable = Array(n + 1).fill(null).map(() => Array(W + 1).fill(''));


    for (let i = 1; i <= n; i++) {
      const { weight, value } = items[i - 1];
      for (let w = 0; w <= W; w++) {
        if (weight <= w) {
          const takeItem = memoTable[i - 1][w - weight] + value;
          const dontTakeItem = memoTable[i - 1][w];

          if (takeItem > dontTakeItem) {
            memoTable[i][w] = takeItem;
            pathTable[i][w] = 'Take';
          } else if (takeItem < dontTakeItem) {
            memoTable[i][w] = dontTakeItem;
            pathTable[i][w] = 'Dont Take';
          } else {
            memoTable[i][w] = takeItem; 
            pathTable[i][w] = 'Take/Dont Take'; 
          }
        } else {
          memoTable[i][w] = memoTable[i - 1][w];
          pathTable[i][w] = 'Don\'t Take';
        }
      }
    }

    setMemo(memoTable);
    setTotalValue(memoTable[n][W]);
    findItemsInKnapsack(memoTable, pathTable, n, W);
    findDecisionPaths(pathTable, n, W);
  };

  const findItemsInKnapsack = (memoTable, pathTable, n, W) => {
    let w = W;
    const selected = [];

    for (let i = n; i > 0 && w > 0; i--) {
      const currentItem = items[i - 1];
      if (pathTable[i][w] === 'Take') {
        selected.push(currentItem);
        w -= currentItem.weight;
      }
    }

    setSelectedItems(selected);
  };

  const findDecisionPaths = (pathTable, n, W) => {
    let w = W;
    let i = n;
    const paths = [];
    const explorePaths = (i, w, path) => {
      if (i === 0 || w === 0) {
        paths.push(path);
        return;
      }

      if (pathTable[i][w] === 'Take/Don\'t Take') {
        explorePaths(i - 1, w - items[i - 1].weight, [...path, `Take ${items[i - 1].name}`]);
        explorePaths(i - 1, w, [...path, `Don't Take ${items[i - 1].name}`]);
      } else if (pathTable[i][w] === 'Take') {
        explorePaths(i - 1, w - items[i - 1].weight, [...path, `Take ${items[i - 1].name}`]);
      } else {
        explorePaths(i - 1, w, [...path, `Don't Take ${items[i - 1].name}`]);
      }
    };

    explorePaths(i, w, []);
  };

  return (
    <div>
      <button onClick={solveKnapsack}>Calcular Mochila</button>
      <MemoizationMatrix memo={memo} />
      <SelectedItems items={selectedItems} />
      <TotalValue value={totalValue} />
    </div>
  );
}

function MemoizationMatrix({ memo }) {
  if (!memo.length) return null;

  return (
    <div>
      <h3>Matriz de Memoization</h3>
      <table>
        <tbody>
          {memo.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}



function SelectedItems({ items }) {
  if (!items.length) return null;

  return (
    <div>
      <h3>Itens Selecionados</h3>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item.name} (Peso: {item.weight}, Valor: {item.value})</li>
        ))}
      </ul>
    </div>
  );
}

function TotalValue({ value }) {
  return (
    <div>
      <h3>Valor Total Máximo</h3>
      <p>{value}</p>
    </div>
  );
}

function App() {
  const [maxWeight, setMaxWeight] = useState(0);
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', weight: 0, value: 0 });

  const addItem = () => {
    if (items.length < 10 && newItem.name && newItem.weight > 0 && newItem.value > 0) {
      setItems([...items, newItem]);
      setNewItem({ name: '', weight: 0, value: 0 });
    } else {
      alert("Máximo de 10 itens atingido ou valores inválidos!");
    }
  };

  return (
    <div>
      <h1>Algoritmo da Mochila</h1>
      <div>
        <label>
          Peso Máximo da Mochila:
          <input 
            type="number" 
            value={maxWeight} 
            onChange={(e) => setMaxWeight(Number(e.target.value))} 
          />
        </label>
      </div>
      <div>
        <h3>Adicionar Item</h3>
        <input 
          type="text" 
          placeholder="Nome" 
          value={newItem.name} 
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} 
        />
        <input 
          type="number" 
          placeholder="Peso" 
          value={newItem.weight} 
          onChange={(e) => setNewItem({ ...newItem, weight: Number(e.target.value) })} 
        />
        <input 
          type="number" 
          placeholder="Valor" 
          value={newItem.value} 
          onChange={(e) => setNewItem({ ...newItem, value: Number(e.target.value) })} 
        />
        <button onClick={addItem}>Adicionar Item</button>
      </div>
      <div>
        <h3>Itens Adicionados</h3>
        <ul>
          {items.map((item, index) => (
            <li key={index}>{item.name} (Peso: {item.weight}, Valor: {item.value})</li>
          ))}
        </ul>
      </div>
      <Knapsack maxWeight={maxWeight} items={items} />
    </div>
  );
}

export default App;
