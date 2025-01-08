import { useState, useEffect } from 'react';
import { getOrders, getOrderStatuses, updateOrderStatus } from '../api';

const OrderList = ({ token }) => {
    const [orders, setOrders] = useState([]);
    const [statuses, setStatuses] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const fetchedOrders = await getOrders(token);
                const fetchedStatuses = await getOrderStatuses(token);
                const filteredOrders = fetchedOrders.filter(order =>
                    ['UNCONFIRMED', 'CONFIRMED', 'CANCELLED'].includes(order.status.name)
                );
                setOrders(filteredOrders);
                setStatuses(fetchedStatuses);
            } catch (err) {
                console.error('Błąd przy pobieraniu zamówień:', err);
            }
        };

        fetchOrders();
    }, [token]);

    const handleStatusChange = async (orderId, newStatusId) => {
        try {
            const body = {
                status: newStatusId,
            }
            const updatedOrder = await updateOrderStatus(orderId, body);
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === orderId ? { ...order, status: updatedOrder.status } : order
                )
            );
        } catch (err) {
            console.error('Błąd przy zmianie statusu zamówienia:', err);
            alert('Nie udało się zmienić statusu zamówienia.');
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-3">Lista Zamówień</h2>
            <table className="table table-striped table-bordered table-hover">
                <thead className="table-dark">
                <tr>
                    <th>ID Zamówienia</th>
                    <th>Data Potwierdzenia</th>
                    <th>Status</th>
                    <th>Klient</th>
                    <th>Email</th>
                    <th>Telefon</th>
                    <th>Produkty</th>
                    <th>Opinie</th>
                    <th>Akcja</th>
                </tr>
                </thead>
                <tbody>
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <tr key={order._id}>
                            <td>{order._id}</td>
                            <td>{order.confirmedDate || 'Brak'}</td>
                            <td>{order.status.name}</td>
                            <td>{order.username}</td>
                            <td>{order.email}</td>
                            <td>{order.phone}</td>
                            <td>
                                <ul>
                                    {order.items.map((item, index) => (
                                        <li key={index}>
                                            {item.product.name} (x{item.quantity})
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td>
                                {order.opinions && order.opinions.length > 0 ? (
                                    <ul>
                                        {order.opinions.map((opinion, index) => (
                                            <li key={index}>
                                                Ocena: {opinion.rating}, Komentarz: {opinion.comment}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    'Brak opinii'
                                )}
                            </td>
                            <td>
                                <select
                                    className="form-select"
                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                    defaultValue={order.status._id}
                                >
                                    {statuses.map((status) => (
                                        <option key={status._id} value={status._id}>
                                            {status.name}
                                        </option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="8">Brak zamówień</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default OrderList;
