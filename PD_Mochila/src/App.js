import React, { useState } from "react";
import "./App.css";

function Knapsack({ maxWeight, items }) {
  const [memo, setMemo] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemsWeight, setSelectedItemsWeight] = useState(0);
  const [totalValue, setTotalValue] = useState(0);

  const solveKnapsack = () => {
    const n = items.length;
    const W = maxWeight;
    const memoTable = Array(n + 1)
      .fill(null)
      .map(() => Array(W + 1).fill(0));
    const pathTable = Array(n + 1)
      .fill(null)
      .map(() => Array(W + 1).fill(""));

    for (let i = 1; i <= n; i++) {
      const { weight, value } = items[i - 1];
      for (let w = 0; w <= W; w++) {
        if (weight <= w) {
          const takeItem = memoTable[i - 1][w - weight] + value;
          const dontTakeItem = memoTable[i - 1][w];

          if (takeItem > dontTakeItem) {
            memoTable[i][w] = takeItem;
            pathTable[i][w] = "Take";
          } else if (takeItem < dontTakeItem) {
            memoTable[i][w] = dontTakeItem;
            pathTable[i][w] = "Don't Take";
          } else {
            memoTable[i][w] = takeItem;
            pathTable[i][w] = "Take/Don't Take";
          }
        } else {
          memoTable[i][w] = memoTable[i - 1][w];
          pathTable[i][w] = "Don't Take";
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
      if (pathTable[i][w] === "Take") {
        selected.push(currentItem);
        w -= currentItem.weight;
      }
    }

    setSelectedItemsWeight(W - w);
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

      if (pathTable[i][w] === "Take/Don't Take") {
        explorePaths(i - 1, w - items[i - 1].weight, [
          ...path,
          `Take ${items[i - 1].name}`,
        ]);
        explorePaths(i - 1, w, [...path, `Don't Take ${items[i - 1].name}`]);
      } else if (pathTable[i][w] === "Take") {
        explorePaths(i - 1, w - items[i - 1].weight, [
          ...path,
          `Take ${items[i - 1].name}`,
        ]);
      } else {
        explorePaths(i - 1, w, [...path, `Don't Take ${items[i - 1].name}`]);
      }
    };

    explorePaths(i, w, []);
  };

  return (
    <div className="knapsack-container">
      <button className="knapsack-button" onClick={solveKnapsack}>
        Calcular Mochila
      </button>
      <div className="horizontal-line"></div>
      <MemoizationMatrix memo={memo} />
      <SelectedItems items={selectedItems} />
      <TotalValue
        value={totalValue}
        weight={selectedItemsWeight}
        maxWeight={maxWeight}
      />
    </div>
  );
}

function MemoizationMatrix({ memo }) {
  if (!memo.length) return null;

  return (
    <>
      <h3>Matriz de Memoization</h3>
      <div className="memo-matrix">
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
    </>
  );
}

function SelectedItems({ items }) {
  if (!items.length) return null;

  return (
    <div className="selected-items">
      <h3>Itens Selecionados</h3>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item.name} (Peso: {item.weight}, Valor: {item.value})
          </li>
        ))}
      </ul>
    </div>
  );
}

function TotalValue({ value, weight, maxWeight }) {
  return (
    <div className="total-value">
      <div>
        <h3>Valor Total Máximo</h3>
        <p>{value}</p>
      </div>
      <div>
        <h3>Peso utilizado</h3>
        <p>
          {weight}/{maxWeight}
        </p>
      </div>
    </div>
  );
}

function App() {
  const [maxWeight, setMaxWeight] = useState(0);
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", weight: 0, value: 0 });

  const addItem = () => {
    if (
      items.length < 10 &&
      newItem.name &&
      newItem.weight > 0 &&
      newItem.value > 0
    ) {
      setItems([...items, newItem]);
      setNewItem({ name: "", weight: 0, value: 0 });
    } else {
      alert("Máximo de 10 itens atingido ou valores inválidos!");
    }
  };

  const handleNumericInputChange = (e, field) => {
    const value = e.target.value;
    if (!isNaN(value)) {
      setNewItem({ ...newItem, [field]: Number(value) });
    }
  };

  return (
    <div className="app-container">
      <h1>Knapsack Algorithm</h1>
      <div className="input-container">
        <label>
          Peso Máximo da Mochila:
          <input
            type="text"
            value={maxWeight}
            onChange={(e) => setMaxWeight(Number(e.target.value))}
          />
        </label>
      </div>
      <div className="add-item-container">
        <h3>Adicionar Item</h3>
        <label>Nome</label>
        <input
          type="text"
          placeholder="Nome"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <label>Peso</label>
        <input
          type="text"
          placeholder="Peso"
          value={newItem.weight}
          onChange={(e) => handleNumericInputChange(e, "weight")}
        />
        <label>Valor</label>
        <input
          type="text"
          placeholder="Valor"
          value={newItem.value}
          onChange={(e) => handleNumericInputChange(e, "value")}
        />
        <button className="add-item-button" onClick={addItem}>
          Adicionar Item
        </button>
      </div>
      <div className="added-items-container">
        <h3>Itens Adicionados</h3>
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              {item.name} (Peso: {item.weight}, Valor: {item.value})
            </li>
          ))}
        </ul>
      </div>
      <Knapsack maxWeight={maxWeight} items={items} />
    </div>
  );
}

export default App;
