import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './KanbanBoard.css';

interface KanbanCard {
    id: string;
    clientName: string;
    amount: number;
    type: string;
    date: string;
}

interface KanbanColumn {
    id: string;
    title: string;
    cards: KanbanCard[];
}

const initialColumns: KanbanColumn[] = [
    {
        id: 'new',
        title: 'Nowe',
        cards: [
            { id: '1', clientName: 'Anna Nowak', amount: 450000, type: 'Hipoteczny', date: '2023-10-25' },
            { id: '5', clientName: 'Marek Zając', amount: 50000, type: 'Gotówkowy', date: '2023-10-26' },
        ]
    },
    {
        id: 'contacted',
        title: 'Skontaktowano',
        cards: [
            { id: '2', clientName: 'Piotr Kowalski', amount: 300000, type: 'Hipoteczny', date: '2023-10-24' },
        ]
    },
    {
        id: 'documents',
        title: 'Dokumenty',
        cards: [
            { id: '3', clientName: 'Maria Wiśniewska', amount: 150000, type: 'Konsolidacja', date: '2023-10-23' },
        ]
    },
    {
        id: 'submitted',
        title: 'W analizie',
        cards: []
    },
    {
        id: 'decision',
        title: 'Decyzja',
        cards: [
            { id: '4', clientName: 'Tomasz Zieliński', amount: 200000, type: 'Firmowy', date: '2023-10-20' },
        ]
    }
];

export const KanbanBoard: React.FC = () => {
    const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns);

    const handleDragStart = (e: React.DragEvent, cardId: string, sourceColId: string) => {
        e.dataTransfer.setData('cardId', cardId);
        e.dataTransfer.setData('sourceColId', sourceColId);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, targetColId: string) => {
        e.preventDefault();
        const cardId = e.dataTransfer.getData('cardId');
        const sourceColId = e.dataTransfer.getData('sourceColId');

        if (sourceColId === targetColId) return;

        const sourceColIndex = columns.findIndex(col => col.id === sourceColId);
        const targetColIndex = columns.findIndex(col => col.id === targetColId);

        const sourceCol = columns[sourceColIndex];
        const targetCol = columns[targetColIndex];

        const cardIndex = sourceCol.cards.findIndex(c => c.id === cardId);
        const card = sourceCol.cards[cardIndex];

        const newSourceCards = [...sourceCol.cards];
        newSourceCards.splice(cardIndex, 1);

        const newTargetCards = [...targetCol.cards, card];

        const newColumns = [...columns];
        newColumns[sourceColIndex] = { ...sourceCol, cards: newSourceCards };
        newColumns[targetColIndex] = { ...targetCol, cards: newTargetCards };

        setColumns(newColumns);
    };

    return (
        <div className="kanban-container">
            <h2 className="kanban-title">Tablica Wniosków</h2>
            <div className="kanban-board">
                {columns.map((column) => (
                    <div
                        key={column.id}
                        className="kanban-column"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, column.id)}
                    >
                        <div className="column-header">
                            <span className="column-title">{column.title}</span>
                            <span className="column-count">{column.cards.length}</span>
                        </div>
                        <div className="column-content">
                            {column.cards.map((card) => (
                                <Link to={`/dashboard/applications/${card.id}`} key={card.id} className="kanban-card-link">
                                    <div
                                        className="kanban-card"
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, card.id, column.id)}
                                    >
                                        <div className="card-header">
                                            <span className="card-type">{card.type}</span>
                                            <span className="card-date">{card.date}</span>
                                        </div>
                                        <div className="card-client">{card.clientName}</div>
                                        <div className="card-amount">{card.amount.toLocaleString()} PLN</div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
