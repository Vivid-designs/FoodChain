'use client'
import React, { useState } from 'react';
import { COLORS } from '../lib/colors';

export interface BillItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Person {
  id: string;
  name: string;
  tipPercentage: number;
}

export interface ItemAssignment {
  itemId: string;
  assignedQuantity: number;
  assignedTo: string[]; // person IDs
  pricePerPerson: number;
}

export interface ResultsScreenProps {
  items: BillItem[];
  onBack: () => void;
  onNext: (assignments: ItemAssignment[], people: Person[]) => void;
}

export default function ResultsScreen({ items, onBack, onNext }: ResultsScreenProps) {
  const [people, setPeople] = useState<Person[]>([
    { id: '1', name: 'Person 1', tipPercentage: 10 },
    { id: '2', name: 'Person 2', tipPercentage: 10 }
  ]);
  
  const [assignments, setAssignments] = useState<ItemAssignment[]>([]);
  const [editingPersonId, setEditingPersonId] = useState<string | null>(null);
  const [splittingItem, setSplittingItem] = useState<string | null>(null);
  const [splitQuantity, setSplitQuantity] = useState<number>(1);
  const [selectedPeople, setSelectedPeople] = useState<Set<string>>(new Set());

  // Get person color
  const getPersonColor = (personId: string) => {
    const personIndex = people.findIndex(p => p.id === personId);
    return COLORS[personIndex % COLORS.length];
  };

  // Add person
  const addPerson = () => {
    const newId = (people.length + 1).toString();
    setPeople([...people, { id: newId, name: `Person ${newId}`, tipPercentage: 10 }]);
  };

  // Remove person
  const removePerson = (personId: string) => {
    if (people.length <= 2) return; // Minimum 2 people
    
    setPeople(people.filter(p => p.id !== personId));
    // Remove assignments for this person
    setAssignments(assignments.filter(a => !a.assignedTo.includes(personId)));
  };

  // Update person name
  const updatePersonName = (personId: string, name: string) => {
    setPeople(people.map(p => p.id === personId ? { ...p, name } : p));
  };

  // Update person tip
  const updatePersonTip = (personId: string, tip: number) => {
    setPeople(people.map(p => p.id === personId ? { ...p, tipPercentage: tip } : p));
  };

  // Start splitting an item
  const startSplit = (itemId: string) => {
    setSplittingItem(itemId);
    setSplitQuantity(1);
    setSelectedPeople(new Set());
  };

  // Confirm split
  const confirmSplit = () => {
    if (!splittingItem || selectedPeople.size === 0) return;

    const item = items.find(i => i.id === splittingItem)!;
    const pricePerPerson = (item.price * splitQuantity) / selectedPeople.size;

    const newAssignment: ItemAssignment = {
      itemId: splittingItem,
      assignedQuantity: splitQuantity,
      assignedTo: Array.from(selectedPeople),
      pricePerPerson
    };

    setAssignments([...assignments, newAssignment]);
    setSplittingItem(null);
    setSplitQuantity(1);
    setSelectedPeople(new Set());
  };

  // Cancel split
  const cancelSplit = () => {
    setSplittingItem(null);
    setSplitQuantity(1);
    setSelectedPeople(new Set());
  };

  // Get assigned quantity for an item
  const getAssignedQuantity = (itemId: string) => {
    return assignments
      .filter(a => a.itemId === itemId)
      .reduce((sum, a) => sum + a.assignedQuantity, 0);
  };

  // Get person's subtotal
  const getPersonSubtotal = (personId: string) => {
    return assignments
      .filter(a => a.assignedTo.includes(personId))
      .reduce((sum, a) => sum + a.pricePerPerson, 0);
  };

  // Get person's tip amount
  const getPersonTip = (personId: string) => {
    const subtotal = getPersonSubtotal(personId);
    const tipPercentage = people.find(p => p.id === personId)?.tipPercentage || 10;
    return (subtotal * tipPercentage) / 100;
  };

  // Get person's total
  const getPersonTotal = (personId: string) => {
    return getPersonSubtotal(personId) + getPersonTip(personId);
  };

  const totalBillAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalAssignedAmount = assignments.reduce((sum, a) => sum + (a.pricePerPerson * a.assignedTo.length), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header - People Section */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">People</h2>
            <button
              onClick={addPerson}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              + Add Person
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {people.map((person) => (
              <div key={person.id} className="flex items-center bg-blue-50 rounded-lg px-3 py-2">
                {editingPersonId === person.id ? (
                  <input
                    type="text"
                    value={person.name}
                    onChange={(e) => updatePersonName(person.id, e.target.value)}
                    onBlur={() => setEditingPersonId(null)}
                    onKeyPress={(e) => e.key === 'Enter' && setEditingPersonId(null)}
                    className="bg-transparent border-none outline-none text-sm font-medium"
                    autoFocus
                  />
                ) : (
                  <span
                    onClick={() => setEditingPersonId(person.id)}
                    className="text-sm font-medium cursor-pointer hover:text-blue-600"
                  >
                    {person.name}
                  </span>
                )}
                
                {people.length > 2 && (
                  <button
                    onClick={() => removePerson(person.id)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Tip Revision */}
          <div className="mt-4 space-y-2">
            <h3 className="text-sm font-medium text-gray-600">Tip Revision</h3>
            <div className="grid grid-cols-2 gap-2">
              {people.map((person) => (
                <div key={person.id} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                  <span className="text-sm">{person.name}</span>
                  <div className="flex items-center space-x-1">
                    <input
                      type="number"
                      value={person.tipPercentage}
                      onChange={(e) => updatePersonTip(person.id, Number(e.target.value))}
                      className="w-12 text-xs text-center border rounded px-1 py-1"
                      min="0"
                    />
                    <span className="text-xs">%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bill Items */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-700">Bill Items</h2>
          </div>

          {/* Header Row */}
          <div className="grid grid-cols-5 gap-2 p-4 bg-gray-50 text-sm font-medium text-gray-600">
            <div>Item</div>
            <div>Price</div>
            <div>Qty</div>
            <div>Actions</div>
            <div>Unclaimed</div>
          </div>

          {/* Items */}
          <div className="divide-y">
            {items.map((item, index) => {
              const assignedQty = getAssignedQuantity(item.id);
              const unclaimedQty = (item.quantity || 1) - assignedQty;
              const isBeingSplit = splittingItem === item.id;

              return (
                <div key={item.id} className="p-4">
                  <div className="grid grid-cols-5 gap-2 items-center">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <div className="text-sm">R{item.price.toFixed(2)}</div>
                    <div className="text-sm">{item.quantity || 1}</div>
                    <div>
                      {!isBeingSplit ? (
                        <button
                          onClick={() => startSplit(item.id)}
                          className="text-blue-600 hover:text-blue-700 text-sm"
                          disabled={unclaimedQty === 0}
                        >
                          {unclaimedQty === 0 ? '✓' : 'Split'}
                        </button>
                      ) : null}
                    </div>
                    <div className="text-sm text-red-600">
                      {unclaimedQty > 0 ? unclaimedQty : ''}
                    </div>
                  </div>

                  {/* Split Interface */}
                  {isBeingSplit && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <label className="text-sm font-medium">Quantity:</label>
                          <select
                            value={splitQuantity}
                            onChange={(e) => setSplitQuantity(Number(e.target.value))}
                            className="border rounded px-2 py-1 text-sm"
                          >
                            {Array.from({ length: unclaimedQty }, (_, i) => (
                              <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium block mb-2">Assign to:</label>
                        <div className="flex flex-wrap gap-2">
                          {people.map((person) => (
                            <button
                              key={person.id}
                              onClick={() => {
                                const newSelected = new Set(selectedPeople);
                                if (newSelected.has(person.id)) {
                                  newSelected.delete(person.id);
                                } else {
                                  newSelected.add(person.id);
                                }
                                setSelectedPeople(newSelected);
                              }}
                              className={`px-3 py-1 rounded text-sm transition-colors ${
                                selectedPeople.has(person.id)
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              {person.name}
                            </button>
                          ))}
                        </div>
                      </div>

                      {selectedPeople.size > 0 && (
                        <div className="text-sm text-gray-600">
                          Each person pays: R{((item.price * splitQuantity) / selectedPeople.size).toFixed(2)}
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <button
                          onClick={confirmSplit}
                          disabled={selectedPeople.size === 0}
                          className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={cancelSplit}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Individual Totals */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Individual Totals</h3>
          
          <div className="grid grid-cols-4 gap-2 text-sm font-bold text-gray-800 mb-2">
            <div>Person</div>
            <div>Subtotal</div>
            <div>Tip</div>
            <div>Total</div>
          </div>

          {people.map((person) => (
            <div key={person.id} className="grid grid-cols-4 gap-2 py-2 border-t text-sm">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getPersonColor(person.id) }}
                />
                <span className="font-bold text-gray-800">{person.name}</span>
              </div>
              <div className="font-semibold text-gray-800">R{getPersonSubtotal(person.id).toFixed(2)}</div>
              <div className="font-semibold text-gray-800">R{getPersonTip(person.id).toFixed(2)}</div>
              <div className="font-bold text-gray-900">R{getPersonTotal(person.id).toFixed(2)}</div>
            </div>
          ))}
        </div>

        {/* Group Total */}
        <div className="bg-gray-800 text-white rounded-lg p-4">
          <div className="flex justify-between items-center text-sm mb-2">
            <span>Subtotal:</span>
            <span>R{totalAssignedAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-sm mb-2">
            <span>Tip:</span>
            <span>R{people.reduce((sum, p) => sum + getPersonTip(p.id), 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-lg font-bold border-t border-gray-600 pt-2">
            <span>Total:</span>
            <span>R{people.reduce((sum, p) => sum + getPersonTotal(p.id), 0).toFixed(2)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={onBack}
            className="flex-1 py-3 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-300"
          >
            Back
          </button>
          <button
            onClick={() => onNext(assignments, people)}
            className="flex-1 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Split and Continue
          </button>
        </div>

      </div>
    </div>
  );
}