import { useState } from "react";
import { AiOutlineClose, AiOutlineEdit, AiOutlineDelete, AiOutlinePlus } from "react-icons/ai";

export default function DeliveryModal() {
    const [addresses, setAddresses] = useState([
        "24 Green Valley Road, Koramangala, Bengaluru, Karnataka 560034, India",
        "24 Green Valley Road, Koramangala, Bengaluru, Karnataka 560034, India",
    ]);

    const handleAdd = () => {
        const newAddress = prompt("Enter new address:");
        if (newAddress) setAddresses([...addresses, newAddress]);
    };

    const handleEdit = (index) => {
        const updated = prompt("Edit address:", addresses[index]);
        if (updated) {
            const newAddresses = [...addresses];
            newAddresses[index] = updated;
            setAddresses(newAddresses);
        }
    };

    const handleDelete = (index) => {
        if (confirm("Are you sure you want to delete this address?")) {
            const newAddresses = addresses.filter((_, i) => i !== index);
            setAddresses(newAddresses);
        }
    };

    return (
        <div className="inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-96 p-6 relative">
                {/* Close button */}
                <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
                    <AiOutlineClose size={20} />
                </button>

                <h2 className="text-2xl font-semibold mb-4">Delivery Details</h2>
                <h3 className="text-lg font-medium text-black mb-2">Saved Address</h3>

                <div className="flex flex-col gap-3 max-h-60 overflow-y-auto">
                    {addresses.map((address, index) => (
                        <div key={index} className="flex justify-between items-start rounded">
                            <p className="text-sm text-gray-700">{address}</p>
                            <div className="flex gap-2 mt-1">
                                <button onClick={() => handleEdit(index)} className="text-gray-500 hover:text-blue-500">
                                    <AiOutlineEdit size={18} />
                                </button>
                                <button onClick={() => handleDelete(index)} className="text-gray-500 hover:text-red-500">
                                    <AiOutlineDelete size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 mt-4 px-4 py-2 border text-lg rounded text-gray-700 hover:bg-gray-100"
                >
                    <AiOutlinePlus /> Add New
                </button>
            </div>
        </div>
    );
}
