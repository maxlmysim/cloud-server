import React, { useState } from "react";
import { TransitionGroup, Transition } from "react-transition-group";
import "./app.css";

const App1 = () => {
    const [items, setItems] = useState([1, 2, 3]);

    const addItem = () => {
        const newItem = items.length + 1;
        setItems([...items, newItem]);
    };

    const removeItem = (id) => {
        setItems(items.filter((item) => item !== id));
    };

    return (
        <div className="container">
            <button onClick={addItem}>Добавить элемент</button>
            <TransitionGroup>
                {items.map((item) => (
                    <Transition key={item} timeout={300}>
                        {(state) => (
                            <div
                                className={`item ${state}`}
                                onClick={() => removeItem(item)}
                            >
                                Элемент {item}
                            </div>
                        )}
                    </Transition>
                ))}
            </TransitionGroup>
        </div>
    );
};

export default App1;
